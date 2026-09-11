# Plán překladu do Ukrajinštiny — GermanLlama

## FÁZE 1 — DOKONČENO (2026-05-09)

Všechny UI soubory jsou hotové:

| Soubor | Status |
|--------|--------|
| src/i18n/translations.ts — uk blok (~320 klíčů) | ✅ |
| src/i18n/translations.ts — typ Lang + export | ✅ |
| src/components/LanguageSelector.tsx — 🇺🇦 option | ✅ |
| src/contexts/LanguageContext.tsx — browser detection | ✅ |
| src/game/vocabularyData.ts — interface (translationUk field) | ✅ |
| src/game/vocabularyData.ts — FlashCard interface + getAllFlashCards | ✅ |
| src/game/LlamaGame.tsx — getTranslation() | ✅ |
| src/pages/FlashCards.tsx — getCardFace() | ✅ |
| src/pages/Pexeso.tsx — getCardFace() | ✅ |
| src/pages/SentenceBuilder.tsx — translationUk field + display | ✅ |
| src/game/scrabble/crosswordGenerator.ts — WordEntry uk? | ✅ |
| src/game/scrabble/ScrabbleClues.tsx — uk display | ✅ |
| src/game/scrabble/ScrabbleHints.tsx — uk display | ✅ |
| src/components/games/wortpaare/MatchedPair.tsx — uk fallback | ✅ |
| src/pages/Index.tsx — 10 sample words | ✅ |
| src/pages/Wortpaare.tsx — 6 sample pairs | ✅ |
| src/pages/professions/ProfessionLanding.tsx — 15 profesí | ✅ |
| src/components/SEOHead.tsx — hreflang | ✅ |

**Aktuální stav:** Funguje s fallbackem EN → CZ pro slovíčka (translationUk = undefined).
Uživatel vidí anglický překlad, kde není UK překlad.

---

## FÁZE 2 — TODO: vocabularyData.ts překlady

### QUESTIONS (492 záznamů)
Každý záznam potřebuje: `translationUk: "..."`
Vzor: `{ text: "Jaký člen má Lama?", ..., translationEn: "llama", translationPl: "lama", translationUk: "лама", ... }`

Skupiny podle profese:
- obecné (~50 záznamů) — základní slovíčka
- automechanik (~40)
- zedník / stavba (~40)
- gastro (~40)
- sestřička (~35)
- truhlář (~35)
- instalatér (~35)
- elektrikář (~40)
- pokladní (~30)
- uklízečka (~30)
- kancelář (~30)
- zahradník (~30)
- učitel (~30)
- kadeřník (~30)
- systemy_pro_haseni (~17)

### FILL_QUESTIONS (1146 záznamů)
Každý záznam: `translationUk: "..."` — překlad celé věty/fráze do UKR

### Strategie
1. Zpracovávat po skupinách (po profesích), cca 50-100 záznamů najednou
2. Využít anglický překlad jako základ + doplnit specifika
3. Nejprve QUESTIONS (kratší slova), pak FILL_QUESTIONS (věty)

### Priorita
1. obecné — nejpoužívanější, zahrnuto ve všech hrách
2. elektrikář, instalatér, zedník — typické profese pro UA migranty
3. gastro, sestra — druhá priorita
4. ostatní profese

---

## Poznámky k překladu

- Fallback: `q.translationUk ?? q.translationEn ?? q.translation`
  - Dokud translationUk není vyplněno → zobrazí EN překlad
  - Pro Scrabble kříže: zobrazí EN nápovědu
- Všechny hry FUNKČNÍ i bez UK slovíček (jen ne v UKR)
- Push/deploy lze provést kdykoli — build projde

---

## Stav před commitem

Všechny změny jsou lokálně, ŽÁDNÝ commit ani push nebyl proveden.
Změněné soubory:
- src/i18n/translations.ts
- src/components/LanguageSelector.tsx
- src/contexts/LanguageContext.tsx
- src/game/vocabularyData.ts
- src/game/LlamaGame.tsx
- src/pages/FlashCards.tsx
- src/pages/Pexeso.tsx
- src/pages/SentenceBuilder.tsx
- src/game/scrabble/crosswordGenerator.ts
- src/game/scrabble/ScrabbleClues.tsx
- src/game/scrabble/ScrabbleHints.tsx
- src/components/games/wortpaare/MatchedPair.tsx
- src/pages/Index.tsx
- src/pages/Wortpaare.tsx
- src/pages/professions/ProfessionLanding.tsx
- src/components/SEOHead.tsx
