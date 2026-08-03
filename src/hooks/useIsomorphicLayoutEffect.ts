import { useEffect, useLayoutEffect } from 'react';

/**
 * `useLayoutEffect` in the browser, `useEffect` on the server. Avoids React's
 * SSR warning while still letting animation setup run before paint — which is
 * what GSAP needs to prevent a flash of un-animated content.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;
