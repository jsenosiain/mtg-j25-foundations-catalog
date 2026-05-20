import { useState } from "react";

const useColorToggle = () => {
	const [colorFilters, setColorFilters] = useState<string[]>([]);

	const toggleColor = (color: string) => setColorFilters((prev) =>
		prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
	);
	
	return { colorFilters, toggleColor };
};

export default useColorToggle;