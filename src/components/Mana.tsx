import type { ReactNode } from "react";
import clsx from "clsx";

const TYPE_TO_COLOR: Record<string, string> = {
	W: "white",
	U: "blue",
	B: "black",
	R: "red",
	G: "green",
};

interface ManaProps {
	children?: ReactNode;
	type?: string;
}

const Mana = ({ children, type = "C" }: ManaProps) => {
	return (
		<span
			className={clsx(
				"w-4 h-4 text-xs inline-flex items-center justify-center rounded-full",
				type === "C" && "bg-gray-300"
			)}
			style={type !== "C" ? { backgroundColor: `var(--deck-${TYPE_TO_COLOR[type]})` } : undefined}
		>{children}</span>
	);
};

export default Mana;