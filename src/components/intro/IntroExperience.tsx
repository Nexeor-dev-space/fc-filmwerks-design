'use client';

import { useRef, useState, type ReactNode } from 'react';

import {
  IRIS,
  PIVOT_ORIGIN,
  SEALED_OPENING,
  rotationForOpening,
} from '@/lib/aperture';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { hasSeenIntro, markIntroSeen } from '@/lib/intro-seen';
import { cn } from '@/lib/utils';
import {
  useIsomorphicLayoutEffect,
  useLenis,
  usePrefersReducedMotion,
} from '@/hooks';

import { ApertureIris } from './ApertureIris';
import { CinemaLens } from './CinemaLens';
import { HeroRevealContext } from './HeroRevealContext';
import { LensBackdrop } from './LensBackdrop';
import { ScrollIndicator } from './ScrollIndicator';

/**
 * Spans differ by device because the same scroll distance does not feel the
 * same on both. A phone covers a viewport in one short flick, so a desktop-
 * length hold there reads as the page having stopped responding; a mouse wheel
 * covers it in several notches, so a short hold reads as no pause at all.
 *
 * `cover` is load-bearing beyond this file — ServicesSection pulls itself up by
 * exactly that much to create the overlap, and its negative margin has to be
 * changed in step at the same breakpoint.
 *
 * `aperture` is kept short on purpose: the lens-grow → iris-close → swap →
 * iris-open sequence is meant to read in about two mouse-wheel notches, not
 * a long dedicated scroll of its own — the hold is what gives the reader a
 * pause, not the aperture.
 *
 * Wrapper heights must match: (aperture + hold + cover + 1) * 100dvh.
 *   mobile:  (0.6 + 1.2 + 1.2 + 1) = 4.0 → 400dvh
 *   desktop: (0.6 + 2.0 + 1.6 + 1) = 5.2 → 520dvh
 */
const SPANS = {
  desktop: { aperture: 2, hold: 2.0, cover: 1.6 },
  mobile: { aperture: 2, hold: 1.2, cover: 1.2 },
} as const;

interface Timing {
  /** Total scroll distance, in viewport heights. */
  pin: number;
  /** Where each beat falls, as a fraction of that distance. */
  beats: {
    indicatorOut: number;
    lensGrow: number;
    irisClose: number;
    lensOut: number;
    sealed: number;
    swap: number;
    irisOpen: number;
    /**
     * The intro has nothing left to show — the iris is fully open and the
     * hero's settle has landed. This is where the intro tree is retired, and
     * it must sit AFTER those tweens end, not where they begin: retiring at
     * `irisOpen` tears the timeline down mid-reveal and cuts the opening to a
     * single frame. It must also stay before `heroSettle`, which the mobile
     * spans only clear by ~0.01 — check both breakpoints when retiming.
     */
    introSpent: number;
    heroSettle: number;
    frameSquare: number;
  };
}

/**
 * Turns a set of spans into the timeline positions the sequence is built from.
 *
 * The aperture beats are written against the lens sequence alone and rescaled
 * onto the whole pin, so lengthening the hold cannot silently retime the iris.
 * The handoff beats are already in whole-pin terms and are anchored past the
 * hold, so nothing animates while the hero is meant to be sitting still.
 */
function buildTiming(spans: (typeof SPANS)[keyof typeof SPANS]): Timing {
  const pin = spans.aperture + spans.hold + spans.cover;
  const apertureEnd = spans.aperture / pin;
  const coverStart = (spans.aperture + spans.hold) / pin;
  const beat = (fraction: number) => fraction * apertureEnd;

  return {
    pin,
    beats: {
      indicatorOut: beat(0),
      lensGrow: beat(0.06),
      irisClose: beat(0.3),
      lensOut: beat(0.48),
      sealed: beat(0.64),
      /** Intro is swapped for the hero here, hidden behind the blades. */
      swap: beat(0.66),
      irisOpen: beat(0.76),
      /* The iris-open and hero-settle tweens are 0.34 long; 0.35 is the first
         moment both are certainly finished. Desktop clears heroSettle by
         ~0.07, mobile by ~0.01 — see the note on the interface. */
      introSpent: beat(0.76) + 0.35,

      heroSettle: coverStart + 0.02,
      frameSquare: coverStart + 0.12,
    },
  };
}

