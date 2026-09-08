'use client';

import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

/**
 * Scroll cue for the intro — a cascading double chevron.
 *
 * Used to be a photographer's focus scale (a dot travelling a track), which
 * read as elegant but asked a first-time visitor to work out what it meant.
 * The client's concern was people not scrolling past the intro at all, so
 * this trades that ambiguity for the one scroll glyph nobody has to parse —
 * a chevron pointing where the content is.
 *
 * Two chevrons rather than one: a single arrow bouncing in place reads as
 * "stuck"; two, animating in sequence a beat apart, read as motion flowing
 * downward — the same idiom as everyone else's "more below" cue.
 *
 * Entirely CSS keyframes — the reduced-motion block in `globals.css`
 * neutralises them together, and nothing here needs a rAF callback.
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
      className={cn('flex flex-col items-center gap-4 md:gap-5', className)}
    >
      {/*
       * The trailing letter-space after the last character would push the
       * word off-centre by half the tracking; the negative margin takes it
       * back.
       */}
      <span className="scroll-cue-label -mr-[0.7em] text-[11px] leading-none font-bold tracking-[0.7em] uppercase sm:text-[21px]">
        {label}
      </span>

      <div aria-hidden="true" className="flex flex-col items-center">
        <Chevron className="scroll-chevron-lead" />
        {/* Trails a beat behind the lead chevron and sits fainter at rest —
            the pair is what reads as one shape flowing down, not two
            separate bounces. */}
        <Chevron className="scroll-chevron-trail -mt-2 opacity-60" />
      </div>
    </div>
  );
});

function Chevron({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 11"
      width="20"
      height="11"
      fill="none"
      className={cn('drop-shadow-[0_0_6px_currentColor]', className)}
    >
      <path
        d="M1.5 1.5L10 9.5L18.5 1.5"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
