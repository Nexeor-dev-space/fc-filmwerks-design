import { Geist, Geist_Mono } from 'next/font/google';

/**
 * Fonts are loaded once here and exposed as CSS variables, which `globals.css`
 * maps onto Tailwind's `--font-*` theme tokens. `display: 'swap'` keeps text
 * visible during font load rather than blocking first paint.
 */

export const fontSans = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

export const fontMono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
});

/**
 * Add the brand display face here when it is chosen, e.g.
 *
 * export const fontDisplay = localFont({
 *   src: '../../public/fonts/brand-display.woff2',
 *   variable: '--font-display',
 *   display: 'swap',
 * });
 */

export const fontVariables = [fontSans.variable, fontMono.variable].join(' ');
