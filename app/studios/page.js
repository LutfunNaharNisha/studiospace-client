import { GridSkeleton } from "components/Skeletons";
import StudiosExplorer from "components/StudiosExplorer";
import { Suspense } from "react";

export const metadata = { title: "Explore Studios" };

export default function StudiosPage() {
	return (
		<section className="section">
			<div className="container-x">
				<h1 className="section-title">Explore studios</h1>
				<p className="section-sub">
					Search every space on StudioSpace, then narrow it down by
					category, price and rating.
				</p>
				<Suspense
					fallback={
						<div className="mt-8">
							<GridSkeleton count={6} />
						</div>
					}
				>
					<StudiosExplorer />
				</Suspense>
			</div>
		</section>
	);
}
