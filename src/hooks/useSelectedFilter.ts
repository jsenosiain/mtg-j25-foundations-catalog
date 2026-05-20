import { useState } from "react";

type SelectedFilter = "all" | "selected" | "unselected";

const SELECTED_FILTER_CYCLE: SelectedFilter[] = ["all", "selected", "unselected"];

const useSelectedFilter = () => {
	const [selectedFilterValue, setSelectedFilter] = useState<SelectedFilter>("all");

	const cycleSelectedFilter = () => setSelectedFilter((prev) => SELECTED_FILTER_CYCLE[(SELECTED_FILTER_CYCLE.indexOf(prev) + 1) % SELECTED_FILTER_CYCLE.length]);

	return { selectedFilterValue, cycleSelectedFilter };
};

export default useSelectedFilter;