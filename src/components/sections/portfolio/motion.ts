import type { Variants } from 'framer-motion';

import { EASE } from '@/constants';

/**
 * The Portfolio page's shared motion vocabulary.
 *
 * Kept local to the archive rather than pulled from the homepage's card
 * motion: this page has a different rhythm — long masked wipes on the stills,
 * short rises on the type — and sharing variants with Featured Work is exactly
 * how the two pages started reading the same.
 *
 * Reduced motion is handled the way it is on the About page: the still branch
 * keeps the opacity fade and zeroes the *duration* of the transform rather
 * than dropping the property. `usePrefersReducedMotion` resolves false on the
 * first render by design, so Framer has already baked the moving `initial`
 * into the DOM by the time the preference settles — a variant that simply
 * omitted `y` would never animate that baked transform away, and the content
 * would sit stranded permanently.
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
  hidden: ({ still }: RiseCue) => ({ opacity: 0, y: still ? 0 : 28 }),
  visible: ({ delay = 0, still }: RiseCue) => ({
    opacity: 1,
    y: 0,
    transition: still
      ? { duration: 0.4, ease: EASE.out, delay, y: { duration: 0 } }
      : { duration: 0.8, ease: EASE.expo, delay },
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
      ? { duration: 0, delay: index * 0.06 }
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

/**
 * A still, wiped open from its left edge.
 *
 * The homepage's cards open from the bottom; the archive opens sideways, which
 * is most of what makes a filtered grid feel like a projector changing slides
 * rather than a second copy of Featured Work.
 */
export const wipeIn: Variants = {
  hidden: ({ still }: RiseCue) => ({
    clipPath: still ? 'inset(0% 0% 0% 0%)' : 'inset(0% 100% 0% 0%)',
  }),
  visible: ({ delay = 0, still }: RiseCue) => ({
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: still
      ? { duration: 0 }
      : { duration: 1.1, ease: EASE.expo, delay },
  }),
};

/** Parent wrapper that cascades its children's `visible` state. */
export const cascade: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

/** The viewport trigger used for body-level blocks across the page. */
export const ENTER = { once: true, amount: 0.35 } as const;

/** A looser one, for tall blocks that would otherwise never reach 0.35. */
export const ENTER_TALL = { once: true, amount: 0.12 } as const;
