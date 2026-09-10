'use client';

import { cn } from '@/lib/utils';

/** Radius of the ring in the 100-unit viewBox; the rest is drawn around it. */
const RADIUS = 47;
const CIRCUMFERENCE = Math.round(2 * Math.PI * RADIUS * 1000) / 1000;

/** Twelve marks, as on the distance scale engraved around a lens barrel. */
const TICKS = Array.from({ length: 12 }, (_, index) => index * 30);

/**
 * The marks are near-black rather than gold.
 *
 * Gold is the brand's accent everywhere else, but the intro's ground *is*
 * gold, and gold on gold is invisible — see `docs/brand.md`, which allows the
 * accent to carry a line only on a dark surface. This is the same near-black
 * the scroll cue uses on this ground, so the ring and the cue below it read as
 * one set of markings on one barrel.
 */
const INK = '#222';

/**
 * Rounded, and that is load-bearing rather than tidiness.
 *
 * The precision of `Math.sin` and `Math.cos` is implementation-defined, and
 * Node and the browser disagree in the last couple of bits — enough that the
 * server rendered `y1="6.698729810778076"` where the client wanted
 * `6.698729810778083`, and React reported a hydration mismatch on every load.
 * Three decimals is far finer than a device pixel at any size this is drawn
 * and leaves nothing for the two to disagree about.
 */
const fixed = (value: number) => Math.round(value * 1000) / 1000;

function tickPoints(degrees: number) {
  const radians = ((degrees - 90) * Math.PI) / 180;
  const [cos, sin] = [Math.cos(radians), Math.sin(radians)];
  return {
    x1: fixed(50 + cos * (RADIUS + 3)),
    y1: fixed(50 + sin * (RADIUS + 3)),
    x2: fixed(50 + cos * (RADIUS + 6)),
    y2: fixed(50 + sin * (RADIUS + 6)),
  };
}

interface LensProgressRingProps {
  /** 0 to 1. */
  progress: number;
  /** False once loading is done, which fades the whole ring away. */
  active: boolean;
  className?: string;
}

/**
 * A focus ring around the lens that fills as the page loads.
 *
 * The metaphor is the point: a cinema lens has a scale engraved around its
 * barrel and an index mark to read it against, so a filled arc and a set of
 * ticks is a progress bar this particular object would actually have. It sits
 * outside `.lens-tilt` and `.lens-spin` in the tree, so the barrel turns and
 * drifts inside a ring that stays put — which is how a real one behaves, and
 * it keeps two writers off one transform.
 *
 * Sizing comes from the wrapper, which takes its own size from the lens: CSS
 * transforms do not affect layout, so the idle animations inside cannot change
 * the box this is measured against.
 *
 * `non-scaling-stroke` keeps every line the same weight in device pixels
 * whatever the lens measures, from 180px on a phone to 450px on a desktop.
 * Without it the same value renders as a hairline on one and a band on the
 * other.
 */
export function LensProgressRing({
  progress,
  active,
  className,
}: LensProgressRingProps) {
  const swept = progress * 360;
  /* Nothing has been measured yet — this is the pre-hydration state. */
  const seeking = progress <= 0;

  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-[-9%] h-auto w-auto',
        'transition-opacity duration-700 ease-out',
        active ? 'opacity-100' : 'opacity-0',
        className,
      )}
    >
      {/* The engraved channel the scale runs in. */}
      <circle
        cx="50"
        cy="50"
        r={RADIUS}
        fill="none"
        stroke={INK}
        strokeOpacity={0.14}
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />

      {TICKS.map((degrees) => {
        const { x1, y1, x2, y2 } = tickPoints(degrees);
        return (
          <line
            key={degrees}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={INK}
            /* A mark the sweep has passed is cut deeper. */
            strokeOpacity={swept >= degrees ? 0.55 : 0.16}
            strokeWidth={1}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            className="transition-[stroke-opacity] duration-300 ease-out"
          />
        );
      })}

      {/* The index mark: the fixed line the scale is read against, at the top
          of the barrel where the reader is already looking. */}
      <line
        x1="50"
        y1={50 - RADIUS - 8}
        x2="50"
        y2={50 - RADIUS - 3.5}
        stroke={INK}
        strokeOpacity={0.7}
        strokeWidth={1.5}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />

      {/*
       * Before the first real reading, a short arc hunting round the barrel
       * the way a lens hunts for focus.
       *
       * This is the server-rendered state, and it is on screen for as long as
       * it takes the bundle to arrive and hydrate — measured at three seconds
       * on a cold cache over a slow line. A determinate ring frozen at zero
       * for three seconds reads as a page that has hung; a seeking one reads
       * as a page that is working, which is the truth.
       *
       * A separate element from the determinate sweep rather than the same
       * one animated two ways, so CSS owns `transform` here and React owns
       * `stroke-dashoffset` there, and neither can overwrite the other.
       */}
      {seeking ? (
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          stroke={INK}
          strokeOpacity={0.7}
          strokeWidth={2}
          strokeLinecap="round"
          strokeDasharray={`${fixed(CIRCUMFERENCE * 0.16)} ${CIRCUMFERENCE}`}
          vectorEffect="non-scaling-stroke"
          className="lens-ring-seek"
        />
      ) : (
        /* The sweep itself, from the index mark clockwise. */
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          stroke={INK}
          strokeWidth={2}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={fixed(CIRCUMFERENCE * (1 - Math.min(1, progress)))}
          transform="rotate(-90 50 50)"
          vectorEffect="non-scaling-stroke"
        />
      )}
    </svg>
  );
}
