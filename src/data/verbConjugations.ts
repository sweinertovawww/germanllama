// Present-tense (Präsens) conjugation data for the "Llama Labyrint" verb game.
// Verbs are the ones already used in the beginnerStories sentence-structure
// exercises (life-in-germany, shopping, cooking) — so a learner meets each verb
// in a full sentence first, then drills its conjugation here.
import type { Lang } from "@/i18n/translations";

export type Pronoun = "ich" | "du" | "er" | "wir" | "ihr" | "sie";

export const PRONOUNS: Pronoun[] = ["ich", "du", "er", "wir", "ihr", "sie"];

/** Display label for a pronoun slot — "er" stands in for er/sie/es, "sie" for sie/Sie. */
export const PRONOUN_LABEL: Record<Pronoun, string> = {
  ich: "ich",
  du: "du",
  er: "er/sie/es",
  wir: "wir",
  ihr: "ihr",
  sie: "sie/Sie",
};

export interface VerbConjugation {
  infinitive: string;
  translation: string;
  translationKo: string;
  translationEn?: string;
  translationPl?: string;
  translationUk?: string;
  translationSk?: string;
  forms: Record<Pronoun, string>;
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
  },
  {
    infinitive: "schmecken",
    translation: "chutnat",
    translationKo: "맛이 나다",
    translationEn: "to taste",
    translationPl: "smakować",
    translationUk: "бути на смак",
    translationSk: "chutiť",
    forms: { ich: "schmecke", du: "schmeckst", er: "schmeckt", wir: "schmecken", ihr: "schmeckt", sie: "schmecken" },
  },
];
