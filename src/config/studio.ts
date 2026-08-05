import type { EditorialRow } from '@/components/ui/EditorialRows';

/**
 * How the studio works, as four editorial rows.
 *
 * Written from what the site already states about itself — the description in
 * `site.ts`, the nine service disciplines, and the manifesto principles. No
 * founding dates, headcount, awards or client names, because none of that is
 * sourced anywhere in this project yet.
 */
export const studioHighlights: EditorialRow[] = [
  {
    number: '01',
    title: 'Creative vision',
    body: 'Every project begins with an idea worth remembering.',
  },
  {
    number: '02',
    title: 'End-to-end production',
    body: 'Concept, filming, editing and final delivery.',
  },
  {
    number: '03',
    title: 'Modern equipment',
    body: 'Industry-standard tools and cinematic workflows.',
  },
  {
    number: '04',
    title: 'Human connection',
    body: 'Real stories. Real emotions. Real impact.',
  },
];

/** The route a project takes through the studio, start to finish. */
export const studioProcess = [
  'Idea',
  'Script',
  'Production',
  'Edit',
  'Delivery',
] as const;
