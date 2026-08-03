'use client';

import { forwardRef } from 'react';

import { IRIS, bladeAngle, bladePath } from '@/lib/aperture';
import { cn } from '@/lib/utils';

const BLADES = Array.from({ length: IRIS.blades }, (_, index) => index);
const PATH = bladePath();
const SIZE = IRIS.viewBox * 2;

/**
 * A mechanical iris drawn as real overlapping blades.
 *
 * Nothing here scales — every blade is a rigid shape that only ever rotates
 * about its own pivot, exactly like the leaves in a lens. The opening is the
 * hole left where no blade covers, so it forms the curved nine-sided shape a
 * cinema iris actually produces, and the blade edges stay visible as they
 * stack over one another.
 *
 * The caller animates `.iris-blade` elements' rotation; see `IntroExperience`.
 * Blade rotation runs from 0 (open) to `CLOSE_ANGLE_OVERSHOOT` (sealed).
 *
 * The SVG is a square of 160vmax so the disc always covers the viewport,
 * whatever its aspect ratio.
 */
export const ApertureIris = forwardRef<SVGSVGElement, { className?: string }>(
  function ApertureIris({ className }, ref) {
    return (
      <svg
        ref={ref}
        viewBox={`${-IRIS.viewBox} ${-IRIS.viewBox} ${SIZE} ${SIZE}`}
        className={cn(
          'pointer-events-none absolute top-1/2 left-1/2 h-[160vmax] w-[160vmax]',
          '-translate-x-1/2 -translate-y-1/2',
          // The base layer caps svg at max-width:100%, which would squash this
          // to the viewport width and shrink the disc below the frame diagonal,
          // leaving the corners uncovered when the iris is shut.
          'max-w-none',
          className,
        )}
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          {/* Trims the oversized blade bodies back to the iris disc. */}
          <clipPath id="iris-disc">
            <circle cx="0" cy="0" r={IRIS.clipRadius} />
          </clipPath>

          {/* Brushed-metal sheen across the blades. */}
          <linearGradient id="iris-blade-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#12202f" />
            <stop offset="55%" stopColor="#0a131f" />
            <stop offset="100%" stopColor="#060d16" />
          </linearGradient>
        </defs>

        <g clipPath="url(#iris-disc)">
          {BLADES.map((index) => (
            /* Outer group fixes the blade's seat on the pivot ring; the inner
               group is what rotates, so GSAP never fights the ring angle. */
            <g key={index} transform={`rotate(${bladeAngle(index)})`}>
              {/* Rotation and its pivot are set by GSAP via `svgOrigin`. At
                  rest the blade sits at 0°, which is the fully open position,
                  so the iris is invisible before the timeline runs. */}
              <g className="iris-blade">
                <path
                  d={PATH}
                  fillRule="evenodd"
                  fill="url(#iris-blade-fill)"
                  /* A machined edge catching a little light. Kept very low:
                     each cutting edge is a huge arc, so a stronger stroke draws
                     long lines right across the frame. */
                  stroke="#BFA76F"
                  strokeOpacity={0.09}
                  strokeWidth={0.5}
                  /* Alternating opacity separates the stacked leaves without
                     letting the background bleed through. */
                  opacity={index % 2 === 0 ? 1 : 0.97}
                />
              </g>
            </g>
          ))}
        </g>
      </svg>
    );
  },
);
