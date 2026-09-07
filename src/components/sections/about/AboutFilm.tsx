'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useRef, useState } from 'react';

import { Button, YouTubeEmbed } from '@/components/ui';
import { aboutFilm, chapterNumber } from '@/config/about';
import { useLenis, usePrefersReducedMotion } from '@/hooks';
import { scrollToElement } from '@/lib/scroll';

import { ChapterMark, DisplayHeading } from './ChapterHeading';
import {
  cascade,
  drawRule,
  ENTER,
  ENTER_TALL,
  rise,
} from '@/components/animations';

/**
 * Chapter 03: Blue Lily, the studio's award-winning original film.
 *
 * Sits directly after the founders because it is their evidence:
 * the studio says the market lacked humane storytelling, and this is the film
 * it made to show what it meant. Putting the proof before the method means a
 * reader meets the work before they are asked to trust a process.
 *
 * The homepage shows the same film as a full-width cinematic band. Here it is
 * set the way the rest of the dossier is set — as a record. The film plays in
 * the left column: the key art at its native 16:9 until pressed (the artwork
 * carries the film's own laurels, so it is never cropped), then the player in
 * its place. The honours are typeset beside it as ruled rows a reader can go
 * through festival by festival. Same facts, a different job.
 *
 * The frame's reveal is scroll-driven, like every still on this page: a
 * `useTransform` value always resolves, so a missed trigger leaves a dim frame
 * rather than an absent one.
 */
