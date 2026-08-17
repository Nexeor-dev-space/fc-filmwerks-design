'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

import { ENTER, lineReveal, rise } from '@/components/animations';
import type { Project } from '@/config/projects';
import { usePrefersReducedMotion } from '@/hooks';

interface ProjectHeroProps {
  project: Project;
  /** Position in the archive, so the hero can print "03 / 08". */
  index: number;
  total: number;
}

/**
 * The opening frame of a case study.
 *
 * Full-bleed rather than the inset, rounded plate the page used before. A
 * project page is the one place on the site where a single image *is* the
 * subject, and framing it inside a card was the single biggest reason the old
 * page read as a listing entry rather than as a piece of work.
 *
 * The title sits on the image at the bottom edge, over a scrim that is heaviest
 * exactly where the type lands. The scrim is not decoration — a still can be
 * bright anywhere, and this is what guarantees the headline keeps its contrast
 * whichever project is being shown.
 *
 * The slow push-in is scroll-driven rather than fired on entry: a
 * `useTransform` value always resolves, so there is no state in which a missed
 * trigger leaves the hero stranded.
 */
export function ProjectHero({ project, index, total }: ProjectHeroProps) {
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  /* The frame settles into the page as it leaves rather than sliding off it. */
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="project-title"
      className="relative flex min-h-[88svh] flex-col justify-end overflow-hidden bg-[#0A131F] lg:min-h-dvh"
    >
      <motion.div
        className="absolute inset-0"
        style={reducedMotion ? undefined : { scale: imageScale, y: imageY }}
      >
        <Image
          src={project.image}
          alt={`${project.client} — ${project.category}`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/* Two scrims, not one, because they are solving different problems.
          The first carries the type at the foot. The second darkens the top
          third for the navigation: the logo is white, these stills are not
          controlled, and this one opens on a bright window — without it the
          wordmark disappears into the frame and the page looks unbranded. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-[#0A131F] via-[#0A131F]/55 to-[#0A131F]/25"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[38%] bg-gradient-to-b from-[#0A131F]/80 to-transparent"
      />

      <div className="relative w-full px-5 pt-40 pb-16 md:px-8 md:pb-20 lg:px-14 lg:pb-24">
        <motion.div
          variants={rise}
          custom={{ still: reducedMotion }}
          initial="hidden"
          animate="visible"
        >
          <Link
            href="/portfolio"
            className="group inline-flex items-center gap-2.5 text-[0.6875rem] font-semibold tracking-[0.24em] text-white/60 uppercase transition-colors duration-500 ease-out hover:text-[#BFA76F] focus-visible:text-[#BFA76F] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#BFA76F] md:text-[0.75rem]"
          >
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-500 ease-out group-hover:-translate-x-1.5"
            >
              ←
            </span>
            All work
          </Link>
        </motion.div>

        <motion.p
          className="mt-10 text-[0.8125rem] font-semibold tracking-[0.3em] text-[#BFA76F] uppercase md:mt-14"
          variants={rise}
          custom={{ delay: 0.1, still: reducedMotion }}
          initial="hidden"
          animate="visible"
        >
          {project.category}
        </motion.p>

        {/*
         * The title is masked line by line like the site's other display
         * headings. It is one string rather than an authored array, so the mask
         * has to sit on the whole block: splitting on words would let a mask
         * boundary fall mid-line at some viewport width and clip a descender.
         */}
        <h1
          id="project-title"
          className="mt-5 max-w-[16ch] overflow-hidden pb-[0.08em] text-[clamp(2.25rem,8.5vw,3rem)] leading-[0.98] font-light tracking-[-0.03em] text-white lg:text-[clamp(3.25rem,5.6vw,5.5rem)]"
        >
          <motion.span
            className="block"
            variants={lineReveal}
            custom={{ index: 1, still: reducedMotion }}
            initial="hidden"
            animate="visible"
          >
            {project.title}
          </motion.span>
        </h1>

        {/* Hero facts. The client is the one a reader scans for, so it leads. */}
        <motion.dl
          className="mt-10 flex flex-wrap items-baseline gap-x-10 gap-y-5 border-t border-white/[0.18] pt-7 md:mt-14 md:gap-x-16"
          variants={rise}
          custom={{ delay: 0.35, still: reducedMotion }}
          initial="hidden"
          animate="visible"
          viewport={ENTER}
        >
          <div>
            <dt className="text-[0.625rem] font-semibold tracking-[0.28em] text-white/40 uppercase">
              Client
            </dt>
            <dd className="mt-2 text-[0.9375rem] text-white/90 md:text-[1rem]">
              {project.client}
            </dd>
          </div>

          <div>
            <dt className="text-[0.625rem] font-semibold tracking-[0.28em] text-white/40 uppercase">
              Discipline
            </dt>
            <dd className="mt-2 text-[0.9375rem] text-white/90 md:text-[1rem]">
              {project.category}
            </dd>
          </div>

          <div>
            <dt className="text-[0.625rem] font-semibold tracking-[0.28em] text-white/40 uppercase">
              Project
            </dt>
            <dd className="mt-2 font-mono text-[0.9375rem] text-white/90 md:text-[1rem]">
              {String(index + 1).padStart(2, '0')}
              <span className="text-white/35">
                {' '}
                / {String(total).padStart(2, '0')}
              </span>
            </dd>
          </div>
        </motion.dl>
      </div>
    </section>
  );
}
