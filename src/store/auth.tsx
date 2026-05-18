import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";

interface AuthContextValue {
	session: Session | null;
	loading: boolean;
	signIn: (email: string) => Promise<{ error: string | null }>;
	signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [session, setSession] = useState<Session | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		supabase.auth.getSession().then(({ data }) => {
			setSession(data.session);
			setLoading(false);
		});

		const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
			setSession(s);
		});

		return () => sub.subscription.unsubscribe();
	}, []);

	const signIn = async (email: string) => {
		const { error } = await supabase.auth.signInWithOtp({
			email,
			options: { emailRedirectTo: window.location.origin },
		});
		return { error: error?.message ?? null };
	};

	const signOut = async () => {
		await supabase.auth.signOut();
	};

	return (
		<AuthContext.Provider value={{ session, loading, signIn, signOut }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
	return ctx;
};
