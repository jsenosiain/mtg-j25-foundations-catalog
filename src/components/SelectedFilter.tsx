interface SelectedFilterProps {
	selected: string;
	onSelected: () => void;
}

const SelectedFilter = ({ selected, onSelected }: SelectedFilterProps) => (	
	<button
		className="text-sm border rounded-md px-2 py-1 capitalize shrink-0"
		onClick={onSelected}		
	>
		{selected}
	</button>		
);

export default SelectedFilter;