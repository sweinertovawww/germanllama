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
- [x] Žádné chybějící klíče – fáze hotová
- [x] git commit "audit(translations): all keys present, no changes needed"

## FÁZE 2 – Statická data na landing pages
Stav: opraveno v předchozí session (commit cccdbe9).

- [x] Index.tsx sampleWords – ko/pl/en/cs větve přidány
- [x] Wortpaare.tsx sampleWords – ko/pl/en/cs větve přidány
- [x] ProfessionLanding.tsx sampleWords – ko/pl/en/cs větve přidány (v.en zatím undefined → opraveno v Fázi 3)
- [x] git commit "audit(phase2): static landing page sample words fixed"

## FÁZE 3 – Herní data (vocabularyData.ts + Supabase)

### 3a – FlashCard interface + getAllFlashCards()
- [ ] Přidat `en?: string` do FlashCard interface (vocabularyData.ts:1791)
- [ ] Aktualizovat getAllFlashCards() – mapovat translationEn → en (řádky 1801–1817)
- [ ] git commit + push

### 3b – Supabase word_pairs EN překlady
- [ ] Vytvořit supabase/migrations/20260503000000_add_english_translations.sql
  - ALTER TABLE přidat translation_a_en, translation_b_en
  - UPDATE pro všech 24+38 = 62 párů (EN překlady)
- [ ] Aktualizovat useWortpaare.ts – přidat translation_a_en/b_en do WordPair interface
- [ ] git commit + push
- [ ] Říct uživateli, co spustit v Lovable SQL editoru

## FÁZE 4 – Vizuální kontrola komponent

### 4a – FlashCards.tsx
- [ ] Řádek 224: přidat `lang === "en"` větev před fallback na czechtinu
- [ ] git commit + push

### 4b – Pexeso.tsx
- [ ] Řádek 61: přidat `activeLang === "en"` větev v buildCards()
- [ ] Řádky 37-41: přidat `en` pole do fallback karet
- [ ] Řádek 367: opravit štítek "CZ" → přidat `lang === "en" ? "EN"` větev
- [ ] git commit + push

### 4c – MatchedPair.tsx + useWortpaare.ts
- [ ] Přidat translation_a_en/b_en do WordPair interface (useWortpaare.ts)
- [ ] Řádky 20 a 40: přidat `lang === "en"` větev
- [ ] git commit + push

## ODLOŽENO (budoucí práce)
- ProfessionLanding.tsx h1/intro/tips pro PL a EN – vyžaduje přeložit 15 × 2 jazyky = 30 bloků obsahu
