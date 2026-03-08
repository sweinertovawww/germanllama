
CREATE TABLE public.daily_visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (visitor_id, visit_date)
);

ALTER TABLE public.daily_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert visits" ON public.daily_visits
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read visit counts" ON public.daily_visits
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE INDEX idx_daily_visits_date ON public.daily_visits (visit_date);
