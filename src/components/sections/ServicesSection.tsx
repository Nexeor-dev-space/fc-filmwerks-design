'use client';

import { motion, type Variants } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

import { services, type Service } from '@/config/services';
import { EASE, VIEWPORT } from '@/constants';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE.out, delay },
  }),
};

/** Cascades the tiles in, a beat apart, as the grid comes into view. */
const gridVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const tileVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE.out } },
};

/**
 * One service, as a tile.
 *
 * Hover is driven by CSS `group-hover` rather than Framer state: nine tiles
 * each holding their own `useState` would re-render on every pointer move
 * across the grid, and the transitions here are all compositor-friendly
 * (opacity, transform, colour) so the browser handles them on its own.
 */
function ServiceTile({ service }: { service: Service }) {
  return (
    <motion.li variants={tileVariants}>
      <Link
        href={service.href}
        className="group relative flex h-full min-h-[280px] flex-col justify-between overflow-hidden rounded-3xl border border-[#ffffff24] p-8 transition-transform duration-500 ease-out hover:-translate-y-1.5 focus-visible:-translate-y-1.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#BFA76F] md:min-h-[320px] md:p-10"
        aria-label={`${service.title} — explore`}
      >
        {/* Always on screen, and eased up slightly on hover. `sizes` matches
            the 3/2/1 column grid so the browser never downloads a
            3-column-width file on a phone. */}
        <Image
          src={service.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="absolute inset-0 -z-20 object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Light overall wash — this is what lifts on hover. Kept well below
            half opacity because the stills are already low-key; a heavy flat
            scrim on top of them reads as a plain dark rectangle. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[#131214]/25 transition-colors duration-700 ease-out group-hover:bg-transparent group-focus-visible:bg-transparent"
        />

        {/* Legibility comes from this gradient instead: dense behind the title
            block at the bottom, clear across the top where the image reads. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{
            background:
              'linear-gradient(to top, rgba(19,18,20,0.92) 0%, rgba(19,18,20,0.6) 34%, rgba(19,18,20,0.1) 70%, transparent 100%)',
          }}
        />

        <div className="flex items-start justify-between gap-4">
          <span className="font-mono text-xs tracking-[0.3em] text-[#F8F7F4]/45">
            {service.number}
          </span>
        </div>

        <div className="mt-16">
          <h3 className="text-[1.75rem] leading-[1.15] font-extralight tracking-tight text-balance transition-colors duration-500 ease-out group-hover:text-[#BFA76F] group-focus-visible:text-[#BFA76F] md:text-[2rem]">
            {service.title}
          </h3>

          <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5">
            {service.keywords.map((keyword) => (
              <li
                key={keyword}
                className="text-[0.6875rem] tracking-[0.18em] text-[#F8F7F4]/50 uppercase"
              >
                {keyword}
              </li>
            ))}
          </ul>

          <span className="mt-8 inline-flex items-center text-[0.6875rem] font-semibold tracking-[0.28em] text-[#F8F7F4]/70 uppercase transition-colors duration-500 ease-out group-hover:text-[#BFA76F] group-focus-visible:text-[#BFA76F]">
            Explore
          </span>
        </div>
      </Link>
    </motion.li>
  );
}

/**
 * Services discovery grid — three columns on desktop, two on tablet, one on
 * phones, over the brand navy.
 *
 * Each tile is a single `<Link>` rather than a card with a nested "Explore"
 * anchor: one focus stop per service, and the whole tile is the target.
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
      className="relative z-10 -mt-[100dvh] overflow-hidden bg-[#131214] text-bone motion-reduce:mt-0"
    >
      {/* Fluid gutters — a flat 16px on phones, then 3vw, so the margin grows
          with the screen instead of pinning the grid to the edges. */}
      <div className="px-4 py-20 md:px-[3vw] md:py-28 lg:py-32">
        <div className="w-full">
          {/* Heading left, standfirst right, sharing a baseline on desktop.
              Body copy stays left-aligned inside its column — right-aligned
              paragraphs give the eye no consistent edge to return to. */}
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-20">
            <div className="max-w-[640px]">
              <motion.p
                className="text-[0.6875rem] font-semibold tracking-[0.4em] text-[#BFA76F] uppercase"
                variants={fadeUp}
                custom={0}
                initial="hidden"
                whileInView="visible"
                viewport={VIEWPORT}
              >
                What we do
              </motion.p>

              <motion.h2
                id="services-heading"
                className="mt-6 text-[clamp(40px,6vw,88px)] leading-[0.95] font-bold tracking-[-0.02em] uppercase"
                variants={fadeUp}
                custom={0.08}
                initial="hidden"
                whileInView="visible"
                viewport={VIEWPORT}
              >
                Our services
              </motion.h2>
            </div>

            <motion.p
              className="max-w-[440px] text-[1.0625rem] leading-[1.8] text-[#F8F7F4]/70 lg:shrink-0 lg:pb-2"
              variants={fadeUp}
              custom={0.16}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
            >
              Nine disciplines under one roof — from the first frame to the
              final mix. Each one runs as its own craft team, and they work
              together on the films that need all of them.
            </motion.p>
          </div>

          <motion.ul
            className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:mt-24 lg:grid-cols-3"
            variants={gridVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {services.map((service) => (
              <ServiceTile key={service.href} service={service} />
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
