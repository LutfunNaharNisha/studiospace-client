"use client";
import Modal from "components/Modal";
import { api } from "lib/api";
import { money, TIME_SLOTS, todayStr, toMin } from "lib/constants";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FiAlertTriangle } from "react-icons/fi";

const end = (start, hours) => {
	const m = toMin(start) + hours * 60;
	return `${String(Math.floor(m / 60)).padStart(2, "0")}:00`;
};

export default function BookingModal({ studio, open, onClose }) {
	const router = useRouter();
	const [date, setDate] = useState(todayStr());
	const [startTime, setStartTime] = useState("10:00");
	const [hours, setHours] = useState(2);
	const [guests, setGuests] = useState(1);
	const [notes, setNotes] = useState("");
	const [busy, setBusy] = useState([]);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");

	const maxHours = Math.min(12, 24 - parseInt(startTime, 10));
	useEffect(() => {
		if (hours > maxHours) setHours(maxHours);
	}, [maxHours, hours]);

	// Show already-confirmed slots for the chosen date
	useEffect(() => {
		if (!open || !date) return;
		let alive = true;
		api(`/studios/${studio._id}/availability?date=${date}`)
			.then((rows) => alive && setBusy(rows))
			.catch(() => alive && setBusy([]));
		return () => {
			alive = false;
		};
	}, [open, date, studio._id]);

	const clash = useMemo(() => {
		const s = toMin(startTime);
		const e = s + hours * 60;
		return busy.find((b) => b.startMin < e && b.endMin > s);
	}, [busy, startTime, hours]);

	const subtotal = studio.hourlyRate * hours;
	const total = subtotal + (studio.securityDeposit || 0);

	const submit = async (e) => {
		e.preventDefault();
		setError("");
		setSaving(true);
		try {
			await api("/bookings", {
				method: "POST",
				body: {
					studioId: studio._id,
					date,
					startTime,
					hours,
					guests,
					notes,
				},
			});
			toast.success("Booking requested! The host will confirm shortly.");
			onClose();
			router.push("/my-bookings");
		} catch (err) {
			setError(err.message);
			toast.error(err.message);
		} finally {
			setSaving(false);
		}
	};

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={`Book ${studio.title}`}
			wide
		>
			<form
				onSubmit={submit}
				className="space-y-4"
			>
				<div className="grid gap-4 sm:grid-cols-2">
					<div>
						<label
							htmlFor="b-date"
							className="field-label"
						>
							Date
						</label>
						<input
							id="b-date"
							type="date"
							required
							min={todayStr()}
							value={date}
							onChange={(e) => setDate(e.target.value)}
							className="input input-bordered w-full"
						/>
					</div>
					<div>
						<label
							htmlFor="b-start"
							className="field-label"
						>
							Start time
						</label>
						<select
							id="b-start"
							value={startTime}
							onChange={(e) => setStartTime(e.target.value)}
							className="select select-bordered w-full"
						>
							{TIME_SLOTS.map((t) => (
								<option key={t}>{t}</option>
							))}
						</select>
					</div>
					<div>
						<label
							htmlFor="b-hours"
							className="field-label"
						>
							Duration
						</label>
						<select
							id="b-hours"
							value={hours}
							onChange={(e) => setHours(Number(e.target.value))}
							className="select select-bordered w-full"
						>
							{Array.from(
								{ length: maxHours },
								(_, i) => i + 1,
							).map((h) => (
								<option
									key={h}
									value={h}
								>
									{h} {h === 1 ? "hour" : "hours"} (ends{" "}
									{end(startTime, h) === "24:00"
										? "midnight"
										: end(startTime, h)}
									)
								</option>
							))}
						</select>
					</div>
					<div>
						<label
							htmlFor="b-guests"
							className="field-label"
						>
							People (max {studio.capacity})
						</label>
						<input
							id="b-guests"
							type="number"
							min="1"
							max={studio.capacity}
							required
							value={guests}
							onChange={(e) => setGuests(Number(e.target.value))}
							className="input input-bordered w-full"
						/>
					</div>
				</div>

				<div>
					<label
						htmlFor="b-notes"
						className="field-label"
					>
						Notes for the host{" "}
						<span className="font-normal text-base-content/50">
							(optional)
						</span>
					</label>
					<textarea
						id="b-notes"
						rows={2}
						maxLength={500}
						value={notes}
						onChange={(e) => setNotes(e.target.value)}
						className="textarea textarea-bordered w-full"
						placeholder="Equipment you are bringing, load-in time, special requests"
					/>
				</div>

				{busy.length > 0 && (
					<div className="rounded-xl bg-base-200 px-4 py-3 text-sm">
						<p className="font-medium">
							Already booked on this date
						</p>
						<p className="mt-1 text-base-content/70">
							{busy
								.map((b) => `${b.startTime} - ${b.endTime}`)
								.join(", ")}
						</p>
					</div>
				)}
				{(clash || error) && (
					<div
						role="alert"
						className="flex gap-2 rounded-xl border border-error/40 bg-error/10 px-4 py-3 text-sm"
					>
						<FiAlertTriangle className="mt-0.5 shrink-0 text-error" />
						<span>
							{error ||
								`That window overlaps a confirmed booking (${clash.startTime} - ${clash.endTime}). Please choose another time.`}
						</span>
					</div>
				)}

				<dl className="space-y-1.5 rounded-xl border border-base-300 p-4 text-sm">
					<div className="flex justify-between">
						<dt className="text-base-content/70">
							{money(studio.hourlyRate)} x {hours}{" "}
							{hours === 1 ? "hour" : "hours"}
						</dt>
						<dd>{money(subtotal)}</dd>
					</div>
					<div className="flex justify-between">
						<dt className="text-base-content/70">
							Refundable security deposit
						</dt>
						<dd>{money(studio.securityDeposit)}</dd>
					</div>
					<div className="flex justify-between border-t border-base-300 pt-2 text-base font-bold">
						<dt>Total due</dt>
						<dd>{money(total)}</dd>
					</div>
				</dl>

				<div className="flex flex-wrap justify-end gap-2 pt-1">
					<button
						type="button"
						className="btn btn-ghost"
						onClick={onClose}
					>
						Cancel
					</button>
					<button
						className="btn btn-primary"
						disabled={saving || !!clash || !date}
					>
						{saving && (
							<span className="loading loading-spinner loading-sm" />
						)}{" "}
						Request booking
					</button>
				</div>
			</form>
		</Modal>
	);
}
