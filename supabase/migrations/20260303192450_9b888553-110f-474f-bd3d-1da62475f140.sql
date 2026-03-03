CREATE TABLE public.leaderboard (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read leaderboard"
  ON public.leaderboard FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert scores"
  ON public.leaderboard FOR INSERT
  WITH CHECK (true);

CREATE INDEX idx_leaderboard_score ON public.leaderboard (score DESC);