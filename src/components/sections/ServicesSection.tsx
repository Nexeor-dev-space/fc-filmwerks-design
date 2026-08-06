'use client';

import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

import { DragCarousel } from '@/components/ui';
import { services, type Service } from '@/config/services';
import { EASE } from '@/constants';
import { useIsMobile, usePrefersReducedMotion } from '@/hooks';

/** Header blocks rise in sequence as the section arrives. */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE.out, delay },
  }),
};

/** Cards arrive one after another rather than as a block. */
const gridVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

interface CardReveal {
  /** How far the card rises, in px. Shorter on phones — see below. */
  lift: number;
  /** True when the visitor has asked for reduced motion. */
  still: boolean;
}

/**
 * Cards are unveiled rather than faded in: each rises, resolves out of a
 * slight defocus and settles to full size. The blur is what separates the two
 * — opacity alone reads as a page still loading, where pulling focus reads as
 * something being shown to you.
 *
 * The lift comes in through `custom` rather than being a constant because the
 * same 52px is a far larger share of a phone-width card than a desktop one,
 * and reads there as a lurch rather than a rise.
 *
 * Under reduced motion this collapses to a plain opacity fade: no travel, no
 * scale, and above all no blur, which is the part that provokes discomfort.
 */
const cardVariants: Variants = {
  hidden: ({ lift, still }: CardReveal) =>
    still
      ? { opacity: 0 }
      : { opacity: 0, y: lift, scale: 0.96, filter: 'blur(5px)' },
  visible: ({ still }: CardReveal) =>
    still
      ? { opacity: 1, transition: { duration: 0.4, ease: EASE.out } }
      : {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          transition: { duration: 0.9, ease: EASE.out },
        },
};

/**
 * One service, presented as a poster rather than a card.
 *
 * Four separate elements each own exactly one transform, which is what lets
 * them run at once without fighting: the outer holds the scroll parallax, the
 * next the hover zoom, the innermost the endless drift, and the `<Link>`
 * itself the lift. Collapsing any two would mean one silently overwriting the
 * other's `transform`.
 *
 * Hover is CSS rather than React state — nine cards re-rendering on every
 * pointer move would cost far more than the effect is worth, and opacity,
 * transform and colour are all handled on the compositor.
 */
function ServiceCard({ service }: { service: Service }) {
  const cardRef = useRef<HTMLLIElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });

  // Deliberately small. The image is overscanned past the card on both edges,
  // so this never drags a bare edge into frame.
  const parallaxY = useTransform(scrollYProgress, [0, 1], [12, -12]);

  return (
    /*
     * Fixed track sizes rather than grid columns: a carousel item has to have a
     * width of its own, since a flex row gives it none. `shrink-0` is what stops
     * nine cards compressing to fit instead of overflowing — the overflow is the
     * whole point.
     */
    <motion.li
      ref={cardRef}
      variants={cardVariants}
      custom={{ lift: isMobile ? 36 : 52, still: reducedMotion }}
      className="w-[88vw] shrink-0 snap-start md:w-[420px] lg:w-[540px]"
    >
      <Link
        href={service.href}
        /* The card itself never moves or resizes on hover — all the motion
           happens to the image inside it. Only the border colour responds. */
        /*
         * The card itself never moves, resizes or changes its border on hover —
         * the scroller clips vertically (an `overflow-x` container computes
         * `overflow-y` to `auto`), so any lift would crop the card's own top
         * edge. All the hover motion lives on the image inside instead.
         */
        /* No drop shadow. Each card used to carry a 60px black halo, and nine
           of them side by side merged into one continuous dark haze around
           the whole strip — it read as the carousel having its own darker
           background laid over the section's. The cards sit flat on the
           ground now; the border alone draws the edge. */
        className="group relative block h-[72vh] overflow-hidden rounded-[24px] border border-white/[0.08] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#BFA76F] md:h-[560px] lg:h-[660px]"
      >
        {/* Parallax. Overscanned top and bottom so the travel stays covered. */}
        <motion.div
          className="absolute inset-x-0 -top-6 -bottom-6"
          style={reducedMotion ? undefined : { y: parallaxY }}
        >
          {/* Hover zoom. */}
          <div className="h-full w-full transition-transform duration-[700ms] ease-out group-hover:scale-[1.08] group-focus-visible:scale-[1.08]">
            {/* Endless drift — almost imperceptible, and the reason the
                posters feel alive when nothing is being touched. */}
            <motion.div
              className="relative h-full w-full"
              animate={reducedMotion ? undefined : { scale: [1, 1.03] }}
              transition={
                reducedMotion
                  ? undefined
                  : {
                      duration: 10,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      ease: 'easeInOut',
                    }
              }
            >
              <Image
                src={service.image}
                alt=""
                fill
                loading="lazy"
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Seats the type against whatever the still happens to be doing. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(0,0,0,0.82), rgba(0,0,0,0.35), transparent)',
          }}
        />

        {/*
         * A second scrim that only exists on hover. The gradient above is
         * pitched for a title and a few words; the description needs a good
         * deal more of the still knocked back before it is comfortable to
         * read, and pitching the base gradient that heavy would bury the
         * photograph for everyone who never points at the card.
         *
         * This used to run the other way — the gradient lightened on hover so
         * the image got its moment — which is the opposite of what reading a
         * paragraph wants.
         */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[#0A131F]/45 opacity-0 transition-opacity duration-[600ms] ease-out group-hover:opacity-100 group-focus-visible:opacity-100"
        />

        <span className="absolute top-8 left-8 text-[0.875rem] tracking-[0.28em] text-white/35 md:top-10 md:left-10">
          {service.number}
        </span>

        <div className="absolute right-8 bottom-8 left-8 md:right-10 md:bottom-10 md:left-10">
          <h3 className="mb-2.5 text-[1.625rem] leading-[1.15] font-extralight tracking-tight text-white transition-[color,transform] duration-[600ms] ease-out group-hover:-translate-y-1 group-hover:text-[#BFA76F] group-focus-visible:-translate-y-1 group-focus-visible:text-[#BFA76F] md:text-[1.875rem] lg:text-[2.125rem]">
            {service.title}
          </h3>

          {/* Capped rather than full-bleed: the copy runs to very different
              lengths across the nine, and a measure this wide would set the
              longest ones as a wall of text against the still. */}
          <p className="max-w-[46ch] text-[0.8125rem] leading-[1.65] text-white/[0.78] md:text-[0.875rem]">
            {service.description}
          </p>
        </div>
      </Link>
    </motion.li>
  );
}

