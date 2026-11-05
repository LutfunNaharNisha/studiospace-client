"use client";
import { authClient } from "lib/auth-client";
import { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";

export default function GoogleButton({ label = "Continue with Google" }) {
	const [busy, setBusy] = useState(false);
	const go = async () => {
		setBusy(true);
		const redirect =
			new URLSearchParams(window.location.search).get("redirect") || "/";
		const { error } = await authClient.signIn.social({
			provider: "google",
			callbackURL: redirect,
		});
		if (error) {
			toast.error(
				error.message || "Google sign-in is not available right now.",
			);
			setBusy(false);
		}
	};
	return (
		<button
			type="button"
			onClick={go}
			disabled={busy}
			className="btn btn-outline w-full"
		>
			{busy ? (
				<span className="loading loading-spinner loading-sm" />
			) : (
				<FcGoogle className="text-xl" />
			)}{" "}
			{label}
		</button>
	);
}
