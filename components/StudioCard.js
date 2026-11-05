"use client";
import { useAuth } from "components/AuthProvider";
import SafeImage from "components/SafeImage";
import { money } from "lib/constants";
import Link from "next/link";
import { FaHeart, FaStar } from "react-icons/fa6";
import { FiHeart, FiMapPin, FiUsers } from "react-icons/fi";

export default function StudioCard({ studio }) {
	const { wishlist, toggleWishlist } = useAuth();
	const saved = wishlist.includes(String(studio._id));

	return (
		<article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-100 card-lift">
			<div className="relative aspect-[4/3] overflow-hidden bg-base-200">
				<SafeImage
					src={studio.image}
					alt={studio.title}
					className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
				/>
				<span className="badge badge-neutral absolute left-3 top-3 border-0 font-medium">
					{studio.category}
				</span>
				<button
					onClick={() => toggleWishlist(String(studio._id))}
					aria-label={
						saved ? "Remove from wishlist" : "Save to wishlist"
					}
					aria-pressed={saved}
					className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-base-100/90 text-lg shadow backdrop-blur transition hover:scale-110"
				>
					{saved ? <FaHeart className="text-error" /> : <FiHeart />}
				</button>
				<span className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-black/75 px-2.5 py-1 text-xs font-semibold text-white">
					<FaStar className="text-accent" />{" "}
					{studio.reviewCount
						? Number(studio.rating).toFixed(1)
						: "New"}
					{studio.reviewCount > 0 && (
						<span className="font-normal text-white/70">
							({studio.reviewCount})
						</span>
					)}
				</span>
			</div>
			<div className="flex flex-1 flex-col p-5">
				<h3 className="line-clamp-1 text-lg font-bold">
					{studio.title}
				</h3>
				<p className="mt-1.5 flex items-center gap-1.5 text-sm text-base-content/65">
					<FiMapPin className="shrink-0" />{" "}
					<span className="line-clamp-1">{studio.location}</span>
				</p>
				<p className="mt-1 flex items-center gap-1.5 text-sm text-base-content/65">
					<FiUsers className="shrink-0" /> Up to {studio.capacity}{" "}
					people
				</p>
				<div className="mt-auto flex items-center justify-between gap-3 pt-5">
					<p className="tape">
						<span className="text-lg font-bold">
							{money(studio.hourlyRate)}
						</span>
						<span className="text-xs font-medium">/ hr</span>
					</p>
					<Link
						href={`/studios/${studio._id}`}
						className="btn btn-primary btn-sm"
					>
						View Details
					</Link>
				</div>
			</div>
		</article>
	);
}
