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

import { featuredProjectRows, type Project } from '@/config/projects';
import { DURATION, EASE } from '@/constants';
import { useIsMobile, usePrefersReducedMotion } from '@/hooks';

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

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

interface CardMotion {
  rise: number;
  reduced: boolean;
}

const RISE = { mobile: 36, desktop: 52 } as const;
const DEFAULT_MOTION: CardMotion = { rise: RISE.desktop, reduced: false };

const CARD_STAGGER = 0.12;
const PARALLAX = 10;
const CARD_BLUR = 6;
const STILL_BLUR = 4;

const REDUCED_CARD_TRANSITION: Transition = {
  duration: 0,
  opacity: { duration: DURATION.base, ease: EASE.out },
};

const INSTANT: Transition = { duration: 0 };

const gridVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: CARD_STAGGER, delayChildren: 0.05 },
  },
};

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
    transitionEnd: { filter: 'none' },
  }),
};

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

        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(0,0,0,0.86), rgba(0,0,0,0.35), transparent)',
          }}
        />

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

          <motion.div
            className="mt-3"
            variants={textVariants}
            custom={cardMotion}
          >
            <h3 className="text-[1.625rem] leading-[1.15] font-extralight tracking-tight text-white transition-transform duration-[600ms] ease-out group-hover:-translate-y-1 group-focus-visible:-translate-y-1 md:text-[1.875rem]">
              {project.title}
            </h3>
          </motion.div>

          <motion.p
            className="mt-2 max-w-[42ch] text-[0.8125rem] leading-[1.6] text-white/[0.68]"
            variants={textVariants}
            custom={cardMotion}
          >
            {project.description}
          </motion.p>

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

export function PortfolioGrid() {
  const reduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  const cardMotion = useMemo<CardMotion>(
    () => ({ rise: isMobile ? RISE.mobile : RISE.desktop, reduced }),
    [isMobile, reduced],
  );

  return (
    <section
      id="portfolio-grid"
      aria-labelledby="portfolio-heading"
      className="relative z-10 bg-[#0f1012] pt-32 pb-20 md:pt-40 md:pb-24 lg:pt-48 lg:pb-28 min-h-screen"
    >
      <div className="w-full px-4 md:px-[3vw]">
        <header className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-20">
          <div>
            <motion.h1
              id="portfolio-heading"
              className="text-[2.5rem] leading-[0.95] font-semibold tracking-[-0.02em] text-white uppercase md:text-[3.25rem] lg:text-[4rem] xl:text-[4.5rem]"
              variants={fadeUp}
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.6 }}
            >
              Our
              <br />
              Portfolio
            </motion.h1>
          </div>

          <motion.p
            className="max-w-[460px] text-[1rem] leading-[1.8] text-white/[0.72] md:text-[1.0625rem] lg:shrink-0 lg:text-[1.125rem]"
            variants={fadeUp}
            custom={0.08}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
          >
            Explore our curated selection of films, commercials, and brand stories. Every frame is crafted to leave a lasting impression.
          </motion.p>
        </header>

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
            </Fragment>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
