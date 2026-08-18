'use client';

import { useEffect, useRef } from 'react';

import { usePrefersReducedMotion } from '@/hooks';
import { cn } from '@/lib/utils';

interface BackgroundVideoProps {
  src: string;
  /** Frame shown before the video decodes, and instead of it on reduced motion. */
  poster?: string;
  /** Colour behind the video, visible until the first frame paints. */
  fallbackClassName?: string;
  /** Any CSS `background` value laid over the footage. Pass null for none. */
  overlay?: string | null;
  /** Darkens the corners so the frame reads as a lit shot rather than a fill. */
  vignette?: boolean;
  /**
   * Whether the video should be decoding/playing right now. Defaults to
   * true. Pass false while the element is mounted but not yet visible (e.g.
   * behind `IntroExperience`'s aperture) — a hidden autoplaying video still
   * costs a full decode+composite pass every frame, and on mobile that
   * competes directly with whatever scroll animation is covering it.
   */
  active?: boolean;
  className?: string;
}

const DEFAULT_OVERLAY =
  'linear-gradient(rgba(15,28,46,0.62), rgba(15,28,46,0.55))';

const VIGNETTE =
  'radial-gradient(120% 90% at 50% 45%, transparent 45%, rgba(10,19,31,0.55) 100%)';

/**
 * Muted, looping video used as a section background.
 *
 * Two things this handles that a bare `<video>` does not: it holds the first
 * frame rather than playing when the visitor prefers reduced motion, and it
 * lays a scrim over the footage so foreground text keeps its contrast against
 * whatever happens to be on screen at that moment.
 *
 * `playsInline` is what stops iOS taking the video fullscreen on play.
 */
export function BackgroundVideo({
  src,
  poster,
  fallbackClassName = 'bg-navy',
  overlay = DEFAULT_OVERLAY,
  vignette = true,
  active = true,
  className,
}: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (reduced || !active) {
      video.pause();
      return;
    }

    // Autoplay can still be refused (low power mode, for one); the poster and
    // fallback colour carry the section when it is.
    void video.play().catch(() => undefined);
  }, [reduced, active]);

  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden',
        fallbackClassName,
        className,
      )}
    >
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        autoPlay={!reduced}
        tabIndex={-1}
      />

      {overlay && (
        <div className="absolute inset-0" style={{ background: overlay }} />
      )}

      {vignette && (
        <div className="absolute inset-0" style={{ background: VIGNETTE }} />
      )}
    </div>
  );
}
