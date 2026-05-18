# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **pnpm** (declared in `package.json`).

- `pnpm dev` — start Vite dev server (default port 5173)
- `pnpm build` — type-check (`tsc -b`) then `vite build`. The type-check is part of the build; there is no separate `typecheck` script.
- `pnpm lint` — run ESLint over the project
- `pnpm preview` — preview the production build

There is no test runner configured.

## Environment

Requires `.env.local` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (see `.env.local.example`). Without these, [src/store/supabase.ts](src/store/supabase.ts) will throw at module load. Full Supabase project setup (table schema, RLS policies, magic-link redirect allowlist) is documented in [SUPABASE_SETUP.md](SUPABASE_SETUP.md).

## Path aliases

`@/components`, `@/store`, `@/types`, `@/utilities` map to `src/*`. Aliases are duplicated in both [vite.config.ts](vite.config.ts) and [tsconfig.app.json](tsconfig.app.json) — when adding a new top-level `src/` directory you must register the alias in **both** files.

## Architecture

This is a Magic: The Gathering deck browser for the J25 / FDN sets. Users browse pre-built decks (static JSON data) and persist which decks they've "saved" to either Supabase or `localStorage`.

### Static deck data → runtime decks

Card and deck JSON live in [src/store/data/](src/store/data/). Decks reference cards by **name only**; [src/utilities/getDeckList.ts](src/utilities/getDeckList.ts) hydrates each deck by mapping every card name through a `load()` lookup against the cards array. This join happens synchronously on every render — there is no caching layer. If a card name in a deck JSON doesn't match anything in the cards JSON, `load()` returns `undefined` and downstream components will receive holes in their card arrays.

### Pluggable persistence backend (`DeckStore`)

The "which decks has the user saved" data is behind a single interface — [src/store/types/DeckStore.ts](src/store/types/DeckStore.ts):

```ts
interface DeckStore {
  list: () => Promise<number[]>;
  add: (deckId: number) => Promise<void>;
  remove: (deckId: number) => Promise<void>;
}
```

Two implementations:
- [src/store/storeSupabase.ts](src/store/storeSupabase.ts) — writes to a Supabase `saved_decks` table; RLS scopes rows by `auth.uid()`.
- [src/store/storeLocal.ts](src/store/storeLocal.ts) — writes to `localStorage` under key `decks`.

The active backend is chosen by the single re-export line in [src/store/store.ts](src/store/store.ts). Swap that line to switch backends — nothing else changes because both expose the same `DeckStore` shape.

### Auth gate

[src/store/auth.tsx](src/store/auth.tsx) provides an `AuthProvider` (mounted at the root in [src/main.tsx](src/main.tsx)) using Supabase magic-link OTP. [src/App.tsx](src/App.tsx) gates rendering on `session` — unauthenticated users see `<SignIn />` instead of the deck list. When swapping to the `localStorage` backend, the auth gate in `App.tsx` still runs; remove the `session` check there if you also want to bypass auth.

### Optimistic save toggle

[src/store/useSavedDecks.ts](src/store/useSavedDecks.ts) is the only consumer of `Store` outside of tests. It applies the toggle to local state **before** awaiting the backend call, and reverts the local change if the call rejects. New UI that mutates saved decks should go through this hook rather than calling `Store.add` / `Store.remove` directly, so the optimistic+rollback behavior stays in one place.
