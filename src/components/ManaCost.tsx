import Mana from "./Mana";

const parseBraces = (str: string): (string | number)[] => {
  const regex = /\{(.*?)\}/g;

  return Array.from(str.matchAll(regex), (m) => {
    const value = m[1];
    const num = Number(value);

    return !Number.isNaN(num) ? num : value;
  });
};

export interface ManaCost {
	cost: string;
}

const ManaCost = ({ cost }: ManaCost) => {
	const braces = parseBraces(cost);

	return (
		<div className="flex gap-1 items-center h-6">
			{braces.map((coin, index) => {
				if (typeof coin === "number") {
					return <Mana type="C" key={index}>{coin}</Mana>;
				}

				switch (coin) {
					case "X":
						return <Mana type="C" key={index}>X</Mana>;
					default:
						return <Mana type={coin} key={index} />;
				}
			})}
		</div>
	);
};

export default ManaCost;