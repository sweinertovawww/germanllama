import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Level } from "@/game/vocabularyData";

// A1-appropriate subset of the seeded word_pairs — both sides genuinely beginner-level.
const A1_WORD_A_VALUES = [
  "groß", "schnell", "alt", "sauber", "laut", "öffnen", "stark", "billig",
  "krank", "kaufen", "Antwort", "anfangen",
];

export interface WordPair {
  id: string;
  word_a: string;
  word_b: string;
  pair_type: "synonym" | "antonym";
  translation_a: string;
  translation_b: string;
  translation_a_ko: string | null;
  translation_b_ko: string | null;
  translation_a_pl: string | null;
  translation_b_pl: string | null;
  translation_a_en: string | null;
  translation_b_en: string | null;
  translation_a_uk: string | null;
  translation_b_uk: string | null;
  translation_a_sk: string | null;
  translation_b_sk: string | null;
  category: string | null;
}

export interface GameCard {
  id: string;
  pairId: string;
  word: string;
  side: "a" | "b";
}

export interface MatchedPairData {
  pair: WordPair;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function useWortpaare(pairCount = 6, levelOverride?: Level) {
  const [allPairs, setAllPairs] = useState<WordPair[]>([]);
  const [gamePairs, setGamePairs] = useState<WordPair[]>([]);
  const [cards, setCards] = useState<GameCard[]>([]);
  const [matched, setMatched] = useState<MatchedPairData[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [shaking, setShaking] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  // Fetch pairs from DB
  useEffect(() => {
    const fetchPairs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("word_pairs")
        .select("*");
      if (!error && data && data.length > 0) {
        const rows = data as WordPair[];
        setAllPairs(
          levelOverride === "A1"
            ? rows.filter((p) => A1_WORD_A_VALUES.includes(p.word_a))
            : rows
        );
      }
      setLoading(false);
    };
    fetchPairs();
  }, [levelOverride]);

  const startGame = useCallback(() => {
    if (allPairs.length === 0) return;
    const selected = shuffle(allPairs).slice(0, pairCount);
    setGamePairs(selected);
    const gameCards: GameCard[] = [];
    selected.forEach((pair) => {
      gameCards.push({ id: `${pair.id}-a`, pairId: pair.id, word: pair.word_a, side: "a" });
      gameCards.push({ id: `${pair.id}-b`, pairId: pair.id, word: pair.word_b, side: "b" });
    });
    setCards(shuffle(gameCards));
    setMatched([]);
    setSelected(null);
    setShaking(null);
    setCompleted(false);
  }, [allPairs, pairCount]);

  // Start game when data is loaded
  useEffect(() => {
    if (allPairs.length > 0 && gamePairs.length === 0) {
      startGame();
    }
  }, [allPairs, gamePairs.length, startGame]);

  const selectCard = useCallback((cardId: string) => {
    if (shaking) return;
    // If already matched, ignore
    const card = cards.find((c) => c.id === cardId);
    if (!card) return;
    if (matched.some((m) => m.pair.id === card.pairId)) return;

    if (!selected) {
      setSelected(cardId);
      return;
    }

    if (selected === cardId) {
      setSelected(null);
      return;
    }

    const firstCard = cards.find((c) => c.id === selected);
    if (!firstCard) { setSelected(null); return; }

    // Check match
    if (firstCard.pairId === card.pairId && firstCard.side !== card.side) {
      // Correct match
      const pair = gamePairs.find((p) => p.id === card.pairId)!;
      const newMatched = [...matched, { pair }];
      setMatched(newMatched);
      setSelected(null);
      if (newMatched.length === gamePairs.length) {
        setCompleted(true);
      }
    } else {
      // Wrong match
      setShaking(cardId);
      setTimeout(() => {
        setShaking(null);
        setSelected(null);
      }, 500);
    }
  }, [selected, cards, matched, gamePairs, shaking]);

  const remainingCards = cards.filter(
    (c) => !matched.some((m) => m.pair.id === c.pairId)
  );

  return {
    cards: remainingCards,
    matched,
    selected,
    shaking,
    loading,
    completed,
    selectCard,
    startGame,
  };
}
