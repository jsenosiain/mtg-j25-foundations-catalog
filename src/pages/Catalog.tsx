import { useState, Suspense } from "react";
import { useColorToggle, useSelectedFilter } from "@/hooks";
import { Decks, Filters } from "@/components";

import { getDecks } from "../services";

const Catalog = () => {	
	const [search, setSearch] = useState<string>("");	
	const [colors, toggleColors] = useColorToggle();
	const [selected, cycleSelected] = useSelectedFilter();	

	const decksPromise = getDecks();

	return (
		<>
			<Suspense fallback={<div className="p-4">Loading filters...</div>}>				
				<Filters 
					decksPromise={decksPromise} 
					colorFilters={colors}
					search={search} 
					selected={selected}
					onColors={toggleColors}
					onSearch={setSearch} 
					onSelected={cycleSelected}
				/>
			</Suspense>
			<Suspense fallback={<div className="p-4">Loading decks...</div>}>
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