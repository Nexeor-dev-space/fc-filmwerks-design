'use client';

import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import { useRef } from 'react';

import { BackgroundVideo, Button } from '@/components/ui';
import { EASE } from '@/constants';
import { usePrefersReducedMotion } from '@/hooks';

/** Fine film grain, same texture used across cinematic sections. */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: EASE.expo, delay },
  }),
};

const lineReveal: Variants = {
  hidden: { y: '110%' },
  visible: (index: number) => ({
    y: '0%',
    transition: { duration: 1.05, ease: EASE.expo, delay: 0.2 + index * 0.1 },
  }),
};

const HEADLINE_LINES = ["LET'S BUILD", 'SOMETHING', 'UNFORGETTABLE.'];

interface CtaSectionProps {
  /** Small gold line above the headline. */
  label?: string;
  /** Rendered one line per entry, each masked and revealed in turn. */
  headline?: readonly string[];
  body?: string;
  /** Set false on pages where the locations line would just repeat itself. */
  showLocations?: boolean;
  primary?: { label: string; href: string };
  /** Pass `null` to render a single action instead of the usual pair. */
  secondary?: { label: string; href: string } | null;
}

/**
 * Closing CTA — the emotional conclusion before the footer.
 *
 * Centred editorial layout over a cinematic still, with layered ambient
 * effects (radial glow, grain, vignette, drifting light leak) so the ground
 * stays alive without demanding attention.
 *
 * Parameterised rather than duplicated: the portfolio and the homepage close
 * on the same treatment with different words, and forking the component would
 * let the two drift apart. Every prop defaults to the homepage's copy, so the
 * bare `<CtaSection />` is unchanged.
 */
export function CtaSection({
  label = 'Ready when you are',
  headline = HEADLINE_LINES,
  body = 'Every great production begins with a conversation. Whether you’re launching a brand, telling a story, or creating a campaign, let’s craft something people will remember.',
  showLocations = true,
  primary = { label: 'Start a project', href: '/contact' },
  secondary = { label: 'View our work', href: '/portfolio' },
}: CtaSectionProps = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="cta-heading"
      /* `z-[2]` keeps this above the lens plate (`z-1`) that is pulled up
         beneath it, so the lens stays hidden until this scrolls clear of it. */
      className="relative z-[2] min-h-dvh overflow-hidden bg-[#0F1C2E]"
    >
      {/* ── Ambient background layers ── */}

      {/*
       * Footage sits under everything else. The scrim is deliberately light so
       * the shot reads — the layers stacked over it (gradient floor, vignette,
       * grain) already contribute most of the darkening, and doubling up here
       * was flattening the footage to a texture. Its own vignette stays off
       * for the same reason.
       */}
      <BackgroundVideo
        src="/videos/cta-video-1.mp4"
        fallbackClassName="bg-[#0F1C2E]"
        overlay="linear-gradient(rgba(15,28,46,0.38), rgba(10,19,31,0.48))"
        vignette={false}
      />

      {/* Radial key light — warm glow from upper-right, moves on scroll */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={reducedMotion ? undefined : { y: bgY }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 65% 55% at 75% 35%, rgba(191,167,111,0.08) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 50% 60% at 25% 70%, rgba(15,28,46,0.6) 0%, transparent 70%)',
          }}
        />
      </motion.div>

      {/* Cinematic gradient floor */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(15,28,46,0) 0%, rgba(10,19,31,0.34) 60%, rgba(10,19,31,0.62) 100%)',
        }}
      />

      {/* Film grain */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />

      {/* Vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, rgba(10,19,31,0.55) 100%)',
        }}
      />

      {/* Animated light leak — a slow-moving warm accent */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        animate={
          reducedMotion
            ? undefined
            : {
                opacity: [0.04, 0.08, 0.04],
                x: ['-5%', '5%', '-5%'],
              }
        }
        transition={
          reducedMotion
            ? undefined
            : {
                duration: 14,
                repeat: Infinity,
                ease: 'easeInOut',
              }
        }
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 35% 50% at 60% 40%, rgba(191,167,111,0.2) 0%, transparent 70%)',
          }}
        />
      </motion.div>

      {/* ── Content ── */}
      <div className="relative z-10 flex min-h-dvh items-center justify-center">
        <div className="w-full px-4 py-24 md:px-[3vw] md:py-32 lg:py-40">
          <div className="mx-auto max-w-[860px] text-center">
            {/* Label */}
            <motion.p
              className="mb-8 text-[0.8125rem] font-semibold tracking-[0.32em] text-[#BFA76F] uppercase md:mb-10"
              variants={fadeUp}
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.6 }}
            >
              {label}
            </motion.p>

            {/* Heading — line-by-line reveal */}
            <motion.h2
              id="cta-heading"
              className="text-[clamp(42px,10vw,64px)] leading-[0.92] font-bold tracking-[-0.02em] text-white lg:text-[clamp(64px,6vw,120px)]"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
            >
              {headline.map((line, index) => (
                <span key={line} className="block overflow-hidden pb-[0.08em]">
                  <motion.span
                    className="block"
                    variants={lineReveal}
                    custom={index}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </motion.h2>

            {/* Supporting paragraph */}
            <motion.p
              className="mx-auto mt-10 max-w-[520px] text-[1rem] leading-[1.8] text-white/[0.68] md:mt-12 md:text-[1.0625rem] lg:text-[1.125rem]"
              variants={fadeUp}
              custom={0.45}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.6 }}
            >
              {body}
            </motion.p>

            {/* Location line */}
            {showLocations && (
              <motion.p
                className="mt-6 text-[0.75rem] tracking-[0.28em] text-white/30 uppercase"
                variants={fadeUp}
                custom={0.55}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.6 }}
              >
                Dubai &middot; Kerala &middot; Worldwide
              </motion.p>
            )}

            {/* CTAs */}
            <motion.div
              className="mt-12 flex flex-wrap justify-center gap-4 md:mt-14"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.6 }}
            >
              <motion.div variants={fadeUp} custom={0.6}>
                <Button
                  href={primary.href}
                  className="group rounded-full bg-[#F8F7F4] text-[#0F1C2E] transition-[background-color,transform,box-shadow] duration-500 ease-out hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_8px_30px_rgba(248,247,244,0.15)]"
                  size="lg"
                >
                  {primary.label}
                  <span
                    aria-hidden="true"
                    className="inline-block transition-transform duration-500 ease-out group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Button>
              </motion.div>

              {secondary && (
                <motion.div variants={fadeUp} custom={0.7}>
                  <Button
                    href={secondary.href}
                    variant="outline"
                    className="rounded-full border-[#BFA76F]/40 text-white transition-[color,border-color,transform,box-shadow] duration-500 ease-out hover:-translate-y-0.5 hover:border-[#BFA76F] hover:text-[#BFA76F] hover:shadow-[0_8px_30px_rgba(191,167,111,0.08)]"
                    size="lg"
                  >
                    {secondary.label}
                    <span
                      aria-hidden="true"
                      className="inline-block transition-transform duration-500 ease-out"
                    >
                      →
                    </span>
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
