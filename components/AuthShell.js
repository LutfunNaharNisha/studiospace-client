import Logo from "components/Logo";

// Shared two-column frame for the Login and Register pages.
export default function AuthShell({ title, subtitle, children, footer }) {
	return (
		<section className="container-x grid min-h-[80vh] items-center gap-10 py-12 lg:grid-cols-2">
			<div className="spotlight relative hidden h-full min-h-[480px] overflow-hidden rounded-3xl bg-neutral p-10 text-neutral-content lg:flex lg:flex-col lg:justify-between">
				<div className="[&_a]:text-neutral-content">
					<Logo />
				</div>
				<div>
					<p className="font-display text-4xl font-bold leading-tight">
						The right room is one booking away.
					</p>
					<p className="mt-4 max-w-sm text-neutral-content/70">
						Reserve photo studios, stages and recording suites, or
						list your own space and start earning.
					</p>
				</div>
				<p className="text-sm text-neutral-content/50">
					Trusted by creators and hosts on StudioSpace
				</p>
			</div>
			<div className="mx-auto w-full max-w-md">
				<h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
				<p className="mt-2 text-base-content/70">{subtitle}</p>
				<div className="mt-8">{children}</div>
				<p className="mt-6 text-center text-sm text-base-content/70">
					{footer}
				</p>
			</div>
		</section>
	);
}
