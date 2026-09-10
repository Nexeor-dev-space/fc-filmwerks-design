'use client';

import { useEffect, useState } from 'react';

/**
 * How much of the hero footage has to be buffered before the gate opens.
 *
 * Deliberately a few seconds rather than the whole file. The banner is a
 * 77-second clip and the browser streams it in byte ranges, so waiting for
 * the last byte would mean waiting minutes on a slow line for footage the
 * reader will never reach — the complaint that prompted this. What the reveal
 * actually needs is that the first frames are decoded and the buffer is far
 * enough ahead that playback does not stall the moment it starts.
 */
const REQUIRED_BUFFER_SECONDS = 3;

/**
 * The gate opens on its own after this, however little has arrived.
 *
 * A loading screen that can hold someone forever is worse than a hero that
 * starts on its poster frame, and a video is decoration here — nothing on the
 * page depends on it. On a slow connection the visitor gets in and the footage
 * fades up whenever it is ready.
 */
const MAX_WAIT_MS = 9000;

/**
 * The shortest the sequence is allowed to run.
 *
 * On a warm cache everything is ready in the first frame, and a ring that
 * flashes from nothing to gone reads as a glitch rather than as the studio
 * loading its opening shot. This gives it time to sweep once.
 */
const MIN_DURATION_MS = 900;

/** Weights, summing to 1 — the footage is most of the wait, and should be. */
const WEIGHT = { video: 0.7, images: 0.2, fonts: 0.1 } as const;

export interface IntroPreload {
  /** 0 to 1, eased and never decreasing. Reaches 1 only when `ready` does. */
  progress: number;
  /** The opening may start and the page may be scrolled. */
  ready: boolean;
}

/**
 * Watches the handful of assets the opening shot actually needs, and reports
 * how far along they are.
 *
 * Polls on a frame loop rather than wiring `progress`, `canplay`, `load` and
 * `decode` listeners across a set of elements that arrive at different times.
 * The loop runs for a second or two at the very start of a page view and stops
 * for good, which is cheaper than it sounds and far easier to reason about
 * than the listener soup — media events in particular are inconsistent about
 * whether they fire at all when a response is served from cache.
 *
 * The video is found by selector for the same reason the scroll timeline finds
 * it that way: it lives inside `IntroExperience`'s `children`, several
 * components below whoever needs to know about it, and threading a ref up
 * through the hero for this would put plumbing in three files to serve one.
 *
 * @param enabled False for a visitor who is skipping the intro — a repeat
 *   visit, or reduced motion — where there is nothing to wait for.
 */
export function useIntroPreload(enabled: boolean): IntroPreload {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(!enabled);

  useEffect(() => {
    if (!enabled) {
      setProgress(1);
      setReady(true);
      return;
    }

    const startedAt = performance.now();
    let frame = 0;
    let shown = 0;

    let fontsReady = false;
    const fonts = document.fonts;
    if (fonts) void fonts.ready.then(() => (fontsReady = true));
    else fontsReady = true;

    /** How much of the footage we have, and whether it is enough to play. */
    const footage = (): [share: number, done: boolean] => {
      const video =
        document.querySelector<HTMLVideoElement>('.hero-reveal video');

      /* No element yet on the first frames; if one never appears — a page
         without footage — stop holding the gate for it. */
      if (!video) return [0, performance.now() - startedAt > 1500];

      /* A source that failed is not worth waiting for. The poster frame and
         the fallback colour carry the hero, as they always have. */
      if (video.error) return [1, true];

      /* HAVE_ENOUGH_DATA: the browser believes it can play to the end. */
      if (video.readyState >= 4) return [1, true];

      const ranges = video.buffered;
      const buffered = ranges.length ? ranges.end(ranges.length - 1) : 0;
      const share = Math.min(1, buffered / REQUIRED_BUFFER_SECONDS);

      /* HAVE_FUTURE_DATA is the real bar: there is a current frame and enough
         beyond it to move. Held just short of full until the buffer target is
         met too, so the ring does not sit at 100% while the gate is shut. */
      if (video.readyState >= 3) {
        return [Math.max(share, 0.92), buffered >= REQUIRED_BUFFER_SECONDS];
      }
      return [share * 0.9, false];
    };

    /** The lens and the wordmark — the only artwork on screen right now. */
    const artwork = (): [share: number, done: boolean] => {
      const images = Array.from(
        document.querySelectorAll<HTMLImageElement>('.intro-layer img'),
      );
      if (images.length === 0) return [0, performance.now() - startedAt > 1500];
      const loaded = images.filter(
        (image) => image.complete && image.naturalWidth > 0,
      ).length;
      return [loaded / images.length, loaded === images.length];
    };

    const tick = () => {
      const elapsed = performance.now() - startedAt;
      const [videoShare, videoDone] = footage();
      const [imageShare, imagesDone] = artwork();

      const target =
        videoShare * WEIGHT.video +
        imageShare * WEIGHT.images +
        (fontsReady ? WEIGHT.fonts : 0);

      /* Eased rather than set outright: a byte-range response can land four
         seconds of video in one frame, and the ring jumping a third of the way
         round looks broken even though it is telling the truth. */
      shown += (target - shown) * 0.12;

      const done =
        (videoDone && imagesDone && fontsReady) || elapsed >= MAX_WAIT_MS;

      if (done && elapsed >= MIN_DURATION_MS) {
        shown += (1 - shown) * 0.25;
        if (shown > 0.995) {
          setProgress(1);
          setReady(true);
          return;
        }
      }

      setProgress(shown);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [enabled]);

  return { progress, ready };
}
