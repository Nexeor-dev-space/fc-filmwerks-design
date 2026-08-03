import type { Variants } from 'framer-motion';

/**
 * Shared motion vocabulary. Every animation in the app should pull its timing
 * and easing from here so the site feels like one piece rather than a dozen
 * independently tuned components.
 */

/** Cubic-bezier curves, in Framer Motion's array form. */
export const EASE = {
  /** Default UI curve — quick out, soft landing. */
  out: [0.16, 1, 0.3, 1],
  inOut: [0.65, 0, 0.35, 1],
  /** Slight overshoot, good for badges and small reveals. */
  back: [0.34, 1.56, 0.64, 1],
  /** Long, cinematic settle for hero elements. */
  expo: [0.19, 1, 0.22, 1],
} as const;

/** GSAP takes named eases rather than bezier arrays. */
export const GSAP_EASE = {
  out: 'power3.out',
  inOut: 'power2.inOut',
  expo: 'expo.out',
} as const;

export const DURATION = {
  fast: 0.3,
  base: 0.6,
  slow: 0.9,
  slower: 1.4,
} as const;

export const STAGGER = {
  tight: 0.04,
  base: 0.08,
  loose: 0.15,
} as const;

/** Fires a reveal once the element is a third of the way into the viewport. */
export const VIEWPORT = { once: true, amount: 0.3 } as const;

/* -------------------------------------------------------------------------- */
/* Variants                                                                    */
/* -------------------------------------------------------------------------- */

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION.base, ease: EASE.out },
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE.out },
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE.out },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION.base, ease: EASE.out },
  },
};

/** Parent wrapper that cascades its children's `visible` state. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: STAGGER.base,
      delayChildren: 0.1,
    },
  },
};

/** Curtain-style clip reveal, typical for film stills and headlines. */
export const clipReveal: Variants = {
  hidden: { clipPath: 'inset(0 0 100% 0)' },
  visible: {
    clipPath: 'inset(0 0 0% 0)',
    transition: { duration: DURATION.slow, ease: EASE.expo },
  },
};
