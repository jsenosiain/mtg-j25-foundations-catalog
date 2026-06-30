import { createContext } from "react";
import type { Session } from "@supabase/supabase-js";

interface AuthContextValue {
	session: Session | null;
	loading: boolean;
	isGuest: boolean;
	signIn: (email: string, password: string) => Promise<{ error: string | null }>;
	signUp: (email: string, password: string) => Promise<{ error: string | null }>;
	signOut: () => Promise<void>;
	continueAsGuest: () => void;
	leaveGuest: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
