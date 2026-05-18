import { useState } from "react";
import { Deck, SignIn, SyncIndicator } from "@/components";
import { getDeckList } from "@/utilities";
import { useAuth, useSavedDecks } from "@/store";
import { BACKGROUND_COLORS } from "./contants";
import type MTGDeck from "@/types/MTGDeck";
import type MTGCard from "@/types/MTGCard";

const allCards = (deck: MTGDeck): MTGCard[] => [
	...deck.creatures,
	...(deck.artifacts ?? []),
	...(deck.enchantments ?? []),
	...(deck.instants ?? []),
	...(deck.planeswalkers ?? []),
	...(deck.sorceries ?? []),
	...deck.lands,
];

type SaveFilter = "all" | "selected" | "unselected";
const SAVE_FILTER_CYCLE: SaveFilter[] = ["all", "selected", "unselected"];

function App() {
	const { session, loading, signOut } = useAuth();
	const { isSaved } = useSavedDecks();
	const list = getDeckList();
	const [colorFilters, setColorFilters] = useState<string[]>([]);
	const [search, setSearch] = useState("");
	const [saveFilter, setSaveFilter] = useState<SaveFilter>("all");

	const cycleSaveFilter = () =>
		setSaveFilter((prev) => SAVE_FILTER_CYCLE[(SAVE_FILTER_CYCLE.indexOf(prev) + 1) % SAVE_FILTER_CYCLE.length]);

	if (loading) {
		return <div className="p-4">Loading…</div>;
	}

	if (!session) {
		return <SignIn />;
	}

	const toggleColor = (color: string) =>
		setColorFilters((prev) =>
			prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
		);

	const savedCount = list.filter((deck) => isSaved(deck.id)).length;

	const visible = list
		.filter((deck) => colorFilters.length === 0 || colorFilters.includes(deck.color))
		.filter(
			(deck) =>
				!search.trim() ||
				allCards(deck).some((c) =>
					c.name.toLowerCase().includes(search.trim().toLowerCase())
				)
		)
		.filter((deck) =>
			saveFilter === "all" ? true : saveFilter === "selected" ? isSaved(deck.id) : !isSaved(deck.id)
		);

	return (
		<>
			<div className="flex justify-between items-center p-2 border-b">
				<div className="flex items-center gap-3">
					<span className="text-sm text-gray-600">{session.user.email}</span>
					<SyncIndicator />
				</div>
				<button onClick={signOut} className="text-sm border rounded-md px-2 py-1">
					Sign out
				</button>
			</div>
			<div className="flex items-center justify-between gap-4 p-2 border-b">
				<div className="flex items-center gap-1">
					{Object.entries(BACKGROUND_COLORS).map(([color, bg]) => (
						<button
							key={color}
							title={color}
							onClick={() => toggleColor(color)}
							className={`w-6 h-6 rounded-full border border-gray-300 ${colorFilters.includes(color) ? "ring-2 ring-offset-1 ring-gray-700" : ""}`}
							style={{ backgroundColor: bg as string }}
						/>
					))}
				</div>
				<div className="flex items-center gap-2">
					<span className="text-sm text-gray-500">{savedCount} / {list.length}</span>
					<button
						onClick={cycleSaveFilter}
						className="text-sm border rounded-md px-2 py-1 capitalize"
					>
						{saveFilter}
					</button>
					<input
						type="text"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search by card name"
						className="text-sm border rounded-md px-2 py-1 w-52"
					/>
				</div>
			</div>
			<div className="flex flex-wrap">
				{visible.map((deck) => (
					<Deck key={deck.id} deck={deck} />
				))}
			</div>
		</>
	);
}

export default App;
