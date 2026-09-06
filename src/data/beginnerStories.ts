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
  {
    id: "shopping",
    title: {
      cs: "Nakupování",
      en: "Shopping",
      pl: "Zakupy",
      ko: "쇼핑",
      uk: "Покупки",
      sk: "Nakupovanie",
    },
    sentences: [
      {
        german: [{ text: "Ich", pair: 1 }, { text: "gehe", pair: 2 }, { text: "einkaufen.", pair: 3 }],
        native: {
          en: [{ text: "I", pair: 1 }, { text: "go", pair: 2 }, { text: "shopping.", pair: 3 }],
          cs: [{ text: "Já", pair: 1 }, { text: "jdu", pair: 2 }, { text: "nakupovat.", pair: 3 }],
          pl: [{ text: "Ja", pair: 1 }, { text: "idę", pair: 2 }, { text: "na zakupy.", pair: 3 }],
          ko: [{ text: "저는", pair: 1 }, { text: "쇼핑하러", pair: 3 }, { text: "가요.", pair: 2 }],
          uk: [{ text: "Я", pair: 1 }, { text: "йду", pair: 2 }, { text: "за покупками.", pair: 3 }],
          sk: [{ text: "Ja", pair: 1 }, { text: "idem", pair: 2 }, { text: "nakupovať.", pair: 3 }],
        },
      },
      {
        german: [{ text: "Ich", pair: 1 }, { text: "brauche", pair: 2 }, { text: "Milch und Brot.", pair: 3 }],
        native: {
          en: [{ text: "I", pair: 1 }, { text: "need", pair: 2 }, { text: "milk and bread.", pair: 3 }],
          cs: [{ text: "Já", pair: 1 }, { text: "potřebuju", pair: 2 }, { text: "mléko a chléb.", pair: 3 }],
          pl: [{ text: "Ja", pair: 1 }, { text: "potrzebuję", pair: 2 }, { text: "mleka i chleba.", pair: 3 }],
          ko: [{ text: "저는", pair: 1 }, { text: "우유랑 빵이", pair: 3 }, { text: "필요해요.", pair: 2 }],
          uk: [{ text: "Я", pair: 1 }, { text: "потребую", pair: 2 }, { text: "молоко і хліб.", pair: 3 }],
          sk: [{ text: "Ja", pair: 1 }, { text: "potrebujem", pair: 2 }, { text: "mlieko a chlieb.", pair: 3 }],
        },
      },
      {
        german: [{ text: "Der Supermarkt", pair: 1 }, { text: "ist", pair: 2 }, { text: "um die Ecke.", pair: 3 }],
        native: {
          en: [{ text: "The supermarket", pair: 1 }, { text: "is", pair: 2 }, { text: "around the corner.", pair: 3 }],
          cs: [{ text: "Supermarket", pair: 1 }, { text: "je", pair: 2 }, { text: "za rohem.", pair: 3 }],
          pl: [{ text: "Supermarket", pair: 1 }, { text: "jest", pair: 2 }, { text: "za rogiem.", pair: 3 }],
          ko: [{ text: "슈퍼마켓은", pair: 1 }, { text: "모퉁이에", pair: 3 }, { text: "있어요.", pair: 2 }],
          uk: [{ text: "Супермаркет", pair: 1 }, { text: "є", pair: 2 }, { text: "за рогом.", pair: 3 }],
          sk: [{ text: "Supermarket", pair: 1 }, { text: "je", pair: 2 }, { text: "za rohom.", pair: 3 }],
        },
      },
      {
        german: [{ text: "Ich", pair: 1 }, { text: "kaufe", pair: 2 }, { text: "frisches Obst.", pair: 3 }],
        native: {
          en: [{ text: "I", pair: 1 }, { text: "buy", pair: 2 }, { text: "fresh fruit.", pair: 3 }],
          cs: [{ text: "Já", pair: 1 }, { text: "kupuju", pair: 2 }, { text: "čerstvé ovoce.", pair: 3 }],
          pl: [{ text: "Ja", pair: 1 }, { text: "kupuję", pair: 2 }, { text: "świeże owoce.", pair: 3 }],
          ko: [{ text: "저는", pair: 1 }, { text: "신선한 과일을", pair: 3 }, { text: "사요.", pair: 2 }],
          uk: [{ text: "Я", pair: 1 }, { text: "купую", pair: 2 }, { text: "свіжі фрукти.", pair: 3 }],
          sk: [{ text: "Ja", pair: 1 }, { text: "kupujem", pair: 2 }, { text: "čerstvé ovocie.", pair: 3 }],
        },
      },
      {
        german: [{ text: "Das", pair: 1 }, { text: "kostet", pair: 2 }, { text: "drei Euro.", pair: 3 }],
        native: {
          en: [{ text: "That", pair: 1 }, { text: "costs", pair: 2 }, { text: "three euros.", pair: 3 }],
          cs: [{ text: "To", pair: 1 }, { text: "stojí", pair: 2 }, { text: "tři eura.", pair: 3 }],
          pl: [{ text: "To", pair: 1 }, { text: "kosztuje", pair: 2 }, { text: "trzy euro.", pair: 3 }],
          ko: [{ text: "그것은", pair: 1 }, { text: "3유로", pair: 3 }, { text: "예요.", pair: 2 }],
          uk: [{ text: "Це", pair: 1 }, { text: "коштує", pair: 2 }, { text: "три євро.", pair: 3 }],
          sk: [{ text: "To", pair: 1 }, { text: "stojí", pair: 2 }, { text: "tri eurá.", pair: 3 }],
        },
      },
      {
        german: [{ text: "Ich", pair: 1 }, { text: "bezahle", pair: 2 }, { text: "mit Karte.", pair: 3 }],
        native: {
          en: [{ text: "I", pair: 1 }, { text: "pay", pair: 2 }, { text: "by card.", pair: 3 }],
          cs: [{ text: "Já", pair: 1 }, { text: "platím", pair: 2 }, { text: "kartou.", pair: 3 }],
          pl: [{ text: "Ja", pair: 1 }, { text: "płacę", pair: 2 }, { text: "kartą.", pair: 3 }],
          ko: [{ text: "저는", pair: 1 }, { text: "카드로", pair: 3 }, { text: "계산해요.", pair: 2 }],
          uk: [{ text: "Я", pair: 1 }, { text: "плачу", pair: 2 }, { text: "карткою.", pair: 3 }],
          sk: [{ text: "Ja", pair: 1 }, { text: "platím", pair: 2 }, { text: "kartou.", pair: 3 }],
        },
      },
      {
        german: [{ text: "Die Verkäuferin", pair: 1 }, { text: "ist", pair: 2 }, { text: "sehr freundlich.", pair: 3 }],
        native: {
          en: [{ text: "The saleswoman", pair: 1 }, { text: "is", pair: 2 }, { text: "very friendly.", pair: 3 }],
          cs: [{ text: "Prodavačka", pair: 1 }, { text: "je", pair: 2 }, { text: "velmi milá.", pair: 3 }],
          pl: [{ text: "Sprzedawczyni", pair: 1 }, { text: "jest", pair: 2 }, { text: "bardzo miła.", pair: 3 }],
          ko: [{ text: "판매원은", pair: 1 }, { text: "아주", pair: 3 }, { text: "친절해요.", pair: 2 }],
          uk: [{ text: "Продавчиня", pair: 1 }, { text: "дуже привітна.", pair: 3 }],
          sk: [{ text: "Predavačka", pair: 1 }, { text: "je", pair: 2 }, { text: "veľmi milá.", pair: 3 }],
        },
      },
      {
        german: [{ text: "Ich", pair: 1 }, { text: "habe", pair: 2 }, { text: "eine Einkaufsliste.", pair: 3 }],
        native: {
          en: [{ text: "I", pair: 1 }, { text: "have", pair: 2 }, { text: "a shopping list.", pair: 3 }],
          cs: [{ text: "Já", pair: 1 }, { text: "mám", pair: 2 }, { text: "nákupní seznam.", pair: 3 }],
          pl: [{ text: "Ja", pair: 1 }, { text: "mam", pair: 2 }, { text: "listę zakupów.", pair: 3 }],
          ko: [{ text: "저는", pair: 1 }, { text: "쇼핑 목록이", pair: 3 }, { text: "있어요.", pair: 2 }],
          uk: [{ text: "Я", pair: 1 }, { text: "маю", pair: 2 }, { text: "список покупок.", pair: 3 }],
          sk: [{ text: "Ja", pair: 1 }, { text: "mám", pair: 2 }, { text: "nákupný zoznam.", pair: 3 }],
        },
      },
      {
        german: [{ text: "Der Laden", pair: 1 }, { text: "schließt", pair: 2 }, { text: "um acht Uhr.", pair: 3 }],
        native: {
          en: [{ text: "The store", pair: 1 }, { text: "closes", pair: 2 }, { text: "at eight o'clock.", pair: 3 }],
          cs: [{ text: "Obchod", pair: 1 }, { text: "zavírá", pair: 2 }, { text: "v osm hodin.", pair: 3 }],
          pl: [{ text: "Sklep", pair: 1 }, { text: "zamyka się", pair: 2 }, { text: "o ósmej.", pair: 3 }],
          ko: [{ text: "가게는", pair: 1 }, { text: "8시에", pair: 3 }, { text: "문을 닫아요.", pair: 2 }],
          uk: [{ text: "Магазин", pair: 1 }, { text: "закривається", pair: 2 }, { text: "о восьмій годині.", pair: 3 }],
          sk: [{ text: "Obchod", pair: 1 }, { text: "zatvára", pair: 2 }, { text: "o ôsmej.", pair: 3 }],
        },
      },
      {
        german: [{ text: "Ich", pair: 1 }, { text: "packe", pair: 2 }, { text: "die Sachen", pair: 3 }, { text: "in die Tasche.", pair: 4 }],
        native: {
          en: [{ text: "I", pair: 1 }, { text: "pack", pair: 2 }, { text: "the things", pair: 3 }, { text: "into the bag.", pair: 4 }],
          cs: [{ text: "Já", pair: 1 }, { text: "balím", pair: 2 }, { text: "věci", pair: 3 }, { text: "do tašky.", pair: 4 }],
          pl: [{ text: "Ja", pair: 1 }, { text: "pakuję", pair: 2 }, { text: "rzeczy", pair: 3 }, { text: "do torby.", pair: 4 }],
          ko: [{ text: "저는", pair: 1 }, { text: "물건을", pair: 3 }, { text: "가방에", pair: 4 }, { text: "넣어요.", pair: 2 }],
          uk: [{ text: "Я", pair: 1 }, { text: "складаю", pair: 2 }, { text: "речі", pair: 3 }, { text: "в сумку.", pair: 4 }],
          sk: [{ text: "Ja", pair: 1 }, { text: "balím", pair: 2 }, { text: "veci", pair: 3 }, { text: "do tašky.", pair: 4 }],
        },
      },
    ],
  },
  {
    id: "cooking",
    title: {
      cs: "Vaření",
      en: "Cooking",
      pl: "Gotowanie",
      ko: "요리",
      uk: "Кулінарія",
      sk: "Varenie",
    },
    sentences: [
      {
        german: [{ text: "Ich", pair: 1 }, { text: "koche gern.", pair: 2 }],
        native: {
          en: [{ text: "I", pair: 1 }, { text: "like cooking.", pair: 2 }],
          cs: [{ text: "Já", pair: 1 }, { text: "rád vařím.", pair: 2 }],
          pl: [{ text: "Ja", pair: 1 }, { text: "lubię gotować.", pair: 2 }],
          ko: [{ text: "저는", pair: 1 }, { text: "요리하는 걸 좋아해요.", pair: 2 }],
          uk: [{ text: "Я", pair: 1 }, { text: "люблю готувати.", pair: 2 }],
          sk: [{ text: "Ja", pair: 1 }, { text: "rád varím.", pair: 2 }],
        },
      },
      {
        german: [{ text: "Ich", pair: 1 }, { text: "mache", pair: 2 }, { text: "heute", pair: 4 }, { text: "Suppe.", pair: 3 }],
        native: {
          en: [{ text: "I", pair: 1 }, { text: "make", pair: 2 }, { text: "soup", pair: 3 }, { text: "today.", pair: 4 }],
          cs: [{ text: "Já", pair: 1 }, { text: "dělám", pair: 2 }, { text: "dnes", pair: 4 }, { text: "polévku.", pair: 3 }],
          pl: [{ text: "Ja", pair: 1 }, { text: "robię", pair: 2 }, { text: "dziś", pair: 4 }, { text: "zupę.", pair: 3 }],
          ko: [{ text: "저는", pair: 1 }, { text: "오늘", pair: 4 }, { text: "수프를", pair: 3 }, { text: "만들어요.", pair: 2 }],
          uk: [{ text: "Я", pair: 1 }, { text: "роблю", pair: 2 }, { text: "сьогодні", pair: 4 }, { text: "суп.", pair: 3 }],
          sk: [{ text: "Ja", pair: 1 }, { text: "robím", pair: 2 }, { text: "dnes", pair: 4 }, { text: "polievku.", pair: 3 }],
        },
      },
      {
        german: [{ text: "Ich", pair: 1 }, { text: "brauche", pair: 2 }, { text: "Zwiebeln und Karotten.", pair: 3 }],
        native: {
          en: [{ text: "I", pair: 1 }, { text: "need", pair: 2 }, { text: "onions and carrots.", pair: 3 }],
          cs: [{ text: "Já", pair: 1 }, { text: "potřebuju", pair: 2 }, { text: "cibuli a mrkev.", pair: 3 }],
          pl: [{ text: "Ja", pair: 1 }, { text: "potrzebuję", pair: 2 }, { text: "cebuli i marchewki.", pair: 3 }],
          ko: [{ text: "저는", pair: 1 }, { text: "양파랑 당근이", pair: 3 }, { text: "필요해요.", pair: 2 }],
          uk: [{ text: "Я", pair: 1 }, { text: "потребую", pair: 2 }, { text: "цибулю і моркву.", pair: 3 }],
          sk: [{ text: "Ja", pair: 1 }, { text: "potrebujem", pair: 2 }, { text: "cibuľu a mrkvu.", pair: 3 }],
        },
      },
      {
        german: [{ text: "Das Essen", pair: 1 }, { text: "riecht", pair: 2 }, { text: "gut.", pair: 3 }],
        native: {
          en: [{ text: "The food", pair: 1 }, { text: "smells", pair: 2 }, { text: "good.", pair: 3 }],
          cs: [{ text: "Jídlo", pair: 1 }, { text: "voní", pair: 2 }, { text: "dobře.", pair: 3 }],
          pl: [{ text: "Jedzenie", pair: 1 }, { text: "pachnie", pair: 2 }, { text: "dobrze.", pair: 3 }],
          ko: [{ text: "음식이", pair: 1 }, { text: "좋은 냄새가", pair: 3 }, { text: "나요.", pair: 2 }],
          uk: [{ text: "Їжа", pair: 1 }, { text: "пахне", pair: 2 }, { text: "добре.", pair: 3 }],
          sk: [{ text: "Jedlo", pair: 1 }, { text: "vonia", pair: 2 }, { text: "dobre.", pair: 3 }],
        },
      },
      {
        german: [{ text: "Ich", pair: 1 }, { text: "schneide", pair: 2 }, { text: "das Gemüse.", pair: 3 }],
        native: {
          en: [{ text: "I", pair: 1 }, { text: "cut", pair: 2 }, { text: "the vegetables.", pair: 3 }],
          cs: [{ text: "Já", pair: 1 }, { text: "krájím", pair: 2 }, { text: "zeleninu.", pair: 3 }],
          pl: [{ text: "Ja", pair: 1 }, { text: "kroję", pair: 2 }, { text: "warzywa.", pair: 3 }],
          ko: [{ text: "저는", pair: 1 }, { text: "채소를", pair: 3 }, { text: "썰어요.", pair: 2 }],
          uk: [{ text: "Я", pair: 1 }, { text: "ріжу", pair: 2 }, { text: "овочі.", pair: 3 }],
          sk: [{ text: "Ja", pair: 1 }, { text: "krájam", pair: 2 }, { text: "zeleninu.", pair: 3 }],
        },
      },
      {
        german: [{ text: "Der Reis", pair: 1 }, { text: "kocht", pair: 2 }, { text: "zwanzig Minuten.", pair: 3 }],
        native: {
          en: [{ text: "The rice", pair: 1 }, { text: "cooks", pair: 2 }, { text: "for twenty minutes.", pair: 3 }],
          cs: [{ text: "Rýže", pair: 1 }, { text: "vaří se", pair: 2 }, { text: "dvacet minut.", pair: 3 }],
          pl: [{ text: "Ryż", pair: 1 }, { text: "gotuje się", pair: 2 }, { text: "dwadzieścia minut.", pair: 3 }],
          ko: [{ text: "밥은", pair: 1 }, { text: "20분 동안", pair: 3 }, { text: "끓여요.", pair: 2 }],
          uk: [{ text: "Рис", pair: 1 }, { text: "вариться", pair: 2 }, { text: "двадцять хвилин.", pair: 3 }],
          sk: [{ text: "Ryža", pair: 1 }, { text: "varí sa", pair: 2 }, { text: "dvadsať minút.", pair: 3 }],
        },
      },
      {
        german: [{ text: "Ich", pair: 1 }, { text: "würze", pair: 2 }, { text: "das Essen", pair: 3 }, { text: "mit Salz.", pair: 4 }],
        native: {
          en: [{ text: "I", pair: 1 }, { text: "season", pair: 2 }, { text: "the food", pair: 3 }, { text: "with salt.", pair: 4 }],
          cs: [{ text: "Já", pair: 1 }, { text: "kořením", pair: 2 }, { text: "jídlo", pair: 3 }, { text: "solí.", pair: 4 }],
          pl: [{ text: "Ja", pair: 1 }, { text: "przyprawiam", pair: 2 }, { text: "jedzenie", pair: 3 }, { text: "solą.", pair: 4 }],
          ko: [{ text: "저는", pair: 1 }, { text: "음식을", pair: 3 }, { text: "소금으로", pair: 4 }, { text: "간을 해요.", pair: 2 }],
          uk: [{ text: "Я", pair: 1 }, { text: "приправляю", pair: 2 }, { text: "їжу", pair: 3 }, { text: "сіллю.", pair: 4 }],
          sk: [{ text: "Ja", pair: 1 }, { text: "korením", pair: 2 }, { text: "jedlo", pair: 3 }, { text: "soľou.", pair: 4 }],
        },
      },
      {
        german: [{ text: "Das Rezept", pair: 1 }, { text: "ist", pair: 2 }, { text: "einfach.", pair: 3 }],
        native: {
          en: [{ text: "The recipe", pair: 1 }, { text: "is", pair: 2 }, { text: "simple.", pair: 3 }],
          cs: [{ text: "Recept", pair: 1 }, { text: "je", pair: 2 }, { text: "jednoduchý.", pair: 3 }],
          pl: [{ text: "Przepis", pair: 1 }, { text: "jest", pair: 2 }, { text: "prosty.", pair: 3 }],
          ko: [{ text: "레시피는", pair: 1 }, { text: "간단해요.", pair: 2 }],
          uk: [{ text: "Рецепт", pair: 1 }, { text: "простий.", pair: 3 }],
          sk: [{ text: "Recept", pair: 1 }, { text: "je", pair: 2 }, { text: "jednoduchý.", pair: 3 }],
        },
      },
      {
        german: [{ text: "Wir", pair: 1 }, { text: "essen", pair: 2 }, { text: "zusammen", pair: 4 }, { text: "zu Abend.", pair: 3 }],
        native: {
          en: [{ text: "We", pair: 1 }, { text: "eat", pair: 2 }, { text: "dinner", pair: 3 }, { text: "together.", pair: 4 }],
          cs: [{ text: "My", pair: 1 }, { text: "jíme", pair: 2 }, { text: "večeři", pair: 3 }, { text: "společně.", pair: 4 }],
          pl: [{ text: "My", pair: 1 }, { text: "jemy", pair: 2 }, { text: "kolację", pair: 3 }, { text: "razem.", pair: 4 }],
          ko: [{ text: "우리는", pair: 1 }, { text: "함께", pair: 4 }, { text: "저녁을", pair: 3 }, { text: "먹어요.", pair: 2 }],
          uk: [{ text: "Ми", pair: 1 }, { text: "їмо", pair: 2 }, { text: "вечерю", pair: 3 }, { text: "разом.", pair: 4 }],
          sk: [{ text: "My", pair: 1 }, { text: "jeme", pair: 2 }, { text: "večeru", pair: 3 }, { text: "spolu.", pair: 4 }],
        },
      },
      {
        german: [{ text: "Das Essen", pair: 1 }, { text: "schmeckt", pair: 2 }, { text: "sehr gut.", pair: 3 }],
        native: {
          en: [{ text: "The food", pair: 1 }, { text: "tastes", pair: 2 }, { text: "very good.", pair: 3 }],
          cs: [{ text: "Jídlo", pair: 1 }, { text: "chutná", pair: 2 }, { text: "velmi dobře.", pair: 3 }],
          pl: [{ text: "Jedzenie", pair: 1 }, { text: "smakuje", pair: 2 }, { text: "bardzo dobrze.", pair: 3 }],
          ko: [{ text: "음식이", pair: 1 }, { text: "아주", pair: 3 }, { text: "맛있어요.", pair: 2 }],
          uk: [{ text: "Їжа", pair: 1 }, { text: "дуже смачна.", pair: 3 }],
          sk: [{ text: "Jedlo", pair: 1 }, { text: "chutí", pair: 2 }, { text: "veľmi dobre.", pair: 3 }],
        },
      },
    ],
  },
];

export function getStory(id: string): Story | undefined {
  return STORIES.find((s) => s.id === id);
}
