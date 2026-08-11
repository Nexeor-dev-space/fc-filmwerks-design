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
  /**
   * Gap between the copies of the track. Match the gap used *inside*
   * `children` or the seams of the loop will read as wider or narrower breaks
   * than every other join.
   */
  gapClassName?: string;
  className?: string;
}

/** Wheel notches report lines, not pixels; roughly one text line each. */
const LINE_HEIGHT = 16;
/** How much of the remaining distance is covered each frame. */
const EASE = 0.18;
/** Copies of the track. Three, so both directions always have room — see below. */
const COPIES = [0, 1, 2];

/**
 * A mouse wheel and a trackpad both arrive as `wheel` events and nothing in
 * the event says which one it was, so this is a heuristic on their shape:
 *
 * - A notched wheel fires in coarse, quantised jumps — whole numbers, usually
 *   100 or 120 a notch — and reports lines rather than pixels in Firefox.
 * - A trackpad streams many small deltas, frequently fractional, and carries
 *   an x component even on a gesture the user means as vertical.
 *
 * Anything that fails the test is treated as a trackpad and left alone, which
 * is the safe way round: a trackpad user keeps ordinary vertical scrolling.
 */
function isNotchedWheel(event: WheelEvent) {
  if (event.deltaMode !== WheelEvent.DOM_DELTA_PIXEL) return true;
  if (event.deltaX !== 0) return false;
  return Number.isInteger(event.deltaY) && Math.abs(event.deltaY) >= 40;
}

/**
 * Infinitely looping horizontal strip driven by the mouse wheel.
 *
 * Built on a real `overflow-x` scroller rather than a transformed track, which
 * is what gets native trackpad gestures, momentum on touch, keyboard arrow
 * scrolling and correct `scrollIntoView` on focus for free.
 *
 * `children` is rendered three times and the strip is parked on the middle
 * copy, then `scrollLeft` wraps by exactly one copy's width whenever it leaves
 * that copy. Three rather than two because a native gesture cannot push
 * `scrollLeft` below zero: with the track starting at the left edge there is
 * nothing to the left to wrap into, and a trackpad swipe right at the start
 * simply stops dead. A whole copy of runway on each side removes that edge in
 * both directions, and the wrap is invisible because the copy arriving is
 * identical to the one leaving.
 *
 * Only a notched mouse wheel is redirected onto the horizontal axis. A
 * trackpad scrolls the page as it always did, since taking its vertical
 * gesture would leave those users unable to get past the section.
 *
 * Because the loop has no end to fall through, a wheel held in one direction
 * releases the page after a full lap — otherwise the section would trap the
 * reader for as long as they kept scrolling.
 */
