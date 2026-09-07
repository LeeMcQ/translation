import { cn } from "@/lib/utils";
import type { TranscriptLine } from "@/lib/service-api";

const SCRIPTURE_MARK = "we do not invent Scripture";

export function CaptionBoard({
  lines,
  pendingSource,
  pendingEnglish,
  scale = 1,
  emptyLabel = "Waiting for the pulpit.",
}: {
  lines: TranscriptLine[];
  pendingSource?: string;
  pendingEnglish?: string;
  scale?: number;
  emptyLabel?: string;
}) {
  const latest = lines[lines.length - 1];
  const previous = lines.slice(Math.max(0, lines.length - 6), -1);

  return (
    <div
      className="flex min-h-0 flex-1 flex-col justify-end gap-8"
      style={{ fontSize: `${scale}rem` }}
    >
      {previous.map((line) => (
        <CaptionBlock
          key={line.id}
          source={line.sourceText}
          english={line.translatedText}
          dim
        />
      ))}
      {latest ? (
        <CaptionBlock
          key={latest.id}
          source={latest.sourceText}
          english={latest.translatedText}
        />
      ) : null}
      {pendingSource ? (
        <CaptionBlock source={pendingSource} english={pendingEnglish ?? ""} pending />
      ) : null}
      {!latest && !pendingSource ? (
        <p className="font-display text-[1.35em] leading-snug text-subtle">{emptyLabel}</p>
      ) : null}
    </div>
  );
}

function splitEnglish(english: string): { caption: string; banner: string | null } {
  if (!english.includes(SCRIPTURE_MARK)) return { caption: english, banner: null };
  const idx = english.lastIndexOf("Open ");
  if (idx > 0) {
    return {
      caption: english.slice(0, idx).replace(/\s*·\s*$/, "").trim(),
      banner: english.slice(idx).trim(),
    };
  }
  return { caption: "", banner: english };
}

function CaptionBlock({
  source,
  english,
  dim,
  pending,
}: {
  source: string;
  english: string;
  dim?: boolean;
  pending?: boolean;
}) {
  const { caption, banner } = splitEnglish(english);
  const same = caption.trim().toLowerCase() === source.trim().toLowerCase();
  const showEnglish = Boolean(caption) && !same;
  const afrikaansIsLead = !showEnglish;

  return (
    <article
      className={cn(
        "woord-rise max-w-3xl",
        dim && "opacity-55",
        pending && "opacity-70",
      )}
    >
      {afrikaansIsLead ? (
        <p className="font-display text-[1.35em] leading-[1.25] tracking-tight text-fg">
          {source}
        </p>
      ) : (
        <p className="text-[0.72em] leading-relaxed text-muted">{source}</p>
      )}
      {showEnglish ? (
        <p className="mt-2 font-display text-[1.35em] leading-[1.25] tracking-tight text-fg">
          {caption}
        </p>
      ) : pending ? (
        <p className="woord-shimmer mt-2 font-display text-[1.05em] leading-snug">
          Translating — Afrikaans stays on screen
        </p>
      ) : !banner ? (
        <p className="mt-2 text-[0.72em] leading-relaxed text-subtle">
          Afrikaans is the source of truth
        </p>
      ) : null}
      {banner ? (
        <p className="mt-3 max-w-xl text-[0.78em] leading-relaxed text-muted italic">
          {banner}
        </p>
      ) : null}
    </article>
  );
}
