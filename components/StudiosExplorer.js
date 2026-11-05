"use client";
import EmptyState from "components/EmptyState";
import { GridSkeleton } from "components/Skeletons";
import StudioCard from "components/StudioCard";
import { api } from "lib/api";
import { CATEGORIES } from "lib/constants";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";

const SORTS = [
	["newest", "Newest first"],
	["rating", "Top rated"],
	["price-asc", "Price: low to high"],
	["price-desc", "Price: high to low"],
];
const MAX = 300;

export default function StudiosExplorer() {
	const router = useRouter();
	const params = useSearchParams();
	const [category, setCategory] = useState(params.get("category") || "all");
	const [search, setSearch] = useState(params.get("search") || "");
	const [debounced, setDebounced] = useState(search);
	const [sort, setSort] = useState("newest");
	const [maxPrice, setMaxPrice] = useState(MAX);
	const [page, setPage] = useState(1);
	const [state, setState] = useState({
		loading: true,
		items: [],
		total: 0,
		pages: 1,
		error: "",
	});

	// Keep the category in sync with the URL (home page category cards and footer links).
	useEffect(() => {
		setCategory(params.get("category") || "all");
	}, [params]);

	useEffect(() => {
		const t = setTimeout(() => setDebounced(search), 400);
		return () => clearTimeout(t);
	}, [search]);

	useEffect(() => setPage(1), [debounced, category, sort, maxPrice]);

	useEffect(() => {
		let alive = true;
		setState((s) => ({ ...s, loading: true, error: "" }));
		const qs = new URLSearchParams({ page, limit: 9, sort });
		if (debounced.trim()) qs.set("search", debounced.trim());
		if (category !== "all") qs.set("category", category);
		if (maxPrice < MAX) qs.set("maxPrice", maxPrice);
		api(`/studios?${qs}`)
			.then(
				(d) =>
					alive &&
					setState({
						loading: false,
						items: d.items,
						total: d.total,
						pages: d.pages,
						error: "",
					}),
			)
			.catch(
				(e) =>
					alive &&
					setState((s) => ({
						...s,
						loading: false,
						error: e.message,
					})),
			);
		return () => {
			alive = false;
		};
	}, [page, debounced, category, sort, maxPrice]);

	const pickCategory = (value) => {
		setCategory(value);
		router.replace(
			value === "all"
				? "/studios"
				: `/studios?category=${encodeURIComponent(value)}`,
			{ scroll: false },
		);
	};
	const reset = () => {
		setSearch("");
		setSort("newest");
		setMaxPrice(MAX);
		pickCategory("all");
	};
	const filtered = category !== "all" || debounced || maxPrice < MAX;

	return (
		<div className="mt-8">
			<div className="rounded-2xl border border-base-300 bg-base-100 p-4 sm:p-5">
				<div className="grid gap-4 md:grid-cols-[1fr_auto_auto] md:items-end">
					<div>
						<label
							htmlFor="q"
							className="field-label"
						>
							Search
						</label>
						<div className="relative">
							<FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/50" />
							<input
								id="q"
								className="input input-bordered w-full pl-10"
								placeholder="Studio name, city or amenity"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
						</div>
					</div>
					<div>
						<label
							htmlFor="max"
							className="field-label"
						>
							{maxPrice < MAX
								? `Up to $${maxPrice} / hr`
								: "Any price per hour"}
						</label>
						<input
							id="max"
							type="range"
							min="20"
							max={MAX}
							step="10"
							value={maxPrice}
							onChange={(e) =>
								setMaxPrice(Number(e.target.value))
							}
							className="range range-primary range-sm w-full md:w-48"
						/>
					</div>
					<div>
						<label
							htmlFor="sort"
							className="field-label"
						>
							Sort by
						</label>
						<select
							id="sort"
							className="select select-bordered w-full md:w-48"
							value={sort}
							onChange={(e) => setSort(e.target.value)}
						>
							{SORTS.map(([v, l]) => (
								<option
									key={v}
									value={v}
								>
									{l}
								</option>
							))}
						</select>
					</div>
				</div>
				<div
					className="mt-4 flex flex-wrap gap-2"
					role="group"
					aria-label="Filter by category"
				>
					{[{ value: "all", label: "All spaces" }, ...CATEGORIES].map(
						(c) => (
							<button
								key={c.value}
								onClick={() => pickCategory(c.value)}
								aria-pressed={category === c.value}
								className={`btn btn-sm ${category === c.value ? "btn-primary" : "btn-outline border-base-300"}`}
							>
								{c.label}
							</button>
						),
					)}
				</div>
			</div>

			<div className="mt-6 flex items-center justify-between text-sm text-base-content/70">
				<p aria-live="polite">
					{state.loading
						? "Searching..."
						: `${state.total} ${state.total === 1 ? "studio" : "studios"} found`}
				</p>
				{filtered && (
					<button
						onClick={reset}
						className="flex items-center gap-1 font-medium text-primary hover:underline"
					>
						<FiX /> Clear filters
					</button>
				)}
			</div>

			<div className="mt-4">
				{state.loading ? (
					<GridSkeleton count={6} />
				) : state.error ? (
					<div className="mx-auto max-w-md rounded-2xl border border-error/30 bg-error/10 p-6 text-center">
						<p className="font-medium">
							We could not load studios right now.
						</p>
						<p className="mt-1 text-sm text-base-content/70">
							{state.error}
						</p>
					</div>
				) : state.items.length === 0 ? (
					<div className="py-8">
						<EmptyState
							icon={FiSearch}
							title="No studios match your search"
							text="Try a different keyword, raise the price limit or clear your filters."
						/>
						<div className="mt-4 text-center">
							<button
								onClick={reset}
								className="btn btn-primary btn-sm"
							>
								Clear filters
							</button>
						</div>
					</div>
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
						{state.pages > 1 && (
							<div className="join mt-10 flex justify-center">
								<button
									className="btn join-item btn-sm"
									disabled={page === 1}
									onClick={() => setPage(page - 1)}
								>
									Previous
								</button>
								{Array.from({ length: state.pages }).map(
									(_, i) => (
										<button
											key={i}
											onClick={() => setPage(i + 1)}
											className={`btn join-item btn-sm ${page === i + 1 ? "btn-primary" : ""}`}
											aria-current={
												page === i + 1
													? "page"
													: undefined
											}
										>
											{i + 1}
										</button>
									),
								)}
								<button
									className="btn join-item btn-sm"
									disabled={page === state.pages}
									onClick={() => setPage(page + 1)}
								>
									Next
								</button>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
}
