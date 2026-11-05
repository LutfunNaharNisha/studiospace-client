import Link from 'next/link';
import { FiEye, FiHeart, FiUsers } from 'react-icons/fi';

export const metadata = { title: 'About Us' };

const VALUES = [
  { icon: FiEye, title: 'Clear from the start', text: 'Prices, deposits, gear and house rules are visible before anyone sends a request.' },
  { icon: FiUsers, title: 'Built for both sides', text: 'Hosts keep control of their calendar and creators get reliable, well-described rooms.' },
  { icon: FiHeart, title: 'Made for makers', text: 'We design every feature around photographers, filmmakers, podcasters, musicians and artists.' },
];

export default function About() {
  return (
    <>
      <section className="section bg-base-200/60">
        <div className="container-x max-w-4xl">
          <h1 className="section-title">Great work needs the right room</h1>
          <p className="mt-5 text-lg leading-relaxed text-base-content/80">
            StudioSpace started with a simple frustration: finding a quiet, well-equipped room for a few hours meant endless messages, unclear prices and last-minute surprises. We built a marketplace where studio owners list their spaces once and creators can book them with confidence.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-base-content/80">
            Today the platform covers photo studios, film and sound stages, podcast lounges, music suites and art workshops. Hosts approve every booking, guests see live availability, and reviews come only from people who have used the space.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container-x">
          <h2 className="section-title">What we stand for</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {VALUES.map((v) => (
              <div key={v.title} className="h-full rounded-2xl border border-base-300 bg-base-100 p-6 card-lift">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-2xl text-accent-content"><v.icon /></span>
                <h3 className="mt-4 text-lg font-bold">{v.title}</h3>
                <p className="mt-2 text-sm text-base-content/70">{v.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap gap-3">
            <Link href="/studios" className="btn btn-primary">Find a studio</Link>
            <Link href="/how-it-works" className="btn btn-outline">See how it works</Link>
          </div>
        </div>
      </section>
    </>
  );
}
