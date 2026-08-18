'use client';

import { ReactLenis, useLenis } from 'lenis/react';
import { useEffect, type ReactNode } from 'react';

import { useIsTouchDevice, usePrefersReducedMotion } from '@/hooks';
import { gsap, ScrollTrigger } from '@/lib/gsap';

/**
 * Drives Lenis from the GSAP ticker and keeps ScrollTrigger in sync.
 *
 * This lives in a child component rather than alongside `<ReactLenis>` for a
 * non-obvious reason: ReactLenis holds its instance in React *state*, so a
 * `ref` passed to it is still empty when the parent's effect first runs. An
 * effect that reads the ref once would silently never attach the ticker — and
 * with `autoRaf: false` that leaves the page unscrollable. Reading the
 * instance from context means the effect re-runs the moment it exists.
 */
function LenisGsapBridge() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const update = (time: number) => {
      // gsap.ticker reports seconds; Lenis expects milliseconds.
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);
    // Without this, a dropped frame makes GSAP clamp delta time and the scroll
    // visibly stutters.
    gsap.ticker.lagSmoothing(0);

    // Lenis drives scrolling itself, so ScrollTrigger would otherwise never
    // hear that the page moved.
    lenis.on('scroll', ScrollTrigger.update);
    ScrollTrigger.refresh();

    return () => {
      lenis.off('scroll', ScrollTrigger.update);
      gsap.ticker.remove(update);
      gsap.ticker.lagSmoothing(500, 33);
    };
  }, [lenis]);

  return null;
}

interface SmoothScrollProviderProps {
  children: ReactNode;
}

/**
 * Smooth scrolling for the whole app.
 *
 * Reduced motion unmounts Lenis rather than calling `lenis.stop()` — stopping
 * sets `overflow: hidden` on the root and would leave the page completely
 * unscrollable. Unmounting runs Lenis' own `destroy()`, which removes its
 * listeners and classes and hands scrolling back to the browser.
 *
 * Touch devices skip it too, for a different reason: `syncTouch: false`
 * already means Lenis leaves touch scrolling native rather than smoothing
 * it, so the only thing it's doing there is relaying scroll position to
 * ScrollTrigger through an extra RAF hop (native scroll -> Lenis's own
 * frame -> `ScrollTrigger.update`). That hop is a frame of latency between
 * a finger and a scrubbed animation that plain native scroll wouldn't have.
 * ScrollTrigger listens to native scroll on its own once nothing hands it a
 * `scrollerProxy`, so nothing else has to change for this to work.
 *
 * In `root` mode ReactLenis renders its children with no wrapper element, so
 * mounting or unmounting it does not change the DOM.
 */
export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  // False on the server and on the first client render, so hydration matches;
  // both flip after mount once the real device/preference is known.
  const prefersReducedMotion = usePrefersReducedMotion();
  const isTouchDevice = useIsTouchDevice();

  if (prefersReducedMotion || isTouchDevice) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{
        autoRaf: false,
        duration: 1.2,
        // Matches EASE.expo — an exponential settle rather than a linear stop.
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        // Touch devices already have momentum scrolling; overriding it feels
        // laggy and breaks pull-to-refresh.
        syncTouch: false,
        touchMultiplier: 1.5,
      }}
    >
      <LenisGsapBridge />
      {children}
    </ReactLenis>
  );
}
