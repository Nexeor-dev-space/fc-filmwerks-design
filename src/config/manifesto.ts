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
 * how the studio thinks, and a list of benefits would read as a pitch. The
 * voice is the studio's own positioning: humane, emotional storytelling backed
 * by technical craft.
 */
export const manifesto: ManifestoStatement[] = [
  {
    number: '01',
    title: 'Human first',
    body: 'A scene that is technically perfect and emotionally empty is not finished.',
  },
  {
    number: '02',
    title: 'Story before spectacle',
    body: 'The script is finished before the camera is chosen. The shot serves the sentence, never the other way round.',
  },
  {
    number: '03',
    title: 'Craft without compromise',
    body: 'Technique is there so the feeling can be. Nothing is finished until both are.',
  },
  {
    number: '04',
    title: 'Built on collaboration',
    body: 'The strongest productions happen through trust, transparency and a shared creative ambition.',
  },
];
