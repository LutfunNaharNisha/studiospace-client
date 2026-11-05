import CategoryGrid from "components/CategoryGrid";
import FeaturedStudios from "components/FeaturedStudios";
import HeroSlider from "components/HeroSlider";
import {
	HostCta,
	HostGuarantee,
	HowBookingWorks,
} from "components/HomeSections";

export default function Home() {
	return (
		<>
			<HeroSlider />
			<section className="section">
				<div className="container-x">
					<h2 className="section-title">Browse by studio category</h2>
					<p className="section-sub">
						Pick the kind of space you need and we will show every
						available room.
					</p>
					<CategoryGrid />
				</div>
			</section>
			<section className="section bg-base-200/60">
				<div className="container-x">
					<h2 className="section-title">Featured studios</h2>
					<p className="section-sub">
						Top-rated and newest rooms, straight from our hosts.
					</p>
					<FeaturedStudios />
				</div>
			</section>
			<HowBookingWorks />
			<HostGuarantee />
			<HostCta />
		</>
	);
}
