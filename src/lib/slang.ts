export type SlangRow = {
  af: string;
  en: string;
  note?: string;
  /** Hint for Grok only — do not blindly replace in the local backup. */
  promptOnly?: boolean;
};

/** Cape Afrikaans, Kaaps, and South African English the pulpit actually uses. */
export const SLANG: SlangRow[] = [
  { af: "lekker", en: "lovely", note: "not 'delicious' unless food" },
  { af: "eish", en: "wow" },
  { af: "sjoe", en: "whoa" },
  { af: "yoh", en: "wow" },
  { af: "eina", en: "ouch" },
  { af: "aweh", en: "respect" },
  { af: "awe", en: "respect" },
  { af: "heita", en: "hello" },
  { af: "howzit", en: "hello", promptOnly: true },
  { af: "ja-nee", en: "well then" },
  { af: "janee", en: "well then" },
  { af: "mos", en: "after all" },
  { af: "sommer", en: "simply" },
  { af: "darem", en: "at least" },
  { af: "nogal", en: "actually" },
  { af: "nè", en: "right?" },
  { af: "ne waar", en: "isn't it" },
  { af: "nè waar", en: "isn't it" },
  { af: "ag man", en: "oh man" },
  { af: "ag shame", en: "oh dear", promptOnly: true },
  { af: "ag", en: "oh" },
  { af: "gits", en: "gosh" },
  { af: "sis", en: "yuck" },
  { af: "sies", en: "yuck" },
  { af: "haai", en: "hey" },
  { af: "hayibo", en: "no way" },
  { af: "hayi", en: "no" },
  { af: "kiff", en: "great" },
  { af: "skaam", en: "shy" },
  { af: "deurmekaar", en: "mixed up" },
  { af: "gatvol", en: "fed up" },
  { af: "stout", en: "naughty" },
  { af: "moeg", en: "tired" },
  { af: "skrik", en: "fright" },
  { af: "bang", en: "afraid" },
  { af: "opgewonde", en: "excited" },
  { af: "gebroke", en: "broken" },
  { af: "mal", en: "mad" },
  { af: "dol", en: "crazy" },
  { af: "siek", en: "sick" },
  { af: "skraal", en: "hungry" },
  { af: "braai", en: "barbecue" },
  { af: "bakkie", en: "pickup" },
  { af: "stoep", en: "porch" },
  { af: "dorp", en: "town" },
  { af: "veld", en: "veld" },
  { af: "daai", en: "that" },
  { af: "hierrie", en: "this" },
  { af: "hierso", en: "here" },
  { af: "daarso", en: "there" },
  { af: "djy", en: "you" },
  { af: "djy moet", en: "you must" },
  { af: "wena", en: "you" },
  { af: "boet", en: "brother" },
  { af: "bru", en: "brother" },
  { af: "my broer", en: "my brother" },
  { af: "chommie", en: "friend" },
  { af: "tjommie", en: "friend" },
  { af: "laaitie", en: "youngster" },
  { af: "tannie", en: "auntie", note: "respectful address" },
  { af: "oom", en: "uncle", note: "respectful address" },
  { af: "sisi", en: "sister" },
  { af: "kuier", en: "visit" },
  { af: "lekker kuier", en: "lovely fellowship" },
  { af: "kom kuier", en: "come visit" },
  { af: "skinner", en: "gossip" },
  { af: "nou-nou", en: "very soon" },
  { af: "nou nou", en: "very soon" },
  { af: "netnou", en: "in a bit" },
  { af: "wag 'n bietjie", en: "wait a moment" },
  { af: "sit 'n bietjie", en: "sit a while" },
  { af: "kyk hierso", en: "look here" },
  { af: "ek sê", en: "I'm telling you" },
  { af: "glo my", en: "believe me" },
  { af: "ja boet", en: "yes brother" },
  { af: "maak 'n plan", en: "make a plan" },
  { af: "shame", en: "oh dear", note: "SA English sympathy, not disgrace", promptOnly: true },
  { af: "just now", en: "in a bit", note: "not immediately", promptOnly: true },
  { af: "now now", en: "very soon", promptOnly: true },
  { af: "sharp", en: "all good", promptOnly: true },
  { af: "hectic", en: "intense", promptOnly: true },
  { af: "is it", en: "is that so", promptOnly: true },
  { af: "check", en: "look", note: "when used as 'check hier'", promptOnly: true },
  { af: "robot", en: "traffic light", promptOnly: true },
  { af: "make a plan", en: "we'll figure it out", promptOnly: true },
  { af: "loadshedding", en: "load-shedding" },
  { af: "die Here is good", en: "the Lord is good" },
  { af: "praise the Lord", en: "praise the Lord", promptOnly: true },
  { af: "amen somebody", en: "amen, somebody", promptOnly: true },
  { af: "amen en amen", en: "amen and amen" },
  { af: "prys Hom", en: "praise Him" },
  { af: "dankie Here", en: "thank You Lord" },
  { af: "wees stil", en: "be still" },
  { af: "kom vorentoe", en: "come forward" },
  { af: "kom na die front", en: "come to the front" },
  { af: "gee jou hart", en: "give your heart" },
  { af: "gee jou hart vir Jesus", en: "give your heart to Jesus" },
  { af: "gee jou lewe", en: "give your life" },
  { af: "red jou siel", en: "save your soul" },
  { af: "die vyand", en: "the enemy" },
  { af: "die duiwel", en: "the devil" },
  { af: "die devil is a liar", en: "the devil is a liar" },
  { af: "die Word", en: "the Word" },
  { af: "die fire", en: "the fire" },
  { af: "die power", en: "the power" },
  { af: "die presence", en: "the presence" },
  { af: "die glory", en: "the glory" },
  { af: "die grace", en: "the grace" },
  { af: "die covering", en: "the covering" },
  { af: "die season", en: "the season" },
  { af: "die harvest", en: "the harvest" },
  { af: "die calling", en: "the calling" },
  { af: "die oil", en: "the oil" },
  { af: "die blood", en: "the blood" },
  { af: "die cross", en: "the cross" },
  { af: "die throne", en: "the throne" },
  { af: "die favour", en: "the favour" },
  { af: "die atmosphere", en: "the atmosphere" },
  { af: "die revival", en: "the revival" },
  { af: "die overflow", en: "the overflow" },
  { af: "n blessing", en: "a blessing" },
  { af: "'n blessing", en: "a blessing" },
  { af: "breakthrough", en: "breakthrough", promptOnly: true },
  { af: "anointing", en: "anointing", promptOnly: true },
  { af: "gesalf", en: "anointed" },
  { af: "gesalfde", en: "anointed one" },
  { af: "salwing", en: "anointing" },
  { af: "altar call", en: "altar call", promptOnly: true },
  { af: "praise and worship", en: "praise and worship", promptOnly: true },
  { af: "outreach", en: "outreach", promptOnly: true },
  { af: "die band", en: "the band" },
  { af: "pastoor", en: "pastor" },
  { af: "dominee", en: "minister" },
  { af: "genesing", en: "healing" },
  { af: "vergifnis", en: "forgiveness" },
  { af: "redding", en: "salvation" },
  { af: "getuienisdiens", en: "testimony service" },
];

