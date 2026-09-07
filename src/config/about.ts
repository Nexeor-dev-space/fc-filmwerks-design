/**
 * Copy for the About page.
 *
 * Sourced from the studio's own company story, positioning statement and
 * founder biographies (supplied September 2026), plus the festival laurels
 * printed on Blue Lily's own key art. Everything else is connective editorial
 * copy written for this layout: it carries no claim the studio has not already
 * made about itself.
 *
 * Every fact appears in exactly one chapter. The founding year is in the story,
 * the founder's experience is in his biography, the film's record is in the
 * film chapter, and the disciplines are in the craft index. The masthead facts
 * strip is the one deliberate summary, and the homepage carries the trust
 * figures and the client belt, so neither is repeated here.
 *
 * What is deliberately NOT here, and why:
 *
 * - No portraits. The studio has not supplied any, so `AboutPeople` sets a
 *   typographic monogram in the portrait slot until it does.
 * - No client name for the commemorative film currently in production, and no
 *   production slate at all: the studio asked for neither.
 * - The founder's quote is marked DRAFT. It was written for approval and must
 *   be confirmed or replaced by the founder before launch.
 *
 * The page is structured as a numbered dossier, six chapters, each with its
 * own id, and `aboutChapters` is what the side rail reads to build its index.
 * A chapter added here appears in the rail automatically, and every chapter
 * component reads its own number back through `chapterNumber`, so the marks
 * on the page cannot drift from the index beside them.
 */

import type { Chapter } from '@/types';

import { blueLily, blueLilyAwardCountWord } from './film';

export type AboutChapter = Chapter;

export const aboutChapters: AboutChapter[] = [
  { number: '01', title: 'The studio', id: 'about-studio' },
  { number: '02', title: 'The founders', id: 'about-people' },
  { number: '03', title: 'The film', id: 'about-film' },
  { number: '04', title: 'The method', id: 'about-method' },
  { number: '05', title: 'The craft', id: 'about-craft' },
  { number: '06', title: 'On set', id: 'about-on-set' },
];

/** The display number for a chapter, looked up by its section id. */
export function chapterNumber(id: string): string {
  return aboutChapters.find((chapter) => chapter.id === id)?.number ?? '00';
}

/* -------------------------------------------------------------------------- */
/* 00 — Masthead                                                              */
/* -------------------------------------------------------------------------- */

export const aboutMasthead = {
  /** Sits above the rule, mono, as a publication slug line. */
  slug: 'FC Filmwerks · About',
  /** Rendered one line per entry, each masked and revealed in turn. */
  headline: ['Every frame,', 'deeply', 'human.'],
  /**
   * What the studio makes and for whom. The why is the mission at the foot of
   * the page, so it is not paraphrased here.
   */
  standfirst:
    'Corporate films, commemorative pieces, documentaries and original cinema, made in Dubai and India for brands, institutions and cinema audiences.',
  /**
   * The four-stage method, kept from the studio's original tagline. Set as a
   * mono strip rather than a headline: it is the page's thesis, and chapter
   * 04 is where it is unpacked.
   */
  stages: ['Listen', 'Emote', 'Visualise', 'Repeat'],
  /** The page's one summary strip. Every value is stated in the studio's own copy. */
  facts: [
    { label: 'Founded', value: 'Dubai, 2025' },
    { label: 'Led by', value: 'An award-winning director' },
    { label: 'Experience', value: '15+ years in UAE media' },
    { label: 'Based', value: 'Dubai | India' },
  ],
  /** The letterboxed strip under the masthead. */
  video: '/videos/banner-video.mp4',
} as const;

/* -------------------------------------------------------------------------- */
/* 01 — The studio                                                            */
/* -------------------------------------------------------------------------- */

export const aboutStory = {
  heading: ['Born from a', 'simple observation.'],
  /**
   * The company story, in the studio's own order and with its own claims. Who
   * leads it is chapter 02; what the studio has made is chapter 03.
   */
  paragraphs: [
    'FC Filmwerks was founded in 2025, born from a simple observation: the UAE’s audio-visual and events market was missing humane, emotional storytelling.',
    'The studio set out to fill that gap with exceptional scripts and narrative craft: heartfelt storytelling paired with polished technical execution, from concept and scripting through shoot and post-production.',
  ],
  /** Margin note, set small and mono beside the column. */
  note: 'Founder-directed. The person who takes the brief is the person behind the camera.',
  /** Pull quote closing the story. Editorial, not attributed. */
  quote:
    'Every brief has a person inside it. The work is finding them before the camera does.',
  /**
   * Heading for the four working principles that close the chapter. The
   * principles themselves are `manifesto` in `manifesto.ts`.
   */
  principlesHeading: 'What we hold to',
} as const;

/* -------------------------------------------------------------------------- */
/* 03 — The film                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Blue Lily, as the About page tells it. The film's own record, its credits,
 * honours and links, lives in `film.ts` and is shared with the homepage; only
 * the chapter's editorial framing is here.
 */
