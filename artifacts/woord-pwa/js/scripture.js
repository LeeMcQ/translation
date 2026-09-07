/**
 * Scripture is the deep backup.
 * We do NOT machine-translate Bible text (copyright + theology).
 * Detect the reference and tell the pew to open their own Bible.
 */
const BOOK_AF = [
  ["Genesis", "Genesis", "Gen"],
  ["Eksodus", "Exodus", "Ex"],
  ["Levitikus", "Leviticus", "Lev"],
  ["Numeri", "Numbers", "Num"],
  ["Deuteronomium", "Deuteronomy", "Deut"],
  ["Josua", "Joshua", "Josh"],
  ["Rigters", "Judges", "Judg"],
  ["Rut", "Ruth", "Ruth"],
  ["1 Samuel", "1 Samuel", "1 Sam"],
  ["2 Samuel", "2 Samuel", "2 Sam"],
  ["1 Konings", "1 Kings", "1 Kgs"],
  ["2 Konings", "2 Kings", "2 Kgs"],
  ["1 Kronieke", "1 Chronicles", "1 Chr"],
  ["2 Kronieke", "2 Chronicles", "2 Chr"],
  ["Esra", "Ezra", "Ezra"],
  ["Nehemia", "Nehemiah", "Neh"],
  ["Ester", "Esther", "Esth"],
  ["Job", "Job", "Job"],
  ["Psalms", "Psalms", "Ps"],
  ["Psalm", "Psalm", "Ps"],
  ["Spreuke", "Proverbs", "Prov"],
  ["Prediker", "Ecclesiastes", "Eccl"],
  ["Hooglied", "Song of Songs", "Song"],
  ["Jesaja", "Isaiah", "Isa"],
  ["Jeremia", "Jeremiah", "Jer"],
  ["Klaagliedere", "Lamentations", "Lam"],
  ["Esegiël", "Ezekiel", "Ezek"],
  ["Esegiel", "Ezekiel", "Ezek"],
  ["Daniël", "Daniel", "Dan"],
  ["Daniel", "Daniel", "Dan"],
  ["Hosea", "Hosea", "Hos"],
  ["Joël", "Joel", "Joel"],
  ["Joel", "Joel", "Joel"],
  ["Amos", "Amos", "Amos"],
  ["Obadja", "Obadiah", "Obad"],
  ["Jona", "Jonah", "Jonah"],
  ["Miga", "Micah", "Mic"],
  ["Nahum", "Nahum", "Nah"],
  ["Habakuk", "Habakkuk", "Hab"],
  ["Sefanja", "Zephaniah", "Zeph"],
  ["Haggai", "Haggai", "Hag"],
  ["Sagaria", "Zechariah", "Zech"],
  ["Maleagi", "Malachi", "Mal"],
  ["Matteus", "Matthew", "Matt"],
  ["Markus", "Mark", "Mark"],
  ["Lukas", "Luke", "Luke"],
  ["Johannes", "John", "John"],
  ["Handelinge", "Acts", "Acts"],
  ["Romeine", "Romans", "Rom"],
  ["1 Korintiërs", "1 Corinthians", "1 Cor"],
  ["1 Korintiers", "1 Corinthians", "1 Cor"],
  ["2 Korintiërs", "2 Corinthians", "2 Cor"],
  ["Galasiërs", "Galatians", "Gal"],
  ["Galasiers", "Galatians", "Gal"],
  ["Efesiërs", "Ephesians", "Eph"],
  ["Efesiers", "Ephesians", "Eph"],
  ["Filippense", "Philippians", "Phil"],
  ["Kolossense", "Colossians", "Col"],
  ["1 Tessalonisense", "1 Thessalonians", "1 Thess"],
  ["2 Tessalonisense", "2 Thessalonians", "2 Thess"],
  ["1 Timoteus", "1 Timothy", "1 Tim"],
  ["2 Timoteus", "2 Timothy", "2 Tim"],
  ["Titus", "Titus", "Titus"],
  ["Filemon", "Philemon", "Phlm"],
  ["Hebreërs", "Hebrews", "Heb"],
  ["Hebreers", "Hebrews", "Heb"],
  ["Jakobus", "James", "Jas"],
  ["1 Petrus", "1 Peter", "1 Pet"],
  ["2 Petrus", "2 Peter", "2 Pet"],
  ["1 Johannes", "1 John", "1 John"],
  ["2 Johannes", "2 John", "2 John"],
  ["3 Johannes", "3 John", "3 John"],
  ["Judas", "Jude", "Jude"],
  ["Openbaring", "Revelation", "Rev"],
];

const BOOK_RE = BOOK_AF.map(([af]) => af.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
  .sort((a, b) => b.length - a.length)
  .join("|");

const REF_RE = new RegExp(
  `\\b(${BOOK_RE})\\s+(\\d{1,3})\\s*(?::|vers|v\\.?\\s*)\\s*(\\d{1,3})(?:\\s*[–-]\\s*(\\d{1,3}))?`,
  "gi"
);

export function detectScripture(text) {
  const hits = [];
  const re = new RegExp(REF_RE.source, "gi");
  let m;
  while ((m = re.exec(text))) {
    const bookAf = m[1];
    const row = BOOK_AF.find((b) => b[0].toLowerCase() === bookAf.toLowerCase());
    const bookEn = row ? row[1] : bookAf;
    const chap = m[2];
    const verse = m[3];
    const end = m[4];
    const refEn = end ? `${bookEn} ${chap}:${verse}–${end}` : `${bookEn} ${chap}:${verse}`;
    const refAf = end ? `${bookAf} ${chap}:${verse}–${end}` : `${bookAf} ${chap}:${verse}`;
    hits.push({ refAf, refEn, raw: m[0] });
  }
  return hits;
}

export function scriptureBanner(hits) {
  if (!hits.length) return null;
  const list = hits.map((h) => h.refEn).join(" · ");
  return {
    kind: "scripture",
    en: `Open ${list} in your own Bible — we do not machine-translate Scripture.`,
    refs: hits,
  };
}
