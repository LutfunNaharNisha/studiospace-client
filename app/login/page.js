"use client";
import { useAuth } from "components/AuthProvider";
import AuthShell from "components/AuthShell";
import GoogleButton from "components/GoogleButton";
import { authClient } from "lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function LoginPage() {
	const router = useRouter();
	const { user, loading } = useAuth();
	const [form, setForm] = useState({ email: "", password: "" });
	const [show, setShow] = useState(false);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState("");

	const target = () =>
		new URLSearchParams(window.location.search).get("redirect") || "/";

	useEffect(() => {
		if (!loading && user) router.replace(target());
	}, [loading, user, router]);

	const submit = async (e) => {
		e.preventDefault();
		setBusy(true);
		setError("");
		const { error: err } = await authClient.signIn.email({
			email: form.email.trim(),
			password: form.password,
		});
		setBusy(false);
		if (err) {
			const msg =
				err.status === 401 || /invalid/i.test(err.message || "")
					? "Incorrect email or password. Please try again."
					: err.message || "We could not log you in.";
			setError(msg);
			toast.error(msg);
			return;
		}
		toast.success("Welcome back to StudioSpace!");
		router.push(target());
		router.refresh();
	};

	return (
		<AuthShell
			title="Welcome back"
			subtitle="Log in to manage bookings, listings and saved studios."
			footer={
				<>
					New to StudioSpace?{" "}
					<Link
						href="/register"
						className="font-semibold text-primary hover:underline"
					>
						Create an account
					</Link>
				</>
			}
		>
			<form
				onSubmit={submit}
				className="space-y-4"
				noValidate
			>
				{error && (
					<div
						role="alert"
						className="rounded-xl border border-error/40 bg-error/10 px-4 py-3 text-sm"
					>
						{error}
					</div>
				)}
				<div>
					<label
						htmlFor="email"
						className="field-label"
					>
						Email
					</label>
					<input
						id="email"
						type="email"
						required
						autoComplete="email"
						className="input input-bordered w-full"
						placeholder="you@email.com"
						value={form.email}
						onChange={(e) =>
							setForm({ ...form, email: e.target.value })
						}
					/>
				</div>
				<div>
					<div className="flex items-center justify-between">
						<label
							htmlFor="password"
							className="field-label"
						>
							Password
						</label>
						<button
							type="button"
							onClick={() =>
								toast(
									"Password recovery is switched off in this demo build.",
									{ icon: "ℹ️" },
								)
							}
							className="mb-1.5 text-xs font-medium text-primary hover:underline"
						>
							Forgot password?
						</button>
					</div>
					<div className="relative">
						<input
							id="password"
							type={show ? "text" : "password"}
							required
							autoComplete="current-password"
							className="input input-bordered w-full pr-11"
							placeholder="Your password"
							value={form.password}
							onChange={(e) =>
								setForm({ ...form, password: e.target.value })
							}
						/>
						<button
							type="button"
							onClick={() => setShow(!show)}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-lg text-base-content/60"
							aria-label={
								show ? "Hide password" : "Show password"
							}
						>
							{show ? <FiEyeOff /> : <FiEye />}
						</button>
					</div>
				</div>
				<button
					className="btn btn-primary w-full"
					disabled={busy || !form.email || !form.password}
				>
					{busy && (
						<span className="loading loading-spinner loading-sm" />
					)}{" "}
					Login
				</button>
				<div className="divider text-xs text-base-content/50">or</div>
				<GoogleButton />
			</form>
		</AuthShell>
	);
}
