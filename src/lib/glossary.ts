import { applyPairs, SLANG } from "@/lib/slang";

export type GlossaryEntry = {
  af: string;
  en: string;
  category: GlossaryCategory;
  note?: string;
  promptOnly?: boolean;
};

export type GlossaryCategory =
  | "Doctrine"
  | "Sanctuary"
  | "Prophecy"
  | "Ordinances"
  | "Church life"
  | "Health"
  | "Organisation"
  | "Scripture"
  | "Kaaps / slang";

const CORE: GlossaryEntry[] = [
  // Doctrine
  { af: "Sabbat", en: "Sabbath", category: "Doctrine" },
  { af: "sewende dag", en: "seventh day", category: "Doctrine" },
  { af: "Sewendedag Adventiste", en: "Seventh-day Adventist", category: "Doctrine" },
  { af: "Adventiste", en: "Adventist", category: "Doctrine" },
  { af: "wederkoms", en: "second coming", category: "Doctrine" },
  { af: "Wederkoms", en: "Second Coming", category: "Doctrine" },
  { af: "ewige evangelie", en: "everlasting gospel", category: "Doctrine" },
  { af: "regverdiging deur geloof", en: "justification by faith", category: "Doctrine" },
  { af: "heiligmaking", en: "sanctification", category: "Doctrine" },
  { af: "wedergeboorte", en: "new birth", category: "Doctrine" },
  { af: "verlossing", en: "salvation", category: "Doctrine" },
  { af: "Verlosser", en: "Saviour", category: "Doctrine" },
  { af: "Hoëpriester", en: "High Priest", category: "Doctrine" },
  { af: "Drie-eenheid", en: "Trinity", category: "Doctrine" },
  { af: "Heilige Gees", en: "Holy Spirit", category: "Doctrine" },
  { af: "Seun van God", en: "Son of God", category: "Doctrine" },
  { af: "Lam van God", en: "Lamb of God", category: "Doctrine" },
  { af: "wet van God", en: "law of God", category: "Doctrine" },
  { af: "Tien Gebooie", en: "Ten Commandments", category: "Doctrine" },
  { af: "gebooie van God", en: "commandments of God", category: "Doctrine" },
  { af: "geloof in Jesus", en: "faith of Jesus", category: "Doctrine" },
  { af: "teenwoordige waarheid", en: "present truth", category: "Doctrine" },
  { af: "oorblyfsel", en: "remnant", category: "Doctrine" },
  { af: "oorblyfselkerk", en: "remnant church", category: "Doctrine" },
  { af: "Gees van Profesie", en: "Spirit of Prophecy", category: "Doctrine" },
  { af: "Ellen White", en: "Ellen G. White", category: "Doctrine" },
  { af: "Getuienisse", en: "Testimonies", category: "Doctrine" },
  { af: "groot stryd", en: "great controversy", category: "Doctrine" },
  { af: "skeppingsverhaal", en: "Creation account", category: "Doctrine" },
  { af: "Skepper", en: "Creator", category: "Doctrine" },
  { af: "seël van God", en: "seal of God", category: "Doctrine" },
  { af: "seël van die Skepper", en: "seal of the Creator", category: "Doctrine" },

  // Sanctuary
  { af: "hemelse heiligdom", en: "heavenly sanctuary", category: "Sanctuary" },
  { af: "heiligdom", en: "sanctuary", category: "Sanctuary" },
  { af: "reiniging van die heiligdom", en: "cleansing of the sanctuary", category: "Sanctuary" },
  { af: "ondersoekende oordeel", en: "investigative judgment", category: "Sanctuary" },
  { af: "uur van Sy oordeel", en: "hour of His judgment", category: "Sanctuary" },
  { af: "voorspraak", en: "intercession", category: "Sanctuary" },
  { af: "Allerheiligste", en: "Most Holy Place", category: "Sanctuary" },
  { af: "Heilige Plek", en: "Holy Place", category: "Sanctuary" },
  { af: "versoendeksel", en: "mercy seat", category: "Sanctuary" },
  { af: "verbondsark", en: "ark of the covenant", category: "Sanctuary" },
  { af: "daaglikse diens", en: "daily ministry", category: "Sanctuary" },
  { af: "2300 dae", en: "2,300 days", category: "Sanctuary" },
  { af: "tweeduisend-driehonderd dae", en: "two thousand three hundred days", category: "Sanctuary" },

  // Prophecy
  { af: "drie engele", en: "three angels", category: "Prophecy" },
  { af: "drie-engele-boodskap", en: "three angels' message", category: "Prophecy" },
  { af: "eerste engel", en: "first angel", category: "Prophecy" },
  { af: "tweede engel", en: "second angel", category: "Prophecy" },
  { af: "derde engel", en: "third angel", category: "Prophecy" },
  { af: "Babilon is geval", en: "Babylon is fallen", category: "Prophecy" },
  { af: "Babilon", en: "Babylon", category: "Prophecy" },
  { af: "merk van die dier", en: "mark of the beast", category: "Prophecy" },
  { af: "die dier", en: "the beast", category: "Prophecy" },
  { af: "Sondagwet", en: "Sunday law", category: "Prophecy" },
  { af: "laatreën", en: "latter rain", category: "Prophecy" },
  { af: "vroegreën", en: "early rain", category: "Prophecy" },
  { af: "seëltyd", en: "sealing time", category: "Prophecy" },
  { af: "tyd van benoudheid", en: "time of trouble", category: "Prophecy" },
  { af: "Jakobs benoudheid", en: "Jacob's trouble", category: "Prophecy" },
  { af: "skudding", en: "shaking", category: "Prophecy" },
  { af: "144000", en: "144,000", category: "Prophecy" },
  { af: "honderd vier-en-veertig duisend", en: "one hundred and forty-four thousand", category: "Prophecy" },
  { af: "groot skare", en: "great multitude", category: "Prophecy" },
  { af: "Nuwe Jerusalem", en: "New Jerusalem", category: "Prophecy" },
  { af: "duisendjarige ryk", en: "millennium", category: "Prophecy" },
  { af: "eerste opstanding", en: "first resurrection", category: "Prophecy" },
  { af: "middernaggeroep", en: "midnight cry", category: "Prophecy" },
  { af: "wyse maagde", en: "wise virgins", category: "Prophecy" },
  { af: "dwase maagde", en: "foolish virgins", category: "Prophecy" },
  { af: "geduld van die heiliges", en: "patience of the saints", category: "Prophecy" },
  { af: "laaste dae", en: "last days", category: "Prophecy" },
  { af: "profetiese tye", en: "prophetic time", category: "Prophecy" },
  { af: "vryheid van godsdiens", en: "religious liberty", category: "Prophecy" },
  { af: "Antichris", en: "Antichrist", category: "Prophecy" },

  // Ordinances
  { af: "nagmaal", en: "Lord's Supper", category: "Ordinances" },
  { af: "Nagmaal", en: "Communion", category: "Ordinances" },
  { af: "voetwassing", en: "foot washing", category: "Ordinances" },
  { af: "ordinansie van nederigheid", en: "ordinance of humility", category: "Ordinances" },
  { af: "doop", en: "baptism", category: "Ordinances" },
  { af: "onderdompeling", en: "immersion", category: "Ordinances" },
  { af: "dooplingsklas", en: "baptismal class", category: "Ordinances" },

  // Church life
  { af: "Sabbatskool", en: "Sabbath School", category: "Church life" },
  { af: "kwartaalblad", en: "quarterly", category: "Church life" },
  { af: "aanbidding", en: "worship", category: "Church life" },
  { af: "lofsang", en: "hymn of praise", category: "Church life" },
  { af: "gemeente", en: "congregation", category: "Church life" },
  { af: "ouderling", en: "elder", category: "Church life" },
  { af: "diaken", en: "deacon", category: "Church life" },
  { af: "diakenes", en: "deaconess", category: "Church life" },
  { af: "prediker", en: "pastor", category: "Church life" },
  { af: "evangelis", en: "evangelist", category: "Church life" },
  { af: "tiendes", en: "tithe", category: "Church life" },
  { af: "dankoffer", en: "thank offering", category: "Church life" },
  { af: "Sabbatsoffer", en: "Sabbath offering", category: "Church life" },
  { af: "13de Sabbat", en: "13th Sabbath", category: "Church life" },
  { af: "dertiende Sabbat", en: "thirteenth Sabbath", category: "Church life" },
  { af: "ingawing", en: "Ingathering", category: "Church life" },
  { af: "kampbyeenkoms", en: "camp meeting", category: "Church life" },
  { af: "bybelstudie", en: "Bible study", category: "Church life" },
  { af: "getuienis", en: "testimony", category: "Church life" },
  { af: "dissipelskap", en: "discipleship", category: "Church life" },
  { af: "sending", en: "mission", category: "Church life" },
  { af: "evangelisasie", en: "evangelism", category: "Church life" },
  { af: "huiskerk", en: "house church", category: "Church life" },
  { af: "klein groep", en: "small group", category: "Church life" },
  { af: "voorbidding", en: "intercessory prayer", category: "Church life" },
  { af: "broeders", en: "brethren", category: "Church life" },
  { af: "susters", en: "sisters", category: "Church life" },

  // Health
  { af: "gesondheidsboodskap", en: "health message", category: "Health" },
  { af: "gesondheidsreformasie", en: "health reform", category: "Health" },
  { af: "matigheid", en: "temperance", category: "Health" },
  { af: "vegetaries", en: "vegetarian", category: "Health" },
  { af: "veganies", en: "vegan", category: "Health" },
  { af: "NEWSTART", en: "NEWSTART", category: "Health" },
  { af: "sanitarium", en: "sanitarium", category: "Health" },
  { af: "ADRA", en: "ADRA", category: "Health" },

  // Organisation
  { af: "Generaal Konferensie", en: "General Conference", category: "Organisation" },
  { af: "divisie", en: "division", category: "Organisation" },
  { af: "unie", en: "union", category: "Organisation" },
  { af: "konferensie", en: "conference", category: "Organisation" },
  { af: "Padfinders", en: "Pathfinders", category: "Organisation" },
  { af: "padfinders", en: "Pathfinders", category: "Organisation" },
  { af: "Meestergids", en: "Master Guide", category: "Organisation" },
  { af: "Adventistiese Jeug", en: "Adventist Youth", category: "Organisation" },
  { af: "Adventurers", en: "Adventurers", category: "Organisation" },
  { af: "Sabbath School", en: "Sabbath School", category: "Organisation" },

  // Scripture books
  { af: "Eksodus", en: "Exodus", category: "Scripture" },
  { af: "Levitikus", en: "Leviticus", category: "Scripture" },
  { af: "Numeri", en: "Numbers", category: "Scripture" },
  { af: "Deuteronomium", en: "Deuteronomy", category: "Scripture" },
  { af: "Josua", en: "Joshua", category: "Scripture" },
  { af: "Rigters", en: "Judges", category: "Scripture" },
  { af: "Kronieke", en: "Chronicles", category: "Scripture" },
  { af: "Esra", en: "Ezra", category: "Scripture" },
  { af: "Nehemia", en: "Nehemiah", category: "Scripture" },
  { af: "Spreuke", en: "Proverbs", category: "Scripture" },
  { af: "Prediker", en: "Ecclesiastes", category: "Scripture" },
  { af: "Hooglied", en: "Song of Songs", category: "Scripture" },
  { af: "Jesaja", en: "Isaiah", category: "Scripture" },
  { af: "Jeremia", en: "Jeremiah", category: "Scripture" },
  { af: "Klaagliedere", en: "Lamentations", category: "Scripture" },
  { af: "Esegiël", en: "Ezekiel", category: "Scripture" },
  { af: "Daniël", en: "Daniel", category: "Scripture" },
  { af: "Obadja", en: "Obadiah", category: "Scripture" },
  { af: "Jona", en: "Jonah", category: "Scripture" },
  { af: "Miga", en: "Micah", category: "Scripture" },
  { af: "Sefanja", en: "Zephaniah", category: "Scripture" },
  { af: "Sagaria", en: "Zechariah", category: "Scripture" },
  { af: "Maleagi", en: "Malachi", category: "Scripture" },
  { af: "Matteus", en: "Matthew", category: "Scripture" },
  { af: "Markus", en: "Mark", category: "Scripture" },
  { af: "Lukas", en: "Luke", category: "Scripture" },
  { af: "Johannes", en: "John", category: "Scripture" },
  { af: "Handelinge", en: "Acts", category: "Scripture" },
  { af: "Romeine", en: "Romans", category: "Scripture" },
  { af: "Korintiërs", en: "Corinthians", category: "Scripture" },
  { af: "Galasiërs", en: "Galatians", category: "Scripture" },
  { af: "Efesiërs", en: "Ephesians", category: "Scripture" },
  { af: "Filippense", en: "Philippians", category: "Scripture" },
  { af: "Kolossense", en: "Colossians", category: "Scripture" },
  { af: "Tessalonisense", en: "Thessalonians", category: "Scripture" },
  { af: "Timoteus", en: "Timothy", category: "Scripture" },
  { af: "Hebreërs", en: "Hebrews", category: "Scripture" },
  { af: "Jakobus", en: "James", category: "Scripture" },
  { af: "Petrus", en: "Peter", category: "Scripture" },
  { af: "Judas", en: "Jude", category: "Scripture" },
  { af: "Openbaring", en: "Revelation", category: "Scripture" },
];

