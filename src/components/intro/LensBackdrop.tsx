'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

import { usePrefersReducedMotion } from '@/hooks';

/**
 * Fine tooth for the ground — stops a flat fill reading as a rendered
 * rectangle rather than a lit surface.
 */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")";

/**
 * Everything behind the lens: a warm pool of light, the wordmark pressed into
 * it, grain, and a vignette to close the frame.
 *
 * The wordmark is `mix-blend-multiply` at a few per cent rather than a low
 * white opacity, which is what makes it read as pressed into the ground
 * instead of floating over it — it darkens the beige it sits on rather than
 * adding a pale film on top.
 *
 * Two nested elements carry the motion because they animate the same property
 * from different sources: the outer runs the mount entrance through Framer,
 * the inner is driven by the pinned scroll timeline in `IntroExperience`.
 * Collapsing them would mean one silently overwriting the other's `transform`.
 */
export function LensBackdrop() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {/* Warm key light, centred on the lens. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(58% 46% at 50% 46%, rgba(255,246,224,0.55) 0%, rgba(191,167,111,0.10) 45%, transparent 78%)',
        }}
      />

      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/*
         * `lens-logo` is the handle the scroll timeline drives. Its own opacity
         * is the resting value; the wrapper's entrance multiplies over it, so
         * the two never fight for the same property.
         *
         * The radial mask is what stops this reading as a pasted watermark —
         * the wordmark dissolves toward its own edges instead of ending on a
         * hard crop, so only the middle, which the lens sits over, is present.
         */}
        <div
          className="lens-logo w-[clamp(280px,92vw,560px)] opacity-[0.05] mix-blend-multiply blur-[2px] contrast-[0.85] md:w-[80vw] md:opacity-[0.07] md:blur-[3px] lg:w-[70vw] lg:opacity-[0.08] xl:w-[68vw] xl:max-w-[1100px]"
          style={{
            maskImage:
              'radial-gradient(68% 130% at 50% 50%, #000 30%, rgba(0,0,0,0.35) 62%, transparent 88%)',
            WebkitMaskImage:
              'radial-gradient(68% 130% at 50% 50%, #000 30%, rgba(0,0,0,0.35) 62%, transparent 88%)',
          }}
        >
          <Image
            src="/images/fc-black-logo.png"
            alt=""
            width={2332}
            height={393}
            priority
            className="h-auto w-full select-none"
            draggable={false}
          />
        </div>
      </motion.div>

      {/* Paper tooth. */}
      <div
        className="absolute inset-0 opacity-[0.18] mix-blend-multiply"
        style={{ backgroundImage: GRAIN }}
      />

      {/* Vignette, drawn after the grain so the corners close over everything. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 95% at 50% 48%, transparent 52%, rgba(96,80,44,0.20) 100%)',
        }}
      />
    </div>
  );
}
