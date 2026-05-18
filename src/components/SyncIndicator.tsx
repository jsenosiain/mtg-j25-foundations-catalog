import { useSyncStatus } from "@/store";

const SyncIndicator = () => {
	const { state, pending } = useSyncStatus();

	if (state === "syncing") {
		return <span className="text-xs text-gray-500">Syncing…</span>;
	}

	if (state === "error") {
		return (
			<span className="text-xs text-amber-700">
				Offline{pending > 0 ? ` · ${pending} pending` : ""}
			</span>
		);
	}

	if (pending > 0) {
		return <span className="text-xs text-gray-500">{pending} pending</span>;
	}

	return null;
};

export default SyncIndicator;
