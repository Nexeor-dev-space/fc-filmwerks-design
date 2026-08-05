export interface Client {
  /** Used for the accessible name and as the React key. */
  name: string;
  /** Lives in /public/images/clients — swap the file, no code change needed. */
  logo: string;
}

/**
 * Placeholder wordmarks, not real partners.
 *
 * Invented names on generic geometry so nothing here implies a relationship
 * the studio does not have. Replace the SVGs in `/public/images/clients` and
 * the names below when the real client list is confirmed.
 */
export const clients: Client[] = [
  { name: 'Northpoint', logo: '/images/clients/northpoint.svg' },
  { name: 'Meridian', logo: '/images/clients/meridian.svg' },
  { name: 'Alcove', logo: '/images/clients/alcove.svg' },
  { name: 'Verity', logo: '/images/clients/verity.svg' },
  { name: 'Lumen Works', logo: '/images/clients/lumen-works.svg' },
  { name: 'Orchard', logo: '/images/clients/orchard.svg' },
  { name: 'Base Ten', logo: '/images/clients/base-ten.svg' },
  { name: 'Foundry', logo: '/images/clients/foundry.svg' },
  { name: 'Kestrel', logo: '/images/clients/kestrel.svg' },
  { name: 'Solace', logo: '/images/clients/solace.svg' },
  { name: 'Pemberton', logo: '/images/clients/pemberton.svg' },
  { name: 'Ridgeline', logo: '/images/clients/ridgeline.svg' },
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
