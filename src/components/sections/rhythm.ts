/**
 * The homepage's vertical and horizontal rhythm, in one place.
 *
 * Every band between the hero and the footer uses these and nothing else, so
 * the distance from one section to the next is the same the whole way down and
 * every heading starts on the same vertical. They were already identical
 * strings copied into six files, which is exactly the arrangement that drifts
 * the first time a section is added in a hurry — the label band arrived with
 * `py-20 md:py-28` and nobody would have noticed for months.
 *
 * `xl:pl-52` is load-bearing beyond taste: it is the column the fixed chapter
 * rail sits in. A section that forgets it has the rail lying over its first
 * words at exactly one breakpoint. See `ChapterRail`.
 *
 * The closing call to action deliberately does NOT use these. It is the end of
 * the page rather than another band in the run, and its larger padding is what
 * gives the footer its approach. See `CtaSection`.
 */
export const SECTION_BAND = 'pt-16 pb-20 md:pt-20 md:pb-24 lg:pt-24 lg:pb-28';

export const SECTION_GUTTER = 'w-full px-4 md:px-[3vw] xl:pl-52';
