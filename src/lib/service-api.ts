import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { makeHashtag, makeHostToken, makeServiceCode, normalizeCode } from "@/lib/codes";
import { engineStatus, transcribeWithGemini } from "@/lib/transcribe.server";
import { translateAfrikaans, type TranslateEngine } from "@/lib/translate.server";
import { filterFoulLanguage } from "@/lib/profanity";

export type PublicService = {
  id: string;
  code: string;
  hashtag: string;
  title: string;
  status: "live" | "ended";
  listenerCount: number;
  startedAt: string;
};

export type TranscriptLine = {
  id: string;
  seq: number;
  sourceText: string;
  translatedText: string;
  wasFiltered: boolean;
  createdAt: string;
};

type ServiceRow = {
  id: string;
  code: string;
  hashtag: string;
  title: string;
  host_token: string;
  status: string;
  listener_count: number;
  started_at: string;
};

type LineRow = {
  id: string;
  seq: number;
  source_text: string;
  translated_text: string;
  was_filtered: boolean | number;
  created_at: string;
};

function toPublic(row: ServiceRow): PublicService {
  return {
    id: row.id,
    code: row.code,
    hashtag: row.hashtag,
    title: row.title,
    status: row.status === "ended" ? "ended" : "live",
    listenerCount: Number(row.listener_count) || 0,
    startedAt: String(row.started_at),
  };
}

function toLine(row: LineRow): TranscriptLine {
  return {
    id: row.id,
    seq: Number(row.seq),
    sourceText: row.source_text,
    translatedText: row.translated_text,
    wasFiltered: Boolean(row.was_filtered),
    createdAt: String(row.created_at),
  };
}

export const getEngines = createServerFn({ method: "GET" }).handler(async () => {
  return engineStatus();
});

export const createService = createServerFn({ method: "POST" })
  .validator((input: { title?: string }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();
    const id = crypto.randomUUID();
    const code = makeServiceCode();
    const hashtag = makeHashtag(code);
    const hostToken = makeHostToken();
    const title = (data.title ?? "Sabbath service").slice(0, 80) || "Sabbath service";

    await sql`
      insert into services (id, code, hashtag, title, host_token, status)
      values (${id}, ${code}, ${hashtag}, ${title}, ${hostToken}, ${"live"})
    `;

    return { service: toPublic({
      id,
      code,
      hashtag,
      title,
      host_token: hostToken,
      status: "live",
      listener_count: 0,
      started_at: new Date().toISOString(),
    }), hostToken };
  });

export const getServiceByCode = createServerFn({ method: "GET" })
  .validator((input: { code: string; asListener?: boolean }) => input)
  .handler(async ({ data }) => {
    const code = normalizeCode(data.code);
    if (code.length < 4) return { service: null, lines: [] as TranscriptLine[] };
    const sql = await getSql();
    const rows = await sql<ServiceRow>`
      select id, code, hashtag, title, host_token, status, listener_count, started_at
      from services where code = ${code} limit 1
    `;
    const row = rows[0];
    if (!row) return { service: null, lines: [] as TranscriptLine[] };

    if (data.asListener && row.status === "live") {
      await sql`
        update services
        set listener_count = listener_count + 1
        where id = ${row.id}
      `;
      row.listener_count = Number(row.listener_count) + 1;
    }

    const lines = await sql<LineRow>`
      select id, seq, source_text, translated_text, was_filtered, created_at
      from transcript_lines
      where service_id = ${row.id}
      order by seq asc
    `;

    return { service: toPublic(row), lines: lines.map(toLine) };
  });

export const pollService = createServerFn({ method: "GET" })
  .validator((input: { code: string; sinceSeq: number }) => input)
  .handler(async ({ data }) => {
    const code = normalizeCode(data.code);
    const sql = await getSql();
    const rows = await sql<ServiceRow>`
      select id, code, hashtag, title, host_token, status, listener_count, started_at
      from services where code = ${code} limit 1
    `;
    const row = rows[0];
    if (!row) return { service: null, lines: [] as TranscriptLine[] };

    const lines = await sql<LineRow>`
      select id, seq, source_text, translated_text, was_filtered, created_at
      from transcript_lines
      where service_id = ${row.id} and seq > ${data.sinceSeq}
      order by seq asc
    `;

    return { service: toPublic(row), lines: lines.map(toLine) };
  });

