'use client';

import { motion, type Variants } from 'framer-motion';

import { ScrollIndicator } from '@/components/intro/ScrollIndicator';
import { BackgroundVideo } from '@/components/ui';
import { aboutHero } from '@/config/about';
import { EASE } from '@/constants';
import { usePrefersReducedMotion } from '@/hooks';

/**
 * Line-by-line mask reveal, matching the footer headline.
 *
 * Both branches always name `y`, and the still branch zeroes its duration
 * rather than dropping the property. `usePrefersReducedMotion` is false on the
 * first render by design, so Framer bakes the moving `initial` into the DOM
 * before the preference resolves — a still variant that simply omitted `y`
 * would never animate that baked transform away, and the lines would sit at
 * 110% below their masks forever.
 */
const lineReveal: Variants = {
  hidden: ({ still }: { index: number; still: boolean }) => ({
    y: still ? '0%' : '110%',
  }),
  visible: ({ index, still }: { index: number; still: boolean }) => ({
    y: '0%',
    transition: still
      ? { duration: 0, delay: 0.1 + index * 0.08 }
      : { duration: 1.05, ease: EASE.expo, delay: 0.1 + index * 0.08 },
  }),
};

const fadeUp: Variants = {
  hidden: ({ still }: { delay: number; still: boolean }) => ({
    opacity: 0,
    y: still ? 0 : 28,
  }),
  visible: ({ delay, still }: { delay: number; still: boolean }) => ({
    opacity: 1,
    y: 0,
    transition: still
      ? { duration: 0.4, ease: EASE.out, delay, y: { duration: 0 } }
      : { duration: 0.9, ease: EASE.expo, delay },
  }),
};

/**
 * Opening frame of the About page.
 *
 * Full-bleed footage inside the same inset, rounded frame the intro uses, so
 * the page opens in the site's own language rather than as a separate
 * template. The headline is the studio's four-stage tagline, one line per
 * stage, which is what the section below then expands on.
 */
export function AboutHero() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section
      aria-labelledby="about-hero-heading"
      className="relative min-h-dvh w-full bg-[#0F1012] p-2 md:p-3"
    >
      <div className="relative flex min-h-[calc(100dvh-1rem)] flex-col justify-end overflow-hidden rounded-[28px] md:min-h-[calc(100dvh-1.5rem)]">
        <BackgroundVideo
          src="/videos/banner-video.mp4"
          fallbackClassName="bg-[#0F1C2E]"
          overlay="linear-gradient(to top, rgba(10,19,31,0.88) 0%, rgba(10,19,31,0.55) 45%, rgba(10,19,31,0.45) 100%)"
        />

        <div className="relative z-10 w-full px-6 pt-32 pb-28 md:px-12 md:pb-32 lg:px-16 lg:pb-36">
          <motion.p
            className="mb-8 text-[0.8125rem] font-semibold tracking-[0.32em] text-[#BFA76F] uppercase md:mb-10"
            variants={fadeUp}
            custom={{ delay: 0, still: reducedMotion }}
            initial="hidden"
            animate="visible"
          >
            {aboutHero.label}
          </motion.p>

          <motion.h1
            id="about-hero-heading"
            className="max-w-[16ch] text-[clamp(40px,10vw,64px)] leading-[0.94] font-bold tracking-[-0.02em] text-white lg:text-[clamp(56px,6.2vw,112px)]"
            initial="hidden"
            animate="visible"
          >
            {aboutHero.headline.map((line, index) => (
              <span key={line} className="block overflow-hidden pb-[0.08em]">
                <motion.span
                  className="block"
                  variants={lineReveal}
                  custom={{ index, still: reducedMotion }}
                >
                  {/* The final stage carries the accent — it is the one that
                      turns a list of steps into a loop. */}
                  <span
                    className={
                      index === aboutHero.headline.length - 1
                        ? 'text-[#BFA76F]'
                        : undefined
                    }
                  >
                    {line}
                  </span>
                </motion.span>
              </span>
            ))}
          </motion.h1>
        </div>

        <motion.div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-10 z-10 flex justify-center text-white md:bottom-12"
          variants={fadeUp}
          custom={{ delay: 0.8, still: reducedMotion }}
          initial="hidden"
          animate="visible"
        >
          <ScrollIndicator />
        </motion.div>
      </div>
    </section>
  );
}
