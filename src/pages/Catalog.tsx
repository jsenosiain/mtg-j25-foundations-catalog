import { useState } from "react";
import type { MTGDeck } from "@/types";
import { useColorToggle, useSelectedFilter } from "@/hooks";
import { Decks, Filters } from "@/components";
import decksJson from "@/json/j25-all-decks.json";

const decks = decksJson as MTGDeck[];

const Catalog = () => {
	const [search, setSearch] = useState<string>("");
	const [colors, toggleColors] = useColorToggle();
	const [selected, cycleSelected] = useSelectedFilter();

	return (
		<>
			<Filters
				list={decks}
				colors={colors}
				search={search}
				selected={selected}
				onColors={toggleColors}
				onSearch={setSearch}
				onSelected={cycleSelected}
			/>
			<Decks
				list={decks}
				colors={colors}
				search={search}
				selected={selected}
			/>
		</>
	);
};

export default Catalog;
