'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';

import {
  ProjectCard,
  RISE,
  gridVariants,
  type CardMotion,
} from '@/components/work/ProjectCard';
import { projectCategories, projects } from '@/config/projects';
import { DURATION, EASE } from '@/constants';
import { useIsMobile, usePrefersReducedMotion } from '@/hooks';
import { cn } from '@/lib/utils';

/**
 * The full archive, filtered in place.
 *
 * The grid is the homepage's Featured Work grid — same card, same columns,
 * same stagger — because the homepage is meant to read as a preview of this
 * page. Both render `ProjectCard` from `@/components/work`, so they cannot
 * drift apart.
 *
 * Filtering is client state, never a navigation: the URL does not change, the
 * page does not reload, and the scroll position is left alone. Only the cards
 * swap.
 */
export function PortfolioGallery() {
  const reduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const [active, setActive] = useState('All');

  const cardMotion = useMemo<CardMotion>(
    () => ({ rise: isMobile ? RISE.mobile : RISE.desktop, reduced }),
    [isMobile, reduced],
  );

  const visible = useMemo(
    () =>
      active === 'All'
        ? projects
        : projects.filter((p) => p.category === active),
    [active],
  );

  return (
    <section
      id="portfolio-work"
      aria-labelledby="portfolio-work-heading"
      className="bg-[#0F1012] pb-20 md:pb-24 lg:pb-28"
    >
      <div className="w-full px-4 md:px-[3vw]">
        <h2 id="portfolio-work-heading" className="sr-only">
          Selected projects
        </h2>

        {/*
         * Filters. Radio semantics rather than buttons — these select one of a
         * set rather than each performing an action, and a screen reader
         * should hear the group and which member is chosen.
         */}
        <div
          role="radiogroup"
          aria-label="Filter projects by category"
          className="flex flex-wrap items-center gap-x-2 gap-y-3 md:gap-x-3"
        >
          {projectCategories.map((category) => {
            const selected = category === active;
            return (
              <button
                key={category}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setActive(category)}
                /* min-h-11 keeps every target at the 44px touch minimum, which
                   the type size alone would not reach. */
                className={cn(
                  'min-h-11 rounded-full px-5 text-[0.6875rem] font-semibold tracking-[0.24em] uppercase transition-colors duration-500 ease-out md:text-[0.75rem]',
                  'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#BFA76F]',
                  selected
                    ? 'bg-[#BFA76F] text-[#0F1012]'
                    : 'text-white/55 hover:text-white',
                )}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/*
         * `mode="popLayout"` so leaving cards are pulled out of flow while the
         * remainder reflow around them — without it the grid would jump the
         * moment a filter changed, then animate from the wrong place.
         *
         * The key is the active filter, so the whole grid remounts and every
         * card replays its entrance. Keying per-card instead would leave the
         * survivors of a filter change sitting still while their new
         * neighbours animated in.
         */}
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.ul
            key={active}
            className="mt-12 grid grid-cols-1 gap-10 md:mt-16 md:grid-cols-2 lg:grid-cols-3"
            variants={gridVariants}
            initial="hidden"
            animate="visible"
            exit={
              reduced
                ? { opacity: 0, transition: { duration: 0 } }
                : {
                    opacity: 0,
                    transition: { duration: DURATION.fast, ease: EASE.out },
                  }
            }
          >
            {visible.map((project) => (
              <ProjectCard
                key={project.href}
                project={project}
                cardMotion={cardMotion}
              />
            ))}
          </motion.ul>
        </AnimatePresence>

        <p aria-live="polite" className="sr-only">
          {`${visible.length} project${visible.length === 1 ? '' : 's'} shown`}
        </p>
      </div>
    </section>
  );
}
