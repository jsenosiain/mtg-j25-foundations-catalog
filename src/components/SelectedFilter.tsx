const SelectedFilter = ({ cycleSelectedFilter, selectedFilterValue }: { cycleSelectedFilter: () => void, selectedFilterValue: string }) => {

	return (
		<button
			onClick={cycleSelectedFilter}
			className="text-sm border rounded-md px-2 py-1 capitalize shrink-0"
		>
			{selectedFilterValue}
		</button>		
	);
};

export default SelectedFilter;