'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

import { chapterNumber } from '@/config/about';
import { komBan } from '@/config/kom-ban';
import { usePrefersReducedMotion } from '@/hooks';

import { ChapterMark, DisplayHeading } from './ChapterHeading';
import { ENTER, rise } from '@/components/animations';

/**
 * Chapter 04: Kom Ban Records, the studio's music label.
 *
 * Sits after the film because it is the same argument continued. Chapter 03 is
 * the studio proving it can make original work in one medium; this is the same
 * intent given a second one, and putting it before the method means a reader
 * has met everything the house makes for itself before being shown how it works
 * for other people.
 *
 * The lockup is framed on black rather than knocked out onto the page's navy.
 * The artwork carries its own ground, and a plate around it reads as a sleeve —
 * which is what a record label's mark should look like — where a bare PNG on
 * navy would read as an image that failed to composite.
 *
 * Two sentences and nothing else. The studio supplied exactly that much about
 * the label, and a chapter padded out to match the length of the ones around it
 * would be inventing a record the label does not yet have. See the note in
 * `src/config/kom-ban.ts`.
 */
export function AboutLabel() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section
      id="about-label"
      aria-labelledby="about-label-heading"
      className="scroll-mt-24 bg-[#0A131F] py-24 md:py-32 lg:py-40"
    >
      <div className="px-5 md:px-8 lg:px-14 xl:pl-52">
        <ChapterMark
          number={chapterNumber('about-label')}
          title="The label"
          still={reducedMotion}
        />

        <div className="mt-16 grid grid-cols-1 items-center gap-y-14 lg:mt-20 lg:grid-cols-12 lg:gap-x-14">
          {/* The sleeve. */}
          <motion.div
            className="lg:col-span-5"
            variants={rise}
            custom={{ still: reducedMotion }}
            initial="hidden"
            whileInView="visible"
            viewport={ENTER}
          >
            <div className="mx-auto max-w-[420px] rounded-[18px] border border-white/[0.10] bg-black p-8 shadow-[0_40px_120px_rgba(0,0,0,0.5)] md:p-12 lg:mx-0">
              <Image
                src={komBan.logo}
                alt={komBan.logoAlt}
                width={komBan.logoWidth}
                height={komBan.logoHeight}
                sizes="(min-width: 1024px) 34vw, 80vw"
                className="h-auto w-full"
              />
            </div>
          </motion.div>

          <div className="lg:col-span-6 lg:col-start-7">
            <motion.p
              className="font-mono text-[0.6875rem] tracking-[0.32em] text-[#BFA76F] uppercase"
              variants={rise}
              custom={{ still: reducedMotion }}
              initial="hidden"
              whileInView="visible"
              viewport={ENTER}
            >
              {komBan.kind} · {komBan.origin}
            </motion.p>

            <DisplayHeading
              id="about-label-heading"
              lines={komBan.nameLines}
              still={reducedMotion}
              className="mt-5"
            />

            <motion.div
              className="mt-10 max-w-[46ch]"
              initial="hidden"
              whileInView="visible"
              viewport={ENTER}
            >
              {/* The studio's own two sentences, in its own order: what the
                  label is, then what it intends. */}
              <motion.p
                className="text-[1.125rem] leading-[1.7] font-light text-white/[0.9] md:text-[1.25rem]"
                variants={rise}
                custom={{ still: reducedMotion }}
              >
                {komBan.tagline}
              </motion.p>

              <motion.p
                className="mt-6 text-[1rem] leading-[1.85] text-white/[0.66] md:text-[1.0625rem]"
                variants={rise}
                custom={{ delay: 0.08, still: reducedMotion }}
              >
                {komBan.ambition}
              </motion.p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
