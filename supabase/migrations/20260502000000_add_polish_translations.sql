ALTER TABLE public.word_pairs
  ADD COLUMN translation_a_pl TEXT,
  ADD COLUMN translation_b_pl TEXT;

UPDATE public.word_pairs SET translation_a_pl = 'duży',         translation_b_pl = 'mały'          WHERE word_a = 'groß'        AND word_b = 'klein';
UPDATE public.word_pairs SET translation_a_pl = 'szybki',       translation_b_pl = 'powolny'        WHERE word_a = 'schnell'     AND word_b = 'langsam';
UPDATE public.word_pairs SET translation_a_pl = 'kupować',      translation_b_pl = 'sprzedawać'     WHERE word_a = 'kaufen'      AND word_b = 'verkaufen';
UPDATE public.word_pairs SET translation_a_pl = 'zaczynać',     translation_b_pl = 'kończyć'        WHERE word_a = 'anfangen'    AND word_b = 'beenden';
UPDATE public.word_pairs SET translation_a_pl = 'chory',        translation_b_pl = 'zdrowy'         WHERE word_a = 'krank'       AND word_b = 'gesund';
UPDATE public.word_pairs SET translation_a_pl = 'mówić',        translation_b_pl = 'rozmawiać'      WHERE word_a = 'sprechen'    AND word_b = 'reden';
UPDATE public.word_pairs SET translation_a_pl = 'praca',        translation_b_pl = 'praca/zajęcie'  WHERE word_a = 'Arbeit'      AND word_b = 'Job';
UPDATE public.word_pairs SET translation_a_pl = 'zmęczony',     translation_b_pl = 'wyczerpany'     WHERE word_a = 'müde'        AND word_b = 'erschöpft';
UPDATE public.word_pairs SET translation_a_pl = 'błąd',         translation_b_pl = 'pomyłka'        WHERE word_a = 'Fehler'      AND word_b = 'Irrtum';
UPDATE public.word_pairs SET translation_a_pl = 'pomagać',      translation_b_pl = 'wspierać'       WHERE word_a = 'helfen'      AND word_b = 'unterstützen';
UPDATE public.word_pairs SET translation_a_pl = 'czysty',       translation_b_pl = 'brudny'         WHERE word_a = 'sauber'      AND word_b = 'schmutzig';
UPDATE public.word_pairs SET translation_a_pl = 'głośny',       translation_b_pl = 'cichy'          WHERE word_a = 'laut'        AND word_b = 'leise';
UPDATE public.word_pairs SET translation_a_pl = 'stary',        translation_b_pl = 'nowy'           WHERE word_a = 'alt'         AND word_b = 'neu';
UPDATE public.word_pairs SET translation_a_pl = 'otwierać',     translation_b_pl = 'zamykać'        WHERE word_a = 'öffnen'      AND word_b = 'schließen';
UPDATE public.word_pairs SET translation_a_pl = 'silny',        translation_b_pl = 'słaby'          WHERE word_a = 'stark'       AND word_b = 'schwach';
UPDATE public.word_pairs SET translation_a_pl = 'przyjazny',    translation_b_pl = 'nieuprzejmy'    WHERE word_a = 'freundlich'  AND word_b = 'unhöflich';
UPDATE public.word_pairs SET translation_a_pl = 'odpowiedź',    translation_b_pl = 'pytanie'        WHERE word_a = 'Antwort'     AND word_b = 'Frage';
UPDATE public.word_pairs SET translation_a_pl = 'tani',         translation_b_pl = 'drogi'          WHERE word_a = 'billig'      AND word_b = 'teuer';
UPDATE public.word_pairs SET translation_a_pl = 'jechać',       translation_b_pl = 'podróżować'     WHERE word_a = 'fahren'      AND word_b = 'reisen';
UPDATE public.word_pairs SET translation_a_pl = 'droga',        translation_b_pl = 'ścieżka'        WHERE word_a = 'Weg'         AND word_b = 'Pfad';
UPDATE public.word_pairs SET translation_a_pl = 'zaczynać',     translation_b_pl = 'startować'      WHERE word_a = 'beginnen'    AND word_b = 'starten';
UPDATE public.word_pairs SET translation_a_pl = 'zepsuty',      translation_b_pl = 'uszkodzony'     WHERE word_a = 'kaputt'      AND word_b = 'defekt';
UPDATE public.word_pairs SET translation_a_pl = 'szef',         translation_b_pl = 'przełożony'     WHERE word_a = 'Chef'        AND word_b = 'Vorgesetzter';
UPDATE public.word_pairs SET translation_a_pl = 'przerwa',      translation_b_pl = 'przerwanie'     WHERE word_a = 'Pause'       AND word_b = 'Unterbrechung';
