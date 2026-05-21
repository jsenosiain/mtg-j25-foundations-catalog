import { Suspense } from "react";
import type { MTGDeck } from "@/types";
import ColorFilter from "./ColorFilter";
import ColorFilterSkeleton from "./ColorFilterSkeleton";
import SearchFilter from "./SearchFilter";
import SelectedFilter from "./SelectedFilter";
import DeckCounter from "./DeckCounter";
import DeckCounterSkeleton from "./DeckCounterSkeleton";

interface FiltersProps {	
	colors: string[];
	decksPromise: Promise<MTGDeck[]>;
	search: string;
	selected: string;
	onColors: (color: string) => void;
	onSearch: (value: string) => void;
	onSelected: () => void;
}

const Filters = ({ colors, decksPromise, search, selected, onColors, onSearch, onSelected }: FiltersProps) => {			
	return (		
		<div className="flex flex-col gap-2 p-2 border-b md:flex-row md:items-center md:gap-3">
			<div className="flex items-center gap-2">
				<SelectedFilter selected={selected} onSelected={onSelected} />												
				<Suspense fallback={<ColorFilterSkeleton />}>
					<ColorFilter decksPromise={decksPromise} colorFilters={colors} toggleColor={onColors} />				
				</Suspense>
			</div>
			<div className="flex items-center gap-2 md:flex-1">
				<SearchFilter search={search} onChange={onSearch} />
				<Suspense fallback={<DeckCounterSkeleton />}>
					<DeckCounter decksPromise={decksPromise} />
				</Suspense>
			</div>
		</div>	
	)
};

export default Filters;