'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

import { ENTER, lineReveal, rise } from '@/components/animations';
import { FilmFrame } from '@/components/ui';
import {
  projectName,
  type Project,
  type ProjectVideo,
} from '@/config/projects';
import { usePrefersReducedMotion } from '@/hooks';
import { cn } from '@/lib/utils';

import { PROJECT_GUTTER } from './gutter';

interface ProjectHeroProps {
  project: Project;
  /** Position in the archive, so the hero can print "03 / 08". */
  index: number;
  total: number;
}

/** The project's films, as a list, whether it carries one or several. */
function filmsOf(video: Project['video']): ProjectVideo[] {
  if (!video) return [];
  return Array.isArray(video) ? video : [video];
}

/* -------------------------------------------------------------------------- */
/* Shared pieces                                                              */
/* -------------------------------------------------------------------------- */

function BackLink({ still }: { still: boolean }) {
  return (
    <motion.div
      variants={rise}
      custom={{ still }}
      initial="hidden"
      animate="visible"
    >
      <Link
        href="/portfolio"
        className="group inline-flex items-center gap-2.5 text-[0.6875rem] font-semibold tracking-[0.24em] text-white/60 uppercase transition-colors duration-500 ease-out hover:text-[#BFA76F] focus-visible:text-[#BFA76F] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#BFA76F] md:text-[0.75rem]"
      >
        <span
          aria-hidden="true"
          className="inline-block transition-transform duration-500 ease-out group-hover:-translate-x-1.5"
        >
          ←
        </span>
        All work
      </Link>
    </motion.div>
  );
}

/**
 * Category, then title. One block so the two registers stay locked together
 * whichever hero shape is being drawn around them.
 */
function Title({
  project,
  still,
  className,
}: {
  project: Project;
  still: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <motion.p
        className="text-[0.8125rem] font-semibold tracking-[0.3em] text-[#BFA76F] uppercase"
        variants={rise}
        custom={{ delay: 0.1, still }}
        initial="hidden"
        animate="visible"
      >
        {project.category}
      </motion.p>

      {/*
       * The name alone. The category is the gold line directly above, and the
       * archive titles carry it as a suffix ("Determined | Music Video"), so
       * printing the whole title here says the same word twice in two type
       * sizes — and on a long name it costs a second line of display type,
       * which is what pushed the film below the fold.
       *
       * Masked line by line like the site's other display headings. The mask
       * sits on the whole block rather than per word: a word-level boundary
       * would fall mid-line at some viewport width and clip a descender.
       */}
      <h1
        id="project-title"
        className="mt-5 max-w-[16ch] overflow-hidden pb-[0.08em] text-[clamp(2.25rem,8.5vw,3rem)] leading-[0.98] font-light tracking-[-0.03em] text-white lg:text-[clamp(3.25rem,5.6vw,5.5rem)]"
      >
        <motion.span
          className="block"
          variants={lineReveal}
          custom={{ index: 1, still }}
          initial="hidden"
          animate="visible"
        >
          {projectName(project)}
        </motion.span>
      </h1>
    </div>
  );
}

/** Hero facts. The client is the one a reader scans for, so it leads. */
function Facts({
  project,
  index,
  total,
  still,
  className,
}: {
  project: Project;
  index: number;
  total: number;
  still: boolean;
  className?: string;
}) {
  const rows = [
    { label: 'Client', value: project.client, mono: false },
    { label: 'Discipline', value: project.category, mono: false },
    {
      label: 'Project',
      value: (
        <>
          {String(index + 1).padStart(2, '0')}
          <span className="text-white/35">
            {' '}
            / {String(total).padStart(2, '0')}
          </span>
        </>
      ),
      mono: true,
    },
  ];

  return (
    <motion.dl
      className={cn(
        'flex flex-wrap items-baseline gap-x-10 gap-y-5 border-t border-white/[0.18] pt-7 md:gap-x-16',
        className,
      )}
      variants={rise}
      custom={{ delay: 0.35, still }}
      initial="hidden"
      animate="visible"
      viewport={ENTER}
    >
      {rows.map((row) => (
        <div key={row.label}>
          <dt className="text-[0.625rem] font-semibold tracking-[0.28em] text-white/40 uppercase">
            {row.label}
          </dt>
          <dd
            className={cn(
              'mt-2 text-[0.9375rem] text-white/90 md:text-[1rem]',
              row.mono && 'font-mono',
            )}
          >
            {row.value}
          </dd>
        </div>
      ))}
    </motion.dl>
  );
}

