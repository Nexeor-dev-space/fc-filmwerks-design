import type { NextConfig } from 'next';

/**
 * Headers applied to every route. Tightened where it is safe to do so without
 * knowing the final third-party integrations (analytics, embeds, fonts).
 * Add a Content-Security-Policy here once those are known.
 */
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    formats: ['image/avif', 'image/webp'],
    // Add CDN / CMS hosts here as they are introduced.
    remotePatterns: [],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  experimental: {
    // Tree-shakes barrel imports from icon/animation libraries so a single
    // icon does not pull the whole package into the client bundle.
    optimizePackageImports: ['lucide-react', 'framer-motion', 'gsap'],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      /*
       * Do NOT add a long-lived `immutable` rule for /_next/static here.
       *
       * Next already serves production build output that way, and its
       * filenames are content-hashed so it is safe. In development the dev
       * server reuses one chunk URL while its contents change on every edit —
       * an `immutable` header pins whatever the browser downloaded first, and
       * edits then appear to do nothing until the cache is cleared by hand.
       */
    ];
  },
};

export default nextConfig;
