'use client';

import { motion, type Transition, type Variants } from 'framer-motion';
import Image from 'next/image';
import { useMemo } from 'react';

import { DURATION, EASE } from '@/constants';
import { useIsMobile, usePrefersReducedMotion } from '@/hooks';

/**
 * The production gallery from the original portfolio page, pulled across at
 * source resolution rather than re-shot with placeholders.
 *
 * Ten exist in `public/images/behind-the-frame`; the grid shows the first
 * eight, which is what the 4×2 composition holds. The remaining two are on
 * disk and can be dropped in if the layout ever grows a third row.
 */
const FRAMES = Array.from({ length: 8 }, (_, i) => ({
  src: `/images/behind-the-frame/bts-${String(i + 1).padStart(2, '0')}.jpg`,
  /* Decorative: the set as a whole is the content, and eight invented
     descriptions would be noise to a screen reader, not information. */
  alt: '',
}));

interface Cue {
  rise: number;
  reduced: boolean;
}

const gridVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

/**
 * Reduced motion snaps the transform and keeps the fade.
 *
 * Written as a zero-duration transition rather than a second variant: the
 * media query only resolves after mount, so the hidden state is already in the
 * DOM by then. Snapping on the way out clears whatever was baked in, where
 * swapping variants would leave the transform stranded.
 */
const REDUCED: Transition = {
  duration: 0,
  opacity: { duration: DURATION.base, ease: EASE.out },
};

const frameVariants: Variants = {
  hidden: ({ rise, reduced }: Cue) => ({
    opacity: 0,
    y: reduced ? 0 : rise,
    scale: reduced ? 1 : 0.96,
  }),
  visible: ({ reduced }: Cue) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: reduced ? REDUCED : { duration: DURATION.slow, ease: EASE.out },
  }),
};

const headerVariants: Variants = {
  hidden: ({ reduced }: Cue) => ({ opacity: 0, y: reduced ? 0 : 24 }),
  visible: ({ reduced }: Cue) => ({
    opacity: 1,
    y: 0,
    transition: reduced ? REDUCED : { duration: DURATION.base, ease: EASE.out },
  }),
};

/**
 * Behind the frame — the production side of the studio.
 *
 * Deliberately quieter than the project cards above it: no titles, no
 * metadata, no route-through. The projects are the work; this is the room the
 * work is made in, and giving it the same weight would flatten the hierarchy
 * of the page.
 *
 * The set photograph behind the grid is heavily scrimmed and blurred on
 * purpose — it is a ground for the gallery, not a competing image.
 */
export function BehindTheFrame() {
  const reduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  const cue = useMemo<Cue>(
    () => ({ rise: isMobile ? 20 : 32, reduced }),
    [isMobile, reduced],
  );

  return (
    <section
      aria-labelledby="behind-the-frame-heading"
      className="relative overflow-hidden bg-[#0F1012] py-20 md:py-24 lg:py-28"
    >
      {/* Ground: a set photograph, pushed well back. */}
      <div aria-hidden="true" className="absolute inset-0">
        <Image
          src="/images/services/videography.jpg"
          alt=""
          fill
          loading="lazy"
          sizes="100vw"
          className="scale-105 object-cover blur-[6px]"
        />
        <div className="absolute inset-0 bg-[#0F1012]/88" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 90% 70% at 50% 50%, transparent 35%, rgba(15,16,18,0.85) 100%)',
          }}
        />
      </div>

      <div className="relative z-10 w-full px-4 md:px-[3vw]">
        <motion.header
          className="mb-12 md:mb-16"
          variants={headerVariants}
          custom={cue}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
        >
          <p className="mb-5 text-[0.875rem] font-semibold tracking-[0.28em] text-[#BFA76F] uppercase">
            Behind the frame
          </p>
          <h2
            id="behind-the-frame-heading"
            className="max-w-[20ch] text-[1.75rem] leading-[1.1] font-extralight tracking-tight text-white md:text-[2.25rem] lg:text-[2.75rem]"
          >
            Cameras, crew and the hours that never make the cut.
          </h2>
        </motion.header>

        {/*
         * 4×2 on desktop, 2×4 on tablet and phones. Every cell is square, so
         * the grid stays even whatever the source crops were — these arrive at
         * 900×900 already.
         */}
        <motion.ul
          className="grid grid-cols-2 gap-5 md:gap-6 lg:grid-cols-4"
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {FRAMES.map((frame) => (
            <motion.li key={frame.src} variants={frameVariants} custom={cue}>
              {/* The wrapper clips and carries the gold edge; the image inside
                  owns the zoom, so the two transforms never collide. */}
              <div className="group relative aspect-square overflow-hidden rounded-[20px] ring-1 ring-white/[0.08] transition-[box-shadow] duration-[600ms] ease-out hover:ring-[#BFA76F]/45 md:rounded-[24px]">
                <Image
                  src={frame.src}
                  alt={frame.alt}
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover brightness-[0.82] transition-[transform,filter] duration-[650ms] ease-out group-hover:scale-[1.05] group-hover:brightness-100"
                />
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
