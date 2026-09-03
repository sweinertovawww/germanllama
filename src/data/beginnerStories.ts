// Content for the "Start German From the Beginning" section.
import type { Lang } from "@/i18n/translations";

export interface StoryChunk {
  /** One or more words that belong together (e.g. "a nice apartment") */
  text: string;
  /** Pairing index shared between the matching native-language and German chunk in the same sentence */
  pair: number;
}

export interface StorySentence {
  german: StoryChunk[];
  /** Native-language side, keyed by UI language. Falls back to "en" if a language is missing. */
  native: Partial<Record<Lang, StoryChunk[]>>;
}

export interface Story {
  id: string;
  title: Partial<Record<Lang, string>>;
  sentences: StorySentence[];
}

export interface StoryWord {
  text: string;
  pair: number;
}

/** Splits a sentence's chunks into individual words, keeping each word's pair color. */
export function chunksToWords(chunks: StoryChunk[]): StoryWord[] {
  return chunks.flatMap((chunk) => chunk.text.split(" ").map((text) => ({ text, pair: chunk.pair })));
}

/** Picks the native-language chunks for a sentence, falling back to English. */
export function getNativeChunks(sentence: StorySentence, lang: Lang): StoryChunk[] {
  return sentence.native[lang] ?? sentence.native.en ?? [];
}

/** Picks the story title in the given language, falling back to English. */
export function getStoryTitle(story: Story, lang: Lang): string {
  return story.title[lang] ?? story.title.en ?? "";
}

export interface VocabPair {
  native: string;
  de: string;
}

/** Every unique native/German chunk pair used in the story (for vocabulary drilling). */
export function getStoryVocabPairs(story: Story, lang: Lang): VocabPair[] {
  const seen = new Set<string>();
  const pairs: VocabPair[] = [];
  for (const sentence of story.sentences) {
    for (const nativeChunk of getNativeChunks(sentence, lang)) {
      const deChunk = sentence.german.find((c) => c.pair === nativeChunk.pair);
      if (!deChunk) continue;
      const native = nativeChunk.text.replace(/[.,!?]+$/, "");
      const de = deChunk.text.replace(/[.,!?]+$/, "");
      const key = `${native}::${de}`;
      if (seen.has(key)) continue;
      seen.add(key);
      pairs.push({ native, de });
    }
  }
  return pairs;
}

export const PAIR_COLOR_CLASSES = [
  "text-green-600",
  "text-blue-600",
  "text-red-600",
  "text-amber-600",
  "text-purple-600",
  "text-teal-600",
];

export function pairColorClass(pair: number): string {
  return PAIR_COLOR_CLASSES[(pair - 1) % PAIR_COLOR_CLASSES.length];
}

