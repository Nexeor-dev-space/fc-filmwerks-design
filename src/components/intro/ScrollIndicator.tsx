'use client';

import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

/**
 * Scroll cue for the intro — a focus scale rather than an arrow.
 *
 * Entirely CSS keyframes: three independent loops on three separate elements,
 * so nothing shares a `transform` and the compositor owns all of it without a
 * single rAF callback. The reduced-motion block in `globals.css` neutralises
 * them together.
 *
 * Colour is inherited so the caller can seat it against whatever it sits on;
 * only the opacities are fixed here.
 *
 * Fading out on scroll is deliberately not handled in this component — the
 * intro's scrubbed timeline already drives `.intro-indicator`, so the cue
 * tracks the scroll position exactly and comes back on its own when the
 * visitor returns to the top.
 */
export const ScrollIndicator = forwardRef<
  HTMLDivElement,
  { className?: string; label?: string }
>(function ScrollIndicator({ className, label = 'Scroll to explore' }, ref) {
  return (
    <div
      ref={ref}
      className={cn('flex flex-col items-center gap-5 md:gap-6', className)}
    >
      {/*
       * The trailing letter-space after the last character would push the
       * word off-centre by half the tracking; the negative margin takes it
       * back.
       */}
      <span className="scroll-cue-label -mr-[0.7em] text-[0.625rem] leading-none font-light tracking-[0.7em] uppercase md:text-[0.6875rem]">
        {label}
      </span>

      {/*
       * The track length rides a custom property because the dot's keyframes
       * have to travel exactly its height — a percentage `translateY` would
       * resolve against the dot's own 5px instead of the track's.
       */}
      <span
        aria-hidden="true"
        className="relative block h-[var(--cue-track)] w-px [--cue-track:80px] md:[--cue-track:104px]"
      >
        {/* The line itself, breathing a couple of pixels from its top anchor. */}
        <span className="scroll-cue-track absolute inset-0 block origin-top bg-current/25" />

        {/* Exposure-meter ticks — the one piece of film-instrument language in
            here, and what makes this read as a focus scale rather than a
            progress bar. */}
        <span className="absolute -top-px -left-[3px] block h-px w-[7px] bg-current/40" />
        <span className="absolute -bottom-px -left-[3px] block h-px w-[7px] bg-current/40" />

        {/* Centred by margin, never by transform: the travel animation owns
            this element's transform outright. */}
        <span className="scroll-cue-dot absolute top-0 left-1/2 -ml-[2.5px] block size-[5px] rounded-full bg-current shadow-[0_0_8px_currentColor]" />
      </span>
    </div>
  );
});
