'use client';

import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

/**
 * Minimal scroll cue: a label over a hairline track with a travelling dot.
 * The dot is animated by `IntroExperience` so its rhythm matches the lens.
 */
export const ScrollIndicator = forwardRef<
  HTMLDivElement,
  { className?: string; label?: string }
>(function ScrollIndicator({ className, label = 'Scroll' }, ref) {
  return (
    <div
      ref={ref}
      className={cn('flex flex-col items-center gap-4', className)}
    >
      {/* Colour is inherited, so the caller sets it to suit whatever the cue
          sits on — the intro background is not always the same shade. */}
      <span className="text-[0.625rem] tracking-[0.4em] uppercase opacity-70">
        {label}
      </span>

      <span
        aria-hidden="true"
        className="relative block h-14 w-px overflow-hidden bg-current/20"
      >
        <span className="scroll-dot absolute top-0 left-0 block h-5 w-px bg-current" />
      </span>
    </div>
  );
});
