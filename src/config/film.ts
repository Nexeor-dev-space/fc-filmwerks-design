/**
 * Blue Lily (2026) — the studio's award-winning original short film.
 *
 * One record, read by the homepage's Original Cinema section, the About page's
 * film chapter and the Record chapter's figures, so the title, honours and
 * links cannot drift between them.
 *
 * PROVENANCE: the honours are read off the film's own key art, which prints
 * eight laurels — four official selections and four awards. The Calgary
 * Independent Film Festival is not on the artwork but is named in the studio's
 * own copy, so it is listed as an official selection, the minimum the studio's
 * wording ("recognised at") supports. Replace this list with the official
 * laurel set when the studio supplies one.
 */

export interface FilmHonour {
  festival: string;
  honour: string;
}

export const blueLily = {
  title: 'Blue Lily',
  year: '2026',
  kind: 'Original short film',
  language: 'Malayalam',
  director: 'Gautam Raveendran',
  producer: 'Mini Nair',
  screenings: 'Theatrically in Kochi and Dubai',
  /** One sentence, for cards and standfirsts. */
  logline:
    'The studio’s award-winning original short film, recognised at five international festivals and screened theatrically in Kochi and Dubai.',
  honours: [
    {
      festival: 'The Buddha International Film Festival',
      honour: 'Best Director',
    },
    {
      festival: 'The Buddha International Film Festival',
      honour: 'Best Actress',
    },
    { festival: 'IFA Film Festival Abu Dhabi', honour: 'Special Jury Award' },
    { festival: 'IIFF', honour: 'Special Jury Award' },
    {
      festival: 'MEI International Film Festival',
      honour: 'Official Selection',
    },
    {
      festival: 'Calgary Independent Film Festival',
      honour: 'Official Selection',
    },
  ] satisfies FilmHonour[],
  /** The film's key art. Swap for a clean 16:9 still when the studio has one. */
  poster: '/images/works/Blue-Lily-Short-Film.jpg',
  posterAlt:
    'Blue Lily key art: a couple walking hand in hand along a beach, with the film’s festival laurels',
  watch: {
    label: 'Watch the film',
    youtubeId: 't8Jze5uBMr4',
    href: 'https://www.youtube.com/watch?v=t8Jze5uBMr4',
  },
  caseStudy: { label: 'Read the case study', href: '/portfolio/blue-lily' },
} as const;

/** Distinct festivals the film was recognised at — counted, never typed. */
export const blueLilyFestivalCount = new Set(
  blueLily.honours.map((honour) => honour.festival),
).size;

const NUMBER_WORDS = [
  'no',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
];

/** The same count as a word, for running prose ("five festivals"). */
export const blueLilyFestivalCountWord =
  NUMBER_WORDS[blueLilyFestivalCount] ?? String(blueLilyFestivalCount);

/** Awards proper: everything that is not an official selection. */
export const blueLilyAwardCount = blueLily.honours.filter(
  (honour) => honour.honour !== 'Official Selection',
).length;

/** The award count as a word, for running prose ("four awards"). */
export const blueLilyAwardCountWord =
  NUMBER_WORDS[blueLilyAwardCount] ?? String(blueLilyAwardCount);

/**
 * The honours folded by kind, for an overview: one row per honour with the
 * festivals it was won at, in the order the honours are listed. The About page
 * and the case study print the full list; the homepage prints this.
 */
export const blueLilyHonourGroups: { honour: string; festivals: string[] }[] =
  blueLily.honours.reduce<{ honour: string; festivals: string[] }[]>(
    (groups, { honour, festival }) => {
      const group = groups.find((entry) => entry.honour === honour);
      if (group) {
        if (!group.festivals.includes(festival)) group.festivals.push(festival);
      } else {
        groups.push({ honour, festivals: [festival] });
      }
      return groups;
    },
    [],
  );

/**
 * The honours as one line, for the homepage: each kind once, with a count
 * where it was won more than once — "Best Director · 2× Special Jury Award".
 */
export const blueLilyHonourSummary = blueLilyHonourGroups
  .map(({ honour, festivals }) =>
    festivals.length > 1 ? `${festivals.length}× ${honour}` : honour,
  )
  .join(' · ');
