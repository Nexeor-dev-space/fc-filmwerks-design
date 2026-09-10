'use client';

import { cn } from '@/lib/utils';

/**
 * The readout under the lens while the opening loads.
 *
 * Set in the scroll cue's exact type — same size, weight and 0.7em tracking —
 * and stacked in the same slot, so when loading finishes one crossfades into
 * the other on the spot rather than the cue appearing somewhere new. The
 * reader sees a single line under the lens that changes what it says.
 *
 * `tabular-nums` because the digits are counting: without it the line breathes
 * a pixel or two on every change, and the eye reads that as the label being
 * unsteady rather than the number moving.
 */
export function LoadingCue({
  progress,
  className,
}: {
  progress: number;
  className?: string;
}) {
  const percent = Math.min(100, Math.round(progress * 100));

  return (
    <div
      className={cn('flex flex-col items-center gap-4 md:gap-5', className)}
      role="status"
      aria-live="polite"
    >
      {/* The trailing letter-space would push the line off-centre by half the
          tracking; the negative margin takes it back, as in ScrollIndicator. */}
      {/* No number until one has actually been measured; a hard "0%" sitting
          there through hydration claims progress that has not happened. */}
      <span className="-mr-[0.7em] text-[11px] leading-none font-bold tracking-[0.7em] uppercase tabular-nums sm:text-[21px]">
        {progress > 0 ? `Loading ${percent}%` : 'Loading'}
      </span>
      <span className="sr-only">Loading the opening sequence</span>
    </div>
  );
}
