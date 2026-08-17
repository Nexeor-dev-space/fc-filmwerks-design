'use client';

import { motion } from 'framer-motion';

import { Button } from '@/components/ui';
import { aboutClosing, aboutContact } from '@/config/about';
import { usePrefersReducedMotion } from '@/hooks';

import { ChapterMark } from './ChapterHeading';
import { drawRule, ENTER, lineReveal, rise } from '@/components/animations';

/** The three details, so the strip is one loop rather than three near-copies. */
const DETAILS = [
  {
    label: 'Email',
    value: aboutContact.email,
    href: `mailto:${aboutContact.email}`,
  },
  { label: 'Phone', value: aboutContact.phone, href: aboutContact.phoneHref },
  { label: 'Based', value: aboutContact.locations, href: null },
] as const;

/**
 * Chapter 07 — the mission, then the way in.
 *
 * The page closes on its own terms rather than on the site's shared
 * `CtaSection`. That component is the homepage's ending and the portfolio's,
 * and using it a third time here would undo the point of the redesign at the
 * final scroll — the reader would land on the exact block they had already seen
 * twice. So: the studio's mission at statement scale, the contact strip, and a
 * single gold action. One call to action in the viewport, which is what the
 * brand rules ask for.
 *
 * Deliberately the quietest chapter on the page. No footage, no grain, no
 * parallax — after six chapters of texture, the restraint is the emphasis.
 */
export function AboutClosing() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section
      id="about-closing"
      aria-labelledby="about-closing-heading"
      className="relative scroll-mt-24 overflow-hidden bg-[#0F1C2E] py-24 md:py-32 lg:py-40"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -bottom-52 h-[38rem] w-[38rem] rounded-full opacity-[0.16] blur-[130px]"
        style={{
          background:
            'radial-gradient(circle, rgba(191,167,111,0.55) 0%, transparent 70%)',
        }}
      />

      <div className="relative px-5 md:px-8 lg:px-14 xl:pl-52">
        <ChapterMark
          number="07"
          title={aboutClosing.label}
          still={reducedMotion}
        />

        <h2
          id="about-closing-heading"
          className="mt-10 max-w-[24ch] text-[clamp(1.75rem,6vw,2.5rem)] leading-[1.14] font-light tracking-[-0.02em] text-white lg:mt-14 lg:text-[clamp(2.5rem,4vw,4rem)]"
        >
          <motion.span
            className="block"
            initial="hidden"
            whileInView="visible"
            viewport={ENTER}
          >
            {aboutClosing.statement.map((line, index) => (
              <span key={line} className="block overflow-hidden pb-[0.12em]">
                <motion.span
                  className="block"
                  variants={lineReveal}
                  custom={{ index, still: reducedMotion }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </motion.span>
        </h2>

        <motion.div
          className="mt-20 lg:mt-28"
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

          <div className="flex flex-col gap-12 pt-12 lg:flex-row lg:items-end lg:justify-between lg:gap-20">
            <motion.dl
              className="flex flex-col gap-9 sm:flex-row sm:gap-16"
              variants={rise}
              custom={{ delay: 0.08, still: reducedMotion }}
            >
              {DETAILS.map((detail) => (
                <div key={detail.label}>
                  <dt className="font-mono text-[0.625rem] tracking-[0.3em] text-white/35 uppercase">
                    {detail.label}
                  </dt>
                  <dd className="mt-3 text-[0.9375rem] text-white/[0.72]">
                    {detail.href ? (
                      <a
                        href={detail.href}
                        className="relative inline-block transition-colors duration-500 ease-out after:absolute after:bottom-[-3px] after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-[#BFA76F] after:transition-transform after:duration-500 after:ease-out hover:text-[#BFA76F] hover:after:scale-x-100 focus-visible:text-[#BFA76F] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#BFA76F]"
                      >
                        {detail.value}
                      </a>
                    ) : (
                      detail.value
                    )}
                  </dd>
                </div>
              ))}
            </motion.dl>

            <motion.div
              className="lg:shrink-0"
              variants={rise}
              custom={{ delay: 0.16, still: reducedMotion }}
            >
              <Button
                href={aboutClosing.cta.href}
                variant="accent"
                size="lg"
                className="focus-visible:outline-[#BFA76F]"
              >
                {aboutClosing.cta.label}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
