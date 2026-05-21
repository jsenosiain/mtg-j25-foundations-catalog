const ColorFilterSkeleton = () => {
	const items = Array.from({ length: 6 }, (_, i) => i);

	return (
		<div className="flex items-center gap-1">
				{items.map((color) => (
					<div
						key={color}
						className={`w-6 h-6 text-xs rounded-full bg-gray-300 animate-pulse`}						
					></div>
				))}
			</div>
	);
};

export default ColorFilterSkeleton;