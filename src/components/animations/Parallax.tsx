'use client';

import { useRef, type ReactNode } from 'react';

import { useIsomorphicLayoutEffect } from '@/hooks';
import { gsap } from '@/lib/gsap';
import { cn } from '@/lib/utils';

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  /**
   * Travel distance as a share of the element's own height. Positive drifts
   * down (slower than the page), negative drifts up.
   */
  speed?: number;
}

/**
 * GSAP ScrollTrigger parallax — the counterpart to the Framer Motion wrappers,
 * for effects that need to be scrubbed against scroll position rather than
 * played on entry.
 *
 * The wrapper keeps `overflow-hidden`, so give the child extra height (e.g.
 * `scale-110` on an image) to avoid revealing an edge as it drifts.
 */
export function Parallax({ children, className, speed = 0.2 }: ParallaxProps) {
  const container = useRef<HTMLDivElement>(null);
  const target = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const element = target.current;
    if (!element) return;

    // ScrollTrigger reads this itself, but checking here skips creating the
    // trigger at all when motion is reduced.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // A scrub tween recomputes `yPercent` on every scroll tick. On mobile
    // that's competing with native momentum scroll for the same frame
    // budget, and the drift is small enough there to not be missed.
    if (window.matchMedia('(max-width: 767px)').matches) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        element,
        { yPercent: -speed * 50 },
        {
          yPercent: speed * 50,
          ease: 'none',
          scrollTrigger: {
            trigger: container.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
    }, container);

    return () => context.revert();
  }, [speed]);

  return (
    <div ref={container} className={cn('overflow-hidden', className)}>
      <div ref={target} className="h-full w-full will-change-transform">
        {children}
      </div>
    </div>
  );
}
