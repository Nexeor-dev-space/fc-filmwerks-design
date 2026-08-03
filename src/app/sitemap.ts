import type { MetadataRoute } from 'next';

import { mainNav, sitemapExclude } from '@/config/navigation';
import { absoluteUrl } from '@/config/site';

/**
 * Generated from the navigation config, so a route added to the header is
 * automatically indexed. Append dynamic entries (case studies, posts) by
 * mapping over the CMS response here.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const routes = ['/', ...mainNav.map((item) => item.href)].filter(
    (href) => !sitemapExclude.includes(href),
  );

  return routes.map((href) => ({
    url: absoluteUrl(href),
    lastModified,
    changeFrequency: href === '/' ? 'weekly' : 'monthly',
    priority: href === '/' ? 1 : 0.8,
  }));
}
