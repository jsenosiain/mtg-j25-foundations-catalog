const DecksSkeleton = () => {
	const items = Array.from({ length: 121 }, (_, i) => i);

	return (
		<div className="flex flex-wrap">			
			{items.map((_, i) => (
				<div className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_25%] p-2" key={i}>
					<div className="bg-gray-300 border-1 border-gray-300 animate-pulse rounded-md p-4 cursor-pointer">&nbsp;</div>
				</div>
			))}
		</div>
	);
};

export default DecksSkeleton;
