'use client';

import { motion, type Variants } from 'framer-motion';

import { CtaButton } from '@/components/ui';
import { studioHighlights } from '@/config/studio';
import { EASE } from '@/constants';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE.out, delay },
  }),
};

const drawLine: Variants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.9, ease: EASE.out } },
};

/**
 * The studio — one line and four points, then the hand-off to the About page.
 *
 * Deliberately the quietest section on the homepage. No headline, no still:
 * the founding line leads, set at statement scale in the left column, and the
 * four things worth knowing sit beside it as ruled rows. Everything longer —
 * the story, the founders, the method, the record — is on the About page,
 * which is where a reader who wants it is going anyway.
 *
 * Padding and gutters mirror every other homepage section so the run of them
 * reads as one continuous page.
 */
export function AboutSection() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="bg-[#0F1012] pt-16 pb-20 md:pt-20 md:pb-24 lg:pt-24 lg:pb-28"
    >
      <div className="w-full px-4 md:px-[3vw] xl:pl-52">
        <motion.p
          className="text-[0.875rem] font-semibold tracking-[0.28em] text-[#BFA76F] uppercase"
          variants={fadeUp}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
        >
          The studio
        </motion.p>

        <div className="mt-10 grid grid-cols-1 gap-y-14 lg:mt-14 lg:grid-cols-12 lg:gap-x-16">
          {/* The line, at statement scale. It is the section's heading. */}
          <div className="lg:col-span-5">
            <motion.h2
              id="about-heading"
              className="max-w-[24ch] text-[clamp(1.5rem,4.8vw,1.875rem)] leading-[1.3] font-light tracking-[-0.015em] text-white lg:text-[clamp(1.75rem,2.1vw,2.25rem)]"
              variants={fadeUp}
              custom={0.08}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.6 }}
            >
              Founded in Dubai in 2025 on one observation: the region&rsquo;s
              films had the polish and were missing the feeling. FC Filmwerks
              was built to put it back, from concept to final mix, in one house.
            </motion.h2>

            <motion.div
              className="mt-10"
              variants={fadeUp}
              custom={0.2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.6 }}
            >
              <CtaButton href="/about">About the studio →</CtaButton>
            </motion.div>
          </div>

          {/* Four points, as ruled rows: number in the margin, title and one
              line beside it. Same hairline-and-number language as the rest
              of the page. */}
          <ol className="lg:col-span-7 lg:col-start-6">
            {studioHighlights.map((item, index) => (
              <motion.li
                key={item.number}
                className="group"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.08,
                      delayChildren: index * 0.06,
                    },
                  },
                }}
              >
                <motion.div
                  aria-hidden="true"
                  className="h-px origin-left bg-white/[0.12] transition-colors duration-500 ease-out group-hover:bg-[#BFA76F]/50"
                  variants={drawLine}
                />

                <motion.div
                  className="grid grid-cols-[3rem_1fr] gap-x-4 py-7 md:grid-cols-[4rem_1fr] md:gap-x-6 lg:py-8"
                  variants={fadeUp}
                >
                  <span className="pt-1 text-[0.75rem] tracking-[0.28em] text-white/35 transition-colors duration-500 ease-out group-hover:text-[#BFA76F]">
                    {item.number}
                  </span>

                  <div>
                    <h3 className="text-[1.375rem] leading-[1.15] font-extralight tracking-[-0.01em] text-white/85 transition-colors duration-500 ease-out group-hover:text-white md:text-[1.625rem]">
                      {item.title}
                    </h3>
                    <p className="mt-2.5 max-w-[46ch] text-[0.9375rem] leading-[1.75] text-white/[0.55]">
                      {item.body}
                    </p>
                  </div>
                </motion.div>
              </motion.li>
            ))}

            {/* Closes the last row, so the set reads as a bounded block. */}
            <motion.div
              aria-hidden="true"
              className="h-px origin-left bg-white/[0.12]"
              variants={drawLine}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
            />
          </ol>
        </div>
      </div>
    </section>
  );
}