export const GLOSSARY: GlossaryEntry[] = [
  ...CORE,
  ...SLANG.map((s) => ({
    af: s.af,
    en: s.en,
    note: s.note,
    promptOnly: s.promptOnly,
    category: "Kaaps / slang" as const,
  })),
];

export const GLOSSARY_CATEGORIES: GlossaryCategory[] = [
  "Doctrine",
  "Sanctuary",
  "Prophecy",
  "Ordinances",
  "Church life",
  "Health",
  "Organisation",
  "Kaaps / slang",
  "Scripture",
];

/** Compact prompt block — longest Afrikaans terms first so replacements don't collide. */
export function glossaryForPrompt(source: string): string {
  const lower = source.toLowerCase();
  const hits = GLOSSARY.filter((e) => lower.includes(e.af.toLowerCase()));
  const list = (hits.length ? hits : GLOSSARY.filter((e) => e.category !== "Scripture").slice(0, 40))
    .slice(0, 80)
    .map((e) => `${e.af} → ${e.en}${e.note ? ` (${e.note})` : ""}`)
    .join("\n");
  return list;
}

export function overlayGlossary(text: string): string {
  return applyPairs(
    text,
    GLOSSARY.filter(
      (e) =>
        !e.promptOnly &&
        e.af.toLowerCase() !== e.en.toLowerCase() &&
        e.af.toLowerCase() !== "sending",
    ),
  );
}

export function customVocabulary(): string[] {
  const seen = new Set<string>();
  const terms: string[] = [];
  for (const e of GLOSSARY) {
    if (e.category === "Scripture") continue;
    for (const t of [e.af, e.en]) {
      if (!seen.has(t) && t.length > 2) {
        seen.add(t);
        terms.push(t);
      }
    }
    if (terms.length >= 120) break;
  }
  return terms;
}

export function searchGlossary(query: string): GlossaryEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return GLOSSARY;
  return GLOSSARY.filter(
    (e) =>
      e.af.toLowerCase().includes(q) ||
      e.en.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      (e.note ?? "").toLowerCase().includes(q),
  );
}
