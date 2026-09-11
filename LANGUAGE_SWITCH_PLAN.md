# LANGUAGE SWITCH PLAN
## Výběr mateřského jazyka + cílového jazyka pro výuku

Aktualizuj [x] = hotovo / [ ] = zbývá po každé fázi.

---

## FÁZE 0 — Plán [x] HOTOVO

Tento soubor.

---

## FÁZE 1 — Datová vrstva [x] HOTOVO

### Soubory ke změně:

#### `src/i18n/translations.ts`
- [ ] Přidat `"de"` do `Lang` type: `"cs" | "ko" | "en" | "pl" | "de"`
- [ ] Přidat nové překlady UI klíčů potřebné pro onboarding a nové funkce (DE + všechny jazyky):
  - `onboardingTitle` — "Vítejte na GermanLlama!"
  - `onboardingNativeLang` — "Váš jazyk (UI)"
  - `onboardingTargetLang` — "Chci se učit"
  - `onboardingStart` — "Začít"
  - `changeLangs` — "Změnit jazyky"
  - `myLang` — "Můj jazyk"
  - `iWantToLearn` — "Chci se učit"
  - `langNameCs` — "Čeština"
  - `langNameDe` — "Němčina"
  - `langNameEn` — "Angličtina"
  - `langNamePl` — "Polština"
  - `langNameKo` — "Korejština"
  - `gameOnlyForDe` — "Tato hra je dostupná pouze pro výuku němčiny. Přejdi do nastavení a jako cílový jazyk zvol Němčinu."
  - `switchToGerman` — "Přepnout na výuku němčiny"
  - `targetLangSameError` — "Cílový jazyk musí být jiný než tvůj mateřský jazyk."
- [ ] Přidat kompletní DE objekt s překladem VŠECH ~220 klíčů do němčiny
- [ ] Aktualizovat `export const translations: Record<Lang, typeof cs>` → přidat `de`

#### `src/contexts/LanguageContext.tsx`
- [ ] Přidat `targetLanguage: Lang` do interface `LanguageContextValue`
- [ ] Přidat `setTargetLanguage: (l: Lang) => void` do interface
- [ ] Přidat stav `targetLanguage` (default: `"de"`) inicializovaný z localStorage `"gl_target_lang"`
- [ ] `handleSetTargetLanguage`: uložit do localStorage `"gl_target_lang"`, zkontrolovat !== lang
- [ ] Exportovat `targetLanguage` + `setTargetLanguage` z context value
- [ ] Výchozí hodnota: `lang = "cs"`, `targetLanguage = "de"` (zachování současného chování)

---

## FÁZE 2 — Onboarding obrazovka [x] HOTOVO

### Nové soubory:

#### `src/components/LanguageSelector.tsx` (NOVÝ)
- [ ] Reusable komponenta — funguje jako fullscreen overlay I jako modal
- [ ] Props: `mode: "onboarding" | "modal"`, `onClose?: () => void`
- [ ] Zobrazuje:
  - Nadpis (t("onboardingTitle"))
  - Výběr "Můj jazyk": 5 flagů (🇨🇿 CS, 🇵🇱 PL, 🇰🇷 KO, 🇬🇧 EN, 🇩🇪 DE)
  - Výběr "Chci se učit": stejné 5 flagů, disabled = ten co je vybrán jako native
  - Tlačítko "Začít" / "Uložit"
- [ ] Po výběru: volá `setLang` + `setTargetLanguage` + uloží `gl_onboarding_done = "1"` do localStorage
- [ ] Detekce jazyka prohlížeče při prvním zobrazení (`navigator.language`) → předvyplnit native lang

#### Integrace onboarding do `src/App.tsx`
- [ ] Přidat state `showOnboarding = !localStorage.getItem("gl_onboarding_done")`
- [ ] Pokud `showOnboarding`: renderovat `<LanguageSelector mode="onboarding" />`
- [ ] Po zavření onboarding: `setShowOnboarding(false)`

### Změny v existujících souborech:

#### `src/components/Layout.tsx`
- [ ] Nahradit 4 flagová tlačítka (cs/ko/en/pl) novým UI:
  - Desktop: zobrazit "🇨🇿 → 🇩🇪" (flag native + šipka + flag target) jako klikatelný button
  - Klik: otevřít `<LanguageSelector mode="modal" />`
