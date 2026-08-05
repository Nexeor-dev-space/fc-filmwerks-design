import Image from 'next/image';

/**
 * Fine film grain, the same turbulence patch used across the cinematic
 * sections — one tiling data URI costs nothing to fetch and keeps the flat
 * gold from reading as a printed swatch.
 */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

/**
 * The gold plate between the closing CTA and the footer.
 *
 * A tall wrapper gives the scroll distance; the plate inside is `position:
 * sticky` so it holds dead centre in the viewport while the page moves past
 * it. Nothing here is scroll-driven by JavaScript — the hold is the browser's
 * own sticky implementation and the lens turns on a CSS keyframe, so the whole
 * section costs one composited layer and no per-frame work.
 *
 * The footer that follows carries a negative top margin equal to one viewport,
 * which is what actually ends the shot: it climbs over the still-pinned lens
 * and covers it completely. That coupling is load-bearing — changing the
 * margin there without changing the wrapper height here will either strand the
 * lens on screen or cut its hold to nothing.
 *
 * The plate is also pulled up one viewport *underneath* the CTA above it,
 * which is what makes the lens read as fixed rather than as arriving. Without
 * that, the section would scroll up from the bottom of the screen and the lens
 * would visibly travel to its resting place before pinning. Starting behind an
 * opaque CTA means it is already pinned and already centred by the time any of
 * it is visible — the CTA sliding away *uncovers* it, the footer later covers
 * it again, and the lens itself never moves a pixel in between.
 *
 * Wrapper height = 100dvh (hidden behind the CTA) + 100dvh (the sticky plate)
 * + 100dvh (the footer's climb) + the hold where the lens sits alone:
 *   mobile:  320dvh → 20dvh hold
 *   desktop: 360dvh → 60dvh hold
 *
 * A server component: there is no state, no effect and no interactivity.
 */
export function LensTransition() {
  return (
    /* No `overflow-hidden` on this wrapper — a clipping ancestor is the one
       thing that silently disables the sticky child inside it. */
    <section
      aria-hidden="true"
      className="relative -mt-[100dvh] h-[320dvh] w-full bg-[#BFA76F] md:h-[360dvh]"
    >
      <div className="sticky top-0 z-[1] flex h-dvh w-full items-center justify-center overflow-hidden bg-[#BFA76F]">
        {/* Warm key light behind the lens — the only lift in the whole plate,
            and kept well under a stop so the gold stays flat and matte. */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 55% 45% at 50% 45%, rgba(255,246,224,0.22) 0%, transparent 70%)',
          }}
        />

        {/* Vignette — roughly a tenth of a stop down at the corners, enough to
            seat the frame without reading as a filter. */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 75% 70% at 50% 50%, transparent 45%, rgba(74,58,28,0.12) 100%)',
          }}
        />

        {/* Grain, then a second finer noise pass at very low opacity. Together
            they break up the banding a large flat fill would otherwise show. */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-overlay"
          style={{ backgroundImage: GRAIN }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-soft-light"
          style={{ backgroundImage: GRAIN, backgroundSize: '70px 70px' }}
        />

        {/*
         * Lens. Three nested elements, each owning exactly one job: the outer
         * sizes it, the middle carries the drop shadow, and only the innermost
         * rotates. Collapsing the shadow onto the rotating element would be
         * harmless for a circle but would break the rule the rest of the site
         * follows, and the next person to add a float here would get bitten.
         */}
        {/*
         * Centred by flex rather than the usual `left:50% + translate(-50%,-50%)`.
         * Same result, but it leaves `transform` entirely free for the rotation
         * below — a translate on this element and a rotate on the child would
         * be two transforms fighting over one property the moment anyone
         * touched the centring.
         *
         * Width is capped against the viewport *height* as well as its width,
         * so a short laptop window shrinks the lens instead of clipping it.
         */}
        <div className="relative w-[76vw] max-w-[300px] md:w-[56vw] md:max-w-[min(68vh,460px)] lg:w-[48vw] lg:max-w-[min(68vh,600px)] xl:w-[44vw] xl:max-w-[min(70vh,680px)]">
          {/* Ambient contact shadow, pooled beneath the barrel. Static — it is
              the floor the lens sits on, so it must not turn with it. */}
          <div
            className="pointer-events-none absolute inset-x-[8%] bottom-[-6%] h-[14%] rounded-[50%] blur-xl"
            style={{ background: 'rgba(58,44,20,0.38)' }}
          />

          <div className="relative drop-shadow-[0_26px_50px_rgba(58,44,20,0.35)]">
            <div className="lens-spin-slow">
              <Image
                src="/images/cinema-lens.png"
                alt=""
                width={1024}
                height={1024}
                sizes="(min-width: 1280px) 680px, (min-width: 1024px) 600px, (min-width: 768px) 460px, 76vw"
                className="h-auto w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
