'use client';

import { motion } from 'framer-motion';

import { aboutStory, chapterNumber } from '@/config/about';
import { manifesto } from '@/config/manifesto';
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
 * Chapter 01: who the studio is, set as an editorial spread.
 *
 * The heading column is `sticky` rather than pinned. A pinned ScrollTrigger
 * cannot add its spacer inside a flex or grid child, so anything on this page
 * that needs to hold position while its neighbour scrolls uses CSS stickiness,
 * which has no such constraint and nothing to clean up.
 *
 * Type only. The chapter used to carry a production still, but chapter 05 is
 * ten of them from the same set, and showing one of those here first made the
 * strip a repeat. The prose, the pull quote and the four principles are the
 * chapter.
 */
export function AboutStory() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section
      id="about-studio"
      aria-labelledby="about-studio-heading"
      className="scroll-mt-24 bg-[#0F1C2E] py-24 md:py-32 lg:py-40"
    >
      <div className="px-5 md:px-8 lg:px-14 xl:pl-52">
        <div className="grid grid-cols-1 gap-y-14 lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <ChapterMark
                number={chapterNumber('about-studio')}
                title="The studio"
                still={reducedMotion}
              />

              <DisplayHeading
                id="about-studio-heading"
                lines={aboutStory.heading}
                still={reducedMotion}
                className="mt-8 text-[clamp(2.125rem,7vw,2.75rem)] leading-[1.02] font-light tracking-[-0.03em] text-white lg:text-[clamp(2.5rem,3.6vw,3.75rem)]"
              />

              {/* Margin note — mono, indented off a gold hairline, the way a
                  printed page annotates its own column. */}
              <motion.p
                className="mt-10 max-w-[34ch] border-l border-[#BFA76F]/40 pl-5 font-mono text-[0.75rem] leading-[1.9] tracking-[0.02em] text-white/45"
                variants={rise}
                custom={{ delay: 0.2, still: reducedMotion }}
                initial="hidden"
                whileInView="visible"
                viewport={ENTER}
              >
                {aboutStory.note}
              </motion.p>
            </div>
          </div>

          {/* The prose column sits on track 8 of 12, so it is inset from both
              the heading and the page edge — the asymmetry is the layout. */}
          <div className="lg:col-span-6 lg:col-start-7">
            <motion.div
              className="max-w-[56ch]"
              initial="hidden"
              whileInView="visible"
              viewport={ENTER_TALL}
            >
              {aboutStory.paragraphs.map((paragraph, index) => (
                <motion.p
                  key={paragraph.slice(0, 32)}
                  className={
                    index === 0
                      ? /* Lead paragraph, not a drop cap. A cap would have set
                           an oversized `f` beside "cfilmwerks" and broken the
                           wordmark in half — the studio spells its name in
                           lowercase, which is exactly the case a drop cap
                           cannot take. Scale and weight do the same job of
                           marking where the column starts. */
                        'text-[1.25rem] leading-[1.6] font-light text-white/[0.92] md:text-[1.5rem]'
                      : 'mt-7 text-[1.0625rem] leading-[1.85] text-white/[0.72] md:text-[1.125rem]'
                  }
                  variants={rise}
                  custom={{ delay: index * 0.08, still: reducedMotion }}
                >
                  {paragraph}
                </motion.p>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Pull quote, closing the chapter across the full measure. */}
        <motion.figure
          className="mt-24 lg:mt-36"
          initial="hidden"
          whileInView="visible"
          viewport={ENTER}
        >
          <motion.div
            aria-hidden="true"
            className="h-px origin-left bg-white/[0.12]"
            variants={drawRule}
            custom={{ still: reducedMotion }}
          />

          <motion.blockquote
            className="max-w-[26ch] pt-12 text-[clamp(1.5rem,4.6vw,2rem)] leading-[1.2] font-light tracking-[-0.02em] text-white/90 lg:max-w-[22ch] lg:pt-16 lg:text-[clamp(2rem,3.2vw,3.25rem)]"
            variants={rise}
            custom={{ delay: 0.12, still: reducedMotion }}
          >
            {aboutStory.quote}
          </motion.blockquote>
        </motion.figure>

        {/* The four working principles, two-up. These closed the homepage as
            a section of their own; here they close the chapter they belong
            to, in the same hairline-and-number language as the rest of the
            dossier. */}
        <motion.p
          className="mt-20 font-mono text-[0.6875rem] tracking-[0.32em] text-white/45 uppercase lg:mt-28"
          variants={rise}
          custom={{ still: reducedMotion }}
          initial="hidden"
          whileInView="visible"
          viewport={ENTER}
        >
          {aboutStory.principlesHeading}
        </motion.p>

        <motion.ol
          className="mt-8 grid grid-cols-1 gap-x-12 md:grid-cols-2"
          variants={cascade}
          initial="hidden"
          whileInView="visible"
          viewport={ENTER_TALL}
        >
          {manifesto.map((principle) => (
            <motion.li
              key={principle.number}
              className="group pb-10 lg:pb-12"
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
                {principle.number}
              </span>

              <h3 className="mt-4 text-[1.375rem] leading-[1.15] font-light tracking-[-0.01em] text-white md:text-[1.625rem]">
                {principle.title}
              </h3>

              <p className="mt-3 max-w-[42ch] text-[0.9375rem] leading-[1.8] text-white/[0.58]">
                {principle.body}
              </p>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
