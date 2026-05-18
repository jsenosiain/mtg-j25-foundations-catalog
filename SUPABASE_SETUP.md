# Supabase setup

## 1. Get your project keys

In the Supabase dashboard for your project, go to **Project Settings → API** and copy:

- **Project URL** → `VITE_SUPABASE_URL`
- **anon / public** key → `VITE_SUPABASE_ANON_KEY`

Then create `.env.local` in the project root (copy from `.env.local.example`):

```
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR-PUBLIC-ANON-KEY
```

Restart `pnpm dev` after creating it.

## 2. Create the table

In the Supabase dashboard, open **SQL Editor → New query** and run:

```sql
create table public.saved_decks (
  user_id  uuid        not null references auth.users on delete cascade,
  deck_id  integer     not null,
  created_at timestamptz not null default now(),
  primary key (user_id, deck_id)
);

alter table public.saved_decks enable row level security;

create policy "users read their own saved decks"
  on public.saved_decks for select
  using (auth.uid() = user_id);

create policy "users insert their own saved decks"
  on public.saved_decks for insert
  with check (auth.uid() = user_id);

create policy "users delete their own saved decks"
  on public.saved_decks for delete
  using (auth.uid() = user_id);
```

RLS policies make sure every user only sees and writes their own saved decks, even though everyone uses the same public anon key.

## 3. Configure the magic-link redirect

In the dashboard go to **Authentication → URL Configuration** and add your dev URL (e.g. `http://localhost:5173`) to:

- **Site URL**
- **Redirect URLs** (allow list)

Without this, the magic link will reject the redirect.

## 4. Sign in

Run `pnpm dev`, enter your email, click the link in your inbox. You'll land back on the app signed in.

## Swapping backends

Open `src/store/store.ts` and change the re-export. Three implementations are available, all behind the same `{ list, add, remove }` interface:

```ts
export { default } from "./storeSupabase"; // online-only (default)
export { default } from "./storeLocal";    // browser-only, no auth
export { default } from "./storeOffline";  // local-first with Supabase sync
```

(The auth gate in `App.tsx` still runs — if you want to skip auth too when using `storeLocal`, render `<App />` directly without checking `session` in `App.tsx`.)

### Offline mode (`storeOffline`)

Reads/writes hit `localStorage` immediately, so the UI keeps working when the network is down. A background sync reconciles with Supabase whenever a mutation happens, whenever `list()` is called, and whenever the browser fires the `online` event.

Conflict resolution is **last-write-wins** with one caveat: because the server has no tombstones, a deck deleted on another device will overwrite a stale local `{ saved: true }` on the next reconcile. If you need true cross-device delete safety, add a `deleted_at` column to `saved_decks` and switch the policies to filter on it.

State is stored in `localStorage` under `decks_offline` (separate key from `storeLocal`'s `decks`).
