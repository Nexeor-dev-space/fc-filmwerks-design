'use client';

import { motion } from 'framer-motion';

import { aboutPeople } from '@/config/about';
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
 * Chapter 05 — the people, described by craft.
 *
 * The studio publishes no names, portraits or titles anywhere, and inventing a
 * crew for a real company's About page is not a design decision that is ours to
 * make. So the section is built to be honest now and correct later: it presents
 * the six crafts a production passes through, and the shape it uses — number,
 * role, one line — is the shape a named crew slots straight into. See the TODO
 * on `aboutPeople` in `src/config/about.ts` for what to replace when the studio
 * supplies real people.
 */
export function AboutPeople() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section
      id="about-people"
      aria-labelledby="about-people-heading"
      className="scroll-mt-24 bg-[#0F1C2E] py-24 md:py-32 lg:py-40"
    >
      <div className="px-5 md:px-8 lg:px-14 xl:pl-52">
        <ChapterMark number="05" title="The people" still={reducedMotion} />

        <div className="mt-8 grid grid-cols-1 gap-y-8 lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-6">
            <DisplayHeading
              id="about-people-heading"
              lines={aboutPeople.heading}
              still={reducedMotion}
            />
          </div>

          <motion.div
            className="lg:col-span-4 lg:col-start-9 lg:pt-3"
            variants={rise}
            custom={{ delay: 0.18, still: reducedMotion }}
            initial="hidden"
            whileInView="visible"
            viewport={ENTER}
          >
            <p className="max-w-[44ch] text-[1rem] leading-[1.8] text-white/[0.6]">
              {aboutPeople.intro}
            </p>

            <p className="mt-7 max-w-[38ch] border-l border-[#BFA76F]/40 pl-5 font-mono text-[0.75rem] leading-[1.9] text-white/40">
              {aboutPeople.note}
            </p>
          </motion.div>
        </div>

        {/* Six crafts on a three-track grid. Hairline above each cell rather
            than a card around it — the rules are the only structure the block
            needs, and they keep it in the same register as the index above. */}
        <motion.ul
          className="mt-16 grid grid-cols-1 gap-x-12 sm:grid-cols-2 lg:mt-28 lg:grid-cols-3"
          variants={cascade}
          initial="hidden"
          whileInView="visible"
          viewport={ENTER_TALL}
        >
          {aboutPeople.roles.map((role) => (
            <motion.li
              key={role.number}
              className="group pb-10 lg:pb-14"
              variants={rise}
              custom={{ still: reducedMotion }}
            >
              <motion.div
                aria-hidden="true"
                className="h-px origin-left bg-white/[0.12] transition-colors duration-700 ease-out group-hover:bg-[#BFA76F]/50"
                variants={drawRule}
                custom={{ still: reducedMotion }}
              />

              <span className="mt-6 block font-mono text-[0.6875rem] tracking-[0.3em] text-[#BFA76F]">
                {role.number}
              </span>

              <h3 className="mt-5 text-[1.5rem] leading-[1.15] font-light tracking-[-0.01em] text-white md:text-[1.75rem]">
                {role.role}
              </h3>

              <p className="mt-4 max-w-[34ch] text-[0.9375rem] leading-[1.8] text-white/[0.58]">
                {role.body}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
