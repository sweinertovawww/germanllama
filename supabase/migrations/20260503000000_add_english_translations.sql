ALTER TABLE public.word_pairs
  ADD COLUMN translation_a_en TEXT,
  ADD COLUMN translation_b_en TEXT;

-- Original 24 pairs
UPDATE public.word_pairs SET translation_a_en = 'big',          translation_b_en = 'small'          WHERE word_a = 'groß'           AND word_b = 'klein';
UPDATE public.word_pairs SET translation_a_en = 'fast',         translation_b_en = 'slow'           WHERE word_a = 'schnell'        AND word_b = 'langsam';
UPDATE public.word_pairs SET translation_a_en = 'to buy',       translation_b_en = 'to sell'        WHERE word_a = 'kaufen'         AND word_b = 'verkaufen';
UPDATE public.word_pairs SET translation_a_en = 'to start',     translation_b_en = 'to finish'      WHERE word_a = 'anfangen'       AND word_b = 'beenden';
UPDATE public.word_pairs SET translation_a_en = 'sick',         translation_b_en = 'healthy'        WHERE word_a = 'krank'          AND word_b = 'gesund';
UPDATE public.word_pairs SET translation_a_en = 'to speak',     translation_b_en = 'to talk'        WHERE word_a = 'sprechen'       AND word_b = 'reden';
UPDATE public.word_pairs SET translation_a_en = 'work',         translation_b_en = 'job'            WHERE word_a = 'Arbeit'         AND word_b = 'Job';
UPDATE public.word_pairs SET translation_a_en = 'tired',        translation_b_en = 'exhausted'      WHERE word_a = 'müde'           AND word_b = 'erschöpft';
UPDATE public.word_pairs SET translation_a_en = 'mistake',      translation_b_en = 'error'          WHERE word_a = 'Fehler'         AND word_b = 'Irrtum';
UPDATE public.word_pairs SET translation_a_en = 'to help',      translation_b_en = 'to support'     WHERE word_a = 'helfen'         AND word_b = 'unterstützen';
UPDATE public.word_pairs SET translation_a_en = 'clean',        translation_b_en = 'dirty'          WHERE word_a = 'sauber'         AND word_b = 'schmutzig';
UPDATE public.word_pairs SET translation_a_en = 'loud',         translation_b_en = 'quiet'          WHERE word_a = 'laut'           AND word_b = 'leise';
UPDATE public.word_pairs SET translation_a_en = 'old',          translation_b_en = 'new'            WHERE word_a = 'alt'            AND word_b = 'neu';
UPDATE public.word_pairs SET translation_a_en = 'to open',      translation_b_en = 'to close'       WHERE word_a = 'öffnen'         AND word_b = 'schließen';
UPDATE public.word_pairs SET translation_a_en = 'strong',       translation_b_en = 'weak'           WHERE word_a = 'stark'          AND word_b = 'schwach';
UPDATE public.word_pairs SET translation_a_en = 'friendly',     translation_b_en = 'rude'           WHERE word_a = 'freundlich'     AND word_b = 'unhöflich';
UPDATE public.word_pairs SET translation_a_en = 'answer',       translation_b_en = 'question'       WHERE word_a = 'Antwort'        AND word_b = 'Frage';
UPDATE public.word_pairs SET translation_a_en = 'cheap',        translation_b_en = 'expensive'      WHERE word_a = 'billig'         AND word_b = 'teuer';
UPDATE public.word_pairs SET translation_a_en = 'to drive',     translation_b_en = 'to travel'      WHERE word_a = 'fahren'         AND word_b = 'reisen';
UPDATE public.word_pairs SET translation_a_en = 'way',          translation_b_en = 'path'           WHERE word_a = 'Weg'            AND word_b = 'Pfad';
UPDATE public.word_pairs SET translation_a_en = 'to begin',     translation_b_en = 'to start'       WHERE word_a = 'beginnen'       AND word_b = 'starten';
UPDATE public.word_pairs SET translation_a_en = 'broken',       translation_b_en = 'defective'      WHERE word_a = 'kaputt'         AND word_b = 'defekt';
UPDATE public.word_pairs SET translation_a_en = 'boss',         translation_b_en = 'supervisor'     WHERE word_a = 'Chef'           AND word_b = 'Vorgesetzter';
UPDATE public.word_pairs SET translation_a_en = 'break',        translation_b_en = 'interruption'   WHERE word_a = 'Pause'          AND word_b = 'Unterbrechung';

