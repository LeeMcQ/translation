import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { Input } from "@/components/ui/input";
import {
  GLOSSARY,
  GLOSSARY_CATEGORIES,
  searchGlossary,
  type GlossaryCategory,
} from "@/lib/glossary";

export const Route = createFileRoute("/glossary")({ component: GlossaryPage });

function GlossaryPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<GlossaryCategory | "All">("All");
  const results = useMemo(() => {
    const found = searchGlossary(q);
    if (cat === "All") return found;
    return found.filter((e) => e.category === cat);
  }, [q, cat]);

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 px-5 pb-16 sm:px-8">
        <p className="pt-4 text-xs tracking-[0.22em] text-muted uppercase">
          Adventist lexicon
        </p>
        <h1 className="mt-3 font-display text-5xl tracking-tight sm:text-6xl">
          Common pulpit words
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
          Woord keeps this dictionary beside the translator so Sabbath School,
          the three angels, and the sanctuary are rendered the way Adventists
          actually speak — including Cape Afrikaans, Kaaps, and South African
          English from the pulpit, not generic church English.
        </p>
        <div className="mt-8">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search Afrikaans, Kaaps, or English"
            aria-label="Search glossary"
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {(["All", ...GLOSSARY_CATEGORIES] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={`h-9 rounded-full px-3 text-sm ${
                cat === c
                  ? "bg-accent text-accent-fg"
                  : "bg-elevated text-muted shadow-[var(--shadow-border)]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <p className="mt-6 text-xs text-subtle">
          {results.length} of {GLOSSARY.length} terms
        </p>
        <ul className="mt-4 divide-y divide-border">
          {results.map((e) => (
            <li
              key={`${e.af}-${e.en}-${e.category}`}
              className="grid grid-cols-[1fr_1fr] gap-4 py-3 sm:grid-cols-[1.1fr_1fr_8rem]"
            >
              <span className="text-sm text-fg">
                {e.af}
                {e.note ? (
                  <span className="mt-1 block text-xs text-subtle">{e.note}</span>
                ) : null}
              </span>
              <span className="text-sm text-muted">{e.en}</span>
              <span className="hidden text-xs text-subtle sm:block">{e.category}</span>
            </li>
          ))}
        </ul>
      </main>
      <SiteFooter />
    </div>
  );
}
