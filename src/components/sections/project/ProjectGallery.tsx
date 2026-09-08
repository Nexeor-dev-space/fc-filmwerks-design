'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

import { cascade, ENTER_TALL, rise } from '@/components/animations';
import { usePrefersReducedMotion } from '@/hooks';
import { cn } from '@/lib/utils';

import { PROJECT_BAND, PROJECT_GUTTER } from './gutter';

interface ProjectGalleryProps {
  images: { src: string; alt: string }[];
}

/**
 * Supporting stills, when a project has them.
 *
 * The page renders this only where `caseStudy.gallery` exists, which today is
 * nowhere — none of the eight projects has production imagery on file beyond
 * its single key frame. That is the right behaviour rather than a gap to paper
 * over: filling a project gallery with the studio's generic behind-the-scenes
 * archive would show a reader frames from other shoots and present them as this
 * job. Add the real stills to the project's `gallery` and the section appears.
 *
 * The rhythm is deliberately uneven — the first still runs wide and the rest
 * pair up — so a set of three or five does not collapse into a tidy grid that
 * says "stock".
 */
export function ProjectGallery({ images }: ProjectGalleryProps) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section
      id="project-gallery"
      aria-labelledby="project-gallery-heading"
      className={cn('scroll-mt-28 bg-[#0A131F]', PROJECT_BAND)}
    >
      <div className={PROJECT_GUTTER}>
        <motion.h2
          id="project-gallery-heading"
          className="text-[0.6875rem] font-semibold tracking-[0.3em] text-[#BFA76F] uppercase"
          variants={rise}
          custom={{ still: reducedMotion }}
          initial="hidden"
          whileInView="visible"
          viewport={ENTER_TALL}
        >
          From the production
        </motion.h2>

        <motion.ul
          className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:mt-16"
          variants={cascade}
          initial="hidden"
          whileInView="visible"
          viewport={ENTER_TALL}
        >
          {images.map((image, index) => (
            <motion.li
              key={image.src}
              className={cn(
                'relative overflow-hidden rounded-[2px] border border-white/[0.08]',
                index === 0 ? 'aspect-[16/9] md:col-span-2' : 'aspect-[4/3]',
              )}
              variants={rise}
              custom={{ still: reducedMotion }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                loading="lazy"
                sizes={index === 0 ? '100vw' : '(min-width: 768px) 50vw, 100vw'}
                className="object-cover"
              />
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
