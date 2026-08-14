'use client';

import { motion, type Variants } from 'framer-motion';

import { aboutStages } from '@/config/about';
import { EASE } from '@/constants';
import { useIsMobile, usePrefersReducedMotion } from '@/hooks';

interface StageCue {
  lift: number;
  still: boolean;
}

/** Rows arrive one after another rather than as a block. */
const listVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const rowVariants: Variants = {
  hidden: ({ lift, still }: StageCue) => ({
    opacity: 0,
    y: still ? 0 : lift,
  }),
  visible: ({ still }: StageCue) => ({
    opacity: 1,
    y: 0,
    transition: still
      ? { duration: 0.4, ease: EASE.out, y: { duration: 0 } }
      : { duration: 0.9, ease: EASE.expo },
  }),
};

/** Draws left to right as each row arrives — a frame line, not a divider. */
const ruleVariants: Variants = {
  hidden: ({ still }: StageCue) => ({ scaleX: still ? 1 : 0 }),
  visible: ({ still }: StageCue) => ({
    scaleX: 1,
    transition: still ? { duration: 0 } : { duration: 1.1, ease: EASE.expo },
  }),
};

/**
 * The four stages, set as an editorial list rather than a row of cards.
 *
 * Each stage is a hairline rule, an index, the stage name and the studio's own
 * sentence for it — the same anatomy as a title card, which is what keeps this
 * from reading as a feature grid. The copy is the studio's single paragraph
 * split across the stages it describes, in its original order.
 */
export function AboutPhilosophy() {
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const cue: StageCue = { lift: isMobile ? 28 : 44, still: reducedMotion };

  return (
    <section
      id="about-philosophy"
      aria-labelledby="about-philosophy-heading"
      className="bg-[#0F1C2E] pt-20 pb-20 md:pt-28 md:pb-24 lg:pt-32 lg:pb-28"
    >
      <div className="w-full px-4 md:px-[3vw]">
        <motion.p
          className="mb-5 text-[0.875rem] font-semibold tracking-[0.28em] text-[#BFA76F] uppercase"
          variants={rowVariants}
          custom={cue}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
        >
          How we work
        </motion.p>

        <motion.h2
          id="about-philosophy-heading"
          className="max-w-[20ch] text-[2.5rem] leading-[0.95] font-semibold tracking-[-0.02em] text-white uppercase md:text-[3.375rem] lg:text-[4rem]"
          variants={rowVariants}
          custom={cue}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
        >
          Four stages,
          <br />
          on repeat
        </motion.h2>

        <motion.ol
          className="mt-16 lg:mt-24"
          variants={listVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {aboutStages.map((stage) => (
            <motion.li
              key={stage.number}
              className="group relative"
              variants={rowVariants}
              custom={cue}
            >
              <motion.span
                aria-hidden="true"
                className="block h-px origin-left bg-white/[0.12]"
                variants={ruleVariants}
                custom={cue}
              />

              <div className="flex flex-col gap-4 py-8 md:flex-row md:items-baseline md:gap-12 md:py-10 lg:gap-20 lg:py-12">
                <span className="text-[0.75rem] tracking-[0.28em] text-[#BFA76F] md:w-16 md:shrink-0">
                  {stage.number}
                </span>

                <h3 className="text-[2rem] leading-[1.05] font-extralight tracking-tight text-white transition-colors duration-[600ms] ease-out group-hover:text-[#BFA76F] md:w-[38%] md:shrink-0 md:text-[2.75rem] lg:text-[3.25rem]">
                  {stage.title}
                </h3>

                <p className="max-w-[52ch] text-[1rem] leading-[1.8] text-white/[0.68] md:text-[1.0625rem]">
                  {stage.body}
                </p>
              </div>
            </motion.li>
          ))}

          {/* Closes the last row, so the set reads as a bounded block. */}
          <motion.span
            aria-hidden="true"
            className="block h-px origin-left bg-white/[0.12]"
            variants={ruleVariants}
            custom={cue}
          />
        </motion.ol>
      </div>
    </section>
  );
}
