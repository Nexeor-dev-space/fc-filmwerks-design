'use client';

import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

import { services, type Service } from '@/config/services';
import { EASE } from '@/constants';
import { usePrefersReducedMotion } from '@/hooks';

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
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE.out } },
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

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });

  // Deliberately small. The image is overscanned past the card on both edges,
  // so this never drags a bare edge into frame.
  const parallaxY = useTransform(scrollYProgress, [0, 1], [12, -12]);

  return (
    <motion.li ref={cardRef} variants={cardVariants}>
      <Link
        href={service.href}
        /* The card itself never moves or resizes on hover — all the motion
           happens to the image inside it. Only the border colour responds. */
        className="group relative block h-[400px] overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#13233A] shadow-[0_25px_60px_rgba(0,0,0,0.25)] transition-[border-color] duration-[600ms] ease-out hover:border-[rgba(191,167,111,0.45)] focus-visible:border-[rgba(191,167,111,0.45)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#BFA76F] md:h-[460px] lg:h-[520px] xl:h-[560px]"
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

        {/* Seats the type against whatever the still happens to be doing.
            Lightens on hover so the image gets its moment. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-100 transition-opacity duration-[600ms] ease-out group-hover:opacity-[0.82] group-focus-visible:opacity-[0.82]"
          style={{
            background:
              'linear-gradient(to top, rgba(0,0,0,0.82), rgba(0,0,0,0.35), transparent)',
          }}
        />

        <span className="absolute top-8 left-8 text-[0.875rem] tracking-[0.28em] text-white/35 md:top-10 md:left-10">
          {service.number}
        </span>

        <div className="absolute right-8 bottom-8 left-8 md:right-10 md:bottom-10 md:left-10">
          <h3 className="mb-2.5 text-[1.625rem] leading-[1.15] font-extralight tracking-tight text-white transition-[color,transform] duration-[600ms] ease-out group-hover:-translate-y-1 group-hover:text-[#BFA76F] group-focus-visible:-translate-y-1 group-focus-visible:text-[#BFA76F] md:text-[1.875rem] lg:text-[2.125rem]">
            {service.title}
          </h3>

          <ul className="flex flex-wrap gap-x-3 gap-y-1">
            {service.keywords.map((keyword) => (
              <li
                key={keyword}
                className="text-[0.75rem] tracking-[0.28em] text-white/60 uppercase"
              >
                {keyword}
              </li>
            ))}
          </ul>

          {/* Not a nested link — the whole poster is the target. */}
          <span className="mt-7 inline-flex items-center gap-2.5 text-[0.75rem] font-semibold tracking-[0.24em] text-[#BFA76F] uppercase">
            View service
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-[600ms] ease-out group-hover:translate-x-2 group-focus-visible:translate-x-2"
            >
              →
            </span>
          </span>
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
     * Full-bleed, and pulled up by one viewport so it overlaps the final
     * stretch of the hero's pin. The hero is held fixed through that stretch,
     * so this section reads as climbing over it — and because it is opaque and
     * edge to edge, no strip of the page ground shows between the two.
     *
     * The offset must stay in step with `COVER_SPAN` in IntroExperience: that
     * is the pinned distance reserved for exactly this move.
     *
     * `motion-reduce:mt-0` is not cosmetic. Reduced motion drops the pin and
     * stacks the intro and hero as ordinary sections, so a negative margin
     * would drag this straight over a hero that is no longer fixed — burying
     * it completely.
     */
    <section
      id="services"
      aria-labelledby="services-heading"
      className="relative z-10 -mt-[100dvh] overflow-hidden bg-[#161616] pt-16 pb-20 motion-reduce:mt-0 md:pt-20 md:pb-24 lg:pt-24 lg:pb-28"
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
              Creative solutions
              <br />
              for every frame
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

        <motion.ul
          className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:mt-24 lg:grid-cols-3 lg:gap-8"
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {services.map((service) => (
            <ServiceCard key={service.href} service={service} />
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
