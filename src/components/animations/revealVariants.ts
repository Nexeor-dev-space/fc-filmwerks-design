import type { Variants } from 'framer-motion';

import { EASE } from '@/constants';

/**
 * The editorial reveal vocabulary, shared by the long-form pages.
 *
 * Every reveal on the About page and the project case studies is one of the
 * four below, so a reader moving between them stays in one piece of software
 * rather than meeting a second animation style. Timings come from `EASE` in
 * `src/constants/animations.ts`; only the choice of which curve goes where is
 * decided here.
 *
 * Reduced motion is handled the same way throughout: the still branch keeps the
 * opacity fade and zeroes the *duration* of the transform rather than dropping
 * the property. `usePrefersReducedMotion` resolves false on the first render by
 * design, so Framer has already baked the moving `initial` into the DOM by the
 * time the preference settles — a variant that simply omitted `y` would never
 * animate that baked transform away, and the content would sit stranded below
 * its mask permanently. The About page had four sections' worth of that bug
 * before this was written down.
 */

/** Passed through `custom` on anything that fades and rises. */
export interface RiseCue {
  /** Seconds of delay before this element starts. */
  delay?: number;
  /** True when the visitor has asked for reduced motion. */
  still: boolean;
}

/** Passed through `custom` on masked lines, which stagger by index. */
export interface LineCue {
  index: number;
  still: boolean;
}

export const rise: Variants = {
  hidden: ({ still }: RiseCue) => ({ opacity: 0, y: still ? 0 : 32 }),
  visible: ({ delay = 0, still }: RiseCue) => ({
    opacity: 1,
    y: 0,
    transition: still
      ? { duration: 0.4, ease: EASE.out, delay, y: { duration: 0 } }
      : { duration: 0.85, ease: EASE.expo, delay },
  }),
};

/**
 * Line-by-line mask reveal for display headings. The parent sets
 * `overflow-hidden` on each line box; this moves the inner span up into it.
 */
export const lineReveal: Variants = {
  hidden: ({ still }: LineCue) => ({ y: still ? '0%' : '110%' }),
  visible: ({ index, still }: LineCue) => ({
    y: '0%',
    transition: still
      ? { duration: 0, delay: index * 0.07 }
      : { duration: 1.05, ease: EASE.expo, delay: 0.08 + index * 0.09 },
  }),
};

/**
 * Hairlines wipe in from the left rather than growing from the middle.
 * `scaleX` from `origin-left` keeps the whole thing on the compositor.
 */
export const drawRule: Variants = {
  hidden: ({ still }: RiseCue) => ({ scaleX: still ? 1 : 0 }),
  visible: ({ delay = 0, still }: RiseCue) => ({
    scaleX: 1,
    transition: still
      ? { duration: 0 }
      : { duration: 1.1, ease: EASE.expo, delay },
  }),
};

/** Parent wrapper that cascades its children's `visible` state. */
export const cascade: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

/** The viewport trigger used for body-level blocks across the page. */
export const ENTER = { once: true, amount: 0.35 } as const;

/** A looser one, for tall blocks that would otherwise never reach 0.35. */
export const ENTER_TALL = { once: true, amount: 0.15 } as const;
