/**
 * Mirrors Tailwind's default breakpoints so JS-driven behaviour (media query
 * hooks, GSAP `matchMedia`) stays in step with the CSS. If a breakpoint is
 * customised in `globals.css`, update it here too.
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

export const MEDIA_QUERY = {
  sm: `(min-width: ${BREAKPOINTS.sm}px)`,
  md: `(min-width: ${BREAKPOINTS.md}px)`,
  lg: `(min-width: ${BREAKPOINTS.lg}px)`,
  xl: `(min-width: ${BREAKPOINTS.xl}px)`,
  '2xl': `(min-width: ${BREAKPOINTS['2xl']}px)`,
  /** Everything below `lg` — the point where the desktop nav collapses. */
  mobile: `(max-width: ${BREAKPOINTS.lg - 1}px)`,
  reducedMotion: '(prefers-reduced-motion: reduce)',
  dark: '(prefers-color-scheme: dark)',
  hover: '(hover: hover) and (pointer: fine)',
  /** Touch-primary input — no wheel, so nothing for Lenis to smooth. */
  touch: '(pointer: coarse)',
} as const;
