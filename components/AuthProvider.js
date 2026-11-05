"use client";
import { api } from "lib/api";
import { authClient } from "lib/auth-client";
import { useRouter } from "next/navigation";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import toast from "react-hot-toast";

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
	const router = useRouter();
	const { data: session, isPending } = authClient.useSession();
	const user = session?.user ?? null;
	const [tokenUser, setTokenUser] = useState(null); // user id whose JWT cookie is in sync
	const [wishlist, setWishlist] = useState([]);

	// Whenever a BetterAuth session exists, make sure the API JWT cookie exists too.
	useEffect(() => {
		if (isPending || !user) return;
		let alive = true;
		fetch("/api/token", { method: "POST", credentials: "include" })
			.catch(() => {})
			.finally(() => alive && setTokenUser(user.id));
		return () => {
			alive = false;
		};
	}, [user?.id, isPending]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (!tokenUser) return;
		api("/wishlist/ids")
			.then(setWishlist)
			.catch(() => {});
	}, [tokenUser]);

	// `loading` stays true until we know whether the visitor is signed in AND the cookie is ready,
	// so reloading a private route never bounces a logged-in user to /login.
	const loading = isPending || (!!user && tokenUser !== user.id);

	const toggleWishlist = useCallback(
		async (studioId) => {
			if (!user) {
				toast.error("Log in to save studios to your wishlist.");
				router.push(
					`/login?redirect=${encodeURIComponent(window.location.pathname)}`,
				);
				return;
			}
			try {
				const { saved } = await api(`/wishlist/${studioId}`, {
					method: "POST",
				});
				setWishlist((w) =>
					saved
						? [...new Set([...w, studioId])]
						: w.filter((x) => x !== studioId),
				);
				toast.success(
					saved
						? "Saved to your wishlist."
						: "Removed from your wishlist.",
				);
			} catch (e) {
				toast.error(e.message);
			}
		},
		[user, router],
	);

	const logout = useCallback(async () => {
		await fetch("/api/token", {
			method: "DELETE",
			credentials: "include",
		}).catch(() => {});
		await authClient.signOut();
		setWishlist([]);
		setTokenUser(null);
		toast.success("You have been logged out.");
		router.push("/");
	}, [router]);

	const value = useMemo(
		() => ({ user, loading, wishlist, toggleWishlist, logout }),
		[user, loading, wishlist, toggleWishlist, logout],
	);
	return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
