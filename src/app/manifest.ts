import type { MetadataRoute } from 'next';

import { siteConfig } from '@/config/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: '/',
    display: 'standalone',
    background_color: siteConfig.themeColor,
    theme_color: siteConfig.themeColor,
    /*
     * The studio's monogram. The 192 is the supplied artwork at its native
     * size; the 512 is upscaled from it, which is what Android's install
     * prompt and the splash screen want. Both are `maskable` as well as
     * `any`: the mark is a circle on a light ground with room around it, so a
     * launcher can crop it to whatever shape it likes without clipping.
     *
     * The browser tab icon is separate and lives at `src/app/icon.png`, with
     * `favicon.ico` and `apple-icon.png` beside it — Next writes the link tags
     * for those from the filenames alone.
     */
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
