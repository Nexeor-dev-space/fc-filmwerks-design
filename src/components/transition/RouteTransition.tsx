'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react';

import { ApertureIris } from '@/components/intro';
import { usePrefersReducedMotion } from '@/hooks';
import { IRIS, SEALED_OPENING, setIrisOpening } from '@/lib/aperture';
import { gsap } from '@/lib/gsap';
import { markIntroSeen } from '@/lib/intro-seen';
import { cn } from '@/lib/utils';

type Phase = 'idle' | 'closing' | 'covered' | 'opening';

interface RouteTransition {
  /**
   * Take over an in-site link click: shut the iris over the current page,
   * navigate underneath it, and open onto the new page once it has rendered.
   * Returns false, and touches nothing, when the browser should handle the
   * click itself: modifier keys, a link to the page already open, or a
   * visitor who has asked for reduced motion.
   */
  intercept: (event: MouseEvent<HTMLAnchorElement>, href: string) => boolean;
}

const RouteTransitionContext = createContext<RouteTransition>({
  intercept: () => false,
});

export function useRouteTransition(): RouteTransition {
  return useContext(RouteTransitionContext);
}

/**
 * Closing is a shutter and wants a little snap; opening is the reveal and
 * rides a sine curve so nothing in it reads as the frame being yanked apart.
 * The same pairing the intro uses, in real time rather than scroll distance.
 */
const CLOSE = { duration: 0.55, ease: 'power2.inOut' } as const;
const OPEN = { duration: 0.85, ease: 'sine.inOut' } as const;

/** One painted frame of the new page under the blades before they part. */
const REVEAL_DELAY = 0.1;

/**
 * If the new route never arrives, a failed fetch or a page that threw, open
 * onto whatever is on screen rather than leaving the visitor behind shut
 * blades with a working header and nothing else.
 */
const ARRIVAL_TIMEOUT = 5000;

/**
 * The film-camera cut between pages.
 *
 * The homepage opens on a lens whose iris closes and reopens as the visitor
 * scrolls. This puts the same iris, the same blades and geometry, on every
 * navigation from the site header: the leaves swing shut over the page being
 * left, the next route renders behind them, and they open onto it while it
 * plays its own entrance. Nothing about the destination is changed; each page
 * still loads exactly as it would from a cold visit, only now it is revealed
 * rather than swapped in.
 *
 * Only header links opt in, through `useRouteTransition().intercept`. Cards
 * and in-page anchors navigate as they always did, so the effect stays a
 * chapter mark rather than a tax on every click.
 *
 * The overlay sits above the menu and below the header, so the wordmark and
 * its controls stay on screen over the blades, the way a viewfinder keeps its
 * readouts. A second click while a cut is under way is swallowed.
 */
export function RouteTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reducedMotion = usePrefersReducedMotion();

  const irisRef = useRef<SVGSVGElement>(null);
  const phase = useRef<Phase>('idle');
  const aperture = useRef({ opening: IRIS.radius });
  const arrival = useRef<number | null>(null);
  const [covering, setCovering] = useState(false);

  /* The blades are written straight to the SVG, the same way the intro does
     it — see the note on `setIrisOpening` for why not a GSAP tween. */
  const apply = useCallback(() => {
    const iris = irisRef.current;
    if (!iris) return;
    setIrisOpening(
      iris.querySelectorAll('.iris-blade'),
      aperture.current.opening,
    );
  }, []);

  useEffect(() => {
    const iris = irisRef.current;
    if (!iris) return;
    setIrisOpening(iris.querySelectorAll('.iris-blade'), IRIS.radius);
  }, []);

  const open = useCallback(() => {
    if (arrival.current !== null) {
      window.clearTimeout(arrival.current);
      arrival.current = null;
    }
    phase.current = 'opening';
    gsap.killTweensOf(aperture.current);
    gsap.to(aperture.current, {
      opening: IRIS.radius,
      ...OPEN,
      delay: REVEAL_DELAY,
      onUpdate: apply,
      onComplete: () => {
        phase.current = 'idle';
        setCovering(false);
      },
    });
  }, [apply]);

  /* The route has changed, so the new page is in the DOM under the blades.
     A change that arrives with the iris idle, back and forward for one, is
     not ours and is left alone. */
  useEffect(() => {
    if (phase.current === 'covered' || phase.current === 'closing') open();
  }, [pathname, open]);

  const intercept = useCallback<RouteTransition['intercept']>(
    (event, href) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return false;
      }
      if (reducedMotion || href === pathname) return false;

      event.preventDefault();
      if (phase.current !== 'idle') return true;

      /*
       * This cut IS the opening shot for wherever we are going, so the
       * homepage must not play its own on arrival. Without this, a visitor who
       * landed on any other page and then clicked the wordmark saw the iris
       * twice over: these blades closing and opening, and then the full lens
       * intro with a second iris behind them. Marking the intro spent before
       * the push means IntroExperience reads it in its first layout effect and
       * mounts the hero outright, so the blades part onto the hero.
       *
       * Set here rather than after `router.push` on purpose: the flag has to
       * be readable in the same commit the new route mounts in, and a page
       * that is already prefetched can mount in the very next frame.
       */
      markIntroSeen();

      phase.current = 'closing';
      setCovering(true);
      router.prefetch(href);
      gsap.killTweensOf(aperture.current);
      gsap.to(aperture.current, {
        opening: SEALED_OPENING,
        ...CLOSE,
        onUpdate: apply,
        onComplete: () => {
          phase.current = 'covered';
          router.push(href);
          arrival.current = window.setTimeout(open, ARRIVAL_TIMEOUT);
        },
      });
      return true;
    },
    [apply, open, pathname, reducedMotion, router],
  );

  const value = useMemo(() => ({ intercept }), [intercept]);

  return (
    <RouteTransitionContext.Provider value={value}>
      {children}
      <div
        aria-hidden="true"
        className={cn(
          'fixed inset-0 z-[105] overflow-hidden',
          covering ? 'pointer-events-auto' : 'pointer-events-none invisible',
        )}
      >
        <ApertureIris ref={irisRef} id="route-iris" />
      </div>
    </RouteTransitionContext.Provider>
  );
}
