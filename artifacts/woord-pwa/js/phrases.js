/** Exact liturgy / stock lines — never send these to a machine translator. */
export const PHRASES = [
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
  ["Mag die Here julle seën", "May the Lord bless you"],
  ["Die Here is in Sy heilige tempel", "The Lord is in His holy temple"],
  ["Laat alle vlees swyg voor Hom", "Let all the earth keep silence before Him"],
  ["Maak julle harte oop", "Open your hearts"],
  ["Ons sluit af", "We close"],
  ["Ons sluit die diens", "We close the service"],
  ["Tot volgende Sabbat", "Until next Sabbath"],
  ["Sien julle volgende Sabbat", "See you next Sabbath"],
  ["Die Sabbat is die seël van die Skepper", "The Sabbath is the seal of the Creator"],
  ["Die Sabbat is die seel van die Skepper", "The Sabbath is the seal of the Creator"],
  ["Onthou die Sabbatdag dat jy dit heilig", "Remember the Sabbath day, to keep it holy"],
  ["Onthou die sabbatdag, dat jy dit heilig", "Remember the Sabbath day, to keep it holy"],
  ["Hierdie is die dag wat die Here gemaak het", "This is the day the Lord has made"],
  ["Kom laat ons aanbid", "Come, let us worship"],
  ["Kom tot die Here", "Come to the Lord"],
  ["Die Woord van die Here", "The Word of the Lord"],
  ["So sê die Here", "Thus says the Lord"],
  ["Laat ons staan", "Let us stand"],
  ["Julle mag sit", "You may be seated"],
  ["Ons neem die offergawe op", "We receive the offering"],
  ["Dankie Here vir U Woord", "Thank You Lord for Your Word"],
  ["Vader ons dank U", "Father we thank You"],
  ["In Jesus se Naam", "In Jesus' name"],
  ["In die Naam van Jesus", "In the name of Jesus"],
  ["Ons bid in Jesus se Naam, Amen", "We pray in Jesus' name, Amen"],
  ["Geliefdes in die Here", "Beloved in the Lord"],
  ["Broers en susters in Christus", "Brothers and sisters in Christ"],
  ["Die vrede van die Here", "The peace of the Lord"],
  ["Gaan in vrede", "Go in peace"],
  ["Die Here seën jou en Hy behoed jou", "The Lord bless you and keep you"],
  ["Die Here laat Sy aangesig oor jou skyn", "The Lord make His face shine upon you"],
];

export function lookupPhrase(text) {
  const key = norm(text);
  for (const [af, en] of PHRASES) {
    if (norm(af) === key) return en;
  }
  return null;
}

function norm(s) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}
