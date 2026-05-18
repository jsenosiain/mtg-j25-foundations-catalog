# MTG J25 Foundations Catalog

A small browser for the **Magic: The Gathering — Foundations Jumpstart (J25)** pre-built decks. Pick a deck, expand it by card type, and inspect each card's mana cost and oracle text. You can also "save" decks to a personal list that persists across sessions.

🔗 **Live demo:** https://jsenosiain.github.io/mtg-j25-foundations-catalog/

> **Heads up:** this is a pet project. It exists to prove out a handful of ideas in a low-stakes setting, not to be a polished product. Expect rough edges, opinionated choices, and the occasional experiment that won't make it to a "real" app.

## What it's actually for

The deck browser is the surface; the interesting bits underneath are the proofs-of-concept:

- **Pluggable persistence behind a single interface.** The "which decks have I saved" data hides behind a `DeckStore` interface ([src/store/types/DeckStore.ts](src/store/types/DeckStore.ts)) with two interchangeable implementations: a Supabase-backed store and a `localStorage`-backed store. Swapping backends is a one-line change in [src/store/store.ts](src/store/store.ts).
- **Supabase magic-link auth + row-level security.** Email-only OTP sign-in via Supabase, with `saved_decks` rows scoped to `auth.uid()` by RLS. See [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for the full server setup.
- **Optimistic UI with rollback.** [src/store/useSavedDecks.ts](src/store/useSavedDecks.ts) updates local state before awaiting the backend and reverts on failure — a small but useful pattern to keep isolated in one hook.
- **Static-JSON join at render time.** Decks reference cards by name; [src/utilities/getDeckList.ts](src/utilities/getDeckList.ts) hydrates each deck against the cards JSON on the fly. No build step, no DB seed — just an experiment in how far raw JSON can take you.
- **Deployed to GitHub Pages from a Vite + React app.** Subpath-aware build, GitHub Actions workflow, and Supabase redirect-URL allowlist all wired up end-to-end.
- **React 19 `<Activity>`.** Used in [src/components/List.tsx](src/components/List.tsx) to hide empty category sections without unmounting them.

## Stack

- React 19 + TypeScript (strict, `verbatimModuleSyntax`)
- Vite 8
- Tailwind CSS
- Supabase (auth + Postgres + RLS)
- pnpm
- GitHub Actions → GitHub Pages

## Running locally

```bash
pnpm install
cp .env.local.example .env.local   # then fill in your Supabase URL + anon key
pnpm dev
```

Scripts:

- `pnpm dev` — Vite dev server on http://localhost:5173
- `pnpm build` — type-check (`tsc -b`) and build for production
- `pnpm lint` — ESLint
- `pnpm preview` — preview the production build

Without `.env.local`, [src/store/supabase.ts](src/store/supabase.ts) throws at module load. Full server setup (tables, RLS, redirect allowlist) is in [SUPABASE_SETUP.md](SUPABASE_SETUP.md).

## Project layout

See [CLAUDE.md](CLAUDE.md) for an architecture overview — including how the static deck data is joined, how the pluggable backend works, and where the auth gate sits.
