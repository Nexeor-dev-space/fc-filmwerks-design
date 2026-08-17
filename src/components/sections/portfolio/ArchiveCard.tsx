'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

import type { Project } from '@/config/projects';
import { cn } from '@/lib/utils';

import { ENTER_TALL, rise, wipeIn } from './motion';

/**
 * Fine film grain, as a data URI rather than an asset — one tiling turbulence
 * patch costs nothing to fetch and keeps the stills from looking digitally
 * clean.
 */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

/**
 * How one entry is composed. The archive cycles through a fixed rhythm of
 * these rather than repeating a single card — see `ARCHIVE_RHYTHM`.
 */
export interface ArchiveLayout {
  /** Column span on the 12-track desktop grid. */
  span: string;
  /** Frame proportion at desktop width. */
  aspect: string;
  /** Drops the frame off the row's baseline, so rows are never level. */
  offset?: string;
  /** `sizes` for the optimiser, matched to the span above. */
  sizes: string;
  /** Wide entries caption horizontally instead of stacking. */
  feature?: boolean;
}

/**
 * The page's composition rhythm.
 *
 * Every pair of consecutive spans sums to twelve — 7+5, 12, 5+7, 12 — so the
 * grid closes cleanly no matter how many entries a filter leaves behind. The
 * homepage runs three identical 520px-tall posters per row; this runs wide,
 * narrow, panoramic, narrow, wide, panoramic, and no two adjacent frames share
 * a proportion.
 */
export const ARCHIVE_RHYTHM: ArchiveLayout[] = [
  {
    span: 'lg:col-span-7',
    aspect: 'lg:aspect-[16/10]',
    sizes: '(min-width: 1024px) 58vw, 100vw',
  },
  {
    span: 'lg:col-span-5',
    aspect: 'lg:aspect-[4/5]',
    offset: 'lg:mt-20',
    sizes: '(min-width: 1024px) 41vw, 100vw',
  },
  {
    span: 'lg:col-span-12',
    aspect: 'lg:aspect-[21/9]',
    sizes: '100vw',
    feature: true,
  },
  {
    span: 'lg:col-span-5',
    aspect: 'lg:aspect-[4/5]',
    sizes: '(min-width: 1024px) 41vw, 100vw',
  },
  {
    span: 'lg:col-span-7',
    aspect: 'lg:aspect-[16/10]',
    offset: 'lg:mt-20',
    sizes: '(min-width: 1024px) 58vw, 100vw',
  },
  {
    span: 'lg:col-span-12',
    aspect: 'lg:aspect-[21/9]',
    sizes: '100vw',
    feature: true,
  },
];

interface ArchiveCardProps {
  project: Project;
  layout: ArchiveLayout;
  /** Position within the *filtered* set, used for the stagger only. */
  index: number;
  still: boolean;
}

/**
 * One archive entry: a plate with its caption underneath.
 *
 * Deliberately not the homepage's `ProjectCard`, which is a poster — a fixed
 * height, the still bled to the edges, and the type set on top of it inside a
 * scrim. Here the frame is a frame and the words sit below it on the page's
 * own ground, the way a catalogue plate is captioned. Nothing but the category
 * tab and the index rides on the image.
 *
 * One transform per element, as everywhere else in this project: the mask does
 * the entrance wipe, an inner wrapper does the hover zoom, and the image
 * itself carries neither.
 */
export function ArchiveCard({
  project,
  layout,
  index,
  still,
}: ArchiveCardProps) {
  /* Cards enter in sequence, but the delay is capped — a filter that leaves
     eight entries should not make the last one wait a second and a half. */
  const delay = Math.min(index, 3) * 0.08;

  return (
    <motion.li
      className={cn('col-span-1', layout.span, layout.offset)}
      variants={rise}
      custom={{ delay, still }}
      initial="hidden"
      whileInView="visible"
      viewport={ENTER_TALL}
    >
      <Link
        href={project.href}
        aria-label={`${project.title} — view project`}
        className="group block focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[#BFA76F]"
      >
        <motion.div
          className={cn(
            'relative aspect-[4/3] overflow-hidden bg-[#0F1C2E]',
            layout.aspect,
          )}
          variants={wipeIn}
          custom={{ delay: delay + 0.08, still }}
        >
          <div className="absolute inset-0 transition-transform duration-[1400ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.06] group-focus-visible:scale-[1.06]">
            <Image
              src={project.image}
              alt=""
              fill
              loading="lazy"
              sizes={layout.sizes}
              className="object-cover brightness-[0.86] transition-[filter] duration-[900ms] ease-out group-hover:brightness-100"
            />
          </div>

          {/* Just enough gradient at the head of the frame to seat the index
              and the category tab — the caption below needs none. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0A131F]/70 to-transparent"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.1] mix-blend-overlay"
            style={{ backgroundImage: GRAIN }}
          />

          <div className="pointer-events-none absolute inset-x-5 top-5 flex items-start justify-between md:inset-x-7 md:top-6">
            <span className="font-mono text-[0.6875rem] tracking-[0.28em] text-white/70">
              {project.number}
            </span>
            <span className="font-mono text-[0.625rem] tracking-[0.26em] text-[#BFA76F] uppercase">
              {project.category}
            </span>
          </div>

          {/* Hairline that draws across the foot of the frame on hover — the
              only thing the plate does that the caption cannot. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-[#BFA76F] transition-transform duration-[900ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
          />
        </motion.div>

        {/* Caption. Stacked under narrow plates; run as a row under the
            panoramic ones, where a stacked caption would leave a metre of
            empty measure beside it. */}
        <div
          className={cn(
            'pt-6 md:pt-7',
            layout.feature &&
              'lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-10',
          )}
        >
          <h3
            className={cn(
              'text-[1.375rem] leading-[1.2] font-light tracking-[-0.02em] text-white transition-colors duration-500 ease-out group-hover:text-[#BFA76F] group-focus-visible:text-[#BFA76F] md:text-[1.625rem]',
              layout.feature && 'lg:col-span-5 lg:text-[2rem]',
            )}
          >
            {project.title}
          </h3>

          <p
            className={cn(
              'mt-3 max-w-[52ch] text-[0.9375rem] leading-[1.7] text-white/[0.62]',
              layout.feature && 'lg:col-span-5 lg:mt-0 lg:max-w-[46ch]',
            )}
          >
            {project.description}
          </p>

          <span
            className={cn(
              'mt-5 inline-flex items-center gap-2.5 font-mono text-[0.6875rem] tracking-[0.26em] text-white/45 uppercase transition-colors duration-500 ease-out group-hover:text-white group-focus-visible:text-white',
              layout.feature && 'lg:col-span-2 lg:mt-1.5 lg:justify-end',
            )}
          >
            {project.client}
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-500 ease-out group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5"
            >
              →
            </span>
          </span>
        </div>
      </Link>
    </motion.li>
  );
}
