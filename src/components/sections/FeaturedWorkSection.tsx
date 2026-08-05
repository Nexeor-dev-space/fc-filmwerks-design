'use client';

import { motion, type Variants } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment } from 'react';

import { CtaButton } from '@/components/ui';
import { featuredProjectRows, type Project } from '@/config/projects';
import { EASE } from '@/constants';

/**
 * Film grain, as a data URI rather than an asset — one tiling turbulence patch
 * costs nothing to fetch and keeps the stills from looking digitally clean.
 */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

/** Darkens the corners so each frame reads as lit rather than filled. */
const VIGNETTE =
  'radial-gradient(120% 90% at 50% 45%, transparent 45%, rgba(10,19,31,0.55) 100%)';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay: number = 0) => ({
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
 * One project, as a poster.
 *
 * The lift and the image zoom live on separate elements: the `<Link>` owns the
 * card's own transform, and the wrapper inside owns the zoom. Putting both on
 * one node would mean the second silently overwriting the first's `transform`.
 *
 * Hover is CSS rather than React state — nine cards re-rendering on every
 * pointer move would cost far more than the effect is worth, and transform,
 * opacity and colour are all handled on the compositor.
 */
function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.li variants={cardVariants}>
      <Link
        href={project.href}
        aria-label={`${project.title} — view project`}
        className="group relative block h-[420px] overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#13233A] shadow-[0_25px_60px_rgba(0,0,0,0.25)] transition-[transform,box-shadow] duration-[600ms] ease-out hover:-translate-y-2 hover:shadow-[0_40px_80px_rgba(0,0,0,0.45)] focus-visible:-translate-y-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#BFA76F] md:h-[460px] lg:h-[520px]"
      >
        <div className="absolute inset-0 transition-transform duration-[1200ms] ease-out group-hover:scale-[1.08] group-focus-visible:scale-[1.08]">
          <Image
            src={project.image}
            alt=""
            fill
            loading="lazy"
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        {/* Seats the type against whatever the still happens to be doing.
            Lightens on hover so the image gets its moment. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-100 transition-opacity duration-[600ms] ease-out group-hover:opacity-[0.82] group-focus-visible:opacity-[0.82]"
          style={{
            background:
              'linear-gradient(to top, rgba(0,0,0,0.86), rgba(0,0,0,0.35), transparent)',
          }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: VIGNETTE }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay"
          style={{ backgroundImage: GRAIN }}
        />

        <div className="absolute right-8 bottom-8 left-8 md:right-10 md:bottom-10 md:left-10">
          <p className="text-[0.75rem] tracking-[0.25em] text-[#BFA76F] uppercase">
            {project.category}
          </p>

          <h3 className="mt-3 text-[1.625rem] leading-[1.15] font-extralight tracking-tight text-white transition-transform duration-[600ms] ease-out group-hover:-translate-y-1 group-focus-visible:-translate-y-1 md:text-[1.875rem]">
            {project.title}
          </h3>

          <p className="mt-2 text-[0.8125rem] text-white/55">
            {project.client} · {project.location}
          </p>

          {/* Not a nested link — the whole poster is the target. */}
          <span className="mt-6 inline-flex items-center gap-2.5 text-[0.75rem] font-semibold tracking-[0.24em] text-white/70 uppercase transition-colors duration-[600ms] ease-out group-hover:text-[#BFA76F] group-focus-visible:text-[#BFA76F]">
            View project
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
 * Featured work — nine selected films in a 3×3 grid.
 *
 * Deliberately a different rhythm from the services carousel above: that one
 * is a horizontal strip you drag through, this is a static grid you scan. The
 * change of pace is what separates browsing capability from viewing work.
 *
 * Section padding and gutters mirror the services section exactly, so the
 * boundary between the two reads as one continuous page.
 */
export function FeaturedWorkSection() {
  return (
    <section
      id="featured-work"
      aria-labelledby="featured-work-heading"
      className="relative z-10 bg-[#0f1012] pt-16 pb-20 md:pt-20 md:pb-24 lg:pt-24 lg:pb-28"
    >
      <div className="w-full px-4 md:px-[3vw]">
        {/* Heading and its route-through on the left, standfirst pushed right
            and vertically centred against them. */}
        <header className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-20">
          <div>
            <motion.h2
              id="featured-work-heading"
              className="text-[2.5rem] leading-[0.95] font-semibold tracking-[-0.02em] text-white uppercase md:text-[3.25rem] lg:text-[4rem] xl:text-[4.5rem]"
              variants={fadeUp}
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.6 }}
            >
              Featured
              <br />
              work
            </motion.h2>

            <motion.div
              className="mt-10"
              variants={fadeUp}
              custom={0.12}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.6 }}
            >
              <CtaButton href="/portfolio">See more work →</CtaButton>
            </motion.div>
          </div>

          <motion.p
            className="max-w-[460px] text-[1rem] leading-[1.8] text-white/[0.72] md:text-[1.0625rem] lg:shrink-0 lg:text-[1.125rem]"
            variants={fadeUp}
            custom={0.08}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
          >
            We craft films that connect brands with people through emotion,
            storytelling and unforgettable visuals.
          </motion.p>
        </header>

        <motion.ul
          className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-2 lg:mt-24 lg:grid-cols-3"
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {featuredProjectRows.map((row, rowIndex) => (
            <Fragment key={row[0]?.href ?? rowIndex}>
              {row.map((project) => (
                <ProjectCard key={project.href} project={project} />
              ))}

              {/* Only after the final row — one route-through at the end of the
                  grid, rather than the same control repeated between bands.
                  `col-span-full` keeps it centred at every column count. */}
              {rowIndex === featuredProjectRows.length - 1 && (
                <motion.li
                  className="col-span-full flex justify-center pt-6 lg:pt-10"
                  variants={cardVariants}
                >
                  <CtaButton href="/portfolio">See more work →</CtaButton>
                </motion.li>
              )}
            </Fragment>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
