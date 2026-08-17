/**
 * Copy for the About page.
 *
 * The studio's own sentences — the introduction paragraph, the four-stage
 * tagline, the mission and the contact details — are taken verbatim from
 * fcfilmwerks.com/about and are marked as such below. Everything else is
 * connective editorial copy written for this layout: it carries no claim the
 * studio has not already made about itself. There are deliberately no founding
 * dates, headcount figures, award counts or project totals anywhere in this
 * file, because none of those are sourced.
 *
 * The page is structured as a numbered dossier — seven chapters, each with its
 * own id — and `aboutChapters` is what the side rail reads to build its index.
 * A chapter added here appears in the rail automatically.
 */

export interface AboutChapter {
  /** Zero-padded display number. Also the rail's marker. */
  number: string;
  /** Rail label — short enough to sit in a 12ch column. */
  title: string;
  /** Section element id this chapter scrolls to. */
  id: string;
}

export const aboutChapters: AboutChapter[] = [
  { number: '01', title: 'The studio', id: 'about-studio' },
  { number: '02', title: 'The method', id: 'about-method' },
  { number: '03', title: 'The craft', id: 'about-craft' },
  { number: '04', title: 'On set', id: 'about-on-set' },
  { number: '05', title: 'The people', id: 'about-people' },
  { number: '06', title: 'The record', id: 'about-record' },
  { number: '07', title: 'Let’s talk', id: 'about-closing' },
];

/* -------------------------------------------------------------------------- */
/* 00 — Masthead                                                              */
/* -------------------------------------------------------------------------- */

export const aboutMasthead = {
  /** Sits above the rule, mono, as a publication slug line. */
  slug: 'fcfilmwerks — about',
  /** Rendered one line per entry, each masked and revealed in turn. */
  headline: ['We listen', 'long before', 'we roll.'],
  /**
   * The studio's own opening sentence, verbatim, used as the standfirst.
   * Present tense, their claim, their wording.
   */
  standfirst:
    'fcfilmwerks is a leading media production company that offers a wide range of services in the field of media production.',
  /**
   * The four-stage tagline from the live page, kept as the studio writes it.
   * Set as a mono strip rather than a headline — it is the page's thesis, and
   * chapter 02 is where it is actually unpacked.
   */
  stages: ['Listen', 'Emote', 'Visualise', 'Repeat'],
  /** Masthead facts. Every value is stated somewhere on the live site. */
  facts: [
    { label: 'Discipline', value: 'Media production' },
    { label: 'Specialism', value: 'Pre- and post-production' },
    { label: 'Output', value: 'Films and commercials' },
    { label: 'Based', value: 'Dubai | India' },
  ],
  /** The letterboxed strip under the masthead. */
  video: '/videos/banner-video.mp4',
} as const;

/* -------------------------------------------------------------------------- */
/* 01 — The studio                                                            */
/* -------------------------------------------------------------------------- */

export const aboutStory = {
  heading: ['A production house', 'built end to end.'],
  /**
   * The studio's introduction paragraph, split at its own sentence breaks so
   * it can be set as an editorial column. The words and their order are theirs.
   */
  paragraphs: [
    'fcfilmwerks is a leading media production company that offers a wide range of services in the field of media production.',
    'Specializing in both pre- and post-production, we are dedicated to ensuring the highest quality for films and commercials.',
    'From script editing to sound design, we bring creativity and expertise to every project, ensuring that our productions captivate audiences and make a lasting impact.',
  ],
  /** Margin note, set small and mono beside the column. */
  note: 'Two bases, one crew. Work moves between Dubai and India without changing hands.',
  /** Pull quote closing the chapter. */
  quote:
    'Nothing reaches an edit suite here that did not start as a question about your brand.',
  image: '/images/behind-the-frame/bts-03.jpg',
  imageAlt: 'The crew setting up a shot on location',
  imageCaption: 'On location — blocking a setup before the first take.',
} as const;

/* -------------------------------------------------------------------------- */
/* 02 — The method                                                            */
/* -------------------------------------------------------------------------- */

