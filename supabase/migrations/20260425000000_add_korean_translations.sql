ALTER TABLE public.word_pairs
  ADD COLUMN translation_a_ko TEXT,
  ADD COLUMN translation_b_ko TEXT;

UPDATE public.word_pairs SET translation_a_ko = '크다',       translation_b_ko = '작다'       WHERE word_a = 'groß'        AND word_b = 'klein';
UPDATE public.word_pairs SET translation_a_ko = '빠르다',     translation_b_ko = '느리다'     WHERE word_a = 'schnell'     AND word_b = 'langsam';
UPDATE public.word_pairs SET translation_a_ko = '사다',       translation_b_ko = '팔다'       WHERE word_a = 'kaufen'      AND word_b = 'verkaufen';
UPDATE public.word_pairs SET translation_a_ko = '시작하다',   translation_b_ko = '끝내다'     WHERE word_a = 'anfangen'    AND word_b = 'beenden';
UPDATE public.word_pairs SET translation_a_ko = '아프다',     translation_b_ko = '건강하다'   WHERE word_a = 'krank'       AND word_b = 'gesund';
UPDATE public.word_pairs SET translation_a_ko = '말하다',     translation_b_ko = '이야기하다' WHERE word_a = 'sprechen'    AND word_b = 'reden';
UPDATE public.word_pairs SET translation_a_ko = '일',         translation_b_ko = '직업'       WHERE word_a = 'Arbeit'      AND word_b = 'Job';
UPDATE public.word_pairs SET translation_a_ko = '피곤하다',   translation_b_ko = '지치다'     WHERE word_a = 'müde'        AND word_b = 'erschöpft';
UPDATE public.word_pairs SET translation_a_ko = '실수',       translation_b_ko = '오류'       WHERE word_a = 'Fehler'      AND word_b = 'Irrtum';
UPDATE public.word_pairs SET translation_a_ko = '돕다',       translation_b_ko = '지원하다'   WHERE word_a = 'helfen'      AND word_b = 'unterstützen';
UPDATE public.word_pairs SET translation_a_ko = '깨끗하다',   translation_b_ko = '더럽다'     WHERE word_a = 'sauber'      AND word_b = 'schmutzig';
UPDATE public.word_pairs SET translation_a_ko = '시끄럽다',   translation_b_ko = '조용하다'   WHERE word_a = 'laut'        AND word_b = 'leise';
UPDATE public.word_pairs SET translation_a_ko = '오래된',     translation_b_ko = '새로운'     WHERE word_a = 'alt'         AND word_b = 'neu';
UPDATE public.word_pairs SET translation_a_ko = '열다',       translation_b_ko = '닫다'       WHERE word_a = 'öffnen'      AND word_b = 'schließen';
UPDATE public.word_pairs SET translation_a_ko = '강하다',     translation_b_ko = '약하다'     WHERE word_a = 'stark'       AND word_b = 'schwach';
UPDATE public.word_pairs SET translation_a_ko = '친절하다',   translation_b_ko = '무례하다'   WHERE word_a = 'freundlich'  AND word_b = 'unhöflich';
UPDATE public.word_pairs SET translation_a_ko = '대답',       translation_b_ko = '질문'       WHERE word_a = 'Antwort'     AND word_b = 'Frage';
UPDATE public.word_pairs SET translation_a_ko = '싸다',       translation_b_ko = '비싸다'     WHERE word_a = 'billig'      AND word_b = 'teuer';
UPDATE public.word_pairs SET translation_a_ko = '가다',       translation_b_ko = '여행하다'   WHERE word_a = 'fahren'      AND word_b = 'reisen';
UPDATE public.word_pairs SET translation_a_ko = '길',         translation_b_ko = '오솔길'     WHERE word_a = 'Weg'         AND word_b = 'Pfad';
UPDATE public.word_pairs SET translation_a_ko = '시작하다',   translation_b_ko = '출발하다'   WHERE word_a = 'beginnen'    AND word_b = 'starten';
UPDATE public.word_pairs SET translation_a_ko = '고장난',     translation_b_ko = '손상된'     WHERE word_a = 'kaputt'      AND word_b = 'defekt';
UPDATE public.word_pairs SET translation_a_ko = '상사',       translation_b_ko = '상관'       WHERE word_a = 'Chef'        AND word_b = 'Vorgesetzter';
UPDATE public.word_pairs SET translation_a_ko = '휴식',       translation_b_ko = '중단'       WHERE word_a = 'Pause'       AND word_b = 'Unterbrechung';
