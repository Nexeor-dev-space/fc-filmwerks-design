'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

import { aboutContact, aboutRecord } from '@/config/about';
import { clients } from '@/config/clients';
import { services } from '@/config/services';
import { usePrefersReducedMotion } from '@/hooks';

import { ChapterMark, DisplayHeading } from './ChapterHeading';
import {
  cascade,
  drawRule,
  ENTER,
  ENTER_TALL,
  rise,
} from '@/components/animations';

/**
 * Every figure is counted from the list it describes, never typed in.
 *
 * That is a correctness decision as much as a design one: a hand-written "9
 * disciplines" goes stale the first time a service is added, and a stale number
 * on an About page is a claim rather than a typo. `bases` reads the same
 * `Dubai | India` string the contact strip prints.
 */
const FIGURES = [
  services.length,
  clients.length,
  aboutContact.locations.split('|').length,
];

/**
 * Chapter 06 — experience and credibility.
 *
 * The homepage runs these marks as a drifting belt. Here they are set still, on
 * a ruled grid, because the two sections are doing different jobs: a belt is a
 * texture that says "many", where a grid is a record a reader can actually go
 * through name by name — which is what someone on an About page is doing.
 */
export function AboutRecord() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section
      id="about-record"
      aria-labelledby="about-record-heading"
      className="scroll-mt-24 bg-[#0A131F] py-24 md:py-32 lg:py-40"
    >
      <div className="px-5 md:px-8 lg:px-14 xl:pl-52">
        <ChapterMark number="06" title="The record" still={reducedMotion} />

        <div className="mt-8 grid grid-cols-1 gap-y-8 lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-6">
            <DisplayHeading
              id="about-record-heading"
              lines={aboutRecord.heading}
              still={reducedMotion}
            />
          </div>

          <motion.p
            className="max-w-[46ch] text-[1rem] leading-[1.8] text-white/[0.6] lg:col-span-4 lg:col-start-9 lg:pt-3"
            variants={rise}
            custom={{ delay: 0.18, still: reducedMotion }}
            initial="hidden"
            whileInView="visible"
            viewport={ENTER}
          >
            {aboutRecord.body}
          </motion.p>
        </div>

        {/* Figures. Set at display scale in the page's light weight, so they
            read as part of the editorial voice rather than as a stats bar. */}
        <motion.dl
          className="mt-16 grid grid-cols-1 gap-y-10 sm:grid-cols-3 sm:gap-x-12 lg:mt-24"
          variants={cascade}
          initial="hidden"
          whileInView="visible"
          viewport={ENTER}
        >
          {aboutRecord.figures.map((figure, index) => (
            <motion.div
              key={figure.label}
              variants={rise}
              custom={{ still: reducedMotion }}
            >
              <motion.div
                aria-hidden="true"
                className="h-px origin-left bg-[#BFA76F]/40"
                variants={drawRule}
                custom={{ still: reducedMotion }}
              />

              <dd className="mt-6 text-[clamp(2.75rem,8vw,3.5rem)] leading-[0.95] font-light tracking-[-0.04em] text-white lg:text-[clamp(3.5rem,4.6vw,5rem)]">
                {FIGURES[index]}
                <span className="text-[#BFA76F]">{figure.suffix}</span>
              </dd>

              <dt className="mt-4 font-mono text-[0.6875rem] tracking-[0.3em] text-white/40 uppercase">
                {figure.label}
              </dt>
            </motion.div>
          ))}
        </motion.dl>

        {/*
         * The logo belt, the same one the homepage runs. Two identical tracks
         * translated by exactly half the pair's width, so the moment the first
         * copy leaves the second is already in its place — the loop has no seam
         * and no reset to see.
         *
         * It replaces a ruled grid that had the marks boxed at 42px, where
         * fourteen different artboards read as grey specks rather than as
         * brands. The belt gives each one 120–150px and its own moment.
         *
         * No tiles, borders or backgrounds: the marks sit directly on the
         * section ground, held in line by a shared height cap rather than by a
         * box. Because the artboards are square, capping the height also
         * settles the width, which is what keeps the rhythm even.
         *
         * It stays inside the page gutter rather than running full-bleed: the
         * chapter rail is fixed over the left edge on `xl`, and a belt that ran
         * under it would push moving logos through the index.
         */}
        <motion.div
          className="marquee-host relative mt-20 overflow-hidden lg:mt-28"
          variants={rise}
          custom={{ still: reducedMotion }}
          initial="hidden"
          whileInView="visible"
          viewport={ENTER_TALL}
        >
          {/* Feathered edges, so the belt appears out of and into the ground
              rather than being cut off by an invisible box. Both stops carry
              this section's ink, not the homepage's navy. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#0A131F] to-transparent md:w-32"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#0A131F] to-transparent md:w-32"
          />

          <div className="animate-marquee-logos flex w-max">
            {[0, 1].map((copy) => (
              <ul
                key={copy}
                className="flex shrink-0 items-center"
                // The duplicate is presentational; only the first is announced.
                aria-hidden={copy === 1}
              >
                {clients.map((client) => (
                  <li
                    key={client.name}
                    className="flex shrink-0 items-center justify-center px-10 md:px-14"
                  >
                    {/* Not a link: these are proof, not navigation. A whole
                        belt of dead anchors would be worse than none.
                        Monochrome at rest, full colour on hover — the mark is
                        restyled only while it is being looked at.
                        `contrast(0.45) brightness(1.85)` is doing the real work
                        rather than the grayscale: these artboards range from
                        near-black to fairly light, and plain grayscale left the
                        dark half invisible on this ground. Brightness alone
                        cannot fix that — it is multiplicative, so black stays
                        black. Dropping contrast first pulls every tone toward
                        mid grey, and only then does the lift land on something
                        it can raise. */}
                    <Image
                      src={client.logo}
                      alt={client.name}
                      width={352}
                      height={352}
                      loading="lazy"
                      className="h-auto max-h-[120px] w-auto max-w-none object-contain opacity-80 brightness-[1.85] contrast-[0.45] grayscale transition-[opacity,filter] duration-500 ease-out hover:opacity-100 hover:brightness-100 hover:contrast-100 hover:grayscale-0 md:max-h-[150px]"
                    />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
