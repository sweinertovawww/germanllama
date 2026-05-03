# GermanLlama – Language Audit Plan
Generated: 2026-05-03. Každá fáze commitnuta zvlášť. Resume: přečti tento soubor a pokračuj od první [ ] položky.

## Nalezené problémy (souhrn)

| Soubor | Problém | Závažnost |
|--------|---------|-----------|
| vocabularyData.ts | FlashCard interface chybí `en?: string` | KRITICKÁ |
| vocabularyData.ts | getAllFlashCards() nemapuje translationEn → en | KRITICKÁ |
| FlashCards.tsx:224 | chybí `lang === "en"` větev – EN hráč vidí češtinu | VYSOKÁ |
| Pexeso.tsx:61 | chybí `lang === "en"` větev v buildCards() | VYSOKÁ |
| Pexeso.tsx:37-41 | fallback karty nemají `en` pole | STŘEDNÍ |
| Pexeso.tsx:367 | štítek "CZ" zobrazován EN hráčům (má být "EN") | STŘEDNÍ |
| MatchedPair.tsx:20,40 | chybí `lang === "en"` větev – EN hráč vidí češtinu | VYSOKÁ |
| useWortpaare.ts | WordPair interface chybí translation_a_en/b_en | VYSOKÁ |
| Supabase word_pairs | chybí sloupce translation_a_en / translation_b_en | VYSOKÁ |
| ProfessionLanding.tsx:338-340 | h1/intro/tips jen CS+KO, PL/EN fallback na CS | ODLOŽENO (velký content) |

## FÁZE 0 – Vytvoření plánu
- [x] Projít projekt a vytvořit AUDIT_PLAN.md
- [x] git commit "audit: create audit plan"

## FÁZE 1 – translations.ts
Stav: `ko`, `en`, `pl` jsou definovány jako `typeof cs` — TypeScript vynutí shodu klíčů při buildu.
Spot-check: sekce cs začíná na řádku 3, ko na 306, en na 609, pl na 912.

- [x] Ověřit, že všechny klíče jsou přítomny ve všech 4 jazycích (typeof cs vynucení + 303 klíčů v každé sekci)
- [x] Zadne chybejici klice – faze hotova (typeof cs vynuceni)
- [x] git commit "audit(translations): all keys present, no changes needed"

## FÁZE 2 – Statická data na landing pages
Stav: opraveno v předchozí session (commit cccdbe9).

- [x] Index.tsx sampleWords – ko/pl/en/cs větve přidány
- [x] Wortpaare.tsx sampleWords – ko/pl/en/cs větve přidány
- [x] ProfessionLanding.tsx sampleWords – ko/pl/en/cs větve přidány (v.en zatím undefined → opraveno v Fázi 3)
- [x] git commit cccdbe9 "Fix sample words on landing pages to show PL/EN translations"

## FÁZE 3 – Herní data (vocabularyData.ts + Supabase)

### 3a – FlashCard interface + getAllFlashCards()
- [x] Přidat `en?: string` do FlashCard interface (vocabularyData.ts:1791)
- [x] Aktualizovat getAllFlashCards() – mapovat translationEn → en (řádky 1801–1817)
- [x] git commit b9f1065 + push

### 3b – Supabase word_pairs EN překlady
- [x] Vytvoreno supabase/migrations/20260503000000_add_english_translations.sql
  - ALTER TABLE pridava translation_a_en, translation_b_en
  - UPDATE pro vsech 62 paru (EN preklady)
- [x] Aktualizovan useWortpaare.ts – pridany translation_a_en/b_en do WordPair interface
- [x] Aktualizovan types.ts
- [x] git commit ac845cf + push
- [x] SQL soubor pripraven – uzivatel musi spustit v Lovable SQL editoru

## FÁZE 4 – Vizuální kontrola komponent

### 4a – FlashCards.tsx
- [x] Radek 224: pridana `lang === "en"` vetev pred fallback na cestinu
- [x] git commit 515aaed + push

### 4b – Pexeso.tsx
- [x] Radek 61: pridana `activeLang === "en"` vetev v buildCards()
- [x] Radky 37-41: pridano `en` pole do fallback karet
- [x] Radek 367: opraven stitek "CZ" → pridana `lang === "en" ? "EN"` vetev
- [x] git commit 93c81d5 + push

### 4c – MatchedPair.tsx + useWortpaare.ts
- [x] Pridany translation_a_en/b_en do WordPair interface (useWortpaare.ts)
- [x] Radky 20 a 40: pridana `lang === "en"` vetev
- [x] git commit 129935b + push

## ODLOŽENO (budoucí práce)
- ProfessionLanding.tsx h1/intro/tips pro PL a EN – vyžaduje přeložit 15 × 2 jazyky = 30 bloků obsahu
