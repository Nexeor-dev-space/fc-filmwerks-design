'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

import { BackgroundVideo } from '@/components/ui';
import { aboutMasthead } from '@/config/about';
import { usePrefersReducedMotion } from '@/hooks';

import { DisplayHeading } from './ChapterHeading';
import { drawRule, rise } from '@/components/animations';

/**
 * Chapter 00 — the masthead.
 *
 * Deliberately *not* a full-screen video hero. The homepage opens on one, the
 * portfolio opens on one, and an About page that opened on a third would be the
 * exact repetition the redesign exists to remove. This opens on type: a
 * publication slug, a statement set at display scale, the studio's own opening
 * sentence as a standfirst, and a fact strip — with the footage demoted to a
 * letterboxed band at the foot of the screen, the way a title sequence sits
 * under a masthead rather than behind it.
 *
 * The band's movement is scroll-driven rather than fired once on entry. A
 * `useTransform` motion value always resolves to something, so there is no
 * state in which a missed trigger leaves the footage stranded — the failure
 * mode a mask that starts closed has, where a dropped animation deletes
 * content outright.
 */
export function AboutMasthead() {
  const reducedMotion = usePrefersReducedMotion();
  const bandRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: bandRef,
    offset: ['start end', 'end start'],
  });

  /* The band is overscanned top and bottom by more than this travel, so the
     drift can never pull a bare edge into frame. */
  const bandY = useTransform(scrollYProgress, [0, 1], [26, -26]);

  return (
    <section
      aria-labelledby="about-masthead-heading"
      className="relative overflow-hidden bg-[#0A131F] pt-32 md:pt-40 lg:pt-44"
    >
      {/* Ambient gold wash behind the type. Low enough that it reads as a lit
          room rather than a gradient. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -left-32 h-[36rem] w-[36rem] rounded-full opacity-[0.22] blur-[120px]"
        style={{
          background:
            'radial-gradient(circle, rgba(191,167,111,0.5) 0%, transparent 68%)',
        }}
      />

      <div className="relative px-5 md:px-8 lg:px-14">
        {/* Publication slug line. */}
        <motion.div
          className="flex items-center gap-5"
          variants={rise}
          custom={{ still: reducedMotion }}
          initial="hidden"
          animate="visible"
        >
          <span className="font-mono text-[0.6875rem] tracking-[0.34em] text-white/45 uppercase">
            {aboutMasthead.slug}
          </span>
          <motion.span
            aria-hidden="true"
            className="h-px flex-1 origin-left bg-white/[0.14]"
            variants={drawRule}
            custom={{ delay: 0.15, still: reducedMotion }}
          />
          <span className="hidden font-mono text-[0.6875rem] tracking-[0.34em] text-[#BFA76F] uppercase md:block">
            Ch. 00
          </span>
        </motion.div>

        <div className="grid grid-cols-1 gap-y-12 pt-14 lg:grid-cols-12 lg:gap-x-12 lg:pt-20">
          {/* The statement runs eight tracks and rags left, so the column of
              air on its right is part of the composition rather than leftover. */}
          <div className="lg:col-span-8">
            <DisplayHeading
              as="h1"
              id="about-masthead-heading"
              lines={aboutMasthead.headline}
              still={reducedMotion}
              className="text-[clamp(2.75rem,11vw,4rem)] leading-[0.96] font-light tracking-[-0.035em] text-white lg:text-[clamp(4rem,7.4vw,7.5rem)]"
            />
          </div>

          {/* Standfirst, dropped down a line so it aligns to the statement's
              second baseline instead of its cap height. */}
          <div className="lg:col-span-4 lg:pt-4">
            <motion.p
              className="max-w-[46ch] text-[1rem] leading-[1.75] text-white/[0.68] md:text-[1.0625rem]"
              variants={rise}
              custom={{ delay: 0.5, still: reducedMotion }}
              initial="hidden"
              animate="visible"
            >
              {aboutMasthead.standfirst}
            </motion.p>

            {/* The four-stage tagline, as a mono strip. It is the studio's
                thesis in four words; chapter 02 is where it is unpacked. */}
            <motion.ul
              className="mt-9 flex flex-wrap items-center gap-x-3 gap-y-2"
              variants={rise}
              custom={{ delay: 0.62, still: reducedMotion }}
              initial="hidden"
              animate="visible"
            >
              {aboutMasthead.stages.map((stage, index) => (
                <li key={stage} className="flex items-center gap-3">
                  {index > 0 && (
                    <span
                      aria-hidden="true"
                      className="h-1 w-1 rounded-full bg-[#BFA76F]/60"
                    />
                  )}
                  <span className="font-mono text-[0.75rem] tracking-[0.24em] text-white/75 uppercase">
                    {stage}
                  </span>
                </li>
              ))}
            </motion.ul>
          </div>
        </div>

        {/* Fact strip. Four columns of mono metadata, hairline above. */}
        <motion.dl
          className="mt-16 grid grid-cols-2 gap-x-8 gap-y-9 border-t border-white/[0.12] pt-9 md:grid-cols-4 lg:mt-24"
          variants={rise}
          custom={{ delay: 0.74, still: reducedMotion }}
          initial="hidden"
          animate="visible"
        >
          {aboutMasthead.facts.map((fact) => (
            <div key={fact.label}>
              <dt className="font-mono text-[0.625rem] tracking-[0.3em] text-white/35 uppercase">
                {fact.label}
              </dt>
              <dd className="mt-3 text-[0.9375rem] leading-[1.5] text-white/85">
                {fact.value}
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>

      {/* Letterboxed band. Two nested elements, one transform each — the outer
          carries the parallax, the inner holds the footage. */}
      <div
        ref={bandRef}
        className="relative mt-16 h-[38vh] min-h-[240px] overflow-hidden md:h-[46vh] lg:mt-24 lg:h-[52vh]"
      >
        <motion.div
          className="absolute inset-x-0 -top-12 -bottom-12"
          style={reducedMotion ? undefined : { y: bandY }}
        >
          <BackgroundVideo
            src={aboutMasthead.video}
            fallbackClassName="bg-[#0F1C2E]"
            vignette={false}
            overlay="linear-gradient(to bottom, rgba(10,19,31,0.92) 0%, rgba(10,19,31,0.35) 40%, rgba(10,19,31,0.35) 60%, rgba(10,19,31,0.9) 100%)"
          />
        </motion.div>

        {/* Letterboxing bars, so the band reads as a projected frame. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-[#0A131F]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-[#0A131F]"
        />
      </div>
    </section>
  );
}
