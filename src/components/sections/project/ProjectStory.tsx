'use client';

import { motion } from 'framer-motion';

import { drawRule, ENTER, ENTER_TALL, rise } from '@/components/animations';
import type { ProjectChapter } from '@/config/projects';
import { usePrefersReducedMotion } from '@/hooks';
import { cn } from '@/lib/utils';

/**
 * The narrative chapters.
 *
 * Neither the count nor the titles are fixed — they come from the project's own
 * `caseStudy.chapters`, which is what stops eight pages reading as one template
 * with the nouns swapped. An event that happens once genuinely does not have the
 * same story shape as a script-to-finish vertical campaign, and the config says
 * so explicitly.
 *
 * The layout alternates. Odd chapters sit on the left half of the grid, even
 * ones are pushed across and down — a straight stack of identical text blocks
 * is what makes long-form pages feel like a form to fill in. The number hangs in
 * the margin beside the title, where a printed page would put it.
 */
export function ProjectStory({ chapters }: { chapters: ProjectChapter[] }) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section
      aria-label="How the project was made"
      className="bg-[#0F1C2E] py-24 md:py-32 lg:py-40"
    >
      <div className="px-5 md:px-8 lg:px-14">
        <ol>
          {chapters.map((chapter, index) => {
            const offset = index % 2 === 1;

            return (
              <motion.li
                key={chapter.number}
                className={cn(
                  'grid grid-cols-1 lg:grid-cols-12 lg:gap-x-14',
                  index > 0 && 'mt-20 lg:mt-32',
                )}
                initial="hidden"
                whileInView="visible"
                viewport={ENTER_TALL}
              >
                <div
                  className={cn(
                    'lg:col-span-8',
                    offset && 'lg:col-start-5 lg:col-end-13',
                  )}
                >
                  <motion.div
                    aria-hidden="true"
                    className="h-px origin-left bg-white/[0.14]"
                    variants={drawRule}
                    custom={{ still: reducedMotion }}
                  />

                  {/* Number and title share a baseline row, with the numeral in
                      its own narrow track so the titles all start on the same
                      vertical however long the numbers get. */}
                  <div className="mt-8 flex items-baseline gap-5 md:gap-8">
                    <motion.span
                      className="shrink-0 font-mono text-[0.6875rem] tracking-[0.3em] text-[#BFA76F]"
                      variants={rise}
                      custom={{ still: reducedMotion }}
                    >
                      {chapter.number}
                    </motion.span>

                    <motion.h2
                      className="text-[clamp(1.5rem,5.4vw,2rem)] leading-[1.1] font-light tracking-[-0.02em] text-white lg:text-[clamp(2rem,3vw,3rem)]"
                      variants={rise}
                      custom={{ delay: 0.06, still: reducedMotion }}
                    >
                      {chapter.title}
                    </motion.h2>
                  </div>

                  {/* The prose hangs under the title rather than under the
                      number — the indent is what keeps the numeral reading as a
                      marginal mark instead of as part of the sentence. */}
                  <div className="mt-7 md:pl-[calc(0.6875rem*3+2rem)]">
                    {chapter.body.map((paragraph, paragraphIndex) => (
                      <motion.p
                        key={paragraph.slice(0, 32)}
                        className={cn(
                          'max-w-[62ch] text-[1.0625rem] leading-[1.85] text-white/[0.72] md:text-[1.125rem]',
                          paragraphIndex > 0 && 'mt-6',
                        )}
                        variants={rise}
                        custom={{
                          delay: 0.12 + paragraphIndex * 0.06,
                          still: reducedMotion,
                        }}
                      >
                        {paragraph}
                      </motion.p>
                    ))}
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

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
}: {
  delivered: string[];
  details: { label: string; value: string }[];
}) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section
      aria-labelledby="project-spec-heading"
      className="bg-[#0A131F] py-24 md:py-32 lg:py-40"
    >
      <div className="px-5 md:px-8 lg:px-14">
        <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-12 lg:gap-x-14">
          <div className="lg:col-span-5">
            <motion.h2
              id="project-spec-heading"
              className="text-[0.6875rem] font-semibold tracking-[0.3em] text-[#BFA76F] uppercase"
              variants={rise}
              custom={{ still: reducedMotion }}
              initial="hidden"
              whileInView="visible"
              viewport={ENTER}
            >
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
