'use client';

import { useRef, useState, type ReactNode } from 'react';

import {
  IRIS,
  SEALED_OPENING,
  coveringOpening,
  setIrisOpening,
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
 * `cover` is load-bearing beyond this file: TrustSection pulls itself up by
 * exactly that much to create the overlap, and its negative margin has to be
 * changed in step at the same breakpoint.
 *
 * `aperture` is kept short on purpose: the lens-grow → iris-close → swap →
 * iris-open sequence is meant to read in about two mouse-wheel notches, not
 * a long dedicated scroll of its own — the hold is what gives the reader a
 * pause, not the aperture.
 *
 * The spans are fractions of the wrapper's scroll range, not viewport heights.
 * The wrapper is 300svh (mobile) / 340svh (desktop), so the scrub runs over
 * 200svh / 240svh and one span unit is ≈51svh / 59svh of scroll.
 *
 * These were roughly twice as long until a review of the built page: an
 * opening shot that costs four screens of scrolling before the next section
 * appears stops reading as a hero and starts reading as a page of its own.
 * The whole sequence — opening, hold and hand-off — now lands inside about
 * three screens, and the hero itself holds for a little over one.
 */
const SPANS = {
  desktop: { aperture: 2, hold: 0.9, cover: 1.2 },
  mobile: { aperture: 2, hold: 0.85, cover: 1.1 },
} as const;

/**
 * The aperture sequence: where each beat starts and how long it runs, both as
 * fractions of the aperture span. `buildTiming` rescales positions and
 * lengths together onto the whole scroll range, so lengthening the hold
 * cannot retime the iris and no tween can outrun the beat that follows it.
 *
 * That second guarantee is the point. An earlier revision rescaled the
 * positions only and left the lengths as raw fractions of the whole range,
 * so every tween ran roughly twice as long as its slot: the lens layer was
 * hidden while the iris was still a third open — a hard cut from lens to
 * hero through a hole most of a phone screen wide — and the blades were
 * still closing when the opening tween took over, so they never actually
 * met. That is what made the camera and the hero feel like two unrelated
 * shots.
 *
 * The order of events now:
 *   0.00 – 0.12  scroll cue leaves
 *   0.04 – 0.58  lens pushes in toward the reader; the wordmark sinks
 *   0.26 – 0.58  blades swing shut over the lens and seal
 *   0.42 – 0.58  the last of the lens dims inside the closing opening
 *   0.58 – 0.68  black — the gold layer fades out behind the sealed blades
 *   0.68 – 1.00  blades part onto the hero, which settles from oversized
 *
 * One aperture unit is ≈101svh of scroll on a phone and ≈117svh on desktop,
 * so the close takes about a third of a screen and the sealed beat about a
 * tenth: long enough to register as a blink, short enough that one wheel
 * notch or a flick carries through it rather than stalling in the dark.
 */
const SEQUENCE = {
  indicatorOut: { at: 0, span: 0.12 },
  lensGrow: { at: 0.04, span: 0.54 },
  logoOut: { at: 0.04, span: 0.4 },
  irisClose: { at: 0.26, span: 0.32 },
  lensOut: { at: 0.42, span: 0.16 },
  layerOut: { at: 0.58, span: 0.06 },
  irisOpen: { at: 0.68, span: 0.32 },
} as const;

type Cue = keyof typeof SEQUENCE;

/**
 * How long the page has to sit still before the intro tree is retired.
 *
 * The swap shortens the page by more than a viewport and moves the reader's
 * scroll position by the same amount to compensate. Done while the page is
 * moving — mid-fling on a phone, or while Lenis is still gliding — that is a
 * layout change and a programmatic scroll landing under a scroll that is
 * already in flight, and browsers do not agree on what happens next. Done
 * while the page is at rest it is invisible: every element keeps its place
 * on screen and nothing is animating.
 *
 * 250ms is comfortably past the gap between momentum-scroll events on both
 * platforms, and short enough that the reader never notices a wait — nothing
 * they can see depends on the swap having happened.
 */
const SETTLE_MS = 250;

interface Timing {
  /** Where a cue starts, as a fraction of the whole scroll range. */
  at: (cue: Cue) => number;
  /** How long it runs, in the same units. */
  span: (cue: Cue) => number;
  /**
   * The intro has nothing left to show — the iris is fully open and the
   * hero's settle has landed. From here the intro tree is retired as soon
   * as the page comes to rest. It must sit AFTER the reveal tweens end, not
   * where they begin: retiring at `irisOpen` tears the timeline down
   * mid-reveal and cuts the opening to a single frame.
   */
  introSpent: number;
}

/**
 * Maps the aperture sequence onto the whole scroll range for a set of spans.
 *
 * Nothing is placed inside the hold or the cover: the hero is meant to sit
 * still there, and the recede as the next section climbs over it belongs to
 * its own timeline (see the cover effect below), which has to outlive this one.
 */
function buildTiming(spans: (typeof SPANS)[keyof typeof SPANS]): Timing {
  const pin = spans.aperture + spans.hold + spans.cover;
  const apertureEnd = spans.aperture / pin;

  return {
    at: (cue) => SEQUENCE[cue].at * apertureEnd,
    span: (cue) => SEQUENCE[cue].span * apertureEnd,
    introSpent: apertureEnd + 0.01,
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
 * TrustSection sits after the wrapper with a negative top margin equal to
 * `cover`, so it slides upward over the still-stuck hero during the last
 * phase of the timeline.
 *
 * One tree, three states. The intro-playing, intro-spent and skip-intro
 * layouts are the same markup with the intro layers conditionally present
 * and the wrapper's height switched — never two different trees. The hero is
 * this component's `children`, and React keeps a child mounted only while
 * its position in the tree is unchanged. An earlier revision rendered a
 * separate, shallower tree once the intro was spent, and the hero remounted
 * with it: the headline slid in a second time, the background video reloaded
 * and restarted from its first frame, and the frame around the hero snapped
 * from inset to full-bleed — all about half a screen after the reveal, which
 * on a phone read as the opening playing twice.
 */
export function IntroExperience({ children, className }: IntroExperienceProps) {
  const root = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  const [revealed, setRevealed] = useState(false);

  const [skipIntro, setSkipIntro] = useState(false);

  /*
   * Set once the iris has opened, the hero is on screen and the page has
   * come to rest. From then on the intro is spent for this page view: the
   * intro layers leave the tree and the wrapper shrinks to the hero-only
   * height below, so scrolling back to the top lands on the hero rather than
   * replaying the opening.
   *
   * Deliberately React state and nothing else. `sessionStorage` would survive
   * a reload, and the intro is meant to play again on refresh, in a new tab
   * and on a fresh visit — all of which remount this component and reset the
   * flag on their own. "Once per page view" is exactly a state variable's
   * lifetime, so there is nothing to persist or clear.
   */
  const [introComplete, setIntroComplete] = useState(false);

  /* The wrapper's height, read just before the swap shrinks it. The scroll
     remap below needs the before/after difference, and by the time the
     layout effect runs the new height is already in place. */
  const preSwapWrapperHeight = useRef(0);

  const lenis = useLenis();

  const done = skipIntro || introComplete;

  useIsomorphicLayoutEffect(() => {
    if (hasSeenIntro()) setSkipIntro(true);
  }, []);

  /*
   * Swapping the layout drops the intro's scroll distance — the wrapper goes
   * from 300svh to 180svh (340 to 200 on desktop) — so the page under the
   * reader gets shorter by more than a viewport. Left alone, the section
   * below would jump up and cover the hero the instant the swap lands.
   *
   * The reader's scroll is therefore shifted by exactly the height the page
   * lost, not sent to the top. Subtracting the delta keeps every visible
   * relationship: the hero stays pinned identically on both sides of the
   * swap, and the section covering it stays exactly where they see it. A
   * plain `scrollTo(0)` here would teleport the reader back to the top.
   *
   * A layout effect so it lands in the same commit as the swap, before paint.
   * Lenis is told directly — it keeps its own scroll position and would
   * otherwise animate back to where it thought it was.
   *
   * Scroll anchoring is switched off for the one layout this forces. The
   * browser's own anchoring would see the covering section move up by the
   * lost height and correct the scroll position for it on its own — and then
   * this effect would correct it again. Disabling it on the root element is
   * scoped to the forced layout and put back straight after.
   *
   * Every other ScrollTrigger on the page measured its positions against the
   * taller wrapper, so they are refreshed once the scroll has been moved.
   */
  useIsomorphicLayoutEffect(() => {
    if (!introComplete) return;

    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const html = document.documentElement;
    html.style.setProperty('overflow-anchor', 'none');

    const removed = Math.max(
      0,
      preSwapWrapperHeight.current - wrapper.offsetHeight,
    );
    const target = Math.max(0, window.scrollY - removed);

    lenis?.scrollTo(target, { immediate: true, force: true });
    window.scrollTo(0, target);

    html.style.removeProperty('overflow-anchor');
    ScrollTrigger.refresh();
  }, [introComplete, lenis]);

  /*
   * The hero receding as the next section climbs over it: the frame dims,
   * the copy lifts away before the curtain reaches it, and the footage pulls
   * back a touch so the covering section reads as sliding over a stage
   * rather than over a photograph.
   *
   * Its own timeline, deliberately outside the intro's. The intro timeline is
   * torn down when the intro is spent, so anything placed inside it for the
   * cover phase died with it — this used to be there and never played. This
   * one is keyed to the covering section itself (the wrapper's next sibling,
   * which TrustSection is by contract), so it means the same thing before and
   * after the swap and on a repeat visit that skipped the intro entirely.
   *
   * No element here is touched by any other tween: the intro scales
   * `.hero-reveal`, this moves the video inside it and the copy block, whose
   * children Framer animates on their own.
   */
  useIsomorphicLayoutEffect(() => {
    if (reduced) return;

    const element = root.current;
    const wrapper = wrapperRef.current;
    const cover = wrapper?.nextElementSibling;
    if (!element || !wrapper || !cover) return;

    const context = gsap.context(() => {
      gsap
        .timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: cover,
            start: 'top bottom',
            endTrigger: wrapper,
            end: 'bottom bottom',
            scrub: true,
            invalidateOnRefresh: true,
          },
        })
        .to('.hero-darken', { opacity: 0.35, duration: 1 }, 0)
        .to(
          '.hero-copy',
          { opacity: 0, y: -24, duration: 0.35, ease: 'power1.in' },
          0,
        )
        .to('.hero-reveal video', { scale: 0.97, duration: 1 }, 0);
    }, element);

    return () => context.revert();
  }, [reduced]);

  useIsomorphicLayoutEffect(() => {
    if (reduced || done) return;

    const element = root.current;
    const wrapper = wrapperRef.current;
    if (!element || !wrapper) return;

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

        /* The scroll cue points up on touch screens (see ScrollIndicator),
           so it leaves in the direction it points. */
        const coarsePointer = window.matchMedia('(pointer: coarse)').matches;

        const { at, span, introSpent } = buildTiming(
          isMobile ? SPANS.mobile : SPANS.desktop,
        );

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
          scale: 1 + 0.026 * k,
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
          xPercent: 9 * k,
          yPercent: 6 * k,
          opacity: 0.62,
          duration: 11,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });

        gsap.to('.lens-warm', {
          xPercent: -8 * k,
          yPercent: -5 * k,
          opacity: 0.48,
          duration: 13,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });

        gsap.to('.lens-glint-a', {
          opacity: 0.5,
          duration: 7.5,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });

        gsap.to('.lens-glint-b', {
          opacity: 1,
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

        const blades = element.querySelectorAll('.iris-blade');
        const aperture = { opening: IRIS.radius };
        const covering = coveringOpening(window.innerWidth, window.innerHeight);

        /* The timeline tweens `aperture.opening`; the blades are written
           straight to the SVG on every update. Deliberately not a GSAP
           tween — see the note on `setIrisOpening`. */
        const applyAperture = () => setIrisOpening(blades, aperture.opening);

        applyAperture();

        let timeline: gsap.core.Timeline | null = null;
        let observer: ResizeObserver | null = null;
        let settle: number | undefined;
        let frozen = false;

        /*
         * The opening shot plays once, forward.
         *
         * A scrubbed timeline is reversible by nature, so scrolling back up
         * after the reveal used to re-close the iris and bring the gold layer
         * back — and because the timeline lags the scroll, a reader who
         * overshot and corrected could cross that boundary several times in a
         * second. The page appeared to flicker between the lens and the hero.
         *
         * Once the reveal has landed the timeline is therefore torn down and
         * the final state pinned, so scrolling back up shows the hero rather
         * than replaying the opening. That is what the intro already promised
         * once it retired its layers; this simply starts honouring it at the
         * moment the shot ends rather than at the swap, which the reader has
         * to stop scrolling to reach.
         */
        const freeze = () => {
          if (frozen) return;
          frozen = true;

          /* The wrapper's height is captured before the swap shrinks it — the
             layout effect needs it to keep the reader's place. */
          preSwapWrapperHeight.current = wrapper.offsetHeight;

          /*
           * The spent state is a document attribute driving plain CSS, not a
           * set of inline styles, because inline styles here belong to GSAP
           * and GSAP takes them back.
           *
           * This used to pin the final state with `gsap.set` and then kill the
           * timeline a frame later. Killing a ScrollTrigger reverts every
           * style its animation recorded, so one frame after the reveal the
           * whole intro sprang back to its opening frame — gold ground, lens
           * at rest, scroll cue lit — and with the timeline dead there was
           * nothing left to put it right again. It sat there until the swap
           * unmounted it a second or two later, which is what a reader saw as
           * the opening playing a second time.
           *
           * So the timeline is left alone. It goes on scrubbing against the
           * wrapper until React removes the whole subtree, and the rules keyed
           * off this attribute keep what it writes off the screen. An
           * attribute cannot be reverted by an animation library.
           */
          document.documentElement.setAttribute('data-intro-spent', 'true');

          armSettle();
        };

        /*
         * Retire the intro's layers once the shot has played and the page has
         * been still for `SETTLE_MS`. The rest is what matters: the swap
         * shortens the page and moves the reader's scroll to compensate, and
         * doing that mid-fling lands a programmatic scroll under one already
         * in flight. Re-armed on every scroll event, so it only fires in a
         * genuine pause.
         */
        function armSettle() {
          window.clearTimeout(settle);
          settle = window.setTimeout(() => {
            settle = undefined;
            if (!frozen) return;
            setIntroComplete(true);
          }, SETTLE_MS);
        }

        const onScroll = () => {
          if (frozen) armSettle();
        };

        window.addEventListener('scroll', onScroll, { passive: true });

        const build = () => {
          const tl = (timeline = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: wrapper,
              start: 'top top',
              end: 'bottom bottom',
              // `scrub` is a smoothing delay between actual scroll position
              // and the animation catching up to it. Touch gets a short one
              // rather than none: nothing here is attached to the page
              // content, so a little lag behind the finger is invisible,
              // whereas a flick with no smoothing steps the timeline in jumps
              // big enough to skip the shutter closing altogether — the
              // sequence played as a cut. A third of a second lets a flick
              // still play it.
              //
              // Desktop was a full second, which sat on top of Lenis' own
              // 1.2s easing: the shutter kept moving long after the wheel had
              // stopped, so it read as something playing at the reader rather
              // than something they were driving. Half a second still smooths
              // the notches without breaking that connection.
              scrub: isMobile ? 0.35 : 0.5,
              invalidateOnRefresh: true,
            },
          }));

          tl.to(
            '.intro-indicator',
            {
              opacity: 0,
              y: coarsePointer ? -14 : 14,
              duration: span('indicatorOut'),
              ease: 'power2.in',
            },
            at('indicatorOut'),
          )
            .to(
              '.lens-scroll',
              {
                scale: 1 + 0.3 * k,
                duration: span('lensGrow'),
                ease: 'power1.inOut',
              },
              at('lensGrow'),
            )
            .to(
              '.lens-logo',
              {
                y: -20 * k,
                scale: 1.03,
                opacity: 0.07,
                duration: span('logoOut'),
                ease: 'power1.inOut',
              },
              at('logoOut'),
            )
            /* `fromTo` rather than `to`, so the whole tween is spent on the
               part of the sweep that is on screen — see `coveringOpening`.
               `immediateRender: false` keeps it from seizing the aperture at
               build time, when the timeline has not been scrolled to yet. */
            .fromTo(
              aperture,
              { opening: covering },
              {
                opening: SEALED_OPENING,
                duration: span('irisClose'),
                ease: 'power2.inOut',
                immediateRender: false,
              },
              at('irisClose'),
            )
            .to(
              ['.lens-scroll', '.lens-logo'],
              { opacity: 0, duration: span('lensOut'), ease: 'power2.in' },
              at('lensOut'),
            )
            /*
             * The gold layer leaves behind the sealed blades, so nothing here
             * is visible either way — but it is a tween rather than a `set`,
             * and it moves `opacity` alone.
             *
             * It used to be `.set(…, { autoAlpha: 0 })`, which flips
             * `visibility` as well. Toggling visibility on a layer the size of
             * the window makes the compositor throw the layer away and build
             * it again, and a scrubbed timeline crosses that beat every time
             * the reader nudges the wheel back and forth over it — ten
             * crossings in a five-cycle scrub, each one a full-screen
             * teardown. That is the flicker. Fading opacity is continuous in
             * both directions and never changes the layer's existence.
             */
            .to(
              '.intro-layer',
              { opacity: 0, duration: span('layerOut') },
              at('layerOut'),
            )
            /* The opening rides a sine curve rather than a power one. Closing
               is a shutter action and wants a bit of snap; opening is the
               reveal, and any acceleration in it reads as the frame being
               yanked apart. */
            .to(
              aperture,
              {
                opening: covering,
                duration: span('irisOpen'),
                ease: 'sine.inOut',
              },
              at('irisOpen'),
            )
            /* Past the frame corners the blades are out of sight, so the last
               stretch to fully open costs no scroll. */
            .set(
              aperture,
              { opening: IRIS.radius },
              at('irisOpen') + span('irisOpen'),
            )
            /* Settles over exactly the same span so the push-in lands with the
               blades, not after them. The starting scale is small on purpose:
               a big punch here is what makes the reveal feel like a jump cut
               rather than a lens pulling focus. */
            .fromTo(
              '.hero-reveal',
              { scale: 1 + 0.09 * k },
              { scale: 1, duration: span('irisOpen'), ease: 'power1.out' },
              at('irisOpen'),
            )
            /* Beats are fractions of the whole scroll range, so the timeline
               has to be exactly one unit long for them to land where they
               say. Without this it ends with the last tween, and everything
               plays proportionally late in the scroll — the reveal used to
               finish after the covering section had already arrived. It also
               makes `time()` and `progress()` the same number. */
            .set({}, {}, 1);

          tl.eventCallback('onUpdate', () => {
            /* Once the shot is spent the timeline is still running, but CSS is
               hiding everything it drives — so there is nothing to apply. */
            if (frozen) return;

            applyAperture();

            if (tl.time() >= at('irisOpen')) {
              setRevealed(true);
              markIntroSeen();
            }
            if (tl.time() >= introSpent) freeze();
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
          window.clearTimeout(settle);
          window.removeEventListener('scroll', onScroll);
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
      /* Reverting is exactly when the intro's own styles come back, so the
         spent rules have to still be in force while it happens. */
      mm.revert();
      document.documentElement.removeAttribute('data-intro-spent');
    };
  }, [reduced, done]);

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
          cue reads as its own element rather than as page furniture. The
          chevron cue is short enough that it never reaches the lens even on
          a short viewport (see the note in globals.css next to the old
          track-based cue's short-viewport rule) — no compaction needed here. */}
      <div className="absolute inset-x-0 bottom-12 flex justify-center text-[#222] md:bottom-16">
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
     * Wrapper height while the intro plays: 300svh on mobile, 340svh on
     * desktop. The timeline's spans are fractions of the resulting scroll
     * range, so the height only decides how much scrolling the whole opening
     * takes; see the note on SPANS for how the cover phase's share is derived.
     *
     * Once the intro is spent — or was skipped, for a returning visitor — the
     * same wrapper drops to 180svh / 200svh: the hero as the landing section
     * outright, still held by CSS sticky, with TrustSection's negative margin
     * pulling it into the last stretch to create the slide-over.
     *   Mobile:  180svh → ~124svh of pure hero hold
     *   Desktop: 200svh → ~130svh of pure hero hold
     * (the wrapper less TrustSection's pull-up of 56svh / 70svh)
     *
     * `svh` for the wrapper, `dvh` for the sticky element. The wrapper is the
     * scroll distance and must not change size when a phone's address bar
     * collapses, or the scrub would jump; the sticky element is what the
     * reader sees and must fill whatever the viewport is right now, or a
     * strip of page background shows beneath the frame for as long as the
     * address bar is away.
     */
    <div
      ref={wrapperRef}
      className={cn(
        'relative w-full',
        done ? 'h-[180svh] md:h-[200svh]' : 'h-[300svh] md:h-[340svh]',
        className,
      )}
    >
      <div
        ref={root}
        className="sticky top-0 h-dvh w-full overflow-hidden bg-background"
      >
        {/* The frame stays after the intro. It is what the reveal opened onto,
            and squaring it off at the swap was the most visible part of the
            old hand-off — an 8px shift of everything in the hero for no
            reason the reader could see. */}
        <div className="intro-frame absolute inset-2 overflow-hidden rounded-[28px] md:inset-3">
          <div className="hero-reveal absolute inset-0 z-10">
            <HeroRevealContext.Provider value={done || revealed}>
              {children}
            </HeroRevealContext.Provider>

            <div
              aria-hidden="true"
              className="hero-darken pointer-events-none absolute inset-0 bg-[#0A131F] opacity-0"
            />
          </div>

          {/* The intro layers sit after the hero so removing them cannot move
              it: React matches children by position, and the hero's is the
              first either way. */}
          {!done && (
            /* `pointer-events-none` because the layer now fades rather
                than being hidden outright: at zero opacity it is still in the
                hit-testing tree, and it covers the hero's buttons. Nothing
                inside it is interactive. */
            <div className="intro-layer pointer-events-none absolute inset-0 z-20 bg-[#BFA76F]">
              {intro}
            </div>
          )}

          {!done && <ApertureIris className="intro-iris z-30" />}
        </div>
      </div>
    </div>
  );
}
