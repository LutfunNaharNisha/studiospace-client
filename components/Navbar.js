"use client";
import { useAuth } from "components/AuthProvider";
import Avatar from "components/Avatar";
import Logo from "components/Logo";
import ThemeToggle from "components/ThemeToggle";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
	FiCalendar,
	FiGrid,
	FiHeart,
	FiList,
	FiLogOut,
	FiMenu,
	FiPlusCircle,
	FiX,
} from "react-icons/fi";

const LINKS = [
	{ href: "/", label: "Home" },
	{ href: "/studios", label: "Explore Studios" },
	{ href: "/how-it-works", label: "How It Works" },
	{ href: "/about", label: "About Us" },
];
const MENU = [
	{ href: "/dashboard", label: "Dashboard", icon: FiGrid },
	{ href: "/add-studio", label: "Add New Studio", icon: FiPlusCircle },
	{ href: "/my-listings", label: "My Studio Listings", icon: FiList },
	{ href: "/my-bookings", label: "My Bookings", icon: FiCalendar },
	{ href: "/wishlist", label: "Saved Studios", icon: FiHeart },
];

export default function Navbar() {
	const pathname = usePathname();
	const { user, loading, logout } = useAuth();
	const [open, setOpen] = useState(false);
	useEffect(() => setOpen(false), [pathname]);

	const isActive = (href) =>
		href === "/" ? pathname === "/" : pathname.startsWith(href);
	const closeDropdown = () => document.activeElement?.blur?.();

	return (
		<header className="sticky top-0 z-50 border-b border-base-300/70 bg-base-100/85 backdrop-blur-lg">
			<div className="container-x flex h-16 items-center justify-between gap-4">
				<Logo />

				<nav
					className="hidden items-center gap-1 lg:flex"
					aria-label="Main"
				>
					{LINKS.map((l) => (
						<Link
							key={l.href}
							href={l.href}
							aria-current={isActive(l.href) ? "page" : undefined}
							className={`relative rounded-lg px-3 py-2 text-sm font-medium transition hover:text-primary ${
								isActive(l.href)
									? "text-primary after:absolute after:inset-x-3 after:-bottom-[15px] after:h-0.5 after:rounded-full after:bg-primary"
									: "text-base-content/75"
							}`}
						>
							{l.label}
						</Link>
					))}
				</nav>

				<div className="flex items-center gap-2">
					<ThemeToggle />
					{loading ? (
						<div className="skeleton h-9 w-24 rounded-xl" />
					) : user ? (
						<div className="dropdown dropdown-end dropdown-hover">
							<div
								tabIndex={0}
								role="button"
								aria-label="Account menu"
								className="flex rounded-full p-0.5 ring-2 ring-transparent transition hover:ring-primary focus:ring-primary"
							>
								<Avatar user={user} />
							</div>
							<div
								tabIndex={0}
								className="dropdown-content z-[60] w-64 pt-3"
							>
								<div className="rounded-2xl border border-base-300 bg-base-100 p-2 shadow-xl">
									<div className="px-3 py-2">
										<p className="truncate font-semibold">
											{user.name}
										</p>
										<p className="truncate text-xs text-base-content/60">
											{user.email}
										</p>
									</div>
									<ul
										className="menu menu-sm gap-0.5 p-1"
										onClick={closeDropdown}
									>
										{MENU.map((m) => (
											<li key={m.href}>
												<Link href={m.href}>
													<m.icon /> {m.label}
												</Link>
											</li>
										))}
										<li className="mt-1 border-t border-base-300 pt-1">
											<button
												onClick={logout}
												className="text-error"
											>
												<FiLogOut /> Logout
											</button>
										</li>
									</ul>
								</div>
							</div>
						</div>
					) : (
						<div className="hidden items-center gap-2 sm:flex">
							<Link
								href="/login"
								className="btn btn-ghost btn-sm"
							>
								Login
							</Link>
							<Link
								href="/register"
								className="btn btn-primary btn-sm"
							>
								Register
							</Link>
						</div>
					)}
					<button
						className="btn btn-ghost btn-circle btn-sm text-xl lg:hidden"
						onClick={() => setOpen((o) => !o)}
						aria-label="Toggle menu"
						aria-expanded={open}
					>
						{open ? <FiX /> : <FiMenu />}
					</button>
				</div>
			</div>

			{open && (
				<div className="border-t border-base-300 bg-base-100 lg:hidden">
					<nav
						className="container-x flex flex-col gap-1 py-3"
						aria-label="Mobile"
					>
						{LINKS.map((l) => (
							<Link
								key={l.href}
								href={l.href}
								className={`rounded-lg px-3 py-2.5 font-medium ${isActive(l.href) ? "bg-primary/10 text-primary" : ""}`}
							>
								{l.label}
							</Link>
						))}
						{!loading && !user && (
							<div className="mt-2 grid grid-cols-2 gap-2">
								<Link
									href="/login"
									className="btn btn-outline btn-sm"
								>
									Login
								</Link>
								<Link
									href="/register"
									className="btn btn-primary btn-sm"
								>
									Register
								</Link>
							</div>
						)}
						{user && (
							<>
								<div className="my-1 border-t border-base-300" />
								{MENU.map((m) => (
									<Link
										key={m.href}
										href={m.href}
										className="flex items-center gap-2 rounded-lg px-3 py-2.5"
									>
										<m.icon /> {m.label}
									</Link>
								))}
								<button
									onClick={logout}
									className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-error"
								>
									<FiLogOut /> Logout
								</button>
							</>
						)}
					</nav>
				</div>
			)}
		</header>
	);
}
