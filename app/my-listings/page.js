"use client";
import EmptyState from "components/EmptyState";
import { ConfirmModal } from "components/Modal";
import Protected from "components/Protected";
import SafeImage from "components/SafeImage";
import { RowsSkeleton } from "components/Skeletons";
import { api } from "lib/api";
import { money } from "lib/constants";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiEye, FiHome, FiPlusCircle, FiTrash2 } from "react-icons/fi";

function MyListings() {
	const [items, setItems] = useState(null);
	const [target, setTarget] = useState(null);
	const [busy, setBusy] = useState(false);

	useEffect(() => {
		api("/studios/mine")
			.then(setItems)
			.catch((e) => {
				toast.error(e.message);
				setItems([]);
			});
	}, []);

	const remove = async () => {
		setBusy(true);
		try {
			await api(`/studios/${target._id}`, { method: "DELETE" });
			setItems((list) => list.filter((s) => s._id !== target._id));
			toast.success(`"${target.title}" has been deleted.`);
			setTarget(null);
		} catch (e) {
			toast.error(e.message);
		} finally {
			setBusy(false);
		}
	};

	return (
		<section className="section">
			<div className="container-x">
				<div className="flex flex-wrap items-end justify-between gap-4">
					<div>
						<h1 className="section-title">My studio listings</h1>
						<p className="section-sub">
							Edit rates, update photos or remove spaces you no
							longer host.
						</p>
					</div>
					<Link
						href="/add-studio"
						className="btn btn-primary"
					>
						<FiPlusCircle /> Add New Studio
					</Link>
				</div>

				<div className="mt-8">
					{items === null ? (
						<RowsSkeleton />
					) : items.length === 0 ? (
						<EmptyState
							icon={FiHome}
							title="You have not listed a studio yet"
							text="Add your first space and creators can start booking it today."
							cta={{
								href: "/add-studio",
								label: "Add New Studio",
							}}
						/>
					) : (
						<div className="overflow-x-auto rounded-2xl border border-base-300">
							<table className="table">
								<thead>
									<tr className="bg-base-200 text-base-content">
										<th>Studio</th>
										<th>Category</th>
										<th>Rate</th>
										<th>Rating</th>
										<th className="text-right">Actions</th>
									</tr>
								</thead>
								<tbody>
									{items.map((s) => (
										<tr
											key={s._id}
											className="hover"
										>
											<td>
												<div className="flex items-center gap-3">
													<SafeImage
														src={s.image}
														alt=""
														className="h-14 w-20 shrink-0 rounded-lg object-cover"
													/>
													<div className="min-w-0">
														<p className="font-bold">
															{s.title}
														</p>
														<p className="max-w-[16rem] truncate text-xs text-base-content/60">
															{s.location}
														</p>
													</div>
												</div>
											</td>
											<td>
												<span className="badge badge-ghost whitespace-nowrap">
													{s.category}
												</span>
											</td>
											<td className="whitespace-nowrap font-semibold">
												{money(s.hourlyRate)} / hr
											</td>
											<td>
												{s.reviewCount
													? `${Number(s.rating).toFixed(1)} (${s.reviewCount})`
													: "New"}
											</td>
											<td>
												<div className="flex justify-end gap-1.5">
													<Link
														href={`/studios/${s._id}`}
														className="btn btn-ghost btn-sm btn-square"
														aria-label={`View ${s.title}`}
													>
														<FiEye />
													</Link>
													<Link
														href={`/studios/edit/${s._id}`}
														className="btn btn-outline btn-sm"
													>
														Update
													</Link>
													<button
														onClick={() =>
															setTarget(s)
														}
														className="btn btn-error btn-outline btn-sm"
														aria-label={`Delete ${s.title}`}
													>
														<FiTrash2 /> Delete
													</button>
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
				open={!!target}
				danger
				busy={busy}
				title="Delete this listing?"
				message={
					target
						? `"${target.title}" will be removed and any open bookings for it will be cancelled. This cannot be undone.`
						: ""
				}
				confirmText="Yes, delete"
				onConfirm={remove}
				onCancel={() => setTarget(null)}
			/>
		</section>
	);
}

export default function Page() {
	return (
		<Protected>
			<MyListings />
		</Protected>
	);
}
