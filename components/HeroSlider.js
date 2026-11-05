'use client';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

const u = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1920&q=80`;

const SLIDES = [
  {
    image: u('photo-1516035069371-29a1b244cc32'),
    title: 'Find the room where your next frame happens.',
    text: 'Book photo studios, sound stages, podcast lounges and music suites by the hour. Verified hosts, transparent pricing, no back-and-forth.',
  },
  {
    image: u('photo-1598488035139-bdbb2231ce04'),
    title: 'Record, mix and release in a room built for sound.',
    text: 'Treated control rooms, isolation booths and backline gear are ready when you arrive. Check live availability and request your slot in seconds.',
  },
  {
    image: u('photo-1513364776144-60967b0f800f'),
    title: 'Own a space creators would love? Put it to work.',
    text: 'List your cyc wall, workshop or recording booth in minutes. You set the rate, approve every request and keep control of your calendar.',
  },
];

export default function HeroSlider() {
  return (
    <section aria-label="Featured spaces" className="relative bg-neutral">
      <h1 className="sr-only">StudioSpace - peer-to-peer creative studio rentals</h1>
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        loop
        speed={900}
        autoplay={{ delay: 5800, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className="h-[78vh] min-h-[540px]"
      >
        {SLIDES.map((s, i) => (
          <SwiperSlide key={s.title}>
            <div className="relative h-full w-full bg-gradient-to-br from-neutral to-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.image} alt="" className="absolute inset-0 h-full w-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} {...(i === 0 ? { fetchPriority: 'high' } : { loading: 'lazy' })} />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/10" />
              <div className="spotlight absolute inset-0" />
              <div className="container-x relative flex h-full items-center">
                <div className="max-w-2xl pb-8 text-white">
                  <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-medium backdrop-blur">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-error" /> Live availability, instant requests
                  </p>
                  <h2 className="font-display text-4xl font-extrabold leading-[1.05] sm:text-6xl">{s.title}</h2>
                  <p className="mt-5 max-w-xl text-lg text-white/80">{s.text}</p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link href="/studios" className="btn btn-primary btn-lg">Explore Studios</Link>
                    <Link href="/add-studio" className="btn btn-lg border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white hover:text-black">Host Your Space</Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
