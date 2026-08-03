'use client';

import { useEffect, useRef, useState } from 'react';

export type ScrollDirection = 'up' | 'down';

interface UseScrollDirectionOptions {
  /** Ignore movements smaller than this, so a trackpad twitch is not a scroll. */
  threshold?: number;
  /** Offset past which `isScrolled` flips true — used to condense the header. */
  offset?: number;
}

interface ScrollState {
  direction: ScrollDirection;
  /** True once the page has scrolled past `offset`. */
  isScrolled: boolean;
  scrollY: number;
}

/**
 * Tracks scroll direction and offset for show/hide headers. Reads are batched
 * into a rAF callback so the listener never forces layout mid-scroll.
 */
export function useScrollDirection({
  threshold = 8,
  offset = 64,
}: UseScrollDirectionOptions = {}): ScrollState {
  const [state, setState] = useState<ScrollState>({
    direction: 'up',
    isScrolled: false,
    scrollY: 0,
  });

  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastY.current = window.scrollY;

    const update = () => {
      const currentY = Math.max(window.scrollY, 0);
      const delta = currentY - lastY.current;

      if (Math.abs(delta) >= threshold) {
        setState({
          direction: delta > 0 ? 'down' : 'up',
          isScrolled: currentY > offset,
          scrollY: currentY,
        });
        lastY.current = currentY;
      } else {
        setState((prev) =>
          prev.isScrolled === currentY > offset
            ? prev
            : { ...prev, isScrolled: currentY > offset, scrollY: currentY },
        );
      }

      ticking.current = false;
    };

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      window.requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold, offset]);

  return state;
}
