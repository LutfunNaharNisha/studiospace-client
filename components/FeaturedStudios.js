"use client";
import EmptyState from "components/EmptyState";
import { GridSkeleton } from "components/Skeletons";
import StudioCard from "components/StudioCard";
import { api } from "lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiCamera } from "react-icons/fi";

export default function FeaturedStudios() {
	const [state, setState] = useState({ loading: true, items: [], error: "" });
	const load = () => {
		setState({ loading: true, items: [], error: "" });
		api("/studios/featured")
			.then((items) => setState({ loading: false, items, error: "" }))
			.catch((e) =>
				setState({ loading: false, items: [], error: e.message }),
			);
	};
	useEffect(load, []);

	return (
		<div className="mt-10">
			{state.loading ? (
				<GridSkeleton count={6} />
			) : state.error ? (
				<div className="mx-auto max-w-md rounded-2xl border border-error/30 bg-error/10 p-6 text-center">
					<p className="font-medium">
						We could not load the featured studios.
					</p>
					<p className="mt-1 text-sm text-base-content/70">
						{state.error}
					</p>
					<button
						onClick={load}
						className="btn btn-outline btn-sm mt-4"
					>
						Try again
					</button>
				</div>
			) : state.items.length === 0 ? (
				<EmptyState
					icon={FiCamera}
					title="No studios listed yet"
					text="Be the first host on StudioSpace and your space will appear right here."
					cta={{ href: "/add-studio", label: "List your studio" }}
				/>
			) : (
				<>
					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{state.items.map((s) => (
							<StudioCard
								key={s._id}
								studio={s}
							/>
						))}
					</div>
					<div className="mt-10 text-center">
						<Link
							href="/studios"
							className="btn btn-outline"
						>
							Browse all studios
						</Link>
					</div>
				</>
			)}
		</div>
	);
}
