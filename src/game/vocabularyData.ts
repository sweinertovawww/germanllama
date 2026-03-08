export interface Question {
  text: string;
  options: string[];
  correct: number;
  translation: string;
}

export interface FillQuestion {
  sentence: string;
  answer: string;
  translation: string;
}

export const QUESTIONS: Question[] = [
  { text: "Jaký člen má Lama?", options: ["der", "die", "das"], correct: 2, translation: "lama" },
  { text: "Jaký člen má Haus?", options: ["der", "die", "das"], correct: 2, translation: "dům" },
  { text: "Jaký člen má Hund?", options: ["der", "die", "das"], correct: 0, translation: "pes" },
  { text: "Jaký člen má Katze?", options: ["der", "die", "das"], correct: 1, translation: "kočka" },
  { text: "Jaký člen má Buch?", options: ["der", "die", "das"], correct: 2, translation: "kniha" },
  { text: "Jaký člen má Tisch?", options: ["der", "die", "das"], correct: 0, translation: "stůl" },
  { text: "Jaký člen má Blume?", options: ["der", "die", "das"], correct: 1, translation: "květina" },
  { text: "Jaký člen má Auto?", options: ["der", "die", "das"], correct: 2, translation: "auto" },
  { text: "Jaký člen má Baum?", options: ["der", "die", "das"], correct: 0, translation: "strom" },
  { text: "Jaký člen má Schule?", options: ["der", "die", "das"], correct: 1, translation: "škola" },
  { text: "Jaký člen má Schreibtisch?", options: ["der", "die", "das"], correct: 0, translation: "psací stůl" },
  { text: "Jaký člen má Stuhl?", options: ["der", "die", "das"], correct: 0, translation: "židle" },
  { text: "Jaký člen má Computer?", options: ["der", "die", "das"], correct: 0, translation: "počítač" },
  { text: "Jaký člen má Monitor?", options: ["der", "die", "das"], correct: 0, translation: "monitor" },
  { text: "Jaký člen má Tastatur?", options: ["der", "die", "das"], correct: 1, translation: "klávesnice" },
  { text: "Jaký člen má Maus?", options: ["der", "die", "das"], correct: 1, translation: "myš" },
  { text: "Jaký člen má Dokument?", options: ["der", "die", "das"], correct: 2, translation: "dokument" },
  { text: "Jaký člen má Formular?", options: ["der", "die", "das"], correct: 2, translation: "formulář" },
  { text: "Jaký člen má Büro?", options: ["der", "die", "das"], correct: 2, translation: "kancelář" },
  { text: "Jaký člen má Drucker?", options: ["der", "die", "das"], correct: 0, translation: "tiskárna" },
  { text: "Jaký člen má Scanner?", options: ["der", "die", "das"], correct: 0, translation: "skener" },
  { text: "Jaký člen má Kopierer?", options: ["der", "die", "das"], correct: 0, translation: "kopírka" },
  { text: "Jaký člen má Aktenschrank?", options: ["der", "die", "das"], correct: 0, translation: "kartotéka" },
  { text: "Jaký člen má Regal?", options: ["der", "die", "das"], correct: 2, translation: "regál" },
  { text: "Jaký člen má Telefon?", options: ["der", "die", "das"], correct: 2, translation: "telefon" },
  { text: "Jaký člen má E-Mail?", options: ["der", "die", "das"], correct: 1, translation: "e-mail" },
  { text: "Jaký člen má Besprechung?", options: ["der", "die", "das"], correct: 1, translation: "porada" },
  { text: "Jaký člen má Pause?", options: ["der", "die", "das"], correct: 1, translation: "přestávka" },
  { text: "Jaký člen má Kantine?", options: ["der", "die", "das"], correct: 1, translation: "jídelna" },
  { text: "Jaký člen má Notebook?", options: ["der", "die", "das"], correct: 2, translation: "notebook" },
  { text: "Jaký člen má Schrank?", options: ["der", "die", "das"], correct: 0, translation: "skříň" },
  { text: "Jaký člen má Tür?", options: ["der", "die", "das"], correct: 1, translation: "dveře" },
  { text: "Jaký člen má Fenster?", options: ["der", "die", "das"], correct: 2, translation: "okno" },
  { text: "Jaký člen má Papierkorb?", options: ["der", "die", "das"], correct: 0, translation: "koš" },
  { text: "Jaký člen má Lampe?", options: ["der", "die", "das"], correct: 1, translation: "lampa" },
  { text: "Jaký člen má Whiteboard?", options: ["der", "die", "das"], correct: 2, translation: "tabule" },
  { text: "Jaký člen má Chef?", options: ["der", "die", "das"], correct: 0, translation: "šéf" },
  { text: "Jaký člen má Kollegin?", options: ["der", "die", "das"], correct: 1, translation: "kolegyně" },
  { text: "Jaký člen má Kollege?", options: ["der", "die", "das"], correct: 0, translation: "kolega" },
  { text: "Jaký člen má Meeting?", options: ["der", "die", "das"], correct: 2, translation: "schůzka" },
  { text: "Jaký člen má Projektor?", options: ["der", "die", "das"], correct: 0, translation: "projektor" },
  { text: "Jaký člen má Präsentation?", options: ["der", "die", "das"], correct: 1, translation: "prezentace" },
  { text: "Jaký člen má WC?", options: ["der", "die", "das"], correct: 2, translation: "záchod" },
  { text: "Jaký člen má Umkleide?", options: ["der", "die", "das"], correct: 1, translation: "šatna" },
  { text: "Jaký člen má Schicht?", options: ["der", "die", "das"], correct: 1, translation: "směna" },
  { text: "Jaký člen má Frühschicht?", options: ["der", "die", "das"], correct: 1, translation: "ranní směna" },
  { text: "Jaký člen má Spätschicht?", options: ["der", "die", "das"], correct: 1, translation: "odpolední směna" },
  { text: "Jaký člen má Nachtschicht?", options: ["der", "die", "das"], correct: 1, translation: "noční směna" },
  { text: "Jaký člen má Tagschicht?", options: ["der", "die", "das"], correct: 1, translation: "denní směna" },
  { text: "Jaký člen má Schichtplan?", options: ["der", "die", "das"], correct: 0, translation: "plán směn" },
  { text: "Jaký člen má Arbeitszeit?", options: ["der", "die", "das"], correct: 1, translation: "pracovní doba" },
  { text: "Jaký člen má Teilzeit?", options: ["der", "die", "das"], correct: 1, translation: "zkrácený úvazek" },
  { text: "Jaký člen má Vollzeit?", options: ["der", "die", "das"], correct: 1, translation: "plný úvazek" },
  { text: "Jaký člen má Gleitzeit?", options: ["der", "die", "das"], correct: 1, translation: "pružná pracovní doba" },
  { text: "Jaký člen má Dienstplan?", options: ["der", "die", "das"], correct: 0, translation: "rozpis služeb" },
  { text: "Jaký člen má Urlaub?", options: ["der", "die", "das"], correct: 0, translation: "dovolená" },
  { text: "Jaký člen má Feiertag?", options: ["der", "die", "das"], correct: 0, translation: "svátek" },
  { text: "Jaký člen má Krankmeldung?", options: ["der", "die", "das"], correct: 1, translation: "nahlášení nemoci" },
  { text: "Jaký člen má Vertretung?", options: ["der", "die", "das"], correct: 1, translation: "zástup" },
  { text: "Jaký člen má Spind?", options: ["der", "die", "das"], correct: 0, translation: "skříňka" },
  { text: "Jaký člen má Seife?", options: ["der", "die", "das"], correct: 1, translation: "mýdlo" },
  { text: "Jaký člen má Erste Hilfe?", options: ["der", "die", "das"], correct: 1, translation: "první pomoc" },
  { text: "Jaký člen má Feuerlöscher?", options: ["der", "die", "das"], correct: 0, translation: "hasicí přístroj" },
  { text: "Jaký člen má Unfall?", options: ["der", "die", "das"], correct: 0, translation: "úraz" },
  { text: "Jaký člen má Warnweste?", options: ["der", "die", "das"], correct: 1, translation: "výstražná vesta" },
  { text: "Jaký člen má Helm?", options: ["der", "die", "das"], correct: 0, translation: "helma" },
  { text: "Jaký člen má Schutzbrille?", options: ["der", "die", "das"], correct: 1, translation: "ochranné brýle" },
  { text: "Jaký člen má Vorschrift?", options: ["der", "die", "das"], correct: 1, translation: "předpis" },
  { text: "Jaký člen má Sicherheit?", options: ["der", "die", "das"], correct: 1, translation: "bezpečnost" },
  { text: "Jaký člen má Fließband?", options: ["der", "die", "das"], correct: 2, translation: "výrobní pás" },
  { text: "Jaký člen má Reparatur?", options: ["der", "die", "das"], correct: 1, translation: "oprava" },
  { text: "Jaký člen má Störung?", options: ["der", "die", "das"], correct: 1, translation: "porucha" },
  { text: "Jaký člen má Defekt?", options: ["der", "die", "das"], correct: 0, translation: "závada" },
  { text: "Jaký člen má Schraube?", options: ["der", "die", "das"], correct: 1, translation: "šroub" },
  { text: "Jaký člen má Bohrmaschine?", options: ["der", "die", "das"], correct: 1, translation: "vrtačka" },
];

