import jwt from "jsonwebtoken";
import { auth } from "lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COOKIE = "ss_token";
const WEEK = 60 * 60 * 24 * 7;

// Challenge 1: exchange a verified BetterAuth session for a signed JWT that is stored
// in an HTTPOnly cookie. JavaScript in the browser can never read it; the Express API
// verifies it on every mutation and answers 401 when it is missing or invalid.
export async function POST() {
	const session = await auth.api.getSession({ headers: headers() });
	if (!session?.user) {
		return NextResponse.json(
			{ message: "You are not signed in." },
			{ status: 401 },
		);
	}
	const { id, email, name, image } = session.user;
	const token = jwt.sign(
		{ id, email, name, image: image || "" },
		process.env.JWT_SECRET,
		{ expiresIn: "7d" },
	);
	const res = NextResponse.json({ ok: true });
	res.cookies.set(COOKIE, token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
		maxAge: WEEK,
	});
	return res;
}

export async function DELETE() {
	const res = NextResponse.json({ ok: true });
	res.cookies.set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
	return res;
}
