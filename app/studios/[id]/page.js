"use client";
import { useAuth } from "components/AuthProvider";
import Avatar from "components/Avatar";
import BookingModal from "components/BookingModal";
import EmptyState from "components/EmptyState";
import SafeImage from "components/SafeImage";
import { api } from "lib/api";
import { money, monthYear } from "lib/constants";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaHeart, FaStar } from "react-icons/fa6";
import {
	FiCheckCircle,
	FiEdit2,
	FiHeart,
	FiMapPin,
	FiShield,
	FiUsers,
} from "react-icons/fi";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Keyboard, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

function Stars({ value, onChange, size = "text-base" }) {
	return (
		<span className={`inline-flex gap-0.5 ${size}`}>
			{[1, 2, 3, 4, 5].map((n) => (
				<button
					key={n}
					type="button"
					disabled={!onChange}
					onClick={() => onChange?.(n)}
					aria-label={`${n} star${n > 1 ? "s" : ""}`}
					className={
						n <= value ? "text-accent" : "text-base-content/20"
					}
				>
					<FaStar />
				</button>
			))}
		</span>
	);
}

export default function StudioDetailsPage() {
	const { id } = useParams();
	const router = useRouter();
	const { user, wishlist, toggleWishlist } = useAuth();
	const [studio, setStudio] = useState(null);
	const [reviews, setReviews] = useState([]);
	const [state, setState] = useState("loading"); // loading | ready | missing
	const [booking, setBooking] = useState(false);
	const [rv, setRv] = useState({ rating: 5, comment: "" });
	const [posting, setPosting] = useState(false);

	const load = useCallback(async () => {
		try {
			const [s, r] = await Promise.all([
				api(`/studios/${id}`),
				api(`/studios/${id}/reviews`),
			]);
			setStudio(s);
			setReviews(r);
			setState("ready");
		} catch (e) {
			setState("missing");
		}
	}, [id]);
	useEffect(() => {
		load();
	}, [load]);

	if (state === "loading") {
		return (
			<div
				className="container-x section"
				aria-busy="true"
			>
				<div className="skeleton h-[420px] w-full rounded-3xl" />
				<div className="mt-8 grid gap-8 lg:grid-cols-3">
					<div className="space-y-4 lg:col-span-2">
						<div className="skeleton h-10 w-2/3" />
						<div className="skeleton h-5 w-1/3" />
						<div className="skeleton h-40 w-full" />
					</div>
					<div className="skeleton h-64 w-full rounded-2xl" />
				</div>
			</div>
		);
	}
	if (state === "missing") {
		return (
			<div className="container-x section">
				<EmptyState
					icon={FiMapPin}
					title="Studio not found"
					text="This listing may have been removed by its host."
					cta={{ href: "/studios", label: "Explore Studios" }}
				/>
			</div>
		);
	}

	const isOwner = user?.email === studio.ownerEmail;
	const saved = wishlist.includes(String(studio._id));
	const images = [
		...new Set([studio.image, ...(studio.gallery || [])].filter(Boolean)),
	];

	const openBooking = () => {
		if (!user) {
			toast.error("Please log in to book this studio.");
			router.push(
				`/login?redirect=${encodeURIComponent(`/studios/${id}`)}`,
			);
			return;
		}
		setBooking(true);
	};

	const postReview = async (e) => {
		e.preventDefault();
		setPosting(true);
		try {
			await api(`/studios/${id}/reviews`, { method: "POST", body: rv });
			toast.success("Thanks! Your review is live.");
			setRv({ rating: 5, comment: "" });
			await load();
		} catch (err) {
			toast.error(err.message);
		} finally {
			setPosting(false);
		}
	};

	return (
		<article className="container-x py-8 sm:py-10">
			<Swiper
				modules={[Navigation, Pagination, Keyboard]}
				navigation
				pagination={{ clickable: true }}
				keyboard
				className="aspect-[16/9] max-h-[520px] w-full overflow-hidden rounded-3xl bg-base-200 sm:aspect-[21/9]"
			>
				{images.map((src, i) => (
					<SwiperSlide key={src + i}>
						<SafeImage
							src={src}
							alt={`${studio.title} photo ${i + 1}`}
							className="h-full w-full object-cover"
						/>
					</SwiperSlide>
				))}
			</Swiper>

			<div className="mt-8 grid gap-10 lg:grid-cols-3">
				<div className="space-y-10 lg:col-span-2">
					<header>
						<div className="flex flex-wrap items-center gap-2">
							<span className="badge badge-primary">
								{studio.category}
							</span>
							<span className="flex items-center gap-1.5 text-sm font-medium">
								<FaStar className="text-accent" />{" "}
								{studio.reviewCount
									? `${Number(studio.rating).toFixed(1)} (${studio.reviewCount} reviews)`
									: "No reviews yet"}
							</span>
						</div>
						<h1 className="mt-3 text-3xl font-bold sm:text-4xl">
							{studio.title}
						</h1>
						<p className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-base-content/70">
							<span className="flex items-center gap-1.5">
								<FiMapPin /> {studio.location}
							</span>
							<span className="flex items-center gap-1.5">
								<FiUsers /> Up to {studio.capacity} people
							</span>
						</p>
					</header>

					<section>
						<h2 className="text-2xl font-bold">About this space</h2>
						<p className="mt-3 whitespace-pre-line leading-relaxed text-base-content/80">
							{studio.overview}
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-bold">Amenities</h2>
						{studio.amenities?.length ? (
							<ul className="mt-4 grid gap-3 sm:grid-cols-2">
								{studio.amenities.map((a) => (
									<li
										key={a}
										className="flex items-center gap-2.5"
									>
										<FiCheckCircle className="shrink-0 text-primary" />{" "}
										{a}
									</li>
								))}
							</ul>
						) : (
							<p className="mt-3 text-base-content/60">
								The host has not listed amenities yet.
							</p>
						)}
					</section>

					<section className="flex items-center gap-4 rounded-2xl border border-base-300 p-5">
						<Avatar
							user={{
								name: studio.ownerName,
								image: studio.ownerImage,
							}}
							size="h-14 w-14"
						/>
						<div className="min-w-0">
							<p className="text-sm text-base-content/60">
								Hosted by
							</p>
							<p className="truncate text-lg font-bold">
								{studio.ownerName}
							</p>
							<p className="flex items-center gap-1.5 text-sm text-base-content/70">
								<FiShield className="text-primary" /> Verified
								StudioSpace host
							</p>
						</div>
					</section>

					<section>
						<h2 className="text-2xl font-bold">Reviews</h2>
						{reviews.length === 0 ? (
							<p className="mt-3 text-base-content/60">
								No reviews yet. Book this space and be the first
								to share how it went.
							</p>
						) : (
							<ul className="mt-5 space-y-5">
								{reviews.map((r) => (
									<li
										key={r._id}
										className="flex gap-4"
									>
										<Avatar
											user={{
												name: r.userName,
												image: r.userImage,
											}}
											size="h-10 w-10"
										/>
										<div>
											<p className="font-semibold">
												{r.userName}{" "}
												<span className="ml-2 text-xs font-normal text-base-content/50">
													{monthYear(r.createdAt)}
												</span>
											</p>
											<Stars
												value={r.rating}
												size="text-sm"
											/>
											<p className="mt-1.5 text-base-content/80">
												{r.comment}
											</p>
										</div>
									</li>
								))}
							</ul>
						)}
						{user && !isOwner && (
							<form
								onSubmit={postReview}
								className="mt-8 space-y-3 rounded-2xl border border-base-300 p-5"
							>
								<p className="font-semibold">
									Share your experience
								</p>
								<Stars
									value={rv.rating}
									onChange={(rating) =>
										setRv({ ...rv, rating })
									}
									size="text-2xl"
								/>
								<textarea
									required
									minLength={5}
									maxLength={600}
									rows={3}
									value={rv.comment}
									onChange={(e) =>
										setRv({
											...rv,
											comment: e.target.value,
										})
									}
									className="textarea textarea-bordered w-full"
									placeholder="What worked well? Anything future guests should know?"
									aria-label="Your review"
								/>
								<button
									className="btn btn-primary btn-sm"
									disabled={posting}
								>
									{posting && (
										<span className="loading loading-spinner loading-xs" />
									)}{" "}
									Post review
								</button>
							</form>
						)}
					</section>
				</div>

				<aside className="lg:sticky lg:top-24 lg:self-start">
					<div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-lg">
						<p className="tape">
							<span className="text-3xl font-bold">
								{money(studio.hourlyRate)}
							</span>
							<span className="text-sm font-medium">/ hour</span>
						</p>
						<dl className="mt-5 space-y-2 text-sm">
							<div className="flex justify-between">
								<dt className="text-base-content/70">
									Security deposit
								</dt>
								<dd className="font-medium">
									{money(studio.securityDeposit)} (refundable)
								</dd>
							</div>
							<div className="flex justify-between">
								<dt className="text-base-content/70">
									Capacity
								</dt>
								<dd className="font-medium">
									{studio.capacity} people
								</dd>
							</div>
							<div className="flex justify-between">
								<dt className="text-base-content/70">
									Booking hours
								</dt>
								<dd className="font-medium">06:00 - 24:00</dd>
							</div>
						</dl>
						{isOwner ? (
							<Link
								href={`/studios/edit/${studio._id}`}
								className="btn btn-outline mt-6 w-full"
							>
								<FiEdit2 /> Edit your listing
							</Link>
						) : (
							<button
								onClick={openBooking}
								className="btn btn-primary mt-6 w-full"
							>
								Book Workspace Now
							</button>
						)}
						<button
							onClick={() => toggleWishlist(String(studio._id))}
							className="btn btn-ghost mt-2 w-full"
						>
							{saved ? (
								<FaHeart className="text-error" />
							) : (
								<FiHeart />
							)}{" "}
							{saved ? "Saved to wishlist" : "Save to wishlist"}
						</button>
						<p className="mt-4 text-center text-xs text-base-content/55">
							You will not be charged until the host confirms.
						</p>
					</div>
				</aside>
			</div>

			{booking && (
				<BookingModal
					studio={studio}
					open={booking}
					onClose={() => setBooking(false)}
				/>
			)}
		</article>
	);
}
