'use client';
import { useState } from 'react';

export default function Avatar({ user, size = 'h-9 w-9' }) {
  const [failed, setFailed] = useState(false);
  const initials = (user?.name || user?.email || '?')
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  if (user?.image && !failed) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={user.image} alt={user.name || 'Profile'} className={`${size} rounded-full object-cover`} onError={() => setFailed(true)} referrerPolicy="no-referrer" />;
  }
  return <span className={`${size} grid place-items-center rounded-full bg-primary text-sm font-bold text-primary-content`}>{initials}</span>;
}