/**
 * The still, blurred right down and dimmed, as ground behind a film plate.
 *
 * Not decoration: a plate floating on flat navy reads as an embed dropped into
 * a page, and this is meant to read as a screening. The colour of the film's
 * own key art carries through the frame without competing with it.
 */
function AmbientGround({ src }: { src: string }) {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <Image
        src={src}
        alt=""
        fill
        priority
        sizes="100vw"
        className="scale-110 object-cover opacity-30 blur-3xl"
      />
      <div className="absolute inset-0 bg-[#0A131F]/55" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Hero                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * The opening frame of a case study, in one of two shapes.
 *
 * **A published film** gets a screening: the player itself is the hero, at the
 * film's own aspect ratio, with the title and facts set around it. Someone who
 * opens a film's page came to watch it, and making them scroll past a hero to
 * find a play button had the priorities backwards — this used to be a separate
 * section below, reached by a button, and now it is simply the first thing on
 * the page. A landscape film takes the full measure with its title above and
 * its facts beneath; a vertical one takes a tall plate on the left with the
 * type set beside it, so the space a 9:16 frame leaves is used rather than
 * filled with black.
 *
 * **Everything else** keeps the full-bleed still: the title sits on the image at
 * the bottom edge, over a scrim that is heaviest exactly where the type lands.
 * The scrim is not decoration — a still can be bright anywhere, and this is what
 * guarantees the headline keeps its contrast whichever project is being shown.
 *
 * The slow push-in on that shape is scroll-driven rather than fired on entry: a
 * `useTransform` value always resolves, so there is no state in which a missed
 * trigger leaves the hero stranded.
 */
export function ProjectHero({ project, index, total }: ProjectHeroProps) {
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  /* The frame settles into the page as it leaves rather than sliding off it. */
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);

  const films = filmsOf(project.video);

  if (films.length > 0) {
    const portrait = films[0].orientation === 'portrait';
    const several = films.length > 1;

    const frame = (film: ProjectVideo, position: number) => (
      <motion.div
        key={'youtubeId' in film ? film.youtubeId : film.src}
        variants={rise}
        custom={{ delay: 0.22 + position * 0.08, still: reducedMotion }}
        initial="hidden"
        animate="visible"
      >
        {/* Only worth numbering when there is more than one: on a single film
            the label would be answering a question nobody asked. */}
        {several && (
          <p className="mb-4 font-mono text-[0.625rem] tracking-[0.3em] text-white/40 uppercase">
            {String(position + 1).padStart(2, '0')} · {film.label}
          </p>
        )}

        <FilmFrame
          source={
            'youtubeId' in film
              ? { youtubeId: film.youtubeId }
              : { src: film.src }
          }
          title={
            several
              ? `${projectName(project)}, film ${position + 1}`
              : project.title
          }
          poster={film.poster ?? project.image}
          posterAlt={`${project.client}, ${project.category}`}
          orientation={film.orientation}
          className="rounded-[14px] border border-white/[0.10] shadow-[0_40px_120px_rgba(0,0,0,0.55)]"
          sizes={
            film.orientation === 'portrait'
              ? '(min-width: 1024px) 30vw, 90vw'
              : '(min-width: 1024px) 76vw, 100vw'
          }
        />
      </motion.div>
    );

    return (
      <section
        ref={sectionRef}
        aria-labelledby="project-title"
        className="relative overflow-hidden bg-[#0A131F]"
      >
        <AmbientGround src={project.image} />

        <div
          className={cn(
            'relative pt-32 pb-20 md:pt-36 md:pb-24',
            PROJECT_GUTTER,
          )}
        >
          <BackLink still={reducedMotion} />

          {several ? (
            /* A campaign, not a film: the adverts run one under the other in
               the order they were delivered, each at its own full size, with
               the title above them and the credits row at the foot. Two
               vertical adverts shown side by side would each be half the size
               they deserve, and only one of them would look like the piece of
               work it is. */
            <>
              <Title
                project={project}
                still={reducedMotion}
                className="mt-8 md:mt-10"
              />

              <div className="mt-10 flex flex-col items-center gap-14 md:mt-12 md:gap-20">
                {films.map((film, position) => (
                  <div
                    key={'youtubeId' in film ? film.youtubeId : film.src}
                    className="w-full"
                    style={{
                      maxWidth:
                        film.orientation === 'portrait'
                          ? 'min(380px, calc(78dvh * 9 / 16))'
                          : 'min(100%, calc(78dvh * 16 / 9))',
                    }}
                  >
                    {frame(film, position)}
                  </div>
                ))}
              </div>

              <Facts
                project={project}
                index={index}
                total={total}
                still={reducedMotion}
                className="mt-14 md:mt-16"
              />
            </>
          ) : portrait ? (
            /* Tall plate beside the type. Below `lg` they stack, plate first —
               the film still leads, it just has nothing to sit beside. */
            <div className="mt-12 grid grid-cols-1 items-center gap-x-14 gap-y-12 lg:mt-16 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <div
                  className="mx-auto w-full lg:mx-0"
                  /* Height-led: a 9:16 plate is sized off the viewport so the
                     whole hero fits, and only then capped by width. */
                  style={{ maxWidth: 'min(340px, calc(66dvh * 9 / 16))' }}
                >
                  {frame(films[0], 0)}
                </div>
              </div>

              <div className="lg:col-span-7 lg:col-start-6">
                <Title project={project} still={reducedMotion} />
                <Facts
                  project={project}
                  index={index}
                  total={total}
                  still={reducedMotion}
                  className="mt-10 md:mt-12"
                />
              </div>
            </div>
          ) : (
            /* Title, the film, then the credits row: the order a cinema page
               reads in. The plate is width-led but capped against the viewport
               height so title, film and facts all land on one screen. */
            <>
              <Title
                project={project}
                still={reducedMotion}
                className="mt-8 md:mt-10"
              />

              <div
                className="mt-8 md:mt-10"
                /* Width-led, but capped against the viewport height so the
                   title, the film and the credits row all land on one screen.
                   The reserve is everything around the plate: the header
                   clearance, both blocks of type and this band's padding. */
                style={{
                  maxWidth: 'min(100%, calc((100dvh - 31rem) * 16 / 9))',
                }}
              >
                {frame(films[0], 0)}
              </div>

              <Facts
                project={project}
                index={index}
                total={total}
                still={reducedMotion}
                className="mt-8 md:mt-10"
              />
            </>
          )}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      aria-labelledby="project-title"
      className="relative flex min-h-[88svh] flex-col justify-end overflow-hidden bg-[#0A131F] lg:min-h-dvh"
    >
      <motion.div
        className="absolute inset-0"
        style={reducedMotion ? undefined : { scale: imageScale, y: imageY }}
      >
        <Image
          src={project.image}
          alt={`${project.client}, ${project.category}`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/* Two scrims, not one, because they are solving different problems.
          The first carries the type at the foot. The second darkens the top
          third for the navigation: the logo is white, these stills are not
          controlled, and this one opens on a bright window — without it the
          wordmark disappears into the frame and the page looks unbranded. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-[#0A131F] via-[#0A131F]/55 to-[#0A131F]/25"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[38%] bg-gradient-to-b from-[#0A131F]/80 to-transparent"
      />

      <div
        className={cn(
          'relative w-full pt-40 pb-16 md:pb-20 lg:pb-24',
          PROJECT_GUTTER,
        )}
      >
        <BackLink still={reducedMotion} />
        <Title
          project={project}
          still={reducedMotion}
          className="mt-10 md:mt-14"
        />
        <Facts
          project={project}
          index={index}
          total={total}
          still={reducedMotion}
          className="mt-10 md:mt-14"
        />
      </div>
    </section>
  );
}
