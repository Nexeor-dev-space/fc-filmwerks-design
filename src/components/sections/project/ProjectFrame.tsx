'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

import { usePrefersReducedMotion } from '@/hooks';

/** Fine film grain, the texture shared by every cinematic surface on the site. */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

interface ProjectFrameProps {
  src: string;
  alt: string;
}

/**
 * A full-bleed frame, dropped into the middle of the narrative.
 *
 * It is the project's own still, shown a second time at a different crop and a
 * different scale. That is deliberate rather than a shortage: most of these
 * projects have exactly one frame on file, and a case study that shows it once
 * and then talks for eight screens has no visual middle. Re-framing it wide and
 * letting the type breathe around it gives the story a break in the same way a
 * spread does in print.
 *
 * When a project gains real production stills, put them in `caseStudy.gallery`
 * — the gallery section renders itself and this band keeps doing its own job.
 *
 * The band is overscanned top and bottom by more than the parallax travel, so
 * the drift can never pull a bare edge into the frame.
 *
 * It carries no caption. One was tried and removed: the band sits between two
 * chapters that have just named the client and the project, so a mono line
 * restating both read as a label on something nobody had asked to have
 * labelled, and it put a hard type edge under an image whose whole job is to be
 * an uninterrupted break in the reading.
 */
export function ProjectFrame({ src, alt }: ProjectFrameProps) {
  const reducedMotion = usePrefersReducedMotion();
  const bandRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: bandRef,
    offset: ['start end', 'end start'],
  });

  const bandY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  return (
    <div className="bg-[#0A131F]">
      <div
        ref={bandRef}
        className="relative h-[52vh] min-h-[300px] overflow-hidden md:h-[64vh] lg:h-[78vh]"
      >
        <motion.div
          className="absolute inset-x-0 -top-[10%] -bottom-[10%]"
          style={reducedMotion ? undefined : { y: bandY }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            loading="lazy"
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#0A131F]/55 via-transparent to-[#0A131F]/25"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.09] mix-blend-overlay"
          style={{ backgroundImage: GRAIN }}
        />
      </div>
    </div>
  );
}