export function AboutFilm() {
  const reducedMotion = usePrefersReducedMotion();
  const lenis = useLenis();
  const frameRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const { film, credits } = aboutFilm;
  const { honours } = film;

  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ['start end', 'end start'],
  });
  const frameOpacity = useTransform(scrollYProgress, [0, 0.3], [0.3, 1]);

  /* The chapter's one gold action starts the film in the frame and brings
     the frame to the top of the screen. */
  const watch = () => {
    setPlaying(true);
    if (frameRef.current) scrollToElement(frameRef.current, lenis);
  };

  return (
    <section
      id="about-film"
      aria-labelledby="about-film-heading"
      className="scroll-mt-24 bg-[#0F1C2E] py-24 md:py-32 lg:py-40"
    >
      <div className="px-5 md:px-8 lg:px-14 xl:pl-52">
        <ChapterMark
          number={chapterNumber('about-film')}
          title="The film"
          still={reducedMotion}
        />

        <div className="mt-8 grid grid-cols-1 gap-y-8 lg:grid-cols-12 lg:gap-x-12">
          <div className="lg:col-span-7">
            <DisplayHeading
              id="about-film-heading"
              lines={aboutFilm.heading}
              still={reducedMotion}
            />
          </div>

          <motion.p
            className="max-w-[44ch] text-[1rem] leading-[1.8] text-white/[0.6] lg:col-span-4 lg:col-start-9 lg:pt-3"
            variants={rise}
            custom={{ delay: 0.18, still: reducedMotion }}
            initial="hidden"
            whileInView="visible"
            viewport={ENTER}
          >
            {aboutFilm.intro}
          </motion.p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-y-14 lg:mt-24 lg:grid-cols-12 lg:gap-x-12">
          {/* The film, at its own proportion. */}
          <div className="lg:col-span-7">
            <motion.div
              ref={frameRef}
              style={reducedMotion ? undefined : { opacity: frameOpacity }}
            >
              <YouTubeEmbed
                videoId={film.watch.youtubeId}
                title={`${film.title} (${film.year})`}
                poster={film.poster}
                posterAlt={film.posterAlt}
                playing={playing}
                onPlay={() => setPlaying(true)}
                className="rounded-[2px] border border-white/[0.08]"
                sizes="(min-width: 1024px) 58vw, 100vw"
              />
            </motion.div>

            <motion.p
              className="mt-4 font-mono text-[0.6875rem] tracking-[0.18em] text-white/35 uppercase"
              variants={rise}
              custom={{ still: reducedMotion }}
              initial="hidden"
              whileInView="visible"
              viewport={ENTER}
            >
              {film.kind} · {film.language}
            </motion.p>

            {/* One paragraph of framing, set under the frame so the right-hand
                column can be nothing but the record. */}
            <motion.div
              className="mt-10 max-w-[58ch]"
              initial="hidden"
              whileInView="visible"
              viewport={ENTER}
            >
              {aboutFilm.body.map((paragraph, index) => (
                <motion.p
                  key={paragraph.slice(0, 32)}
                  className={
                    index === 0
                      ? 'text-[1.125rem] leading-[1.7] font-light text-white/[0.9] md:text-[1.25rem]'
                      : 'mt-6 text-[1rem] leading-[1.85] text-white/[0.66] md:text-[1.0625rem]'
                  }
                  variants={rise}
                  custom={{ delay: index * 0.08, still: reducedMotion }}
                >
                  {paragraph}
                </motion.p>
              ))}
            </motion.div>
          </div>

          {/* The record: title, credits, honours, and the way to the film. */}
          <div className="lg:col-span-4 lg:col-start-9">
            <motion.div initial="hidden" whileInView="visible" viewport={ENTER}>
              <motion.p
                className="font-mono text-[0.6875rem] tracking-[0.32em] text-[#BFA76F] uppercase"
                variants={rise}
                custom={{ still: reducedMotion }}
              >
                Original film · {film.year}
              </motion.p>

              <motion.h3
                className="mt-4 text-[clamp(2.5rem,8vw,3.25rem)] leading-[0.95] font-light tracking-[-0.035em] text-white lg:text-[clamp(3rem,3.8vw,4.25rem)]"
                variants={rise}
                custom={{ delay: 0.06, still: reducedMotion }}
              >
                {film.title}
              </motion.h3>
            </motion.div>

            <motion.dl
              className="mt-10 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-white/[0.12] pt-7"
              variants={rise}
              custom={{ delay: 0.12, still: reducedMotion }}
              initial="hidden"
              whileInView="visible"
              viewport={ENTER}
            >
              {credits.map((credit) => (
                <div key={credit.label}>
                  <dt className="font-mono text-[0.625rem] tracking-[0.3em] text-white/35 uppercase">
                    {credit.label}
                  </dt>
                  <dd className="mt-2.5 text-[0.9375rem] leading-[1.5] text-white/85">
                    {credit.value}
                  </dd>
                </div>
              ))}
            </motion.dl>

            {/* Honours, as ruled rows. Festival on the left in the page's
                body colour, the honour on the right in gold mono — the award
                is the fact a reader scans for. */}
            <motion.ol
              className="mt-12"
              aria-label="Festival honours"
              variants={cascade}
              initial="hidden"
              whileInView="visible"
              viewport={ENTER_TALL}
            >
              {honours.map((honour, index) => (
                <motion.li
                  key={`${honour.festival}-${honour.honour}`}
                  className="group"
                  variants={rise}
                  custom={{ still: reducedMotion }}
                >
                  <motion.div
                    aria-hidden="true"
                    className="h-px origin-left bg-white/[0.12] transition-colors duration-700 ease-out group-hover:bg-[#BFA76F]/50"
                    variants={drawRule}
                    custom={{ still: reducedMotion }}
                  />
                  <div className="flex items-baseline justify-between gap-6 py-4">
                    <span className="text-[0.9375rem] leading-[1.5] text-white/[0.78]">
                      {honour.festival}
                    </span>
                    <span className="shrink-0 text-right font-mono text-[0.625rem] tracking-[0.22em] text-[#BFA76F] uppercase">
                      {honour.honour}
                    </span>
                  </div>
                  {index === honours.length - 1 && (
                    <motion.div
                      aria-hidden="true"
                      className="h-px origin-left bg-white/[0.12]"
                      variants={drawRule}
                      custom={{ still: reducedMotion }}
                    />
                  )}
                </motion.li>
              ))}
            </motion.ol>

            <motion.div
              className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5"
              variants={rise}
              custom={{ delay: 0.1, still: reducedMotion }}
              initial="hidden"
              whileInView="visible"
              viewport={ENTER}
            >
              {/* The one gold action in this viewport. */}
              <Button
                type="button"
                onClick={watch}
                variant="accent"
                className="focus-visible:outline-[#BFA76F]"
              >
                {film.watch.label}
                <span aria-hidden="true" className="text-[0.625rem]">
                  ▶
                </span>
              </Button>

              <Link
                href={film.caseStudy.href}
                className="group inline-flex items-center gap-2.5 text-[0.6875rem] font-semibold tracking-[0.24em] text-white/60 uppercase transition-colors duration-500 ease-out hover:text-[#BFA76F] focus-visible:text-[#BFA76F] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#BFA76F]"
              >
                {film.caseStudy.label}
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-500 ease-out group-hover:translate-x-1.5"
                >
                  →
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
