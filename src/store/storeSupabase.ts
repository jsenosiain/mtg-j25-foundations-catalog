import { supabase } from "./supabase";
import type { DeckStore } from "./types/DeckStore";

const TABLE = "saved_decks";

const StoreSupabase: DeckStore = {
	list: async () => {
		const { data, error } = await supabase.from(TABLE).select("deck_id");
		if (error) throw error;
		return data.map((row) => row.deck_id as number);
	},

	add: async (deckId) => {
		const { data: userData, error: userError } = await supabase.auth.getUser();
		if (userError) throw userError;
		const userId = userData.user?.id;
		if (!userId) throw new Error("Not signed in");

		const { error } = await supabase.from(TABLE).insert({ user_id: userId, deck_id: deckId });
		if (error) throw error;
	},

	remove: async (deckId) => {
		const { error } = await supabase.from(TABLE).delete().eq("deck_id", deckId);
		if (error) throw error;
	},
};

export default StoreSupabase;
