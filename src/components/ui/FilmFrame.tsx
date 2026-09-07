'use client';

import Image from 'next/image';
import { useState } from 'react';

import { cn } from '@/lib/utils';

/** Fine film grain, the texture shared by every cinematic surface on the site. */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

/**
 * Where the film actually lives.
 *
 * Two studios' worth of work arrives two ways: the original films are published
 * on YouTube, and the commercial work is delivered as files the studio hosts
 * itself. Both are films someone came to watch, so both get the same frame and
 * the same press-to-play behaviour, and only the element inside changes.
 */
export type FilmSource = { youtubeId: string } | { src: string };

export interface FilmFrameProps {
  source: FilmSource;
  /** Accessible name for the player and the play control. */
  title: string;
  /** Local still shown until the visitor presses play. */
  poster: string;
  posterAlt: string;
  /**
   * Controlled play state, for a section that wants a button elsewhere to
   * start the film. Leave undefined and the frame manages itself.
   */
  playing?: boolean;
  onPlay?: () => void;
  /** Frame chrome — radius, border — set by the section, not here. */
  className?: string;
  /** `sizes` for the poster image, matched to the frame's column. */
  sizes?: string;
  /**
   * The frame's shape. Vertical films get a 9:16 plate rather than being
   * letterboxed inside a 16:9 one — an iframe cannot be `object-fit`, so a
   * wide frame around a tall film is black bars YouTube draws and nothing
   * here can trim.
   */
  orientation?: 'landscape' | 'portrait';
}

/**
 * A film behind a poster.
 *
 * Nothing is loaded until the visitor presses play. For YouTube that is the
 * difference between a page with a film on it and a page that pays for a
 * third-party player, its scripts and its cookies on every visit — three of
 * these on the homepage would cost more than the rest of the page combined.
 * For a hosted file it matters more still: these run to tens of megabytes, and
 * `preload="none"` means a visitor who never presses play never pays for one.
 * Until then the frame is the studio's own still, under the same grain as every
 * other frame on the site, with one play mark and nothing else.
 *
 * On play the player replaces the poster in place and starts immediately, so a
 * single press starts the film rather than revealing a second play button.
 * YouTube uses the privacy-enhanced host, so no tracking cookie is set.
 *
 * Hosted files play with sound and with the browser's own controls. They are
 * not the muted, chromeless loops the same files serve as elsewhere on the
 * site: this is the film, and a film the visitor asked for should behave like
 * one.
 */
export function FilmFrame({
  source,
  title,
  poster,
  posterAlt,
  playing,
  onPlay,
  className,
  sizes = '100vw',
  orientation = 'landscape',
}: FilmFrameProps) {
  const [internal, setInternal] = useState(false);
  const isPlaying = playing ?? internal;

  const play = () => {
    setInternal(true);
    onPlay?.();
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-[#0A131F]',
        orientation === 'portrait' ? 'aspect-[9/16]' : 'aspect-video',
        className,
      )}
    >
      {isPlaying ? (
        'youtubeId' in source ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${source.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
            title={title}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <video
            src={source.src}
            title={title}
            poster={poster}
            className="absolute inset-0 h-full w-full bg-black object-contain"
            controls
            autoPlay
            playsInline
            preload="none"
          />
        )
      ) : (
        <button
          type="button"
          onClick={play}
          aria-label={`Play ${title}`}
          data-cursor="play"
          className="group absolute inset-0 block h-full w-full cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#BFA76F]"
        >
          <div className="absolute inset-0 transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04] group-focus-visible:scale-[1.04]">
            <Image
              src={poster}
              alt={posterAlt}
              fill
              loading="lazy"
              sizes={sizes}
              className="object-cover"
            />
          </div>

          {/* Light scrim so the play mark seats whatever the still is doing
              behind it, deepened slightly on hover. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[#0A131F]/20 transition-colors duration-[600ms] ease-out group-hover:bg-[#0A131F]/35"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.1] mix-blend-overlay"
            style={{ backgroundImage: GRAIN }}
          />

          {/* Play mark. A ring and a triangle, nothing else — the still
              already carries the title. */}
          <span
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="flex h-20 w-20 items-center justify-center rounded-full border border-white/60 bg-[#0A131F]/40 backdrop-blur-sm transition-[transform,border-color,background-color] duration-[600ms] ease-out group-hover:scale-110 group-hover:border-[#BFA76F] group-hover:bg-[#0A131F]/60 md:h-24 md:w-24">
              <span className="ml-1 block h-0 w-0 border-y-[10px] border-l-[16px] border-y-transparent border-l-white transition-colors duration-[600ms] ease-out group-hover:border-l-[#BFA76F] md:border-y-[12px] md:border-l-[20px]" />
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
