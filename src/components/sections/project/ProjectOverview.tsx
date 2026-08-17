'use client';

import { motion } from 'framer-motion';

import { drawRule, ENTER, rise } from '@/components/animations';
import type { Project } from '@/config/projects';
import { usePrefersReducedMotion } from '@/hooks';

/**
 * The overview: what the project was, and what it had to do.
 *
 * Three registers stacked deliberately — the standfirst at lead size, the
 * studio's own verbatim sentence beneath it at body size, and the objective
 * pulled out into the margin. Separating them is the point: a reader can take
 * the project in at a glance, or read the studio's own words, or check the
 * objective, without any of the three getting in the way of the others.
 *
 * The objective is set apart rather than buried in the prose because it is the
 * thing every later chapter is measured against.
 */
export function ProjectOverview({ project }: { project: Project }) {
  const reducedMotion = usePrefersReducedMotion();
  const { standfirst, objective } = project.caseStudy;

  return (
    <section
      aria-labelledby="project-overview-heading"
      className="bg-[#0A131F] py-24 md:py-32 lg:py-40"
    >
      <div className="px-5 md:px-8 lg:px-14">
        <div className="grid grid-cols-1 gap-y-14 lg:grid-cols-12 lg:gap-x-14">
          <div className="lg:col-span-7">
            <motion.p
              id="project-overview-heading"
              className="text-[0.6875rem] font-semibold tracking-[0.3em] text-[#BFA76F] uppercase"
              variants={rise}
              custom={{ still: reducedMotion }}
              initial="hidden"
              whileInView="visible"
              viewport={ENTER}
            >
              Overview
            </motion.p>

            <motion.p
              className="mt-9 max-w-[30ch] text-[clamp(1.5rem,4.6vw,1.875rem)] leading-[1.28] font-light tracking-[-0.02em] text-white lg:max-w-[26ch] lg:text-[clamp(1.875rem,2.6vw,2.75rem)]"
              variants={rise}
              custom={{ delay: 0.08, still: reducedMotion }}
              initial="hidden"
              whileInView="visible"
              viewport={ENTER}
            >
              {standfirst}
            </motion.p>

            {/* The studio's own sentence, kept verbatim and marked as such by
                the quotation setting rather than by a label. */}
            <motion.p
              className="mt-10 max-w-[58ch] border-l border-[#BFA76F]/40 pl-6 text-[1rem] leading-[1.85] text-white/[0.62] md:text-[1.0625rem]"
              variants={rise}
              custom={{ delay: 0.16, still: reducedMotion }}
              initial="hidden"
              whileInView="visible"
              viewport={ENTER}
            >
              {project.summary}
            </motion.p>
          </div>

          <motion.div
            className="lg:col-span-4 lg:col-start-9"
            initial="hidden"
            whileInView="visible"
            viewport={ENTER}
          >
            <motion.div
              aria-hidden="true"
              className="h-px origin-left bg-white/[0.14]"
              variants={drawRule}
              custom={{ still: reducedMotion }}
            />

            <motion.h2
              className="mt-7 text-[0.6875rem] font-semibold tracking-[0.3em] text-white/40 uppercase"
              variants={rise}
              custom={{ delay: 0.08, still: reducedMotion }}
            >
              The objective
            </motion.h2>

            <motion.p
              className="mt-5 max-w-[40ch] text-[1.0625rem] leading-[1.7] text-white/[0.88] md:text-[1.125rem]"
              variants={rise}
              custom={{ delay: 0.14, still: reducedMotion }}
            >
              {objective}
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
