import type { NavItem, NavSection } from '@/types';

/**
 * Routes listed here drive the header, the mobile menu and the sitemap, so a
 * page only needs to be registered once. Keep `href` values in sync with the
 * folders under `src/app/(site)`.
 */
export const mainNav: NavItem[] = [
  { label: 'Work', href: '/work' },
  { label: 'Services', href: '/services' },
  { label: 'Studio', href: '/studio' },
  { label: 'Contact', href: '/contact' },
];

export const footerNav: NavSection[] = [
  {
    title: 'Explore',
    items: [
      { label: 'Work', href: '/work' },
      { label: 'Services', href: '/services' },
      { label: 'Studio', href: '/studio' },
    ],
  },
  {
    title: 'Company',
    items: [
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  },
];

/** Routes that should be excluded from the generated sitemap. */
export const sitemapExclude: string[] = [];
