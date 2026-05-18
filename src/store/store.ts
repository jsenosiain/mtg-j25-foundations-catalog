// Active backend. Swap the import below to change persistence:
//   "./storeSupabase" — online-only, server is source of truth
//   "./storeLocal"    — browser-only, no auth needed
//   "./storeOffline"  — local-first with background sync to Supabase (offline support)
export { default } from "./storeOffline";
