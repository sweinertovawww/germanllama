ALTER TABLE public.word_pairs
  ADD COLUMN translation_a_sk TEXT,
  ADD COLUMN translation_b_sk TEXT;

-- Original 24 pairs
UPDATE public.word_pairs SET translation_a_sk = 'veľký',         translation_b_sk = 'malý'            WHERE word_a = 'groß'           AND word_b = 'klein';
UPDATE public.word_pairs SET translation_a_sk = 'rýchly',        translation_b_sk = 'pomalý'          WHERE word_a = 'schnell'        AND word_b = 'langsam';
UPDATE public.word_pairs SET translation_a_sk = 'kupovať',       translation_b_sk = 'predávať'        WHERE word_a = 'kaufen'         AND word_b = 'verkaufen';
UPDATE public.word_pairs SET translation_a_sk = 'začať',         translation_b_sk = 'ukončiť'         WHERE word_a = 'anfangen'       AND word_b = 'beenden';
UPDATE public.word_pairs SET translation_a_sk = 'chorý',         translation_b_sk = 'zdravý'          WHERE word_a = 'krank'          AND word_b = 'gesund';
UPDATE public.word_pairs SET translation_a_sk = 'hovoriť',       translation_b_sk = 'rozprávať'       WHERE word_a = 'sprechen'       AND word_b = 'reden';
UPDATE public.word_pairs SET translation_a_sk = 'práca',         translation_b_sk = 'zamestnanie'     WHERE word_a = 'Arbeit'         AND word_b = 'Job';
UPDATE public.word_pairs SET translation_a_sk = 'unavený',       translation_b_sk = 'vyčerpaný'       WHERE word_a = 'müde'           AND word_b = 'erschöpft';
UPDATE public.word_pairs SET translation_a_sk = 'chyba',         translation_b_sk = 'omyl'            WHERE word_a = 'Fehler'         AND word_b = 'Irrtum';
UPDATE public.word_pairs SET translation_a_sk = 'pomáhať',       translation_b_sk = 'podporovať'      WHERE word_a = 'helfen'         AND word_b = 'unterstützen';
UPDATE public.word_pairs SET translation_a_sk = 'čistý',         translation_b_sk = 'špinavý'         WHERE word_a = 'sauber'         AND word_b = 'schmutzig';
UPDATE public.word_pairs SET translation_a_sk = 'hlasný',        translation_b_sk = 'tichý'           WHERE word_a = 'laut'           AND word_b = 'leise';
UPDATE public.word_pairs SET translation_a_sk = 'starý',         translation_b_sk = 'nový'            WHERE word_a = 'alt'            AND word_b = 'neu';
UPDATE public.word_pairs SET translation_a_sk = 'otvoriť',       translation_b_sk = 'zatvoriť'        WHERE word_a = 'öffnen'         AND word_b = 'schließen';
UPDATE public.word_pairs SET translation_a_sk = 'silný',         translation_b_sk = 'slabý'           WHERE word_a = 'stark'          AND word_b = 'schwach';
UPDATE public.word_pairs SET translation_a_sk = 'priateľský',    translation_b_sk = 'nezdvorilý'      WHERE word_a = 'freundlich'     AND word_b = 'unhöflich';
UPDATE public.word_pairs SET translation_a_sk = 'odpoveď',       translation_b_sk = 'otázka'          WHERE word_a = 'Antwort'        AND word_b = 'Frage';
UPDATE public.word_pairs SET translation_a_sk = 'lacný',         translation_b_sk = 'drahý'           WHERE word_a = 'billig'         AND word_b = 'teuer';
UPDATE public.word_pairs SET translation_a_sk = 'jazdiť',        translation_b_sk = 'cestovať'        WHERE word_a = 'fahren'         AND word_b = 'reisen';
UPDATE public.word_pairs SET translation_a_sk = 'cesta',         translation_b_sk = 'chodník'         WHERE word_a = 'Weg'            AND word_b = 'Pfad';
UPDATE public.word_pairs SET translation_a_sk = 'začať',         translation_b_sk = 'odštartovať'     WHERE word_a = 'beginnen'       AND word_b = 'starten';
UPDATE public.word_pairs SET translation_a_sk = 'rozbitý',       translation_b_sk = 'poškodený'       WHERE word_a = 'kaputt'         AND word_b = 'defekt';
UPDATE public.word_pairs SET translation_a_sk = 'šéf',           translation_b_sk = 'nadriadený'      WHERE word_a = 'Chef'           AND word_b = 'Vorgesetzter';
UPDATE public.word_pairs SET translation_a_sk = 'prestávka',     translation_b_sk = 'prerušenie'      WHERE word_a = 'Pause'          AND word_b = 'Unterbrechung';

