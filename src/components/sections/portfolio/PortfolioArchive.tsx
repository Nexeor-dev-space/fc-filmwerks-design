'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';

import { portfolioFilters } from '@/config/portfolio';
import { projects } from '@/config/projects';
import { DURATION, EASE } from '@/constants';
import { usePrefersReducedMotion } from '@/hooks';
import { cn } from '@/lib/utils';

import { ARCHIVE_RHYTHM, ArchiveCard } from './ArchiveCard';
import { rise } from './motion';

/**
 * The archive: a floating filter rail over a composed gallery.
 *
 * Two decisions separate this from the homepage's Featured Work grid, which it
 * used to be a copy of.
 *
 * The rail is sticky and floats — a blurred pill inset from the gutters,
 * offset below the fixed site nav — so the filters stay reachable through a
 * page that is several screens tall. It carries a count per discipline, which
 * makes it read as an index of the archive rather than as a row of buttons.
 *
 * The grid runs a twelve-track composition rhythm (`ARCHIVE_RHYTHM`) instead
 * of three equal columns: wide, narrow, panoramic, with alternate entries
 * dropped off the baseline. Consecutive spans always sum to twelve, so any
 * filtered subset still closes its rows.
 *
 * Filtering is client state, never a navigation: the URL does not change, the
 * page does not reload, and the scroll position is left alone.
 */
export function PortfolioArchive() {
  const reducedMotion = usePrefersReducedMotion();
  const [active, setActive] = useState('All');

  const visible = useMemo(
    () =>
      active === 'All'
        ? projects
        : projects.filter((project) => project.category === active),
    [active],
  );

  return (
    <section
      id="portfolio-work"
      aria-labelledby="portfolio-work-heading"
      className="bg-[#0A131F] pt-16 pb-24 md:pt-20 md:pb-28 lg:pt-24 lg:pb-32"
    >
      <h2 id="portfolio-work-heading" className="sr-only">
        Project archive
      </h2>

      {/*
       * The nav is fixed, transparent and always up, so the rail parks just
       * below it rather than at the top of the viewport. The offsets match the
       * nav's own height at each breakpoint.
       */}
      <div className="sticky top-[84px] z-30 md:top-[100px] md:px-8 lg:top-[116px] lg:px-14">
        <motion.div
          variants={rise}
          custom={{ still: reducedMotion }}
          initial="hidden"
          animate="visible"
          /* Full width on a phone so the rail can use every pixel it has;
             shrink-wrapped and centred from tablet up, where it fits easily. */
          className="w-full md:mx-auto md:w-fit md:max-w-full"
        >
          {/*
           * Radio semantics rather than buttons — these select one of a set
           * rather than each performing an action, and a screen reader should
           * hear the group and which member is chosen.
           *
           * On a phone this is a full-bleed strip rather than an inset pill.
           * The pill was centred and clipped by its own rounded edge, which
           * read as a broken control; running edge to edge buys back both
           * gutters, and with the short labels and tighter metrics below all
           * four fit without scrolling at 360px and up. `overflow-x-auto`
           * stays as the safety net for narrower handsets and for a fifth
           * discipline being added later — the strip scrolls rather than
           * wrapping onto a second line, which would permanently double the
           * height of a sticky element.
           */}
          <div
            role="radiogroup"
            aria-label="Filter projects by category"
            className="flex max-w-full [scrollbar-width:none] items-center justify-between gap-0.5 overflow-x-auto border-y border-white/[0.1] bg-[#0A131F]/90 px-2 py-1 backdrop-blur-xl md:justify-start md:gap-1 md:rounded-full md:border md:p-1.5 [&::-webkit-scrollbar]:hidden"
          >
            {portfolioFilters.map((filter) => {
              const selected = filter.value === active;
              return (
                <button
                  key={filter.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setActive(filter.value)}
                  /* min-h-11 keeps every target at the 44px touch minimum,
                     which the type size alone would not reach. */
                  className={cn(
                    'inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-2.5 font-mono text-[0.625rem] tracking-[0.12em] whitespace-nowrap uppercase transition-colors duration-500 ease-out',
                    'md:gap-2 md:px-5 md:text-[0.6875rem] md:tracking-[0.2em]',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BFA76F]',
                    selected
                      ? 'bg-[#BFA76F] text-[#0A131F]'
                      : 'text-white/55 hover:bg-white/[0.06] hover:text-white',
                  )}
                >
                  {/* One control, two lengths. Both are rendered and one is
                      hidden per breakpoint rather than swapped in JS, so the
                      label is correct in the server-rendered HTML. */}
                  <span className="md:hidden">{filter.short}</span>
                  <span className="hidden md:inline">{filter.label}</span>
                  {/* Dropped below 360px, where the counts are the difference
                      between the four controls fitting and the last one
                      running off the screen. They are decorative — the label
                      is what the control is — so losing them on the narrowest
                      handsets costs nothing a screen reader would miss. */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      'text-[0.625rem] tabular-nums max-[359px]:hidden',
                      selected ? 'text-[#0A131F]/60' : 'text-white/30',
                    )}
                  >
                    {String(filter.count).padStart(2, '0')}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>

      <div className="px-5 md:px-8 lg:px-14">
        {/*
         * `mode="wait"` rather than `popLayout`: entries here have unequal
         * spans and offsets, so cross-fading two sets would have the outgoing
         * cards reflowing under the incoming ones mid-animation. Waiting costs
         * a beat and keeps the composition intact.
         *
         * The key is the active filter, so the whole grid remounts and every
         * entry replays its wipe. Keying per-card instead would leave the
         * survivors of a filter change sitting still while their new
         * neighbours animated in.
         */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.ul
            key={active}
            className="mt-14 grid grid-cols-1 gap-x-6 gap-y-16 md:mt-16 md:gap-y-20 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-24"
            exit={
              reducedMotion
                ? { opacity: 0, transition: { duration: 0 } }
                : {
                    opacity: 0,
                    transition: { duration: DURATION.fast, ease: EASE.out },
                  }
            }
          >
            {visible.map((project, index) => (
              <ArchiveCard
                key={project.href}
                project={project}
                layout={ARCHIVE_RHYTHM[index % ARCHIVE_RHYTHM.length]}
                index={index}
                still={reducedMotion}
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
