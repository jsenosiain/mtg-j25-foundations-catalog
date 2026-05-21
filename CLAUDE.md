# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # start dev server
pnpm build        # type-check + production build (tsc -b && vite build)
pnpm lint         # ESLint
pnpm preview      # serve the dist/ build locally
```

No test suite is configured.

## Environment

Copy `.env.local.example` to `.env.local` and fill in values:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_SCRYFALL_API_URL=       # Scryfall list endpoint for J25/FDN cards
VITE_CACHE_CARDS_KEY=        # localStorage key for card cache
VITE_CACHE_TTL_MS=           # cache TTL in milliseconds
```

See `SUPABASE_SETUP.md` for database schema and RLS policy SQL.

## Architecture

This is a React 19 + Vite + Tailwind CSS v4 PWA for browsing Magic: The Gathering J25/Foundations decks.

### Path aliases

All `@/` aliases are defined in `vite.config.ts` and `tsconfig.app.json`:
`@/components`, `@/hooks`, `@/json`, `@/pages`, `@/providers`, `@/services`, `@/store`, `@/types`, `@/utilities`

### Data flow

1. **Card data** — `getCards()` (`src/services/getCards.ts`) fetches from the Scryfall API and caches results in `localStorage`. On cache hit the network is skipped entirely.
2. **Deck data** — `getDecks()` (`src/services/getDecks.ts`) reads the static deck list from `src/json/j25-all-decks.json` and hydrates each card name by looking it up in the Scryfall card array.
3. **Catalog page** — `src/pages/Catalog.tsx` calls `getDecks()` once at the top of the component and passes the resulting `Promise<MTGDeck[]>` down to both `<Filters>` and `<Decks>`. Both components consume it via React 19's `use()` hook inside `<Suspense>` boundaries, so a single fetch is shared across the tree with no prop-drilled state.

### Saved-deck store

`src/store/store.ts` is a one-line re-export that selects the active backend. Swap it to change persistence — all three implementations satisfy the `Store` interface (`list / add / remove`):

| Export | Behavior |
|---|---|
| `storeLocal` | `localStorage` only, no auth |
| `storeSupabase` | Supabase only, online-required |
| `storeOffline` | local-first writes + background sync to Supabase (currently active) |

`storeOffline` uses `useSyncExternalStore` to expose a `SyncStatus` object. The `<SyncIndicator>` component reads it to show pending/syncing/error state. Conflict resolution is last-write-wins; the store has a known limitation documented in its source: remote deletes can be overwritten by a stale local `saved: true` entry if no server-side tombstones exist.

### Auth

`AuthProvider` (`src/providers/AuthProvider.tsx`) wraps the app and exposes `{ session, loading, signIn, signUp, signOut }` via `AuthContext`. `App.tsx` gates rendering on `session` — unauthenticated users see `<SignIn>`. Auth uses Supabase email + password (not magic links) to avoid free-tier email rate limits.

### Filtering

Three filter functions in `src/utilities/filters/` are composed in `<Decks>`:
- `colorFilter` — matches any deck color against the active color selection
- `searchFilter` — case-insensitive name match
- `selectedFilter` — cycles through `"all"` / `"selected"` / default (unselected)

The `useSelectedFilter` hook manages the cycle; `useColorToggle` manages the multi-select color array.
