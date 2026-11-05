'use client';
import { useEffect, useState } from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';

// Challenge 3: light / dark switch that restyles the whole app through DaisyUI's data-theme.
export default function ThemeToggle() {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    setTheme(document.documentElement.getAttribute('data-theme') || 'studiolight');
  }, []);

  const toggle = () => {
    const next = theme === 'studiodark' ? 'studiolight' : 'studiodark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('ss-theme', next);
    } catch (e) {
      /* storage unavailable */
    }
    setTheme(next);
  };

  return (
    <button onClick={toggle} className="btn btn-ghost btn-circle btn-sm text-lg" aria-label={theme === 'studiodark' ? 'Switch to light theme' : 'Switch to dark theme'}>
      {theme === 'studiodark' ? <FiSun /> : <FiMoon />}
    </button>
  );
}
