# GermanLlama

[www.germanllama.com](https://www.germanllama.com) — herní platforma pro samostudium němčiny, zaměřená na česky a slovensky mluvící pracovníky v Německu (obor-specifická slovní zásoba: truhlář, zedník, instalatér, elektrikář, gastro, zdravotnictví a další).

## Jazyky rozhraní

Čeština, angličtina, polština, korejština, ukrajinština, slovenština (`src/i18n/translations.ts`, `src/contexts/LanguageContext.tsx`).

## Hry a cvičení

- **Llama Run** (`/`) — skákací hra, odpovídej na slovíčka za běhu
- **Flash Cards** (`/flashcards`)
- **Pexeso** (`/pexeso`)
- **Skládání vět** (`/skladani-vet`)
- **Wortpaare** — párování synonym/antonym (`/wortpaare`, data v Supabase tabulce `word_pairs`)
- **Scrabble** (`/scrabble`)
- **Challenge / Challenge A1** (`/challenge`, `/challenge-a1`)
- **Start from beginning** — příběhy + Llama Jump pro úplné začátečníky (`/start-from-beginning/...`)
- **Němčina do práce** — landing stránky pro jednotlivé profese (`/nemcina-do-prace/:slug`)

## Tech stack

Vite + React 18 + TypeScript, shadcn-ui + Tailwind CSS, Supabase (anon klíč, RLS), Vercel (hosting + edge middleware pro `?lang=` SEO meta tagy, viz `middleware.ts`).

## Vývoj

```sh
npm i
npm run dev        # dev server
npm run build       # produkční build
npm run lint         # eslint
npm test              # vitest
```

Zkopíruj `.env.example` do `.env` a doplň Supabase/Gemini klíče (nikdy necommitovat `.env`).

## Supabase

Migrace v `supabase/migrations/`. Lokálně:

```sh
npx supabase link --project-ref <project-id>
npx supabase migration list       # porovná lokální/remote stav
npx supabase db push                # nahraje nové migrace
```

## Deploy

Git → GitHub → Vercel (auto-deploy z `main`). Práce probíhá ve feature branchích, mergují se přes Pull Request.
