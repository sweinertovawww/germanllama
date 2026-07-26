-- Columns translation_a_uk / translation_b_uk were added by
-- 20260726183048_4f0c46aa-4041-4b38-9150-23f913faf548.sql (via Lovable)

-- Original 24 pairs
UPDATE public.word_pairs SET translation_a_uk = 'великий',       translation_b_uk = 'малий'          WHERE word_a = 'groß'           AND word_b = 'klein';
UPDATE public.word_pairs SET translation_a_uk = 'швидкий',       translation_b_uk = 'повільний'      WHERE word_a = 'schnell'        AND word_b = 'langsam';
UPDATE public.word_pairs SET translation_a_uk = 'купувати',      translation_b_uk = 'продавати'      WHERE word_a = 'kaufen'         AND word_b = 'verkaufen';
UPDATE public.word_pairs SET translation_a_uk = 'почати',        translation_b_uk = 'закінчити'      WHERE word_a = 'anfangen'       AND word_b = 'beenden';
UPDATE public.word_pairs SET translation_a_uk = 'хворий',        translation_b_uk = 'здоровий'       WHERE word_a = 'krank'          AND word_b = 'gesund';
UPDATE public.word_pairs SET translation_a_uk = 'говорити',      translation_b_uk = 'розмовляти'     WHERE word_a = 'sprechen'       AND word_b = 'reden';
UPDATE public.word_pairs SET translation_a_uk = 'робота',        translation_b_uk = 'зайнятість'     WHERE word_a = 'Arbeit'         AND word_b = 'Job';
UPDATE public.word_pairs SET translation_a_uk = 'втомлений',     translation_b_uk = 'виснажений'     WHERE word_a = 'müde'           AND word_b = 'erschöpft';
UPDATE public.word_pairs SET translation_a_uk = 'помилка',       translation_b_uk = 'хиба'           WHERE word_a = 'Fehler'         AND word_b = 'Irrtum';
UPDATE public.word_pairs SET translation_a_uk = 'допомагати',    translation_b_uk = 'підтримувати'   WHERE word_a = 'helfen'         AND word_b = 'unterstützen';
UPDATE public.word_pairs SET translation_a_uk = 'дорога',        translation_b_uk = 'стежка'         WHERE word_a = 'Weg'            AND word_b = 'Pfad';
UPDATE public.word_pairs SET translation_a_uk = 'чистий',        translation_b_uk = 'брудний'        WHERE word_a = 'sauber'         AND word_b = 'schmutzig';
UPDATE public.word_pairs SET translation_a_uk = 'гучний',        translation_b_uk = 'тихий'          WHERE word_a = 'laut'           AND word_b = 'leise';
UPDATE public.word_pairs SET translation_a_uk = 'старий',        translation_b_uk = 'новий'          WHERE word_a = 'alt'            AND word_b = 'neu';
UPDATE public.word_pairs SET translation_a_uk = 'відкрити',      translation_b_uk = 'закрити'        WHERE word_a = 'öffnen'         AND word_b = 'schließen';
UPDATE public.word_pairs SET translation_a_uk = 'сильний',       translation_b_uk = 'слабкий'        WHERE word_a = 'stark'          AND word_b = 'schwach';
UPDATE public.word_pairs SET translation_a_uk = 'дружній',       translation_b_uk = 'нечемний'       WHERE word_a = 'freundlich'     AND word_b = 'unhöflich';
UPDATE public.word_pairs SET translation_a_uk = 'відповідь',     translation_b_uk = 'питання'        WHERE word_a = 'Antwort'        AND word_b = 'Frage';
UPDATE public.word_pairs SET translation_a_uk = 'дешевий',       translation_b_uk = 'дорогий'        WHERE word_a = 'billig'         AND word_b = 'teuer';
UPDATE public.word_pairs SET translation_a_uk = 'їхати',         translation_b_uk = 'подорожувати'   WHERE word_a = 'fahren'         AND word_b = 'reisen';
UPDATE public.word_pairs SET translation_a_uk = 'почати',        translation_b_uk = 'стартувати'     WHERE word_a = 'beginnen'       AND word_b = 'starten';
UPDATE public.word_pairs SET translation_a_uk = 'зламаний',      translation_b_uk = 'несправний'     WHERE word_a = 'kaputt'         AND word_b = 'defekt';
UPDATE public.word_pairs SET translation_a_uk = 'шеф',           translation_b_uk = 'начальник'      WHERE word_a = 'Chef'           AND word_b = 'Vorgesetzter';
UPDATE public.word_pairs SET translation_a_uk = 'перерва',       translation_b_uk = 'переривання'    WHERE word_a = 'Pause'          AND word_b = 'Unterbrechung';

