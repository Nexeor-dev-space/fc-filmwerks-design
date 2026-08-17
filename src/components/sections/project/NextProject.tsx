'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

import { ENTER, rise } from '@/components/animations';
import type { Project } from '@/config/projects';
import { usePrefersReducedMotion } from '@/hooks';

/**
 * The route through to the next project.
 *
 * A full-bleed frame rather than the hairline text link this page used to end
 * on. Someone who has read a whole case study is the most likely person on the
 * site to read a second one, and a line of small type is a poor offer at that
 * moment — the next project's own still is the argument.
 *
 * The image lifts and warms on hover through a single `group` on the anchor, so
 * the whole plate responds as one target rather than only the words.
 */
export function NextProject({ project }: { project: Project }) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section aria-labelledby="next-project-heading" className="bg-[#0A131F]">
      {/* The reveal is on the wrapper, never on the <section> itself. The
          section is what paints the ground under this block, and animating its
          opacity would mean a trigger that failed to fire took the background
          with it — the page would end on a band of bare body colour. */}
      <motion.div
        variants={rise}
        custom={{ still: reducedMotion }}
        initial="hidden"
        whileInView="visible"
        viewport={ENTER}
      >
        <Link
          href={project.href}
          className="group relative block h-[60vh] min-h-[380px] overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#BFA76F] md:h-[72vh]"
        >
          <Image
            src={project.image}
            alt=""
            fill
            loading="lazy"
            sizes="100vw"
            className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.04]"
          />

          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#0A131F] via-[#0A131F]/60 to-[#0A131F]/30 transition-opacity duration-700 ease-out group-hover:opacity-90"
          />

          <div className="absolute inset-x-0 bottom-0 px-5 pb-14 md:px-8 md:pb-20 lg:px-14">
            <p
              id="next-project-heading"
              className="text-[0.6875rem] font-semibold tracking-[0.3em] text-[#BFA76F] uppercase"
            >
              Next project
            </p>

            <p className="mt-5 max-w-[18ch] text-[clamp(1.875rem,7vw,2.5rem)] leading-[1.02] font-light tracking-[-0.03em] text-white lg:text-[clamp(2.75rem,4.4vw,4.5rem)]">
              {project.title}
            </p>

            <span className="mt-8 inline-flex items-center gap-4 text-[0.6875rem] font-semibold tracking-[0.24em] text-white/70 uppercase transition-colors duration-500 ease-out group-hover:text-[#BFA76F] md:text-[0.75rem]">
              View case study
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-500 ease-out group-hover:translate-x-2"
              >
                →
              </span>
            </span>
          </div>
        </Link>
      </motion.div>
    </section>
  );
}
