"use client";
import { useAuth } from "components/AuthProvider";
import EmptyState from "components/EmptyState";
import { ConfirmModal } from "components/Modal";
import Protected from "components/Protected";
import { RowsSkeleton } from "components/Skeletons";
import { api } from "lib/api";
import { STATUS_STYLE, money, prettyDate } from "lib/constants";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
	FiCalendar,
	FiDollarSign,
	FiHeart,
	FiHome,
	FiInbox,
	FiPlusCircle,
} from "react-icons/fi";

function Dashboard() {
	const { user } = useAuth();
	const [stats, setStats] = useState(null);
	const [requests, setRequests] = useState(null);
	const [decline, setDecline] = useState(null);
	const [busyId, setBusyId] = useState("");

	const load = useCallback(() => {
		Promise.all([api("/dashboard/stats"), api("/bookings/host")])
			.then(([s, r]) => {
				setStats(s);
				setRequests(r);
			})
			.catch((e) => {
				toast.error(e.message);
				setStats({});
				setRequests([]);
			});
	}, []);
	useEffect(load, [load]);

	const setStatus = async (b, status) => {
		setBusyId(b._id);
		try {
			await api(`/bookings/${b._id}/status`, {
				method: "PATCH",
				body: { status },
			});
			toast.success(
				status === "Confirmed"
					? "Booking confirmed. The guest has been notified."
					: `Booking marked ${status.toLowerCase()}.`,
			);
			setDecline(null);
			load();
		} catch (e) {
			toast.error(e.message);
		} finally {
			setBusyId("");
		}
	};

	const cards = stats && [
		{
			label: "Active listings",
			value: stats.listings ?? 0,
			icon: FiHome,
			href: "/my-listings",
		},
		{ label: "Pending requests", value: stats.pending ?? 0, icon: FiInbox },
		{
			label: "Earnings (confirmed)",
			value: money(stats.earnings),
			icon: FiDollarSign,
		},
		{
			label: "My bookings",
			value: stats.myBookings ?? 0,
			icon: FiCalendar,
			href: "/my-bookings",
		},
		{
			label: "Saved studios",
			value: stats.saved ?? 0,
			icon: FiHeart,
			href: "/wishlist",
		},
	];

	return (
		<section className="section">
			<div className="container-x">
				<div className="flex flex-wrap items-end justify-between gap-4">
					<div>
						<h1 className="section-title">
							Hello, {user.name?.split(" ")[0]}
						</h1>
						<p className="section-sub">
							Here is what is happening with your studios and
							bookings.
						</p>
					</div>
					<Link
						href="/add-studio"
						className="btn btn-primary"
					>
						<FiPlusCircle /> Add New Studio
					</Link>
				</div>

				<div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
					{!cards
						? Array.from({ length: 5 }).map((_, i) => (
								<div
									key={i}
									className="skeleton h-28 rounded-2xl"
								/>
							))
						: cards.map((c) => {
								const body = (
									<div className="h-full rounded-2xl border border-base-300 bg-base-100 p-5 card-lift">
										<c.icon className="text-2xl text-primary" />
										<p className="mt-3 font-display text-2xl font-bold">
											{c.value}
										</p>
										<p className="text-sm text-base-content/65">
											{c.label}
										</p>
									</div>
								);
								return c.href ? (
									<Link
										key={c.label}
										href={c.href}
									>
										{body}
									</Link>
								) : (
									<div key={c.label}>{body}</div>
								);
							})}
				</div>

				<h2 className="mt-14 text-2xl font-bold">
					Booking requests for your studios
				</h2>
				<div className="mt-5">
					{requests === null ? (
						<RowsSkeleton rows={3} />
					) : requests.length === 0 ? (
						<EmptyState
							icon={FiInbox}
							title="No booking requests yet"
							text="When a creator requests one of your studios, it will appear here for you to confirm."
							cta={{
								href: "/my-listings",
								label: "View my listings",
							}}
						/>
					) : (
						<div className="overflow-x-auto rounded-2xl border border-base-300">
							<table className="table">
								<thead>
									<tr className="bg-base-200 text-base-content">
										<th>Studio</th>
										<th>Guest</th>
										<th>When</th>
										<th>Total</th>
										<th>Status</th>
										<th className="text-right">Action</th>
									</tr>
								</thead>
								<tbody>
									{requests.map((b) => (
										<tr key={b._id}>
											<td className="font-semibold">
												{b.studioTitle}
											</td>
											<td>
												<p>{b.guestName}</p>
												<p className="text-xs text-base-content/60">
													{b.guestEmail}
												</p>
											</td>
											<td className="whitespace-nowrap">
												<p>{prettyDate(b.date)}</p>
												<p className="text-xs text-base-content/60">
													{b.startTime} - {b.endTime}
												</p>
											</td>
											<td className="whitespace-nowrap font-semibold">
												{money(b.total)}
											</td>
											<td>
												<span
													className={`badge ${STATUS_STYLE[b.status]} font-semibold`}
												>
													{b.status}
												</span>
											</td>
											<td>
												<div className="flex justify-end gap-1.5">
													{b.status === "Pending" && (
														<>
															<button
																disabled={
																	busyId ===
																	b._id
																}
																onClick={() =>
																	setStatus(
																		b,
																		"Confirmed",
																	)
																}
																className="btn btn-success btn-sm"
															>
																Confirm
															</button>
															<button
																disabled={
																	busyId ===
																	b._id
																}
																onClick={() =>
																	setDecline(
																		b,
																	)
																}
																className="btn btn-error btn-outline btn-sm"
															>
																Decline
															</button>
														</>
													)}
													{b.status ===
														"Confirmed" && (
														<>
															<button
																disabled={
																	busyId ===
																	b._id
																}
																onClick={() =>
																	setStatus(
																		b,
																		"Completed",
																	)
																}
																className="btn btn-info btn-sm"
															>
																Mark completed
															</button>
															<button
																disabled={
																	busyId ===
																	b._id
																}
																onClick={() =>
																	setDecline(
																		b,
																	)
																}
																className="btn btn-error btn-outline btn-sm"
															>
																Cancel
															</button>
														</>
													)}
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</div>
			<ConfirmModal
				open={!!decline}
				danger
				busy={!!busyId}
				title={
					decline?.status === "Confirmed"
						? "Cancel this confirmed booking?"
						: "Decline this request?"
				}
				message={
					decline
						? `${decline.guestName} booked ${decline.studioTitle} on ${prettyDate(decline.date)}. They will see the booking as cancelled.`
						: ""
				}
				confirmText="Yes, cancel it"
				onConfirm={() => setStatus(decline, "Cancelled")}
				onCancel={() => setDecline(null)}
			/>
		</section>
	);
}

export default function Page() {
	return (
		<Protected>
			<Dashboard />
		</Protected>
	);
}