export const FILL_QUESTIONS: FillQuestion[] = [
  { sentence: "Ich ___ Deutsch.", answer: "spreche", translation: "Já mluvím německy." },
  { sentence: "Er ___ ein Buch.", answer: "liest", translation: "On čte knihu." },
  { sentence: "Wir ___ nach Hause.", answer: "gehen", translation: "My jdeme domů." },
  { sentence: "Sie ___ Kaffee.", answer: "trinkt", translation: "Ona pije kávu." },
  { sentence: "Du ___ sehr schnell.", answer: "läufst", translation: "Ty běžíš velmi rychle." },
  { sentence: "Ich ___ müde.", answer: "bin", translation: "Já jsem unavený/á." },
  { sentence: "Er ___ Lehrer.", answer: "ist", translation: "On je učitel." },
  { sentence: "Wir ___ Studenten.", answer: "sind", translation: "My jsme studenti." },
  { sentence: "Sie ___ eine Katze.", answer: "hat", translation: "Ona má kočku." },
  { sentence: "Du ___ Hunger.", answer: "hast", translation: "Ty máš hlad." },
  { sentence: "Ich ___ gern Musik.", answer: "höre", translation: "Já rád/a poslouchám hudbu." },
  { sentence: "Er ___ Fußball.", answer: "spielt", translation: "On hraje fotbal." },
  { sentence: "Wir ___ ins Kino.", answer: "gehen", translation: "My jdeme do kina." },
  { sentence: "Sie ___ sehr gut.", answer: "kocht", translation: "Ona vaří velmi dobře." },
  { sentence: "Du ___ schön.", answer: "singst", translation: "Ty zpíváš krásně." },
  { sentence: "Ich ___ Wasser.", answer: "trinke", translation: "Já piji vodu." },
  { sentence: "Er ___ die Tür.", answer: "öffnet", translation: "On otevírá dveře." },
  { sentence: "Wir ___ Deutsch.", answer: "lernen", translation: "My se učíme německy." },
  { sentence: "Sie ___ das Fenster.", answer: "schließt", translation: "Ona zavírá okno." },
  { sentence: "Du ___ mir.", answer: "hilfst", translation: "Ty mi pomáháš." },
  { sentence: "Wann ___ du an zu arbeiten?", answer: "fängst", translation: "Kdy začínáš pracovat?" },
  { sentence: "Hast du heute viel ___?", answer: "Arbeit", translation: "Máš dnes hodně práce?" },
  { sentence: "Kannst du mir damit ___?", answer: "helfen", translation: "Můžeš mi s tím pomoct?" },
  { sentence: "Wer ist dafür ___?", answer: "verantwortlich", translation: "Kdo je za to zodpovědný?" },
  { sentence: "Ich ___ mehr Zeit.", answer: "brauche", translation: "Potřebuji více času." },
  { sentence: "Das ist nicht meine ___.", answer: "Verantwortung", translation: "To není moje zodpovědnost." },
  { sentence: "Ich habe einen Fehler ___.", answer: "gemacht", translation: "Udělal jsem chybu." },
  { sentence: "Wo sind die ___?", answer: "Schutzhandschuhe", translation: "Kde jsou ochranné rukavice?" },
  { sentence: "Muss ich eine Schutzbrille ___?", answer: "tragen", translation: "Musím nosit ochranné brýle?" },
  { sentence: "Das ist ___.", answer: "gefährlich", translation: "To je nebezpečné." },
  { sentence: "___ auf!", answer: "Pass", translation: "Dávej pozor!" },
  { sentence: "Die Maschine ist ___.", answer: "kaputt", translation: "Ten stroj je rozbitý." },
  { sentence: "Wer ist für die Sicherheit ___?", answer: "verantwortlich", translation: "Kdo je zodpovědný za bezpečnost?" },
  { sentence: "Wir sollten das ___.", answer: "melden", translation: "Měli bychom to nahlásit." },
  { sentence: "Ich brauche eine ___.", answer: "Sicherheitsschulung", translation: "Potřebuji bezpečnostní školení." },
  { sentence: "Kannst du die Maschine ___?", answer: "ausschalten", translation: "Můžeš vypnout ten stroj?" },
  { sentence: "Kannst du mir das ___?", answer: "erklären", translation: "Můžeš mi to vysvětlit?" },
  { sentence: "Ich bin nicht deiner ___.", answer: "Meinung", translation: "Nesouhlasím s tebou." },
  { sentence: "Das ist keine gute ___.", answer: "Idee", translation: "To není dobrý nápad." },
  { sentence: "Hast du heute ___?", answer: "Zeit", translation: "Máš dnes čas?" },
  { sentence: "Machen wir das ___?", answer: "zusammen", translation: "Uděláme to společně?" },
  { sentence: "Das ist nicht ___.", answer: "fair", translation: "To není fér." },
  { sentence: "Das ist nicht mein ___.", answer: "Problem", translation: "To není můj problém." },
  { sentence: "Können wir eine Lösung ___?", answer: "finden", translation: "Můžeme najít řešení?" },
  { sentence: "Warum hast du das ___?", answer: "gemacht", translation: "Proč jsi to udělal?" },
  { sentence: "Das war ein ___.", answer: "Missverständnis", translation: "To bylo nedorozumění." },
  { sentence: "Ich habe eine ___.", answer: "Frage", translation: "Mám otázku." },
  { sentence: "Ich brauche ___.", answer: "Urlaub", translation: "Potřebuji dovolenou." },
  { sentence: "Mein Kind ist ___.", answer: "krank", translation: "Moje dítě je nemocné." },
  { sentence: "Ich bin damit nicht ___.", answer: "zufrieden", translation: "Nejsem s tím spokojený." },
  { sentence: "Ich entschuldige mich für den ___.", answer: "Fehler", translation: "Omlouvám se za chybu." },
];

// Helper to extract German word from question text
function extractGermanWord(q: Question): string {
  const match = q.text.match(/má\s+(.+)\?/);
  return match ? match[1] : "";
}

// Helper to get article for a question
function getArticle(q: Question): string {
  return q.options[q.correct];
}

export interface FlashCard {
  german: string;
  czech: string;
  type: "noun" | "sentence";
}

export function getAllFlashCards(): FlashCard[] {
  const nounCards: FlashCard[] = QUESTIONS.map((q) => ({
    german: `${getArticle(q)} ${extractGermanWord(q)}`,
    czech: q.translation,
    type: "noun" as const,
  }));

  const sentenceCards: FlashCard[] = FILL_QUESTIONS.map((q) => ({
    german: q.sentence.replace("___", q.answer),
    czech: q.translation,
    type: "sentence" as const,
  }));

  return [...nounCards, ...sentenceCards];
}