export function HorizontalCarousel({
  children,
  label,
  edgeClassName,
  gapClassName,
  className,
}: HorizontalCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const firstCopyRef = useRef<HTMLDivElement>(null);
  const secondCopyRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  const target = useRef<number | null>(null);
  const frame = useRef<number | null>(null);
  /** Distance travelled in the current direction, reset when it flips. */
  const travelled = useRef(0);
  const direction = useRef(0);

  /**
   * One lap: the distance between two copies' left edges. Measured this way
   * rather than as a share of `scrollWidth` so the scroller's own gutter —
   * which sits inside the scrolled content — cannot skew it.
   *
   * Returns 0 when looping cannot work: before layout, or when the strip is
   * too short for the middle copy to be reachable, in which case this stays a
   * plain scroller rather than jumping around.
   */
  const lapWidth = useCallback(() => {
    const el = scrollerRef.current;
    const first = firstCopyRef.current;
    const second = secondCopyRef.current;
    if (!el || !first || !second) return 0;

    const lap = second.offsetLeft - first.offsetLeft;
    if (lap <= 0) return 0;
    /*
     * The middle copy has to be reachable or parking there would be undone by
     * the browser clamping. `offsetLeft` already counts the scroller's gutter,
     * so a resting `scrollLeft` of exactly one lap puts the middle copy's
     * first item on the same line as the heading, as the first copy was.
     */
    return el.scrollWidth - el.clientWidth >= lap * 2 ? lap : 0;
  }, []);

  const stop = useCallback(() => {
    if (frame.current !== null) {
      cancelAnimationFrame(frame.current);
      frame.current = null;
    }
    target.current = null;
    travelled.current = 0;
    direction.current = 0;
  }, []);

  useEffect(() => stop, [stop]);

  /** Park on the middle copy, and re-park if a resize invalidates the lap. */
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const park = () => {
      const lap = lapWidth();
      if (lap <= 0) return;
      if (el.scrollLeft < lap || el.scrollLeft >= lap * 2) {
        stop();
        el.scrollLeft = lap;
      }
    };

    park();
    const observer = new ResizeObserver(park);
    observer.observe(el);
    return () => observer.disconnect();
  }, [lapWidth, stop]);

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

    /*
     * Wrap back onto the middle copy, moving the live position and the target
     * by the same lap so the easing never notices the jump.
     */
    const lap = lapWidth();
    if (lap > 0) {
      if (el.scrollLeft >= lap * 2) {
        el.scrollLeft -= lap;
        target.current -= lap;
      } else if (el.scrollLeft < lap) {
        el.scrollLeft += lap;
        target.current += lap;
      }
    }

    frame.current = requestAnimationFrame(step);
  }, [lapWidth]);

  /*
   * Registered manually because React's `onWheel` is passive — `preventDefault`
   * there is ignored, and the page would scroll away underneath the strip.
   */
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const onWheel = (event: WheelEvent) => {
      if (!isNotchedWheel(event)) return;

      const delta =
        event.deltaMode === WheelEvent.DOM_DELTA_PIXEL
          ? event.deltaY
          : event.deltaY * LINE_HEIGHT;
      if (delta === 0) return;

      const lap = lapWidth();
      if (lap <= 0) return;

      const heading = Math.sign(delta);
      if (heading !== direction.current) {
        direction.current = heading;
        travelled.current = 0;
      }

      // A full lap in one direction has shown everything there is to show;
      // past that the wheel belongs to the page again.
      if (travelled.current >= lap) return;
      travelled.current += Math.abs(delta);

      event.preventDefault();

      const from = target.current ?? el.scrollLeft;
      const next = from + delta;

      if (reducedMotion) {
        stop();
        el.scrollLeft = lap + ((((next - lap) % lap) + lap) % lap);
        return;
      }

      target.current = next;
      frame.current ??= requestAnimationFrame(step);
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [lapWidth, reducedMotion, step, stop]);

  /*
   * Native scrolling — trackpad, touch, keyboard, focus — bypasses the wheel
   * handler entirely, so the wrap has to be enforced here too or those users
   * run out of track. Guarded on the eased frame being idle to avoid fighting
   * it. Repositioning mid-gesture is what keeps a trackpad swipe from ever
   * meeting an edge.
   */
  const onScroll = () => {
    if (frame.current !== null) return;
    const el = scrollerRef.current;
    const lap = lapWidth();
    if (!el || lap <= 0) return;

    if (el.scrollLeft >= lap * 2) el.scrollLeft -= lap;
    else if (el.scrollLeft < lap) el.scrollLeft += lap;
  };

  return (
    <div className={cn('relative', className)}>
      <div
        ref={scrollerRef}
        role="region"
        aria-label={label}
        tabIndex={0}
        // Keeps Lenis' own wheel handling off this element.
        data-lenis-prevent
        onScroll={onScroll}
        // A native scroll invalidates the eased target.
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
        <div className={cn('flex w-max', gapClassName)}>
          {COPIES.map((copy) => (
            <div
              key={copy}
              ref={
                copy === 0
                  ? firstCopyRef
                  : copy === 1
                    ? secondCopyRef
                    : undefined
              }
              className="shrink-0"
              /*
               * Only the copy the reader is parked on is real. `inert` keeps
               * the runway copies' links out of the tab order and off the
               * accessibility tree, so the set of items is announced and
               * reachable exactly once.
               */
              inert={copy !== 1}
              aria-hidden={copy !== 1}
            >
              {children}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
