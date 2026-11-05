import { money, prettyDate } from "lib/constants";

// Optional feature: downloadable PDF receipt for confirmed / completed bookings.
export async function downloadInvoice(b) {
	const { jsPDF } = await import("jspdf");
	const doc = new jsPDF();
	const ref = String(b._id).slice(-8).toUpperCase();

	doc.setFillColor(10, 126, 122);
	doc.rect(0, 0, 210, 34, "F");
	doc.setTextColor(255, 255, 255);
	doc.setFontSize(22);
	doc.text("StudioSpace", 14, 21);
	doc.setFontSize(11);
	doc.text("Booking invoice", 196, 21, { align: "right" });

	doc.setTextColor(30, 30, 30);
	doc.setFontSize(11);
	const rows = [
		["Invoice no.", `SS-${ref}`],
		["Status", b.status],
		["Guest", `${b.guestName} (${b.guestEmail})`],
		["Host", `${b.hostName} (${b.hostEmail})`],
		["Studio", b.studioTitle],
		["Address", b.studioLocation],
		["Date", prettyDate(b.date)],
		["Time", `${b.startTime} - ${b.endTime} (${b.hours} hr)`],
		["Guests", String(b.guests)],
	];
	let y = 52;
	rows.forEach(([k, v]) => {
		doc.setFont(undefined, "bold");
		doc.text(k, 14, y);
		doc.setFont(undefined, "normal");
		doc.text(doc.splitTextToSize(String(v), 130), 62, y);
		y += 9;
	});

	y += 6;
	doc.setDrawColor(200);
	doc.line(14, y, 196, y);
	y += 10;
	const money_rows = [
		[
			`Studio time (${b.hours} hr x ${money(b.hourlyRate)})`,
			money(b.subtotal),
		],
		["Refundable security deposit", money(b.securityDeposit)],
	];
	money_rows.forEach(([k, v]) => {
		doc.text(k, 14, y);
		doc.text(v, 196, y, { align: "right" });
		y += 9;
	});
	doc.setFont(undefined, "bold");
	doc.setFontSize(13);
	doc.text("Total", 14, y + 4);
	doc.text(money(b.total), 196, y + 4, { align: "right" });

	doc.setFont(undefined, "normal");
	doc.setFontSize(9);
	doc.setTextColor(120);
	doc.text(
		"Thank you for booking with StudioSpace. The security deposit is returned after the session if the space is left as found.",
		14,
		280,
	);
	doc.save(`StudioSpace-Invoice-${ref}.pdf`);
}
