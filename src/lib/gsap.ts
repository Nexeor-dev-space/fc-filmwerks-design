'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Central GSAP entry point. Always import `gsap` / `ScrollTrigger` from here
 * rather than from the package directly — plugins are registered exactly once
 * and every animation inherits the same defaults.
 *
 * Register any additional plugins in this file so the app has a single place
 * where GSAP is configured.
 */
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  gsap.defaults({
    ease: 'power3.out',
    duration: 0.8,
  });

  // Recalculate trigger positions after fonts land, since text reflow shifts
  // every element below it.
  if ('fonts' in document) {
    void document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
}

export { gsap, ScrollTrigger };
