import { AuthContext } from "@/providers/Auth";
import { useContext } from "react";

const useAuth = () => {
	const ctx = useContext(AuthContext);

	if (!ctx) {
		throw new Error("useAuth must be used inside <AuthProvider>");
	}

	return ctx;
};

export default useAuth;