-- 38 additional pairs added via Lovable
UPDATE public.word_pairs SET translation_a_en = 'to walk',      translation_b_en = 'to run'         WHERE word_a = 'gehen'          AND word_b = 'laufen';
UPDATE public.word_pairs SET translation_a_en = 'to buy',       translation_b_en = 'to acquire'     WHERE word_a = 'kaufen'         AND word_b = 'erwerben';
UPDATE public.word_pairs SET translation_a_en = 'to think',     translation_b_en = 'to reflect'     WHERE word_a = 'denken'         AND word_b = 'nachdenken';
UPDATE public.word_pairs SET translation_a_en = 'to start',     translation_b_en = 'to begin'       WHERE word_a = 'anfangen'       AND word_b = 'beginnen';
UPDATE public.word_pairs SET translation_a_en = 'to look',      translation_b_en = 'to see'         WHERE word_a = 'schauen'        AND word_b = 'sehen';
UPDATE public.word_pairs SET translation_a_en = 'to work',      translation_b_en = 'to do odd jobs' WHERE word_a = 'arbeiten'       AND word_b = 'jobben';
UPDATE public.word_pairs SET translation_a_en = 'to ask',       translation_b_en = 'to inquire'     WHERE word_a = 'fragen'         AND word_b = 'nachfragen';
UPDATE public.word_pairs SET translation_a_en = 'to say',       translation_b_en = 'to inform'      WHERE word_a = 'sagen'          AND word_b = 'mitteilen';
UPDATE public.word_pairs SET translation_a_en = 'to speak',     translation_b_en = 'to be silent'   WHERE word_a = 'sprechen'       AND word_b = 'schweigen';
UPDATE public.word_pairs SET translation_a_en = 'to come',      translation_b_en = 'to go'          WHERE word_a = 'kommen'         AND word_b = 'gehen';
UPDATE public.word_pairs SET translation_a_en = 'to love',      translation_b_en = 'to hate'        WHERE word_a = 'lieben'         AND word_b = 'hassen';
UPDATE public.word_pairs SET translation_a_en = 'to win',       translation_b_en = 'to lose'        WHERE word_a = 'gewinnen'       AND word_b = 'verlieren';
UPDATE public.word_pairs SET translation_a_en = 'to start',     translation_b_en = 'to stop'        WHERE word_a = 'anfangen'       AND word_b = 'aufhören';
UPDATE public.word_pairs SET translation_a_en = 'bright',       translation_b_en = 'dark'           WHERE word_a = 'hell'           AND word_b = 'dunkel';
UPDATE public.word_pairs SET translation_a_en = 'to install',   translation_b_en = 'to set up'      WHERE word_a = 'installieren'   AND word_b = 'einrichten';
UPDATE public.word_pairs SET translation_a_en = 'to delete',    translation_b_en = 'to remove'      WHERE word_a = 'löschen'        AND word_b = 'entfernen';
UPDATE public.word_pairs SET translation_a_en = 'to save',      translation_b_en = 'to back up'     WHERE word_a = 'speichern'      AND word_b = 'sichern';
UPDATE public.word_pairs SET translation_a_en = 'to update',    translation_b_en = 'to update'      WHERE word_a = 'aktualisieren'  AND word_b = 'updaten';
UPDATE public.word_pairs SET translation_a_en = 'to connect',   translation_b_en = 'to disconnect'  WHERE word_a = 'verbinden'      AND word_b = 'trennen';
UPDATE public.word_pairs SET translation_a_en = 'to upload',    translation_b_en = 'to download'    WHERE word_a = 'hochladen'      AND word_b = 'herunterladen';
UPDATE public.word_pairs SET translation_a_en = 'to log in',    translation_b_en = 'to log out'     WHERE word_a = 'einloggen'      AND word_b = 'ausloggen';
UPDATE public.word_pairs SET translation_a_en = 'to start',     translation_b_en = 'to stop'        WHERE word_a = 'starten'        AND word_b = 'stoppen';
UPDATE public.word_pairs SET translation_a_en = 'to send',      translation_b_en = 'to receive'     WHERE word_a = 'senden'         AND word_b = 'empfangen';
UPDATE public.word_pairs SET translation_a_en = 'to answer',    translation_b_en = 'to react'       WHERE word_a = 'antworten'      AND word_b = 'reagieren';
UPDATE public.word_pairs SET translation_a_en = 'to advise',    translation_b_en = 'to inform'      WHERE word_a = 'beraten'        AND word_b = 'informieren';
UPDATE public.word_pairs SET translation_a_en = 'to complain',  translation_b_en = 'to praise'      WHERE word_a = 'beschweren'     AND word_b = 'loben';
UPDATE public.word_pairs SET translation_a_en = 'to clarify',   translation_b_en = 'to confuse'     WHERE word_a = 'klären'         AND word_b = 'verwirren';
UPDATE public.word_pairs SET translation_a_en = 'to order',     translation_b_en = 'to cancel'      WHERE word_a = 'bestellen'      AND word_b = 'stornieren';
UPDATE public.word_pairs SET translation_a_en = 'to plan',      translation_b_en = 'to improvise'   WHERE word_a = 'planen'         AND word_b = 'improvisieren';
UPDATE public.word_pairs SET translation_a_en = 'to organise',  translation_b_en = 'to chaos'       WHERE word_a = 'organisieren'   AND word_b = 'chaotisieren';
UPDATE public.word_pairs SET translation_a_en = 'to understand',translation_b_en = 'to misunderstand' WHERE word_a = 'verstehen'    AND word_b = 'missverstehen';
UPDATE public.word_pairs SET translation_a_en = 'to arrange',   translation_b_en = 'to cancel'      WHERE word_a = 'vereinbaren'    AND word_b = 'absagen';
UPDATE public.word_pairs SET translation_a_en = 'to check',     translation_b_en = 'to ignore'      WHERE word_a = 'prüfen'         AND word_b = 'ignorieren';
UPDATE public.word_pairs SET translation_a_en = 'to analyse',   translation_b_en = 'to summarise'   WHERE word_a = 'analysieren'    AND word_b = 'zusammenfassen';
UPDATE public.word_pairs SET translation_a_en = 'to develop',   translation_b_en = 'to destroy'     WHERE word_a = 'entwickeln'     AND word_b = 'zerstören';
UPDATE public.word_pairs SET translation_a_en = 'to optimise',  translation_b_en = 'to worsen'      WHERE word_a = 'optimieren'     AND word_b = 'verschlechtern';
UPDATE public.word_pairs SET translation_a_en = 'to automate',  translation_b_en = 'to do manually' WHERE word_a = 'automatisieren' AND word_b = 'manuell machen';
UPDATE public.word_pairs SET translation_a_en = 'to test',      translation_b_en = 'to release'     WHERE word_a = 'testen'         AND word_b = 'freigeben';
