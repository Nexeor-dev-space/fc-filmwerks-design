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
 * How large the iris SVG is rendered, in `vmax`.
 *
 * `ApertureIris` writes this into a Tailwind class, which cannot read a
 * constant, so the two have to be changed together — it is declared here
 * because `coveringOpening` needs it to convert screen pixels into viewBox
 * units.
 */
export const SCREEN_VMAX = 160;

/**
 * The opening radius at which the blades first reach the corners of the
 * screen — the widest the iris can be while still covering nothing.
 *
 * Above this the aperture is larger than the frame, so the blades sit outside
 * it and closing them changes nothing the reader can see. That is most of the
 * sweep: on a 16:9 screen the iris is invisible from 158 down to about 115,
 * roughly a quarter of the travel, and it was being given a quarter of the
 * tween's time. The visible part of the close was left with the remainder and
 * a `power2.inOut` ease that is slowest at both ends, so the frame went from
 * wide open to sealed in a couple of frames — the "hard cut" between the lens
 * and the hero. Starting the close here spends the whole tween on the part
 * that is actually on screen.
 */
export function coveringOpening(width: number, height: number): number {
  const unitsPerPixel =
    (IRIS.viewBox * 2) / ((SCREEN_VMAX * Math.max(width, height)) / 100);
  return Math.min(IRIS.radius, (Math.hypot(width, height) / 2) * unitsPerPixel);
}

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

/**
 * Swings every blade to produce the given opening radius.
 *
 * Writes the SVG `transform` attribute directly, in the `rotate(angle cx cy)`
 * form that rotates about a point natively, rather than going through GSAP.
 * GSAP's transform plugin keeps a per-element cache and, for SVG, bakes a
 * custom pivot into the matrix it writes; whenever something marks that
 * cache stale — a `revert()` during a ScrollTrigger refresh will — the next
 * write rebuilds the pivot relative to the blade's bounding box and then
 * treats it as absolute, which put it 450 units off and swung every blade
 * clear of the frame. The iris simply never appeared. One attribute per
 * blade per frame is also less work than instantiating a tween for each
 * tick, which is what `gsap.set` on every scrub update amounted to.
 *
 * `blades` are the `.iris-blade` groups of one `ApertureIris`.
 */
export function setIrisOpening(
  blades: ArrayLike<Element>,
  opening: number,
): void {
  const transform = `rotate(${rotationForOpening(opening)} ${PIVOT.x} ${PIVOT.y})`;
  for (let index = 0; index < blades.length; index++) {
    blades[index].setAttribute('transform', transform);
  }
}

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
