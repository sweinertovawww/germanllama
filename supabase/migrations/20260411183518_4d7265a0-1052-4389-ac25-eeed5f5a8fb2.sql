
CREATE TABLE public.word_pairs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  word_a TEXT NOT NULL,
  word_b TEXT NOT NULL,
  pair_type TEXT NOT NULL CHECK (pair_type IN ('synonym', 'antonym')),
  translation_a TEXT NOT NULL,
  translation_b TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.word_pairs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read word pairs"
ON public.word_pairs
FOR SELECT
TO anon, authenticated
USING (true);

INSERT INTO public.word_pairs (word_a, word_b, pair_type, translation_a, translation_b, category) VALUES
('groß', 'klein', 'antonym', 'velký', 'malý', 'Alltag'),
('schnell', 'langsam', 'antonym', 'rychlý', 'pomalý', 'Alltag'),
('kaufen', 'verkaufen', 'antonym', 'kupovat', 'prodávat', 'Arbeit'),
('anfangen', 'beenden', 'antonym', 'začít', 'ukončit', 'Arbeit'),
('krank', 'gesund', 'antonym', 'nemocný', 'zdravý', 'Medizin'),
('sprechen', 'reden', 'synonym', 'mluvit', 'hovořit', 'Alltag'),
('Arbeit', 'Job', 'synonym', 'práce', 'práce/zaměstnání', 'Arbeit'),
('müde', 'erschöpft', 'synonym', 'unavený', 'vyčerpaný', 'Alltag'),
('Fehler', 'Irrtum', 'synonym', 'chyba', 'omyl', 'Arbeit'),
('helfen', 'unterstützen', 'synonym', 'pomáhat', 'podporovat', 'Arbeit'),
('sauber', 'schmutzig', 'antonym', 'čistý', 'špinavý', 'Alltag'),
('laut', 'leise', 'antonym', 'hlasitý', 'tichý', 'Alltag'),
('alt', 'neu', 'antonym', 'starý', 'nový', 'Alltag'),
('öffnen', 'schließen', 'antonym', 'otevřít', 'zavřít', 'Alltag'),
('stark', 'schwach', 'antonym', 'silný', 'slabý', 'Alltag'),
('freundlich', 'unhöflich', 'antonym', 'přátelský', 'nezdvořilý', 'Alltag'),
('Antwort', 'Frage', 'antonym', 'odpověď', 'otázka', 'Alltag'),
('billig', 'teuer', 'antonym', 'levný', 'drahý', 'Alltag'),
('fahren', 'reisen', 'synonym', 'jet', 'cestovat', 'Alltag'),
('Weg', 'Pfad', 'synonym', 'cesta', 'stezka', 'Alltag'),
('beginnen', 'starten', 'synonym', 'začít', 'odstartovat', 'Arbeit'),
('kaputt', 'defekt', 'synonym', 'rozbitý', 'poškozený', 'Arbeit'),
('Chef', 'Vorgesetzter', 'synonym', 'šéf', 'nadřízený', 'Arbeit'),
('Pause', 'Unterbrechung', 'synonym', 'přestávka', 'přerušení', 'Arbeit');
