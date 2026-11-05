"use client";
import EmptyState from "components/EmptyState";
import { ConfirmModal } from "components/Modal";
import Protected from "components/Protected";
import SafeImage from "components/SafeImage";
import { RowsSkeleton } from "components/Skeletons";
import { api } from "lib/api";
import { STATUS_STYLE, money, prettyDate } from "lib/constants";
import { downloadInvoice } from "lib/invoice";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
	FiCalendar,
	FiClock,
	FiDownload,
	FiMapPin,
	FiUsers,
} from "react-icons/fi";

const TABS = ["All", "Pending", "Confirmed", "Completed", "Cancelled"];

function MyBookings() {
	const [items, setItems] = useState(null);
	const [tab, setTab] = useState("All");
	const [target, setTarget] = useState(null);
	const [busy, setBusy] = useState(false);

	useEffect(() => {
		api("/bookings/mine")
			.then(setItems)
			.catch((e) => {
				toast.error(e.message);
				setItems([]);
			});
	}, []);

	const shown = useMemo(
		() => (items || []).filter((b) => tab === "All" || b.status === tab),
		[items, tab],
	);

	const cancel = async () => {
		setBusy(true);
		try {
			await api(`/bookings/${target._id}/cancel`, { method: "PATCH" });
			setItems((list) =>
				list.map((b) =>
					b._id === target._id ? { ...b, status: "Cancelled" } : b,
				),
			);
			toast.success("Your booking has been cancelled.");
			setTarget(null);
		} catch (e) {
			toast.error(e.message);
		} finally {
			setBusy(false);
		}
	};

	const invoice = async (b) => {
		try {
			await downloadInvoice(b);
			toast.success("Invoice downloaded.");
		} catch (e) {
			toast.error("The invoice could not be created. Please try again.");
		}
	};

	return (
		<section className="section">
			<div className="container-x">
				<h1 className="section-title">My bookings</h1>
				<p className="section-sub">
					Track every reservation, cancel pending requests and
					download invoices for confirmed sessions.
				</p>

				<div
					className="mt-6 flex flex-wrap gap-2"
					role="tablist"
				>
					{TABS.map((t) => (
						<button
							key={t}
							role="tab"
							aria-selected={tab === t}
							onClick={() => setTab(t)}
							className={`btn btn-sm ${tab === t ? "btn-primary" : "btn-outline border-base-300"}`}
						>
							{t}
							{items && t !== "All"
								? ` (${items.filter((b) => b.status === t).length})`
								: ""}
						</button>
					))}
				</div>

				<div className="mt-6">
					{items === null ? (
						<RowsSkeleton />
					) : shown.length === 0 ? (
						<EmptyState
							icon={FiCalendar}
							title={
								items.length
									? `No ${tab.toLowerCase()} bookings`
									: "No bookings yet"
							}
							text={
								items.length
									? "Switch tabs to see your other reservations."
									: "Find a space you love and your reservation will show up here."
							}
							cta={
								items.length
									? null
									: {
											href: "/studios",
											label: "Explore Studios",
										}
							}
						/>
					) : (
						<ul className="space-y-4">
							{shown.map((b) => (
								<li
									key={b._id}
									className="flex flex-col gap-5 rounded-2xl border border-base-300 bg-base-100 p-4 sm:flex-row sm:p-5"
								>
									<SafeImage
										src={b.studioImage}
										alt=""
										className="h-40 w-full shrink-0 rounded-xl object-cover sm:h-32 sm:w-48"
									/>
									<div className="min-w-0 flex-1">
										<div className="flex flex-wrap items-start justify-between gap-2">
											<div className="min-w-0">
												<Link
													href={`/studios/${b.studioId}`}
													className="text-lg font-bold hover:text-primary"
												>
													{b.studioTitle}
												</Link>
												<p className="mt-1 flex items-center gap-1.5 text-sm text-base-content/65">
													<FiMapPin className="shrink-0" />{" "}
													<span className="truncate">
														{b.studioLocation}
													</span>
												</p>
											</div>
											<span
												className={`badge ${STATUS_STYLE[b.status]} font-semibold`}
											>
												{b.status}
											</span>
										</div>
										<dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5 text-sm">
											<div className="flex items-center gap-1.5">
												<FiCalendar />{" "}
												{prettyDate(b.date)}
											</div>
											<div className="flex items-center gap-1.5">
												<FiClock /> {b.startTime} -{" "}
												{b.endTime} ({b.hours} hr)
											</div>
											<div className="flex items-center gap-1.5">
												<FiUsers /> {b.guests}{" "}
												{b.guests === 1
													? "person"
													: "people"}
											</div>
										</dl>
										<div className="mt-4 flex flex-wrap items-center justify-between gap-3">
											<p className="text-sm text-base-content/70">
												Total{" "}
												<span className="text-lg font-bold text-base-content">
													{money(b.total)}
												</span>{" "}
												<span className="text-xs">
													(incl.{" "}
													{money(b.securityDeposit)}{" "}
													deposit)
												</span>
											</p>
											<div className="flex gap-2">
												{b.status === "Pending" && (
													<button
														onClick={() =>
															setTarget(b)
														}
														className="btn btn-error btn-outline btn-sm"
													>
														Cancel Booking
													</button>
												)}
												{[
													"Confirmed",
													"Completed",
												].includes(b.status) && (
													<button
														onClick={() =>
															invoice(b)
														}
														className="btn btn-outline btn-sm"
													>
														<FiDownload /> Invoice
													</button>
												)}
											</div>
										</div>
									</div>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
			<ConfirmModal
				open={!!target}
				danger
				busy={busy}
				title="Cancel this booking?"
				message={
					target
						? `Your request for ${target.studioTitle} on ${prettyDate(target.date)} will be withdrawn.`
						: ""
				}
				confirmText="Cancel booking"
				onConfirm={cancel}
				onCancel={() => setTarget(null)}
			/>
		</section>
	);
}

export default function Page() {
	return (
		<Protected>
			<MyBookings />
		</Protected>
	);
}
