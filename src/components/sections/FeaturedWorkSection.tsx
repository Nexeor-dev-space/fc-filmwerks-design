'use client';

import {
  motion,
  useScroll,
  useTransform,
  type Transition,
  type Variants,
} from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useMemo, useRef } from 'react';

import { CtaButton } from '@/components/ui';
import { featuredProjectRows, type Project } from '@/config/projects';
import { DURATION, EASE } from '@/constants';
import { useIsMobile, usePrefersReducedMotion } from '@/hooks';

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

/* -------------------------------------------------------------------------- */
/* Entrance motion                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Resolved once in the section and handed to every animated node through
 * Framer's `custom` prop, so nine cards share one media-query subscription
 * rather than nine.
 */
interface CardMotion {
  /** How far the card rises, in px. */
  rise: number;
  reduced: boolean;
}

/** Phone viewports are short — 52px of travel there reads as a lurch. */
const RISE = { mobile: 36, desktop: 52 } as const;

const DEFAULT_MOTION: CardMotion = { rise: RISE.desktop, reduced: false };

/** Long enough between cards to read as a sequence, short enough not to drag. */
const CARD_STAGGER = 0.12;

/** ±10px against the card, so 20px of total parallax travel. */
const PARALLAX = 10;

/**
 * Blur is fill-rate bound and several cards overlap mid-stagger, which is why
 * both radii stay small and both are dropped the moment they reach zero.
 */
const CARD_BLUR = 6;
const STILL_BLUR = 4;

/**
 * Reduced motion snaps everything except opacity to its resting value.
 *
 * Written as a zero-duration transition rather than as a second set of
 * variants: the media query only resolves after mount, so the hidden state is
 * already in the DOM by then. Snapping on the way out clears it whatever it
 * was, where swapping variants would leave the transform stranded.
 */
const REDUCED_CARD_TRANSITION: Transition = {
  duration: 0,
  opacity: { duration: DURATION.base, ease: EASE.out },
};

const INSTANT: Transition = { duration: 0 };

/** Cards arrive one after another rather than as a block. */
const gridVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: CARD_STAGGER, delayChildren: 0.05 },
  },
};

/**
 * The card itself: rise, settle, sharpen.
 *
 * Its contents are sequenced with `delayChildren`/`staggerChildren` rather
 * than per-element delays. A child's own `transition.delay` *replaces* the
 * delay a parent stagger forwards down to it, so hand-written delays would
 * make card six's still open while card six was still arriving. The child
 * options add to the forwarded delay instead, which is what keeps the whole
 * grid in order.
 *
 * DOM order decides the stagger index, and the still's mask is the card's
 * first child — so the four lines of type land on 0.34s through 0.58s, over
 * the tail of the reveal.
 */
const cardVariants: Variants = {
  hidden: ({ rise, reduced }: CardMotion = DEFAULT_MOTION) => ({
    opacity: 0,
    y: reduced ? 0 : rise,
    scale: reduced ? 1 : 0.96,
    filter: reduced ? 'none' : `blur(${CARD_BLUR}px)`,
  }),
  visible: ({ reduced }: CardMotion = DEFAULT_MOTION) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: reduced
      ? REDUCED_CARD_TRANSITION
      : {
          duration: DURATION.slow,
          ease: EASE.out,
          delayChildren: 0.26,
          staggerChildren: 0.08,
        },
    /* Drop the filter once it is worthless — a live `blur(0px)` still costs a
       compositing pass on every hover repaint. */
    transitionEnd: { filter: 'none' },
  }),
};

/** The still opens from its bottom edge up, like a frame pulled into view. */
const stillMaskVariants: Variants = {
  hidden: ({ reduced }: CardMotion = DEFAULT_MOTION) => ({
    clipPath: reduced ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)',
  }),
  visible: ({ reduced }: CardMotion = DEFAULT_MOTION) => ({
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: reduced
      ? INSTANT
      : { duration: DURATION.slow, ease: EASE.expo },
  }),
};

/** Pulls focus with the mask: the frame opens on an image still settling. */
const stillVariants: Variants = {
  hidden: ({ reduced }: CardMotion = DEFAULT_MOTION) => ({
    scale: reduced ? 1 : 1.08,
    filter: reduced ? 'none' : `blur(${STILL_BLUR}px)`,
  }),
  visible: ({ reduced }: CardMotion = DEFAULT_MOTION) => ({
    scale: 1,
    filter: 'blur(0px)',
    transition: reduced ? INSTANT : { duration: DURATION.slow, ease: EASE.out },
    transitionEnd: { filter: 'none' },
  }),
};

/** One line of type. The delay is the card's stagger, not this variant's. */
const textVariants: Variants = {
  hidden: ({ reduced }: CardMotion = DEFAULT_MOTION) => ({
    opacity: 0,
    y: reduced ? 0 : 20,
  }),
  visible: ({ reduced }: CardMotion = DEFAULT_MOTION) => ({
    opacity: 1,
    y: 0,
    transition: reduced ? INSTANT : { duration: DURATION.base, ease: EASE.out },
  }),
};

