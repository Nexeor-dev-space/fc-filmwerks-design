'use client';

import { useRef, useState, type ReactNode } from 'react';

import {
  IRIS,
  PIVOT_ORIGIN,
  SEALED_OPENING,
  rotationForOpening,
} from '@/lib/aperture';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { cn } from '@/lib/utils';
import { useIsomorphicLayoutEffect, usePrefersReducedMotion } from '@/hooks';

import { ApertureIris } from './ApertureIris';
import { CinemaLens } from './CinemaLens';
import { HeroRevealContext } from './HeroRevealContext';
import { ScrollIndicator } from './ScrollIndicator';

/*
 * The pin is three consecutive stretches, measured in viewport heights.
 *
 *   APERTURE_SPAN  the lens sequence, ending with the hero revealed
 *   HOLD_SPAN      nothing moves — the hero simply sits there, arrived
 *   COVER_SPAN     the next section climbs over the still-pinned hero
 *
 * The hold is the whole point of this arrangement: without it the covering
 * section starts the instant the iris finishes, and the hero never gets a
 * moment of its own.
 *
 * COVER_SPAN is load-bearing beyond this file — ServicesSection pulls itself
 * up by exactly that much to create the overlap. Change one and the other has
 * to follow.
 */
const APERTURE_SPAN = 2.8;
const HOLD_SPAN = 0.7;
const COVER_SPAN = 1;

const PIN_SPAN = APERTURE_SPAN + HOLD_SPAN + COVER_SPAN;

/** Where the aperture sequence ends, as a fraction of the whole pin. */
const APERTURE_END = APERTURE_SPAN / PIN_SPAN;

/** Where the covering section starts to appear, as a fraction of the pin. */
const COVER_START = (APERTURE_SPAN + HOLD_SPAN) / PIN_SPAN;

/** Rescales a beat expressed against the aperture sequence onto the full pin. */
const beat = (fraction: number) => fraction * APERTURE_END;

/**
 * Where each beat falls, as a fraction of the pinned scroll distance. Keeping
 * them in one table is what makes the choreography legible — and the closed
 * hold is a real gap in the timeline rather than a tween, so the iris genuinely
 * rests before it reopens.
 *
 * The first block is written against the aperture sequence and rescaled; the
 * handoff block is already in whole-pin terms, since it belongs to the stretch
 * after the aperture has finished.
 */
const BEAT = {
  indicatorOut: beat(0),
  lensGrow: beat(0.06),
  irisClose: beat(0.3),
  lensOut: beat(0.48),
  sealed: beat(0.64),
  /** Intro is swapped for the hero here, hidden behind the closed blades. */
  swap: beat(0.66),
  irisOpen: beat(0.76),

  /* ── Handoff: the hero recedes as the next section covers it ───────────
     Both are anchored past COVER_START so nothing here begins during the
     hold — the hero must be completely still until the cover is underway. */
  heroSettle: COVER_START + 0.02,
  frameSquare: COVER_START + 0.12,
} as const;

interface IntroExperienceProps {
  /** Revealed through the aperture; becomes the page once the iris reopens. */
  children: ReactNode;
  className?: string;
}

/**
 * Full-screen intro that hands off to the hero through a closing camera iris.
 *
 * The sequence, all driven by one scrubbed timeline pinned to the viewport:
 *
 *  1. the scroll cue retires and the lens grows a little
 *  2. the iris blades swing shut over the whole frame
 *  3. a beat of held black — where the intro is quietly swapped for the hero
 *  4. the blades reopen onto the hero, which settles from slightly oversized
 *
 * The lens is never explicitly removed; it fades as the blades close over it,
 * so it reads as being swallowed by the aperture.
 */