export const previewUtterance = createServerFn({ method: "POST" })
  .validator((input: { code: string; hostToken: string; text: string }) => input)
  .handler(async ({ data }) => {
    const code = normalizeCode(data.code);
    const sql = await getSql();
    const rows = await sql<ServiceRow>`
      select id, host_token, status from services where code = ${code} limit 1
    `;
    const row = rows[0];
    if (!row) return { ok: false as const, error: "Service not found." };
    if (row.host_token !== data.hostToken) {
      return { ok: false as const, error: "Host credentials do not match." };
    }
    const raw = data.text.trim();
    if (raw.length < 2) return { ok: false as const, error: "Nothing to preview." };
    const translated = await translateAfrikaans(raw);
    return { ok: true as const, ...translated };
  });

export const publishUtterance = createServerFn({ method: "POST" })
  .validator((input: { code: string; hostToken: string; text: string; english?: string }) => input)
  .handler(async ({ data }) => {
    const code = normalizeCode(data.code);
    const sql = await getSql();
    const rows = await sql<ServiceRow>`
      select id, code, hashtag, title, host_token, status, listener_count, started_at
      from services where code = ${code} limit 1
    `;
    const row = rows[0];
    if (!row) return { ok: false as const, error: "Service not found." };
    if (row.host_token !== data.hostToken) {
      return { ok: false as const, error: "Host credentials do not match." };
    }
    if (row.status !== "live") return { ok: false as const, error: "This service has ended." };

    const raw = data.text.trim();
    if (raw.length < 2) return { ok: false as const, error: "Nothing to publish." };

    const foul = filterFoulLanguage(raw);
    let source = foul.text;
    let english = data.english?.trim() ?? "";
    let filtered = foul.filtered;
    let engine: TranslateEngine | "provided" = english ? "provided" : "passthrough";

    if (!english) {
      const translated = await translateAfrikaans(source);
      source = translated.source || source;
      english = translated.english;
      filtered = filtered || translated.filtered;
      engine = translated.engine;
    } else {
      english = filterFoulLanguage(english).text;
    }

    const seqRows = await sql<{ max: number | null }>`
      select max(seq) as max from transcript_lines where service_id = ${row.id}
    `;
    const nextSeq = (Number(seqRows[0]?.max) || 0) + 1;

    const last = await sql<LineRow>`
      select id, seq, source_text, translated_text, was_filtered, created_at
      from transcript_lines
      where service_id = ${row.id}
      order by seq desc
      limit 1
    `;
    if (last[0] && last[0].source_text === source) {
      return { ok: true as const, line: toLine(last[0]), engine, duplicate: true };
    }

    const id = crypto.randomUUID();
    await sql`
      insert into transcript_lines
        (id, service_id, seq, source_text, translated_text, was_filtered)
      values
        (${id}, ${row.id}, ${nextSeq}, ${source}, ${english}, ${filtered})
    `;
    await sql`
      update services set last_activity_at = now() where id = ${row.id}
    `;

    return {
      ok: true as const,
      duplicate: false,
      engine,
      line: {
        id,
        seq: nextSeq,
        sourceText: source,
        translatedText: english,
        wasFiltered: filtered,
        createdAt: new Date().toISOString(),
      } satisfies TranscriptLine,
    };
  });

export const transcribeChunk = createServerFn({ method: "POST" })
  .validator((input: { audioBase64: string; mimeType: string }) => input)
  .handler(async ({ data }) => {
    if (!data.audioBase64 || data.audioBase64.length > 1_800_000) {
      return { ok: false as const, error: "Audio chunk is too large." };
    }
    return transcribeWithGemini(data);
  });

export const endService = createServerFn({ method: "POST" })
  .validator((input: { code: string; hostToken: string }) => input)
  .handler(async ({ data }) => {
    const code = normalizeCode(data.code);
    const sql = await getSql();
    const rows = await sql<{ host_token: string }>`
      select host_token from services where code = ${code} limit 1
    `;
    if (!rows[0] || rows[0].host_token !== data.hostToken) {
      return { ok: false as const, error: "Not allowed." };
    }
    await sql`
      update services set status = ${"ended"}, ended_at = now() where code = ${code}
    `;
    return { ok: true as const };
  });
