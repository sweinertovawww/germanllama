// Present-tense (Präsens) conjugation data for the "Llama Labyrint" verb game.
// Verbs are the ones already used in the beginnerStories sentence-structure
// exercises (life-in-germany, shopping, cooking) — so a learner meets each verb
// in a full sentence first, then drills its conjugation here.
import type { Lang } from "@/i18n/translations";

export type Pronoun = "ich" | "du" | "er" | "wir" | "ihr" | "sie";

export const PRONOUNS: Pronoun[] = ["ich", "du", "er", "wir", "ihr", "sie"];
const PRONOUN_INDEX: Record<Pronoun, number> = { ich: 0, du: 1, er: 2, wir: 3, ihr: 4, sie: 5 };

/** Display label for a pronoun slot — "er" stands in for er/sie/es, "sie" for sie/Sie. */
export const PRONOUN_LABEL: Record<Pronoun, string> = {
  ich: "ich",
  du: "du",
  er: "er/sie/es",
  wir: "wir",
  ihr: "ihr",
  sie: "sie/Sie",
};

/** German pronoun spellings a typed answer may include for a given slot — used to build the accepted-answer string. */
const GERMAN_PRONOUN_VARIANTS: Record<Pronoun, string[]> = {
  ich: ["ich"],
  du: ["du"],
  er: ["er", "sie", "es"],
  wir: ["wir"],
  ihr: ["ihr"],
  sie: ["sie"],
};

/** [ich, du, er, wir, ihr, sie] native-language present-tense forms. Korean doesn't conjugate by person, so it's a single string. */
type NativeSixForms = [string, string, string, string, string, string];
interface NativeForms {
  cs: NativeSixForms;
  en: NativeSixForms;
  pl: NativeSixForms;
  uk: NativeSixForms;
  sk: NativeSixForms;
  ko: string;
}

export interface VerbConjugation {
  infinitive: string;
  translation: string;
  translationKo: string;
  translationEn?: string;
  translationPl?: string;
  translationUk?: string;
  translationSk?: string;
  forms: Record<Pronoun, string>;
  nativeForms: NativeForms;
  /** Disambiguation appended to the native phrase in languages where the translated verb is otherwise
   *  ambiguous — e.g. Czech/Slovak "stát" = both "to cost" and "to stand", identical conjugated forms. */
  phraseNote?: Partial<Record<Lang, string>>;
}

/** Picks the right-language translation off a verb, falling back to Czech — same convention as vocabularyData's getTranslation. */
export function getVerbTranslation(v: VerbConjugation, lang: Lang): string {
  if (lang === "ko") return v.translationKo;
  if (lang === "en") return v.translationEn ?? v.translation;
  if (lang === "pl") return v.translationPl ?? v.translation;
  if (lang === "uk") return v.translationUk ?? v.translationEn ?? v.translation;
  if (lang === "sk") return v.translationSk ?? v.translation;
  return v.translation;
}

/** The native-language conjugated verb form for one pronoun slot (falls back to English for the unused "de" UI-lang case). */
export function getNativeVerbForm(verb: VerbConjugation, lang: Lang, pronoun: Pronoun): string {
  if (lang === "ko") return verb.nativeForms.ko;
  const table = lang === "de" ? verb.nativeForms.en : verb.nativeForms[lang];
  return table[PRONOUN_INDEX[pronoun]];
}

const ER_WORDS: Record<Lang, string[]> = {
  cs: ["on", "ona", "ono"],
  en: ["he", "she", "it"],
  pl: ["on", "ona", "ono"],
  de: ["er", "sie", "es"],
  uk: ["він", "вона", "воно"],
  sk: ["on", "ona", "ono"],
  ko: ["그는", "그녀는", "그것은"],
};

const PRONOUN_WORDS: Record<Lang, Record<Exclude<Pronoun, "er">, string>> = {
  cs: { ich: "já", du: "ty", wir: "my", ihr: "vy", sie: "oni" },
  en: { ich: "I", du: "you", wir: "we", ihr: "you", sie: "they" },
  pl: { ich: "ja", du: "ty", wir: "my", ihr: "wy", sie: "oni" },
  de: { ich: "ich", du: "du", wir: "wir", ihr: "ihr", sie: "sie" },
  uk: { ich: "я", du: "ти", wir: "ми", ihr: "ви", sie: "вони" },
  sk: { ich: "ja", du: "ty", wir: "my", ihr: "vy", sie: "oni" },
  ko: { ich: "저는", du: "너는", wir: "우리는", ihr: "너희는", sie: "그들은" },
};