interface IntroExperienceProps {
  /** Revealed through the aperture; becomes the page once the iris reopens. */
  children: ReactNode;
  className?: string;
}

/**
 * Full-screen intro that hands off to the hero through a closing camera iris.
 *
 * The hero is held in place via CSS `position: sticky` inside a tall wrapper.
 * A GSAP ScrollTrigger scrubs the intro timeline as the user scrolls through
 * the wrapper — no `pin: true`, so nothing fights Lenis or breaks in flex
 * containers. The wrapper height provides the scroll distance; the sticky
 * element stays at `top: 0` for the whole duration.
 *
 * ServicesSection sits after the wrapper with a negative top margin equal to
 * `cover`, so it slides upward over the still-stuck hero during the last
 * phase of the timeline.
 */
export function IntroExperience({ children, className }: IntroExperienceProps) {
  const root = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  const [revealed, setRevealed] = useState(false);

  const [skipIntro, setSkipIntro] = useState(false);

  /*
   * Set once the iris has opened and the hero is on screen. From then on the
   * intro is spent for this page view: the tree swaps to the hero-only layout
   * below, so scrolling back to the top lands on the hero rather than
   * replaying the opening.
   *
   * Deliberately React state and nothing else. `sessionStorage` would survive
   * a reload, and the intro is meant to play again on refresh, in a new tab
   * and on a fresh visit — all of which remount this component and reset the
   * flag on their own. "Once per page view" is exactly a state variable's
   * lifetime, so there is nothing to persist or clear.
   */
  const [introComplete, setIntroComplete] = useState(false);

  /* The GSAP wrapper's height, read just before the swap unmounts it. The
     scroll remap below needs the before/after difference, and by the time the
     layout effect runs the old tree is gone. */
  const preSwapWrapperHeight = useRef(0);

  const lenis = useLenis();

  useIsomorphicLayoutEffect(() => {
    if (hasSeenIntro()) setSkipIntro(true);
  }, []);

  /*
   * Swapping the tree drops the intro's scroll distance — the wrapper goes
   * from ~740dvh to ~380dvh — so the page under the reader gets shorter by
   * several viewports. Left alone, the section below would jump up and cover
   * the hero the instant the swap lands.
   *
   * The reader's scroll is therefore shifted by exactly the height the page
   * lost, not sent to the top. Subtracting the delta keeps every visible
   * relationship: mid-hold it clamps to 0 with the hero pinned identically on
   * both sides of the swap, and if the scrub's one-second lag meant the reader
   * was already deep into the cover phase when the beat fired, the section
   * covering the hero stays exactly where they see it. A plain `scrollTo(0)`
   * here would teleport a fast scroller back to the top of the page.
   *
   * A layout effect so it lands in the same commit as the swap, before paint.
   * Lenis is told directly — it keeps its own scroll position and would
   * otherwise animate back to where it thought it was.
   */
  useIsomorphicLayoutEffect(() => {
    if (!introComplete) return;

    const newWrapperHeight = root.current?.parentElement?.offsetHeight ?? 0;
    const removed = Math.max(
      0,
      preSwapWrapperHeight.current - newWrapperHeight,
    );
    const target = Math.max(0, window.scrollY - removed);

    lenis?.scrollTo(target, { immediate: true, force: true });
    window.scrollTo(0, target);
  }, [introComplete, lenis]);

  useIsomorphicLayoutEffect(() => {
    if (
      reduced ||
      skipIntro ||
      introComplete ||
      !root.current ||
      !wrapperRef.current
    )
      return;

    /*
     * Marks the animated tree as live for as long as it is mounted.
     *
     * `markIntroSeen()` fires mid-scrub, the moment the iris opens, so that
     * the floating nav can appear. That sets `data-intro-seen`, which a CSS
     * rule uses to suppress the intro before React hydrates on a repeat
     * visit — correct there, but catastrophic here: it would strip the gold
     * layer and the blades out from under a timeline that is still running,
     * and scrubbing back up would then expose the bare, scaled-up hero
     * instead of a closed iris. The rule excludes this attribute so the
     * pre-hydration guard cannot reach a tree React is already driving.
     */
    document.documentElement.setAttribute('data-intro-active', 'true');

    const mm = gsap.matchMedia(root);

    mm.add(
      { isMobile: '(max-width: 767px)', isDesktop: '(min-width: 768px)' },
      (context) => {
        const { isMobile } = context.conditions as { isMobile: boolean };
        const k = isMobile ? 0.5 : 1;

        const { beats } = buildTiming(isMobile ? SPANS.mobile : SPANS.desktop);

        /* ── Idle life ────────────────────────────────────────────────────
           Each property lives on its own wrapper so these endless loops can
           never collide with the scroll timeline, which drives a different
           element. Durations are mutually prime-ish so the composite motion
           never visibly repeats. */

        gsap.to('.lens-float', {
          y: 9 * k,
          duration: 6.5,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });

        gsap.to('.lens-breathe', {
          scale: 1 + 0.016 * k,
          duration: 5.2,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });

        gsap.fromTo(
          '.lens-tilt',
          { rotation: -2 * k },
          {
            rotation: 2 * k,
            duration: 15,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
          },
        );

        gsap.to('.lens-spin', {
          rotation: 360,
          duration: isMobile ? 150 : 110,
          ease: 'none',
          repeat: -1,
        });

        gsap.to('.lens-bloom', {
          xPercent: 7 * k,
          yPercent: 5 * k,
          opacity: 0.5,
          duration: 11,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });

        gsap.to('.lens-warm', {
          xPercent: -6 * k,
          yPercent: -4 * k,
          opacity: 0.36,
          duration: 13,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });

        gsap.to('.lens-glint-a', {
          opacity: 0.32,
          duration: 7.5,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });

        gsap.to('.lens-glint-b', {
          opacity: 0.85,
          duration: 10.5,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });

        /* The scroll cue used to be driven from here. It is CSS keyframes now
           — see `.scroll-cue-*` in globals.css — so there is deliberately no
           tween for it: GSAP writing `transform` on the same element would
           overwrite the keyframe every frame. */

        /* ── Scroll sequence ──────────────────────────────────────────── */

        const element = root.current;
        const wrapper = wrapperRef.current;
        if (!element || !wrapper) return;

        const blades = Array.from(element.querySelectorAll('.iris-blade'));
        const aperture = { opening: IRIS.radius };
        const applyAperture = () => {
          gsap.set(blades, {
            rotation: rotationForOpening(aperture.opening),
            svgOrigin: PIVOT_ORIGIN,
          });
        };

        applyAperture();

        let timeline: gsap.core.Timeline | null = null;
        let observer: ResizeObserver | null = null;

        const build = () => {
          const tl = (timeline = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: wrapper,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 1,
              invalidateOnRefresh: true,
            },
          }));

          tl.to(
            '.intro-indicator',
            { opacity: 0, y: 14, duration: 0.1, ease: 'power2.in' },
            beats.indicatorOut,
          )
            .to(
              '.lens-scroll',
              { scale: 1 + 0.22 * k, duration: 0.54, ease: 'power1.inOut' },
              beats.lensGrow,
            )
            .to(
              '.lens-logo',
              {
                y: -20 * k,
                scale: 1.03,
                opacity: 0.07,
                duration: 0.4,
                ease: 'power1.inOut',
              },
              beats.lensGrow,
            )
            .to(
              aperture,
              { opening: SEALED_OPENING, duration: 0.34, ease: 'power2.inOut' },
              beats.irisClose,
            )
            .to(
              ['.lens-scroll', '.lens-logo'],
              { opacity: 0, duration: 0.16, ease: 'power2.in' },
              beats.lensOut,
            )
            .set('.intro-layer', { autoAlpha: 0 }, beats.swap)
            /* The opening is deliberately slower than the close and rides a
               sine curve rather than a power one. Closing is a shutter action
               and wants a bit of snap; opening is the reveal, and any
               acceleration in it reads as the frame being yanked apart. The
               span is bounded by `heroSettle` — the widest it can run without
               the hero starting to recede before it has finished arriving is
               ~0.43 desktop / ~0.38 mobile. */
            .to(
              aperture,
              { opening: IRIS.radius, duration: 0.34, ease: 'sine.inOut' },
              beats.irisOpen,
            )
            /* Settles over exactly the same span so the push-in lands with the
               blades, not after them. The starting scale is small on purpose:
               a big punch here is what makes the reveal feel like a jump cut
               rather than a lens pulling focus. */
            .fromTo(
              '.hero-reveal',
              { scale: 1 + 0.09 * k },
              { scale: 1, duration: 0.34, ease: 'power1.out' },
              beats.irisOpen,
            )

            /* ── Handoff ────────────────────────────────────────────────
               The hero stays stuck via CSS sticky while the section below
               climbs over it. These recede it just enough to read as
               depth — the covering section is what actually ends the shot. */
            .to(
              '.hero-reveal video',
              { scale: 0.98, duration: 0.2, ease: 'power2.inOut' },
              beats.heroSettle,
            )
            .to(
              '.hero-darken',
              { opacity: 0.35, duration: 0.2, ease: 'power1.inOut' },
              beats.heroSettle,
            )
            .to(
              ['.hero-copy', '.hero-reveal header'],
              { opacity: 0, y: -18, duration: 0.14, ease: 'power2.in' },
              beats.heroSettle,
            )
            .to(
              '.intro-frame',
              { borderRadius: 0, duration: 0.1, ease: 'power2.inOut' },
              beats.frameSquare,
            );

          tl.eventCallback('onUpdate', () => {
            applyAperture();
            if (tl.progress() >= beats.irisOpen) {
              setRevealed(true);
              markIntroSeen();
            }
            /*
             * Retire the intro only once `introSpent` — after the iris-open
             * and settle tweens have fully landed, not where they begin. An
             * earlier revision swapped at `irisOpen` and the reveal played as
             * a single frame: the swap tears this timeline down, so anything
             * still animating at that moment is simply cut.
             *
             * Compared against `tl.time()`, not `progress()`: beat positions
             * are absolute timeline times, and the timeline's total duration
             * is not exactly 1, so progress comparisons drift early. The
             * `revealed` check above keeps the fuzzier progress form on
             * purpose — firing a little early is harmless there and its
             * threshold predates the distinction.
             *
             * The wrapper's height is captured here, before the swap unmounts
             * it — the layout effect needs it to keep the reader's place.
             */
            if (tl.time() >= beats.introSpent) {
              preSwapWrapperHeight.current = wrapper.offsetHeight;
              setIntroComplete(true);
            }
          });
        };

        if (wrapper.offsetHeight > 0) {
          build();
        } else {
          observer = new ResizeObserver(() => {
            if (wrapper.offsetHeight === 0) return;
            observer?.disconnect();
            observer = null;
            build();
          });
          observer.observe(wrapper);
        }

        return () => {
          observer?.disconnect();
          timeline?.scrollTrigger?.kill();
          timeline?.kill();
        };
      },
    );

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    void document.fonts?.ready.then(refresh);

    return () => {
      window.removeEventListener('load', refresh);
      document.documentElement.removeAttribute('data-intro-active');
      mm.revert();
    };
  }, [reduced, skipIntro, introComplete]);

  const intro = (
    <>
      <LensBackdrop />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="lens-scroll">
          <div className="lens-float">
            <div className="lens-tilt">
              <div className="lens-spin">
                <div className="lens-breathe">
                  <CinemaLens />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clear of the bottom edge by 48px, 64px from `md` — enough that the
          cue reads as its own element rather than as page furniture. */}
      <div className="absolute inset-x-0 bottom-12 flex justify-center text-[#222] md:bottom-16">
        <ScrollIndicator className="intro-indicator" />
      </div>
    </>
  );

  /*
   * The hero as the landing section outright, held in a tall wrapper so CSS
   * sticky keeps it pinned. ServicesSection's negative margin pulls it into
   * the last stretch of the wrapper, creating the slide-over effect without
   * any JavaScript scroll handling.
   *
   * Two ways in. `skipIntro` is the returning visitor, decided before first
   * paint. `introComplete` is this page view having already played the
   * opening — from here the intro is gone from the scroll flow entirely, so
   * the top of the page is the hero and nothing replays on the way back up.
   *
   * Mobile wrapper: 300dvh  → ~80dvh of pure hero hold
   * Desktop wrapper: 380dvh → ~120dvh of pure hero hold
   */
  if (skipIntro || introComplete) {
    return (
      <div
        className={cn('relative h-[300dvh] w-full md:h-[380dvh]', className)}
      >
        <div ref={root} className="sticky top-0 h-dvh w-full overflow-hidden">
          <div className="hero-reveal absolute inset-0">
            <HeroRevealContext.Provider value>
              {children}
            </HeroRevealContext.Provider>
          </div>
        </div>
      </div>
    );
  }

  /*
   * Reduced motion: two ordinary stacked sections, intro first. Order matters
   * here — in the animated layout the hero is deliberately painted underneath
   * the intro, but in normal flow that same order would put the hero above it
   * on the page.
   */
  if (reduced) {
    return (
      <div
        ref={root}
        className={cn('relative w-full bg-background p-2 md:p-3', className)}
      >
        <div className="intro-layer relative h-[calc(100dvh-1rem)] overflow-hidden rounded-[10px] bg-[#BFA76F] md:h-[calc(100dvh-1.5rem)]">
          {intro}
        </div>
        <div className="hero-reveal relative mt-2 h-[calc(100dvh-1rem)] overflow-hidden rounded-[10px] md:mt-3 md:h-[calc(100dvh-1.5rem)]">
          {children}
        </div>
      </div>
    );
  }

  return (
    /*
     * The tall wrapper provides scroll distance for the entire intro + hero
     * hold + cover sequence. The inner element is CSS sticky, so it stays at
     * the top of the viewport while the user scrolls through the wrapper.
     * GSAP's ScrollTrigger scrubs the timeline against the wrapper's scroll
     * range (top-top to bottom-bottom) — no `pin: true` needed.
     *
     * Wrapper height = (pin + 1) * 100dvh:
     *   mobile:  400dvh  (3.0 + 1 viewport heights)
     *   desktop: 520dvh  (4.2 + 1 viewport heights)
     */
    <div
      ref={wrapperRef}
      className={cn('relative h-[400dvh] w-full md:h-[520dvh]', className)}
    >
      <div
        ref={root}
        className="sticky top-0 h-dvh w-full overflow-hidden bg-background"
      >
        <div className="intro-frame absolute inset-2 overflow-hidden rounded-[28px] md:inset-3">
          <div className="hero-reveal absolute inset-0 z-10">
            <HeroRevealContext.Provider value={revealed}>
              {children}
            </HeroRevealContext.Provider>

            <div
              aria-hidden="true"
              className="hero-darken pointer-events-none absolute inset-0 bg-[#0A131F] opacity-0"
            />
          </div>

          <div className="intro-layer absolute inset-0 z-20 bg-[#BFA76F]">
            {intro}
          </div>

          <ApertureIris className="intro-iris z-30" />
        </div>
      </div>
    </div>
  );
}
