'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

import { aboutStory } from '@/config/about';
import { usePrefersReducedMotion } from '@/hooks';

import { ChapterMark, DisplayHeading } from './ChapterHeading';
import { drawRule, ENTER, ENTER_TALL, rise } from '@/components/animations';

/** Fine film grain, the texture shared by every cinematic surface on the site. */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

/**
 * Chapter 01 — who the studio is, set as an editorial spread.
 *
 * The heading column is `sticky` rather than pinned. A pinned ScrollTrigger
 * cannot add its spacer inside a flex or grid child — it writes a fixed height
 * instead and the section's scroll distance silently vanishes — so anything on
 * this page that needs to hold position while its neighbour scrolls uses CSS
 * stickiness, which has no such constraint and nothing to clean up.
 *
 * The prose is the studio's own paragraph, split at its own sentence breaks so
 * it can be set as a column. A drop cap opens it, which is the single most
 * economical way to say "read this as an article" — and is the reason the
 * chapter does not need a card, a border or a background to feel composed.
 */
export function AboutStory() {
  const reducedMotion = usePrefersReducedMotion();
  const stillRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: stillRef,
    offset: ['start end', 'end start'],
  });

  const stillY = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const stillScale = useTransform(scrollYProgress, [0, 1], [1.14, 1]);
  /* Floors at 0.3 rather than 0: a stuck progress value should leave a dim
     picture, never an absent one. */
  const stillOpacity = useTransform(scrollYProgress, [0, 0.32], [0.3, 1]);

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
                number="01"
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

            {/* Studio still, held to a portrait-ish 4:3 and pushed off the
                column's left edge so it breaks the text block rather than
                sitting obediently under it. */}
            <div
              ref={stillRef}
              className="relative mt-14 aspect-[4/3] overflow-hidden rounded-[2px] border border-white/[0.08] lg:mt-20 lg:-ml-24"
            >
              <motion.div
                className="absolute inset-x-0 -top-10 -bottom-10"
                style={
                  reducedMotion
                    ? undefined
                    : { y: stillY, opacity: stillOpacity }
                }
              >
                <motion.div
                  className="absolute inset-0"
                  style={reducedMotion ? undefined : { scale: stillScale }}
                >
                  <Image
                    src={aboutStory.image}
                    alt={aboutStory.imageAlt}
                    fill
                    loading="lazy"
                    sizes="(min-width: 1024px) 55vw, 100vw"
                    className="object-cover"
                  />
                </motion.div>
              </motion.div>

              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#0A131F]/70 via-transparent to-transparent"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.1] mix-blend-overlay"
                style={{ backgroundImage: GRAIN }}
              />
            </div>

            <motion.p
              className="mt-4 font-mono text-[0.6875rem] tracking-[0.18em] text-white/35 uppercase lg:-ml-24"
              variants={rise}
              custom={{ still: reducedMotion }}
              initial="hidden"
              whileInView="visible"
              viewport={ENTER}
            >
              {aboutStory.imageCaption}
            </motion.p>
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
      </div>
    </section>
  );
}
