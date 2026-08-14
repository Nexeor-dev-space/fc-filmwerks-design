/**
 * Copy for the About page, taken verbatim from fcfilmwerks.com/about.
 *
 * Kept here rather than inline so the page components stay presentational and
 * the wording can be corrected in one place. The studio's own phrasing is
 * preserved — including "dont" in the philosophy copy, which is theirs.
 */

export const aboutHero = {
  /** Rendered one line per entry, so the stages read as separate beats. */
  headline: ['LISTEN.', 'EMOTE.', 'VISUALISE.', 'REPEAT.'],
  label: 'About the studio',
} as const;

export const aboutIntro = {
  label: 'About us',
  heading: ['A MEDIA', 'PRODUCTION', 'COMPANY.'],
  body: 'fcfilmwerks is a leading media production company that offers a wide range of services in the field of media production. Specializing in both pre- and post-production, we are dedicated to ensuring the highest quality for films and commercials. From script editing to sound design, we bring creativity and expertise to every project, ensuring that our productions captivate audiences and make a lasting impact.',
  image: '/images/services/videography.jpg',
  imageAlt: 'A cinema camera rig on a film set',
} as const;

/**
 * The four stages. `body` is the studio's single paragraph, split across the
 * stages it describes rather than rewritten — the sentences are theirs and
 * appear in their original order.
 */
export const aboutStages = [
  {
    number: '01',
    title: 'Listen',
    body: 'We listen. We dont just come up with a content without understanding your brand.',
  },
  {
    number: '02',
    title: 'Emote',
    body: 'The idea is to get into the details.',
  },
  {
    number: '03',
    title: 'Visualise',
    body: 'Trigger that emotion through the visuals and audio and the services we provide.',
  },
  {
    number: '04',
    title: 'Repeat',
    body: 'Then again, for the next story, and the one after it.',
  },
] as const;

export const aboutMission = {
  label: 'Our mission',
  /** Rendered line by line, so the statement lands in measured beats. */
  statement: [
    'To elevate the art of storytelling',
    'through meticulous pre- and',
    'post-production, delivering',
    'world-class films and commercials',
    'that resonate with global audiences.',
  ],
} as const;

/** Live contact details from the current About page. */
export const aboutContact = {
  email: 'letstalk@fcfilmwerks.com',
  phone: '+971 54 321 6347',
  phoneHref: 'tel:+971543216347',
  locations: 'Dubai | India',
} as const;
