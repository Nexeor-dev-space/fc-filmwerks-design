'use client';

import { motion, type Variants } from 'framer-motion';
import { Fragment, useMemo, useRef, useState } from 'react';

import { Button, CtaButton, YouTubeEmbed } from '@/components/ui';
import {
  ProjectCard,
  RISE,
  cardVariants,
  gridVariants,
  type CardMotion,
} from '@/components/work/ProjectCard';
import { blueLily, blueLilyHonourSummary } from '@/config/film';
import { featuredProjectRows } from '@/config/projects';
import { EASE } from '@/constants';
import { useIsMobile, useLenis, usePrefersReducedMotion } from '@/hooks';
import { scrollToElement } from '@/lib/scroll';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE.out, delay },
  }),
};

/**
 * Featured work — the studio's film first, then a row of selected projects.
 *
 * Blue Lily leads as a full-width row rather than a cell in the grid: it is
 * the studio's own film and the strongest single piece of evidence on the
 * page, and it plays here, in place. The row is an overview — title, one
 * line, the honours folded to one mono line, and two actions. The festival-
 * by-festival record and the credits live on the About page and the case
 * study.
 *
 * Under it, one row of three posters: an advert, an event and a music video,
 * so the grid reads as the range of the work rather than a catalogue of it.
 * The portfolio is a click away.
 *
 * Section padding and gutters mirror the services section exactly, so the
 * boundary between the two reads as one continuous page.
 */
export function FeaturedWorkSection() {
  const reduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const lenis = useLenis();
  const frameRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);

  const cardMotion = useMemo<CardMotion>(
    () => ({ rise: isMobile ? RISE.mobile : RISE.desktop, reduced }),
    [isMobile, reduced],
  );

  /* The button starts the film and brings the frame to the top of the
     screen, so a press never plays something the visitor cannot see. */
  const watch = () => {
    setPlaying(true);
    if (frameRef.current) scrollToElement(frameRef.current, lenis);
  };

  return (
    <section
      id="featured-work"
      aria-labelledby="featured-work-heading"
      className="relative z-10 bg-[#0f1012] pt-16 pb-20 md:pt-20 md:pb-24 lg:pt-24 lg:pb-28"
    >
      <div className="w-full px-4 md:px-[3vw] xl:pl-52">
        {/* Heading and its route-through on the left, standfirst pushed right
            and vertically centred against them. */}
        <header className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-20">
          <div>
            <motion.h2
              id="featured-work-heading"
              className="text-[2.5rem] leading-[0.95] font-semibold tracking-[-0.02em] text-white uppercase md:text-[3.25rem] lg:text-[4rem] xl:text-[4.5rem]"
              variants={fadeUp}
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.6 }}
            >
              Featured
              <br />
              work
            </motion.h2>
          </div>

          <motion.p
            className="max-w-[460px] text-[1rem] leading-[1.8] text-white/[0.72] md:text-[1.0625rem] lg:shrink-0 lg:text-[1.125rem]"
            variants={fadeUp}
            custom={0.08}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
          >
            One director, one crew, one standard, whether the audience is a
            festival jury or your customers. Start with the film the juries
            chose.
          </motion.p>
        </header>

        {/* The film. Frame left, the short record right. */}
        <div className="mt-16 grid grid-cols-1 gap-y-10 lg:mt-24 lg:grid-cols-12 lg:gap-x-16">
          <motion.div
            ref={frameRef}
            className="lg:col-span-7"
            variants={fadeUp}
            custom={0.05}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <YouTubeEmbed
              videoId={blueLily.watch.youtubeId}
              title={`${blueLily.title} (${blueLily.year})`}
              poster={blueLily.poster}
              posterAlt={blueLily.posterAlt}
              playing={playing}
              onPlay={() => setPlaying(true)}
              className="rounded-[24px] border border-white/[0.08]"
              sizes="(min-width: 1024px) 58vw, 100vw"
            />
          </motion.div>

          <motion.div
            className="flex flex-col justify-center lg:col-span-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.p
              className="text-[0.75rem] tracking-[0.25em] text-[#BFA76F] uppercase"
              variants={fadeUp}
              custom={0.1}
            >
              Original film · {blueLily.year}
            </motion.p>

            <motion.h3
              className="mt-4 text-[2.25rem] leading-[1] font-extralight tracking-tight text-white md:text-[2.75rem] lg:text-[3.25rem]"
              variants={fadeUp}
              custom={0.16}
            >
              {blueLily.title}
            </motion.h3>

            <motion.p
              className="mt-5 max-w-[46ch] text-[1rem] leading-[1.8] text-white/[0.72] md:text-[1.0625rem]"
              variants={fadeUp}
              custom={0.22}
            >
              {blueLily.logline}
            </motion.p>

            {/* The honours, folded to one line. The full record is on the
                About page and the case study. */}
            <motion.p
              className="mt-6 border-l border-[#BFA76F]/50 pl-4 font-mono text-[0.6875rem] leading-[1.9] tracking-[0.18em] text-white/55 uppercase"
              variants={fadeUp}
              custom={0.28}
            >
              {blueLilyHonourSummary}
            </motion.p>

            <motion.div
              className="mt-8 flex flex-wrap gap-3"
              variants={fadeUp}
              custom={0.34}
            >
              <Button
                type="button"
                onClick={watch}
                className="rounded-full bg-[#F8F7F4] text-[#0F1C2E] hover:bg-white"
              >
                {blueLily.watch.label}
                <span aria-hidden="true" className="text-[0.625rem]">
                  ▶
                </span>
              </Button>

              <Button
                href={blueLily.caseStudy.href}
                variant="outline"
                className="rounded-full border-white/35 text-[#F8F7F4] hover:border-[#BFA76F]"
              >
                Case study
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* One trigger for the whole grid, fired once. Cards inherit it, so no
            card waits on its own intersection — and nothing replays on a
            scroll back up. */}
        <motion.ul
          className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2 lg:mt-16 lg:grid-cols-3"
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {featuredProjectRows.map((row, rowIndex) => (
            <Fragment key={row[0]?.href ?? rowIndex}>
              {row.map((project) => (
                <ProjectCard
                  key={project.href}
                  project={project}
                  cardMotion={cardMotion}
                />
              ))}

              {/* Only after the final row — one route-through at the end of the
                  grid, rather than the same control repeated between bands.
                  `col-span-full` keeps it centred at every column count. */}
              {rowIndex === featuredProjectRows.length - 1 && (
                <motion.li
                  className="col-span-full flex justify-center pt-6 lg:pt-10"
                  variants={cardVariants}
                  custom={cardMotion}
                >
                  <CtaButton href="/portfolio">See more work →</CtaButton>
                </motion.li>
              )}
            </Fragment>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
