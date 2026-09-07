/** Church-appropriate gate. Hold the line for the host; never auto-publish slurs. */

const FOUL = [
  "fok",
  "fokken",
  "fokkit",
  "fuck",
  "fucking",
  "shit",
  "bitch",
  "cunt",
  "asshole",
  "kak",
  "doos",
  "poes",
  "naai",
  "nigger",
  "kaffer",
  "kafir",
  "hotnot",
  "coolie",
];

export function detectFoul(text) {
  const hits = [];
  for (const w of FOUL) {
    const re = new RegExp(`(?<![\\p{L}\\p{N}])${escapeRe(w)}(?![\\p{L}\\p{N}])`, "giu");
    if (re.test(text)) hits.push(w);
  }
  return {
    blocked: hits.length > 0,
    hits,
  };
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
