# Polish Translation Plan – GermanLlama

Generated: 2026-05-02. Resume by reading this file and continuing from the first unchecked item.

## Summary of gaps found

- `translations.ts` — all 254 keys present in `pl:` ✅
- `vocabularyData.ts` — `FlashCard` interface missing `pl` field; `getAllFlashCards()` omits `translationPl`
- `FlashCards.tsx` — back of card uses `lang === "ko" ? card.ko : card.czech` (no PL branch)
- `Pexeso.tsx` — `buildCards()` uses Czech for non-KO; card label shows "CZ" for PL; share text hardcoded in Czech
- `SentenceBuilder.tsx` — hint uses `q.translation` (Czech only); share text hardcoded in Czech
- `LlamaGame.tsx` — share text hardcoded in Czech (`Právě jsem vyskákal...`)
- `translations.ts` — missing share-text keys for all 3 games (need to add + translate)
- `MatchedPair.tsx` (Wortpaare) — Supabase `word_pairs` table has no `translation_a_pl`/`translation_b_pl`; Czech shown as fallback. Adding PL requires a Supabase migration — deferred to future.

---

## Checklist

- [x] **src/i18n/translations.ts** — add 3 share-text keys (shareLlamaRun, sharePexeso, shareSentenceBuilder) to cs/ko/en/pl sections
- [x] **src/game/vocabularyData.ts** — add `pl?: string` to FlashCard interface; update getAllFlashCards() to include translationPl
- [x] **src/pages/FlashCards.tsx** — show PL translation on card back; show "PL" label
- [x] **src/pages/Pexeso.tsx** — use PL translation in buildCards(); show "PL" label; use t("sharePexeso") share text
- [x] **src/pages/SentenceBuilder.tsx** — store all translations in SentencePair; display PL hint for PL lang; use t("shareSentenceBuilder") share text
- [x] **src/game/LlamaGame.tsx** — use t("shareLlamaRun") share text
- [x] **Wortpaare (MatchedPair.tsx + Supabase)** — migration 20260502000000_add_polish_translations.sql adds translation_a_pl/b_pl; MatchedPair.tsx and useWortpaare.ts updated; types.ts synced
