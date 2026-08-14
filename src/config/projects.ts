export interface Project {
  /** Zero-padded display number. */
  number: string;
  /** EVENT · ADVERT · SOCIAL MEDIA — the gold line above the title. */
  category: string;
  /** Full title as the studio writes it, category included. */
  title: string;
  /** One line, sized for a card. */
  description: string;
  /** The studio's own longer copy, verbatim — used on the detail page. */
  summary: string;
  client: string;
  /** `/portfolio/<slug>`, resolved by the shared detail route. */
  href: string;
  image: string;
}

/**
 * The studio's work, and the single source of truth for it.
 *
 * The homepage's Featured Work grid and the Portfolio page both read from
 * here — the homepage shows a subset, so it reads as a preview of the full
 * page rather than a second, drifting list. They previously held separate
 * arrays and had already diverged on slugs and copy.
 *
 * IMAGES: six of the eight have real stills in `public/images/works`. Silk
 * Route and Ecovacs do not, and point at production stills from
 * `public/images/services` as visible placeholders — swap them for the real
 * frames when those exist. Paths are URL-encoded where the filename carries a
 * space, because `next/image` passes `src` into the optimiser query string.
 */
export const projects: Project[] = [
  {
    number: '01',
    category: 'Event',
    title: 'Cleveland Clinic | Event',
    client: 'Cleveland Clinic',
    description:
      'Cinematic coverage of Cleveland Clinic and Steppi’s launch event.',
    summary:
      'An Event for Cleveland and Steppi App. Steppi’s Early Launch and Demo Event coverage done in a cinematic manner.',
    href: '/portfolio/cleveland-clinic-event',
    image: '/images/works/Cleveland%20Clinic-Event.jpg',
  },
  {
    number: '02',
    category: 'Advert',
    title: 'ID Fresh - Blend | Advert',
    client: 'ID Fresh',
    description: 'Cinematic advert celebrating the launch of ID Fresh Blend.',
    summary:
      'ID’s brand came up with a new product by the name of Blend and wanted us to showcase the emotion attached to the taste of the product.',
    href: '/portfolio/id-fresh-blend-advert',
    image: '/images/works/ID-Fresh-Blend-Advert.jpg',
  },
  {
    number: '03',
    category: 'Advert',
    title: 'Silk Route | Advert',
    client: 'Silk Route',
    description: 'Connecting the emotions of Onam to a brand and its designs.',
    summary:
      'Silk Route, explained the need of connecting emotions of ONAM to their brand and their designs.',
    href: '/portfolio/silk-route-advert',
    /* PLACEHOLDER — no project still available yet. */
    image: '/images/services/photography.jpg',
  },
  {
    number: '04',
    category: 'Social Media',
    title: 'MalabarGold | Social Media',
    client: 'Malabar Gold',
    description:
      'Influencer campaign with cinematic adverts for Malabar Gold’s social media.',
    summary:
      'A Social media Influencer campaign with 2 vertical adverts, we were able to provide Malabar Gold a full script to finish Advert.',
    href: '/portfolio/malabargold-social-media',
    image: '/images/works/MalabarGold-Social-Media.jpg',
  },
  {
    number: '05',
    category: 'Advert',
    title: 'Go Sands | Advert',
    client: 'Go Sands',
    description:
      'Stylish cinematic advert showcasing Dubai through the Go Sands experience.',
    summary:
      'Go Sands needed an Advert that showed off Dubai in a stylish cinematic manner, while also showing the customers of the kind of experience they would get if they chose the brand.',
    href: '/portfolio/go-sands-advert',
    image: '/images/works/Go-Sands-Advert.jpg',
  },
  {
    number: '06',
    category: 'Social Media',
    title: 'Ecovacs | Social Media',
    client: 'Ecovacs',
    description: 'Script-to-finish vertical adverts for a social campaign.',
    summary:
      'A Social media campaign with 2 vertical adverts, we were able to provide Ecovacs a full script to finish Advert.',
    href: '/portfolio/ecovacs-social-media',
    /* PLACEHOLDER — no project still available yet. */
    image: '/images/services/corporate-ads.jpg',
  },
  {
    number: '07',
    category: 'Advert',
    title: 'Flydubai | Advert',
    client: 'flydubai',
    description:
      'Cinematic advert showcasing flydubai’s sports culture and team spirit.',
    summary:
      'The Sports and social division of flydubai wanted to showcase the activities they do, and conjoin them with the emotions of how the staff feels by participating, to attract more participation.',
    href: '/portfolio/flydubai-advert',
    image: '/images/works/flydubai-Advert.jpg',
  },
  {
    number: '08',
    category: 'Advert',
    title: 'M & S Cosmetics | Advert',
    client: 'M & S Cosmetics',
    description:
      'Cinematic B2B advert highlighting M&S Cosmetics’ unique ingredients.',
    summary:
      'M&S Cosmetics apporached us for an advert that represented the brand well for a B2B presentation that focused on the ingredients and the uniqueness of the brand.',
    href: '/portfolio/ms-cosmetics-advert',
    image: '/images/works/M-S-Cosmetics-Advert.jpg',
  },
];

/** Looked up by the shared `/portfolio/[slug]` detail route. */
export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.href === `/portfolio/${slug}`);
}

export function getProjectSlugs(): string[] {
  return projects.map((p) => p.href.replace('/portfolio/', ''));
}

/**
 * Filter labels for the portfolio, derived from the data rather than written
 * out — a category can only appear once a project actually carries it, so the
 * bar can never offer a filter that returns nothing.
 */
export const projectCategories: string[] = [
  'All',
  ...Array.from(new Set(projects.map((p) => p.category))),
];

/** The homepage preview: the first six, shown as two rows of three. */
export const featuredProjects: Project[] = projects.slice(0, 6);

const ROW_SIZE = 3;

/**
 * Rows of three, so the grid can drop a route-through button after the last.
 *
 * Chunked rather than hard-sliced: a fixed set of slices leaves an empty
 * trailing row whenever the count is not a multiple of three, which would
 * still render the end-of-grid button under nothing.
 */
export const featuredProjectRows: Project[][] = Array.from(
  { length: Math.ceil(featuredProjects.length / ROW_SIZE) },
  (_, row) => featuredProjects.slice(row * ROW_SIZE, (row + 1) * ROW_SIZE),
);
