export interface Project {
  /** Zero-padded display number, 01–09. */
  number: string;
  /** Small gold line above the title. */
  category: string;
  title: string;
  /** Client, then where it was shot. Rendered as one light-grey line. */
  client: string;
  location: string;
  year: string;
  href: string;
  /**
   * Placeholder stills for now — paths are stable, so the files can be swapped
   * in place without touching this file or the component.
   */
  image: string;
}

/**
 * Selected films for the homepage grid.
 *
 * A curated subset rather than the full portfolio: the grid ends in a route
 * through to `/portfolio` for everything else.
 *
 * One entry per still in `public/images/works`. The paths are URL-encoded
 * because the filenames carry spaces — `next/image` passes `src` through to
 * the optimiser query string, where a raw space would be dropped.
 */
export const featuredProjects: Project[] = [
  {
    number: '01',
    category: 'Event Film',
    title: 'Cleveland Clinic | Event',
    client: 'Luxury Brand',
    location: 'Dubai',
    year: '2025',
    href: '/portfolio/beyond-the-horizon',
    image: '/images/works/Cleveland%20Clinic-Event.jpg',
  },
  {
    number: '02',
    category: 'Social Media',
    title: 'MalabarGold | Social Media',
    client: 'Heritage House',
    location: 'Milan',
    year: '2025',
    href: '/portfolio/the-makers',
    image: '/images/works/MalabarGold-Social-Media.jpg',
  },
  {
    number: '03',
    category: 'Advert',
    title: 'Flydubai | Advert',
    client: 'Property Group',
    location: 'Singapore',
    year: '2024',
    href: '/portfolio/night-architecture',
    image: '/images/works/flydubai-Advert.jpg',
  },
  {
    number: '04',
    category: 'Advert',
    title: 'ID Fresh - Blend | Advert',
    client: 'Independent Artist',
    location: 'London',
    year: '2024',
    href: '/portfolio/static-bloom',
    image: '/images/works/ID-Fresh-Blend-Advert.jpg',
  },
  {
    number: '05',
    category: 'Advert',
    title: 'Go Sands | Advert',
    client: 'Arts Foundation',
    location: 'Lisbon',
    year: '2024',
    href: '/portfolio/the-long-room',
    image: '/images/works/Go-Sands-Advert.jpg',
  },
  {
    number: '06',
    category: 'Advert',
    title: 'M & S Cosmetics | Advert',
    client: 'Engineering Group',
    location: 'Munich',
    year: '2024',
    href: '/portfolio/quiet-machinery',
    image: '/images/works/M-S-Cosmetics-Advert.jpg',
  },
];

const ROW_SIZE = 3;

/**
 * Rows of three, so the grid can drop a route-through button after the last.
 *
 * Chunked from the list rather than hard-sliced: a fixed set of slices leaves
 * an empty trailing row whenever the project count is not a multiple of three,
 * which would still render the end-of-grid button under nothing.
 */
export const featuredProjectRows: Project[][] = Array.from(
  { length: Math.ceil(featuredProjects.length / ROW_SIZE) },
  (_, row) => featuredProjects.slice(row * ROW_SIZE, (row + 1) * ROW_SIZE),
);