/**
 * One project, as a poster.
 *
 * Every transform gets its own element, because Framer and Tailwind both write
 * `transform` wholesale and the second writer silently wins. Reading down:
 *
 *   li            entrance rise + settle scale (Framer, once)
 *   a             hover lift                  (CSS)
 *   mask          clip-path reveal            (Framer, once — no transform)
 *   parallax      scroll-linked translate     (MotionValue, continuous)
 *   still         entrance zoom-out           (Framer, once)
 *   zoom          hover zoom                  (CSS)
 *   img
 *
 * The parallax layer is overscanned top and bottom so its 20px of travel can
 * never drag a bare edge into the frame.
 *
 * Hover stays CSS rather than React state — nine cards re-rendering on every
 * pointer move would cost far more than the effect is worth, and transform,
 * opacity and colour are all handled on the compositor.
 */
function ProjectCard({
  project,
  cardMotion,
}: {
  project: Project;
  cardMotion: CardMotion;
}) {
  const cardRef = useRef<HTMLLIElement>(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });
  const parallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    cardMotion.reduced ? [0, 0] : [PARALLAX, -PARALLAX],
  );

  return (
    <motion.li ref={cardRef} variants={cardVariants} custom={cardMotion}>
      <Link
        href={project.href}
        aria-label={`${project.title} — view project`}
        /* The card itself stays put on hover — no lift. All the response
           happens inside it: the still zooms and a scrim fades up under the
           copy, matching the service cards. */
        className="group relative block h-[420px] overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#13233A] shadow-[0_25px_60px_rgba(0,0,0,0.25)] transition-[box-shadow] duration-[600ms] ease-out hover:shadow-[0_40px_80px_rgba(0,0,0,0.45)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#BFA76F] md:h-[460px] lg:h-[520px]"
      >
        <motion.div
          className="absolute inset-0 overflow-hidden"
          variants={stillMaskVariants}
          custom={cardMotion}
        >
          <motion.div
            className="absolute -top-6 -bottom-6 left-0 w-full"
            style={{ y: parallaxY }}
          >
            <motion.div
              className="absolute inset-0"
              variants={stillVariants}
              custom={cardMotion}
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
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Seats the type against whatever the still happens to be doing. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(0,0,0,0.86), rgba(0,0,0,0.35), transparent)',
          }}
        />

        {/* Hover scrim, same treatment as the service cards. The gradient
            above is pitched for a title and a short meta line; the summary
            sentence needs more of the still knocked back to read, and pitching
            the base that heavy would bury the photograph at rest. This
            previously ran the other way — lightening on hover — which is the
            opposite of what reading a sentence wants. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[#0A131F]/45 opacity-0 transition-opacity duration-[600ms] ease-out group-hover:opacity-100 group-focus-visible:opacity-100"
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
          <motion.p
            className="text-[0.75rem] tracking-[0.25em] text-[#BFA76F] uppercase"
            variants={textVariants}
            custom={cardMotion}
          >
            {project.category}
          </motion.p>

          {/* The heading keeps its own hover transform, so the entrance rise
              has to live on a wrapper or one would overwrite the other. */}
          <motion.div
            className="mt-3"
            variants={textVariants}
            custom={cardMotion}
          >
            <h3 className="text-[1.625rem] leading-[1.15] font-extralight tracking-tight text-white transition-transform duration-[600ms] ease-out group-hover:-translate-y-1 group-focus-visible:-translate-y-1 md:text-[1.875rem]">
              {project.title}
            </h3>
          </motion.div>

          {/* Capped measure: this was a two-word client/location line and is
              now a full sentence, which would otherwise run the width of the
              card and read as a paragraph against the still. */}
          <motion.p
            className="mt-2 max-w-[42ch] text-[0.8125rem] leading-[1.6] text-white/[0.68]"
            variants={textVariants}
            custom={cardMotion}
          >
            {project.description}
          </motion.p>

          {/* Not a nested link — the whole poster is the target. */}
          <motion.span
            className="mt-6 inline-flex items-center gap-2.5 text-[0.75rem] font-semibold tracking-[0.24em] text-white/70 uppercase transition-colors duration-[600ms] ease-out group-hover:text-[#BFA76F] group-focus-visible:text-[#BFA76F]"
            variants={textVariants}
            custom={cardMotion}
          >
            View project
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-[600ms] ease-out group-hover:translate-x-2 group-focus-visible:translate-x-2"
            >
              →
            </span>
          </motion.span>
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
  const reduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  const cardMotion = useMemo<CardMotion>(
    () => ({ rise: isMobile ? RISE.mobile : RISE.desktop, reduced }),
    [isMobile, reduced],
  );

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

        {/* One trigger for the whole grid, fired once. Cards inherit it, so a
            card in the third row never waits on its own intersection — and
            nothing replays on a scroll back up. */}
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
                <ProjectCard
                  key={project.href}
                  project={project}
                  cardMotion={cardMotion}
                />
              ))}

              {/* Only after the final row — one route-through at the end of the
                  grid, rather than the same control repeated between bands.
                  `col-span-full` keeps it centred at every column count. */}
              {rowIndex === featuredProjectRows.length - 1 && (
                <motion.li
                  className="col-span-full flex justify-center pt-6 lg:pt-10"
                  variants={cardVariants}
                  custom={cardMotion}
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
