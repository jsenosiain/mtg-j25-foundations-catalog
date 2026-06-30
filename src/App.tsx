import { SignIn, SyncIndicator } from "@/components";
import { useAuth } from "@/hooks";
import Catalog from "@/pages/Catalog";

function App() {
	const { session, loading, isGuest, signOut, leaveGuest } = useAuth();

	if (loading) {
		return <div className="p-4">Loading…</div>;
	}

	if (!session && !isGuest) {
		return <SignIn />;
	}

	return (
		<>
			<div className="flex justify-between items-center gap-2 p-2 border-b">
				<div className="flex items-center gap-2 min-w-0">
					<span className="text-sm text-gray-600 truncate min-w-0">
						{session ? session.user.email : "Guest"}
					</span>
					<SyncIndicator />
				</div>
				{session ? (
					<button onClick={signOut} className="text-sm border rounded-md px-2 py-1 shrink-0">
						Sign out
					</button>
				) : (
					<button onClick={leaveGuest} className="text-sm border rounded-md px-2 py-1 shrink-0">
						Sign in
					</button>
				)}
			</div>
			<Catalog />
		</>
	);
}

export default App;
