import { use, useState, Suspense } from "react";
import type { MTGDeck } from "@/types";
import { useColorToggle, useSelectedFilter } from "@/hooks";
import { Decks, Filters } from "@/components";

interface CatalogProps {	
	decksPromise: Promise<MTGDeck[]>;
}

const Catalog = ({ decksPromise }: CatalogProps) => {			
	const list = use(decksPromise); 

	const [search, setSearch] = useState<string>("");	
	const [colors, toggleColors] = useColorToggle();
	const [selected, cycleSelected] = useSelectedFilter();	

	return (
		<>
			<Filters 
				list={list} 
				colorFilters={colors}
				search={search} 
				selected={selected}
				onColors={toggleColors}
				onSearch={setSearch} 
				onSelected={cycleSelected}
			/>
			<Suspense fallback={<div className="p-4">Loading decks…</div>}>
				<Decks 
					decksPromise={decksPromise} 
					colorFilters={colors}
					search={search}
					selected={selected}
				/>
			</Suspense>
		</>
	)
};

export default Catalog;