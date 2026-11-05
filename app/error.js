"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({ error, reset }) {
	useEffect(() => {
		console.error("Application error:", error);
	}, [error]);

	return (
		<section className="container-x grid min-h-[70vh] place-items-center py-16">
			<div className="max-w-xl text-center">
				<svg
					viewBox="0 0 320 200"
					className="mx-auto h-52 w-auto"
					role="img"
					aria-label="A broken film clapperboard under a spotlight"
				>
					<defs>
						<linearGradient
							id="error-beam"
							x1="0"
							y1="0"
							x2="0"
							y2="1"
						>
							<stop
								offset="0%"
								stopColor="#FFD23F"
								stopOpacity="0.55"
							/>
							<stop
								offset="100%"
								stopColor="#FFD23F"
								stopOpacity="0"
							/>
						</linearGradient>
					</defs>

					<polygon
						points="140,0 180,0 250,200 70,200"
						fill="url(#error-beam)"
					/>

					<g transform="rotate(-5 160 110)">
						<rect
							x="80"
							y="62"
							width="160"
							height="104"
							rx="10"
							className="fill-neutral"
						/>

						<rect
							x="80"
							y="40"
							width="160"
							height="26"
							rx="6"
							className="fill-primary"
						/>

						{[0, 1, 2, 3, 4].map((i) => (
							<polygon
								key={i}
								points={`${92 + i * 32},40 ${112 + i * 32},40 ${100 + i * 32},66 ${80 + i * 32},66`}
								fill="#FFD23F"
								opacity="0.9"
							/>
						))}

						<text
							x="160"
							y="128"
							textAnchor="middle"
							fontSize="38"
							fontWeight="700"
							fill="#FFD23F"
							fontFamily="sans-serif"
						>
							ERROR
						</text>
					</g>

					<circle
						cx="160"
						cy="18"
						r="9"
						fill="#FFD23F"
					/>
				</svg>

				<h1 className="mt-6 text-4xl font-bold">
					Something went wrong
				</h1>

				<p className="mt-3 text-base-content/70">
					Looks like we encountered an unexpected interruption. The
					production has hit a technical issue, but the show doesn't
					have to end here. Try again or head back to the StudioSpace
					lobby.
				</p>

				<div className="mt-8 flex flex-wrap justify-center gap-3">
					<button
						onClick={reset}
						className="btn btn-primary"
					>
						Try Again
					</button>

					<Link
						href="/"
						className="btn btn-outline"
					>
						Return to Home
					</Link>
				</div>
			</div>
		</section>
	);
}
