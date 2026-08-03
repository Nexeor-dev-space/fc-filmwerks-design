import type { MetadataRoute } from 'next';

import { SITE_URL, absoluteUrl } from '@/config/site';

/**
 * Non-production deployments are blocked entirely so preview URLs never get
 * indexed alongside the live site.
 */
export default function robots(): MetadataRoute.Robots {
  const isProduction =
    process.env.NODE_ENV === 'production' && !SITE_URL.includes('localhost');

  if (!isProduction) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
    sitemap: absoluteUrl('/sitemap.xml'),
    host: SITE_URL,
  };
}