export const STORIES: Story[] = [
  {
    id: "life-in-germany",
    title: {
      cs: "Život a práce v Německu",
      en: "Life and Work in Germany",
      pl: "Życie i praca w Niemczech",
      ko: "독일에서의 삶과 일",
      uk: "Життя і робота в Німеччині",
      sk: "Život a práca v Nemecku",
    },
    sentences: [
      {
        german: [{ text: "Ich", pair: 1 }, { text: "lebe", pair: 2 }, { text: "in", pair: 3 }, { text: "Deutschland.", pair: 4 }],
        native: {
          en: [{ text: "I", pair: 1 }, { text: "live", pair: 2 }, { text: "in", pair: 3 }, { text: "Germany.", pair: 4 }],
          cs: [{ text: "Já", pair: 1 }, { text: "žiju", pair: 2 }, { text: "v", pair: 3 }, { text: "Německu.", pair: 4 }],
          pl: [{ text: "Ja", pair: 1 }, { text: "mieszkam", pair: 2 }, { text: "w", pair: 3 }, { text: "Niemczech.", pair: 4 }],
          ko: [{ text: "저는", pair: 1 }, { text: "독일", pair: 4 }, { text: "에서", pair: 3 }, { text: "살아요.", pair: 2 }],
          uk: [{ text: "Я", pair: 1 }, { text: "живу", pair: 2 }, { text: "в", pair: 3 }, { text: "Німеччині.", pair: 4 }],
          sk: [{ text: "Ja", pair: 1 }, { text: "žijem", pair: 2 }, { text: "v", pair: 3 }, { text: "Nemecku.", pair: 4 }],
        },
      },
      {
        german: [{ text: "Ich", pair: 1 }, { text: "arbeite", pair: 2 }, { text: "in", pair: 3 }, { text: "Berlin.", pair: 4 }],
        native: {
          en: [{ text: "I", pair: 1 }, { text: "work", pair: 2 }, { text: "in", pair: 3 }, { text: "Berlin.", pair: 4 }],
          cs: [{ text: "Já", pair: 1 }, { text: "pracuju", pair: 2 }, { text: "v", pair: 3 }, { text: "Berlíně.", pair: 4 }],
          pl: [{ text: "Ja", pair: 1 }, { text: "pracuję", pair: 2 }, { text: "w", pair: 3 }, { text: "Berlinie.", pair: 4 }],
          ko: [{ text: "저는", pair: 1 }, { text: "베를린", pair: 4 }, { text: "에서", pair: 3 }, { text: "일해요.", pair: 2 }],
          uk: [{ text: "Я", pair: 1 }, { text: "працюю", pair: 2 }, { text: "в", pair: 3 }, { text: "Берліні.", pair: 4 }],
          sk: [{ text: "Ja", pair: 1 }, { text: "pracujem", pair: 2 }, { text: "v", pair: 3 }, { text: "Berlíne.", pair: 4 }],
        },
      },
      {
        german: [{ text: "Ich", pair: 1 }, { text: "gehe", pair: 2 }, { text: "jeden Tag", pair: 4 }, { text: "zur Arbeit.", pair: 3 }],
        native: {
          en: [{ text: "I", pair: 1 }, { text: "go", pair: 2 }, { text: "to work", pair: 3 }, { text: "every day.", pair: 4 }],
          cs: [{ text: "Já", pair: 1 }, { text: "chodím", pair: 2 }, { text: "každý den", pair: 4 }, { text: "do práce.", pair: 3 }],
          pl: [{ text: "Ja", pair: 1 }, { text: "chodzę", pair: 2 }, { text: "codziennie", pair: 4 }, { text: "do pracy.", pair: 3 }],
          ko: [{ text: "저는", pair: 1 }, { text: "매일", pair: 4 }, { text: "회사에", pair: 3 }, { text: "가요.", pair: 2 }],
          uk: [{ text: "Я", pair: 1 }, { text: "ходжу", pair: 2 }, { text: "щодня", pair: 4 }, { text: "на роботу.", pair: 3 }],
          sk: [{ text: "Ja", pair: 1 }, { text: "chodím", pair: 2 }, { text: "každý deň", pair: 4 }, { text: "do práce.", pair: 3 }],
        },
      },
      {
        german: [{ text: "Ich", pair: 1 }, { text: "habe", pair: 2 }, { text: "eine schöne Wohnung.", pair: 3 }],
        native: {
          en: [{ text: "I", pair: 1 }, { text: "have", pair: 2 }, { text: "a nice apartment.", pair: 3 }],
          cs: [{ text: "Já", pair: 1 }, { text: "mám", pair: 2 }, { text: "pěkný byt.", pair: 3 }],
          pl: [{ text: "Ja", pair: 1 }, { text: "mam", pair: 2 }, { text: "ładne mieszkanie.", pair: 3 }],
          ko: [{ text: "저는", pair: 1 }, { text: "좋은 집이", pair: 3 }, { text: "있어요.", pair: 2 }],
          uk: [{ text: "Я", pair: 1 }, { text: "маю", pair: 2 }, { text: "гарну квартиру.", pair: 3 }],
          sk: [{ text: "Ja", pair: 1 }, { text: "mám", pair: 2 }, { text: "pekný byt.", pair: 3 }],
        },
      },
      {
        german: [{ text: "Meine Wohnung", pair: 1 }, { text: "ist", pair: 2 }, { text: "klein.", pair: 3 }],
        native: {
          en: [{ text: "My apartment", pair: 1 }, { text: "is", pair: 2 }, { text: "small.", pair: 3 }],
          cs: [{ text: "Můj byt", pair: 1 }, { text: "je", pair: 2 }, { text: "malý.", pair: 3 }],
          pl: [{ text: "Moje mieszkanie", pair: 1 }, { text: "jest", pair: 2 }, { text: "małe.", pair: 3 }],
          ko: [{ text: "제 집은", pair: 1 }, { text: "작아요.", pair: 2 }],
          uk: [{ text: "Моя квартира", pair: 1 }, { text: "є", pair: 2 }, { text: "маленька.", pair: 3 }],
          sk: [{ text: "Môj byt", pair: 1 }, { text: "je", pair: 2 }, { text: "malý.", pair: 3 }],
        },
      },
      {
        german: [{ text: "Ich", pair: 1 }, { text: "spreche", pair: 2 }, { text: "ein bisschen Deutsch.", pair: 3 }],
        native: {
          en: [{ text: "I", pair: 1 }, { text: "speak", pair: 2 }, { text: "a little German.", pair: 3 }],
          cs: [{ text: "Já", pair: 1 }, { text: "mluvím", pair: 2 }, { text: "trochu německy.", pair: 3 }],
          pl: [{ text: "Ja", pair: 1 }, { text: "mówię", pair: 2 }, { text: "trochę po niemiecku.", pair: 3 }],
          ko: [{ text: "저는", pair: 1 }, { text: "독일어를 조금", pair: 3 }, { text: "해요.", pair: 2 }],
          uk: [{ text: "Я", pair: 1 }, { text: "розмовляю", pair: 2 }, { text: "трохи німецькою.", pair: 3 }],
          sk: [{ text: "Ja", pair: 1 }, { text: "hovorím", pair: 2 }, { text: "trochu po nemecky.", pair: 3 }],
        },
      },
      {
        german: [{ text: "Ich", pair: 1 }, { text: "lerne", pair: 2 }, { text: "jeden Tag", pair: 4 }, { text: "Deutsch.", pair: 3 }],
        native: {
          en: [{ text: "I", pair: 1 }, { text: "learn", pair: 2 }, { text: "German", pair: 3 }, { text: "every day.", pair: 4 }],
          cs: [{ text: "Já", pair: 1 }, { text: "učím se", pair: 2 }, { text: "každý den", pair: 4 }, { text: "německy.", pair: 3 }],
          pl: [{ text: "Ja", pair: 1 }, { text: "uczę się", pair: 2 }, { text: "codziennie", pair: 4 }, { text: "niemieckiego.", pair: 3 }],
          ko: [{ text: "저는", pair: 1 }, { text: "매일", pair: 4 }, { text: "독일어를", pair: 3 }, { text: "배워요.", pair: 2 }],
          uk: [{ text: "Я", pair: 1 }, { text: "вивчаю", pair: 2 }, { text: "щодня", pair: 4 }, { text: "німецьку.", pair: 3 }],
          sk: [{ text: "Ja", pair: 1 }, { text: "učím sa", pair: 2 }, { text: "každý deň", pair: 4 }, { text: "po nemecky.", pair: 3 }],
        },
      },
      {
        german: [{ text: "Meine Kollegen", pair: 1 }, { text: "sind", pair: 2 }, { text: "freundlich.", pair: 3 }],
        native: {
          en: [{ text: "My colleagues", pair: 1 }, { text: "are", pair: 2 }, { text: "friendly.", pair: 3 }],
          cs: [{ text: "Moji kolegové", pair: 1 }, { text: "jsou", pair: 2 }, { text: "přátelští.", pair: 3 }],
          pl: [{ text: "Moi koledzy", pair: 1 }, { text: "są", pair: 2 }, { text: "mili.", pair: 3 }],
          ko: [{ text: "제 동료들은", pair: 1 }, { text: "친절해요.", pair: 2 }],
          uk: [{ text: "Мої колеги", pair: 1 }, { text: "є", pair: 2 }, { text: "дружні.", pair: 3 }],
          sk: [{ text: "Moji kolegovia", pair: 1 }, { text: "sú", pair: 2 }, { text: "priateľskí.", pair: 3 }],
        },
      },
      {
        german: [{ text: "Am Sonntag", pair: 1 }, { text: "habe", pair: 3 }, { text: "ich", pair: 2 }, { text: "frei.", pair: 4 }],
        native: {
          en: [{ text: "On Sunday", pair: 1 }, { text: "I", pair: 2 }, { text: "have", pair: 3 }, { text: "free time.", pair: 4 }],
          cs: [{ text: "V neděli", pair: 1 }, { text: "já", pair: 2 }, { text: "mám", pair: 3 }, { text: "volno.", pair: 4 }],
          pl: [{ text: "W niedzielę", pair: 1 }, { text: "ja", pair: 2 }, { text: "mam", pair: 3 }, { text: "wolne.", pair: 4 }],
          ko: [{ text: "일요일에", pair: 1 }, { text: "저는", pair: 2 }, { text: "시간이", pair: 4 }, { text: "있어요.", pair: 3 }],
          uk: [{ text: "У неділю", pair: 1 }, { text: "я", pair: 2 }, { text: "маю", pair: 3 }, { text: "вільний час.", pair: 4 }],
          sk: [{ text: "V nedeľu", pair: 1 }, { text: "ja", pair: 2 }, { text: "mám", pair: 3 }, { text: "voľno.", pair: 4 }],
        },
      },
      {
        german: [{ text: "Ich", pair: 1 }, { text: "mag", pair: 2 }, { text: "mein Leben in Deutschland.", pair: 3 }],
        native: {
          en: [{ text: "I", pair: 1 }, { text: "like", pair: 2 }, { text: "my life in Germany.", pair: 3 }],
          cs: [{ text: "Já", pair: 1 }, { text: "mám rád", pair: 2 }, { text: "svůj život v Německu.", pair: 3 }],
          pl: [{ text: "Ja", pair: 1 }, { text: "lubię", pair: 2 }, { text: "moje życie w Niemczech.", pair: 3 }],
          ko: [{ text: "저는", pair: 1 }, { text: "독일에서의 제 삶을", pair: 3 }, { text: "좋아해요.", pair: 2 }],
          uk: [{ text: "Я", pair: 1 }, { text: "люблю", pair: 2 }, { text: "моє життя в Німеччині.", pair: 3 }],
          sk: [{ text: "Ja", pair: 1 }, { text: "mám rád", pair: 2 }, { text: "svoj život v Nemecku.", pair: 3 }],
        },
      },
    ],
  },
];

export function getStory(id: string): Story | undefined {
  return STORIES.find((s) => s.id === id);
}
