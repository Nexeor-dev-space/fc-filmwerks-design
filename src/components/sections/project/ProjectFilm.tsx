'use client';

import { motion } from 'framer-motion';

import { ENTER, rise } from '@/components/animations';
import { YouTubeEmbed } from '@/components/ui';
import type { Project } from '@/config/projects';
import { usePrefersReducedMotion } from '@/hooks';

/**
 * The film itself, for work the studio has published.
 *
 * Sits directly under the hero, before the overview: someone who has arrived
 * at a film's page wants to watch it before they read about it, and a case
 * study that makes them scroll past four chapters to find the play button has
 * its priorities backwards. The frame is the project's own key art until it is
 * pressed, then the player in its place — nothing is loaded from YouTube until
 * then.
 *
 * Rendered only where `project.video` exists; the page skips its mid-story
 * frame on those projects, because the film is the visual middle.
 */
export function ProjectFilm({ project }: { project: Project }) {
  const reducedMotion = usePrefersReducedMotion();
  const { video } = project;

  if (!video) return null;

  return (
    <section
      id="project-film"
      aria-labelledby="project-film-heading"
      className="scroll-mt-24 bg-[#0A131F] pt-20 md:pt-28 lg:pt-32"
    >
      <div className="px-5 md:px-8 lg:px-14">
        <motion.div
          className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3"
          variants={rise}
          custom={{ still: reducedMotion }}
          initial="hidden"
          whileInView="visible"
          viewport={ENTER}
        >
          <h2
            id="project-film-heading"
            className="text-[0.6875rem] font-semibold tracking-[0.3em] text-[#BFA76F] uppercase"
          >
            The film
          </h2>

          {typeof video === 'string' ? (
            <video
              src={video}
              aria-label={`${project.title} video`}
              className="h-full w-full object-cover"
              autoPlay
              muted
              playsInline
              preload="auto"
              loop
            />
          ) : (
            <>
              <a
                href={video.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 font-mono text-[0.6875rem] tracking-[0.24em] text-white/45 uppercase transition-colors duration-500 ease-out hover:text-[#BFA76F] focus-visible:text-[#BFA76F] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#BFA76F]"
              >
                Open on YouTube
                <span aria-hidden="true">↗</span>
              </a>
              <YouTubeEmbed
                videoId={video.youtubeId}
                title={project.title}
                poster={project.image}
                posterAlt=""
                className="rounded-[2px] border border-white/[0.08]"
                sizes="100vw"
              />
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
