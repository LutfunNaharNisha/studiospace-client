import Link from 'next/link';
import { FiCalendar, FiCamera, FiCheckCircle, FiCreditCard, FiEdit3, FiSearch } from 'react-icons/fi';

export const metadata = { title: 'How It Works' };

const GUEST = [
  { icon: FiSearch, title: 'Search and compare', text: 'Browse by category, price and rating. Every listing shows gear, rules, capacity and reviews from past guests.' },
  { icon: FiCalendar, title: 'Pick your hours', text: 'Choose a date, a start time and a length. Confirmed bookings are blocked out automatically, so you only see what is free.' },
  { icon: FiCreditCard, title: 'Request and confirm', text: 'You see the full price, including the refundable deposit, before sending the request. The host confirms and your invoice is ready to download.' },
  { icon: FiCamera, title: 'Create, then review', text: 'Make your thing. Afterwards, leave a review so the next creator knows what to expect.' },
];
const HOST = [
  { icon: FiEdit3, title: 'List your space', text: 'Add photos, amenities, your hourly rate and a deposit. A good listing takes about five minutes.' },
  { icon: FiCheckCircle, title: 'Approve requests', text: 'Review each request from your dashboard and confirm only the sessions that suit you. Overlapping slots are blocked for you.' },
];
const FAQ = [
  ['When am I charged?', 'Creators only see the total when they request a slot. Nothing is confirmed until the host approves the booking.'],
  ['What is the security deposit?', 'A refundable amount set by each host. It is returned after the session when the space is left as found.'],
  ['Can I cancel a booking?', 'Yes. You can cancel any pending request from My Bookings. Once a host has confirmed, contact them through the dashboard to reschedule.'],
  ['How are double bookings prevented?', 'When a host confirms a booking, that time window is locked. New requests that overlap it are rejected with a clear message.'],
];

function Steps({ items }) {
  return (
    <ol className="mt-8 grid gap-5 sm:grid-cols-2">
      {items.map((s, i) => (
        <li key={s.title} className="flex h-full gap-4 rounded-2xl border border-base-300 bg-base-100 p-6">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary text-2xl text-primary-content"><s.icon /></span>
          <div>
            <h3 className="text-lg font-bold">{i + 1}. {s.title}</h3>
            <p className="mt-1.5 text-sm text-base-content/70">{s.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function HowItWorks() {
  return (
    <>
      <section className="section bg-base-200/60">
        <div className="container-x">
          <h1 className="section-title">How StudioSpace works</h1>
          <p className="section-sub">Whether you need a room for the afternoon or want to earn from yours, the process is short and transparent.</p>
          <h2 className="mt-12 text-2xl font-bold">For creators</h2>
          <Steps items={GUEST} />
          <h2 className="mt-14 text-2xl font-bold">For hosts</h2>
          <Steps items={HOST} />
        </div>
      </section>
      <section className="section">
        <div className="container-x max-w-3xl">
          <h2 className="section-title">Frequently asked questions</h2>
          <div className="mt-8 space-y-3">
            {FAQ.map(([q, a], i) => (
              <div key={q} className="collapse collapse-arrow border border-base-300 bg-base-100">
                <input type="radio" name="faq" defaultChecked={i === 0} aria-label={q} />
                <div className="collapse-title font-semibold">{q}</div>
                <div className="collapse-content text-sm text-base-content/75"><p>{a}</p></div>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/studios" className="btn btn-primary">Explore Studios</Link>
            <Link href="/add-studio" className="btn btn-outline">Host Your Space</Link>
          </div>
        </div>
      </section>
    </>
  );
}
