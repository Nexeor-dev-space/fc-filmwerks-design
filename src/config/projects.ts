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
 * Nine selected films for the homepage grid.
 *
 * A curated subset rather than the full portfolio: the grid ends in a route
 * through to `/portfolio` for everything else.
 */
export const featuredProjects: Project[] = [
  {
    number: '01',
    category: 'Commercial Film',
    title: 'Beyond the Horizon',
    client: 'Luxury Brand',
    location: 'Dubai',
    year: '2025',
    href: '/portfolio/beyond-the-horizon',
    image: '/images/services/videography.jpg',
  },
  {
    number: '02',
    category: 'Brand Story',
    title: 'The Makers',
    client: 'Heritage House',
    location: 'Milan',
    year: '2025',
    href: '/portfolio/the-makers',
    image: '/images/services/photography.jpg',
  },
  {
    number: '03',
    category: 'Luxury Campaign',
    title: 'Night Architecture',
    client: 'Property Group',
    location: 'Singapore',
    year: '2024',
    href: '/portfolio/night-architecture',
    image: '/images/services/corporate-ads.jpg',
  },
  {
    number: '04',
    category: 'Music Video',
    title: 'Static Bloom',
    client: 'Independent Artist',
    location: 'London',
    year: '2024',
    href: '/portfolio/static-bloom',
    image: '/images/services/music-label.jpg',
  },
  {
    number: '05',
    category: 'Documentary',
    title: 'The Long Room',
    client: 'Arts Foundation',
    location: 'Lisbon',
    year: '2024',
    href: '/portfolio/the-long-room',
    image: '/images/services/audio-solutions.jpg',
  },
  {
    number: '06',
    category: 'Corporate Production',
    title: 'Quiet Machinery',
    client: 'Engineering Group',
    location: 'Munich',
    year: '2024',
    href: '/portfolio/quiet-machinery',
    image: '/images/services/post-production.jpg',
  },
  {
    number: '07',
    category: 'Branded Content',
    title: 'Open Frequency',
    client: 'Audio Label',
    location: 'Berlin',
    year: '2023',
    href: '/portfolio/open-frequency',
    image: '/images/services/podcast-production.jpg',
  },
  {
    number: '08',
    category: 'Event Film',
    title: 'One Night Only',
    client: 'Festival Series',
    location: 'Amsterdam',
    year: '2023',
    href: '/portfolio/one-night-only',
    image: '/images/services/event-coverage.jpg',
  },
  {
    number: '09',
    category: 'Commercial Film',
    title: 'The Private Screening',
    client: 'Hospitality Brand',
    location: 'Geneva',
    year: '2023',
    href: '/portfolio/the-private-screening',
    image: '/images/services/home-theater-solutions.jpg',
  },
];

/** Rows of three, so the grid can drop a route-through button after each. */
export const featuredProjectRows: Project[][] = [
  featuredProjects.slice(0, 3),
  featuredProjects.slice(3, 6),
  featuredProjects.slice(6, 9),
];