- [ ] Přidat state `langSelectorOpen` + modal rendering
- [ ] Aktualizovat URL param `?lang=` logic (přidat podporu pro "de")

---

## FÁZE 3 — Herní logika [x] HOTOVO

### Rozdělení her:
- **All-language** (fungují s libovolným targetLanguage): FlashCards, Pexeso
- **German-only** (pouze targetLanguage="de"): LlamaRun, SentenceBuilder, Scrabble, Wortpaare

### `src/pages/FlashCards.tsx` [ ]
- [ ] Importovat `targetLanguage` z `useLanguage()`
- [ ] Přidat helper `getFlashCardFace(card, language: Lang): string`:
  - "de" → `card.german`
  - "cs" → `card.czech`
  - "ko" → `card.ko`
  - "pl" → `card.pl ?? card.czech`
  - "en" → `card.en ?? card.czech`
- [ ] Front strany karty: `getFlashCardFace(card, targetLanguage)` místo `card.german`
- [ ] Back strany karty (překlad): `getFlashCardFace(card, lang)` místo inline `lang === "ko" ? ...`
- [ ] Zkontrolovat category filter "nouns" / "sentences" — stále funguje (typ karet se nemění)
- [ ] Pozor: pro targetLanguage="de" → `card.german` obsahuje člen (der Hund), to je OK

### `src/pages/Pexeso.tsx` [ ]
- [ ] Importovat `targetLanguage` z `useLanguage()`
- [ ] Přidat `getFlashCardFace` helper (nebo importovat ze sdíleného místa)
- [ ] Upravit `buildCards(pairCount, professions, lang, targetLanguage)`:
  - Cílový jazyk (co se učíš): `getFlashCardFace(card, targetLanguage)`
  - Mateřský jazyk (překlad): `getFlashCardFace(card, lang)`
  - Pole `lang` na MemoryCard: zachovat "de" | "native" nebo string pro zobrazení
- [ ] Předat `targetLanguage` do `buildCards` ve `startGame` a `resetGame`

### `src/game/LlamaGame.tsx` [ ]
- [ ] Importovat `targetLanguage` z `useLanguage()`
- [ ] Přidat podmíněné zobrazení: pokud `targetLanguage !== "de"`, zobrazit info panel místo hry
  - Text: `t("gameOnlyForDe")` + tlačítko `t("switchToGerman")` → volá `setTargetLanguage("de")`
- [ ] Nahradit použití `q.text` (Czech "Jaký člen má X?") voláním `t("questionArticle", { word: germanWord })`
  - `getGermanWordFromText` zůstává beze změny
  - `questionArticle` klíč existuje ve všech jazycích, přidat DE: "Welchen Artikel hat {word}?"
- [ ] Překlad zpětné vazby (correctArticle, wrong1 atd.) — již používá `t()`, jen doplnit DE překlad

### `src/pages/SentenceBuilder.tsx` [ ]
- [ ] Importovat `targetLanguage` z `useLanguage()`
- [ ] Přidat podmíněné zobrazení: pokud `targetLanguage !== "de"`, zobrazit info panel
- [ ] `getTranslation(pair, lang)` helper — ověřit nebo přidat pokud chybí:
  - Zobrazuje hint překladu v mateřském jazyce hráče
  - Stávající `SentencePair` má `translationKo`, `translationEn`, `translationPl` — OK

### `src/game/scrabble/ScrabbleGame.tsx` [ ]
- [ ] Importovat `targetLanguage` z `useLanguage()`
- [ ] V phase "lobby": pokud `targetLanguage !== "de"`, zobrazit info panel místo lobby

### `src/game/scrabble/ScrabbleClues.tsx` [ ]
- [ ] Přidat `"de"` případ do renderClue:
  - `lang === "de"` → použít `p.entry.czech` (nebo přidat poznámku že DE nelze — pokud je targetLanguage=de, lang nemůže být de)
  - Ve skutečnosti: pokud targetLanguage=de, pak lang ∈ {cs,ko,en,pl} → clue v daném jazyce
  - Pokud targetLanguage≠de: hra se nespustí (info panel) → tento případ nenastane
  - Ale lang=de může nastat pokud budeme hru zakázat → safe to add de case anyway

