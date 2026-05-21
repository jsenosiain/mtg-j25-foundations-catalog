import { use } from "react";
import type { MTGDeck } from "@/types";
import ColorFilter from "./ColorFilter";
import SearchFilter from "./SearchFilter";
import SelectedFilter from "./SelectedFilter";
import DeckCounter from "./DeckCounter";

interface FiltersProps {	
	colorFilters: string[];
	decksPromise: Promise<MTGDeck[]>;
	search: string;
	selected: string;
	onColors: (color: string) => void;
	onSearch: (value: string) => void;
	onSelected: () => void;
}

const Filters = ({ colorFilters, decksPromise, search, selected, onColors, onSearch, onSelected }: FiltersProps) => {			
	const list = use(decksPromise); 

	return (		
		<div className="flex flex-col gap-2 p-2 border-b md:flex-row md:items-center md:gap-3">
			<div className="flex items-center gap-2">
				<SelectedFilter selected={selected} onSelected={onSelected} />												
				<ColorFilter list={list} colorFilters={colorFilters} toggleColor={onColors} />				
			</div>
			<div className="flex items-center gap-2 md:flex-1">
				<SearchFilter search={search} onChange={onSearch} />
				<DeckCounter list={list} />
			</div>
		</div>	
	)
};

export default Filters;