/** Exact lines — never machine-translate these. */
export const LITURGY: [string, string][] = [
  ["Laat ons bid", "Let us pray"],
  ["Laat ons saam bid", "Let us pray together"],
  ["Amen", "Amen"],
  ["Halleluja", "Hallelujah"],
  ["Prys die Here", "Praise the Lord"],
  ["Loof die Here", "Praise the Lord"],
  ["Goeiemôre gemeente", "Good morning church"],
  ["Goeie more gemeente", "Good morning church"],
  ["Goeiemôre broers en susters", "Good morning brothers and sisters"],
  ["Welkom by die Sabbatskool", "Welcome to Sabbath School"],
  ["Welkom by die erediens", "Welcome to the worship service"],
  ["Julle mag sit", "You may be seated"],
  ["Laat ons staan", "Let us stand"],
  ["Die Woord van die Here", "The Word of the Lord"],
  ["So sê die Here", "Thus says the Lord"],
  ["In Jesus se Naam", "In Jesus' name"],
  ["In die Naam van Jesus", "In the name of Jesus"],
  ["Gaan in vrede", "Go in peace"],
  ["Tot volgende Sabbat", "Until next Sabbath"],
  ["Sien julle volgende Sabbat", "See you next Sabbath"],
  ["Die Here seën jou en Hy behoed jou", "The Lord bless you and keep you"],
  ["Onthou die Sabbatdag dat jy dit heilig", "Remember the Sabbath day, to keep it holy"],
  ["Die Sabbat is die seël van die Skepper", "The Sabbath is the seal of the Creator"],
  ["Kom vorentoe", "Come forward"],
];

