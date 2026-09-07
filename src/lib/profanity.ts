/**
 * Whole-word filter for pulpit captions. Theological English (hell, damn as
 * doctrine) is kept. Sexual / abusive / racial language in English and
 * Afrikaans is not.
 */
const BLOCKED = new Set(
  [
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
    "voertsek",
  ].map((w) => w.toLowerCase()),
);

const WORD_RE = /[\p{L}\p{N}’']+/gu;

export function filterFoulLanguage(text: string): { text: string; filtered: boolean } {
  if (!text) return { text, filtered: false };
  let filtered = false;
  const cleaned = text.replace(WORD_RE, (word) => {
    const key = word.toLowerCase().replace(/[’']/g, "");
    if (BLOCKED.has(key)) {
      filtered = true;
      return "—";
    }
    return word;
  });
  return { text: cleaned, filtered };
}