export const aboutMethod = {
  heading: ['Four stages,', 'on repeat.'],
  intro:
    'The studio works to a loop rather than a checklist. Each stage feeds the next, and the last one starts the first again.',
  /**
   * The four stages. `body` is the studio's single paragraph split across the
   * stages it describes rather than rewritten — the sentences are theirs and
   * appear in their original order. `aside` is editorial connective tissue.
   */
  stages: [
    {
      number: '01',
      title: 'Listen',
      body: 'We listen. We dont just come up with a content without understanding your brand.',
      aside:
        'Before a treatment, before a lens choice — the brief is read back to you until it is right.',
    },
    {
      number: '02',
      title: 'Emote',
      body: 'The idea is to get into the details.',
      aside:
        'The detail is where the feeling lives: a look, a pause, the second a room goes quiet.',
    },
    {
      number: '03',
      title: 'Visualise',
      body: 'Trigger that emotion through the visuals and audio and the services we provide.',
      aside:
        'Picture and sound are built together, not stitched together at the end.',
    },
    {
      number: '04',
      title: 'Repeat',
      body: 'Then again, for the next story, and the one after it.',
      aside:
        'The loop is the point. Every project sharpens the one that follows it.',
    },
  ],
} as const;

/* -------------------------------------------------------------------------- */
/* 03 — The craft                                                             */
/* -------------------------------------------------------------------------- */

export const aboutCraft = {
  heading: ['From script editing', 'to sound design.'],
  intro:
    'Nine disciplines held in one house, so a production never has to be handed to a stranger halfway through.',
} as const;

/* -------------------------------------------------------------------------- */
/* 04 — On set                                                                */
/* -------------------------------------------------------------------------- */

export const aboutOnSet = {
  heading: ['The part of the work', 'nobody sees.'],
  body: 'Rigs, rehearsals, the fourth take of a shot that already looked fine. The finished frame is the short version of a much longer day.',
  /** Ten production stills live in /public/images/behind-the-frame. */
  frameCount: 10,
} as const;

/* -------------------------------------------------------------------------- */
/* 05 — The people                                                            */
/* -------------------------------------------------------------------------- */

/**
 * The team is described by craft rather than by name.
 *
 * TODO: the live site publishes no names, portraits or roles, and inventing
 * them would put fictional people on a real company's About page. Replace this
 * block with the actual crew — name, role, portrait — as soon as the studio
 * supplies it; `AboutPeople` renders `name` and `portrait` when present.
 */
export interface AboutCraftRole {
  number: string;
  role: string;
  body: string;
}

export const aboutPeople = {
  heading: ['The people', 'behind the frame.'],
  intro:
    'A production is only ever as good as the room it is made in. These are the crafts that room is built from.',
  note: 'Crew is scaled to the production rather than the other way round.',
  roles: [
    {
      number: '01',
      role: 'Story & script',
      body: 'Script editing, structure and the treatment work that happens before anything is shot.',
    },
    {
      number: '02',
      role: 'Direction',
      body: 'Holding the intent of the brief from the first conversation through to the final grade.',
    },
    {
      number: '03',
      role: 'Cinematography',
      body: 'Camera, lighting and lens language — the part of the film an audience feels first.',
    },
    {
      number: '04',
      role: 'Production',
      body: 'Locations, scheduling, crew and the logistics that keep a shoot day on its feet.',
    },
    {
      number: '05',
      role: 'Editorial & colour',
      body: 'Cutting, grading and finishing, where a day of rushes becomes a film with a pulse.',
    },
    {
      number: '06',
      role: 'Sound',
      body: 'Recording, design and mix. Half of what makes a picture cinematic is not picture.',
    },
  ] satisfies AboutCraftRole[],
} as const;

/* -------------------------------------------------------------------------- */
/* 06 — The record                                                            */
/* -------------------------------------------------------------------------- */

export const aboutRecord = {
  heading: ['Brands we have', 'stood behind.'],
  body: 'Aviation, healthcare, retail, hospitality, government and the launches in between. The brief changes; the way the work is made does not.',
  /**
   * Figures are derived at render time from `clients` and `services` so they
   * cannot drift from the lists they describe. No figure here is typed by hand.
   */
  figures: [
    { label: 'Disciplines in house', suffix: '' },
    { label: 'Brands served', suffix: '+' },
    { label: 'Bases', suffix: '' },
  ],
} as const;

/* -------------------------------------------------------------------------- */
/* 07 — Closing                                                               */
/* -------------------------------------------------------------------------- */

export const aboutClosing = {
  label: 'Our mission',
  /** The studio's mission, verbatim, rendered line by line. */
  statement: [
    'To elevate the art of storytelling',
    'through meticulous pre- and',
    'post-production, delivering',
    'world-class films and commercials',
    'that resonate with global audiences.',
  ],
  cta: { label: 'Start a conversation', href: '/contact' },
} as const;

/** Live contact details from the current About page. */
export const aboutContact = {
  email: 'letstalk@fcfilmwerks.com',
  phone: '+971 54 321 6347',
  phoneHref: 'tel:+971543216347',
  locations: 'Dubai | India',
} as const;
