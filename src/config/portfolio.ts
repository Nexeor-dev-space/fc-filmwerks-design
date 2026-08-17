import { projects } from './projects';

/**
 * Copy and structure for the Portfolio page.
 *
 * The projects themselves stay in `projects.ts` — that file is the single
 * source of truth for the work, and the homepage reads it too. What lives here
 * is everything the *archive* needs and the homepage does not: the masthead
 * copy, the filter labels, the production gallery and the closing statement.
 *
 * Nothing here invents a claim about the studio. The statement is written for
 * this layout from the studio's own positioning; the counts are computed from
 * the work rather than typed in, so they cannot drift from the data.
 */

/* -------------------------------------------------------------------------- */
/* Masthead                                                                   */
/* -------------------------------------------------------------------------- */

export const portfolioMasthead = {
  /** Mono slug line, set above the rule. */
  slug: 'fcfilmwerks — archive',
  /** Rendered one line per entry, each masked and revealed in turn. */
  headline: ['The work,', 'frame', 'by frame.'],
  standfirst:
    'Events, adverts and social campaigns for brands across Dubai and India — every one of them scripted, shot and finished in-house.',
  /** Reading instruction for the filter rail below. */
  hint: 'Filter the archive, or scroll it end to end.',
} as const;

/* -------------------------------------------------------------------------- */
/* Filters                                                                    */
/* -------------------------------------------------------------------------- */

export interface PortfolioFilter {
  /** Matches `Project.category`, or `All` for the unfiltered set. */
  value: string;
  /** What the control reads from tablet up — plural, as a section of an archive. */
  label: string;
  /**
   * The phone label. Four full-length labels cannot fit across a 375px screen,
   * and the rail is sticky, so wrapping them onto a second line would cost a
   * permanent band of the viewport. These are short enough that the whole set
   * fits without scrolling on all but the narrowest handsets.
   */
  short: string;
  count: number;
}

/**
 * Display names for the categories the work carries — long, then phone-sized.
 *
 * A category with no entry here falls back to its raw value at both sizes, so
 * adding a project in a new discipline still produces a working filter; it just
 * reads in the singular until a label is added.
 */
const FILTER_LABELS: Record<string, { label: string; short: string }> = {
  Event: { label: 'Events', short: 'Events' },
  Advert: { label: 'Advertisements', short: 'Adverts' },
  'Social Media': { label: 'Social Media', short: 'Social' },
};

/**
 * Filters, derived from the work rather than written out.
 *
 * This is deliberate: a hand-written list can offer a discipline the archive
 * has no projects in, and a filter that returns an empty grid is worse than no
 * filter at all. Corporate and Photography are studio *services* — they appear
 * on the Services page — but no project in `projects.ts` is filed under either
 * yet, so neither gets a control here. Tag a project with one and its filter
 * appears on this page automatically.
 */
export const portfolioFilters: PortfolioFilter[] = [
  { value: 'All', label: 'All work', short: 'All', count: projects.length },
  ...Array.from(new Set(projects.map((project) => project.category))).map(
    (category) => ({
      value: category,
      label: FILTER_LABELS[category]?.label ?? category,
      short: FILTER_LABELS[category]?.short ?? category,
      count: projects.filter((project) => project.category === category).length,
    }),
  ),
];

/** Masthead metadata strip. Computed, so it tracks the archive. */
export const portfolioIndex = [
  { label: 'Projects', value: String(projects.length).padStart(2, '0') },
  {
    label: 'Disciplines',
    value: String(portfolioFilters.length - 1).padStart(2, '0'),
  },
  {
    label: 'Clients',
    value: String(new Set(projects.map((p) => p.client)).size).padStart(2, '0'),
  },
  { label: 'Based in', value: 'Dubai · India' },
] as const;

/* -------------------------------------------------------------------------- */
/* Production gallery                                                         */
/* -------------------------------------------------------------------------- */

export const productionGallery = {
  slug: 'On production',
  headline: 'Cameras, crew and the hours that never make the cut.',
  body: 'Rigs built at dawn, blocking rehearsed twice, a grade pushed until the skin tones sit right. The films above are what survives; this is where they were made.',
  /**
   * All ten production stills from the original portfolio page, at source
   * resolution. Decorative by design — the set is the content, and ten
   * invented descriptions would be noise to a screen reader, not information.
   */
  frames: Array.from({ length: 10 }, (_, index) => ({
    src: `/images/behind-the-frame/bts-${String(index + 1).padStart(2, '0')}.jpg`,
    alt: '',
  })),
} as const;

/* -------------------------------------------------------------------------- */
/* Creative statement                                                         */
/* -------------------------------------------------------------------------- */

export const portfolioStatement = {
  slug: 'Why it looks like this',
  /** Set as a pull quote, one line per entry. */
  quote: [
    'We do not shoot',
    'products. We shoot',
    'the reason someone',
    'wants one.',
  ],
  body: [
    'Every project on this page started the same way — in a room, listening. What the brand needed to say, who needed to hear it, and the single feeling that had to land before anything else did.',
    'The camera comes last. Script, cast, location, lens and grade are all downstream of that one decision, which is why the work reads as a body rather than a showreel of unrelated jobs.',
  ],
} as const;
