'use client';

import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

import { drawRule, ENTER, lineReveal, rise } from './motion';

/**
 * The two heading pieces the archive is built from.
 *
 * The homepage labels its sections with a wide-tracked uppercase sans line
 * stacked directly over a semibold uppercase heading. This page does the
 * opposite on both counts — a mono slug on a rule that runs out to the right,
 * and a light, sentence-case display heading under it — which is most of what
 * makes a section here read as an archive rather than a home page band.
 */

interface SectionSlugProps {
  children: string;
  still: boolean;
  className?: string;
}

export function SectionSlug({ children, still, className }: SectionSlugProps) {
  return (
    <motion.div
      className={cn('flex items-center gap-4', className)}
      variants={rise}
      custom={{ still }}
      initial="hidden"
      whileInView="visible"
      viewport={ENTER}
    >
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#BFA76F]"
      />
      <span className="font-mono text-[0.6875rem] tracking-[0.32em] text-[#BFA76F] uppercase">
        {children}
      </span>
      <motion.span
        aria-hidden="true"
        className="h-px flex-1 origin-left bg-white/[0.12]"
        variants={drawRule}
        custom={{ delay: 0.12, still }}
      />
    </motion.div>
  );
}

interface DisplayHeadingProps {
  id?: string;
  /** One entry per line. Each gets its own mask and its own delay. */
  lines: readonly string[];
  still: boolean;
  /** Overrides the type scale; the default is the page's section size. */
  className?: string;
  as?: 'h1' | 'h2' | 'p';
}

/**
 * A display heading whose lines rise out of their own masks.
 *
 * The mask lives on an outer `overflow-hidden` span and the transform on an
 * inner one, so nothing shares a transform with anything else — the rule this
 * project keeps running into when two effects land on the same element.
 *
 * `pb-[0.12em]` on the line box is not decoration: without it the mask clips
 * the descenders of the very letters it is revealing.
 */
export function DisplayHeading({
  id,
  lines,
  still,
  className,
  as: Tag = 'h2',
}: DisplayHeadingProps) {
  return (
    <Tag
      id={id}
      className={cn(
        'text-[clamp(2rem,6vw,2.875rem)] leading-[1.03] font-light tracking-[-0.03em] text-white lg:text-[clamp(2.625rem,4.2vw,4.25rem)]',
        className,
      )}
    >
      <motion.span
        className="block"
        initial="hidden"
        whileInView="visible"
        viewport={ENTER}
      >
        {lines.map((line, index) => (
          <span
            key={line}
            className="block overflow-hidden pb-[0.12em] last:pb-0"
          >
            <motion.span
              className="block"
              variants={lineReveal}
              custom={{ index, still }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
