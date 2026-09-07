import { applyGlossaryAf, pinEnglishTerms, GLOSSARY } from "./glossary.js";
import { lookupPhrase, PHRASES } from "./phrases.js";
import { detectScripture, scriptureBanner } from "./scripture.js";
import { lexiconTranslate, applyPairs } from "./slang.js";

const CACHE_KEY = "woord-mt-cache-v2";

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

export async function translateUtterance(rawAf, opts = {}) {
  const source = applyGlossaryAf((rawAf || "").trim());
  if (!source) {
    return { af: "", en: "", engine: "empty", confidence: 0, scripture: [], warning: null };
  }

  const scripture = detectScripture(source);
  const banner = scriptureBanner(scripture);
  const local = localEnglish(source);

  const exact = lookupPhrase(source);
  if (exact) {
    return {
      af: source,
      en: exact,
      engine: "liturgy",
      confidence: 1,
      scripture,
      warning: banner ? banner.en : null,
    };
  }

  if (banner && source.split(/\s+/).length >= 18) {
    return {
      af: source,
      en: "",
      engine: "scripture",
      confidence: 1,
      scripture,
      warning: banner.en,
    };
  }

  const cache = loadCache();
  const ck = cacheKey(source);
  if (cache[ck]) {
    return {
      af: source,
      en: pinEnglishTerms(cache[ck], source),
      engine: "cache",
      confidence: 0.92,
      scripture,
      warning: banner ? banner.en : null,
    };
  }

  const localUseful = local && local.toLowerCase() !== source.toLowerCase();

  if (opts.offlineOnly) {
    return {
      af: source,
      en: localUseful ? local : "",
      engine: localUseful ? "lexicon" : "source-only",
      confidence: localUseful ? 0.6 : 0.2,
      scripture,
      warning: banner ? banner.en : localUseful ? null : "Translation offline — Afrikaans source is the backup.",
    };
  }

  try {
    const en = await myMemory(source);
    const pinned = pinEnglishTerms(en, source);
    cache[ck] = pinned;
    saveCache(cache);
    return {
      af: source,
      en: pinned,
      engine: "mymemory",
      confidence: pinned ? 0.72 : 0.3,
      scripture,
      warning: banner ? banner.en : null,
    };
  } catch {
    return {
      af: source,
      en: localUseful ? local : "",
      engine: localUseful ? "lexicon" : "source-only",
      confidence: localUseful ? 0.55 : 0.2,
      scripture,
      warning: banner
        ? banner.en
        : localUseful
          ? null
          : "Translator unavailable. Read the Afrikaans line — that text is trustworthy.",
    };
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
  if (!result.en) return true;
  if (result.engine === "source-only") return true;
  if (result.confidence < 0.55) return true;
  if (result.scripture.length) return true;
  if (result.af.split(/\s+/).length >= 18 && result.engine === "mymemory") return true;
  return false;
}
