import type { Metadata } from 'next';

import { SITE_URL, absoluteUrl, siteConfig } from '@/config/site';
import type { SeoProps } from '@/types';

/**
 * Builds a complete `Metadata` object for a page from a few optional fields,
 * filling in Open Graph, Twitter and canonical data from `siteConfig`.
 *
 * ```ts
 * export const metadata = createMetadata({
 *   title: 'Work',
 *   description: 'Selected films and campaigns.',
 *   path: '/work',
 * });
 * ```
 */
export function createMetadata({
  title,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  path = '/',
  noIndex = false,
  keywords,
}: SeoProps = {}): Metadata {
  const resolvedTitle = title
    ? `${title} | ${siteConfig.name}`
    : `${siteConfig.name} — ${siteConfig.tagline}`;

  const url = absoluteUrl(path);
  const ogImage = image.startsWith('http') ? image : absoluteUrl(image);

  return {
    metadataBase: new URL(SITE_URL),
    title: resolvedTitle,
    description,
    keywords: [...siteConfig.keywords, ...(keywords ?? [])],
    applicationName: siteConfig.name,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      url,
      title: resolvedTitle,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: resolvedTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle,
      description,
      images: [ogImage],
      ...(siteConfig.twitterHandle
        ? {
            site: siteConfig.twitterHandle,
            creator: siteConfig.twitterHandle,
          }
        : {}),
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-video-preview': -1,
            'max-snippet': -1,
          },
        },
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? {
          verification: {
            google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
          },
        }
      : {}),
  };
}

/* -------------------------------------------------------------------------- */
/* Structured data                                                             */
/* -------------------------------------------------------------------------- */

/** Organisation schema — render once, in the root layout. */
export function organizationJsonLd() {
  const sameAs = Object.values(siteConfig.social).filter(Boolean);

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    logo: absoluteUrl('/logo.png'),
    ...(sameAs.length > 0 ? { sameAs } : {}),
    ...(siteConfig.contact.email
      ? {
          contactPoint: {
            '@type': 'ContactPoint',
            email: siteConfig.contact.email,
            contactType: 'customer service',
          },
        }
      : {}),
  };
}

/** Website schema — enables the sitelinks search box when search exists. */
export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
