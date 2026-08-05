'use client';

import { motion, type Variants } from 'framer-motion';

import { CtaButton } from '@/components/ui';
import { manifesto, type ManifestoStatement } from '@/config/manifesto';
import { EASE } from '@/constants';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE.out, delay },
  }),
};

/** Row children arrive together, a beat after the row's own divider. */
const rowGroup: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

/**
 * One principle, as a row rather than a card.
 *
 * Three columns on a 12-track grid — number, statement, supporting line — with
 * a hairline above. Nothing here has a background or a border box; the reading
 * rhythm comes entirely from the grid and the space around it.
 *
 * Hover is CSS on a `group`, so all three columns respond together without any
 * state or re-render per row.
 */
function ManifestoRow({
  statement,
  index,
}: {
  statement: ManifestoStatement;
  index: number;
}) {
  return (
    <motion.li
      className="group"
      variants={rowGroup}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
    >
      {/*
       * The divider draws itself in from the left as the row arrives. It is a
       * scaled element rather than an animated width so the browser keeps it on
       * the compositor — and `origin-left` is what makes it wipe rather than
       * grow from the middle.
       */}
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

      <div className="grid grid-cols-1 gap-6 py-10 md:py-12 lg:grid-cols-12 lg:items-baseline lg:gap-10 lg:py-16">
        <motion.span
          className="text-[0.875rem] tracking-[0.28em] text-white/35 transition-colors duration-500 ease-out group-hover:text-[#BFA76F] lg:col-span-1"
          variants={fadeUp}
        >
          {statement.number}
        </motion.span>

        <motion.h3
          className="text-[1.75rem] leading-[1.05] font-extralight tracking-[-0.01em] text-white/85 transition-colors duration-500 ease-out group-hover:text-white md:text-[2.25rem] lg:col-span-6 lg:text-[2.75rem]"
          variants={fadeUp}
        >
          {statement.title}
        </motion.h3>

        <motion.p
          className="max-w-[440px] text-[1rem] leading-[1.8] text-white/[0.6] transition-colors duration-500 ease-out group-hover:text-white/75 lg:col-span-4 lg:col-start-9"
          variants={fadeUp}
        >
          {statement.body}
        </motion.p>
      </div>

      {/* The last row needs a hairline underneath it too, or the set reads as
          unfinished. */}
      {index === manifesto.length - 1 && (
        <motion.div
          aria-hidden="true"
          className="h-px origin-left bg-white/[0.12]"
          variants={{
            hidden: { scaleX: 0 },
            visible: {
              scaleX: 1,
              transition: { duration: 0.9, ease: EASE.out },
            },
          }}
        />
      )}
    </motion.li>
  );
}

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

        <ul className="mt-16 lg:mt-24">
          {manifesto.map((statement, index) => (
            <ManifestoRow
              key={statement.number}
              statement={statement}
              index={index}
            />
          ))}
        </ul>

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