### `src/game/scrabble/ScrabbleHints.tsx` [ ]
- [ ] Přečíst soubor a zkontrolovat lang handling — přidat "de" případ

### `src/components/games/wortpaare/WortpaareGame.tsx` [ ]
- [ ] Importovat `targetLanguage` z `useLanguage()`
- [ ] Přidat podmíněné zobrazení: pokud `targetLanguage !== "de"`, zobrazit info panel

### `src/components/games/wortpaare/MatchedPair.tsx` [ ]
- [ ] Přidat `lang === "de"` případ:
  - `word_a`/`word_b` JSOU německá slova → no translation needed
  - Zobrazit prázdný string nebo skrýt translation řádek pro lang=de
  - Aktuálně: `lang === "ko" ? ... : lang === "pl" ? ... : lang === "en" ? ... : pair.translation_a`
  - Přidat: `lang === "de" ? "" : ...`

---

## FÁZE 4 — UI texty [x] HOTOVO

### `src/i18n/translations.ts`
- [ ] Přidat kompletní `de` objekt — přeložit VŠECH ~220 klíčů do němčiny
- [ ] Klíče kde DE překlad je jen "informativní" (SEO texty, blog-like obsah) — přeložit smysluplně
- [ ] Zkontrolovat všechny stávající jazyky (cs/ko/en/pl) zda mají nové klíče z FÁZE 1
- [ ] URL param: aktualizovat `handleSetLang` — "de" nemá speciální výchozí chování (stejné jako ostatní)

### Kontrolní seznam nových klíčů pro VŠECHNY jazyky:
- [ ] `onboardingTitle` — cs/ko/en/pl/de
- [ ] `onboardingNativeLang` — cs/ko/en/pl/de
- [ ] `onboardingTargetLang` — cs/ko/en/pl/de
- [ ] `onboardingStart` — cs/ko/en/pl/de
- [ ] `changeLangs` — cs/ko/en/pl/de
- [ ] `myLang` — cs/ko/en/pl/de
- [ ] `iWantToLearn` — cs/ko/en/pl/de
- [ ] `langNameCs` — cs/ko/en/pl/de
- [ ] `langNameDe` — cs/ko/en/pl/de
- [ ] `langNameEn` — cs/ko/en/pl/de
- [ ] `langNamePl` — cs/ko/en/pl/de
- [ ] `langNameKo` — cs/ko/en/pl/de
- [ ] `gameOnlyForDe` — cs/ko/en/pl/de
- [ ] `switchToGerman` — cs/ko/en/pl/de
- [ ] `targetLangSameError` — cs/ko/en/pl/de (asi jen UI validace)

---

## FÁZE 5 — Data kontrola [x] HOTOVO

### `src/game/vocabularyData.ts`
- [ ] Zkontrolovat: mají QUESTIONS všechna `translationEn` a `translationPl`?
  - Memory říká: ✅ ano (oboje vyplněno pro všechny 492 položek)
- [ ] Zkontrolovat: mají FILL_QUESTIONS všechna `translationEn` a `translationPl`?
  - Memory říká: ✅ ano (oboje vyplněno pro všechny 1146 položek)
- [ ] FlashCard `pl?` a `en?` — jsou optional. Pro targetLanguage=pl nebo targetLanguage=en:
  - Pokud chybí `card.pl` → fallback na `card.czech`
  - Pokud chybí `card.en` → fallback na `card.czech`
  - Otázka: je fallback na CZ korektní pro DE mluvčí? Spíše ne. Vypsat chybějící.
- [ ] Vytvořit `MISSING_TRANSLATIONS.md` se seznamem FlashCards kde chybí `pl` nebo `en`

### Supabase `word_pairs` tabulka
- [ ] Zkontrolovat zda `translation_a_en`, `translation_a_pl`, `translation_a_ko` jsou vyplněny
  - `translation_a` = Czech (mateřský)
  - Pro lang=de v MatchedPair: skrýt translation (german IS the word)
  - Chybějící překlady → MISSING_TRANSLATIONS.md
