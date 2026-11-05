"use client";
import { useAuth } from "components/AuthProvider";
import EmptyState from "components/EmptyState";
import Protected from "components/Protected";
import { GridSkeleton } from "components/Skeletons";
import StudioCard from "components/StudioCard";
import { api } from "lib/api";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiHeart } from "react-icons/fi";

function Wishlist() {
	const { wishlist } = useAuth();
	const [items, setItems] = useState(null);

	useEffect(() => {
		api("/wishlist")
			.then(setItems)
			.catch((e) => {
				toast.error(e.message);
				setItems([]);
			});
	}, []);

	// Un-saving a heart removes the card immediately
	const visible = items?.filter((s) => wishlist.includes(String(s._id)));

	return (
		<section className="section">
			<div className="container-x">
				<h1 className="section-title">Saved studios</h1>
				<p className="section-sub">
					Your shortlist of spaces, ready when you are.
				</p>
				<div className="mt-8">
					{items === null ? (
						<GridSkeleton count={3} />
					) : visible.length === 0 ? (
						<EmptyState
							icon={FiHeart}
							title="Nothing saved yet"
							text="Tap the heart on any studio card to keep it here."
							cta={{ href: "/studios", label: "Explore Studios" }}
						/>
					) : (
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{visible.map((s) => (
								<StudioCard
									key={s._id}
									studio={s}
								/>
							))}
						</div>
					)}
				</div>
			</div>
		</section>
	);
}

export default function Page() {
	return (
		<Protected>
			<Wishlist />
		</Protected>
	);
}
