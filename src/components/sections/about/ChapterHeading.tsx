'use client';

import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

import { drawRule, ENTER, lineReveal, rise } from '@/components/animations';

/**
 * The two pieces every About chapter opens with.
 *
 * They are the page's identity in miniature. The mark is monospaced, small and
 * numbered — the site's other pages label sections with wide-tracked uppercase
 * sans, so the mono slug is what tells a reader at a glance that they are in
 * the dossier rather than on the homepage. The heading is sentence case and
 * light, where the homepage's are uppercase and semibold, for the same reason.
 */

interface ChapterMarkProps {
  /** Zero-padded chapter number, e.g. `03`. */
  number: string;
  /** Short label after the em dash. */
  title: string;
  still: boolean;
  className?: string;
}

export function ChapterMark({
  number,
  title,
  still,
  className,
}: ChapterMarkProps) {
  return (
    <motion.div
      className={cn('flex items-center gap-4', className)}
      variants={rise}
      custom={{ still }}
      initial="hidden"
      whileInView="visible"
      viewport={ENTER}
    >
      <span className="font-mono text-[0.6875rem] tracking-[0.32em] text-[#BFA76F] uppercase">
        Ch. {number}
      </span>

      <motion.span
        aria-hidden="true"
        className="h-px w-10 origin-left bg-[#BFA76F]/45"
        variants={drawRule}
        custom={{ still }}
      />

      <span className="font-mono text-[0.6875rem] tracking-[0.32em] text-white/45 uppercase">
        {title}
      </span>
    </motion.div>
  );
}

interface DisplayHeadingProps {
  id?: string;
  /** One entry per line. Each gets its own mask and its own delay. */
  lines: readonly string[];
  still: boolean;
  /** Overrides the type scale; the default is the page's chapter size. */
  className?: string;
  as?: 'h1' | 'h2';
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
        'text-[clamp(2.125rem,6.2vw,3rem)] leading-[1.02] font-light tracking-[-0.03em] text-white lg:text-[clamp(2.75rem,4.4vw,4.5rem)]',
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
