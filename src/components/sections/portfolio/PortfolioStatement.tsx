'use client';

import { motion } from 'framer-motion';

import { portfolioStatement } from '@/config/portfolio';
import { usePrefersReducedMotion } from '@/hooks';

import { cascade, ENTER, rise } from './motion';
import { DisplayHeading, SectionSlug } from './PortfolioHeading';

/**
 * The studio's creative statement, set as a pull quote.
 *
 * It sits between the contact sheet and the CTA on purpose: the visitor has
 * just been through the whole archive, and this is the sentence that explains
 * what they have been looking at before they are asked to get in touch.
 *
 * The heading is a `<p>` rather than an `<h2>` — it is a quotation, not a
 * section title, and the section is labelled by the slug above it. The two
 * supporting paragraphs run in a narrow pair of columns beneath, indented past
 * the quote so the block steps rather than stacks.
 */
export function PortfolioStatement() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section
      aria-labelledby="portfolio-statement-heading"
      className="relative overflow-hidden bg-[#0A131F] pb-24 md:pb-28 lg:pb-32"
    >
      {/* A single low gold wash, centred under the quote. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.16] blur-[140px]"
        style={{
          background:
            'radial-gradient(circle, rgba(191,167,111,0.6) 0%, transparent 70%)',
        }}
      />

      <div className="relative px-5 md:px-8 lg:px-14">
        <h2 id="portfolio-statement-heading" className="sr-only">
          Our approach
        </h2>

        <SectionSlug still={reducedMotion}>
          {portfolioStatement.slug}
        </SectionSlug>

        <div className="pt-10 lg:pt-14">
          {/* The opening quotation mark is set outside the measure and pulled
              back, so the first word of the quote keeps the left margin. */}
          <div className="relative">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-8 -left-3 font-mono text-[5rem] leading-none text-[#BFA76F]/25 select-none md:-top-10 md:-left-6 md:text-[7rem]"
            >
              “
            </span>

            <DisplayHeading
              as="p"
              lines={portfolioStatement.quote}
              still={reducedMotion}
              className="relative max-w-[16ch] text-[clamp(1.875rem,7vw,2.5rem)] leading-[1.1] font-light tracking-[-0.03em] text-white lg:max-w-[18ch] lg:text-[clamp(2.5rem,4.6vw,4rem)]"
            />
          </div>

          <motion.div
            className="mt-12 grid grid-cols-1 gap-x-12 gap-y-6 md:grid-cols-2 lg:mt-16 lg:ml-[16.6667%] lg:gap-x-16"
            variants={cascade}
            initial="hidden"
            whileInView="visible"
            viewport={ENTER}
          >
            {portfolioStatement.body.map((paragraph, index) => (
              <motion.p
                key={paragraph}
                className="max-w-[56ch] text-[0.9375rem] leading-[1.8] text-white/[0.62] md:text-[1rem]"
                variants={rise}
                custom={{ delay: index * 0.1, still: reducedMotion }}
              >
                {paragraph}
              </motion.p>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
