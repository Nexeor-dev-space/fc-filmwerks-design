'use client';

import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

import { aboutIntro } from '@/config/about';
import { EASE } from '@/constants';
import { usePrefersReducedMotion } from '@/hooks';

/** Fine film grain, the same texture used across the cinematic sections. */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

const fadeUp: Variants = {
  hidden: ({ still }: { delay: number; still: boolean }) => ({
    opacity: 0,
    y: still ? 0 : 32,
  }),
  visible: ({ delay, still }: { delay: number; still: boolean }) => ({
    opacity: 1,
    y: 0,
    transition: still
      ? { duration: 0.4, ease: EASE.out, delay, y: { duration: 0 } }
      : { duration: 0.85, ease: EASE.expo, delay },
  }),
};

/**
 * The studio's own description, set as an editorial spread.
 *
 * The still's movement is entirely scroll-driven rather than fired once on
 * entry. That is a deliberate choice carried over from the homepage: a
 * `useTransform` motion value always resolves, so there is no state in which a
 * missed trigger leaves the picture stranded. Masks that start closed can fail
 * closed, which turns a dropped animation into deleted content.
 */
export function AboutIntro() {
  const reducedMotion = usePrefersReducedMotion();
  const stillRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: stillRef,
    offset: ['start end', 'end start'],
  });

  /* 56px of drift against the page; the wrapper is overscanned by more. */
  const parallaxY = useTransform(scrollYProgress, [0, 1], [28, -28]);
  /* A slow pull-out across the pass — the frame settles as it is read. */
  const parallaxScale = useTransform(scrollYProgress, [0, 1], [1.12, 1]);
  /* Floors at 0.25 rather than 0: a stuck progress value should leave a dim
     picture, never an absent one. */
  const revealOpacity = useTransform(scrollYProgress, [0, 0.3], [0.25, 1]);

  return (
    <section
      id="about-intro"
      aria-labelledby="about-intro-heading"
      className="bg-[#0F1012] pt-20 pb-20 md:pt-28 md:pb-24 lg:pt-32 lg:pb-28"
    >
      <div className="w-full px-4 md:px-[3vw]">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-20">
          <div className="lg:w-[46%] lg:shrink-0">
            <motion.p
              className="mb-5 text-[0.875rem] font-semibold tracking-[0.28em] text-[#BFA76F] uppercase"
              variants={fadeUp}
              custom={{ delay: 0, still: reducedMotion }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.6 }}
            >
              {aboutIntro.label}
            </motion.p>

            <motion.h2
              id="about-intro-heading"
              className="text-[2.5rem] leading-[0.95] font-semibold tracking-[-0.02em] text-white uppercase md:text-[3.375rem] lg:text-[4rem] xl:text-[4.5rem]"
              variants={fadeUp}
              custom={{ delay: 0.08, still: reducedMotion }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.6 }}
            >
              {aboutIntro.heading.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </motion.h2>
          </div>

          <div className="lg:flex-1 lg:pt-4">
            <motion.p
              className="max-w-[62ch] text-[1rem] leading-[1.8] text-white/[0.72] md:text-[1.0625rem] lg:text-[1.125rem]"
              variants={fadeUp}
              custom={{ delay: 0.16, still: reducedMotion }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
            >
              {aboutIntro.body}
            </motion.p>
          </div>
        </div>

        {/* Studio still, almost edge to edge inside the gutter. Three nested
            elements, one job each — parallax, pull-out, then the image — so no
            two animations ever share a `transform`. */}
        <div
          ref={stillRef}
          className="relative mt-16 aspect-video overflow-hidden rounded-[28px] border border-white/[0.08] lg:mt-24"
        >
          <motion.div
            className="absolute inset-x-0 -top-10 -bottom-10"
            style={
              reducedMotion
                ? undefined
                : { y: parallaxY, opacity: revealOpacity }
            }
          >
            <motion.div
              className="absolute inset-0"
              style={reducedMotion ? undefined : { scale: parallaxScale }}
            >
              <Image
                src={aboutIntro.image}
                alt={aboutIntro.imageAlt}
                fill
                loading="lazy"
                sizes="100vw"
                className="object-cover"
              />
            </motion.div>
          </motion.div>

          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#0A131F]/60 via-transparent to-[#0A131F]/20"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.1] mix-blend-overlay"
            style={{ backgroundImage: GRAIN }}
          />
        </div>
      </div>
    </section>
  );
}
