import { filterFoulLanguage } from "@/lib/profanity";
import { glossaryForPrompt, overlayGlossary } from "@/lib/glossary";
import {
  isScriptureReading,
  lexiconTranslate,
  lookupLiturgy,
  repairSpeech,
  scriptureNote,
} from "@/lib/slang";

export type TranslateEngine =
  | "grok"
  | "liturgy"
  | "lexicon"
  | "mymemory"
  | "scripture"
  | "passthrough";

export type TranslateResult = {
  source: string;
  english: string;
  filtered: boolean;
  engine: TranslateEngine;
  scripture: string | null;
};

const cache = new Map<string, TranslateResult>();
const MAX_CACHE = 200;

function cacheGet(key: string): TranslateResult | undefined {
  return cache.get(key);
}

function cacheSet(key: string, value: TranslateResult) {
  if (cache.size >= MAX_CACHE) {
    const first = cache.keys().next().value;
    if (first) cache.delete(first);
  }
  cache.set(key, value);
}

function polishLocal(source: string): string {
  return lexiconTranslate(overlayGlossary(source)).replace(/\s+/g, " ").trim();
}

function polishMachine(english: string): string {
  return overlayGlossary(english).replace(/\s+/g, " ").trim();
}

async function mymemory(q: string): Promise<string | null> {
  try {
    const url =
      "https://api.mymemory.translated.net/get?q=" +
      encodeURIComponent(q.slice(0, 450)) +
      "&langpair=af|en";
    const res = await fetch(url, { signal: AbortSignal.timeout(2500) });
    if (!res.ok) return null;
    const body = (await res.json()) as {
      responseData?: { translatedText?: string };
    };
    const t = body.responseData?.translatedText?.trim() ?? "";
    if (!t || t.toLowerCase() === q.toLowerCase()) return null;
    return filterFoulLanguage(t).text;
  } catch {
    return null;
  }
}

async function grokTranslate(source: string): Promise<string | null> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) return null;
  const glossary = glossaryForPrompt(source);
  try {
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      signal: AbortSignal.timeout(8000),
      body: JSON.stringify({
        model: "grok-4.5",
        temperature: 0.15,
        max_tokens: 280,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are a live interpreter for a Seventh-day Adventist pulpit in South Africa. " +
              "You receive imperfect Afrikaans speech-to-text, often mixed with Kaaps, Cape Afrikaans, and South African English " +
              "(lekker, eish, ja-nee, mos, nè, shame as sympathy, just now = later, now now = soon). " +
              "Silently repair obvious STT errors using church context. Translate into clear, reverent spoken English. " +
              'Output JSON only: {"afrikaans":"...","english":"..."}. No commentary. ' +
              "Never output profanity; replace with an em dash. Apply the glossary spellings exactly. " +
              "Never machine-translate quoted Scripture; if the line is a Bible reading, set english to a short instruction to open that reference in a printed Bible. " +
              "Always fill english. Never return an empty translation.",
          },
          {
            role: "user",
            content: `GLOSSARY\n${glossary}\n\nSOURCE\n${source}`,
          },
        ],
      }),
    });
    if (!res.ok) return null;
    const body = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = body.choices?.[0]?.message?.content ?? "";
    try {
      const parsed = JSON.parse(content) as { english?: string };
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

export async function translateAfrikaans(raw: string): Promise<TranslateResult> {
  const foul = filterFoulLanguage(raw.trim());
  const source = repairSpeech(foul.text);
  if (!source) {
    return {
      source: "",
      english: "",
      filtered: foul.filtered,
      engine: "passthrough",
      scripture: null,
    };
  }

  const cached = cacheGet(source);
  if (cached) return { ...cached, filtered: cached.filtered || foul.filtered };

  const scripture = scriptureNote(source);
  const liturgical = lookupLiturgy(source);
  if (liturgical) {
    const result: TranslateResult = {
      source,
      english: liturgical,
      filtered: foul.filtered,
      engine: "liturgy",
      scripture,
    };
    cacheSet(source, result);
    return result;
  }

  if (isScriptureReading(source) && scripture) {
    const result: TranslateResult = {
      source,
      english: scripture,
      filtered: foul.filtered,
      engine: "scripture",
      scripture,
    };
    cacheSet(source, result);
    return result;
  }

  let english = "";
  let engine: TranslateEngine = "lexicon";

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

  if (scripture && !english.includes("we do not invent Scripture")) {
    english = `${english} · ${scripture}`;
  }

  const result: TranslateResult = {
    source,
    english,
    filtered: foul.filtered,
    engine,
    scripture,
  };
  cacheSet(source, result);
  return result;
}
