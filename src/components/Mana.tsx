import clsx from "clsx";

interface ManaProps {
	text?: string;
	type?: string;
}

const Mana = ({ children, type = "C" }: ManaProps) => {
	return (
		<div
			className={clsx(
				"w-4 h-4 text-xs flex items-center justify-center rounded-full bg-no-repeat bg-center bg-contain",
				type === "C" && "bg-gray-300"
			)}
			style={type !== "C" ? { backgroundImage: `url(/assets/mana/${type}.svg)` } : undefined}
		>{children}</div>
	);
};

export default Mana;