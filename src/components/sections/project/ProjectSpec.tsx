'use client';

import { motion } from 'framer-motion';

import { ENTER, rise } from '@/components/animations';
import { usePrefersReducedMotion } from '@/hooks';
import { cn } from '@/lib/utils';

import { PROJECT_BAND, PROJECT_GUTTER } from './gutter';

/**
 * The closing block: what left the studio, and the project's specification.
 *
 * `delivered` is deliberately a list of deliverables rather than a results
 * panel. No view counts, engagement figures or campaign outcomes were supplied
 * for any of these projects, and a case study that invents them is worse than
 * one that stops at the work. When the studio provides real numbers, this is
 * where they go — see the provenance note in `src/config/projects.ts`.
 *
 * The details table renders whatever rows a project actually has, which is why
 * `Location` appears on exactly one page: exactly one project's source copy
 * names a place.
 */
export function ProjectSpec({
  delivered,
  details,
  number,
}: {
  delivered: string[];
  details: { label: string; value: string }[];
  /** Its place in the page's numbering; see `ProjectStoryItem`. */
  number: string;
}) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section
      id="project-spec"
      aria-labelledby="project-spec-heading"
      className={cn('scroll-mt-28 bg-[#0F1C2E]', PROJECT_BAND)}
    >
      <div className={PROJECT_GUTTER}>
        <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-12 lg:gap-x-14">
          <div className="lg:col-span-5">
            <motion.h2
              id="project-spec-heading"
              className="flex items-baseline gap-5 text-[0.6875rem] font-semibold tracking-[0.3em] text-[#BFA76F] uppercase md:gap-8"
              variants={rise}
              custom={{ still: reducedMotion }}
              initial="hidden"
              whileInView="visible"
              viewport={ENTER}
            >
              <span className="shrink-0 font-mono font-normal">{number}</span>
              What was delivered
            </motion.h2>

            <motion.ul
              className="mt-9"
              initial="hidden"
              whileInView="visible"
              viewport={ENTER}
            >
              {delivered.map((item, index) => (
                <motion.li
                  key={item}
                  className={cn(
                    'flex items-baseline gap-5 border-t border-white/[0.12] py-6',
                    index === delivered.length - 1 &&
                      'border-b border-white/[0.12]',
                  )}
                  variants={rise}
                  custom={{ delay: index * 0.08, still: reducedMotion }}
                >
                  <span
                    aria-hidden="true"
                    className="h-1 w-1 shrink-0 translate-y-[-0.35em] rounded-full bg-[#BFA76F]"
                  />
                  <span className="text-[1.125rem] leading-[1.5] font-light text-white md:text-[1.375rem]">
                    {item}
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          <motion.dl
            className="lg:col-span-6 lg:col-start-7"
            initial="hidden"
            whileInView="visible"
            viewport={ENTER}
          >
            {details.map((detail, index) => (
              <motion.div
                key={detail.label}
                className={cn(
                  'grid grid-cols-1 gap-2 border-t border-white/[0.12] py-6 sm:grid-cols-[10rem_1fr] sm:gap-8',
                  index === details.length - 1 &&
                    'border-b border-white/[0.12]',
                )}
                variants={rise}
                custom={{ delay: index * 0.06, still: reducedMotion }}
              >
                <dt className="font-mono text-[0.625rem] tracking-[0.3em] text-white/35 uppercase sm:pt-1">
                  {detail.label}
                </dt>
                <dd className="text-[1rem] leading-[1.6] text-white/[0.82]">
                  {detail.value}
                </dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>
      </div>
    </section>
  );
}