/** Native pronoun word for a slot — "er" picks randomly between he/she/it (matching whichever gender variant a phrase shows). */
export function getNativePronounWord(lang: Lang, pronoun: Pronoun): string {
  if (pronoun === "er") {
    const opts = ER_WORDS[lang];
    return opts[Math.floor(Math.random() * opts.length)];
  }
  return PRONOUN_WORDS[lang][pronoun];
}

/** A short native-language phrase like "on vaří" for the star-quiz prompt. */
export function getNativePhrase(verb: VerbConjugation, lang: Lang, pronoun: Pronoun): string {
  const base = `${getNativePronounWord(lang, pronoun)} ${getNativeVerbForm(verb, lang, pronoun)}`;
  const note = verb.phraseNote?.[lang];
  return note ? `${base} ${note}` : base;
}

/** Accepted-answer string for isTranslationCorrect — "/"-separated variants covering "<pronoun> <form>" and the bare form. */
export function getGermanAnswer(verb: VerbConjugation, pronoun: Pronoun): string {
  const form = verb.forms[pronoun];
  const withPronoun = GERMAN_PRONOUN_VARIANTS[pronoun].map((p) => `${p} ${form}`);
  return [...withPronoun, form].join("/");
}

export const VERB_CONJUGATIONS: VerbConjugation[] = [
  {
    infinitive: "leben",
    translation: "žít",
    translationKo: "살다",
    translationEn: "to live",
    translationPl: "żyć",
    translationUk: "жити",
    translationSk: "žiť",
    forms: { ich: "lebe", du: "lebst", er: "lebt", wir: "leben", ihr: "lebt", sie: "leben" },
    nativeForms: {
      cs: ["žiju", "žiješ", "žije", "žijeme", "žijete", "žijí"],
      en: ["live", "live", "lives", "live", "live", "live"],
      pl: ["żyję", "żyjesz", "żyje", "żyjemy", "żyjecie", "żyją"],
      uk: ["живу", "живеш", "живе", "живемо", "живете", "живуть"],
      sk: ["žijem", "žiješ", "žije", "žijeme", "žijete", "žijú"],
      ko: "살아요",
    },
  },
  {
    infinitive: "arbeiten",
    translation: "pracovat",
    translationKo: "일하다",
    translationEn: "to work",
    translationPl: "pracować",
    translationUk: "працювати",
    translationSk: "pracovať",
    forms: { ich: "arbeite", du: "arbeitest", er: "arbeitet", wir: "arbeiten", ihr: "arbeitet", sie: "arbeiten" },
    nativeForms: {
      cs: ["pracuju", "pracuješ", "pracuje", "pracujeme", "pracujete", "pracují"],
      en: ["work", "work", "works", "work", "work", "work"],
      pl: ["pracuję", "pracujesz", "pracuje", "pracujemy", "pracujecie", "pracują"],
      uk: ["працюю", "працюєш", "працює", "працюємо", "працюєте", "працюють"],
      sk: ["pracujem", "pracuješ", "pracuje", "pracujeme", "pracujete", "pracujú"],
      ko: "일해요",
    },
  },
  {
    infinitive: "gehen",
    translation: "jít, chodit",
    translationKo: "가다",
    translationEn: "to go",
    translationPl: "iść",
    translationUk: "йти",
    translationSk: "ísť",
    forms: { ich: "gehe", du: "gehst", er: "geht", wir: "gehen", ihr: "geht", sie: "gehen" },
    nativeForms: {
      cs: ["jdu", "jdeš", "jde", "jdeme", "jdete", "jdou"],
      en: ["go", "go", "goes", "go", "go", "go"],
      pl: ["idę", "idziesz", "idzie", "idziemy", "idziecie", "idą"],
      uk: ["йду", "йдеш", "йде", "йдемо", "йдете", "йдуть"],
      sk: ["idem", "ideš", "ide", "ideme", "idete", "idú"],
      ko: "가요",
    },
  },
  {
    infinitive: "haben",
    translation: "mít",
    translationKo: "가지다",
    translationEn: "to have",
    translationPl: "mieć",
    translationUk: "мати",
    translationSk: "mať",
    forms: { ich: "habe", du: "hast", er: "hat", wir: "haben", ihr: "habt", sie: "haben" },
    nativeForms: {
      cs: ["mám", "máš", "má", "máme", "máte", "mají"],
      en: ["have", "have", "has", "have", "have", "have"],
      pl: ["mam", "masz", "ma", "mamy", "macie", "mają"],
      uk: ["маю", "маєш", "має", "маємо", "маєте", "мають"],
      sk: ["mám", "máš", "má", "máme", "máte", "majú"],
      ko: "있어요",
    },
  },
  {
    infinitive: "sein",
    translation: "být",
    translationKo: "이다",
    translationEn: "to be",
    translationPl: "być",
    translationUk: "бути",
    translationSk: "byť",
    forms: { ich: "bin", du: "bist", er: "ist", wir: "sind", ihr: "seid", sie: "sind" },
    nativeForms: {
      cs: ["jsem", "jsi", "je", "jsme", "jste", "jsou"],
      en: ["am", "are", "is", "are", "are", "are"],
      pl: ["jestem", "jesteś", "jest", "jesteśmy", "jesteście", "są"],
      uk: ["є", "є", "є", "є", "є", "є"],
      sk: ["som", "si", "je", "sme", "ste", "sú"],
      ko: "이에요",
    },
  },
  {
    infinitive: "sprechen",
    translation: "mluvit",
    translationKo: "말하다",
    translationEn: "to speak",
    translationPl: "mówić",
    translationUk: "говорити",
    translationSk: "hovoriť",
    forms: { ich: "spreche", du: "sprichst", er: "spricht", wir: "sprechen", ihr: "sprecht", sie: "sprechen" },
    nativeForms: {
      cs: ["mluvím", "mluvíš", "mluví", "mluvíme", "mluvíte", "mluví"],
      en: ["speak", "speak", "speaks", "speak", "speak", "speak"],
      pl: ["mówię", "mówisz", "mówi", "mówimy", "mówicie", "mówią"],
      uk: ["говорю", "говориш", "говорить", "говоримо", "говорите", "говорять"],
      sk: ["hovorím", "hovoríš", "hovorí", "hovoríme", "hovoríte", "hovoria"],
      ko: "말해요",
    },
  },
  {
    infinitive: "lernen",
    translation: "učit se",
    translationKo: "배우다",
    translationEn: "to learn",
    translationPl: "uczyć się",
    translationUk: "вчити",
    translationSk: "učiť sa",
    forms: { ich: "lerne", du: "lernst", er: "lernt", wir: "lernen", ihr: "lernt", sie: "lernen" },
    nativeForms: {
      cs: ["učím se", "učíš se", "učí se", "učíme se", "učíte se", "učí se"],
      en: ["learn", "learn", "learns", "learn", "learn", "learn"],
      pl: ["uczę się", "uczysz się", "uczy się", "uczymy się", "uczycie się", "uczą się"],
      uk: ["вчу", "вчиш", "вчить", "вчимо", "вчите", "вчать"],
      sk: ["učím sa", "učíš sa", "učí sa", "učíme sa", "učíte sa", "učia sa"],
      ko: "배워요",
    },
  },
  {
    infinitive: "mögen",
    translation: "mít rád",
    translationKo: "좋아하다",
    translationEn: "to like",
    translationPl: "lubić",
    translationUk: "любити",
    translationSk: "mať rád",
    forms: { ich: "mag", du: "magst", er: "mag", wir: "mögen", ihr: "mögt", sie: "mögen" },
    nativeForms: {
      cs: ["mám rád", "máš rád", "má rád", "máme rádi", "máte rádi", "mají rádi"],
      en: ["like", "like", "likes", "like", "like", "like"],
      pl: ["lubię", "lubisz", "lubi", "lubimy", "lubicie", "lubią"],
      uk: ["люблю", "любиш", "любить", "любимо", "любите", "люблять"],
      sk: ["mám rád", "máš rád", "má rád", "máme radi", "máte radi", "majú radi"],
      ko: "좋아해요",
    },
  },
  {
    infinitive: "brauchen",
    translation: "potřebovat",
    translationKo: "필요하다",
    translationEn: "to need",
    translationPl: "potrzebować",
    translationUk: "потребувати",
    translationSk: "potrebovať",
    forms: { ich: "brauche", du: "brauchst", er: "braucht", wir: "brauchen", ihr: "braucht", sie: "brauchen" },
    nativeForms: {
      cs: ["potřebuju", "potřebuješ", "potřebuje", "potřebujeme", "potřebujete", "potřebují"],
      en: ["need", "need", "needs", "need", "need", "need"],
      pl: ["potrzebuję", "potrzebujesz", "potrzebuje", "potrzebujemy", "potrzebujecie", "potrzebują"],
      uk: ["потребую", "потребуєш", "потребує", "потребуємо", "потребуєте", "потребують"],
      sk: ["potrebujem", "potrebuješ", "potrebuje", "potrebujeme", "potrebujete", "potrebujú"],
      ko: "필요해요",
    },
  },
  {
    infinitive: "kaufen",
    translation: "kupovat",
    translationKo: "사다",
    translationEn: "to buy",
    translationPl: "kupować",
    translationUk: "купувати",
    translationSk: "kupovať",
    forms: { ich: "kaufe", du: "kaufst", er: "kauft", wir: "kaufen", ihr: "kauft", sie: "kaufen" },
    nativeForms: {
      cs: ["kupuju", "kupuješ", "kupuje", "kupujeme", "kupujete", "kupují"],
      en: ["buy", "buy", "buys", "buy", "buy", "buy"],
      pl: ["kupuję", "kupujesz", "kupuje", "kupujemy", "kupujecie", "kupują"],
      uk: ["купую", "купуєш", "купує", "купуємо", "купуєте", "купують"],
      sk: ["kupujem", "kupuješ", "kupuje", "kupujeme", "kupujete", "kupujú"],
      ko: "사요",
    },
  },
  {
    infinitive: "kosten",
    translation: "stát (o ceně)",
    translationKo: "(값이) 들다",
    translationEn: "to cost",
    translationPl: "kosztować",
    translationUk: "коштувати",
    translationSk: "stáť (o cene)",
    forms: { ich: "koste", du: "kostest", er: "kostet", wir: "kosten", ihr: "kostet", sie: "kosten" },
    nativeForms: {
      cs: ["stojím", "stojíš", "stojí", "stojíme", "stojíte", "stojí"],
      en: ["cost", "cost", "costs", "cost", "cost", "cost"],
      pl: ["kosztuję", "kosztujesz", "kosztuje", "kosztujemy", "kosztujecie", "kosztują"],
      uk: ["коштую", "коштуєш", "коштує", "коштуємо", "коштуєте", "коштують"],
      sk: ["stojím", "stojíš", "stojí", "stojíme", "stojíte", "stoja"],
      ko: "들어요",
    },
    // "stát"/"stáť" is a Czech/Slovak homonym (to cost vs. to stand) with identical conjugated forms,
    // and Korean "들다" alone is similarly ambiguous (lift/hold/enter/...) — spell out which sense.
    phraseNote: { cs: "(o ceně)", sk: "(o cene)", ko: "(가격)" },
  },
  {
    infinitive: "bezahlen",
    translation: "platit",
    translationKo: "지불하다",
    translationEn: "to pay",
    translationPl: "płacić",
    translationUk: "платити",
    translationSk: "platiť",
    forms: { ich: "bezahle", du: "bezahlst", er: "bezahlt", wir: "bezahlen", ihr: "bezahlt", sie: "bezahlen" },
    nativeForms: {
      cs: ["platím", "platíš", "platí", "platíme", "platíte", "platí"],
      en: ["pay", "pay", "pays", "pay", "pay", "pay"],
      pl: ["płacę", "płacisz", "płaci", "płacimy", "płacicie", "płacą"],
      uk: ["плачу", "платиш", "платить", "платимо", "платите", "платять"],
      sk: ["platím", "platíš", "platí", "platíme", "platíte", "platia"],
      ko: "지불해요",
    },
  },
  {
    infinitive: "schließen",
    translation: "zavírat",
    translationKo: "닫다",
    translationEn: "to close",
    translationPl: "zamykać",
    translationUk: "закривати",
    translationSk: "zatvárať",
    forms: { ich: "schließe", du: "schließt", er: "schließt", wir: "schließen", ihr: "schließt", sie: "schließen" },
    nativeForms: {
      cs: ["zavírám", "zavíráš", "zavírá", "zavíráme", "zavíráte", "zavírají"],
      en: ["close", "close", "closes", "close", "close", "close"],
      pl: ["zamykam", "zamykasz", "zamyka", "zamykamy", "zamykacie", "zamykają"],
      uk: ["закриваю", "закриваєш", "закриває", "закриваємо", "закриваєте", "закривають"],
      sk: ["zatváram", "zatváraš", "zatvára", "zatvárame", "zatvárate", "zatvárajú"],
      ko: "닫아요",
    },
  },
  {
    infinitive: "packen",
    translation: "balit",
    translationKo: "싸다",
    translationEn: "to pack",
    translationPl: "pakować",
    translationUk: "пакувати",
    translationSk: "baliť",
    forms: { ich: "packe", du: "packst", er: "packt", wir: "packen", ihr: "packt", sie: "packen" },
    nativeForms: {
      cs: ["balím", "balíš", "balí", "balíme", "balíte", "balí"],
      en: ["pack", "pack", "packs", "pack", "pack", "pack"],
      pl: ["pakuję", "pakujesz", "pakuje", "pakujemy", "pakujecie", "pakują"],
      uk: ["пакую", "пакуєш", "пакує", "пакуємо", "пакуєте", "пакують"],
      sk: ["balím", "bališ", "balí", "balíme", "balíte", "balia"],
      ko: "싸요",
    },
  },
  {
    infinitive: "kochen",
    translation: "vařit",
    translationKo: "요리하다",
    translationEn: "to cook",
    translationPl: "gotować",
    translationUk: "готувати",
    translationSk: "variť",
    forms: { ich: "koche", du: "kochst", er: "kocht", wir: "kochen", ihr: "kocht", sie: "kochen" },
    nativeForms: {
      cs: ["vařím", "vaříš", "vaří", "vaříme", "vaříte", "vaří"],
      en: ["cook", "cook", "cooks", "cook", "cook", "cook"],
      pl: ["gotuję", "gotujesz", "gotuje", "gotujemy", "gotujecie", "gotują"],
      uk: ["готую", "готуєш", "готує", "готуємо", "готуєте", "готують"],
      sk: ["varím", "varíš", "varí", "varíme", "varíte", "varia"],
      ko: "요리해요",
    },
  },
  {
    infinitive: "machen",
    translation: "dělat",
    translationKo: "하다",
    translationEn: "to make/do",
    translationPl: "robić",
    translationUk: "робити",
    translationSk: "robiť",
    forms: { ich: "mache", du: "machst", er: "macht", wir: "machen", ihr: "macht", sie: "machen" },
    nativeForms: {
      cs: ["dělám", "děláš", "dělá", "děláme", "děláte", "dělají"],
      en: ["do", "do", "does", "do", "do", "do"],
      pl: ["robię", "robisz", "robi", "robimy", "robicie", "robią"],
      uk: ["роблю", "робиш", "робить", "робимо", "робите", "роблять"],
      sk: ["robím", "robíš", "robí", "robíme", "robíte", "robia"],
      ko: "해요",
    },
  },
  {
    infinitive: "riechen",
    translation: "vonět",
    translationKo: "냄새가 나다",
    translationEn: "to smell",
    translationPl: "pachnieć",
    translationUk: "пахнути",
    translationSk: "voňať",
    forms: { ich: "rieche", du: "riechst", er: "riecht", wir: "riechen", ihr: "riecht", sie: "riechen" },
    nativeForms: {
      cs: ["voním", "voníš", "voní", "voníme", "voníte", "voní"],
      en: ["smell", "smell", "smells", "smell", "smell", "smell"],
      pl: ["pachnę", "pachniesz", "pachnie", "pachniemy", "pachniecie", "pachną"],
      uk: ["пахну", "пахнеш", "пахне", "пахнемо", "пахнете", "пахнуть"],
      sk: ["voniam", "voniaš", "vonia", "voniame", "voniate", "voniajú"],
      ko: "냄새가 나요",
    },
  },
  {
    infinitive: "schneiden",
    translation: "krájet",
    translationKo: "자르다",
    translationEn: "to cut",
    translationPl: "kroić",
    translationUk: "різати",
    translationSk: "krájať",
    forms: { ich: "schneide", du: "schneidest", er: "schneidet", wir: "schneiden", ihr: "schneidet", sie: "schneiden" },
    nativeForms: {
      cs: ["krájím", "krájíš", "krájí", "krájíme", "krájíte", "krájí"],
      en: ["cut", "cut", "cuts", "cut", "cut", "cut"],
      pl: ["kroję", "kroisz", "kroi", "kroimy", "kroicie", "kroją"],
      uk: ["ріжу", "ріжеш", "ріже", "ріжемо", "ріжете", "ріжуть"],
      sk: ["krájam", "krájaš", "krája", "krájame", "krájate", "krájajú"],
      ko: "잘라요",
    },
  },
  {
    infinitive: "würzen",
    translation: "kořenit",
    translationKo: "양념하다",
    translationEn: "to season",
    translationPl: "przyprawiać",
    translationUk: "приправляти",
    translationSk: "koreniť",
    forms: { ich: "würze", du: "würzt", er: "würzt", wir: "würzen", ihr: "würzt", sie: "würzen" },
    nativeForms: {
      cs: ["kořením", "kořeníš", "koření", "kořeníme", "kořeníte", "koření"],
      en: ["season", "season", "seasons", "season", "season", "season"],
      pl: ["przyprawiam", "przyprawiasz", "przyprawia", "przyprawiamy", "przyprawiacie", "przyprawiają"],
      uk: ["приправляю", "приправляєш", "приправляє", "приправляємо", "приправляєте", "приправляють"],
      sk: ["korením", "koreníš", "korení", "koreníme", "koreníte", "korenia"],
      ko: "양념해요",
    },
  },
  {
    infinitive: "essen",
    translation: "jíst",
    translationKo: "먹다",
    translationEn: "to eat",
    translationPl: "jeść",
    translationUk: "їсти",
    translationSk: "jesť",
    forms: { ich: "esse", du: "isst", er: "isst", wir: "essen", ihr: "esst", sie: "essen" },
    nativeForms: {
      cs: ["jím", "jíš", "jí", "jíme", "jíte", "jedí"],
      en: ["eat", "eat", "eats", "eat", "eat", "eat"],
      pl: ["jem", "jesz", "je", "jemy", "jecie", "jedzą"],
      uk: ["їм", "їси", "їсть", "їмо", "їсте", "їдять"],
      sk: ["jem", "ješ", "je", "jeme", "jete", "jedia"],
      ko: "먹어요",
    },
  },
  {
    infinitive: "schmecken",
    translation: "chutnat",
    translationKo: "맛이 나다",
    translationEn: "to taste",
    translationPl: "smakować",
    translationUk: "смакувати",
    translationSk: "chutiť",
    forms: { ich: "schmecke", du: "schmeckst", er: "schmeckt", wir: "schmecken", ihr: "schmeckt", sie: "schmecken" },
    nativeForms: {
      cs: ["chutnám", "chutnáš", "chutná", "chutnáme", "chutnáte", "chutnají"],
      en: ["taste", "taste", "tastes", "taste", "taste", "taste"],
      pl: ["smakuję", "smakujesz", "smakuje", "smakujemy", "smakujecie", "smakują"],
      uk: ["смакую", "смакуєш", "смакує", "смакуємо", "смакуєте", "смакують"],
      sk: ["chutím", "chutíš", "chutí", "chutíme", "chutíte", "chutia"],
      ko: "맛이 나요",
    },
  },
];
