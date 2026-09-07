import { applyGlossaryAf, pinEnglishTerms, GLOSSARY } from "./glossary.js";
import { lookupPhrase, PHRASES } from "./phrases.js";
import { detectScripture, scriptureBanner } from "./scripture.js";
import { lexiconTranslate, applyPairs, pinSlang } from "./slang.js";
import { detectFoul } from "./filter.js";

const CACHE_KEY = "woord-mt-cache-v3";

function loadCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveCache(map) {
  try {
    const keys = Object.keys(map);
    if (keys.length > 400) {
      for (const k of keys.slice(0, keys.length - 400)) delete map[k];
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(map));
  } catch {
    /* quota */
  }
}

function cacheKey(text) {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function localEnglish(source) {
  let out = applyPairs(
    source,
    PHRASES.map(([af, en]) => ({ af, en })),
  );
  out = lexiconTranslate(out, GLOSSARY);
  return out.replace(/\s+/g, " ").trim();
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Share of Afrikaans content words that were replaced in the local pass. */
export function wordCoverage(source, local) {
  const src = source
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.replace(/[^\p{L}\p{N}'-]/gu, ""))
    .filter((w) => w.length > 2);
  if (!src.length) return 0;
  let kept = 0;
  for (const w of src) {
    const re = new RegExp(`(?<![\\p{L}\\p{N}])${escapeRe(w)}(?![\\p{L}\\p{N}])`, "iu");
    if (re.test(local)) kept += 1;
  }
  return 1 - kept / src.length;
}

function finish(source, en, engine, confidence, scripture, warning) {
  let out = pinEnglishTerms(en || "", source);
  out = pinSlang(out, source);
  return {
    af: source,
    en: out,
    engine,
    confidence,
    scripture,
    warning,
  };
}

export async function translateUtterance(rawAf, opts = {}) {
  const source = applyGlossaryAf((rawAf || "").trim());
  if (!source) {
    return { af: "", en: "", engine: "empty", confidence: 0, scripture: [], warning: null };
  }

  const foul = detectFoul(source);
  const scripture = detectScripture(source);
  const banner = scriptureBanner(scripture);

  if (foul.blocked) {
    return finish(
      source,
      "",
      "blocked",
      0,
      scripture,
      "Held back — not church-appropriate. Drop or retype.",
    );
  }

  const exact = lookupPhrase(source);
  if (exact) {
    return finish(source, exact, "liturgy", 1, scripture, banner ? banner.en : null);
  }

  if (banner && source.split(/\s+/).length >= 18) {
    return finish(source, "", "scripture", 1, scripture, banner.en);
  }

  const cache = loadCache();
  const ck = cacheKey(source);
  if (cache[ck]) {
    return finish(source, cache[ck], "cache", 0.92, scripture, banner ? banner.en : null);
  }

  const local = localEnglish(source);
  const localUseful = local && local.toLowerCase() !== source.toLowerCase();
  const cov = localUseful ? wordCoverage(source, local) : 0;
  const preferLocal = cov >= 0.45;

  if (opts.offlineOnly || preferLocal) {
    return finish(
      source,
      localUseful ? local : "",
      localUseful ? "lexicon" : "source-only",
      localUseful ? Math.max(0.6, cov) : 0.2,
      scripture,
      banner
        ? banner.en
        : localUseful
          ? null
          : "Translation offline — Afrikaans source is the backup.",
    );
  }

  try {
    const mt = await myMemory(source);
    const pinned = pinSlang(pinEnglishTerms(mt, source), source);
    const mtCov = wordCoverage(source, pinned);
    if (localUseful && cov > mtCov + 0.08) {
      return finish(source, local, "lexicon", Math.max(0.6, cov), scripture, banner ? banner.en : null);
    }
    cache[ck] = pinned;
    saveCache(cache);
    return finish(
      source,
      pinned,
      "mymemory",
      pinned ? 0.72 : 0.3,
      scripture,
      banner ? banner.en : null,
    );
  } catch {
    return finish(
      source,
      localUseful ? local : "",
      localUseful ? "lexicon" : "source-only",
      localUseful ? 0.55 : 0.2,
      scripture,
      banner
        ? banner.en
        : localUseful
          ? null
          : "Translator unavailable. Read the Afrikaans line — that text is trustworthy.",
    );
  }
}

async function myMemory(q) {
  const url =
    "https://api.mymemory.translated.net/get?q=" +
    encodeURIComponent(q.slice(0, 480)) +
    "&langpair=af|en";
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 2500);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error("mt-http");
    const data = await res.json();
    const text = data?.responseData?.translatedText || "";
    if (!text || /invalid|query limit|my memory/i.test(text)) throw new Error("mt-limit");
    return text;
  } finally {
    clearTimeout(t);
  }
}

export function looksRisky(result) {
  if (!result) return true;
  if (!result.en) return true;
  if (result.engine === "source-only" || result.engine === "blocked") return true;
  if (result.confidence < 0.55) return true;
  if (result.scripture.length) return true;
  if (result.af.split(/\s+/).length >= 18 && result.engine === "mymemory") return true;
  return false;
}
