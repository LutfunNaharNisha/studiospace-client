"use client";
import AuthShell from "components/AuthShell";
import GoogleButton from "components/GoogleButton";
import { authClient } from "lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiCheck, FiEye, FiEyeOff } from "react-icons/fi";

const RULES = [
	{ test: (p) => /[A-Z]/.test(p), label: "One uppercase letter" },
	{ test: (p) => /[a-z]/.test(p), label: "One lowercase letter" },
	{ test: (p) => p.length >= 6, label: "At least 6 characters" },
];

export default function RegisterPage() {
	const router = useRouter();
	const [form, setForm] = useState({
		name: "",
		email: "",
		photo: "",
		password: "",
	});
	const [show, setShow] = useState(false);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState("");
	const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
	const failed = RULES.filter((r) => !r.test(form.password));

	const submit = async (e) => {
		e.preventDefault();
		setError("");
		if (failed.length) {
			const msg = `Your password needs: ${failed.map((r) => r.label.toLowerCase()).join(", ")}.`;
			setError(msg);
			toast.error(msg);
			return;
		}
		setBusy(true);
		const payload = {
			name: form.name.trim(),
			email: form.email.trim(),
			password: form.password,
		};
		if (form.photo.trim()) payload.image = form.photo.trim();
		const { error: err } = await authClient.signUp.email(payload);
		setBusy(false);
		if (err) {
			const msg = /exist|already/i.test(err.message || "")
				? "An account with this email already exists. Try logging in."
				: err.message || "We could not create your account.";
			setError(msg);
			toast.error(msg);
			return;
		}
		toast.success("Account created! Please log in to continue.");
		router.push("/login");
	};

	return (
		<AuthShell
			title="Create your account"
			subtitle="Book studios in minutes, or list your own space."
			footer={
				<>
					Already registered?{" "}
					<Link
						href="/login"
						className="font-semibold text-primary hover:underline"
					>
						Login
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
						htmlFor="name"
						className="field-label"
					>
						Full name
					</label>
					<input
						id="name"
						required
						autoComplete="name"
						className="input input-bordered w-full"
						placeholder="Your name"
						value={form.name}
						onChange={set("name")}
					/>
				</div>
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
						onChange={set("email")}
					/>
				</div>
				<div>
					<label
						htmlFor="photo"
						className="field-label"
					>
						Photo URL{" "}
						<span className="font-normal text-base-content/50">
							(optional)
						</span>
					</label>
					<input
						id="photo"
						type="url"
						className="input input-bordered w-full"
						placeholder="https://..."
						value={form.photo}
						onChange={set("photo")}
					/>
				</div>
				<div>
					<label
						htmlFor="password"
						className="field-label"
					>
						Password
					</label>
					<div className="relative">
						<input
							id="password"
							type={show ? "text" : "password"}
							required
							autoComplete="new-password"
							className="input input-bordered w-full pr-11"
							placeholder="Create a password"
							value={form.password}
							onChange={set("password")}
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
					<ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
						{RULES.map((r) => (
							<li
								key={r.label}
								className={`flex items-center gap-1 ${r.test(form.password) ? "text-success" : "text-base-content/55"}`}
							>
								<FiCheck /> {r.label}
							</li>
						))}
					</ul>
				</div>
				<button
					className="btn btn-primary w-full"
					disabled={
						busy || !form.name || !form.email || !form.password
					}
				>
					{busy && (
						<span className="loading loading-spinner loading-sm" />
					)}{" "}
					Register
				</button>
				<div className="divider text-xs text-base-content/50">or</div>
				<GoogleButton label="Sign up with Google" />
			</form>
		</AuthShell>
	);
}
