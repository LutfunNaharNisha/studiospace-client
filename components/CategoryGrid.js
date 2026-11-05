"use client";
import { api } from "lib/api";
import { CATEGORIES } from "lib/constants";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiCamera, FiFilm, FiMic, FiMusic, FiPenTool } from "react-icons/fi";

const ICONS = {
	"Photo Studio": FiCamera,
	"Film & Sound Stage": FiFilm,
	"Podcast Lounge": FiMic,
	"Music Suite": FiMusic,
	"Art Workshop": FiPenTool,
};

export default function CategoryGrid() {
	const [counts, setCounts] = useState({});
	useEffect(() => {
		api("/studios/categories")
			.then(setCounts)
			.catch(() => {});
	}, []);

	return (
		<div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
			{CATEGORIES.map((c) => {
				const Icon = ICONS[c.value];
				return (
					<Link
						key={c.value}
						href={`/studios?category=${encodeURIComponent(c.value)}`}
						className="group flex h-full flex-col rounded-2xl border border-base-300 bg-base-100 p-5 card-lift hover:border-primary"
					>
						<span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-2xl text-primary transition group-hover:bg-primary group-hover:text-primary-content">
							<Icon />
						</span>
						<h3 className="mt-4 text-lg font-bold">{c.label}</h3>
						<p className="mt-1 text-sm text-base-content/65">
							{c.blurb}
						</p>
						<p className="mt-auto pt-4 text-sm font-semibold text-primary">
							{counts[c.value] != null
								? `${counts[c.value]} ${counts[c.value] === 1 ? "space" : "spaces"} available`
								: "Browse spaces"}
						</p>
					</Link>
				);
			})}
		</div>
	);
}