export function IntroExperience({ children, className }: IntroExperienceProps) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  // Held false until the blades reopen, so the hero's entrance is not spent
  // while it sits hidden behind the intro. Reduced motion shows both sections
  // as ordinary stacked content, so there is nothing to wait for.
  const [revealed, setRevealed] = useState(false);

  useIsomorphicLayoutEffect(() => {
    // Reduced motion gets a plain stacked layout — no pin, no iris, no drift.
    if (reduced || !root.current) return;

    const mm = gsap.matchMedia(root);

    mm.add(
      { isMobile: '(max-width: 767px)', isDesktop: '(min-width: 768px)' },
      (context) => {
        const { isMobile } = context.conditions as { isMobile: boolean };
        // Everything is deliberately understated; on phones, more so.
        const k = isMobile ? 0.5 : 1;

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

        // Continuous barrel turn. Linear and very slow — it should register as
        // the lens being alive, not as a spinning graphic. Slower again on
        // phones, where the same angular rate reads as faster on a small lens.
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

        // Scroll cue: a light travelling down the hairline.
        gsap.fromTo(
          '.scroll-dot',
          { yPercent: -110, opacity: 0 },
          {
            yPercent: 280,
            opacity: 1,
            duration: 2.4,
            ease: 'power2.inOut',
            repeat: -1,
            repeatDelay: 0.5,
          },
        );

        /* ── Scroll sequence ──────────────────────────────────────────── */

        const element = root.current;
        if (!element) return;

        /*
         * The iris is driven by its opening radius, not by blade angle — see
         * `rotationForOpening`. One proxy object carries the radius through the
         * timeline and every blade is set from it on each render.
         */
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
              trigger: element,
              start: 'top top',
              end: `+=${PIN_SPAN * 100}%`,
              pin: true,
              // A touch of smoothing so the blades trail the wheel rather than
              // snapping frame to frame.
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          }));

          tl.to(
            '.intro-indicator',
            { opacity: 0, y: 14, duration: 0.1, ease: 'power2.in' },
            BEAT.indicatorOut,
          )
            .to(
              '.lens-scroll',
              { scale: 1 + 0.22 * k, duration: 0.54, ease: 'power1.inOut' },
              BEAT.lensGrow,
            )
            .to(
              aperture,
              { opening: SEALED_OPENING, duration: 0.34, ease: 'power2.inOut' },
              BEAT.irisClose,
            )
            .to(
              '.lens-scroll',
              { opacity: 0, duration: 0.16, ease: 'power2.in' },
              BEAT.lensOut,
            )
            // Sealed: swap what sits under the blades. Zero-duration sets
            // reverse cleanly when the visitor scrolls back up.
            .set('.intro-layer', { autoAlpha: 0 }, BEAT.swap)
            // — held black between `sealed` and `irisOpen` —
            .to(
              aperture,
              { opening: IRIS.radius, duration: 0.24, ease: 'power2.inOut' },
              BEAT.irisOpen,
            )
            .fromTo(
              '.hero-reveal',
              { scale: 1 + 0.16 * k },
              { scale: 1, duration: 0.24, ease: 'power2.out' },
              BEAT.irisOpen,
            )

            /* ── Handoff ────────────────────────────────────────────────
               The hero stays pinned while the section below climbs over it.
               These recede it just enough to read as depth — the covering
               section is what actually ends the shot. */
            .to(
              '.hero-reveal video',
              { scale: 0.98, duration: 0.2, ease: 'power2.inOut' },
              BEAT.heroSettle,
            )
            .to(
              '.hero-darken',
              { opacity: 0.35, duration: 0.2, ease: 'power1.inOut' },
              BEAT.heroSettle,
            )
            .to(
              ['.hero-copy', '.hero-reveal header'],
              { opacity: 0, y: -18, duration: 0.14, ease: 'power2.in' },
              BEAT.heroSettle,
            )
            // Square off only once the covering section has nearly reached the
            // top, so the corners never straighten in open view.
            .to(
              '.intro-frame',
              { borderRadius: 0, duration: 0.1, ease: 'power2.inOut' },
              BEAT.frameSquare,
            );

          // Sync the blades from the whole timeline rather than from each
          // aperture tween: this also covers the held-closed gap and the exact
          // end of a tween, where a per-tween onUpdate can miss the last frame
          // and leave the iris a fraction short of open.
          tl.eventCallback('onUpdate', () => {
            applyAperture();
            // Latches once: scrubbing back up should not replay the hero's
            // entrance every time the visitor passes this point.
            if (tl.progress() >= BEAT.irisOpen) setRevealed(true);
          });
        };

        /*
         * Pinning a zero-height element permanently freezes it at zero — the
         * pin writes an inline height, so it can never grow back. That happens
         * whenever the stylesheet has not applied by the time this effect runs
         * (the dev server injects CSS through JS), so wait for a real
         * measurement before building the trigger rather than repairing it
         * afterwards.
         */
        if (element.offsetHeight > 0) {
          build();
        } else {
          observer = new ResizeObserver(() => {
            if (element.offsetHeight === 0) return;
            observer?.disconnect();
            observer = null;
            build();
          });
          observer.observe(element);
        }

        return () => {
          observer?.disconnect();
          timeline?.scrollTrigger?.kill();
          timeline?.kill();
        };
      },
    );

    // Late-loading fonts and images shift the layout; without this the pin
    // keeps the distance it measured before they landed.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    void document.fonts?.ready.then(refresh);

    return () => {
      window.removeEventListener('load', refresh);
      mm.revert();
    };
  }, [reduced]);

  const intro = (
    <>
      {/* The lens, and nothing else. Nested wrappers keep the idle loops and
          the scroll timeline on separate elements so neither overwrites the
          other's transform. */}
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

      {/* The centring transform lives on the wrapper, because GSAP animates
          `y` on the indicator and would overwrite a translate set in CSS.
          Navy is 7.9:1 on the gold ground; the cue inherits it. */}
      <div className="absolute inset-x-0 bottom-10 flex justify-center text-[#0F1C2E]">
        <ScrollIndicator className="intro-indicator" />
      </div>
    </>
  );

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
        {/* A definite height, so the hero's `min-h-full` has something to
            resolve against. */}
        <div className="hero-reveal relative mt-2 h-[calc(100dvh-1rem)] overflow-hidden rounded-[10px] md:mt-3 md:h-[calc(100dvh-1.5rem)]">
          {children}
        </div>
      </div>
    );
  }

  return (
    // The page ground shows through as a thin frame around the whole
    // experience. Pinning stays on this full-bleed element — insetting the
    // pinned element itself would fight ScrollTrigger's spacer.
    <div
      ref={root}
      className={cn(
        'relative h-dvh w-full overflow-hidden bg-background',
        className,
      )}
    >
      {/* Everything is framed together, the iris included, so the blades are
          clipped to the same rounded rectangle as the footage. The radius is
          animated to 0 at the end of the pin, as the next section closes over
          it — a rounded corner meeting a full-bleed section would show the
          page ground through the gap. */}
      <div className="intro-frame absolute inset-2 overflow-hidden rounded-[28px] md:inset-3">
        {/* The hero sits underneath from the start, hidden by the opaque intro
            layer. Nothing has to fade in, and if JavaScript never runs the
            visitor simply sees the intro. */}
        <div className="hero-reveal absolute inset-0 z-10">
          <HeroRevealContext.Provider value={revealed}>
            {children}
          </HeroRevealContext.Provider>

          {/* Deepens the hero as it recedes behind the incoming section. */}
          <div
            aria-hidden="true"
            className="hero-darken pointer-events-none absolute inset-0 bg-[#0A131F] opacity-0"
          />
        </div>

        <div className="intro-layer absolute inset-0 z-20 bg-[#BFA76F]">
          {intro}
        </div>

        <ApertureIris className="z-30" />
      </div>
    </div>
  );
}
