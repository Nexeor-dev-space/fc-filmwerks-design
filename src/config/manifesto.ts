export interface ManifestoStatement {
  /** Zero-padded display number, 01–04. */
  number: string;
  title: string;
  body: string;
}

/**
 * The studio's working principles, as four editorial rows.
 *
 * Deliberately prose rather than feature bullets — this section exists to show
 * how the studio thinks, and a list of benefits would read as a pitch.
 */
export const manifesto: ManifestoStatement[] = [
  {
    number: '01',
    title: 'Story first',
    body: 'Every frame exists to serve the story, creating films that resonate long after the screen goes dark.',
  },
  {
    number: '02',
    title: 'Crafted with purpose',
    body: 'From concept and scripting to production and post, every decision is intentional and every detail matters.',
  },
  {
    number: '03',
    title: 'Cinematic quality',
    body: 'We combine creative vision with technical precision to deliver production standards that elevate every brand.',
  },
  {
    number: '04',
    title: 'Built on collaboration',
    body: 'The strongest productions happen through trust, transparency and a shared creative ambition.',
  },
];