/**
 * Services discovery grid — three columns on desktop, two on tablet, one on
 * phones.
 *
 * Each card is a single `<Link>` rather than a container with a nested
 * "view service" anchor: one focus stop per service, and the whole poster is
 * the target.
 */
export function ServicesSection() {
  return (
    /*
     * Pulled up by the `cover` span so it overlaps the final stretch of
     * the hero's sticky wrapper. The hero stays at `position: sticky; top: 0`
     * inside a tall wrapper; this section slides upward over it — and because
     * it is opaque and edge to edge, no gap shows between the two.
     *
     * The offset must stay in step with `cover` in IntroExperience's SPANS:
     *   mobile  cover 1.2 → -mt-[120dvh]
     *   desktop cover 1.6 → -mt-[160dvh]
     *
     * `motion-reduce:mt-0` cancels the margin when the sticky wrapper is
     * absent and sections stack in normal flow.
     */
    <section
      id="services"
      aria-labelledby="services-heading"
      className="relative z-10 -mt-[120dvh] overflow-hidden bg-[#0f1012] pt-16 pb-20 motion-reduce:!mt-0 md:-mt-[160dvh] md:pt-20 md:pb-24 lg:pt-24 lg:pb-28"
    >
      {/* Gutters are the reference site's own container value — a flat 16px on
          phones, then a fluid 3vw — so the grid tracks the viewport instead of
          sitting inside a fixed measure. */}
      <div className="w-full px-4 md:px-[3vw]">
        {/* Label and title left, standfirst pushed to the far right and sharing
            the title's baseline. Body copy stays left-aligned within its own
            column — right-aligned paragraphs give the eye no consistent edge to
            return to on each line. */}
        <header className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-20">
          <div className="max-w-[700px]">
            <motion.p
              className="mb-5 text-[0.875rem] font-semibold tracking-[0.28em] text-[#BFA76F] uppercase"
              variants={fadeUp}
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.6 }}
            >
              Services
            </motion.p>

            <motion.h2
              id="services-heading"
              className="text-[2.5rem] leading-[0.95] font-semibold tracking-[-0.02em] text-white uppercase md:text-[3.25rem] lg:text-[4rem] xl:text-[4.5rem]"
              variants={fadeUp}
              custom={0.08}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.6 }}
            >
              What we
              <br />
              do
            </motion.h2>
          </div>

          <motion.p
            className="max-w-[520px] text-[1rem] leading-[1.8] text-white/[0.72] md:text-[1.0625rem] lg:max-w-[460px] lg:shrink-0 lg:pb-2 lg:text-[1.125rem]"
            variants={fadeUp}
            custom={0.16}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
          >
            From concept development to final delivery, we create cinematic
            experiences that move audiences and elevate brands through strategy,
            storytelling and world-class production.
          </motion.p>
        </header>
      </div>

      {/*
       * The carousel sits outside the padded wrapper on purpose. Its own gutter
       * is applied inside the scroller instead, so the first card lines up with
       * the heading while the rest run past the edge of the screen — that
       * cut-off card is the only affordance saying there is more to see.
       *
       * `scroll-px` matches the gutter so a snapped card lands on the same line
       * as the heading rather than flush against the viewport.
       */}
      <DragCarousel
        label="Services"
        className="mt-16 lg:mt-24"
        edgeClassName="px-4 py-6 scroll-px-4 md:px-[3vw] md:scroll-px-[3vw]"
      >
        <motion.ul
          className="flex gap-5 md:gap-6 lg:gap-8"
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {services.map((service) => (
            <ServiceCard key={service.href} service={service} />
          ))}
        </motion.ul>
      </DragCarousel>
    </section>
  );
}
