'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

import { projectName, type Project } from '@/config/projects';

import { ENTER_TALL, rise, wipeIn } from './motion';

interface ArchiveCardProps {
  project: Project;
  /** Position within the *filtered* set, used for the stagger only. */
  index: number;
  still: boolean;
}

/**
 * One archive entry: a plate with its caption underneath.
 *
 * Every entry is composed the same way. The frame is 16:10 at every width,
 * the caption is the same three rows on every card, and nothing rides on the
 * still except its index. The page used to cycle through wide, narrow and
 * panoramic plates with alternate rows dropped off the baseline, and captioned
 * the panoramic ones in a row instead of a stack. It read as busy rather than
 * composed, and the tall frames cropped the films' key art. A catalogue is
 * cleaner when the plates are one shape and the eye reads the pictures rather
 * than the layout.
 *
 * Deliberately not the homepage's `ProjectCard`, which is a poster with the
 * type set over the still inside a scrim. Here the words sit under the frame
 * on the page's own ground.
 *
 * The caption, top to bottom, on every card:
 *
 *   CATEGORY · CLIENT                  →
 *   Title
 *   One-sentence description
 *
 * The title is the project's name without its category suffix, because the
 * category is already the first word of the caption.
 *
 * One transform per element, as everywhere else in this project: the mask does
 * the entrance wipe, an inner wrapper does the hover zoom, and the image
 * itself carries neither.
 */
export function ArchiveCard({ project, index, still }: ArchiveCardProps) {
  /* Cards enter in sequence, but the delay is capped: a filter that leaves
     eight entries should not make the last one wait a second and a half. */
  const delay = Math.min(index, 3) * 0.08;
  const name = projectName(project);

  return (
    <motion.li
      variants={rise}
      custom={{ delay, still }}
      initial="hidden"
      whileInView="visible"
      viewport={ENTER_TALL}
    >
      <Link
        href={project.href}
        aria-label={`${name}: view project`}
        data-cursor="view"
        className="group block focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[#BFA76F]"
      >
        <motion.div
          className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0F1C2E] md:rounded-[24px]"
          variants={wipeIn}
          custom={{ delay: delay + 0.08, still }}
        >
          <div className="absolute inset-0 transition-transform duration-[1400ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.05] group-focus-visible:scale-[1.05]">
            <Image
              src={project.image}
              alt=""
              fill
              loading="lazy"
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          {/* The index sits in a pill rather than on a gradient, so it reads
              on any still without dimming the picture. */}
          <span className="pointer-events-none absolute top-4 left-4 rounded-full bg-[#0A131F]/70 px-3 py-1.5 font-mono text-[0.625rem] tracking-[0.28em] text-white/80 backdrop-blur-md md:top-5 md:left-5">
            {project.number}
          </span>
        </motion.div>

        <div className="pt-5 md:pt-6">
          {/* Tracking tightens on narrow cards so the longest category and
              client pair still fits on one line beside the arrow. */}
          <div className="flex items-baseline justify-between gap-4 font-mono text-[0.625rem] tracking-[0.18em] uppercase md:tracking-[0.2em] lg:tracking-[0.24em]">
            <p>
              <span className="text-[#BFA76F]">{project.category}</span>
              <span aria-hidden="true" className="px-2 text-white/25">
                ·
              </span>
              <span className="text-white/45">{project.client}</span>
            </p>
            <span
              aria-hidden="true"
              className="inline-block shrink-0 text-white/35 transition-[transform,color] duration-500 ease-out group-hover:translate-x-1.5 group-hover:text-[#BFA76F] group-focus-visible:translate-x-1.5 group-focus-visible:text-[#BFA76F]"
            >
              →
            </span>
          </div>

          <h3 className="mt-3 text-[1.375rem] leading-[1.2] font-light tracking-[-0.02em] text-white transition-colors duration-500 ease-out group-hover:text-[#BFA76F] group-focus-visible:text-[#BFA76F] md:text-[1.5rem]">
            {name}
          </h3>

          <p className="mt-2 max-w-[52ch] text-[0.9375rem] leading-[1.7] text-white/[0.62]">
            {project.description}
          </p>
        </div>
      </Link>
    </motion.li>
  );
}
