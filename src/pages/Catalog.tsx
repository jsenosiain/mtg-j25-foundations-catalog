import { useState, Suspense } from "react";
import { useColorToggle, useSelectedFilter } from "@/hooks";
import { Decks, DecksSkeleton, Filters } from "@/components";
import { getDecks } from "@/services";

const Catalog = () => {	
	const decksPromise = getDecks(); //
	
	const [search, setSearch] = useState<string>("");	
	const [colors, toggleColors] = useColorToggle();
	const [selected, cycleSelected] = useSelectedFilter();		

	return (
		<>				
			<Filters 
				decksPromise={decksPromise} 
				colors={colors}
				search={search} 
				selected={selected}
				onColors={toggleColors}
				onSearch={setSearch} 
				onSelected={cycleSelected}
			/>
			<Suspense fallback={<DecksSkeleton />}>
				<Decks 
					decksPromise={decksPromise} 
					colors={colors}
					search={search}
					selected={selected}
				/>
			</Suspense>
		</>
	)
};

export default Catalog;