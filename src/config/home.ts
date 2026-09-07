import type { Chapter } from '@/types';

/**
 * The homepage's chapter rail — the same fixed index the About page carries.
 *
 * Each id must match the `id` on the section it points at. The hero is not
 * listed: the rail only appears once a chapter reaches the middle of the
 * screen, so it stays out of the way of the intro sequence and the hero.
 *
 * Titles are kept to a 12ch column, the rail's measure.
 */
export const homeChapters: Chapter[] = [
  { number: '01', title: 'Services', id: 'services' },
  { number: '02', title: 'The work', id: 'featured-work' },
  { number: '03', title: 'The studio', id: 'about' },
  { number: '04', title: 'Clients', id: 'clients' },
  { number: '05', title: 'Reviews', id: 'testimonials' },
  { number: '06', title: 'Let’s talk', id: 'lets-talk' },
];
