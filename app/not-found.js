import Link from 'next/link';

export const metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <section className="container-x grid min-h-[70vh] place-items-center py-16">
      <div className="max-w-xl text-center">
        <svg viewBox="0 0 320 200" className="mx-auto h-52 w-auto" role="img" aria-label="Clapperboard under a spotlight with no scene">
          <defs>
            <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#FFD23F" stopOpacity="0.55" />
              <stop offset="1" stopColor="#FFD23F" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points="140,0 180,0 250,200 70,200" fill="url(#beam)" />
          <rect x="80" y="62" width="160" height="104" rx="10" className="fill-neutral" />
          <rect x="80" y="40" width="160" height="26" rx="6" className="fill-primary" />
          {[0, 1, 2, 3, 4].map((i) => (
            <polygon key={i} points={`${92 + i * 32},40 ${112 + i * 32},40 ${100 + i * 32},66 ${80 + i * 32},66`} fill="#FFD23F" opacity="0.9" />
          ))}
          <text x="160" y="128" textAnchor="middle" fontSize="38" fontWeight="700" fill="#FFD23F" fontFamily="sans-serif">404</text>
          <circle cx="160" cy="18" r="9" fill="#FFD23F" />
        </svg>
        <h1 className="mt-6 text-4xl font-bold">This scene was cut</h1>
        <p className="mt-3 text-base-content/70">The page you are looking for does not exist, or it moved. Head back to the lobby and pick a studio instead.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary">Return to Home</Link>
          <Link href="/studios" className="btn btn-outline">Explore Studios</Link>
        </div>
      </div>
    </section>
  );
}
