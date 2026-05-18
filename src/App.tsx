import { Deck, SignIn, SyncIndicator } from "@/components";
import { getDeckList } from "@/utilities";
import { useAuth } from "@/store";

function App() {
	const { session, loading, signOut } = useAuth();
	const list = getDeckList();

	if (loading) {
		return <div className="p-4">Loading…</div>;
	}

	if (!session) {
		return <SignIn />;
	}

	return (
		<>
			<div className="flex justify-between items-center p-2 border-b">
				<div className="flex items-center gap-3">
					<span className="text-sm text-gray-600">{session.user.email}</span>
					<SyncIndicator />
				</div>
				<button onClick={signOut} className="text-sm border rounded-md px-2 py-1">
					Sign out
				</button>
			</div>
			<div className="flex flex-wrap">
				{list.map((deck) => (
					<Deck key={deck.id} deck={deck} />
				))}
			</div>
		</>
	);
}

export default App;
