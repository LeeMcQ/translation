import { applyGlossaryAf, pinEnglishTerms } from "./glossary.js";
import { lookupPhrase } from "./phrases.js";
import { detectScripture, scriptureBanner } from "./scripture.js";

const CACHE_KEY = "woord-mt-cache-v1";

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

export async function translateUtterance(rawAf, opts = {}) {
  const source = applyGlossaryAf((rawAf || "").trim());
  if (!source) {
    return { af: "", en: "", engine: "empty", confidence: 0, scripture: [], warning: null };
  }

  const scripture = detectScripture(source);
  const banner = scriptureBanner(scripture);

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

  if (opts.offlineOnly) {
    return {
      af: source,
      en: "",
      engine: "source-only",
      confidence: 0.2,
      scripture,
      warning: "Translation offline — Afrikaans source is the backup.",
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
  } catch (err) {
    return {
      af: source,
      en: "",
      engine: "source-only",
      confidence: 0.2,
      scripture,
      warning: "Translator unavailable. Read the Afrikaans line — that text is trustworthy.",
    };
  }
}

async function myMemory(q) {
  const url =
    "https://api.mymemory.translated.net/get?q=" +
    encodeURIComponent(q.slice(0, 480)) +
    "&langpair=af|en";
  const res = await fetch(url);
  if (!res.ok) throw new Error("mt-http");
  const data = await res.json();
  const text = data?.responseData?.translatedText || "";
  if (!text || /invalid|query limit|my memory/i.test(text)) throw new Error("mt-limit");
  return text;
}

export function looksRisky(result) {
  if (!result.en) return true;
  if (result.engine === "source-only") return true;
  if (result.confidence < 0.55) return true;
  if (result.scripture.length) return true;
  if ((result.af.split(/\s+/).length >= 18) && result.engine === "mymemory") return true;
  return false;
}
