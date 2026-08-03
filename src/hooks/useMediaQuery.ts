'use client';

import { useEffect, useState } from 'react';

import { BREAKPOINTS, MEDIA_QUERY, type Breakpoint } from '@/constants';

/**
 * Subscribe to a CSS media query.
 *
 * Returns `false` on the first render (including SSR) and updates after mount,
 * so never branch the rendered markup on this value alone or hydration will
 * mismatch — gate behaviour, or pair it with a mounted check.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQuery.addEventListener('change', onChange);

    return () => mediaQuery.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/** True once the viewport is at or above the given Tailwind breakpoint. */
export function useBreakpoint(breakpoint: Breakpoint): boolean {
  return useMediaQuery(`(min-width: ${BREAKPOINTS[breakpoint]}px)`);
}

/** True below `lg` — where the desktop navigation collapses. */
export function useIsMobile(): boolean {
  return useMediaQuery(MEDIA_QUERY.mobile);
}

/** True when the visitor has asked the OS to reduce motion. */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery(MEDIA_QUERY.reducedMotion);
}
