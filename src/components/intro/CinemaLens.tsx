'use client';

import Image from 'next/image';
import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

/**
 * The lens itself: a photographic base plate with live optical layers on top.
 *
 * A flat PNG cannot have moving reflections, so the glass highlights are
 * separate elements composited over it — a cool coating bloom, a warm
 * counter-reflection, and two specular arcs. `IntroExperience` animates them by
 * class name, which keeps all timing in one timeline instead of scattering CSS
 * keyframes through the tree.
 *
 * Sizes are fixed per breakpoint by request: 280 / 450 / 750 px.
 */
export const CinemaLens = forwardRef<HTMLDivElement, { className?: string }>(
  function CinemaLens({ className }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          'relative aspect-square',
          /*
           * One clamp per breakpoint band, so the lens grows with the viewport
           * inside a floor and ceiling rather than jumping between fixed sizes:
           * 180–240 phone, 260–300 tablet, 320–380 laptop, 380–450 desktop.
           *
           * Each is wrapped in `min(…, vh)` as well, because a clamp on width
           * alone will happily exceed a short viewport's height — that is what
           * would push the lens into the scroll cue on a laptop in landscape.
           */
          'h-[min(clamp(180px,55vw,240px),46vh)] w-[min(clamp(180px,55vw,240px),46vh)]',
          'md:h-[min(clamp(260px,34vw,300px),52vh)] md:w-[min(clamp(260px,34vw,300px),52vh)]',
          'lg:h-[min(clamp(320px,30vw,380px),56vh)] lg:w-[min(clamp(320px,30vw,380px),56vh)]',
          'xl:h-[min(clamp(380px,28vw,450px),58vh)] xl:w-[min(clamp(380px,28vw,450px),58vh)]',
          className,
        )}
      >
        {/* Contact shadow — grounds the lens so it does not look pasted on. */}
        <div
          aria-hidden="true"
          className="lens-shadow absolute inset-[8%] rounded-full bg-[#0F1C2E]/12 blur-3xl"
        />

        {/*
         * Solid disc standing in for the lens body. The headline is bone
         * coloured because it sits on dark glass — without something dark
         * beneath it, a slow or failed image load leaves bone text on a bone
         * page and the section reads as completely empty. The photograph
         * covers this entirely once it arrives.
         */}
        {/* Inset past the photograph's own 3.5% margin so the barrel hides it
            completely — any larger and it rims the lens with a navy edge. */}
        <div
          aria-hidden="true"
          className="absolute inset-[5%] rounded-full bg-[#0F1C2E]"
        />

        <Image
          src="/images/cinema-lens.png"
          alt="Front element of a cinema camera lens"
          width={1024}
          height={1024}
          priority
          sizes="(min-width: 1024px) 750px, (min-width: 768px) 450px, 280px"
          className="relative h-full w-full object-contain select-none"
          draggable={false}
        />

        {/* Everything below sits over the front element only — inset to the
            glass, and clipped to a circle so nothing spills onto the barrel. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[13%] overflow-hidden rounded-full"
        >
          {/* Cool coating bloom, drifting on its own slower cycle. */}
          <div
            className="lens-bloom absolute inset-0 opacity-35"
            style={{
              background:
                'radial-gradient(58% 46% at 32% 26%, rgba(120,205,255,0.5) 0%, transparent 62%)',
              mixBlendMode: 'screen',
            }}
          />

          {/* Warm counter-reflection from the opposite side. */}
          <div
            className="lens-warm absolute inset-0 opacity-25"
            style={{
              background:
                'radial-gradient(46% 38% at 71% 76%, rgba(191,167,111,0.55) 0%, transparent 60%)',
              mixBlendMode: 'screen',
            }}
          />

          {/* Two tight specular arcs — the giveaway that glass is curved. */}
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 h-full w-full"
            fill="none"
          >
            <path
              className="lens-glint-a"
              d="M 20 34 A 36 36 0 0 1 45 15"
              stroke="rgba(255,255,255,0.72)"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
            <path
              className="lens-glint-b"
              d="M 78 62 A 32 32 0 0 1 63 81"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1.1"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    );
  },
);
