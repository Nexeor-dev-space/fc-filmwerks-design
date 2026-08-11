'use client';

import { useCallback, useEffect, useRef, type ReactNode } from 'react';

import { usePrefersReducedMotion } from '@/hooks';
import { cn } from '@/lib/utils';

interface HorizontalCarouselProps {
  children: ReactNode;
  /** Names the scrollable region for assistive technology. */
  label: string;
  /**
   * Gutter applied inside the scroller. Match the page padding so the first
   * item lines up with the heading above while items still bleed off the edge.
   */
  edgeClassName?: string;
  className?: string;
}

/** Wheel notches report lines, not pixels; roughly one text line each. */
const LINE_HEIGHT = 16;
/** How much of the remaining distance is covered each frame. */
const EASE = 0.18;

/**
 * Horizontally scrollable strip driven by the mouse wheel.
 *
 * Built on a real `overflow-x` scroller rather than a transformed track, which
 * is what gets native trackpad gestures, momentum on touch, keyboard arrow
 * scrolling and correct `scrollIntoView` on focus for free. The wheel handler
 * only maps vertical wheel deltas onto that axis.
 *
 * Vertical page scrolling is only swallowed while the strip still has room to
 * move in that direction — at either end the wheel falls through to the page,
 * so the section never traps the reader.
 *
 * The scroller is focusable so the strip can be reached and driven from the
 * keyboard; without `tabIndex` a mouse would be the only way to see past the
 * first few items.
 */
export function HorizontalCarousel({
  children,
  label,
  edgeClassName,
  className,
}: HorizontalCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  const target = useRef<number | null>(null);
  const frame = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (frame.current !== null) {
      cancelAnimationFrame(frame.current);
      frame.current = null;
    }
    target.current = null;
  }, []);

  useEffect(() => stop, [stop]);

  /** Eases `scrollLeft` towards the accumulated wheel target. */
  const step = useCallback(() => {
    const el = scrollerRef.current;
    if (!el || target.current === null) {
      frame.current = null;
      return;
    }

    const distance = target.current - el.scrollLeft;
    if (Math.abs(distance) < 0.5) {
      el.scrollLeft = target.current;
      frame.current = null;
      target.current = null;
      return;
    }

    el.scrollLeft += distance * EASE;
    frame.current = requestAnimationFrame(step);
  }, []);

  /*
   * Registered manually because React's `onWheel` is passive — `preventDefault`
   * there is ignored, and the page would scroll away underneath the strip.
   */
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const onWheel = (event: WheelEvent) => {
      // A trackpad's own horizontal gesture is already correct; leave it alone.
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        stop();
        return;
      }

      const delta =
        event.deltaMode === WheelEvent.DOM_DELTA_LINE
          ? event.deltaY * LINE_HEIGHT
          : event.deltaY;

      const max = el.scrollWidth - el.clientWidth;
      const from = target.current ?? el.scrollLeft;
      const next = Math.max(0, Math.min(max, from + delta));

      // At either end there is nothing left to take, so the page keeps it.
      if (next === from) return;

      event.preventDefault();

      if (reducedMotion) {
        stop();
        el.scrollLeft = next;
        return;
      }

      target.current = next;
      frame.current ??= requestAnimationFrame(step);
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [reducedMotion, step, stop]);

  return (
    <div className={cn('relative', className)}>
      <div
        ref={scrollerRef}
        role="region"
        aria-label={label}
        tabIndex={0}
        // Keeps Lenis' own wheel handling off this element.
        data-lenis-prevent
        // A native scroll (keyboard, focus, touch) invalidates the eased target.
        onPointerDown={stop}
        onKeyDown={stop}
        className={cn(
          // Snapping belongs on the scroll container itself. Phones get one
          // card at a time; from `md` up, free scrolling suits a wider strip.
          'snap-x snap-mandatory overflow-x-auto overscroll-x-contain md:snap-none',
          // No scrollbar, but still a real scroll container.
          '[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
          'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#BFA76F]',
          edgeClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