- [ ] Poznámka: pro lang=de Wortpaare hra nebude dostupná (targetLanguage=de → lang≠de → jinak nelze hrát)

---

## FÁZE 6 — Lokální testování [x] HOTOVO

### Build
- [x] `npm run build` → OK, 0 TS chyb, 1787 modulů, build úspěšný 2026-05-05

### Funkční testy (lokální dev server)
- [ ] **CS → DE** (původní chování): FlashCards, Pexeso, LlamaRun, SentenceBuilder, Wortpaare, Scrabble
- [ ] **DE → CS**: FlashCards (CS slova vpředu, DE vzadu), Pexeso, ostatní hry = info panel
- [ ] **DE → EN**: FlashCards (EN vpředu, DE vzadu), Pexeso, ostatní = info panel
- [ ] **DE → PL**: FlashCards, Pexeso, ostatní = info panel
- [ ] **DE → KO**: FlashCards, Pexeso, ostatní = info panel
- [ ] **EN → DE**: FlashCards (DE vpředu, EN vzadu), Pexeso, LlamaRun, SentenceBuilder, Wortpaare, Scrabble
- [ ] **PL → DE**: stejné jako EN → DE
- [ ] Onboarding obrazovka — zobrazí se při první návštěvě (clear localStorage)
- [ ] Výběr jazyka v headeru — otevírá modal, uloží volbu
- [ ] Reload stránky — zachová volbu z localStorage
- [ ] URL param `?lang=de` — funguje

### Regresy
- [ ] CS → DE (default): přesně stejné chování jako před změnou
- [ ] Lang switcher v headeru nezobrazuje chybný jazyk
- [ ] Pexeso: karty spárovány správně (target vs native, ne target vs target)

---

## ARCHITEKTURA — klíčové rozhodnutí

### Jaké hry podporují jaké kombinace:
```
targetLanguage = "de":
  ✅ FlashCards   (DE vpředu, lang vzadu)
  ✅ Pexeso       (DE + lang)
  ✅ LlamaRun     (DE členy, lang překlad)
  ✅ SentenceBuilder (DE věty, lang hint)
  ✅ Wortpaare    (DE synonyma, lang překlad)
  ✅ Scrabble     (DE křížovka, lang nápověda)

targetLanguage = cs/en/pl/ko:
  ✅ FlashCards   (target vpředu, lang vzadu)
  ✅ Pexeso       (target + lang)
  🚫 LlamaRun     → info panel "Hra dostupná jen pro výuku němčiny"
  🚫 SentenceBuilder → info panel
  🚫 Wortpaare    → info panel
  🚫 Scrabble     → info panel
```

### localStorage klíče:
- `gl_lang` — UI jazyk (existující, přidat "de" jako validní hodnotu)
- `gl_target_lang` — cílový jazyk pro výuku (NOVÝ, default "de")
- `gl_onboarding_done` — "1" pokud onboarding proběhl (NOVÝ)

### Omezení: lang !== targetLanguage
- Vynuceno v `handleSetTargetLanguage` a v onboarding UI (disabled button)
- Pokud localStorage obsahuje neplatnou kombinaci → reset na cs+de

---

## SOUBORY KTERÉ SE NEMĚNÍ
- `src/game/vocabularyData.ts` — data zůstávají (Question/FillQuestion/FlashCard interface)
- `src/App.tsx` — jen přidat onboarding wrapper
- `supabase/` — žádné DB změny
- Všechny CSS/Tailwind — žádné změny

---

## POZNÁMKY K IMPLEMENTACI
- NIKDY nepoužívat „ " uvozovky ani apostrofy v single-quoted TypeScript stringů
- Přidat DE překlady jako kompletní objekt — `de` musí mít STEJNÉ klíče jako `cs` (TypeScript to vynutí)
- `getFlashCardFace` helper přidat do `vocabularyData.ts` nebo jako lokální helper ve FlashCards+Pexeso
- Pro `ScrabbleHints.tsx` — přečíst soubor před úpravou
- Wortpaare data jsou z Supabase — neupravovat DB schéma (lang=de case v MatchedPair stačí skrýt překlad)