-- 38 additional pairs
UPDATE public.word_pairs SET translation_a_sk = 'chodiť',        translation_b_sk = 'bežať'                WHERE word_a = 'gehen'          AND word_b = 'laufen';
UPDATE public.word_pairs SET translation_a_sk = 'kupovať',       translation_b_sk = 'nadobúdať'            WHERE word_a = 'kaufen'         AND word_b = 'erwerben';
UPDATE public.word_pairs SET translation_a_sk = 'myslieť',       translation_b_sk = 'premýšľať'            WHERE word_a = 'denken'         AND word_b = 'nachdenken';
UPDATE public.word_pairs SET translation_a_sk = 'začať',         translation_b_sk = 'začínať'              WHERE word_a = 'anfangen'       AND word_b = 'beginnen';
UPDATE public.word_pairs SET translation_a_sk = 'pozerať',       translation_b_sk = 'vidieť'               WHERE word_a = 'schauen'        AND word_b = 'sehen';
UPDATE public.word_pairs SET translation_a_sk = 'pracovať',      translation_b_sk = 'privyrábať si'        WHERE word_a = 'arbeiten'       AND word_b = 'jobben';
UPDATE public.word_pairs SET translation_a_sk = 'pýtať sa',      translation_b_sk = 'dopytovať sa'         WHERE word_a = 'fragen'         AND word_b = 'nachfragen';
UPDATE public.word_pairs SET translation_a_sk = 'povedať',       translation_b_sk = 'oznámiť'              WHERE word_a = 'sagen'          AND word_b = 'mitteilen';
UPDATE public.word_pairs SET translation_a_sk = 'hovoriť',       translation_b_sk = 'mlčať'                WHERE word_a = 'sprechen'       AND word_b = 'schweigen';
UPDATE public.word_pairs SET translation_a_sk = 'prísť',         translation_b_sk = 'ísť'                  WHERE word_a = 'kommen'         AND word_b = 'gehen';
UPDATE public.word_pairs SET translation_a_sk = 'milovať',       translation_b_sk = 'nenávidieť'           WHERE word_a = 'lieben'         AND word_b = 'hassen';
UPDATE public.word_pairs SET translation_a_sk = 'vyhrať',        translation_b_sk = 'prehrať'              WHERE word_a = 'gewinnen'       AND word_b = 'verlieren';
UPDATE public.word_pairs SET translation_a_sk = 'začať',         translation_b_sk = 'prestať'              WHERE word_a = 'anfangen'       AND word_b = 'aufhören';
UPDATE public.word_pairs SET translation_a_sk = 'svetlý',        translation_b_sk = 'tmavý'                WHERE word_a = 'hell'           AND word_b = 'dunkel';
UPDATE public.word_pairs SET translation_a_sk = 'nainštalovať',  translation_b_sk = 'nastaviť'             WHERE word_a = 'installieren'   AND word_b = 'einrichten';
UPDATE public.word_pairs SET translation_a_sk = 'vymazať',       translation_b_sk = 'odstrániť'            WHERE word_a = 'löschen'        AND word_b = 'entfernen';
UPDATE public.word_pairs SET translation_a_sk = 'uložiť',        translation_b_sk = 'zálohovať'            WHERE word_a = 'speichern'      AND word_b = 'sichern';
UPDATE public.word_pairs SET translation_a_sk = 'aktualizovať',  translation_b_sk = 'updatovať'            WHERE word_a = 'aktualisieren'  AND word_b = 'updaten';
UPDATE public.word_pairs SET translation_a_sk = 'pripojiť',      translation_b_sk = 'odpojiť'              WHERE word_a = 'verbinden'      AND word_b = 'trennen';
UPDATE public.word_pairs SET translation_a_sk = 'nahrať',        translation_b_sk = 'stiahnuť'             WHERE word_a = 'hochladen'      AND word_b = 'herunterladen';
UPDATE public.word_pairs SET translation_a_sk = 'prihlásiť sa',  translation_b_sk = 'odhlásiť sa'          WHERE word_a = 'einloggen'      AND word_b = 'ausloggen';
UPDATE public.word_pairs SET translation_a_sk = 'spustiť',       translation_b_sk = 'zastaviť'             WHERE word_a = 'starten'        AND word_b = 'stoppen';
UPDATE public.word_pairs SET translation_a_sk = 'odoslať',       translation_b_sk = 'prijať'               WHERE word_a = 'senden'         AND word_b = 'empfangen';
UPDATE public.word_pairs SET translation_a_sk = 'odpovedať',     translation_b_sk = 'reagovať'             WHERE word_a = 'antworten'      AND word_b = 'reagieren';
UPDATE public.word_pairs SET translation_a_sk = 'radiť',         translation_b_sk = 'informovať'           WHERE word_a = 'beraten'        AND word_b = 'informieren';
UPDATE public.word_pairs SET translation_a_sk = 'sťažovať sa',   translation_b_sk = 'chváliť'              WHERE word_a = 'beschweren'     AND word_b = 'loben';
UPDATE public.word_pairs SET translation_a_sk = 'objasniť',      translation_b_sk = 'zmiasť'               WHERE word_a = 'klären'         AND word_b = 'verwirren';
UPDATE public.word_pairs SET translation_a_sk = 'objednať',      translation_b_sk = 'stornovať'            WHERE word_a = 'bestellen'      AND word_b = 'stornieren';
UPDATE public.word_pairs SET translation_a_sk = 'plánovať',      translation_b_sk = 'improvizovať'         WHERE word_a = 'planen'         AND word_b = 'improvisieren';
UPDATE public.word_pairs SET translation_a_sk = 'organizovať',   translation_b_sk = 'vnášať chaos'         WHERE word_a = 'organisieren'   AND word_b = 'chaotisieren';
UPDATE public.word_pairs SET translation_a_sk = 'rozumieť',      translation_b_sk = 'nepochopiť'           WHERE word_a = 'verstehen'      AND word_b = 'missverstehen';
UPDATE public.word_pairs SET translation_a_sk = 'dohodnúť',      translation_b_sk = 'zrušiť'               WHERE word_a = 'vereinbaren'    AND word_b = 'absagen';
UPDATE public.word_pairs SET translation_a_sk = 'skontrolovať',  translation_b_sk = 'ignorovať'            WHERE word_a = 'prüfen'         AND word_b = 'ignorieren';
UPDATE public.word_pairs SET translation_a_sk = 'analyzovať',    translation_b_sk = 'zhrnúť'               WHERE word_a = 'analysieren'    AND word_b = 'zusammenfassen';
UPDATE public.word_pairs SET translation_a_sk = 'vyvíjať',       translation_b_sk = 'ničiť'                WHERE word_a = 'entwickeln'     AND word_b = 'zerstören';
UPDATE public.word_pairs SET translation_a_sk = 'optimalizovať', translation_b_sk = 'zhoršiť'              WHERE word_a = 'optimieren'     AND word_b = 'verschlechtern';
UPDATE public.word_pairs SET translation_a_sk = 'automatizovať', translation_b_sk = 'robiť manuálne'       WHERE word_a = 'automatisieren' AND word_b = 'manuell machen';
UPDATE public.word_pairs SET translation_a_sk = 'testovať',      translation_b_sk = 'uvoľniť'              WHERE word_a = 'testen'         AND word_b = 'freigeben';