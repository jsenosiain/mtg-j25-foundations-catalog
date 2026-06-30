import { useState, type FormEvent } from "react";
import { useAuth } from "@/hooks";

const SignIn = () => {
	const { signIn, signUp, continueAsGuest } = useAuth();
	const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [status, setStatus] = useState<"idle" | "working" | "error">("idle");
	const [error, setError] = useState<string | null>(null);

	const isSignUp = mode === "signUp";

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setStatus("working");
		setError(null);
		
		const action = isSignUp ? signUp : signIn;
		
		const { error } = await action(email, password);

		if (error) {
			setStatus("error");
			setError(error);
		} else {
			setStatus("idle");
		}
	};

	const toggleMode = () => {
		setMode(isSignUp ? "signIn" : "signUp");
		setStatus("idle");
		setError(null);
	};

	return (
		<div className="flex items-center justify-center min-h-screen p-4">
			<form onSubmit={handleSubmit} className="border rounded-md p-6 w-full max-w-sm space-y-4">
				<h1 className="text-xl font-bold">{isSignUp ? "Create an account" : "Sign in"}</h1>
				<input
					type="email"
					required
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="you@example.com"
					className="border rounded-md p-2 w-full"
					disabled={status === "working"}
				/>
				<input
					type="password"
					required
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="Password"
					className="border rounded-md p-2 w-full"
					disabled={status === "working"}
					minLength={6}
				/>
				<button
					type="submit"
					className="border rounded-md p-2 w-full font-bold disabled:opacity-50"
					disabled={status === "working" || !email || !password}
				>
					{status === "working" ? "Working…" : isSignUp ? "Sign up" : "Sign in"}
				</button>
				<button
					type="button"
					onClick={toggleMode}
					className="text-sm text-gray-600 underline w-full"
				>
					{isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
				</button>
				<button
					type="button"
					onClick={continueAsGuest}
					className="text-sm text-gray-600 underline w-full"
				>
					Continue as guest
				</button>
				{status === "error" && error && <p className="text-sm text-red-700">{error}</p>}
			</form>
		</div>
	);
};

export default SignIn;
