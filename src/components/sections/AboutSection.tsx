'use client';

import { motion, type Variants } from 'framer-motion';
import Image from 'next/image';

import { CtaButton } from '@/components/ui';
import { studioHighlights, studioProcess } from '@/config/studio';
import { EASE } from '@/constants';
import { usePrefersReducedMotion } from '@/hooks';

/**
 * Film grain, as a data URI rather than an asset — one tiling turbulence patch
 * costs nothing to fetch and keeps the still from looking digitally clean.
 */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE.out, delay },
  }),
};

/**
 * About FC Filmwerks — the studio behind the work.
 *
 * Sits after the manifesto: the visitor has seen what the studio makes and how
 * it thinks, so this introduces who does it, and hands off to the full about
 * page rather than trying to be one.
 *
 * Padding and gutters mirror every other homepage section so the run of them
 * reads as one continuous page.
 */
export function AboutSection() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="bg-[#0F1012] pt-16 pb-20 md:pt-20 md:pb-24 lg:pt-24 lg:pb-28"
    >
      <div className="w-full px-4 md:px-[3vw]">
        <header className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-20">
          <div className="max-w-[760px]">
            <motion.p
              className="mb-5 text-[0.875rem] font-semibold tracking-[0.28em] text-[#BFA76F] uppercase"
              variants={fadeUp}
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.6 }}
            >
              About FC Filmwerks
            </motion.p>

            <motion.h2
              id="about-heading"
              className="text-[2.5rem] leading-[0.95] font-semibold tracking-[-0.02em] text-white uppercase md:text-[3.375rem] lg:text-[4rem] xl:text-[4.5rem]"
              variants={fadeUp}
              custom={0.08}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.6 }}
            >
              We don&rsquo;t just
              <br />
              make films.
              <br />
              We create
              <br />
              experiences.
            </motion.h2>
          </div>

          <motion.p
            className="max-w-[520px] text-[1rem] leading-[1.8] text-white/[0.72] md:text-[1.0625rem] lg:shrink-0 lg:pt-4 lg:text-[1.125rem]"
            variants={fadeUp}
            custom={0.16}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
          >
            FC Filmwerks is a film production studio crafting cinematic stories
            for brands, artists and screens of every size — nine disciplines
            under one roof, from the first frame to the final mix.
          </motion.p>
        </header>

        {/* Studio still, almost edge to edge inside the gutter. */}
        <motion.div
          className="relative mt-16 aspect-video overflow-hidden rounded-[28px] border border-white/[0.08] lg:mt-24"
          variants={{
            hidden: { opacity: 0, scale: 0.97 },
            visible: {
              opacity: 1,
              scale: 1,
              transition: { duration: 1, ease: EASE.out },
            },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          {/* The drift sits on its own element so it never competes with the
              reveal scale on the wrapper above. */}
          <motion.div
            className="absolute inset-0"
            animate={reducedMotion ? undefined : { scale: [1, 1.03] }}
            transition={
              reducedMotion
                ? undefined
                : {
                    duration: 14,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    ease: 'easeInOut',
                  }
            }
          >
            <Image
              src="/images/services/videography.jpg"
              alt="A cinema camera rig on a film set"
              fill
              loading="lazy"
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>

          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#0A131F]/60 via-transparent to-[#0A131F]/20"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.1] mix-blend-overlay"
            style={{ backgroundImage: GRAIN }}
          />
        </motion.div>

        {/* Studio story — heading left, prose right. */}
        <div className="mt-16 flex flex-col gap-10 lg:mt-24 lg:flex-row lg:justify-between lg:gap-20">
          <motion.h3
            className="max-w-[520px] text-[2rem] leading-[0.95] font-semibold tracking-[-0.02em] text-white uppercase md:text-[2.75rem] lg:shrink-0 lg:text-[3.25rem]"
            variants={fadeUp}
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            Creating
            <br />
            stories
            <br />
            that last.
          </motion.h3>

          <motion.div
            className="max-w-[560px] space-y-6 text-[1rem] leading-[1.8] text-white/[0.72] md:text-[1.0625rem]"
            variants={fadeUp}
            custom={0.1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            <p>
              We make films for brands, artists and screens of every size —
              commercials and brand stories, documentaries and events, music and
              branded content.
            </p>
            <p>
              Photography, videography, audio, post, podcast and live coverage
              all run in-house. Each is its own craft team, and they work
              together on the films that need all of them.
            </p>
            <p>
              Every frame exists to serve the story. That is the whole of it —
              the rest is craft, and craft is what we practise.
            </p>
          </motion.div>
        </div>

        {/*
         * Deliberately not the manifesto's full-width rows. Those are the
         * studio's philosophy and earn the whole measure each; these are
         * supporting detail, so they sit two-up in a quieter, stacked block —
         * same hairline-and-number language, different rhythm.
         */}
        <ul className="mt-16 grid grid-cols-1 gap-x-16 gap-y-12 md:grid-cols-2 lg:mt-24 lg:gap-x-24 lg:gap-y-16">
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
                variants={{
                  hidden: { scaleX: 0 },
                  visible: {
                    scaleX: 1,
                    transition: { duration: 0.9, ease: EASE.out },
                  },
                }}
              />

              <motion.div className="pt-6 lg:pt-8" variants={fadeUp}>
                <span className="text-[0.75rem] tracking-[0.28em] text-white/35 transition-colors duration-500 ease-out group-hover:text-[#BFA76F]">
                  {item.number}
                </span>

                <h3 className="mt-4 text-[1.375rem] leading-[1.15] font-extralight tracking-[-0.01em] text-white/85 transition-colors duration-500 ease-out group-hover:text-white md:text-[1.625rem]">
                  {item.title}
                </h3>

                <p className="mt-3 max-w-[380px] text-[0.9375rem] leading-[1.75] text-white/[0.55]">
                  {item.body}
                </p>
              </motion.div>
            </motion.li>
          ))}
        </ul>

        {/* Process — one line, drawn as it arrives. */}
        <motion.div
          className="relative mt-16 lg:mt-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          <motion.div
            aria-hidden="true"
            className="h-px origin-left bg-white/[0.12]"
            variants={{
              hidden: { scaleX: 0 },
              visible: {
                scaleX: 1,
                transition: { duration: 1.2, ease: EASE.out },
              },
            }}
          />

          <ol className="flex flex-wrap justify-between gap-x-6 gap-y-4 pt-6">
            {studioProcess.map((stage, index) => (
              <motion.li
                key={stage}
                className="text-[0.75rem] tracking-[0.28em] text-white/50 uppercase"
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.6,
                      ease: EASE.out,
                      delay: 0.2 + index * 0.08,
                    },
                  },
                }}
              >
                <span className="text-white/30">
                  {String(index + 1).padStart(2, '0')}
                </span>{' '}
                {stage}
              </motion.li>
            ))}
          </ol>
        </motion.div>

        <motion.div
          className="mt-16 flex justify-center lg:mt-24"
          variants={fadeUp}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
        >
          <CtaButton href="/studio">Meet our team →</CtaButton>
        </motion.div>
      </div>
    </section>
  );
}
