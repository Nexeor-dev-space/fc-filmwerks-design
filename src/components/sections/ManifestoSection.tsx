'use client';

import { motion, type Variants } from 'framer-motion';

import { CtaButton, EditorialRows } from '@/components/ui';
import { manifesto } from '@/config/manifesto';
import { EASE } from '@/constants';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE.out, delay },
  }),
};

/**
 * Why FC Filmwerks — the studio's philosophy, carried entirely by typography.
 *
 * Sits between the work and the about page: the grid above showed what the
 * studio makes, this explains how it thinks, before anyone is asked to read a
 * company history.
 *
 * Padding and gutters mirror every other homepage section so the run of them
 * reads as one continuous page.
 */
export function ManifestoSection() {
  return (
    <section
      id="why-fc-filmwerks"
      aria-labelledby="manifesto-heading"
      className="relative overflow-hidden bg-[#0F1C2E] pt-16 pb-20 md:pt-20 md:pb-24 lg:pt-24 lg:pb-28"
    >
      {/*
       * Oversized outline word behind the content. Stroke only, no fill, at 2%
       * — legible as texture and nothing more. `aria-hidden` because it is
       * decoration, and `select-none` so it never lands in a copied selection.
       */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-4 left-1/2 -translate-x-1/2 text-[24vw] leading-none font-bold tracking-[-0.04em] whitespace-nowrap select-none lg:top-1/4"
        style={{
          color: 'transparent',
          WebkitTextStroke: '1px rgba(255,255,255,0.02)',
        }}
      >
        Vision
      </span>

      <div className="relative w-full px-4 md:px-[3vw]">
        <header className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-20">
          <div className="max-w-[720px]">
            <motion.p
              className="mb-5 text-[0.875rem] font-semibold tracking-[0.28em] text-[#BFA76F] uppercase"
              variants={fadeUp}
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.6 }}
            >
              Why FC Filmwerks
            </motion.p>

            <motion.h2
              id="manifesto-heading"
              className="text-[2.5rem] leading-[0.95] font-semibold tracking-[-0.02em] text-white uppercase md:text-[3.375rem] lg:text-[4rem] xl:text-[4.5rem]"
              variants={fadeUp}
              custom={0.08}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.6 }}
            >
              More than
              <br />
              filmmakers.
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
            Every project begins with a conversation, grows through
            collaboration, and ends with a story that leaves a lasting
            impression. We don&rsquo;t simply produce visuals&mdash;we create
            experiences that people remember.
          </motion.p>
        </header>

        <EditorialRows items={manifesto} className="mt-16 lg:mt-24" />

        <motion.div
          className="mt-16 flex justify-center lg:mt-24"
          variants={fadeUp}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
        >
          <CtaButton href="/studio">Our story →</CtaButton>
        </motion.div>
      </div>
    </section>
  );
}
