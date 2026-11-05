export const CATEGORIES = [
  { value: 'Photo Studio', label: 'Photo Studios', blurb: 'Cyc walls, strobes and styled sets' },
  { value: 'Film & Sound Stage', label: 'Film & Sound Stages', blurb: 'Soundproofed stages for full crews' },
  { value: 'Podcast Lounge', label: 'Podcast Lounges', blurb: 'Treated rooms with broadcast mics' },
  { value: 'Music Suite', label: 'Music Suites', blurb: 'Recording booths and live rooms' },
  { value: 'Art Workshop', label: 'Art Workshops', blurb: 'Mess-friendly rooms for makers' },
];

export const AMENITIES = [
  'Wi-Fi', 'Air Conditioning', 'Parking', 'Green Room', 'Props Library', 'Backdrop Rolls', 'Cyc Wall',
  'Lighting Kit', 'Natural Light', 'Makeup Station', 'Kitchenette', 'Blackout Curtains', 'Soundproofing',
  'Acoustic Treatment', 'Broadcast Mics', 'Mixing Console', 'Instruments', 'Green Screen', '24/7 Access', 'Wheelchair Access',
];

// Start times on the hour, 06:00 - 22:00
export const TIME_SLOTS = Array.from({ length: 17 }, (_, i) => `${String(i + 6).padStart(2, '0')}:00`);

export const STATUS_STYLE = {
  Pending: 'badge-warning',
  Confirmed: 'badge-success',
  Completed: 'badge-info',
  Cancelled: 'badge-error',
};

export const money = (n) => `$${Number(n || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}`;

export const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const toMin = (hhmm) => {
  const [h, m] = String(hhmm).split(':').map(Number);
  return h * 60 + (m || 0);
};

export const prettyDate = (date) =>
  new Date(`${date}T00:00:00`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

export const monthYear = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
