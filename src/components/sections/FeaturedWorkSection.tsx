'use client';

import { motion, type Variants } from 'framer-motion';
import { Fragment, useMemo } from 'react';

import { CtaButton } from '@/components/ui';
import {
  ProjectCard,
  RISE,
  cardVariants,
  gridVariants,
  type CardMotion,
} from '@/components/work/ProjectCard';
import { featuredProjectRows } from '@/config/projects';
import { EASE } from '@/constants';
import { useIsMobile, usePrefersReducedMotion } from '@/hooks';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE.out, delay },
  }),
};

/**
 * Featured work — nine selected films in a 3×3 grid.
 *
 * Deliberately a different rhythm from the services carousel above: that one
 * is a horizontal strip you drag through, this is a static grid you scan. The
 * change of pace is what separates browsing capability from viewing work.
 *
 * Section padding and gutters mirror the services section exactly, so the
 * boundary between the two reads as one continuous page.
 */
export function FeaturedWorkSection() {
  const reduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  const cardMotion = useMemo<CardMotion>(
    () => ({ rise: isMobile ? RISE.mobile : RISE.desktop, reduced }),
    [isMobile, reduced],
  );

  return (
    <section
      id="featured-work"
      aria-labelledby="featured-work-heading"
      className="relative z-10 bg-[#0f1012] pt-16 pb-20 md:pt-20 md:pb-24 lg:pt-24 lg:pb-28"
    >
      <div className="w-full px-4 md:px-[3vw]">
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
            We craft films that connect brands with people through emotion,
            storytelling and unforgettable visuals.
          </motion.p>
        </header>

        {/* One trigger for the whole grid, fired once. Cards inherit it, so a
            card in the third row never waits on its own intersection — and
            nothing replays on a scroll back up. */}
        <motion.ul
          className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-2 lg:mt-24 lg:grid-cols-3"
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
