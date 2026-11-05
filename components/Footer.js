"use client";
import Logo from "components/Logo";
import { CATEGORIES } from "lib/constants";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import {
	FaGithub,
	FaInstagram,
	FaLinkedinIn,
	FaXTwitter,
	FaYoutube,
} from "react-icons/fa6";

const SOCIAL = [
	{ label: "X", href: "https://x.com", icon: FaXTwitter },
	{ label: "Instagram", href: "https://instagram.com", icon: FaInstagram },
	{
		label: "LinkedIn",
		href: "https://linkedin.com/in/lutfunnaharnishaa",
		icon: FaLinkedinIn,
	},
	{ label: "YouTube", href: "https://youtube.com", icon: FaYoutube },
	{
		label: "GitHub",
		href: "https://github.com/LutfunNaharNisha",
		icon: FaGithub,
	},
];

export default function Footer() {
	const [email, setEmail] = useState("");
	const subscribe = (e) => {
		e.preventDefault();
		if (!/^\S+@\S+\.\S+$/.test(email))
			return toast.error("Enter a valid email address to subscribe.");
		toast.success("You are on the list. Watch your inbox for new studios.");
		setEmail("");
	};

	return (
		<footer className="mt-10 bg-neutral text-neutral-content">
			<div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
				<div>
					<div className="[&_a]:text-neutral-content">
						<Logo />
					</div>
					<p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-content/70">
						StudioSpace connects creators with verified studio
						owners, so the right room is always one booking away.
					</p>
					<div className="mt-5 flex gap-2">
						{SOCIAL.map((s) => (
							<a
								key={s.label}
								href={s.href}
								target="_blank"
								rel="noreferrer"
								aria-label={s.label}
								className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition hover:bg-primary hover:text-primary-content"
							>
								<s.icon />
							</a>
						))}
					</div>
				</div>

				<div>
					<h3 className="font-semibold">Quick links</h3>
					<ul className="mt-4 space-y-2 text-sm text-neutral-content/70">
						{[
							["/", "Home"],
							["/studios", "Explore Studios"],
							["/how-it-works", "How It Works"],
							["/about", "About Us"],
							["/add-studio", "Host Your Space"],
						].map(([href, label]) => (
							<li key={href}>
								<Link
									href={href}
									className="hover:text-primary"
								>
									{label}
								</Link>
							</li>
						))}
					</ul>
				</div>

				<div>
					<h3 className="font-semibold">Popular categories</h3>
					<ul className="mt-4 space-y-2 text-sm text-neutral-content/70">
						{CATEGORIES.map((c) => (
							<li key={c.value}>
								<Link
									href={`/studios?category=${encodeURIComponent(c.value)}`}
									className="hover:text-primary"
								>
									{c.label}
								</Link>
							</li>
						))}
					</ul>
				</div>

				<div>
					<h3 className="font-semibold">New studios in your inbox</h3>
					<p className="mt-4 text-sm text-neutral-content/70">
						One short email when standout spaces open for booking.
					</p>
					<form
						onSubmit={subscribe}
						className="mt-4 flex gap-2"
					>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="you@email.com"
							aria-label="Email address"
							className="input input-sm h-10 w-full bg-white/10 text-neutral-content placeholder:text-neutral-content/40"
						/>
						<button className="btn btn-primary btn-sm h-10">
							Subscribe
						</button>
					</form>
				</div>
			</div>
			<div className="border-t border-white/10">
				<div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-neutral-content/60 sm:flex-row">
					<p>
						&copy; {new Date().getFullYear()} StudioSpace. All
						rights reserved.
					</p>
					<p>
						By using StudioSpace you agree to our Terms of Service
						and Privacy Policy.
					</p>
				</div>
			</div>
		</footer>
	);
}
