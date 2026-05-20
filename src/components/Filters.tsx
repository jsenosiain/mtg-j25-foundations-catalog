import { use, useState } from "react";
import { Deck } from "@/components";
import { useSavedDecks } from "@/hooks";
import type { MTGDeck } from "@/types";
import ColorFilter from "./ColorFilter";
import SearchFilter from "./SearchFilter";
import SelectedFilter from "./SelectedFilter";
import DeckCounter from "./DeckCounter";

import { colorFilter, searchFilter, selectedFilter } from "@/utilities/filters";
import useColorToggle from "../hooks/useColorToggle";
import useSelectedFilter from "../hooks/useSelectedFilter";

interface FiltersProps {	
	decksPromise: Promise<MTGDeck[]>;
}

const Filters = ({ decksPromise }: FiltersProps) => {			
	const list = use(decksPromise); 

	const { isSaved, toggle } = useSavedDecks();	
	const [search, setSearch] = useState("");	
	const { colorFilters, toggleColor } = useColorToggle();
	const { selectedFilterValue, cycleSelectedFilter } = useSelectedFilter();

	const savedList = list.filter((deck) => isSaved(deck.id));	
	const visible = list
		.filter(colorFilter(colorFilters))
		.filter(searchFilter(search))
		.filter(selectedFilter(selectedFilterValue, isSaved));	

	return (
		<>
			<div className="flex flex-col gap-2 p-2 border-b md:flex-row md:items-center md:gap-3">
				<div className="flex items-center gap-2">
					<SelectedFilter cycleSelectedFilter={cycleSelectedFilter} selectedFilterValue={selectedFilterValue} />					
					<ColorFilter colorFilters={colorFilters} savedList={savedList} toggleColor={toggleColor} />
				</div>
				<div className="flex items-center gap-2 md:flex-1">
					<SearchFilter search={search} onChange={setSearch} />
					<DeckCounter savedCount={savedList.length} totalCount={list.length} />
				</div>
			</div>
			<div className="flex flex-wrap">
				{visible.map((deck) => (
					<Deck key={deck.id} deck={deck} isChecked={isSaved(deck.id)} onCheck={toggle} />
				))}
			</div>
		</>
	)
};

export default Filters;