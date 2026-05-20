interface SearchFilterProps {
	search: string;
	onChange: (value: string) => void;
}

const SearchFilter = ({ search, onChange }: SearchFilterProps) => {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange(e.target.value);
	};
	
	return (
		<input
			type="text"
			value={search}
			onChange={handleChange}
			placeholder="Search by card name"
			className="text-sm border rounded-md px-2 py-1 flex-1 min-w-0"
		/>
	);
};

export default SearchFilter;