/** Everyday pulpit Afrikaans for the zero-cost backup translator. */
export const LEXICON: [string, string][] = [
  ["broers en susters", "brothers and sisters"],
  ["geliefde", "beloved"],
  ["gemeente", "congregation"],
  ["vandag", "today"],
  ["bymekaar", "gathered"],
  ["laat ons", "let us"],
  ["die Here", "the Lord"],
  ["Here Jesus", "Lord Jesus"],
  ["die Vader", "the Father"],
  ["Heilige Gees", "Holy Spirit"],
  ["woord van God", "word of God"],
  ["bloed van Jesus", "blood of Jesus"],
  ["in Christus", "in Christ"],
  ["ons is", "we are"],
  ["ons moet", "we must"],
  ["ons wil", "we want"],
  ["julle is", "you are"],
  ["julle moet", "you must"],
  ["hulle is", "they are"],
  ["dit is", "it is"],
  ["daar is", "there is"],
  ["hier is", "here is"],
  ["ek is", "I am"],
  ["hy is", "he is"],
  ["sy is", "she is"],
  ["te sien", "to see"],
  ["te hoor", "to hear"],
  ["te wees", "to be"],
  ["te kom", "to come"],
  ["om te", "to"],
  ["nie net", "not only"],
  ["nie meer", "no longer"],
  ["asook", "as well as"],
  ["sodat", "so that"],
  ["omdat", "because"],
  ["want", "because"],
  ["maar", "but"],
  ["tog", "yet"],
  ["dus", "so"],
  ["dan", "then"],
  ["nou", "now"],
  ["weer", "again"],
  ["saam", "together"],
  ["baie", "very"],
  ["bietjie", "a little"],
  ["gou", "quickly"],
  ["altyd", "always"],
  ["nooit", "never"],
  ["niks", "nothing"],
  ["miskien", "perhaps"],
  ["seker", "surely"],
  ["mooi", "beautiful"],
  ["vinnig", "quickly"],
  ["stadig", "slowly"],
  ["later", "later"],
  ["eers", "first"],
  ["alreeds", "already"],
  ["gister", "yesterday"],
  ["môre", "tomorrow"],
  ["more", "tomorrow"],
  ["oggend", "morning"],
  ["middag", "afternoon"],
  ["aand", "evening"],
  ["hier", "here"],
  ["daar", "there"],
  ["julle", "you"],
  ["hulle", "they"],
  ["ons", "we"],
  ["hom", "him"],
  ["haar", "her"],
  ["sy", "his"],
  ["hy", "he"],
  ["ek", "I"],
  ["jy", "you"],
  ["jou", "your"],
  ["my", "my"],
  ["vir", "for"],
  ["met", "with"],
  ["sonder", "without"],
  ["tot", "until"],
  ["na", "to"],
  ["van", "of"],
  ["oor", "about"],
  ["uit", "out of"],
  ["op", "on"],
  ["by", "at"],
  ["teen", "against"],
  ["deur", "through"],
  ["nie", "not"],
  ["geen", "no"],
  ["die", "the"],
  ["hierdie", "this"],
  ["daardie", "that"],
  ["elke", "every"],
  ["almal", "everyone"],
  ["iemand", "someone"],
  ["niemand", "nobody"],
  ["en", "and"],
  ["of", "or"],
  ["bid", "pray"],
  ["gebed", "prayer"],
  ["preek", "sermon"],
  ["boodskap", "message"],
  ["prediking", "preaching"],
  ["sang", "singing"],
  ["lof", "praise"],
  ["vas", "fast"],
  ["seën", "blessing"],
  ["geseën", "blessed"],
  ["genade", "grace"],
  ["rus", "rest"],
  ["vrede", "peace"],
  ["hoop", "hope"],
  ["liefde", "love"],
  ["geloof", "faith"],
  ["waarheid", "truth"],
  ["lig", "light"],
  ["duisternis", "darkness"],
  ["sonde", "sin"],
  ["sondaar", "sinner"],
  ["bekering", "repentance"],
  ["berou", "remorse"],
  ["gehoorsaam", "obedient"],
  ["heilig", "holy"],
  ["rein", "clean"],
  ["reinig", "cleanse"],
  ["kruis", "cross"],
  ["graf", "grave"],
  ["hemel", "heaven"],
  ["engele", "angels"],
  ["Satan", "Satan"],
  ["versoeking", "temptation"],
  ["oorwinning", "victory"],
  ["stryd", "struggle"],
  ["wapenrusting", "armour"],
  ["belofte", "promise"],
  ["verbond", "covenant"],
  ["teks", "text"],
  ["skriflesing", "Scripture reading"],
  ["Bybel", "Bible"],
  ["bybel", "Bible"],
  ["Jesus", "Jesus"],
  ["Christus", "Christ"],
  ["God", "God"],
  ["Amen", "Amen"],
];