-- 38 additional pairs added via Lovable
UPDATE public.word_pairs SET translation_a_uk = 'йти',           translation_b_uk = 'бігти'                WHERE word_a = 'gehen'          AND word_b = 'laufen';
UPDATE public.word_pairs SET translation_a_uk = 'купити',        translation_b_uk = 'придбати'             WHERE word_a = 'kaufen'         AND word_b = 'erwerben';
UPDATE public.word_pairs SET translation_a_uk = 'думати',        translation_b_uk = 'розмірковувати'       WHERE word_a = 'denken'         AND word_b = 'nachdenken';
UPDATE public.word_pairs SET translation_a_uk = 'почати',        translation_b_uk = 'розпочати'            WHERE word_a = 'anfangen'       AND word_b = 'beginnen';
UPDATE public.word_pairs SET translation_a_uk = 'дивитися',      translation_b_uk = 'бачити'               WHERE word_a = 'schauen'        AND word_b = 'sehen';
UPDATE public.word_pairs SET translation_a_uk = 'працювати',     translation_b_uk = 'підробляти'           WHERE word_a = 'arbeiten'       AND word_b = 'jobben';
UPDATE public.word_pairs SET translation_a_uk = 'питати',        translation_b_uk = 'перепитати'           WHERE word_a = 'fragen'         AND word_b = 'nachfragen';
UPDATE public.word_pairs SET translation_a_uk = 'сказати',       translation_b_uk = 'повідомити'           WHERE word_a = 'sagen'          AND word_b = 'mitteilen';
UPDATE public.word_pairs SET translation_a_uk = 'говорити',      translation_b_uk = 'мовчати'              WHERE word_a = 'sprechen'       AND word_b = 'schweigen';
UPDATE public.word_pairs SET translation_a_uk = 'приходити',     translation_b_uk = 'йти'                  WHERE word_a = 'kommen'         AND word_b = 'gehen';
UPDATE public.word_pairs SET translation_a_uk = 'любити',        translation_b_uk = 'ненавидіти'           WHERE word_a = 'lieben'         AND word_b = 'hassen';
UPDATE public.word_pairs SET translation_a_uk = 'перемогти',     translation_b_uk = 'програти'             WHERE word_a = 'gewinnen'       AND word_b = 'verlieren';
UPDATE public.word_pairs SET translation_a_uk = 'почати',        translation_b_uk = 'припинити'            WHERE word_a = 'anfangen'       AND word_b = 'aufhören';
UPDATE public.word_pairs SET translation_a_uk = 'світлий',       translation_b_uk = 'темний'               WHERE word_a = 'hell'           AND word_b = 'dunkel';
UPDATE public.word_pairs SET translation_a_uk = 'встановити',    translation_b_uk = 'налаштувати'          WHERE word_a = 'installieren'   AND word_b = 'einrichten';
UPDATE public.word_pairs SET translation_a_uk = 'видалити',      translation_b_uk = 'прибрати'             WHERE word_a = 'löschen'        AND word_b = 'entfernen';
UPDATE public.word_pairs SET translation_a_uk = 'зберегти',      translation_b_uk = 'резервувати'          WHERE word_a = 'speichern'      AND word_b = 'sichern';
UPDATE public.word_pairs SET translation_a_uk = 'оновити',       translation_b_uk = 'оновити'              WHERE word_a = 'aktualisieren'  AND word_b = 'updaten';
UPDATE public.word_pairs SET translation_a_uk = 'з’єднати',      translation_b_uk = 'роз’єднати'           WHERE word_a = 'verbinden'      AND word_b = 'trennen';
UPDATE public.word_pairs SET translation_a_uk = 'вивантажити',   translation_b_uk = 'завантажити'          WHERE word_a = 'hochladen'      AND word_b = 'herunterladen';
UPDATE public.word_pairs SET translation_a_uk = 'увійти',        translation_b_uk = 'вийти'                WHERE word_a = 'einloggen'      AND word_b = 'ausloggen';
UPDATE public.word_pairs SET translation_a_uk = 'запустити',     translation_b_uk = 'зупинити'             WHERE word_a = 'starten'        AND word_b = 'stoppen';
UPDATE public.word_pairs SET translation_a_uk = 'надіслати',     translation_b_uk = 'отримати'             WHERE word_a = 'senden'         AND word_b = 'empfangen';
UPDATE public.word_pairs SET translation_a_uk = 'відповідати',   translation_b_uk = 'реагувати'            WHERE word_a = 'antworten'      AND word_b = 'reagieren';
UPDATE public.word_pairs SET translation_a_uk = 'радити',        translation_b_uk = 'інформувати'          WHERE word_a = 'beraten'        AND word_b = 'informieren';
UPDATE public.word_pairs SET translation_a_uk = 'скаржитися',    translation_b_uk = 'хвалити'              WHERE word_a = 'beschweren'     AND word_b = 'loben';
UPDATE public.word_pairs SET translation_a_uk = 'з’ясувати',     translation_b_uk = 'заплутати'            WHERE word_a = 'klären'         AND word_b = 'verwirren';
UPDATE public.word_pairs SET translation_a_uk = 'замовити',      translation_b_uk = 'скасувати замовлення' WHERE word_a = 'bestellen'      AND word_b = 'stornieren';
UPDATE public.word_pairs SET translation_a_uk = 'планувати',     translation_b_uk = 'імпровізувати'        WHERE word_a = 'planen'         AND word_b = 'improvisieren';
UPDATE public.word_pairs SET translation_a_uk = 'організовувати',translation_b_uk = 'влаштовувати хаос'    WHERE word_a = 'organisieren'   AND word_b = 'chaotisieren';
UPDATE public.word_pairs SET translation_a_uk = 'розуміти',      translation_b_uk = 'неправильно зрозуміти' WHERE word_a = 'verstehen'     AND word_b = 'missverstehen';
UPDATE public.word_pairs SET translation_a_uk = 'домовитися',    translation_b_uk = 'скасувати зустріч'    WHERE word_a = 'vereinbaren'    AND word_b = 'absagen';
UPDATE public.word_pairs SET translation_a_uk = 'перевіряти',    translation_b_uk = 'ігнорувати'           WHERE word_a = 'prüfen'         AND word_b = 'ignorieren';
UPDATE public.word_pairs SET translation_a_uk = 'аналізувати',   translation_b_uk = 'підсумовувати'        WHERE word_a = 'analysieren'    AND word_b = 'zusammenfassen';
UPDATE public.word_pairs SET translation_a_uk = 'розвивати',     translation_b_uk = 'руйнувати'            WHERE word_a = 'entwickeln'     AND word_b = 'zerstören';
UPDATE public.word_pairs SET translation_a_uk = 'оптимізувати',  translation_b_uk = 'погіршувати'          WHERE word_a = 'optimieren'     AND word_b = 'verschlechtern';
UPDATE public.word_pairs SET translation_a_uk = 'автоматизувати',translation_b_uk = 'робити вручну'        WHERE word_a = 'automatisieren' AND word_b = 'manuell machen';
UPDATE public.word_pairs SET translation_a_uk = 'тестувати',     translation_b_uk = 'випустити'            WHERE word_a = 'testen'         AND word_b = 'freigeben';
