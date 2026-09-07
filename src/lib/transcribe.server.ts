import { customVocabulary } from "@/lib/glossary";
import { filterFoulLanguage } from "@/lib/profanity";

export type EngineStatus = {
  gemini: boolean;
  grokTranslate: boolean;
  localBackup: boolean;
};

export function engineStatus(): EngineStatus {
  return {
    gemini: Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY),
    grokTranslate: Boolean(process.env.XAI_API_KEY),
    localBackup: true,
  };
}

/**
 * Gemini 3.5 Transcribe (unary) with the Adventist custom vocabulary.
 * Used when a Gemini key is present; the host otherwise relies on on-device
 * Afrikaans speech recognition and sends text here only for translation.
 */
export async function transcribeWithGemini(params: {
  audioBase64: string;
  mimeType: string;
}): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) return { ok: false, error: "Gemini Transcribe is not configured." };

  const vocab = customVocabulary();
  const mime = params.mimeType || "audio/webm";

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-transcribe:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                inline_data: {
                  mime_type: mime,
                  data: params.audioBase64,
                },
              },
            ],
          },
        ],
        generationConfig: {
          transcription_config: {
            language_codes: ["af-ZA"],
            custom_vocabulary: vocab,
            mode: { type: "smart" },
          },
        },
      }),
    },
  );

  if (!res.ok) {
    // Fallback: Interactions API shape from the Aug 2026 Transcribe docs.
    const retry = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
      method: "POST",
      headers: {
        "x-goog-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gemini-3.5-transcribe",
        input: [
          {
            type: "audio",
            inline_data: { mime_type: mime, data: params.audioBase64 },
          },
        ],
        generation_config: {
          transcription_config: {
            language_codes: ["af-ZA"],
            custom_vocabulary: vocab,
            mode: { type: "smart" },
          },
        },
      }),
    });
    if (!retry.ok) {
      return { ok: false, error: `Gemini Transcribe error ${res.status}` };
    }
    const body = (await retry.json()) as {
      steps?: { content?: { text?: string }[] }[];
      output_text?: string;
    };
    const text =
      body.output_text ||
      body.steps?.[0]?.content?.[0]?.text ||
      "";
    return { ok: true, text: filterFoulLanguage(text).text };
  }

  const body = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text = body.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  return { ok: true, text: filterFoulLanguage(text).text };
}