const STT_REPAIRS: [RegExp, string][] = [
  [/\bseel\b/gi, "seël"],
  [/\bsabat\b/gi, "Sabbat"],
  [/\bsabbathskool\b/gi, "Sabbatskool"],
  [/\bpad ?finders\b/gi, "Padfinders"],
  [/\blaatreen\b/gi, "laatreën"],
  [/\blaat reen\b/gi, "laatreën"],
  [/\bvroeereen\b/gi, "vroegreën"],
  [/\bopen baring\b/gi, "Openbaring"],
  [/\bheilig dom\b/gi, "heiligdom"],
  [/\badventis(te)?\b/gi, "Adventiste"],
  [/\bdjy\b/gi, "jy"],
  [/\blat ons\b/gi, "laat ons"],
  [/\bdie here\b/g, "die Here"],
  [/\bhere jesus\b/gi, "Here Jesus"],
  [/\bnagmaal\b/gi, "nagmaal"],
  [/\bdrie engele\b/gi, "drie engele"],
  [/\b3 engele\b/gi, "drie engele"],
];

export function repairSpeech(text: string): string {
  let out = text.replace(/\s+/g, " ").trim();
  for (const [re, to] of STT_REPAIRS) out = out.replace(re, to);
  return out;
}

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function lookupLiturgy(text: string): string | null {
  const key = norm(text);
  for (const [af, en] of LITURGY) {
    if (norm(af) === key) return en;
  }
  return null;
}

function phraseRe(term: string): RegExp {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
  return new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`, "giu");
}

export function applyPairs(text: string, pairs: { af: string; en: string }[]): string {
  const sorted = [...pairs].sort((a, b) => b.af.length - a.af.length);
  let out = text;
  for (const { af, en } of sorted) {
    if (af.length < 2) continue;
    out = out.replace(phraseRe(af), en);
  }
  return out;
}

/** Zero-cost backup: liturgy, Kaaps, then everyday pulpit Afrikaans. */
export function lexiconTranslate(text: string): string {
  let out = applyPairs(
    text,
    LITURGY.map(([af, en]) => ({ af, en })),
  );
  out = applyPairs(
    out,
    SLANG.filter((s) => !s.promptOnly),
  );
  out = applyPairs(
    out,
    LEXICON.map(([af, en]) => ({ af, en })),
  );
  out = out.replace(/'n\s+/g, "a ").replace(/\s+/g, " ").trim();
  return out;
}

const BOOKS: [string, string][] = [
  ["Genesis", "Genesis"],
  ["Eksodus", "Exodus"],
  ["Levitikus", "Leviticus"],
  ["Numeri", "Numbers"],
  ["Deuteronomium", "Deuteronomy"],
  ["Josua", "Joshua"],
  ["Rigters", "Judges"],
  ["Psalms", "Psalms"],
  ["Psalm", "Psalm"],
  ["Spreuke", "Proverbs"],
  ["Jesaja", "Isaiah"],
  ["Jeremia", "Jeremiah"],
  ["Daniël", "Daniel"],
  ["Daniel", "Daniel"],
  ["Matteus", "Matthew"],
  ["Markus", "Mark"],
  ["Lukas", "Luke"],
  ["Johannes", "John"],
  ["Handelinge", "Acts"],
  ["Romeine", "Romans"],
  ["Openbaring", "Revelation"],
];

const BOOK_ALT = BOOKS.map(([af]) => af.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
  .sort((a, b) => b.length - a.length)
  .join("|");
const REF_RE = new RegExp(
  `\\b(${BOOK_ALT})\\s+(\\d{1,3})(?:\\s*(?::|vers)\\s*(\\d{1,3})(?:\\s*[–-]\\s*(\\d{1,3}))?)?`,
  "gi",
);

export function scriptureNote(text: string): string | null {
  const hits: string[] = [];
  const re = new RegExp(REF_RE.source, "gi");
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const row = BOOKS.find((b) => b[0].toLowerCase() === m![1].toLowerCase());
    const book = row?.[1] ?? m[1];
    const ref = m[3]
      ? m[4]
        ? `${book} ${m[2]}:${m[3]}–${m[4]}`
        : `${book} ${m[2]}:${m[3]}`
      : `${book} ${m[2]}`;
    hits.push(ref);
  }
  if (!hits.length) return null;
  return `Open ${hits.join(" · ")} in your own Bible — we do not invent Scripture.`;
}

export function isScriptureReading(text: string): boolean {
  if (!scriptureNote(text)) return false;
  if (/^(lees saam|ons lees|die skrif|skriflesing|die lesing)/i.test(text.trim())) {
    return true;
  }
  return text.trim().split(/\s+/).length >= 18;
}
