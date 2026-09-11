# GermanLlama — instrukce pro Claude Code

Herní platforma pro samostudium němčiny (www.germanllama.com), cílená primárně na
česky/slovensky mluvící pracovníky v Německu. Vite + React 18 + TypeScript,
shadcn-ui + Tailwind, Supabase (anon klíč, RLS), deploy na Vercel z `main`.

## Jazyky

Rozhraní běží v 6 jazycích: `cs` (výchozí/fallback), `en`, `pl`, `ko`, `uk`, `sk`.

- `src/i18n/translations.ts` — UI stringy, klíč `Lang` typ
- `src/contexts/LanguageContext.tsx` — `useLanguage()` hook (`lang`, `setLang`, `t()`)
- `?lang=` v URL přepisuje uloženou volbu; `cs` se z URL odstraňuje (je default)
- **Při přidávání jakéhokoli nového textu/otázky/páru vždy doplň všech 6 jazykových
  variant** (typicky pole `translation`, `translationKo`, `translationEn`,
  `translationPl`, `translationUk`, `translationSk` u položek v `vocabularyData.ts`,
  nebo `translation_a_xx`/`translation_b_xx` u `word_pairs` v Supabase). Žádné
  částečné doplnění jazyka — viz historie v `MISSING_TRANSLATIONS.md`.
- `middleware.ts` (Vercel edge) přepisuje `<title>`/meta tagy podle `?lang=` pro SEO —
  při přidání nového jazyka do `LanguageContext` je potřeba doplnit i sem (`LANG_META`).

## Struktura

| Co | Kde |
|---|---|
| Routy | `src/App.tsx` |
| Hry | `src/game/` (LlamaGame, LlamaJump, Scrabble), `src/components/games/wortpaare/` |
| Slovní zásoba (QUESTIONS/FILL_QUESTIONS, profese) | `src/game/vocabularyData.ts` |
| Příběhy pro začátečníky | `src/data/beginnerStories.ts` |
| Stránky | `src/pages/` |
| SEO | `src/components/SEOHead.tsx` (canonical `https://www.germanllama.com`), `GameSEOContent.tsx` |
| Supabase klient | `src/integrations/supabase/` |
| Backend (edge functions) | `supabase/functions/` |
| DB migrace | `supabase/migrations/` |

## Supabase

- Anon klíč + RLS, žádný service role klient.
- `word_pairs` tabulka (Wortpaare hra) — sloupce `translation_a_xx`/`translation_b_xx`
  na jazyk.
- Nové migrace commituj do gitu i po nasazení přes `npx supabase db push` /
  Lovable — dřív se stávalo, že migrace zůstaly aplikované jen na remote a chyběly
  v historii repa.

## Konvence

- Žádný `type: any` — striktní typování, generika nebo `unknown`.
- `npm run lint`, `npm test` (vitest), `npx tsc -p tsconfig.app.json --noEmit` před
  commitem u netriviálních změn.
- Feature branch → PR → merge do `main` (auto-deploy Vercel). Necommitovat/nepushovat
  bez výslovného zadání.
- `.env` nikdy do gitu — viz `.env.example` pro seznam potřebných proměnných.
- Vizuální styl značky (pixel-art lama, barvy, prompty pro generování obrázků/videí)
  je popsaný v `germanllama-logo/CLAUDE.md` a `germanllama-video/CLAUDE_cartoon.md` —
  drž se ho při generování jakéhokoli marketingového obrázku/videa.

## Plánovací dokumenty

`AUDIT_PLAN.md`, `LANGUAGE_SWITCH_PLAN.md`, `MISSING_TRANSLATIONS.md`,
`POLISH_TRANSLATION_PLAN.md`, `UK_TRANSLATION_PLAN.md`, `VOCABULARY_EXPANSION_PLAN.md`
jsou průběžné poznámky z minulé práce na projektu — spíš historický kontext než
aktuální TODO, ověřuj si stav v kódu/DB, než na ně spoléháš.
