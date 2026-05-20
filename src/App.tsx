import { Suspense } from "react";
import { SignIn, SyncIndicator } from "@/components";
import { useAuth } from "@/store";
import { getDecks } from "./services/mtg";

import Filters from "./components/Filters";

function App() {
	const { session, loading, signOut } = useAuth();	
	
	if (loading) {
		return <div className="p-4">Loading…</div>;
	}

	if (!session) {
		return <SignIn />;
	}	

	const decksPromise = getDecks();

	return (
		<>			
			<div className="flex justify-between items-center gap-2 p-2 border-b">
				<div className="flex items-center gap-2 min-w-0">
					<span className="text-sm text-gray-600 truncate min-w-0">{session.user.email}</span>
					<SyncIndicator />
				</div>
				<button onClick={signOut} className="text-sm border rounded-md px-2 py-1 shrink-0">
					Sign out
				</button>
			</div>

			<Suspense fallback={<div className="p-4">Loading decks…</div>}>
				<Filters decksPromise={decksPromise} />	
			</Suspense>
		</>
	);
}

export default App;
