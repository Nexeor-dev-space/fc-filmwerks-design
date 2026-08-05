import type { Metadata, Viewport } from 'next';

import { Providers } from '@/components/providers';
import { JsonLd } from '@/components/seo';
import { siteConfig } from '@/config/site';
import { fontMono, fontSans } from '@/lib/fonts';
import { createMetadata, organizationJsonLd, websiteJsonLd } from '@/lib/seo';

import './globals.css';

/**
 * Base metadata for every route. Pages override it by exporting their own
 * `metadata` built with `createMetadata()`.
 */
export const metadata: Metadata = createMetadata();

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Pinch-zoom stays available — capping it fails WCAG 1.4.4.
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F8F7F4' },
    { media: '(prefers-color-scheme: dark)', color: siteConfig.themeColor },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang={siteConfig.lang}
      className={`${fontSans.variable} ${fontMono.variable}`}
      suppressHydrationWarning
    >
      {/*
        Body stays a plain block. ScrollTrigger cannot add pin spacing inside a
        flex container — it writes a fixed height on the pin spacer instead of
        padding, which silently removes the scroll distance a pinned section
        needs. Column layout belongs to the route layouts, not here.
      */}
      <head />
      <body className="min-h-dvh antialiased">
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