export const aboutFilm = {
  heading: ['What humane', 'storytelling looks like.'],
  intro: `An original film is the one brief a studio writes for itself, with no client note to hide behind. Blue Lily is that test, and it came back with ${blueLilyAwardCountWord} awards.`,
  film: blueLily,
  credits: [
    { label: 'Director', value: blueLily.director },
    { label: 'Producer', value: blueLily.producer },
    { label: 'Screened', value: blueLily.screenings },
  ],
  body: [
    'It is on this page for a reason beyond pride. Every discipline the studio sells to a brand, from script and direction to sound, edit and grade, was tested here in public, in front of juries. The film is the proof that emotion and technical polish belong in the same frame.',
  ],
} as const;

/* -------------------------------------------------------------------------- */
/* 04 — The method                                                            */
/* -------------------------------------------------------------------------- */

export const aboutMethod = {
  heading: ['Four stages,', 'on repeat.'],
  intro:
    'Four stages, always in this order. Listening comes before writing, feeling before shooting, and every finished film sharpens the next.',
  /**
   * The four stages the studio has always worked to, rewritten in the voice of
   * its current positioning. `body` is the stage; `aside` is editorial
   * connective tissue.
   */
  stages: [
    {
      number: '01',
      title: 'Listen',
      body: 'Nothing is written until we understand the brand, the room it lives in, and the person the film has to reach.',
      aside:
        'Before a treatment, before a lens choice, the brief is read back to you until it is right.',
    },
    {
      number: '02',
      title: 'Emote',
      body: 'We find the feeling first: the one thing an audience should carry out of the room, and the detail that carries it.',
      aside:
        'The detail is where the feeling lives: a look, a pause, the second a room goes quiet.',
    },
    {
      number: '03',
      title: 'Visualise',
      body: 'Then the picture and the sound are built to trigger that emotion: script, lens, light, edit and mix.',
      aside:
        'Picture and sound are built together, not stitched together at the end.',
    },
    {
      number: '04',
      title: 'Repeat',
      body: 'Then again, for the next story, and the one after it.',
      aside: 'Nothing here is a template. The next brief starts at Listen.',
    },
  ],
} as const;

/* -------------------------------------------------------------------------- */
/* 05 — The craft                                                             */
/* -------------------------------------------------------------------------- */

export const aboutCraft = {
  heading: ['From concept', 'to final mix.'],
  intro:
    'Every discipline below is staffed in house, which is why a brief can start as a script and end as a mix without leaving the building.',
} as const;

/* -------------------------------------------------------------------------- */
/* 06 — On set                                                                */
/* -------------------------------------------------------------------------- */

export const aboutOnSet = {
  heading: ['The part of the work', 'nobody sees.'],
  body: 'Rigs, rehearsals, the fourth take of a shot that already looked fine. The finished frame is the short version of a much longer day.',
  /** Ten production stills live in /public/images/behind-the-frame. */
  frameCount: 10,
} as const;

/* -------------------------------------------------------------------------- */
/* 02 — The founders                                                          */
/* -------------------------------------------------------------------------- */

export interface AboutFounder {
  name: string;
  role: string;
  /** Set in the portrait slot until a photograph is supplied. */
  initials: string;
  /** One or more paragraphs. */
  bio: string[];
  /**
   * Portrait path, once the studio supplies one. `AboutPeople` renders the
   * monogram whenever this is absent.
   */
  portrait?: string;
  /** A first-person line, set as a pull quote beside the biography. */
  quote?: string;
}

export const aboutPeople = {
  heading: ['The people', 'behind the frame.'],
  intro:
    'A director and a producer founded this studio: the two people no film can be made without.',
  note: 'Crew is scaled to the production rather than the other way round.',
  founders: [
    {
      name: 'Gautam Raveendran',
      role: 'Founder · Director',
      initials: 'GR',
      bio: [
        'An award-winning director and filmmaker with a strong technical grounding across production and post-production, and more than fifteen years in the UAE events and visual media market.',
        'Gautam heads the studio’s creative direction on every project, and directed Blue Lily.',
      ],
      /*
       * DRAFT: written for the founder's approval, not yet confirmed.
       * Replace with his own words, or delete the field and the pull quote
       * disappears from the page.
       */
      quote:
        'I started FC Filmwerks because too much of what I saw was technically perfect and emotionally empty. A film should feel like it was made by people, for people. That is the whole brief.',
    },
    {
      name: 'Mini Nair',
      role: 'Co-founder · Producer',
      initials: 'MN',
      bio: [
        'An award-winning producer and seasoned event director, known for helming high-profile celebrity talk shows and multiple corporate visual projects, and for coordinating top-tier Indian celebrity talent.',
        'Mini produced Blue Lily and the acclaimed short-film thriller Your Place or Mine.',
      ],
    },
  ] satisfies AboutFounder[],
} as const;

/** Live contact details, shared with the Contact page and the footer. */
export const aboutContact = {
  email: 'letstalk@fcfilmwerks.com',
  phone: '+971 54 321 6347',
  phoneHref: 'tel:+971543216347',
  locations: 'Dubai | India',
} as const;
