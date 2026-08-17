'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

import { productionGallery } from '@/config/portfolio';
import { usePrefersReducedMotion } from '@/hooks';
import { cn } from '@/lib/utils';

import { cascade, ENTER, ENTER_TALL, rise } from './motion';
import { SectionSlug } from './PortfolioHeading';

/**
 * Mosaic composition, one entry per production still.
 *
 * Every row sums to six tracks — 2+4, 3+3, 2+2+2, 4+2, 6 — so the sheet closes
 * flush at the bottom with no ragged tail. The old version of this section ran
 * eight identical squares in a 4×2 grid and left two of the ten photographs on
 * disk unused; all ten are here, and no two neighbours share a proportion.
 */
const MOSAIC = [
  { span: 'lg:col-span-2', aspect: 'lg:aspect-square', wide: false },
  { span: 'lg:col-span-4', aspect: 'lg:aspect-[16/9]', wide: true },
  { span: 'lg:col-span-3', aspect: 'lg:aspect-[4/3]', wide: true },
  { span: 'lg:col-span-3', aspect: 'lg:aspect-[4/3]', wide: false },
  { span: 'lg:col-span-2', aspect: 'lg:aspect-[3/4]', wide: false },
  { span: 'lg:col-span-2', aspect: 'lg:aspect-[3/4]', wide: false },
  { span: 'lg:col-span-2', aspect: 'lg:aspect-[3/4]', wide: false },
  { span: 'lg:col-span-4', aspect: 'lg:aspect-[16/9]', wide: true },
  { span: 'lg:col-span-2', aspect: 'lg:aspect-square', wide: false },
  { span: 'lg:col-span-6', aspect: 'lg:aspect-[21/9]', wide: true },
] as const;

/**
 * On production — the studio's own contact sheet.
 *
 * Deliberately quieter than the archive above it: no titles, no metadata, no
 * route-through. The projects are the work; this is the room the work is made
 * in, and giving it the same weight would flatten the page's hierarchy.
 *
 * It is set as a mosaic with a two-pixel gutter rather than a spaced grid of
 * cards, because a contact sheet is what it is — frames pulled off a shoot and
 * laid down next to each other, not ten more things to click.
 */
export function ProductionGallery() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section
      aria-labelledby="production-gallery-heading"
      className="bg-[#0A131F] pb-24 md:pb-28 lg:pb-32"
    >
      <div className="px-5 md:px-8 lg:px-14">
        <SectionSlug still={reducedMotion}>
          {productionGallery.slug}
        </SectionSlug>

        {/* Heading left, body right — the inverse weighting of the masthead,
            so consecutive sections do not sit on the same axis. */}
        <motion.div
          className="mt-9 grid grid-cols-1 gap-y-6 lg:grid-cols-12 lg:gap-x-14"
          variants={cascade}
          initial="hidden"
          whileInView="visible"
          viewport={ENTER}
        >
          <motion.h2
            id="production-gallery-heading"
            className="max-w-[22ch] text-[1.75rem] leading-[1.15] font-light tracking-[-0.02em] text-white lg:col-span-6 lg:text-[2.5rem]"
            variants={rise}
            custom={{ still: reducedMotion }}
          >
            {productionGallery.headline}
          </motion.h2>

          <motion.p
            className="max-w-[54ch] text-[0.9375rem] leading-[1.75] text-white/[0.6] lg:col-span-5 lg:col-start-8 lg:pt-2 lg:text-[1rem]"
            variants={rise}
            custom={{ delay: 0.1, still: reducedMotion }}
          >
            {productionGallery.body}
          </motion.p>
        </motion.div>
      </div>

      {/*
       * Full-bleed at the gutters the rest of the page keeps, so the sheet
       * runs edge to edge and reads as a strip of film rather than a boxed
       * component.
       */}
      <ul className="mt-12 grid grid-cols-2 gap-[3px] md:mt-16 md:gap-1 lg:grid-cols-6">
        {productionGallery.frames.map((frame, index) => {
          const cell = MOSAIC[index % MOSAIC.length];
          return (
            <motion.li
              key={frame.src}
              className={cn(
                cell.span,
                /* Wide cells take the full width on phones, where a
                   two-column mosaic of ten squares reads as wallpaper. */
                cell.wide && 'col-span-2',
              )}
              /*
               * `rise` rather than the archive's `wipeIn`. A mask that starts
               * closed removes the element from view entirely, and if its
               * trigger never fires the content is simply gone — which is what
               * happened here: ten fully clipped cells left a screen and a half
               * of apparent emptiness under the heading on a phone, and because
               * a clipped box is never "visible", the browser's lazy loader
               * never requested a single one of the photographs either. A fade
               * and lift degrades to plain visible content instead.
               */
              variants={rise}
              custom={{ delay: (index % 3) * 0.08, still: reducedMotion }}
              initial="hidden"
              whileInView="visible"
              viewport={ENTER_TALL}
            >
              <div
                className={cn(
                  'group relative aspect-square overflow-hidden bg-[#0F1C2E]',
                  cell.aspect,
                  cell.wide && 'aspect-[16/9]',
                )}
              >
                {/* The wrapper clips; the image inside owns the zoom, so the
                    two transforms never collide. */}
                <Image
                  src={frame.src}
                  alt={frame.alt}
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 34vw, 50vw"
                  className="object-cover brightness-[0.72] saturate-[0.9] transition-[transform,filter] duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.05] group-hover:brightness-100 group-hover:saturate-100"
                />
              </div>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
