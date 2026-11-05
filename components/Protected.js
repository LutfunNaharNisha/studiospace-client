"use client";
import { useAuth } from "components/AuthProvider";
import { PageLoader } from "components/Skeletons";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

// Wrap any private page. While the session is being restored we show a loader,
// so a logged-in user who reloads is never redirected to /login by mistake.
export default function Protected({ children }) {
	const { user, loading } = useAuth();
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		if (!loading && !user) {
			toast.error("Please log in to continue.", { id: "auth-required" });
			router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
		}
	}, [loading, user, pathname, router]);

	if (loading || !user) return <PageLoader label="Checking your session" />;
	return children;
}
