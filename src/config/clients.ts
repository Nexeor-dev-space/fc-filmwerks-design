export interface Client {
  /** Used for the accessible name and as the React key. */
  name: string;
  /** Lives in /public/images/client-logos — swap the file, no code change. */
  logo: string;
}

/**
 * Real client wordmarks.
 *
 * The files are numbered rather than named, so `name` is the only record of
 * which brand each one is — it is the accessible name and the React key, and
 * it is what a reader hears. Keep it accurate when files are added or
 * reordered.
 */
export const clients: Client[] = [
  { name: 'Glenmark', logo: '/images/client-logos/1.png' },
  /* TODO: this one is an Arabic calligraphic wordmark that could not be read
     from the artwork. The name below is a stand-in and will be announced to
     screen readers as-is — replace it with the real brand. */
  { name: 'Client', logo: '/images/client-logos/2.png' },
  { name: 'The Camel Soap Factory', logo: '/images/client-logos/3.png' },
  { name: 'Ardh Alzaqurah Trading', logo: '/images/client-logos/4.png' },
  { name: 'Safe Line Group of Companies', logo: '/images/client-logos/5.png' },
  { name: 'Calicut Football Club', logo: '/images/client-logos/6.png' },
  { name: 'Audi', logo: '/images/client-logos/7.png' },
  {
    name: 'Abu Dhabi Commercial Properties',
    logo: '/images/client-logos/8.png',
  },
  { name: 'flydubai', logo: '/images/client-logos/9.png' },
  { name: 'Mindspace', logo: '/images/client-logos/10.png' },
  { name: 'Pavanito', logo: '/images/client-logos/11.png' },
  { name: 'GS', logo: '/images/client-logos/12.png' },
  { name: 'Playa', logo: '/images/client-logos/13.png' },
  { name: 'Heartland UAE', logo: '/images/client-logos/14.png' },
];

/** Sectors the studio works across, cycled through the marquee. */
export const clientSectors = [
  'Commercial Films',
  'Brand Campaigns',
  'Hospitality',
  'Healthcare',
  'Retail',
  'Government',
  'Education',
  'Events',
  'Corporate Productions',
] as const;
