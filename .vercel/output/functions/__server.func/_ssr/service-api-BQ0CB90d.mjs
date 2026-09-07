import { a as isScriptureReading, c as overlayGlossary, i as glossaryForPrompt, l as repairSpeech, o as lexiconTranslate, r as customVocabulary, s as lookupLiturgy, u as scriptureNote } from "./glossary-DX6QCLIT.mjs";
import { a as normalizeCode, i as makeServiceCode, n as makeHashtag, r as makeHostToken } from "./codes-DSoe9QJH.mjs";
import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/service-api-BQ0CB90d.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var _0002_services_default = "create table if not exists services (\n  id text primary key,\n  code text not null unique,\n  hashtag text not null,\n  title text not null default 'Sabbath service',\n  host_token text not null,\n  status text not null default 'live',\n  listener_count integer not null default 0,\n  partial_source text,\n  partial_translated text,\n  started_at timestamptz not null default now(),\n  ended_at timestamptz,\n  last_activity_at timestamptz not null default now()\n);\n\ncreate unique index if not exists services_code_idx on services (code);\n\ncreate table if not exists transcript_lines (\n  id text primary key,\n  service_id text not null references services(id) on delete cascade,\n  seq integer not null,\n  source_text text not null,\n  translated_text text not null,\n  was_filtered boolean not null default false,\n  created_at timestamptz not null default now()\n);\n\ncreate index if not exists transcript_lines_service_seq_idx\n  on transcript_lines (service_id, seq);\n";
/**
* Migration bookkeeping shared by the two appliers — `scripts/migrate.mjs`
* (deploy, `readdir`) and `src/lib/db.ts` (PGLite preview, `import.meta.glob`).
*
* Applied files are keyed by BASENAME, so the same file applies once no matter
* which directory it is globbed from. That is what makes the auth schema safe to
* copy from `migrations/auth/` into `migrations/` when an app turns sign-in on:
* a database that already has `0001_auth.sql` will not re-run it.
*
* Neither applier descends into subdirectories, so `migrations/auth/*.sql` is
* out of scope for both until it is copied up.
*/
/**
* The `_migrations` key for a migration path (or bare filename).
* @param {string} path
* @returns {string}
*/
function migrationName(path) {
	return path.split("/").pop() ?? path;
}
/**
* @param {string} path
* @returns {boolean}
*/
function isMigrationFile(path) {
	return path.endsWith(".sql");
}
/**
* Migrations in `paths` that are not yet in `applied`, in apply order.
* Non-`.sql` entries (a `readdir` also yields `migrations/auth/`) are dropped.
* @param {Iterable<string>} paths
* @param {Iterable<string>} applied
* @returns {Array<{ name: string, path: string }>}
*/
function pendingMigrations(paths, applied) {
	const done = new Set(applied);
	return [...paths].filter(isMigrationFile).map((path) => ({
		name: migrationName(path),
		path
	})).sort((a, b) => a.name.localeCompare(b.name)).filter(({ name }) => !done.has(name));
}
var rawDatabaseUrl = typeof process !== "undefined" ? process.env.DATABASE_URL : void 0;
var databaseUrl = rawDatabaseUrl && rawDatabaseUrl.trim() ? rawDatabaseUrl : void 0;
/**
* Active backend: real **Neon** when `DATABASE_URL` is set (deployed / configured
* sandbox), otherwise a local embedded **PGLite** (Postgres compiled to WASM) so
* the app has a working database even with nothing configured — the live preview
* included. Swap in Neon later by just setting `DATABASE_URL`; no code changes.
*/
var dbSource = databaseUrl ? "neon" : "pglite";
/**
* Init state lives on globalThis as promises: dev HMR creates new instances of
* this module, and two instances racing module-level state would open a second
* pool or run two concurrent PGLite migration passes (whose duplicate
* `_migrations` insert rejects — and would get memoized, poisoning every later
* `getSql()`). A failed init clears its slot so the next call retries.
*/
var globalRef = globalThis;
/**
* Result-type parity: Postgres sends every value as text plus a type OID — the
* JS value is the DRIVER's parsing choice, and pg and PGLite disagree (pg:
* int8 -> string, date -> local-midnight Date; PGLite: int8 -> BigInt, which
* JSON.stringify rejects, date -> UTC Date). Normalize both so preview and
* production return identical, JSON-safe shapes:
*   int8/bigint (incl. count(*)) -> number (past 2^53 loses precision — cast
*                                   `::text` if you ever need huge integers)
*   date                         -> 'YYYY-MM-DD' string
*   interval                     -> Postgres interval text
* numeric already comes back as a string on both (arbitrary precision).
*/
var OID_INT8 = 20;
var OID_DATE = 1082;
var OID_INTERVAL = 1186;
var identity = (v) => v;
/** Wrap a query runner in the tagged-template + `.query()` `Sql` surface. */
function toSql(run) {
	const sql = (async (strings, ...values) => {
		let text = strings[0];
		for (let i = 0; i < values.length; i += 1) text += `$${i + 1}${strings[i + 1]}`;
		return run(text, values);
	});
	sql.query = (text, params = []) => run(text, params);
	return sql;
}
function createNeonSql() {
	globalRef.__pgSqlPromise__ ??= (async () => {
		const { Pool, types } = await import("../_libs/pg.mjs").then((n) => n.t);
		types.setTypeParser(OID_INT8, Number);
		types.setTypeParser(OID_DATE, identity);
		types.setTypeParser(OID_INTERVAL, identity);
		const pool = new Pool({ connectionString: databaseUrl });
		return toSql(async (text, params) => {
			return (await pool.query(text, params)).rows;
		});
	})().catch((err) => {
		globalRef.__pgSqlPromise__ = void 0;
		throw err;
	});
	return globalRef.__pgSqlPromise__;
}
async function createPgliteSql() {
	globalRef.__pgliteInstance__ ??= (async () => {
		const { PGlite } = await import("../_libs/electric-sql__pglite.mjs").then((n) => n.t);
		const pg = new PGlite({ parsers: {
			[OID_INT8]: Number,
			[OID_DATE]: identity,
			[OID_INTERVAL]: identity
		} });
		await pg.waitReady;
		await pg.exec("create table if not exists _migrations (name text primary key, applied_at timestamptz not null default now())");
		return pg;
	})().catch((err) => {
		globalRef.__pgliteInstance__ = void 0;
		throw err;
	});
	const pg = await globalRef.__pgliteInstance__;
	const migrate = async () => {
		const migrations = /* #__PURE__ */ Object.assign({ "/migrations/0002_services.sql": _0002_services_default });
		const done = (await pg.query("select name from _migrations")).rows.map((r) => r.name);
		for (const { name, path } of pendingMigrations(Object.keys(migrations), done)) await pg.transaction(async (tx) => {
			await tx.exec(migrations[path]);
			await tx.query("insert into _migrations (name) values ($1)", [name]);
		});
	};
	const pass = (globalRef.__pgliteMigrateChain__ ?? Promise.resolve()).catch(() => void 0).then(migrate);
	globalRef.__pgliteMigrateChain__ = pass;
	await pass;
	return toSql(async (text, params) => {
		return (await pg.query(text, params)).rows;
	});
}
var sqlPromise = null;
async function createSql() {
	if (typeof window !== "undefined") throw new Error("@/lib/db is server-only — call getSql() from a createServerFn handler or a server route loader, never from client code.");
	return dbSource === "neon" ? createNeonSql() : createPgliteSql();
}
/**
* Get the shared, **server-only** SQL client. Neon when `DATABASE_URL` is set,
* otherwise the local PGLite fallback. Memoized — safe to call per request.
*
* Schema comes from `migrations/*.sql`, auto-applied before the first query on
* both backends — define tables there, never inline in server functions.
*/
function getSql() {
	sqlPromise ??= createSql().catch((err) => {
		sqlPromise = null;
		throw err;
	});
	return sqlPromise;
}
/**
* Finish DB bootstrap before the server handles traffic.
*
* - **PGLite** (preview / no `DATABASE_URL`): open the in-memory DB and apply
*   `migrations/*.sql`. Idempotent — concurrent callers share one promise.
* - **Neon**: no-op (pool is created lazily on first query).
*
* Vite `configureServer` awaits this at dev startup; production imports of this
* module kick it off immediately (see bottom of file).
*/
function ensureDbReady() {
	if (dbSource !== "pglite") return Promise.resolve();
	return getSql().then(() => void 0);
}
var globalBoot = globalThis;
if (typeof window === "undefined" && dbSource === "pglite") globalBoot.__pgBootstrapPromise__ ??= ensureDbReady().catch((err) => {
	globalBoot.__pgBootstrapPromise__ = void 0;
	console.error("[db] PGLite bootstrap failed:", err);
	throw err;
});
/**
* Whole-word filter for pulpit captions. Theological English (hell, damn as
* doctrine) is kept. Sexual / abusive / racial language in English and
* Afrikaans is not.
*/
var BLOCKED = new Set([
	"fuck",
	"fucking",
	"fucker",
	"fucked",
	"shit",
	"shitty",
	"bullshit",
	"asshole",
	"bastard",
	"bitch",
	"cunt",
	"dick",
	"piss",
	"pussy",
	"slut",
	"whore",
	"cock",
	"wank",
	"wanker",
	"faggot",
	"nigger",
	"nigga",
	"retard",
	"raped",
	"rape",
	"fok",
	"fokken",
	"fokkit",
	"fokkol",
	"fokking",
	"fokker",
	"moer",
	"moerse",
	"poes",
	"doos",
	"naai",
	"naaiers",
	"hoer",
	"kak",
	"kakkies",
	"bliksems",
	"bliksem",
	"donderse",
	"stront",
	"piel",
	"holnaaier",
	"verkagting",
	"kaffer",
	"kaffir",
	"hotnot",
	"koelie",
	"moffie",
	"voertsek"
].map((w) => w.toLowerCase()));
var WORD_RE = /[\p{L}\p{N}’']+/gu;
function filterFoulLanguage(text) {
	if (!text) return {
		text,
		filtered: false
	};
	let filtered = false;
	return {
		text: text.replace(WORD_RE, (word) => {
			const key = word.toLowerCase().replace(/[’']/g, "");
			if (BLOCKED.has(key)) {
				filtered = true;
				return "—";
			}
			return word;
		}),
		filtered
	};
}
function engineStatus() {
	return {
		gemini: Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY),
		grokTranslate: Boolean(process.env.XAI_API_KEY),
		localBackup: true
	};
}
/**
* Gemini 3.5 Transcribe (unary) with the Adventist custom vocabulary.
* Used when a Gemini key is present; the host otherwise relies on on-device
* Afrikaans speech recognition and sends text here only for translation.
*/
async function transcribeWithGemini(params) {
	const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "Gemini Transcribe is not configured."
	};
	const vocab = customVocabulary();
	const mime = params.mimeType || "audio/webm";
	const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-transcribe:generateContent?key=${apiKey}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			contents: [{ parts: [{ inline_data: {
				mime_type: mime,
				data: params.audioBase64
			} }] }],
			generationConfig: { transcription_config: {
				language_codes: ["af-ZA"],
				custom_vocabulary: vocab,
				mode: { type: "smart" }
			} }
		})
	});
	if (!res.ok) {
		const retry = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
			method: "POST",
			headers: {
				"x-goog-api-key": apiKey,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				model: "gemini-3.5-transcribe",
				input: [{
					type: "audio",
					inline_data: {
						mime_type: mime,
						data: params.audioBase64
					}
				}],
				generation_config: { transcription_config: {
					language_codes: ["af-ZA"],
					custom_vocabulary: vocab,
					mode: { type: "smart" }
				} }
			})
		});
		if (!retry.ok) return {
			ok: false,
			error: `Gemini Transcribe error ${res.status}`
		};
		const body = await retry.json();
		return {
			ok: true,
			text: filterFoulLanguage(body.output_text || body.steps?.[0]?.content?.[0]?.text || "").text
		};
	}
	return {
		ok: true,
		text: filterFoulLanguage((await res.json()).candidates?.[0]?.content?.parts?.[0]?.text ?? "").text
	};
}
var cache = /* @__PURE__ */ new Map();
var MAX_CACHE = 200;
function cacheGet(key) {
	return cache.get(key);
}
function cacheSet(key, value) {
	if (cache.size >= MAX_CACHE) {
		const first = cache.keys().next().value;
		if (first) cache.delete(first);
	}
	cache.set(key, value);
}
function polishLocal(source) {
	return lexiconTranslate(overlayGlossary(source)).replace(/\s+/g, " ").trim();
}
function polishMachine(english) {
	return overlayGlossary(english).replace(/\s+/g, " ").trim();
}
async function mymemory(q) {
	try {
		const url = "https://api.mymemory.translated.net/get?q=" + encodeURIComponent(q.slice(0, 450)) + "&langpair=af|en";
		const res = await fetch(url, { signal: AbortSignal.timeout(2500) });
		if (!res.ok) return null;
		const t = (await res.json()).responseData?.translatedText?.trim() ?? "";
		if (!t || t.toLowerCase() === q.toLowerCase()) return null;
		return filterFoulLanguage(t).text;
	} catch {
		return null;
	}
}
async function grokTranslate(source) {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return null;
	const glossary = glossaryForPrompt(source);
	try {
		const res = await fetch("https://api.x.ai/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`
			},
			signal: AbortSignal.timeout(8e3),
			body: JSON.stringify({
				model: "grok-4.5",
				temperature: .15,
				max_tokens: 280,
				response_format: { type: "json_object" },
				messages: [{
					role: "system",
					content: "You are a live interpreter for a Seventh-day Adventist pulpit in South Africa. You receive imperfect Afrikaans speech-to-text, often mixed with Kaaps, Cape Afrikaans, and South African English (lekker, eish, ja-nee, mos, nè, shame as sympathy, just now = later, now now = soon). Silently repair obvious STT errors using church context. Translate into clear, reverent spoken English. Output JSON only: {\"afrikaans\":\"...\",\"english\":\"...\"}. No commentary. Never output profanity; replace with an em dash. Apply the glossary spellings exactly. Never machine-translate quoted Scripture; if the line is a Bible reading, set english to a short instruction to open that reference in a printed Bible. Always fill english. Never return an empty translation."
				}, {
					role: "user",
					content: `GLOSSARY\n${glossary}\n\nSOURCE\n${source}`
				}]
			})
		});
		if (!res.ok) return null;
		const content = (await res.json()).choices?.[0]?.message?.content ?? "";
		try {
			const parsed = JSON.parse(content);
			if (parsed.english?.trim()) return filterFoulLanguage(parsed.english).text;
		} catch {
			const plain = filterFoulLanguage(content.replace(/^["']|["']$/g, "")).text;
			if (plain) return plain;
		}
		return null;
	} catch {
		return null;
	}
}
async function translateAfrikaans(raw) {
	const foul = filterFoulLanguage(raw.trim());
	const source = repairSpeech(foul.text);
	if (!source) return {
		source: "",
		english: "",
		filtered: foul.filtered,
		engine: "passthrough",
		scripture: null
	};
	const cached = cacheGet(source);
	if (cached) return {
		...cached,
		filtered: cached.filtered || foul.filtered
	};
	const scripture = scriptureNote(source);
	const liturgical = lookupLiturgy(source);
	if (liturgical) {
		const result = {
			source,
			english: liturgical,
			filtered: foul.filtered,
			engine: "liturgy",
			scripture
		};
		cacheSet(source, result);
		return result;
	}
	if (isScriptureReading(source) && scripture) {
		const result = {
			source,
			english: scripture,
			filtered: foul.filtered,
			engine: "scripture",
			scripture
		};
		cacheSet(source, result);
		return result;
	}
	let english = "";
	let engine = "lexicon";
	const fromGrok = await grokTranslate(source);
	if (fromGrok) {
		english = polishMachine(fromGrok);
		engine = "grok";
	}
	if (!english) {
		const fromMemory = await mymemory(source);
		if (fromMemory) {
			english = polishMachine(fromMemory);
			engine = "mymemory";
		}
	}
	if (!english) {
		english = polishLocal(source);
		engine = "lexicon";
	}
	if (scripture && !english.includes("we do not invent Scripture")) english = `${english} · ${scripture}`;
	const result = {
		source,
		english,
		filtered: foul.filtered,
		engine,
		scripture
	};
	cacheSet(source, result);
	return result;
}
function toPublic(row) {
	return {
		id: row.id,
		code: row.code,
		hashtag: row.hashtag,
		title: row.title,
		status: row.status === "ended" ? "ended" : "live",
		listenerCount: Number(row.listener_count) || 0,
		startedAt: String(row.started_at)
	};
}
function toLine(row) {
	return {
		id: row.id,
		seq: Number(row.seq),
		sourceText: row.source_text,
		translatedText: row.translated_text,
		wasFiltered: Boolean(row.was_filtered),
		createdAt: String(row.created_at)
	};
}
var getEngines_createServerFn_handler = createServerRpc({
	id: "45fb81463d7a7ce2ac946072603cb6299cdc536daf97d43262cd0f1f25834534",
	name: "getEngines",
	filename: "src/lib/service-api.ts"
}, (opts) => getEngines.__executeServer(opts));
var getEngines = createServerFn({ method: "GET" }).handler(getEngines_createServerFn_handler, async () => {
	return engineStatus();
});
var createService_createServerFn_handler = createServerRpc({
	id: "f307d52ead2ddb6d4fe4d3edcde98e066c2f0124653c097e891dcaa4fcf832b9",
	name: "createService",
	filename: "src/lib/service-api.ts"
}, (opts) => createService.__executeServer(opts));
var createService = createServerFn({ method: "POST" }).validator((input) => input).handler(createService_createServerFn_handler, async ({ data }) => {
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
	return {
		service: toPublic({
			id,
			code,
			hashtag,
			title,
			host_token: hostToken,
			status: "live",
			listener_count: 0,
			started_at: (/* @__PURE__ */ new Date()).toISOString()
		}),
		hostToken
	};
});
var getServiceByCode_createServerFn_handler = createServerRpc({
	id: "c40144a76a374c7f971cc7fcf83d745d21f8e5a98e1aa020842b2faa8135e4a9",
	name: "getServiceByCode",
	filename: "src/lib/service-api.ts"
}, (opts) => getServiceByCode.__executeServer(opts));
var getServiceByCode = createServerFn({ method: "GET" }).validator((input) => input).handler(getServiceByCode_createServerFn_handler, async ({ data }) => {
	const code = normalizeCode(data.code);
	if (code.length < 4) return {
		service: null,
		lines: []
	};
	const sql = await getSql();
	const row = (await sql`
      select id, code, hashtag, title, host_token, status, listener_count, started_at
      from services where code = ${code} limit 1
    `)[0];
	if (!row) return {
		service: null,
		lines: []
	};
	if (data.asListener && row.status === "live") {
		await sql`
        update services
        set listener_count = listener_count + 1
        where id = ${row.id}
      `;
		row.listener_count = Number(row.listener_count) + 1;
	}
	const lines = await sql`
      select id, seq, source_text, translated_text, was_filtered, created_at
      from transcript_lines
      where service_id = ${row.id}
      order by seq asc
    `;
	return {
		service: toPublic(row),
		lines: lines.map(toLine)
	};
});
var pollService_createServerFn_handler = createServerRpc({
	id: "8984124105db8cf049c10b586fb117902762df0186b756cbab4a59591fc74d75",
	name: "pollService",
	filename: "src/lib/service-api.ts"
}, (opts) => pollService.__executeServer(opts));
var pollService = createServerFn({ method: "GET" }).validator((input) => input).handler(pollService_createServerFn_handler, async ({ data }) => {
	const code = normalizeCode(data.code);
	const sql = await getSql();
	const row = (await sql`
      select id, code, hashtag, title, host_token, status, listener_count, started_at
      from services where code = ${code} limit 1
    `)[0];
	if (!row) return {
		service: null,
		lines: []
	};
	const lines = await sql`
      select id, seq, source_text, translated_text, was_filtered, created_at
      from transcript_lines
      where service_id = ${row.id} and seq > ${data.sinceSeq}
      order by seq asc
    `;
	return {
		service: toPublic(row),
		lines: lines.map(toLine)
	};
});
var previewUtterance_createServerFn_handler = createServerRpc({
	id: "4afd15f91fcec2384d39a373c817b67a4a8d8559e8261be9c5a5bf7b6a01b006",
	name: "previewUtterance",
	filename: "src/lib/service-api.ts"
}, (opts) => previewUtterance.__executeServer(opts));
var previewUtterance = createServerFn({ method: "POST" }).validator((input) => input).handler(previewUtterance_createServerFn_handler, async ({ data }) => {
	const code = normalizeCode(data.code);
	const row = (await (await getSql())`
      select id, host_token, status from services where code = ${code} limit 1
    `)[0];
	if (!row) return {
		ok: false,
		error: "Service not found."
	};
	if (row.host_token !== data.hostToken) return {
		ok: false,
		error: "Host credentials do not match."
	};
	const raw = data.text.trim();
	if (raw.length < 2) return {
		ok: false,
		error: "Nothing to preview."
	};
	return {
		ok: true,
		...await translateAfrikaans(raw)
	};
});
var publishUtterance_createServerFn_handler = createServerRpc({
	id: "6f61485a39277b846c83068dadc950c2ba7363f50ee1a239aac22c63121f0f87",
	name: "publishUtterance",
	filename: "src/lib/service-api.ts"
}, (opts) => publishUtterance.__executeServer(opts));
var publishUtterance = createServerFn({ method: "POST" }).validator((input) => input).handler(publishUtterance_createServerFn_handler, async ({ data }) => {
	const code = normalizeCode(data.code);
	const sql = await getSql();
	const row = (await sql`
      select id, code, hashtag, title, host_token, status, listener_count, started_at
      from services where code = ${code} limit 1
    `)[0];
	if (!row) return {
		ok: false,
		error: "Service not found."
	};
	if (row.host_token !== data.hostToken) return {
		ok: false,
		error: "Host credentials do not match."
	};
	if (row.status !== "live") return {
		ok: false,
		error: "This service has ended."
	};
	const raw = data.text.trim();
	if (raw.length < 2) return {
		ok: false,
		error: "Nothing to publish."
	};
	const foul = filterFoulLanguage(raw);
	let source = foul.text;
	let english = data.english?.trim() ?? "";
	let filtered = foul.filtered;
	let engine = english ? "provided" : "passthrough";
	if (!english) {
		const translated = await translateAfrikaans(source);
		source = translated.source || source;
		english = translated.english;
		filtered = filtered || translated.filtered;
		engine = translated.engine;
	} else english = filterFoulLanguage(english).text;
	const seqRows = await sql`
      select max(seq) as max from transcript_lines where service_id = ${row.id}
    `;
	const nextSeq = (Number(seqRows[0]?.max) || 0) + 1;
	const last = await sql`
      select id, seq, source_text, translated_text, was_filtered, created_at
      from transcript_lines
      where service_id = ${row.id}
      order by seq desc
      limit 1
    `;
	if (last[0] && last[0].source_text === source) return {
		ok: true,
		line: toLine(last[0]),
		engine,
		duplicate: true
	};
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
		ok: true,
		duplicate: false,
		engine,
		line: {
			id,
			seq: nextSeq,
			sourceText: source,
			translatedText: english,
			wasFiltered: filtered,
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		}
	};
});
var transcribeChunk_createServerFn_handler = createServerRpc({
	id: "351cecb55e3b200de4c3820121748c69d04687e3915e26c5720f51626e4db873",
	name: "transcribeChunk",
	filename: "src/lib/service-api.ts"
}, (opts) => transcribeChunk.__executeServer(opts));
var transcribeChunk = createServerFn({ method: "POST" }).validator((input) => input).handler(transcribeChunk_createServerFn_handler, async ({ data }) => {
	if (!data.audioBase64 || data.audioBase64.length > 18e5) return {
		ok: false,
		error: "Audio chunk is too large."
	};
	return transcribeWithGemini(data);
});
var endService_createServerFn_handler = createServerRpc({
	id: "fd715ce611ddfa7c1ad14af42d9e4cc4865d4c18888ccbd137c213cf307e0849",
	name: "endService",
	filename: "src/lib/service-api.ts"
}, (opts) => endService.__executeServer(opts));
var endService = createServerFn({ method: "POST" }).validator((input) => input).handler(endService_createServerFn_handler, async ({ data }) => {
	const code = normalizeCode(data.code);
	const sql = await getSql();
	const rows = await sql`
      select host_token from services where code = ${code} limit 1
    `;
	if (!rows[0] || rows[0].host_token !== data.hostToken) return {
		ok: false,
		error: "Not allowed."
	};
	await sql`
      update services set status = ${"ended"}, ended_at = now() where code = ${code}
    `;
	return { ok: true };
});
//#endregion
export { createService_createServerFn_handler, endService_createServerFn_handler, getEngines_createServerFn_handler, getServiceByCode_createServerFn_handler, pollService_createServerFn_handler, previewUtterance_createServerFn_handler, publishUtterance_createServerFn_handler, transcribeChunk_createServerFn_handler };
