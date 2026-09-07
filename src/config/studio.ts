import type { EditorialRow } from '@/components/ui/EditorialRows';

/**
 * How the studio works, as four editorial rows on the homepage.
 *
 * Written from the studio's own positioning and founder biography — the
 * founding intent, the end-to-end offer, the director's experience, and the
 * award-winning original film. Nothing here is a figure the studio has not
 * stated itself.
 */
export const studioHighlights: EditorialRow[] = [
  {
    number: '01',
    title: 'Humane storytelling',
    body: 'Every film starts with the person it has to reach, not the product it has to show.',
  },
  {
    number: '02',
    title: 'End-to-end production',
    body: 'Concept, script, shoot and post-production, held in one house.',
  },
  {
    number: '03',
    title: 'Award-winning direction',
    body: 'Led by a director with more than fifteen years in UAE events and visual media.',
  },
  {
    number: '04',
    title: 'Original cinema',
    body: 'Blue Lily (2026), recognised at five international festivals and screened theatrically.',
  },
];
