'use client';

import { motion, type Variants } from 'framer-motion';

import { EASE } from '@/constants';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE.out, delay },
  }),
};

/**
 * Portfolio introduction.
 *
 * Deliberately the homepage's Featured Work header, not a separate hero: the
 * same type sizes, the same left-heading / right-standfirst split, the same
 * gutters. The page is the expanded version of that section, so it should open
 * on the same frame — with a gold label added, since this one is a page rather
 * than a band inside one.
 */
export function PortfolioHero() {
  return (
    <section
      aria-labelledby="portfolio-heading"
      className="bg-[#0F1012] pt-32 pb-16 md:pt-40 md:pb-20 lg:pt-44 lg:pb-24"
    >
      <div className="w-full px-4 md:px-[3vw]">
        <header className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-20">
          <div>
            <motion.p
              className="mb-5 text-[0.875rem] font-semibold tracking-[0.28em] text-[#BFA76F] uppercase"
              variants={fadeUp}
              custom={0}
              initial="hidden"
              animate="visible"
            >
              Our work
            </motion.p>

            <motion.h1
              id="portfolio-heading"
              className="text-[2.5rem] leading-[0.95] font-semibold tracking-[-0.02em] text-white uppercase md:text-[3.25rem] lg:text-[4rem] xl:text-[4.5rem]"
              variants={fadeUp}
              custom={0.08}
              initial="hidden"
              animate="visible"
            >
              Featured
              <br />
              work
            </motion.h1>
          </div>

          <motion.p
            className="max-w-[460px] text-[1rem] leading-[1.8] text-white/[0.72] md:text-[1.0625rem] lg:shrink-0 lg:text-[1.125rem]"
            variants={fadeUp}
            custom={0.16}
            initial="hidden"
            animate="visible"
          >
            We craft films that connect brands with people through emotion,
            storytelling and unforgettable visuals.
          </motion.p>
        </header>
      </div>
    </section>
  );
}
