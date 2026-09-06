'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useRef, useState } from 'react';

import { portfolioFilters } from '@/config/portfolio';
import { projects } from '@/config/projects';
import { DURATION, EASE } from '@/constants';
import { useLenis, usePrefersReducedMotion } from '@/hooks';
import { scrollToElement } from '@/lib/scroll';
import { cn } from '@/lib/utils';

import { ArchiveCard } from './ArchiveCard';
import { rise } from './motion';

/**
 * The archive: a floating filter rail over a composed gallery.
 *
 * Two decisions separate this from the homepage's Featured Work grid, which it
 * used to be a copy of.
 *
 * The rail docks to the foot of the viewport and floats there, a blurred pill
 * on tablet and desktop and a full-width strip on a phone, for as long as the
 * archive is on screen. It used to park under the fixed site nav, where the
 * nav's padding overlapped it and the two competed for the top of the page;
 * the foot is clear, it is where a thumb already rests, and the filters stay
 * reachable through a page that is several screens tall. It carries a count
 * per discipline, which makes it read as an index of the archive rather than
 * as a row of buttons.
 *
 * The grid is two even columns of identical 16:10 plates, each captioned the
 * same way. It used to run a wide/narrow/panoramic rhythm with alternate rows
 * dropped off the baseline, which read as busy rather than composed; a
 * catalogue is cleaner when every plate is the same shape and the pictures,
 * not the layout, are what vary.
 *
 * Filtering is client state, never a navigation: the URL does not change and
 * the page does not reload. The scroll position is left alone unless the
 * visitor is already down inside the grid, in which case it returns to the
 * head of the archive; see `select`.
 */
export function PortfolioArchive() {
  const reducedMotion = usePrefersReducedMotion();
  const lenis = useLenis();
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState('All');

  /*
   * Choosing a filter from inside the grid brings the visitor back to the
   * head of the archive. The grid remounts at a new height while the scroll
   * position stays where it was: pick Events from the ninth card and the page
   * shrinks by ten entries underneath you, and what then sits at that height
   * is the production gallery. It read as the rail navigating somewhere it
   * never linked to. The scroll only happens once the top of the section has
   * left the viewport, so filtering from the head of the archive stays still.
   */
  const select = (value: string) => {
    setActive(value);
    const section = sectionRef.current;
    if (section && section.getBoundingClientRect().top < 0) {
      scrollToElement(section, lenis, 0, { immediate: reducedMotion });
    }
  };

  const visible = useMemo(
    () =>
      active === 'All'
        ? projects
        : projects.filter((project) => project.category === active),
    [active],
  );

  return (
    <section
      ref={sectionRef}
      id="portfolio-work"
      aria-labelledby="portfolio-work-heading"
      className="bg-[#0A131F] pt-16 pb-24 md:pt-20 md:pb-28 lg:pt-24 lg:pb-32"
    >
      <h2 id="portfolio-work-heading" className="sr-only">
        Project archive
      </h2>

      <div className="px-5 md:px-8 lg:px-14">
        {/*
         * `mode="wait"` rather than `popLayout`: the outgoing set fades before
         * the incoming one lands, so a filter change reads as the projector
         * changing slides rather than as cards shuffling under each other.
         *
         * The key is the active filter, so the whole grid remounts and every
         * entry replays its wipe. Keying per-card instead would leave the
         * survivors of a filter change sitting still while their new
         * neighbours animated in.
         */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.ul
            key={active}
            className="grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-2 md:gap-y-14 lg:gap-x-8 lg:gap-y-16"
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

      {/*
       * Sticky to the foot of the viewport. A bottom-stuck element only ever
       * moves up from its place in the flow, so the rail has to come after
       * the grid in the DOM: from there it rides the bottom edge while the
       * archive scrolls past and settles into place under the last row. The
       * order is fine for a screen reader, which meets the grid first and the
       * controls for it directly after, and the live region below announces
       * every change.
       */}
      <div className="sticky bottom-0 z-30 mt-14 md:bottom-6 md:mt-16 md:px-8 lg:bottom-8 lg:px-14">
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
           * discipline being added later: the strip scrolls rather than
           * wrapping onto a second line, which would permanently double the
           * height of a sticky element. The safe-area padding keeps the strip
           * clear of the home indicator on phones that have one.
           */}
          <div
            role="radiogroup"
            aria-label="Filter projects by category"
            className="flex max-w-full [scrollbar-width:none] items-center justify-between gap-0.5 overflow-x-auto border-y border-white/[0.1] bg-[#0A131F]/90 px-2 pt-1 pb-[calc(0.25rem+env(safe-area-inset-bottom))] backdrop-blur-xl md:justify-start md:gap-1 md:rounded-full md:border md:p-1.5 [&::-webkit-scrollbar]:hidden"
          >
            {portfolioFilters.map((filter) => {
              const selected = filter.value === active;
              return (
                <button
                  key={filter.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => select(filter.value)}
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
                      label is correct in the server-rendered HTML. The long
                      form waits for the widest breakpoint: below it the six
                      of them outrun the pill and the last one clips. */}
                  <span className="xl:hidden">{filter.short}</span>
                  <span className="hidden xl:inline">{filter.label}</span>
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
    </section>
  );
}
