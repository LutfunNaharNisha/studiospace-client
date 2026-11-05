/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Instrument Sans Variable"', 'system-ui', 'sans-serif'],
        display: ['"Bricolage Grotesque Variable"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    logs: false,
    themes: [
      {
        // Cyc-wall white, ink, studio teal and gaffer-tape yellow
        studiolight: {
          primary: '#0A7E7A', 'primary-content': '#FFFFFF',
          secondary: '#14181F', 'secondary-content': '#F5F7F6',
          accent: '#FFD23F', 'accent-content': '#2A2100',
          neutral: '#14181F', 'neutral-content': '#F5F7F6',
          'base-100': '#F5F7F6', 'base-200': '#E9EEEE', 'base-300': '#D4DCDC', 'base-content': '#121821',
          info: '#0284C7', success: '#16A34A', warning: '#D97706', error: '#DC2626',
          '--rounded-box': '1rem', '--rounded-btn': '0.75rem', '--rounded-badge': '9999px',
        },
        studiodark: {
          primary: '#2FD0C3', 'primary-content': '#04201F',
          secondary: '#E9EEEE', 'secondary-content': '#0C1116',
          accent: '#FFD23F', 'accent-content': '#2A2100',
          neutral: '#1E2832', 'neutral-content': '#E9EEEE',
          'base-100': '#0C1116', 'base-200': '#131A21', 'base-300': '#1F2933', 'base-content': '#E6ECEC',
          info: '#38BDF8', success: '#4ADE80', warning: '#FBBF24', error: '#F87171',
          '--rounded-box': '1rem', '--rounded-btn': '0.75rem', '--rounded-badge': '9999px',
        },
      },
    ],
  },
};
