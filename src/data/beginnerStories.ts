// Content for the "Start German From the Beginning" section (English UI only).

export interface StoryChunk {
  /** One or more words that belong together (e.g. "a nice apartment") */
  text: string;
  /** Pairing index shared between the matching English and German chunk in the same sentence */
  pair: number;
}

export interface StorySentence {
  german: StoryChunk[];
  english: StoryChunk[];
}

export interface Story {
  id: string;
  title: string;
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
    title: "Life and Work in Germany",
    sentences: [
      {
        english: [{ text: "I", pair: 1 }, { text: "live", pair: 2 }, { text: "in", pair: 3 }, { text: "Germany.", pair: 4 }],
        german: [{ text: "Ich", pair: 1 }, { text: "lebe", pair: 2 }, { text: "in", pair: 3 }, { text: "Deutschland.", pair: 4 }],
      },
      {
        english: [{ text: "I", pair: 1 }, { text: "work", pair: 2 }, { text: "in", pair: 3 }, { text: "Berlin.", pair: 4 }],
        german: [{ text: "Ich", pair: 1 }, { text: "arbeite", pair: 2 }, { text: "in", pair: 3 }, { text: "Berlin.", pair: 4 }],
      },
      {
        english: [{ text: "I", pair: 1 }, { text: "go", pair: 2 }, { text: "to work", pair: 3 }, { text: "every day.", pair: 4 }],
        german: [{ text: "Ich", pair: 1 }, { text: "gehe", pair: 2 }, { text: "jeden Tag", pair: 4 }, { text: "zur Arbeit.", pair: 3 }],
      },
      {
        english: [{ text: "I", pair: 1 }, { text: "have", pair: 2 }, { text: "a nice apartment.", pair: 3 }],
        german: [{ text: "Ich", pair: 1 }, { text: "habe", pair: 2 }, { text: "eine schöne Wohnung.", pair: 3 }],
      },
      {
        english: [{ text: "My apartment", pair: 1 }, { text: "is", pair: 2 }, { text: "small.", pair: 3 }],
        german: [{ text: "Meine Wohnung", pair: 1 }, { text: "ist", pair: 2 }, { text: "klein.", pair: 3 }],
      },
      {
        english: [{ text: "I", pair: 1 }, { text: "speak", pair: 2 }, { text: "a little German.", pair: 3 }],
        german: [{ text: "Ich", pair: 1 }, { text: "spreche", pair: 2 }, { text: "ein bisschen Deutsch.", pair: 3 }],
      },
      {
        english: [{ text: "I", pair: 1 }, { text: "learn", pair: 2 }, { text: "German", pair: 3 }, { text: "every day.", pair: 4 }],
        german: [{ text: "Ich", pair: 1 }, { text: "lerne", pair: 2 }, { text: "jeden Tag", pair: 4 }, { text: "Deutsch.", pair: 3 }],
      },
      {
        english: [{ text: "My colleagues", pair: 1 }, { text: "are", pair: 2 }, { text: "friendly.", pair: 3 }],
        german: [{ text: "Meine Kollegen", pair: 1 }, { text: "sind", pair: 2 }, { text: "freundlich.", pair: 3 }],
      },
      {
        english: [{ text: "On Sunday", pair: 1 }, { text: "I", pair: 2 }, { text: "have", pair: 3 }, { text: "free time.", pair: 4 }],
        german: [{ text: "Am Sonntag", pair: 1 }, { text: "habe", pair: 3 }, { text: "ich", pair: 2 }, { text: "frei.", pair: 4 }],
      },
      {
        english: [{ text: "I", pair: 1 }, { text: "like", pair: 2 }, { text: "my life in Germany.", pair: 3 }],
        german: [{ text: "Ich", pair: 1 }, { text: "mag", pair: 2 }, { text: "mein Leben in Deutschland.", pair: 3 }],
      },
    ],
  },
];

export function getStory(id: string): Story | undefined {
  return STORIES.find((s) => s.id === id);
}
