/**
 * One narrative beat of a case study.
 *
 * The number of these, and what they are called, is decided per project — that
 * is the whole point. A shared set of headings ("The Challenge", "Our
 * Approach", "The Result") applied to eight different jobs produces eight pages
 * that read as one template with the nouns swapped, which is the failure mode
 * this structure exists to avoid. An event that happens once and a script-to-
 * finish vertical campaign do not have the same story shape, so they do not get
 * the same chapters.
 */
export interface ProjectChapter {
  /** Zero-padded display number, unique within the project. */
  number: string;
  title: string;
  /** One or more paragraphs. */
  body: string[];
}

/** A row of the project's details table. Only rows that exist are rendered. */
export interface ProjectDetail {
  label: string;
  value: string;
}

/**
 * The long-form content for a project page.
 *
 * PROVENANCE, and please keep this straight when editing:
 *
 * - `standfirst` and `objective` are restatements of the studio's own `summary`
 *   sentence for the project. Nothing is added to them.
 * - `chapters` are craft narrative. They describe intent and method — how the
 *   studio approaches a brief of this kind — and are written to be true of the
 *   work without asserting anything unverifiable about it. They are the part a
 *   producer should read and correct.
 * - `delivered` lists deliverables, which are facts, and are only stated where
 *   the studio's own copy states them ("2 vertical adverts", "full script to
 *   finish"). It is NOT a results list.
 * - `details` carry only what the source states. `Location` in particular is
 *   present on exactly one project, because exactly one project's copy names a
 *   place. Do not infer a location from where a client is headquartered.
 *
 * There are deliberately no view counts, engagement figures, awards, campaign
 * outcomes or client quotes anywhere in this file. None of those were supplied,
 * and a case study that invents them is worse than one that stops at the work.
 * When the studio provides real numbers, add a `results` field here and a block
 * for it in `ProjectOutcome` — the page is built to grow that section.
 */
export interface ProjectCaseStudy {
  /** Sits under the hero, at lead size. */
  standfirst: string;
  /** What the project had to do, in the client's terms. */
  objective: string;
  /** Variable in length and in naming — see `ProjectChapter`. */
  chapters: ProjectChapter[];
  /** What left the studio. Deliverables, never outcomes. */
  delivered: string[];
  details: ProjectDetail[];
  /** Extra stills, where the studio has them. Omitted, the section is skipped. */
  gallery?: { src: string; alt: string }[];
}

export interface Project {
  /** Zero-padded display number. */
  number: string;
  /** EVENT · ADVERT · SOCIAL MEDIA — the gold line above the title. */
  category: string;
  /** Full title as the studio writes it, category included. */
  title: string;
  /** One line, sized for a card. */
  description: string;
  /** The studio's own longer copy, verbatim — used on the detail page. */
  summary: string;
  client: string;
  /** `/portfolio/<slug>`, resolved by the shared detail route. */
  href: string;
  image: string;
  /** The detail page's long form. See `ProjectCaseStudy` for provenance. */
  caseStudy: ProjectCaseStudy;
}

/**
 * The studio's work, and the single source of truth for it.
 *
 * The homepage's Featured Work grid and the Portfolio page both read from
 * here — the homepage shows a subset, so it reads as a preview of the full
 * page rather than a second, drifting list. They previously held separate
 * arrays and had already diverged on slugs and copy.
 *
 * IMAGES: six of the eight have real stills in `public/images/works`. Silk
 * Route and Ecovacs do not, and point at production stills from
 * `public/images/services` as visible placeholders — swap them for the real
 * frames when those exist. Paths are URL-encoded where the filename carries a
 * space, because `next/image` passes `src` into the optimiser query string.
 */
