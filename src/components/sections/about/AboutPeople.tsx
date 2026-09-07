'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

import { aboutPeople, chapterNumber, type AboutFounder } from '@/config/about';
import { usePrefersReducedMotion } from '@/hooks';

import { ChapterMark, DisplayHeading } from './ChapterHeading';
import { drawRule, ENTER, ENTER_TALL, rise } from '@/components/animations';

/** Fine film grain, the texture shared by every cinematic surface on the site. */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

/**
 * The portrait slot.
 *
 * A photograph when the studio has supplied one; a typographic monogram until
 * then. The monogram is set as a deliberate piece of typography — initials at
 * display scale on the page's ink, under the same grain as every other frame —
 * rather than as a grey silhouette, so the page reads as designed rather than
 * as waiting for an upload. Swapping in the photograph is a one-line change in
 * `src/config/about.ts`.
 */
function Portrait({ founder }: { founder: AboutFounder }) {
  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] border border-white/[0.1] bg-[#0A131F]">
      {founder.portrait ? (
        <Image
          src={founder.portrait}
          alt={`${founder.name}, ${founder.role}`}
          fill
          loading="lazy"
          sizes="(min-width: 1024px) 30vw, 100vw"
          className="object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center"
        >
          {/* Ambient gold wash behind the initials, low enough to read as a
              lit room rather than a gradient. */}
          <div
            className="absolute inset-0 opacity-[0.28]"
            style={{
              background:
                'radial-gradient(circle at 50% 42%, rgba(191,167,111,0.45) 0%, transparent 62%)',
            }}
          />
          <span className="relative font-mono text-[clamp(4rem,14vw,6rem)] leading-none font-light tracking-[-0.06em] text-[#BFA76F]/70 lg:text-[clamp(5rem,6.5vw,7.5rem)]">
            {founder.initials}
          </span>
        </div>
      )}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.1] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />
    </div>
  );
}

/**
 * Chapter 02: the founders.
 *
 * The studio is led by a director and a producer, and this chapter sets them
 * as two full-width rows rather than as cards in a team grid: portrait in the
 * margin, name at display scale, the biography as a column, and — for the
 * founder — a first-person line as a pull quote. A two-person studio is not a
 * team page, and a grid would have made it look like one with most of the
 * cells missing.
 *
 * Nothing follows them. A grid of crafts used to sit under the two founders,
 * but chapter 04 already indexes the disciplines, and a second list of them
 * in different words was a repeat rather than a detail.
 */
export function AboutPeople() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section
      id="about-people"
      aria-labelledby="about-people-heading"
      className="scroll-mt-24 bg-[#0A131F] py-24 md:py-32 lg:py-40"
    >
      <div className="px-5 md:px-8 lg:px-14 xl:pl-52">
        <ChapterMark
          number={chapterNumber('about-people')}
          title="The founders"
          still={reducedMotion}
        />

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

        {/* The founders, one row each. */}
        <ol className="mt-16 lg:mt-28">
          {aboutPeople.founders.map((founder, index) => (
            <motion.li
              key={founder.name}
              className="grid grid-cols-1 gap-y-8 border-t border-white/[0.12] py-14 lg:grid-cols-12 lg:gap-x-12 lg:py-20"
              initial="hidden"
              whileInView="visible"
              viewport={ENTER_TALL}
            >
              {/* Portrait in the margin. The second founder's sits on the
                  right, so the two rows read as a spread rather than a list. */}
              <motion.div
                className={
                  index % 2 === 0
                    ? 'lg:col-span-4'
                    : 'lg:col-span-4 lg:col-start-9 lg:row-start-1'
                }
                variants={rise}
                custom={{ still: reducedMotion }}
              >
                <div className="mx-auto max-w-[360px] lg:mx-0 lg:max-w-none">
                  <Portrait founder={founder} />
                </div>
              </motion.div>

              <div
                className={
                  index % 2 === 0
                    ? 'lg:col-span-7 lg:col-start-6'
                    : 'lg:col-span-7 lg:col-start-1 lg:row-start-1'
                }
              >
                <motion.p
                  className="font-mono text-[0.6875rem] tracking-[0.3em] text-[#BFA76F] uppercase"
                  variants={rise}
                  custom={{ delay: 0.06, still: reducedMotion }}
                >
                  {founder.role}
                </motion.p>

                <motion.h3
                  className="mt-4 text-[clamp(2rem,7vw,2.75rem)] leading-[1] font-light tracking-[-0.03em] text-white lg:text-[clamp(2.5rem,3.4vw,3.75rem)]"
                  variants={rise}
                  custom={{ delay: 0.1, still: reducedMotion }}
                >
                  {founder.name}
                </motion.h3>

                <div className="mt-8 max-w-[56ch]">
                  {founder.bio.map((paragraph, paragraphIndex) => (
                    <motion.p
                      key={paragraph.slice(0, 32)}
                      className={
                        paragraphIndex === 0
                          ? 'text-[1.0625rem] leading-[1.75] text-white/[0.85] md:text-[1.125rem]'
                          : 'mt-5 text-[1rem] leading-[1.85] text-white/[0.66] md:text-[1.0625rem]'
                      }
                      variants={rise}
                      custom={{
                        delay: 0.14 + paragraphIndex * 0.06,
                        still: reducedMotion,
                      }}
                    >
                      {paragraph}
                    </motion.p>
                  ))}
                </div>

                {founder.quote && (
                  <motion.figure
                    className="mt-10 max-w-[48ch] border-l border-[#BFA76F]/50 pl-6"
                    variants={rise}
                    custom={{ delay: 0.28, still: reducedMotion }}
                  >
                    <blockquote className="text-[1.25rem] leading-[1.45] font-light tracking-[-0.01em] text-white/[0.92] md:text-[1.5rem]">
                      “{founder.quote}”
                    </blockquote>
                    <figcaption className="mt-4 font-mono text-[0.6875rem] tracking-[0.24em] text-white/40 uppercase">
                      {founder.name}
                    </figcaption>
                  </motion.figure>
                )}
              </div>
            </motion.li>
          ))}
        </ol>

        <motion.div
          aria-hidden="true"
          className="h-px origin-left bg-white/[0.12]"
          variants={drawRule}
          custom={{ still: reducedMotion }}
          initial="hidden"
          whileInView="visible"
          viewport={ENTER}
        />
      </div>
    </section>
  );
}
