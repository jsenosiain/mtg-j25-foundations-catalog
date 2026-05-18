import { useState, type FormEvent } from "react";
import { useAuth } from "@/store";

const SignIn = () => {
	const { signIn } = useAuth();
	const [email, setEmail] = useState("");
	const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setStatus("sending");
		setError(null);
		const { error } = await signIn(email);
		if (error) {
			setStatus("error");
			setError(error);
		} else {
			setStatus("sent");
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen p-4">
			<form onSubmit={handleSubmit} className="border rounded-md p-6 w-full max-w-sm space-y-4">
				<h1 className="text-xl font-bold">Sign in</h1>
				<p className="text-sm text-gray-600">Enter your email to get a one-click sign-in link.</p>
				<input
					type="email"
					required
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="you@example.com"
					className="border rounded-md p-2 w-full"
					disabled={status === "sending" || status === "sent"}
				/>
				<button
					type="submit"
					className="border rounded-md p-2 w-full font-bold disabled:opacity-50"
					disabled={status === "sending" || status === "sent" || !email}
				>
					{status === "sending" ? "Sending…" : status === "sent" ? "Check your email" : "Send magic link"}
				</button>
				{status === "sent" && (
					<p className="text-sm text-green-700">Magic link sent to {email}. Open it on this device.</p>
				)}
				{status === "error" && error && <p className="text-sm text-red-700">{error}</p>}
			</form>
		</div>
	);
};

export default SignIn;
