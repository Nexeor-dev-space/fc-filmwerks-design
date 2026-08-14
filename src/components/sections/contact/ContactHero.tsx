'use client';

import { motion, type Variants } from 'framer-motion';

import { ScrollIndicator } from '@/components/intro/ScrollIndicator';
import { BackgroundVideo } from '@/components/ui';
import { contactHero } from '@/config/contact';
import { EASE } from '@/constants';
import { usePrefersReducedMotion } from '@/hooks';

interface Cue {
  index?: number;
  delay?: number;
  still: boolean;
}

/**
 * Line-by-line mask reveal, matching the About and Portfolio heroes.
 *
 * The still branch zeroes the duration rather than dropping `y` — the reduced
 * motion preference resolves false on first render, so Framer bakes the moving
 * `initial` into the DOM before it settles, and a variant that omitted the
 * property would strand each line below its mask permanently.
 */
const lineReveal: Variants = {
  hidden: ({ still }: Cue) => ({ y: still ? '0%' : '110%' }),
  visible: ({ index = 0, still }: Cue) => ({
    y: '0%',
    transition: still
      ? { duration: 0, delay: 0.1 + index * 0.08 }
      : { duration: 1.05, ease: EASE.expo, delay: 0.1 + index * 0.08 },
  }),
};

const fadeUp: Variants = {
  hidden: ({ still }: Cue) => ({ opacity: 0, y: still ? 0 : 28 }),
  visible: ({ delay = 0, still }: Cue) => ({
    opacity: 1,
    y: 0,
    transition: still
      ? { duration: 0.4, ease: EASE.out, delay, y: { duration: 0 } }
      : { duration: 0.9, ease: EASE.expo, delay },
  }),
};

/**
 * Opening frame of the Contact page.
 *
 * Full-bleed footage inside the same inset, rounded frame the intro, About
 * and Portfolio heroes use, so this closes the site in the language it opened
 * in rather than as a separate template.
 */
export function ContactHero() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section
      aria-labelledby="contact-hero-heading"
      className="relative min-h-dvh w-full bg-[#0F1012] p-2 md:p-3"
    >
      <div className="relative flex min-h-[calc(100dvh-1rem)] flex-col justify-end overflow-hidden rounded-[28px] md:min-h-[calc(100dvh-1.5rem)]">
        <BackgroundVideo
          src="/videos/banner-video.mp4"
          fallbackClassName="bg-[#0F1C2E]"
          overlay="linear-gradient(to top, rgba(10,19,31,0.90) 0%, rgba(10,19,31,0.58) 45%, rgba(10,19,31,0.48) 100%)"
        />

        {/* Mobile keeps the cue centred beneath the copy, so the copy needs
            room for it; from `md` up the cue moves to the right gutter and the
            usual padding is enough again. */}
        <div className="relative z-10 w-full px-6 pt-32 pb-48 md:px-12 md:pb-32 lg:px-16 lg:pb-36">
          <motion.p
            className="mb-8 text-[0.8125rem] font-semibold tracking-[0.32em] text-[#BFA76F] uppercase md:mb-10"
            variants={fadeUp}
            custom={{ delay: 0, still: reducedMotion }}
            initial="hidden"
            animate="visible"
          >
            {contactHero.label}
          </motion.p>

          <motion.h1
            id="contact-hero-heading"
            className="max-w-[18ch] text-[clamp(40px,10vw,64px)] leading-[0.94] font-bold tracking-[-0.02em] text-white lg:text-[clamp(56px,6.2vw,112px)]"
            initial="hidden"
            animate="visible"
          >
            {contactHero.headline.map((line, index) => (
              <span key={line} className="block overflow-hidden pb-[0.08em]">
                <motion.span
                  className="block"
                  variants={lineReveal}
                  custom={{ index, still: reducedMotion }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </motion.h1>

          <motion.p
            className="mt-8 max-w-[46ch] text-[1rem] leading-[1.8] text-white/[0.72] md:mt-10 md:text-[1.0625rem] lg:text-[1.125rem]"
            variants={fadeUp}
            custom={{ delay: 0.5, still: reducedMotion }}
            initial="hidden"
            animate="visible"
          >
            {contactHero.body}
          </motion.p>
        </div>

        <motion.div
          aria-hidden="true"
          /* Unlike the About hero this one carries a supporting paragraph, so
             a centred cue would sit straight on top of it — from `md` up it
             moves out to the right gutter, clear of the copy column. */
          className="absolute inset-x-0 bottom-10 z-10 flex justify-center text-white md:bottom-12 md:justify-end md:pr-12 lg:pr-16"
          variants={fadeUp}
          custom={{ delay: 0.9, still: reducedMotion }}
          initial="hidden"
          animate="visible"
        >
          <ScrollIndicator />
        </motion.div>
      </div>
    </section>
  );
}
