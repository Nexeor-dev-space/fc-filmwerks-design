/**
 * Geometry for a mechanical iris — the kind found in a cinema lens, not a
 * scaling circle.
 *
 * Each blade is modelled the way a real one behaves: a rigid leaf that pivots
 * about a fixed post on a ring, with a curved cutting edge that swings across
 * the opening. The aperture is not drawn at all — it is the hole left where no
 * blade covers, which is what gives the opening its characteristic curved
 * polygon shape and its slightly irregular closing motion.
 *
 * ── The maths ─────────────────────────────────────────────────────────────
 *
 * Blade k pivots at `P` on a circle of radius `RADIUS`. Its cutting edge is an
 * arc of radius `CUT_R` whose centre `C` sits at distance `CUT_R` from the
 * pivot. The blade covers everything *except* the inside of that arc, so the
 * opening is the intersection of all N cutting circles.
 *
 * With `ψ` the angle of `C` about the pivot (measured from the outward radial
 * direction):
 *
 *     |OC|² = R² + 2·R·CUT_R·cos ψ + CUT_R²
 *     opening radius = CUT_R − |OC|
 *
 * At ψ = 180° the centres collapse inward and the opening equals `RADIUS` —
 * fully open. The opening reaches zero when `CUT_R = |OC|`, which solves to
 *
 *     cos ψ = −R / (2·CUT_R)
 *
 * That angle is `CLOSE_ANGLE` below. Because `CUT_R > RADIUS`, the whole sweep
 * is around 68° — the same order as a real iris, which is why the motion reads
 * as mechanical rather than as a shrinking mask.
 */

export const IRIS = {
  /** Odd blade count, as on most cinema primes — it makes nicer sunstars. */
  blades: 9,
  /** viewBox spans −160…160; the SVG is sized so this always covers the page. */
  viewBox: 160,
  /** Pivot ring radius, which is also the opening radius when fully open. */
  radius: 158,
  /**
   * Where the blades are trimmed. Deliberately smaller than `radius`: when the
   * iris is wide open the cutting edges sit exactly on `radius`, and half of
   * their stroke width would otherwise show as hairline arcs across a frame
   * that is meant to be empty. It still has to exceed the viewport
   * half-diagonal — 141.5 units in the squarest case — to seal the frame.
   */
  clipRadius: 150,
  /** Cutting-arc radius as a multiple of `radius`. Must exceed 1 to open fully. */
  cutRatio: 1.35,
  /** Blade body radius — big enough to cover the disc at any rotation. */
  outer: 450,
} as const;

export const CUT_R = IRIS.radius * IRIS.cutRatio;

/**
 * Blade rotation, in degrees, that first brings the opening to zero.
 * Negative: the blades swing inward from the open position at 0.
 */
export const CLOSE_ANGLE =
  (Math.acos(-IRIS.radius / (2 * CUT_R)) * 180) / Math.PI - 180;

/**
 * Opening radius to animate *to* when sealing. Slightly negative so the blades
 * bite into one another; stopping at exactly zero can leave an anti-aliased
 * pinhole at the centre.
 */
export const SEALED_OPENING = -12;

/**
 * Blade rotation, in degrees, that produces a given opening radius — the
 * inverse of `openingRadius`.
 *
 * Animate this rather than the rotation angle. Opening radius is a cosine
 * function of blade angle, so rotating at a constant rate spends most of the
 * sweep barely changing the aperture and then slams shut at the end. Driving
 * the radius instead makes the closing read evenly, and lets the easing curve
 * actually govern how the iris feels.
 */
export function rotationForOpening(opening: number): number {
  const oc = CUT_R - opening;
  const cosPsi =
    (oc * oc - IRIS.radius ** 2 - CUT_R ** 2) / (2 * IRIS.radius * CUT_R);
  // Guard against the domain edges before acos returns NaN.
  const clamped = Math.min(1, Math.max(-1, cosPsi));
  return (Math.acos(clamped) * 180) / Math.PI - 180;
}

/** Pivot position for the reference blade, before its ring rotation. */
export const PIVOT = { x: IRIS.radius, y: 0 } as const;

/** `svgOrigin` string GSAP needs to rotate a blade about its pivot. */
export const PIVOT_ORIGIN = `${PIVOT.x} ${PIVOT.y}`;

/**
 * The reference blade, drawn fully open.
 *
 * A disc of radius `outer` with the cutting circle punched out of it — with
 * `fill-rule="evenodd"` that yields "everything except the opening". Rotating
 * this about the pivot swings the cutting edge across the frame, and because
 * the body is so much larger than the iris disc it keeps covering the frame at
 * every angle. Clip the result to a disc of `radius` to trim the excess.
 */
export function bladePath(): string {
  const { outer } = IRIS;
  // Cutting-arc centre at ψ = 180° — pulled back toward the middle.
  const cx = IRIS.radius - CUT_R;

  return [
    // Blade body.
    `M ${-outer} 0`,
    `A ${outer} ${outer} 0 1 0 ${outer} 0`,
    `A ${outer} ${outer} 0 1 0 ${-outer} 0`,
    'Z',
    // Cutting edge, punched out.
    `M ${cx - CUT_R} 0`,
    `A ${CUT_R} ${CUT_R} 0 1 0 ${cx + CUT_R} 0`,
    `A ${CUT_R} ${CUT_R} 0 1 0 ${cx - CUT_R} 0`,
    'Z',
  ].join(' ');
}

/** Ring angle for blade `index`, in degrees. */
export function bladeAngle(index: number): number {
  return (index * 360) / IRIS.blades;
}

/** Opening radius, in viewBox units, for a given blade rotation in degrees. */
export function openingRadius(rotation: number): number {
  const psi = ((rotation + 180) * Math.PI) / 180;
  const oc = Math.sqrt(
    IRIS.radius ** 2 + 2 * IRIS.radius * CUT_R * Math.cos(psi) + CUT_R ** 2,
  );
  return Math.max(0, CUT_R - oc);
}
