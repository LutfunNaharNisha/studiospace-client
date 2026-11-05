/** @type {import('next').NextConfig} */
const API_URL = (process.env.API_URL || 'http://localhost:5000').replace(/\/$/, '');

module.exports = {
  reactStrictMode: true,
  poweredByHeader: false,
  eslint: { ignoreDuringBuilds: true },
  // Proxy the Express API through the Next.js origin so the HTTPOnly JWT cookie is
  // first-party (same domain) on every request - no cross-site cookie problems.
  async rewrites() {
    return [{ source: '/api/server/:path*', destination: `${API_URL}/api/:path*` }];
  },
};
