-- Separate leaderboard for Llama Jump (kept apart from Llama Run's
-- `leaderboard` table since the two games score on very different scales).
CREATE TABLE public.llama_jump_leaderboard (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.llama_jump_leaderboard ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read llama jump leaderboard"
  ON public.llama_jump_leaderboard FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert llama jump scores"
  ON public.llama_jump_leaderboard FOR INSERT
  WITH CHECK (true);

CREATE INDEX idx_llama_jump_leaderboard_score ON public.llama_jump_leaderboard (score DESC);
