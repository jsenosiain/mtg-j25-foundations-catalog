import { useState } from "react";

const useColorToggle = () => {
	const [colors, setColors] = useState<string[]>([]);

	const toggleColors = (color: string) => setColors((prev) =>
		prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
	);
	
	return [colors, toggleColors] as const;
};

export default useColorToggle;