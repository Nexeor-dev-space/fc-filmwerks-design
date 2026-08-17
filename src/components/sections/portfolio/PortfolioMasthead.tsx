'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

import { portfolioIndex, portfolioMasthead } from '@/config/portfolio';
import { projects } from '@/config/projects';
import { usePrefersReducedMotion } from '@/hooks';

import { drawRule, rise } from './motion';
import { DisplayHeading } from './PortfolioHeading';

/**
 * The archive masthead.
 *
 * Three pages on this site already open on a full-bleed video hero, and the
 * brief for this redesign was that the portfolio must not read as the homepage
 * a second time — so this opens on a *contact sheet* instead. The type sits on
 * a bare ground with an index strip under it, and the imagery arrives as a
 * full-bleed filmstrip of every project still, drifting sideways along the
 * foot of the screen the way a strip of negatives is pulled across a light
 * box.
 *
 * The filmstrip is the archive's own eight frames, doubled. It is decorative
 * and `aria-hidden`: every one of these images appears again, labelled and
 * linked, in the grid below, and announcing them twice would make the page
 * unreadable with a screen reader for no gain.
 */
export function PortfolioMasthead() {
  const reducedMotion = usePrefersReducedMotion();

  /* Two identical copies, so the -50% translate loops without a seam. */
  const strip = [...projects, ...projects];

  return (
    <section
      aria-labelledby="portfolio-masthead-heading"
      className="relative overflow-hidden bg-[#0A131F] pt-32 md:pt-40 lg:pt-44"
    >
      {/* Ambient gold wash, pushed to the right so it does not sit behind the
          headline and lift its background. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -right-40 h-[34rem] w-[34rem] rounded-full opacity-[0.2] blur-[130px]"
        style={{
          background:
            'radial-gradient(circle, rgba(191,167,111,0.55) 0%, transparent 68%)',
        }}
      />

      <div className="relative px-5 md:px-8 lg:px-14">
        {/* Slug line. */}
        <motion.div
          className="flex items-center gap-5"
          variants={rise}
          custom={{ still: reducedMotion }}
          initial="hidden"
          animate="visible"
        >
          <span className="font-mono text-[0.6875rem] tracking-[0.34em] text-white/45 uppercase">
            {portfolioMasthead.slug}
          </span>
          <motion.span
            aria-hidden="true"
            className="h-px flex-1 origin-left bg-white/[0.14]"
            variants={drawRule}
            custom={{ delay: 0.15, still: reducedMotion }}
          />
          <span className="hidden font-mono text-[0.6875rem] tracking-[0.34em] text-[#BFA76F] uppercase md:block">
            {String(projects.length).padStart(2, '0')} projects
          </span>
        </motion.div>

        {/*
         * Headline left, standfirst right — but weighted 7/5 rather than the
         * homepage's even split, and the standfirst is dropped to the
         * headline's last baseline instead of its first.
         */}
        <div className="grid grid-cols-1 gap-y-10 pt-14 lg:grid-cols-12 lg:gap-x-14 lg:pt-20">
          <div className="lg:col-span-7">
            <DisplayHeading
              as="h1"
              id="portfolio-masthead-heading"
              lines={portfolioMasthead.headline}
              still={reducedMotion}
              className="text-[clamp(2.75rem,11.5vw,4rem)] leading-[0.94] font-light tracking-[-0.035em] text-white lg:text-[clamp(4rem,7.6vw,7.75rem)]"
            />
          </div>

          <div className="lg:col-span-5 lg:flex lg:flex-col lg:justify-end lg:pb-3">
            <motion.p
              className="max-w-[48ch] text-[1rem] leading-[1.75] text-white/[0.68] md:text-[1.0625rem]"
              variants={rise}
              custom={{ delay: 0.5, still: reducedMotion }}
              initial="hidden"
              animate="visible"
            >
              {portfolioMasthead.standfirst}
            </motion.p>

            <motion.p
              className="mt-7 font-mono text-[0.6875rem] tracking-[0.26em] text-[#BFA76F]/85 uppercase"
              variants={rise}
              custom={{ delay: 0.6, still: reducedMotion }}
              initial="hidden"
              animate="visible"
            >
              ↓ {portfolioMasthead.hint}
            </motion.p>
          </div>
        </div>

        {/* Index strip. Mono figures at display scale — the archive stating
            its own size before showing any of it. */}
        <motion.dl
          className="mt-16 grid grid-cols-2 gap-x-8 gap-y-9 border-t border-white/[0.12] pt-9 md:grid-cols-4 lg:mt-20"
          variants={rise}
          custom={{ delay: 0.7, still: reducedMotion }}
          initial="hidden"
          animate="visible"
        >
          {portfolioIndex.map((entry) => (
            <div key={entry.label}>
              <dt className="font-mono text-[0.625rem] tracking-[0.3em] text-white/35 uppercase">
                {entry.label}
              </dt>
              <dd className="mt-3 font-mono text-[1.375rem] leading-none tracking-[-0.01em] text-white/90 md:text-[1.625rem]">
                {entry.value}
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>

      {/*
       * Filmstrip. Full-bleed and clipped, with sprocket-hole rails above and
       * below so the band reads as film rather than as a row of thumbnails.
       * `marquee-host` pauses the drift on hover — the class is shared with the
       * client belt, and reduced motion is handled globally in globals.css.
       */}
      <div
        aria-hidden="true"
        className="marquee-host relative mt-16 overflow-hidden border-y border-white/[0.08] py-3 lg:mt-24"
      >
        <div className="animate-marquee-filmstrip flex w-max gap-3 md:gap-4">
          {strip.map((project, index) => (
            <div
              key={`${project.href}-${index}`}
              className="relative h-[124px] w-[196px] shrink-0 overflow-hidden md:h-[168px] md:w-[268px] lg:h-[196px] lg:w-[312px]"
            >
              <Image
                src={project.image}
                alt=""
                fill
                sizes="312px"
                /* Only the leading frames are on screen at first paint; the
                   rest scroll into view long after. */
                priority={index < 3}
                className="object-cover brightness-[0.62] saturate-[0.85]"
              />
            </div>
          ))}
        </div>

        {/* Feathered ends, so frames enter and leave rather than pop. */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#0A131F] to-transparent md:w-32"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#0A131F] to-transparent md:w-32"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
