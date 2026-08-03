'use client';

import { motion, type Variants } from 'framer-motion';

import { useHeroRevealed } from '@/components/intro/HeroRevealContext';
import { FloatingNav } from '@/components/layout/FloatingNav';
import {
  BackgroundVideo,
  Button,
  Container,
  RotatingWord,
} from '@/components/ui';
import { EASE } from '@/constants';

/** First two lines of the headline; fixed. */
const HEADLINE_FIXED_LINES = ['CREATIVE', 'MEDIA'];

/** Third line — cycles one word at a time, in order. */
const ROTATING_WORDS = [
  'PRODUCTION',
  'STORYTELLING',
  'FILMS',
  'CONTENT',
  'EXPERIENCES',
];

/** Slides up from behind its own overflow-hidden wrapper. */
const lineVariants: Variants = {
  hidden: { y: '110%' },
  visible: (index: number) => ({
    y: '0%',
    transition: { duration: 1.05, ease: EASE.expo, delay: 0.25 + index * 0.11 },
  }),
};

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: EASE.out, delay },
  }),
};

/**
 * Hero: full-bleed footage with the headline set right and a small block of
 * copy anchored bottom-left, the two held apart by the width of the frame.
 *
 * The split only applies from `lg`. Below that the two blocks stack — headline
 * first — and on phones everything centres, since a right-aligned headline in a
 * narrow column just reads as broken.
 *
 * Entrances wait on `useHeroRevealed`, so they play when the aperture opens
 * rather than while the hero is still hidden beneath the intro.
 */
export function Hero() {
  const revealed = useHeroRevealed();
  const animate = revealed ? 'visible' : 'hidden';

  return (
    // `min-h-full`, not `min-h-dvh`: the hero is framed by a small page margin,
    // so it fills its container rather than the whole viewport. Its parent
    // always has a definite height for the percentage to resolve against.
    <section className="relative flex min-h-full flex-col overflow-hidden text-bone">
      <BackgroundVideo
        src="/videos/banner-video.mp4"
        overlay="linear-gradient(rgba(15,28,46,0.62), rgba(15,28,46,0.55))"
      />

      {/* The flat overlay alone is not enough where the footage goes bright —
          this seats the description and buttons regardless of what is on screen
          behind them at that moment. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(15,28,46,0.62) 0%, rgba(15,28,46,0.28) 26%, transparent 55%)',
        }}
      />

      <FloatingNav />

      {/*
        Everything sits on one bottom band: description bottom-left, headline
        bottom-right, both aligned to the same baseline edge.
        `flex-row-reverse` puts the headline (first in the DOM) on the right
        while keeping it first when the row collapses to a column — so small
        screens still read headline, then description, without order utilities.
      */}
      <Container
        size="wide"
        className="relative z-10 flex flex-1 flex-col justify-end pt-32 pb-16 md:pt-40 md:pb-20 lg:pb-24"
      >
        <div className="flex flex-col gap-12 lg:flex-row-reverse lg:items-end lg:justify-between lg:gap-16">
          <div className="w-full text-center lg:w-auto lg:text-right">
            {/* Lines 1–2: fixed. Line 3: a single word that keeps cycling long
                after this reveal has finished — RotatingWord runs its own
                interval independent of the slide-up below, and inherits this
                h1's size, weight and colour since it sets none of its own. */}
            {/* Gold reads 7.9:1 against the navy scrim over the footage —
                the rotating word inherits it along with the rest. */}
            <h1 className="text-[clamp(40px,11vw,64px)] leading-[0.92] font-bold tracking-[-0.02em] text-[#BFA76F] lg:text-[clamp(56px,6.5vw,120px)]">
              {HEADLINE_FIXED_LINES.map((line, index) => (
                <span key={line} className="block overflow-hidden pb-[0.08em]">
                  <motion.span
                    className="block"
                    variants={lineVariants}
                    custom={index}
                    initial="hidden"
                    animate={animate}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}

              <span className="block overflow-hidden pb-[0.08em]">
                <motion.span
                  className="block"
                  variants={lineVariants}
                  custom={HEADLINE_FIXED_LINES.length}
                  initial="hidden"
                  animate={animate}
                >
                  <RotatingWord words={ROTATING_WORDS} />
                </motion.span>
              </span>
            </h1>
          </div>

          <div className="mx-auto max-w-[420px] text-center lg:mx-0 lg:max-w-[380px] lg:shrink-0 lg:text-left">
            <motion.p
              className="text-[1.125rem] leading-[1.8] text-[#F8F7F4]/90"
              variants={fadeUpVariants}
              custom={0.55}
              initial="hidden"
              animate={animate}
            >
              FC Filmwerks is a film production studio crafting cinematic
              stories for brands, artists and screens of every size.
            </motion.p>

            <div className="mt-9 flex flex-wrap justify-center gap-3 lg:justify-start">
              <motion.div
                variants={fadeUpVariants}
                custom={0.7}
                initial="hidden"
                animate={animate}
              >
                {/* Pill, to match the MENU control in the nav above — the
                    system default is the near-square editorial radius. */}
                <Button
                  href="/work"
                  className="rounded-full bg-[#F8F7F4] text-[#0F1C2E] hover:bg-white"
                >
                  View our work
                </Button>
              </motion.div>

              <motion.div
                variants={fadeUpVariants}
                custom={0.8}
                initial="hidden"
                animate={animate}
              >
                <Button
                  href="/contact"
                  variant="outline"
                  className="rounded-full border-white/35 text-[#F8F7F4] hover:border-[#BFA76F]"
                >
                  Start a project
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
