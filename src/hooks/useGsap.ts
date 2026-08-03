'use client';

import { useRef, type RefObject } from 'react';

import { gsap } from '@/lib/gsap';

import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

/**
 * Runs GSAP setup inside a scoped `gsap.context`, and reverts every tween,
 * ScrollTrigger and inline style it created on unmount. That teardown is what
 * keeps animations from leaking across client-side route changes.
 *
 * ```tsx
 * const scope = useGsap<HTMLElement>(() => {
 *   gsap.from('.line', {
 *     yPercent: 100,
 *     stagger: 0.1,
 *     scrollTrigger: { trigger: '.line', start: 'top 80%' },
 *   });
 * });
 *
 * return <section ref={scope}>…</section>;
 * ```
 *
 * Selector strings inside `setup` are automatically scoped to the returned ref,
 * so `.line` only matches elements within this component.
 */
export function useGsap<T extends HTMLElement = HTMLDivElement>(
  setup: (context: gsap.Context) => void,
  deps: unknown[] = [],
): RefObject<T | null> {
  const scope = useRef<T>(null);

  useIsomorphicLayoutEffect(() => {
    const context = gsap.context(setup, scope);
    return () => context.revert();
  }, deps);

  return scope;
}
