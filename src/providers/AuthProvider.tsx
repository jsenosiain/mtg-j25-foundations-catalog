import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/store/supabase";
import { setGuestMode, flushGuestWrites } from "@/store";
import { AuthContext } from "./AuthContext";

const GUEST_KEY = "guest_mode";

const readGuest = (): boolean => {
	try {
		return localStorage.getItem(GUEST_KEY) === "1";
	} catch {
		return false;
	}
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [session, setSession] = useState<Session | null>(null);
	const [loading, setLoading] = useState(true);
	const [isGuest, setIsGuest] = useState<boolean>(() => readGuest());
	const wasGuestRef = useRef<boolean>(isGuest);

	useEffect(() => {
		setGuestMode(isGuest);
		wasGuestRef.current = isGuest;
	}, [isGuest]);

	useEffect(() => {
		supabase.auth.getSession().then(({ data }) => {
			setSession(data.session);
			setLoading(false);
		});

		const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
			setSession(s);
			if (s && wasGuestRef.current) {
				try {
					localStorage.removeItem(GUEST_KEY);
				} catch {
					/* ignore */
				}
				setIsGuest(false);
				setGuestMode(false);
				flushGuestWrites().catch(() => {});
			}
		});

		return () => sub.subscription.unsubscribe();
	}, []);

	const signIn = async (email: string, password: string) => {
		const { error } = await supabase.auth.signInWithPassword({ email, password });
		return { error: error?.message ?? null };
	};

	const signUp = async (email: string, password: string) => {
		const { error } = await supabase.auth.signUp({ email, password });
		return { error: error?.message ?? null };
	};

	const signOut = async () => {
		await supabase.auth.signOut();
	};

	const continueAsGuest = () => {
		try {
			localStorage.setItem(GUEST_KEY, "1");
		} catch {
			/* ignore */
		}
		setIsGuest(true);
	};

	const leaveGuest = () => {
		try {
			localStorage.removeItem(GUEST_KEY);
		} catch {
			/* ignore */
		}
		setIsGuest(false);
	};

	return (
		<AuthContext.Provider
			value={{ session, loading, isGuest, signIn, signUp, signOut, continueAsGuest, leaveGuest }}
		>
			{children}
		</AuthContext.Provider>
	);
};
