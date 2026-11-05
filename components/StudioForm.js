"use client";
import SafeImage from "components/SafeImage";
import { api, uploadToImgbb } from "lib/api";
import { AMENITIES, CATEGORIES } from "lib/constants";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiPlus, FiUploadCloud } from "react-icons/fi";

// One form for both "Add New Studio" and "Update Studio".
export default function StudioForm({ mode = "add", initial, host }) {
	const router = useRouter();
	const [f, setF] = useState({
		title: initial?.title || "",
		category: initial?.category || "",
		hourlyRate: initial?.hourlyRate ?? "",
		securityDeposit: initial?.securityDeposit ?? "",
		capacity: initial?.capacity ?? "",
		location: initial?.location || "",
		image: initial?.image || "",
		gallery: (initial?.gallery || []).join("\n"),
		amenities: initial?.amenities || [],
		overview: initial?.overview || "",
	});
	const [custom, setCustom] = useState("");
	const [uploading, setUploading] = useState(false);
	const [saving, setSaving] = useState(false);
	const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

	const toggle = (a) =>
		setF((s) => ({
			...s,
			amenities: s.amenities.includes(a)
				? s.amenities.filter((x) => x !== a)
				: [...s.amenities, a],
		}));
	const addCustom = () => {
		const v = custom.trim();
		if (!v) return;
		if (!f.amenities.includes(v))
			setF((s) => ({ ...s, amenities: [...s.amenities, v] }));
		setCustom("");
	};
	const options = [...new Set([...AMENITIES, ...f.amenities])];

	const onFile = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setUploading(true);
		try {
			const url = await uploadToImgbb(file);
			setF((s) => ({ ...s, image: url }));
			toast.success("Image uploaded.");
		} catch (err) {
			toast.error(err.message);
		} finally {
			setUploading(false);
			e.target.value = "";
		}
	};

	const submit = async (e) => {
		e.preventDefault();
		setSaving(true);
		const body = {
			...f,
			hourlyRate: Number(f.hourlyRate),
			securityDeposit: Number(f.securityDeposit || 0),
			capacity: Number(f.capacity),
			gallery: f.gallery
				.split("\n")
				.map((s) => s.trim())
				.filter(Boolean),
		};
		try {
			if (mode === "edit")
				await api(`/studios/${initial._id}`, { method: "PUT", body });
			else await api("/studios", { method: "POST", body });
			toast.success(
				mode === "edit"
					? "Studio updated successfully."
					: "Your studio is now listed!",
			);
			router.push("/my-listings");
		} catch (err) {
			toast.error(err.message);
			setSaving(false);
		}
	};

	return (
		<form
			onSubmit={submit}
			className="space-y-8"
		>
			<fieldset className="grid gap-5 rounded-2xl border border-base-300 p-5 sm:grid-cols-2 sm:p-6">
				<legend className="px-2 text-lg font-bold">Basics</legend>
				<div className="sm:col-span-2">
					<label
						htmlFor="title"
						className="field-label"
					>
						Studio title
					</label>
					<input
						id="title"
						required
						minLength={3}
						className="input input-bordered w-full"
						placeholder="e.g. Northlight Cyc Wall Studio"
						value={f.title}
						onChange={set("title")}
					/>
				</div>
				<div>
					<label
						htmlFor="category"
						className="field-label"
					>
						Category
					</label>
					<select
						id="category"
						required
						className="select select-bordered w-full"
						value={f.category}
						onChange={set("category")}
					>
						<option
							value=""
							disabled
						>
							Choose a category
						</option>
						{CATEGORIES.map((c) => (
							<option
								key={c.value}
								value={c.value}
							>
								{c.value}
							</option>
						))}
					</select>
				</div>
				<div>
					<label
						htmlFor="capacity"
						className="field-label"
					>
						Max capacity (people)
					</label>
					<input
						id="capacity"
						type="number"
						required
						min="1"
						className="input input-bordered w-full"
						value={f.capacity}
						onChange={set("capacity")}
					/>
				</div>
				<div>
					<label
						htmlFor="rate"
						className="field-label"
					>
						Hourly rate ($)
					</label>
					<input
						id="rate"
						type="number"
						required
						min="1"
						step="0.5"
						className="input input-bordered w-full"
						value={f.hourlyRate}
						onChange={set("hourlyRate")}
					/>
				</div>
				<div>
					<label
						htmlFor="deposit"
						className="field-label"
					>
						Security deposit ($)
					</label>
					<input
						id="deposit"
						type="number"
						required
						min="0"
						step="0.5"
						className="input input-bordered w-full"
						value={f.securityDeposit}
						onChange={set("securityDeposit")}
					/>
				</div>
				<div className="sm:col-span-2">
					<label
						htmlFor="location"
						className="field-label"
					>
						Location / address
					</label>
					<input
						id="location"
						required
						minLength={5}
						className="input input-bordered w-full"
						placeholder="Street, city"
						value={f.location}
						onChange={set("location")}
					/>
				</div>
			</fieldset>

			<fieldset className="grid gap-5 rounded-2xl border border-base-300 p-5 sm:p-6 md:grid-cols-[1fr_220px]">
				<legend className="px-2 text-lg font-bold">Photos</legend>
				<div className="space-y-4">
					<div>
						<label
							htmlFor="image"
							className="field-label"
						>
							Main image URL
						</label>
						<input
							id="image"
							type="url"
							required
							className="input input-bordered w-full"
							placeholder="https://..."
							value={f.image}
							onChange={set("image")}
						/>
					</div>
					<label
						className={`btn btn-outline btn-sm ${uploading ? "btn-disabled" : ""}`}
					>
						{uploading ? (
							<span className="loading loading-spinner loading-xs" />
						) : (
							<FiUploadCloud />
						)}{" "}
						Upload to imgbb
						<input
							type="file"
							accept="image/*"
							className="hidden"
							onChange={onFile}
						/>
					</label>
					<div>
						<label
							htmlFor="gallery"
							className="field-label"
						>
							Gallery image URLs{" "}
							<span className="font-normal text-base-content/50">
								(one per line, optional)
							</span>
						</label>
						<textarea
							id="gallery"
							rows={3}
							className="textarea textarea-bordered w-full"
							value={f.gallery}
							onChange={set("gallery")}
						/>
					</div>
				</div>
				<SafeImage
					src={f.image}
					alt="Main image preview"
					className="aspect-[4/3] w-full rounded-xl object-cover"
				/>
			</fieldset>

			<fieldset className="rounded-2xl border border-base-300 p-5 sm:p-6">
				<legend className="px-2 text-lg font-bold">Amenities</legend>
				<div className="flex flex-wrap gap-2">
					{options.map((a) => (
						<button
							type="button"
							key={a}
							onClick={() => toggle(a)}
							aria-pressed={f.amenities.includes(a)}
							className={`btn btn-sm ${f.amenities.includes(a) ? "btn-primary" : "btn-outline border-base-300"}`}
						>
							{a}
						</button>
					))}
				</div>
				<div className="mt-4 flex max-w-sm gap-2">
					<input
						aria-label="Add a custom amenity"
						className="input input-bordered input-sm w-full"
						placeholder="Add your own"
						value={custom}
						onChange={(e) => setCustom(e.target.value)}
						onKeyDown={(e) =>
							e.key === "Enter" &&
							(e.preventDefault(), addCustom())
						}
					/>
					<button
						type="button"
						className="btn btn-sm"
						onClick={addCustom}
					>
						<FiPlus /> Add
					</button>
				</div>
			</fieldset>

			<fieldset className="space-y-5 rounded-2xl border border-base-300 p-5 sm:p-6">
				<legend className="px-2 text-lg font-bold">
					Overview and host
				</legend>
				<div>
					<label
						htmlFor="overview"
						className="field-label"
					>
						Detailed overview
					</label>
					<textarea
						id="overview"
						required
						minLength={30}
						rows={5}
						className="textarea textarea-bordered w-full"
						placeholder="Describe the space, the gear included, house rules and who it suits best."
						value={f.overview}
						onChange={set("overview")}
					/>
				</div>
				<div className="grid gap-5 sm:grid-cols-2">
					<div>
						<label
							htmlFor="hn"
							className="field-label"
						>
							Host name
						</label>
						<input
							id="hn"
							readOnly
							className="input input-bordered w-full bg-base-200"
							value={host?.name || ""}
						/>
					</div>
					<div>
						<label
							htmlFor="he"
							className="field-label"
						>
							Host email
						</label>
						<input
							id="he"
							readOnly
							className="input input-bordered w-full bg-base-200"
							value={host?.email || ""}
						/>
					</div>
				</div>
			</fieldset>

			<div className="flex flex-wrap justify-end gap-3">
				<button
					type="button"
					className="btn btn-ghost"
					onClick={() => router.back()}
				>
					Cancel
				</button>
				<button
					className="btn btn-primary"
					disabled={saving}
				>
					{saving && (
						<span className="loading loading-spinner loading-sm" />
					)}{" "}
					{mode === "edit" ? "Save changes" : "List my studio"}
				</button>
			</div>
		</form>
	);
}
