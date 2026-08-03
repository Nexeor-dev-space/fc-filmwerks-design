'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { usePrefersReducedMotion } from '@/hooks';
import { cn } from '@/lib/utils';

/** Slow, deliberate settle — no linear motion, nothing snappy. */
const EASE = [0.16, 1, 0.3, 1] as const;

interface RotatingWordProps {
  /** Cycled through in order, one word visible at a time. */
  words: string[];
  /** Milliseconds each word holds before the next slides in. */
  cycleMs?: number;
  /** Seconds the slide/fade transition itself takes. */
  transitionSeconds?: number;
  className?: string;
}

/**
 * A single word that cycles through `words`, sliding upward and
 * cross-fading in place — used for the hero's "CREATIVE MEDIA {word}"
 * headline, but deliberately unstyled beyond structure.
 *
 * Font size, weight, tracking and colour are not set here — they inherit
 * from wherever this is placed, so the identical primitive works dropped
 * into a small badge or, as here, as the second line of an `<h1>`.
 *
 * Width and height come from an invisible copy of the longest word in
 * `words`, stacked beneath the visible (absolutely positioned) one — sizing
 * the box from the *visible* word would shift whatever sits beside it every
 * cycle.
 */
export function RotatingWord({
  words,
  cycleMs = 2500,
  transitionSeconds = 0.6,
  className,
}: RotatingWordProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion || words.length < 2) return;

    const id = setInterval(() => {
      setIndex((current) => (current + 1) % words.length);
    }, cycleMs);

    return () => clearInterval(id);
  }, [reducedMotion, words.length, cycleMs]);

  if (reducedMotion) {
    return (
      <span className={cn('whitespace-nowrap', className)}>{words[0]}</span>
    );
  }

  const longestWord = words.reduce((a, b) => (b.length > a.length ? b : a));

  return (
    <span
      className={cn(
        'relative inline-block overflow-hidden align-baseline whitespace-nowrap',
        className,
      )}
    >
      {/* Invisible sizer: reserves the longest word's box so the visible word
          swapping in and out never resizes it. */}
      <span aria-hidden="true" className="invisible">
        {longestWord}
      </span>

      <AnimatePresence>
        <motion.span
          key={words[index]}
          className="absolute inset-0"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: transitionSeconds, ease: EASE }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
