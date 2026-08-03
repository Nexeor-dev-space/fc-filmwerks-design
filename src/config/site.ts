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
    'FC Filmwerks is a film production studio crafting cinematic stories for brands, artists and screens of every size.',
  tagline: 'Cinematic storytelling, end to end.',
  /** Relative to /public — replace with the real asset before launch. */
  ogImage: '/opengraph-image.png',
  /** Brand navy — must stay in step with `--brand-navy` in globals.css. */
  themeColor: '#0F1C2E',
  keywords: [
    'film production',
    'video production',
    'commercial films',
    'branded content',
    'post production',
    'cinematography',
    'FC Filmwerks',
  ],
  contact: {
    email: 'hello@fcfilmwerks.com',
    phone: '',
    address: '',
  },
  social: {
    instagram: '',
    vimeo: '',
    youtube: '',
    linkedin: '',
  },
  /** Twitter/X handle used for `twitter:site`, including the leading @. */
  twitterHandle: '',
} as const;

export type SiteConfig = typeof siteConfig;

/** Build an absolute URL from a site-relative path. */
export function absoluteUrl(path = '/'): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