export const projects: Project[] = [
  {
    number: '01',
    category: 'Event',
    title: 'Cleveland Clinic | Event',
    client: 'Cleveland Clinic',
    description:
      'Cinematic coverage of Cleveland Clinic and Steppi’s launch event.',
    summary:
      'An Event for Cleveland and Steppi App. Steppi’s Early Launch and Demo Event coverage done in a cinematic manner.',
    href: '/portfolio/cleveland-clinic-event',
    image: '/images/works/Cleveland%20Clinic-Event.jpg',
    caseStudy: {
      standfirst:
        'An early launch and demo event for the Steppi app, held with Cleveland Clinic, and covered as a film rather than as a record of proceedings.',
      objective:
        'Cover Steppi\u2019s early launch and demo event in a cinematic manner.',
      chapters: [
        {
          number: '01',
          title: 'A room that happens once',
          body: [
            'Cleveland Clinic and Steppi brought the studio in for the app\u2019s early launch and demo. An event has no second take. The demo is given once, the room reacts once, and whatever is not covered when it happens is simply not in the film.',
            'That is the constraint the whole job is built around, and it is what separates event coverage from every other kind of production: the schedule belongs to the event, not to the crew.',
          ],
        },
        {
          number: '02',
          title: 'Covering it as a film',
          body: [
            '\u201CIn a cinematic manner\u201D was the brief\u2019s own phrase, and it decides the coverage. A record of an event points the camera at whoever is speaking. A film of an event also holds on the listening \u2014 the demo landing, the question from the floor, the moment a room understands what it is being shown.',
            'So the coverage is planned for two things at once: the proceedings, which have to be complete, and the reactions, which are what make the cut watchable.',
          ],
        },
        {
          number: '03',
          title: 'The cut',
          body: [
            'The edit rebuilds the evening rather than replaying it. Sequence, pace and sound are shaped so that someone who was not in the room understands what Steppi is, what the launch felt like, and why the two are connected.',
          ],
        },
      ],
      delivered: ['Cinematic event film'],
      details: [
        { label: 'Client', value: 'Cleveland Clinic' },
        { label: 'Category', value: 'Event' },
        { label: 'Production type', value: 'Live event coverage' },
        { label: 'Services', value: 'Event coverage, Cinematography, Editing' },
      ],
    },
  },
  {
    number: '02',
    category: 'Advert',
    title: 'ID Fresh - Blend | Advert',
    client: 'ID Fresh',
    description: 'Cinematic advert celebrating the launch of ID Fresh Blend.',
    summary:
      'ID’s brand came up with a new product by the name of Blend and wanted us to showcase the emotion attached to the taste of the product.',
    href: '/portfolio/id-fresh-blend-advert',
    image: '/images/works/ID-Fresh-Blend-Advert.jpg',
    caseStudy: {
      standfirst:
        'A launch advert for Blend, a new product from ID Fresh, built around the emotion attached to the way it tastes.',
      objective: 'Showcase the emotion attached to the taste of the product.',
      chapters: [
        {
          number: '01',
          title: 'The brief',
          body: [
            'ID\u2019s brand had a new product, Blend, and a launch to make. What they asked for was not a product demonstration. They asked the studio to showcase the emotion attached to the taste \u2014 which is a harder brief, and a better one.',
          ],
        },
        {
          number: '02',
          title: 'Taste is not a picture',
          body: [
            'Flavour has no image of its own. It reaches an audience through the things around it: the hands that make it, the pause before the first mouthful, the face after it. The advert is built out of those, because they are the only footage a viewer can actually taste.',
          ],
        },
        {
          number: '03',
          title: 'Shot for appetite',
          body: [
            'Food work lives or dies on light and on timing. Steam holds for seconds. A surface goes dull almost as fast. The production is arranged so the camera is ready before the food is, rather than the other way round \u2014 and so the product is at its best in the frame where it matters most.',
          ],
        },
        {
          number: '04',
          title: 'Cut to the feeling',
          body: [
            'The edit keeps the product where the emotion peaks and stays off it everywhere else. Blend is the reason for the film; it is not the subject of every frame in it.',
          ],
        },
      ],
      delivered: ['Launch advert'],
      details: [
        { label: 'Client', value: 'ID Fresh' },
        { label: 'Category', value: 'Advert' },
        { label: 'Production type', value: 'Product launch film' },
        {
          label: 'Services',
          value: 'Concept, Direction, Cinematography, Post-production',
        },
      ],
    },
  },
  {
    number: '03',
    category: 'Advert',
    title: 'Silk Route | Advert',
    client: 'Silk Route',
    description: 'Connecting the emotions of Onam to a brand and its designs.',
    summary:
      'Silk Route, explained the need of connecting emotions of ONAM to their brand and their designs.',
    href: '/portfolio/silk-route-advert',
    /* PLACEHOLDER — no project still available yet. */
    image: '/images/services/photography.jpg',
    caseStudy: {
      standfirst:
        'An advert for Silk Route, tying the emotions of Onam to the brand and to the designs it makes.',
      objective: 'Connect the emotions of Onam to the brand and its designs.',
      chapters: [
        {
          number: '01',
          title: 'The brief',
          body: [
            'Silk Route explained the need themselves: connect the emotions of Onam to the brand, and to the designs. Two halves that most festival advertising never actually joins \u2014 the feeling and the product usually sit in separate halves of the film.',
          ],
        },
        {
          number: '02',
          title: 'Onam as the subject, not the set dressing',
          body: [
            'A festival is easy to use as decoration and hard to use as meaning. The approach was to treat Onam as what the film is about \u2014 the gathering, the preparation, the particular warmth of a house on the day \u2014 so the brand arrives inside a feeling the audience already has, rather than beside one.',
          ],
        },
        {
          number: '03',
          title: 'The designs, in motion',
          body: [
            'Cloth is a moving subject. It reads through drape, weight and the way it catches light, none of which survive a still frame. The coverage gives the designs movement and gives them the right light, so the craft in them is legible at the same time as the emotion around them.',
          ],
        },
      ],
      delivered: ['Festival advert'],
      details: [
        { label: 'Client', value: 'Silk Route' },
        { label: 'Category', value: 'Advert' },
        { label: 'Production type', value: 'Festival brand film' },
        {
          label: 'Services',
          value: 'Concept, Direction, Cinematography, Editing',
        },
      ],
    },
  },
  {
    number: '04',
    category: 'Social Media',
    title: 'MalabarGold | Social Media',
    client: 'Malabar Gold',
    description:
      'Influencer campaign with cinematic adverts for Malabar Gold’s social media.',
    summary:
      'A Social media Influencer campaign with 2 vertical adverts, we were able to provide Malabar Gold a full script to finish Advert.',
    href: '/portfolio/malabargold-social-media',
    image: '/images/works/MalabarGold-Social-Media.jpg',
    caseStudy: {
      standfirst:
        'A social media influencer campaign for Malabar Gold \u2014 two vertical adverts, taken from script all the way to finish.',
      objective:
        'Deliver a social media influencer campaign as a full script-to-finish production.',
      chapters: [
        {
          number: '01',
          title: 'The brief',
          body: [
            'Malabar Gold needed an influencer campaign for social, and needed it handled end to end. The studio provided a full script-to-finish advert \u2014 two vertical films, everything between the first page and the delivered master.',
          ],
        },
        {
          number: '02',
          title: 'Script to finish, in one house',
          body: [
            'Campaigns split across a writer, a production company and an editor lose something at every handover, and what they lose is usually the idea. Holding scripting, production and post together means the thing written on page one is the thing that ships \u2014 and that a change late in the edit can be answered rather than absorbed.',
          ],
        },
        {
          number: '03',
          title: 'Written for a vertical frame',
          body: [
            'Vertical is not a crop. It is a different composition: one subject, close, with almost no room either side. That was decided at the script stage rather than discovered in the edit, so the films are staged for the frame they were always going to play in.',
          ],
        },
        {
          number: '04',
          title: 'Made for an influencer\u2019s feed',
          body: [
            'An influencer campaign has to survive being posted next to that creator\u2019s own footage. Too polished and it reads as an interruption; too loose and the brand disappears. The two films are cut to sit in a feed and still look like Malabar Gold.',
          ],
        },
      ],
      delivered: ['Two vertical adverts', 'Full script-to-finish production'],
      details: [
        { label: 'Client', value: 'Malabar Gold' },
        { label: 'Category', value: 'Social Media' },
        { label: 'Production type', value: 'Influencer campaign, vertical' },
        {
          label: 'Services',
          value: 'Scripting, Direction, Production, Post-production',
        },
      ],
    },
  },
  {
    number: '05',
    category: 'Advert',
    title: 'Go Sands | Advert',
    client: 'Go Sands',
    description:
      'Stylish cinematic advert showcasing Dubai through the Go Sands experience.',
    summary:
      'Go Sands needed an Advert that showed off Dubai in a stylish cinematic manner, while also showing the customers of the kind of experience they would get if they chose the brand.',
    href: '/portfolio/go-sands-advert',
    image: '/images/works/Go-Sands-Advert.jpg',
    caseStudy: {
      standfirst:
        'An advert that had to do two jobs at once \u2014 show off Dubai in a stylish cinematic manner, and show a customer exactly what choosing Go Sands would feel like.',
      objective:
        'Show off Dubai cinematically while showing customers the kind of experience they would get with the brand.',
      chapters: [
        {
          number: '01',
          title: 'The brief',
          body: [
            'Go Sands needed an advert that showed off Dubai in a stylish cinematic manner, and that showed customers the kind of experience they would get if they chose the brand. Those are two films, and the whole job is making them one.',
          ],
        },
        {
          number: '02',
          title: 'Dubai as a second character',
          body: [
            'Dubai is filmed so often that the obvious frames have stopped carrying anything. Using it as a backdrop would have produced a city reel with a logo on the end. So the city is treated as a character the customer meets \u2014 present in the experience rather than behind it.',
          ],
        },
        {
          number: '03',
          title: 'Selling the experience, not the product',
          body: [
            'What Go Sands sells is a day, not an object. The coverage is built around the moments a customer would actually remember, in the order they would live them, so the film works as a preview of the experience rather than as a description of a service.',
          ],
        },
        {
          number: '04',
          title: 'Style that stays useful',
          body: [
            '\u201CStylish\u201D was in the brief, and style earns its place here by carrying information. Every choice of light, movement and pace is doing the same work: making the experience look like something worth booking.',
          ],
        },
      ],
      delivered: ['Brand advert'],
      details: [
        { label: 'Client', value: 'Go Sands' },
        { label: 'Category', value: 'Advert' },
        { label: 'Location', value: 'Dubai' },
        { label: 'Production type', value: 'Brand experience film' },
        {
          label: 'Services',
          value: 'Concept, Direction, Cinematography, Post-production',
        },
      ],
    },
  },
  {
    number: '06',
    category: 'Social Media',
    title: 'Ecovacs | Social Media',
    client: 'Ecovacs',
    description: 'Script-to-finish vertical adverts for a social campaign.',
    summary:
      'A Social media campaign with 2 vertical adverts, we were able to provide Ecovacs a full script to finish Advert.',
    href: '/portfolio/ecovacs-social-media',
    /* PLACEHOLDER — no project still available yet. */
    image: '/images/services/corporate-ads.jpg',
    caseStudy: {
      standfirst:
        'A social media campaign for Ecovacs \u2014 two vertical adverts, provided as a full script-to-finish production.',
      objective:
        'Deliver a two-film social campaign from script through to finished master.',
      chapters: [
        {
          number: '01',
          title: 'The brief',
          body: [
            'Ecovacs needed a social campaign and needed the whole of it: script, production, post, delivery. Two vertical adverts, one house, one line of responsibility.',
          ],
        },
        {
          number: '02',
          title: 'A product that has to be understood',
          body: [
            'Some products are bought on feeling. A device is bought on understanding \u2014 the viewer has to grasp what it does before anything else can land. The scripts carry that weight first, and the films are built so the demonstration is the pleasure rather than an interruption to it.',
          ],
        },
        {
          number: '03',
          title: 'Two films, not one film twice',
          body: [
            'A pair of adverts is an opportunity most campaigns waste by producing the same film at two lengths. Two vertical films can take two angles on the same product and cover more ground between them than either could alone.',
          ],
        },
      ],
      delivered: ['Two vertical adverts', 'Full script-to-finish production'],
      details: [
        { label: 'Client', value: 'Ecovacs' },
        { label: 'Category', value: 'Social Media' },
        { label: 'Production type', value: 'Social campaign, vertical' },
        {
          label: 'Services',
          value: 'Scripting, Direction, Production, Post-production',
        },
      ],
    },
  },
  {
    number: '07',
    category: 'Advert',
    title: 'Flydubai | Advert',
    client: 'flydubai',
    description:
      'Cinematic advert showcasing flydubai’s sports culture and team spirit.',
    summary:
      'The Sports and social division of flydubai wanted to showcase the activities they do, and conjoin them with the emotions of how the staff feels by participating, to attract more participation.',
    href: '/portfolio/flydubai-advert',
    image: '/images/works/flydubai-Advert.jpg',
    caseStudy: {
      standfirst:
        'A film for flydubai\u2019s sports and social division, made to show the activities they run and how it feels to take part \u2014 in order to get more people taking part.',
      objective:
        'Showcase the division\u2019s activities, conjoined with how the staff feel participating, to attract more participation.',
      chapters: [
        {
          number: '01',
          title: 'The brief',
          body: [
            'The sports and social division of flydubai wanted to showcase the activities they do, and to conjoin them with the emotions of how the staff feel by participating. The reason was stated plainly: to attract more participation.',
            'That last part changes everything. This is not a film about a company. It is a film addressed to colleagues who have not signed up yet, and it has to give them a reason to.',
          ],
        },
        {
          number: '02',
          title: 'Two things at the same time',
          body: [
            'Showing the activities is straightforward. Showing how it feels to be in them is not, and \u201Cconjoin\u201D was the brief\u2019s own word for the difficulty \u2014 the two cannot be alternated, they have to arrive together.',
            'So the activity is never covered from the outside. It is covered from where a participant would be standing.',
          ],
        },
        {
          number: '03',
          title: 'The people in it are the cast',
          body: [
            'The staff are the subject and the audience at once. Colleagues recognise a performance instantly, and nothing kills a participation film faster. The direction is built around getting real behaviour on camera rather than a version of it.',
          ],
        },
        {
          number: '04',
          title: 'Cut to be joined',
          body: [
            'The edit is measured against one question: would somebody watching this want to be in the next one? Everything that does not answer that is out, however good the frame.',
          ],
        },
      ],
      delivered: ['Internal participation film'],
      details: [
        { label: 'Client', value: 'flydubai' },
        { label: 'Category', value: 'Advert' },
        { label: 'Production type', value: 'Internal brand film' },
        {
          label: 'Services',
          value: 'Concept, Direction, Cinematography, Editing',
        },
      ],
    },
  },
  {
    number: '08',
    category: 'Advert',
    title: 'M & S Cosmetics | Advert',
    client: 'M & S Cosmetics',
    description:
      'Cinematic B2B advert highlighting M&S Cosmetics’ unique ingredients.',
    summary:
      'M&S Cosmetics apporached us for an advert that represented the brand well for a B2B presentation that focused on the ingredients and the uniqueness of the brand.',
    href: '/portfolio/ms-cosmetics-advert',
    image: '/images/works/M-S-Cosmetics-Advert.jpg',
    caseStudy: {
      standfirst:
        'A B2B advert for M&S Cosmetics, focused on the ingredients and on what makes the brand different \u2014 made for the room it would be presented in.',
      objective:
        'Represent the brand for a B2B presentation, focused on the ingredients and the uniqueness of the brand.',
      chapters: [
        {
          number: '01',
          title: 'The brief',
          body: [
            'M&S Cosmetics approached the studio for an advert that represented the brand well in a B2B presentation, focused on the ingredients and on the uniqueness of the brand.',
          ],
        },
        {
          number: '02',
          title: 'A different audience entirely',
          body: [
            'A consumer advert sells a feeling. A B2B film is shown to people who are deciding whether to stock, distribute or partner \u2014 and they are looking at what is in the product and at what nobody else has. The film is made for that viewer, which is why it opens on substance rather than on lifestyle.',
          ],
        },
        {
          number: '03',
          title: 'Ingredients, in close-up',
          body: [
            'Macro work is where cosmetics becomes cinema: texture, viscosity, the way a raw material behaves under a hard light. Shooting the ingredients this closely is what turns a claim about quality into something the room can see for itself \u2014 and it is the difference between saying a brand is unique and showing why.',
          ],
        },
      ],
      delivered: ['B2B presentation film'],
      details: [
        { label: 'Client', value: 'M & S Cosmetics' },
        { label: 'Category', value: 'Advert' },
        { label: 'Production type', value: 'B2B brand film' },
        {
          label: 'Services',
          value: 'Concept, Direction, Cinematography, Post-production',
        },
      ],
    },
  },
];

/** Looked up by the shared `/portfolio/[slug]` detail route. */
export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.href === `/portfolio/${slug}`);
}

export function getProjectSlugs(): string[] {
  return projects.map((p) => p.href.replace('/portfolio/', ''));
}

/**
 * Filter labels for the portfolio, derived from the data rather than written
 * out — a category can only appear once a project actually carries it, so the
 * bar can never offer a filter that returns nothing.
 */
export const projectCategories: string[] = [
  'All',
  ...Array.from(new Set(projects.map((p) => p.category))),
];

/** The homepage preview: the first six, shown as two rows of three. */
export const featuredProjects: Project[] = projects.slice(0, 6);

const ROW_SIZE = 3;

/**
 * Rows of three, so the grid can drop a route-through button after the last.
 *
 * Chunked rather than hard-sliced: a fixed set of slices leaves an empty
 * trailing row whenever the count is not a multiple of three, which would
 * still render the end-of-grid button under nothing.
 */
export const featuredProjectRows: Project[][] = Array.from(
  { length: Math.ceil(featuredProjects.length / ROW_SIZE) },
  (_, row) => featuredProjects.slice(row * ROW_SIZE, (row + 1) * ROW_SIZE),
);
