/**
 * The horizontal gutter every section of a case study shares.
 *
 * One constant rather than the same four utilities copied into six files: the
 * page reads as a single document only if every band starts its type on the
 * same vertical, and the `xl` step is load-bearing beyond taste — it is the
 * column the fixed chapter rail sits in. A section that forgets it has the rail
 * lying over its first words at exactly one breakpoint, which is the kind of
 * thing that ships. See `ChapterRail`.
 */
export const PROJECT_GUTTER = 'px-5 md:px-8 lg:px-14 xl:pr-14 xl:pl-52';

/**
 * The vertical rhythm between bands.
 *
 * Every full section of the page uses this and nothing else, so the distance
 * from one band of content to the next is the same the whole way down. Bands
 * that need to read as continuous with their neighbour — a gallery under its
 * own story, say — drop one side of it explicitly rather than inventing a new
 * value.
 */
export const PROJECT_BAND = 'py-24 md:py-32 lg:py-40';
