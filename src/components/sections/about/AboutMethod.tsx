'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { aboutMethod } from '@/config/about';
import { usePrefersReducedMotion } from '@/hooks';
import { cn } from '@/lib/utils';

import { ChapterMark, DisplayHeading } from './ChapterHeading';
import { drawRule, ENTER, rise } from '@/components/animations';

/**
 * Chapter 02 — the four stages, as a loop rather than a list.
 *
 * The left column holds every stage word stacked in the same place and fades
 * between them as the right column scrolls, so the reader always has the name
 * of the stage they are inside. All four are rendered at once and only their
 * opacity changes: swapping the text of a single node would reflow it mid
 * transition and flicker on every boundary.
 *
 * Which stage is "current" is decided by an IntersectionObserver with a middle
 * band for a root margin — the top and bottom 45% of the viewport are cut away,
 * so a stage becomes current when it reaches the middle of the screen rather
 * than the moment its first pixel appears. The observer is torn down on unmount;
 * a leaked one would keep firing after a client-side navigation.
 */
export function AboutMethod() {
  const reducedMotion = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const nodes = itemRefs.current.filter(
      (node): node is HTMLLIElement => node !== null,
    );
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = nodes.indexOf(entry.target as HTMLLIElement);
          if (index !== -1) setActive(index);
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );

    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about-method"
      aria-labelledby="about-method-heading"
      className="scroll-mt-24 bg-[#0A131F] py-24 md:py-32 lg:py-40"
    >
      <div className="px-5 md:px-8 lg:px-14 xl:pl-52">
        <ChapterMark number="02" title="The method" still={reducedMotion} />

        <div className="mt-8 grid grid-cols-1 gap-y-8 lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-6">
            <DisplayHeading
              id="about-method-heading"
              lines={aboutMethod.heading}
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
            {aboutMethod.intro}
          </motion.p>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:mt-28 lg:grid-cols-12 lg:gap-x-12">
          {/* The stage word, held in place while its detail scrolls past. */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-[28vh]">
              <p className="font-mono text-[0.6875rem] tracking-[0.32em] text-[#BFA76F] uppercase">
                Stage {aboutMethod.stages[active]?.number}
              </p>

              {/* Every word occupies the same grid cell, so the stack has the
                  height of one line and nothing below it moves. */}
              <div className="mt-6 grid">
                {aboutMethod.stages.map((stage, index) => (
                  <span
                    key={stage.number}
                    aria-hidden="true"
                    className={cn(
                      'col-start-1 row-start-1 text-[clamp(3rem,5.6vw,6rem)] leading-[0.95] font-light tracking-[-0.04em] transition-opacity duration-[900ms] ease-out',
                      index === active
                        ? 'text-white opacity-100'
                        : 'text-white opacity-0',
                    )}
                  >
                    {stage.title}
                  </span>
                ))}
              </div>

              {/* Progress ticks — four marks, the current one gold and long. */}
              <ul className="mt-12 flex items-center gap-2">
                {aboutMethod.stages.map((stage, index) => (
                  <li
                    key={stage.number}
                    aria-hidden="true"
                    className={cn(
                      'h-px transition-all duration-[700ms] ease-out',
                      index === active
                        ? 'w-14 bg-[#BFA76F]'
                        : 'w-7 bg-white/20',
                    )}
                  />
                ))}
              </ul>
            </div>
          </div>

          <ol className="lg:col-span-6 lg:col-start-7">
            {aboutMethod.stages.map((stage, index) => (
              <motion.li
                key={stage.number}
                ref={(node) => {
                  itemRefs.current[index] = node;
                }}
                className="group"
                initial="hidden"
                whileInView="visible"
                viewport={ENTER}
              >
                <motion.div
                  aria-hidden="true"
                  className="h-px origin-left bg-white/[0.12] transition-colors duration-700 ease-out group-hover:bg-[#BFA76F]/50"
                  variants={drawRule}
                  custom={{ still: reducedMotion }}
                />

                <div className="py-12 lg:py-20">
                  <motion.div
                    className="flex items-baseline gap-5"
                    variants={rise}
                    custom={{ still: reducedMotion }}
                  >
                    <span className="font-mono text-[0.6875rem] tracking-[0.3em] text-[#BFA76F]">
                      {stage.number}
                    </span>
                    {/* The stage name repeats here for phones, where the
                        sticky word column is not rendered at all. */}
                    <h3 className="text-[2rem] leading-[1.05] font-light tracking-[-0.02em] text-white lg:hidden">
                      {stage.title}
                    </h3>
                  </motion.div>

                  <motion.p
                    className="mt-6 max-w-[46ch] text-[1.125rem] leading-[1.7] text-white/85 md:text-[1.25rem]"
                    variants={rise}
                    custom={{ delay: 0.08, still: reducedMotion }}
                  >
                    {stage.body}
                  </motion.p>

                  <motion.p
                    className="mt-6 max-w-[46ch] font-mono text-[0.75rem] leading-[1.9] text-white/40"
                    variants={rise}
                    custom={{ delay: 0.16, still: reducedMotion }}
                  >
                    {stage.aside}
                  </motion.p>
                </div>
              </motion.li>
            ))}

            {/* Closes the last row, so the set reads as a bounded block. */}
            <motion.div
              aria-hidden="true"
              className="h-px origin-left bg-white/[0.12]"
              variants={drawRule}
              custom={{ still: reducedMotion }}
              initial="hidden"
              whileInView="visible"
              viewport={ENTER}
            />
          </ol>
        </div>
      </div>
    </section>
  );
}
