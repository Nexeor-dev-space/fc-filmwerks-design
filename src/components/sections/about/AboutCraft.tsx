'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

import { aboutCraft } from '@/config/about';
import { services } from '@/config/services';
import { EASE } from '@/constants';
import { usePrefersReducedMotion } from '@/hooks';
import { cn } from '@/lib/utils';

import { ChapterMark, DisplayHeading } from './ChapterHeading';
import {
  cascade,
  drawRule,
  ENTER,
  ENTER_TALL,
  rise,
} from '@/components/animations';

/**
 * Chapter 03 — capabilities, set as an index rather than a grid of cards.
 *
 * The homepage already presents these nine disciplines as posters. Repeating
 * that here would be the duplication this redesign exists to remove, so the
 * same source list is read back as a printed index: rules, numbers, names, and
 * one still held in the margin that changes as the reader moves down the page.
 *
 * The rows are not links. The `/services/*` routes in the config have no pages
 * behind them yet, and an index of nine dead ends would be worse than an index
 * that simply states what is in the house.
 */
export function AboutCraft() {
  const reducedMotion = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const activeService = services[active] ?? services[0];

  return (
    <section
      id="about-craft"
      aria-labelledby="about-craft-heading"
      className="scroll-mt-24 bg-[#0F1C2E] py-24 md:py-32 lg:py-40"
    >
      <div className="px-5 md:px-8 lg:px-14 xl:pl-52">
        <ChapterMark number="03" title="The craft" still={reducedMotion} />

        <div className="mt-8 grid grid-cols-1 gap-y-8 lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-7">
            <DisplayHeading
              id="about-craft-heading"
              lines={aboutCraft.heading}
              still={reducedMotion}
            />
          </div>

          <motion.p
            className="max-w-[42ch] text-[1rem] leading-[1.8] text-white/[0.6] lg:col-span-4 lg:col-start-9 lg:pt-3"
            variants={rise}
            custom={{ delay: 0.18, still: reducedMotion }}
            initial="hidden"
            whileInView="visible"
            viewport={ENTER}
          >
            {aboutCraft.intro}
          </motion.p>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:mt-24 lg:grid-cols-12 lg:gap-x-12">
          {/* Margin still. Held in place while the index scrolls beside it, and
              cross-faded rather than swapped so the frame never goes empty. */}
          <div className="hidden lg:col-span-4 lg:block">
            <div className="sticky top-32">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] border border-white/[0.08]">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={activeService.number}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: reducedMotion ? 1 : 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: reducedMotion ? 0.2 : 0.9,
                      ease: EASE.out,
                    }}
                  >
                    <Image
                      src={activeService.image}
                      alt=""
                      fill
                      loading="lazy"
                      sizes="33vw"
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>

                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#0A131F]/75 via-[#0A131F]/10 to-transparent"
                />
              </div>

              <p className="mt-4 font-mono text-[0.6875rem] tracking-[0.24em] text-white/40 uppercase">
                {activeService.number} — {activeService.title}
              </p>
            </div>
          </div>

          <motion.ol
            className="lg:col-span-7 lg:col-start-6"
            variants={cascade}
            initial="hidden"
            whileInView="visible"
            viewport={ENTER_TALL}
          >
            {services.map((service, index) => (
              <motion.li
                key={service.number}
                className="group"
                variants={rise}
                custom={{ still: reducedMotion }}
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
              >
                <div
                  aria-hidden="true"
                  className={cn(
                    'h-px transition-colors duration-700 ease-out',
                    index === active ? 'bg-[#BFA76F]/55' : 'bg-white/[0.12]',
                  )}
                />

                <div
                  /* `tabindex` so a keyboard reader moves the margin still the
                     same way a pointer does — the row carries no other
                     interaction, so it is not announced as a control. */
                  tabIndex={0}
                  className="flex items-baseline gap-5 py-6 outline-none md:gap-8 md:py-7"
                >
                  <span
                    className={cn(
                      'font-mono text-[0.6875rem] tracking-[0.3em] transition-colors duration-500 ease-out',
                      index === active ? 'text-[#BFA76F]' : 'text-white/30',
                    )}
                  >
                    {service.number}
                  </span>

                  <h3
                    className={cn(
                      'flex-1 text-[1.375rem] leading-[1.15] font-light tracking-[-0.01em] transition-colors duration-500 ease-out md:text-[1.75rem] lg:text-[2rem]',
                      index === active ? 'text-white' : 'text-white/70',
                    )}
                  >
                    {service.title}
                  </h3>

                  <span
                    aria-hidden="true"
                    className={cn(
                      'hidden h-px w-8 shrink-0 transition-all duration-500 ease-out md:block',
                      index === active ? 'w-12 bg-[#BFA76F]' : 'bg-transparent',
                    )}
                  />
                </div>
              </motion.li>
            ))}

            <motion.div
              aria-hidden="true"
              className="h-px origin-left bg-white/[0.12]"
              variants={drawRule}
              custom={{ still: reducedMotion }}
            />
          </motion.ol>
        </div>
      </div>
    </section>
  );
}
