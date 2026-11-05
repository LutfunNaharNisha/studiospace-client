import Link from 'next/link';
import { FiCheckCircle, FiClock, FiFilm, FiHeadphones, FiSearch, FiShield, FiTool, FiUserCheck } from 'react-icons/fi';

const STEPS = [
  { icon: FiSearch, title: 'Discover spaces', text: 'Filter by category, price and location to find rooms that fit your shoot, session or class.' },
  { icon: FiClock, title: 'Select shoot hours', text: 'Pick a date, start time and length. Already-booked hours are shown so you never guess.' },
  { icon: FiCheckCircle, title: 'Book instantly', text: 'Send your request with the full price up front. Hosts confirm quickly and you get a PDF invoice.' },
  { icon: FiFilm, title: 'Create and produce', text: 'Show up, set up and make something good. Leave a review so the next creator knows what to expect.' },
];

const GUARANTEES = [
  { icon: FiShield, title: 'Liability protection', text: 'Security deposits are held clearly and refunded when the space is left as found.' },
  { icon: FiUserCheck, title: 'Verified profiles', text: 'Every host and guest signs in with a verified account, and reviews come from real bookings.' },
  { icon: FiTool, title: 'Equipment safety', text: 'Hosts list the gear and rules for each room so heavy equipment is handled properly.' },
  { icon: FiHeadphones, title: '24/7 host support', text: 'A support team is on call around the clock when a session needs a quick fix.' },
];

export function HowBookingWorks() {
  return (
    <section className="section bg-base-200/60">
      <div className="container-x">
        <h2 className="section-title">How booking works</h2>
        <p className="section-sub">From first search to final cut in four steps.</p>
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="relative h-full rounded-2xl border border-base-300 bg-base-100 p-6">
              <span className="absolute -top-3 left-6 rounded-md bg-accent px-2 py-0.5 font-display text-sm font-bold text-accent-content">Step {i + 1}</span>
              <s.icon className="mt-2 h-8 w-8 text-primary" />
              <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-base-content/70">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function HostGuarantee() {
  return (
    <section className="section">
      <div className="container-x">
        <h2 className="section-title">Host guarantee and creator support</h2>
        <p className="section-sub">Whether you are renting a room or renting one out, StudioSpace keeps both sides covered.</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {GUARANTEES.map((g) => (
            <div key={g.title} className="h-full rounded-2xl border border-base-300 bg-base-100 p-6 card-lift">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary text-2xl text-primary-content"><g.icon /></span>
              <h3 className="mt-4 text-lg font-bold">{g.title}</h3>
              <p className="mt-2 text-sm text-base-content/70">{g.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HostCta() {
  return (
    <section className="container-x pb-6">
      <div className="spotlight relative overflow-hidden rounded-3xl bg-neutral px-6 py-14 text-center text-neutral-content sm:px-12">
        <h2 className="mx-auto max-w-2xl text-3xl font-bold sm:text-4xl">Your empty room could be someone's next production.</h2>
        <p className="mx-auto mt-4 max-w-xl text-neutral-content/75">Create a listing in under five minutes. You approve every booking and set your own hours and rates.</p>
        <Link href="/add-studio" className="btn btn-primary btn-lg mt-8">Host Your Space</Link>
      </div>
    </section>
  );
}
