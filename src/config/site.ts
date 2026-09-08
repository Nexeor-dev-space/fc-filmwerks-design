/**
 * Single source of truth for brand-level copy, URLs and contact details.
 * Anything that appears in more than one place (metadata, footer, JSON-LD,
 * sitemap) should be read from here rather than hard-coded in a component.
 */

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

/** Origin without a trailing slash, safe to concatenate paths onto. */
export const SITE_URL = rawSiteUrl.replace(/\/+$/, '');

export const siteConfig = {
  name: 'FC Filmwerks',
  shortName: 'FC Filmwerks',
  url: SITE_URL,
  locale: 'en_US',
  lang: 'en',
  description:
    'FC Filmwerks is a Dubai film studio bringing humane, emotional storytelling to every frame: corporate and commemorative films, documentaries and original cinema, led by an award-winning director.',
  tagline: 'Humane, emotional storytelling.',
  /** Relative to /public — replace with the real asset before launch. */
  ogImage: '/opengraph-image.png',
  /** Brand navy — must stay in step with `--brand-navy` in globals.css. */
  themeColor: '#0F1C2E',
  keywords: [
    'film production',
    'video production',
    'corporate films',
    'commemorative films',
    'documentary production',
    'original films',
    'branded content',
    'post production',
    'cinematography',
    'Dubai film studio',
    'Blue Lily',
    'Gautam Raveendran',
    'FC Filmwerks',
  ],
  /** Founding facts, read by the Organisation schema and the About page. */
  founded: '2025',
  founder: 'Gautam Raveendran',
  contact: {
    email: 'letstalk@fcfilmwerks.com',
    phone: '+971 54 321 6347',
    address: 'Dubai, UAE',
  },
  social: {
    instagram: 'https://www.instagram.com/fcfilmwerks',
    facebook: 'https://www.facebook.com/fcfilmwerks',
    vimeo: '',
    linkedin: 'https://ae.linkedin.com/company/fcfilmwerks-llc',
  },
  /** Twitter/X handle used for `twitter:site`, including the leading @. */
  twitterHandle: '',
} as const;

export type SiteConfig = typeof siteConfig;

/** Build an absolute URL from a site-relative path. */
export function absoluteUrl(path = '/'): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
