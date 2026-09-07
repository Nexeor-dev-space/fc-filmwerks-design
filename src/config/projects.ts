/**
 * One narrative beat of a case study.
 *
 * The number of these, and what they are called, is decided per project. That
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
 * A film the visitor can watch, played on the project's own page.
 *
 * Two forms, because the work arrives two ways. The original films are
 * published on YouTube and carry a public watch URL. The commercial work is
 * delivered as files the studio hosts itself, with nowhere to link to. Both are
 * films someone came to see, so both play in the hero behind the same poster;
 * only the player inside the frame differs.
 *
 * This is NOT the same thing as a bare `video: '/path.mp4'` string on a
 * project, which is silent background footage looping under the hero's type
 * with nothing to press. The same file can serve either role — what decides it
 * is which shape is written here.
 *
 * `orientation` is not decoration: it decides the whole shape of the hero. A
 * landscape film gets a wide plate with the title beneath it; a vertical one
 * gets a tall plate with the title set beside it, because a 9:16 frame stretched
 * to the width of a desktop screen is either enormous or marooned in black.
 * Vertical work is a real part of this studio's output, so the page is built for
 * both rather than assuming the cinema case.
 *
 * Defaults to landscape where omitted — the common case, and the safe one: a
 * landscape plate showing a vertical film letterboxes, where the reverse crops.
 */
interface ProjectFilmBase {
  /** Verb for the play control: "Watch the film", "Watch the video". */
  label: string;
  orientation?: 'landscape' | 'portrait';
  /**
   * The frame shown until the visitor presses play. Falls back to the
   * project's own `image`, which is right for a single-film project because
   * the two are the same frame. A project delivering two adverts needs two,
   * or the second plate is a poster for the first film.
   */
  poster?: string;
}

export interface PublishedFilm extends ProjectFilmBase {
  /** The `v=` id from the watch URL. */
  youtubeId: string;
  /** The public watch URL, for search engines and for anyone without JS. */
  href: string;
}

export interface HostedFilm extends ProjectFilmBase {
  /** A file under `public/videos`. Plays with sound and browser controls. */
  src: string;
}

/** Narrow with `'youtubeId' in video`; the two shapes share no required key. */
export type ProjectVideo = PublishedFilm | HostedFilm;

/**
 * The long-form content for a project page.
 *
 * PROVENANCE, and please keep this straight when editing:
 *
 * - `standfirst` and `objective` are restatements of the studio's own `summary`
 *   sentence for the project. Nothing is added to them.
 * - `chapters` are craft narrative. They describe intent and method: how the
 *   studio approaches a brief of this kind, and are written to be true of the
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
 * for it in `ProjectOutcome`; the page is built to grow that section.
 */
export interface ProjectCaseStudy {
  /** Sits under the hero, at lead size. */
  standfirst: string;
  /** What the project had to do, in the client's terms. */
  objective: string;
  /** Variable in length and in naming; see `ProjectChapter`. */
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
  /** EVENT · ADVERT · SOCIAL MEDIA: the gold line above the title. */
  category: string;
  /** Full title as the studio writes it, category included. */
  title: string;
  /**
   * One sentence, sized for a card, in the same form on every project: it
   * opens with what the film is (advert, event film, short film) and never
   * names the client, who is printed beside the category on every card.
   */
  description: string;
  /** The studio's own longer copy, verbatim, used on the detail page. */
  summary: string;
  client: string;
  /** `/portfolio/<slug>`, resolved by the shared detail route. */
  href: string;
  image: string;
  /**
   * The film, or films, the project delivered.
   *
   * One plays in the hero at its own aspect ratio. Several stack down it, in
   * the order written here — two of these jobs were campaigns of two vertical
   * adverts rather than one film, and showing only the first would misdescribe
   * the work the studio was paid for.
   *
   * A project with no film keeps the still-led hero and gets a full-bleed
   * frame further down the page instead. Every project currently has one; the
   * fallback is there for the next job that does not.
   *
   * This replaced an earlier `string` form that meant "silent background loop
   * under the hero's type". Nothing used it once the commercial films arrived,
   * and keeping a second meaning for the same field was the sort of thing that
   * gets a film shown muted and unpressable by accident.
   */
  video?: ProjectVideo | ProjectVideo[];
  /** The detail page's long form. See `ProjectCaseStudy` for provenance. */
  caseStudy: ProjectCaseStudy;
}

/**
 * The studio's work, and the single source of truth for it.
 *
 * The homepage's Featured Work grid and the Portfolio page both read from
 * here; the homepage shows a subset, so it reads as a preview of the full
 * page rather than a second, drifting list. They previously held separate
 * arrays and had already diverged on slugs and copy.
 *
 * ORDER: the studio's own releases lead: two original films and a music
 * video, because original work is what the studio now leads with, and the
 * commercial work follows in its existing order. `number` is display-only and
 * follows array position.
 *
 * IMAGES: six of the eight commercial projects have real stills in
 * `public/images/works`. Silk Route and Ecovacs do not, and point at
 * production stills from `public/images/services` as visible placeholders;
 * swap them for the real frames when those exist. Paths are URL-encoded where the filename carries a
 * space, because `next/image` passes `src` into the optimiser query string.
 * The originals use their release key art.
 */
export const projects: Project[] = [
  {
    number: '01',
    category: 'Original Film',
    title: 'Blue Lily | Original Film',
    client: 'FC Filmwerks original',
    description:
      'Award-winning Malayalam short film, recognised at five international festivals.',
    summary:
      'Blue Lily (2026), an award-winning independent film production, recognised at the Calgary Independent Film Festival, Buddha International Film Festival, MEI Film Festival, IFA Abu Dhabi International Film Festival and IIFF; screened theatrically in Kochi and Dubai.',
    href: '/portfolio/blue-lily',
    /* The film's key art, taken from its release. Swap for a clean 16:9 still
       when the studio supplies one. */
    image: '/images/works/Blue-Lily-Short-Film.jpg',
    video: {
      youtubeId: 't8Jze5uBMr4',
      label: 'Watch the film',
      href: 'https://www.youtube.com/watch?v=t8Jze5uBMr4',
    },
    caseStudy: {
      standfirst:
        'The studio\u2019s award-winning original short film, directed by founder Gautam Raveendran, produced by co-founder Mini Nair, and recognised at five international festivals.',
      objective:
        'Prove, on screen and with no client brief to lean on, that humane storytelling and polished technical execution belong in the same frame.',
      chapters: [
        {
          number: '01',
          title: 'Why an original',
          body: [
            'FC Filmwerks was founded on an observation: that the market it works in was short of humane, emotional storytelling. An original film is where a claim like that gets tested. There is no brief to interpret and no brand to serve, only the work.',
          ],
        },
        {
          number: '02',
          title: 'Emotion as the brief',
          body: [
            'The studio\u2019s method runs Listen, Emote, Visualise, Repeat. With no client to listen to, the listening is done to the story: the one feeling an audience should leave with. Casting, location and the length of a shot are decisions about that feeling before they are decisions about craft.',
          ],
        },
        {
          number: '03',
          title: 'Picture and sound, together',
          body: [
            'The founder\u2019s technical grounding runs across production and post, and it shows in how the film was built: picture and sound were designed as one rather than assembled in sequence. The grade and the mix are where the feeling is finished, not where it is added.',
          ],
        },
        {
          number: '04',
          title: 'On the circuit',
          body: [
            'Blue Lily was recognised at five international festivals: Best Director and Best Actress at The Buddha International Film Festival, Special Jury Awards at IFA Film Festival Abu Dhabi and IIFF, and official selections at MEI International and Calgary Independent. It screened theatrically in Kochi and Dubai.',
          ],
        },
      ],
      delivered: [
        'Original short film',
        'Theatrical screenings in Kochi and Dubai',
        'Festival run across five international festivals',
      ],
      details: [
        { label: 'Title', value: 'Blue Lily (2026)' },
        { label: 'Category', value: 'Original film' },
        { label: 'Director', value: 'Gautam Raveendran' },
        { label: 'Producer', value: 'Mini Nair' },
        { label: 'Language', value: 'Malayalam' },
        {
          label: 'Honours',
          value:
            'Best Director and Best Actress, The Buddha International Film Festival; Special Jury Award, IFA Film Festival Abu Dhabi; Special Jury Award, IIFF',
        },
        {
          label: 'Selections',
          value:
            'MEI International Film Festival; Calgary Independent Film Festival',
        },
      ],
    },
  },
  {
    number: '02',
    category: 'Original Film',
    title: 'Your Place or Mine | Original Film',
    client: 'Produced by Mini Nair',
    description:
      'Award-winning Malayalam short-film thriller, released with English subtitles.',
    summary:
      'Your Place or Mine, an award-winning Malayalam short film thriller, with English subtitles, produced by FC Filmwerks co-founder Mini Nair.',
    href: '/portfolio/your-place-or-mine',
    /* Key art from the film's release. Swap for a clean still when available. */
    image: '/images/works/Your-Place-or-Mine-Short-Film.jpg',
    video: {
      youtubeId: 'uay8q07Xt5k',
      label: 'Watch the film',
      href: 'https://youtu.be/uay8q07Xt5k',
    },
    caseStudy: {
      standfirst:
        'A Malayalam short-film thriller, with English subtitles, produced by co-founder Mini Nair.',
      objective:
        'Hold an audience in suspense for the length of a short, with performance and pacing doing the work.',
      chapters: [
        {
          number: '01',
          title: 'A thriller in miniature',
          body: [
            'A short film has none of the room a feature has to earn tension slowly: the genre must be established in the first minute and paid off before the audience has settled. A small cast, a tight premise, and a title that is already a question.',
          ],
        },
        {
          number: '02',
          title: 'Performance first',
          body: [
            'Producing for a thriller means protecting the actors\u2019 time above almost everything else. The schedule is built around the scenes that carry the suspense, so the performances that hold the film are shot when the cast is freshest rather than fitted in around the logistics.',
          ],
        },
        {
          number: '03',
          title: 'Cut for tension',
          body: [
            'The edit is where a thriller is finally made. Information is released a beat later than the audience wants it, and the sound design is doing at least half of the frightening. English subtitles were part of the delivery from the start.',
          ],
        },
      ],
      delivered: ['Original short film', 'English-subtitled release'],
      details: [
        { label: 'Title', value: 'Your Place or Mine' },
        { label: 'Category', value: 'Original film' },
        { label: 'Genre', value: 'Thriller' },
        { label: 'Producer', value: 'Mini Nair' },
        { label: 'Language', value: 'Malayalam, with English subtitles' },
      ],
    },
  },
  {
    number: '03',
    category: 'Music Video',
    title: 'Determined | Music Video',
    client: 'SKV',
    description:
      'English rap tribute to People of Determination, launched at a public event at World Trade Centre Dubai.',
    summary:
      'Released music video Determined, an inspirational English rap tribute to People of Determination, launched and released at a public event at World Trade Centre Dubai, attended by 600 people.',
    href: '/portfolio/determined',
    /* Key art from the video's release, with the letterbox bars cropped off
       so it fills a frame. Swap for a clean still when available. */
    image: '/images/works/Determined-Music-Video.jpg',
    video: {
      youtubeId: '_HGVxmnpUe0',
      label: 'Watch the video',
      href: 'https://www.youtube.com/watch?v=_HGVxmnpUe0',
    },
    caseStudy: {
      standfirst:
        'An inspirational English rap tribute to People of Determination, launched and released at a public event at World Trade Centre Dubai, before an audience of six hundred.',
      objective:
        'Give a tribute to People of Determination a film worthy of its subject, and a launch worthy of the film.',
      chapters: [
        {
          number: '01',
          title: 'A tribute, not a showcase',
          body: [
            'People of Determination is the UAE\u2019s own term, and it sets the register for everything in the film. A tribute has to carry dignity before it carries anything else: the subject is not a backdrop for the track, it is the reason the track exists.',
          ],
        },
        {
          number: '02',
          title: 'Cut to the bar',
          body: [
            'A music video is edited to the track, not around it. Performance, movement and cut all land on the beat. The camera stays close, because the intensity of a performance lives in a face, not in a wide shot.',
          ],
        },
        {
          number: '03',
          title: 'Six hundred in the room',
          body: [
            'The video was launched at a public event at World Trade Centre Dubai, in front of six hundred people. A release like that is itself a production: a room, a screen, a moment that has to land once.',
          ],
        },
      ],
      delivered: [
        'Official music video',
        'Public launch event at World Trade Centre Dubai',
      ],
      details: [
        { label: 'Title', value: 'Determined' },
        { label: 'Category', value: 'Music video' },
        { label: 'Artist', value: 'SKV' },
        { label: 'Language', value: 'English' },
        {
          label: 'Launched',
          value: 'World Trade Centre Dubai, public event, audience of 600',
        },
      ],
    },
  },
  {
    number: '04',
    category: 'Event',
    title: 'Cleveland Clinic | Event',
    client: 'Cleveland Clinic',
    description:
      'An event for Cleveland Clinic and the Steppi app: early launch and demo coverage, shot in a cinematic manner.',
    summary:
      'An Event for Cleveland and Steppi App. Steppi’s Early Launch and Demo Event coverage done in a cinematic manner.',
    href: '/portfolio/cleveland-clinic-event',
    image: '/images/works/Cleveland-Clinic-Event.jpg',
    video: {
      src: '/videos/portfolio/ClevelandClinic.mp4',
      label: 'Watch the film',
    },
    caseStudy: {
      standfirst:
        'An event for Cleveland and the Steppi app. Steppi\u2019s early launch and demo event coverage, done in a cinematic manner.',
      objective:
        'Cover Steppi\u2019s early launch and demo event in a cinematic manner.',
      chapters: [
        {
          number: '01',
          title: 'A room that happens once',
          body: [
            'Cleveland Clinic and Steppi brought the studio in for the app\u2019s early launch and demo. An event has no second take: the demo is given once, the room reacts once, and whatever is not covered when it happens is simply not in the film.',
          ],
        },
        {
          number: '02',
          title: 'Covering it as a film',
          body: [
            '\u201CIn a cinematic manner\u201D was the brief\u2019s own phrase, and it decides the coverage. A record of an event points the camera at whoever is speaking; a film of an event also holds on the listening, which is what makes the cut watchable.',
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
    number: '05',
    category: 'Advert',
    title: 'ID Fresh - Blend | Advert',
    client: 'ID Fresh',
    description:
      'Advert for a new product, Blend, built around the emotion attached to its taste.',
    summary:
      'ID’s brand came up with a new product by the name of Blend and wanted us to showcase the emotion attached to the taste of the product.',
    href: '/portfolio/id-fresh-blend-advert',
    image: '/images/works/ID-Fresh-Blend-Advert.jpg',
    video: {
      src: '/videos/portfolio/fresh_placeholder.mp4',
      label: 'Watch the film',
    },
    caseStudy: {
      standfirst:
        'ID\u2019s brand came up with a new product by the name of Blend, and wanted us to showcase the emotion attached to the taste of the product.',
      objective: 'Showcase the emotion attached to the taste of the product.',
      chapters: [
        {
          number: '01',
          title: 'The brief',
          body: [
            'ID\u2019s brand had a new product, Blend, and a launch to make. What they asked for was not a product demonstration. They asked the studio to showcase the emotion attached to the taste, which is a harder brief, and a better one.',
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
            'Food work lives or dies on light and on timing. Steam holds for seconds; a surface goes dull almost as fast. The production is arranged so the camera is ready before the food is, rather than the other way round.',
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
    number: '06',
    category: 'Advert',
    title: 'Silk Route | Advert',
    client: 'Silk Route',
    description:
      'Onam advert connecting the emotion of the festival to the brand and its designs.',
    summary:
      'Silk Route, explained the need of connecting emotions of ONAM to their brand and their designs.',
    href: '/portfolio/silk-route-advert',
    /* PLACEHOLDER: no project still available yet. */
    image: '/images/works/Silk-Route-Advert.jpg',
    video: {
      src: '/videos/portfolio/SilkRoute.mp4',
      label: 'Watch the film',
    },
    caseStudy: {
      standfirst:
        'Silk Route explained the need of connecting the emotions of Onam to their brand and their designs.',
      objective: 'Connect the emotions of Onam to the brand and its designs.',
      chapters: [
        {
          number: '01',
          title: 'The brief',
          body: [
            'Silk Route explained the need themselves: connect the emotions of Onam to the brand, and to the designs. Two halves that most festival advertising never actually joins: the feeling and the product usually sit in separate halves of the film.',
          ],
        },
        {
          number: '02',
          title: 'Onam as the subject, not the set dressing',
          body: [
            'A festival is easy to use as decoration and hard to use as meaning. Onam is treated as what the film is about, so the brand arrives inside a feeling the audience already has rather than beside one.',
          ],
        },
        {
          number: '03',
          title: 'The designs, in motion',
          body: [
            'Cloth is a moving subject. It reads through drape, weight and the way it catches light, none of which survive a still frame. The coverage gives the designs movement and the right light, so the craft in them is legible.',
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
    number: '07',
    category: 'Social Media',
    title: 'MalabarGold | Social Media',
    client: 'Malabar Gold',
    description:
      'Social media influencer campaign of two vertical adverts, scripted to finish in-house.',
    summary:
      'A Social media Influencer campaign with 2 vertical adverts, we were able to provide Malabar Gold a full script to finish Advert.',
    href: '/portfolio/malabargold-social-media',
    image: '/images/works/MalabarGold-Social-Media-1.jpg',
    video: [
      {
        src: '/videos/portfolio/Malabar-Gold-1-FCF.mp4',
        label: 'Watch the first advert',
        orientation: 'portrait',
      },
      {
        src: '/videos/portfolio/Malabar-Gold-2-FCF.mp4',
        label: 'Watch the second advert',
        orientation: 'portrait',
        poster: '/images/works/MalabarGold-Social-Media-2.jpg',
      },
    ],
    caseStudy: {
      standfirst:
        'A social media influencer campaign with two vertical adverts. We were able to provide Malabar Gold a full script-to-finish advert.',
      objective:
        'Deliver a social media influencer campaign as a full script-to-finish production.',
      chapters: [
        {
          number: '01',
          title: 'The brief',
          body: [
            'Malabar Gold needed an influencer campaign for social, and needed it handled end to end. The studio provided a full script-to-finish advert: two vertical films, everything between the first page and the delivered master.',
          ],
        },
        {
          number: '02',
          title: 'Script to finish, in one house',
          body: [
            'Campaigns split across a writer, a production company and an editor lose something at every handover, and what they lose is usually the idea. Holding scripting, production and post in one house means the thing written on page one is the thing that ships.',
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
    number: '08',
    category: 'Advert',
    title: 'Go Sands | Advert',
    client: 'Go Sands',
    description:
      'Advert showing off Dubai in a stylish, cinematic manner, and the experience the brand offers.',
    summary:
      'Go Sands needed an Advert that showed off Dubai in a stylish cinematic manner, while also showing the customers of the kind of experience they would get if they chose the brand.',
    href: '/portfolio/go-sands-advert',
    image: '/images/works/Go-Sands-Advert.jpg',
    video: {
      src: '/videos/portfolio/GO-SANDS-FCF.mp4',
      label: 'Watch the film',
    },
    caseStudy: {
      standfirst:
        'Go Sands needed an advert that showed off Dubai in a stylish cinematic manner, while also showing customers the kind of experience they would get if they chose the brand.',
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
            'Dubai is filmed so often that the obvious frames have stopped carrying anything. Using it as a backdrop would have produced a city reel with a logo on the end. So the city is treated as a character the customer meets, present in the experience rather than behind it.',
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
    number: '09',
    category: 'Social Media',
    title: 'Ecovacs | Social Media',
    client: 'Ecovacs',
    description:
      'Social media campaign of two vertical adverts, scripted to finish in-house.',
    summary:
      'A Social media campaign with 2 vertical adverts, we were able to provide Ecovacs a full script to finish Advert.',
    href: '/portfolio/ecovacs-social-media',
    /* PLACEHOLDER: no project still available yet. */
    image: '/images/works/Ecovacs-Social-Media-1.jpg',
    video: [
      {
        src: '/videos/portfolio/Ecovas-1-FCF.mp4',
        label: 'Watch the first advert',
        orientation: 'portrait',
      },
      {
        src: '/videos/portfolio/Ecovas-2-FCF.mp4',
        label: 'Watch the second advert',
        orientation: 'portrait',
        poster: '/images/works/Ecovacs-Social-Media-2.jpg',
      },
    ],
    caseStudy: {
      standfirst:
        'A social media campaign with two vertical adverts. We were able to provide Ecovacs a full script-to-finish advert. Watch to find out.',
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
            'Some products are bought on feeling. A device is bought on understanding: the viewer has to grasp what it does before anything else can land. The scripts carry that weight first, and the films are built so the demonstration is the pleasure rather than an interruption to it.',
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
    number: '10',
    category: 'Advert',
    title: 'Flydubai | Advert',
    client: 'flydubai',
    description:
      'Advert for the airline\u2019s sports and social division, made to grow staff participation.',
    summary:
      'The Sports and social division of flydubai wanted to showcase the activities they do, and conjoin them with the emotions of how the staff feels by participating, to attract more participation.',
    href: '/portfolio/flydubai-advert',
    image: '/images/works/flydubai-Advert.jpg',
    video: {
      src: '/videos/portfolio/Fly-Dubai-FCF.mp4',
      label: 'Watch the film',
    },
    caseStudy: {
      standfirst:
        'The sports and social division of flydubai wanted to showcase the activities they do, and conjoin them with the emotions of how the staff feel by participating, to attract more participation.',
      objective:
        'Showcase the division\u2019s activities, conjoined with how the staff feel participating, to attract more participation.',
      chapters: [
        {
          number: '01',
          title: 'The brief',
          body: [
            'The sports and social division of flydubai wanted to showcase the activities they run and conjoin them with how the staff feel taking part, in order to attract more participation. That last part changes everything: this is a film addressed to colleagues who have not signed up yet.',
          ],
        },
        {
          number: '02',
          title: 'Two things at the same time',
          body: [
            'Showing the activities is straightforward. Showing how it feels to be in them is not, and \u201Cconjoin\u201D was the brief\u2019s own word for the difficulty. So the activity is never covered from the outside.',
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
    number: '11',
    category: 'Advert',
    title: 'M & S Cosmetics | Advert',
    client: 'M & S Cosmetics',
    description:
      'B2B advert focused on the ingredients and what makes the brand unique.',
    summary:
      'M&S Cosmetics apporached us for an advert that represented the brand well for a B2B presentation that focused on the ingredients and the uniqueness of the brand.',
    href: '/portfolio/ms-cosmetics-advert',
    image: '/images/works/M-S-Cosmetics-Advert.jpg',
    video: {
      src: '/videos/portfolio/cosmetics.mp4',
      label: 'Watch the film',
    },
    caseStudy: {
      standfirst:
        'M & S Cosmetics approached us for an advert that represented the brand well for a B2B presentation, focused on the ingredients and the uniqueness of the brand.',
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
            'A consumer advert sells a feeling. A B2B film is shown to people deciding whether to stock, distribute or partner, and they are looking at what is in the product. The film opens on substance rather than on lifestyle.',
          ],
        },
        {
          number: '03',
          title: 'Ingredients, in close-up',
          body: [
            'Macro work is where cosmetics becomes cinema: texture, viscosity, the way a raw material behaves under a hard light. Shooting the ingredients this closely is the difference between saying a brand is unique and showing why.',
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
 * The title without its category suffix.
 *
 * The studio writes titles as `Name | Category`, and that full form is kept
 * in `title` for the case study's heading and its metadata. A card already
 * prints the category on its own line, so the suffix would say it twice;
 * cards show this instead. A title with no separator comes back as written.
 */
export function projectName(project: Project): string {
  const [name] = project.title.split(' | ');
  return name || project.title;
}

/**
 * Filter labels for the portfolio, derived from the data rather than written
 * out: a category can only appear once a project actually carries it, so the
 * bar can never offer a filter that returns nothing.
 */
export const projectCategories: string[] = [
  'All',
  ...Array.from(new Set(projects.map((p) => p.category))),
];

/**
 * The homepage preview: one row of three, under the film.
 *
 * Curated by slug rather than sliced from the front, so the row can show the
 * range of the work, an advert, an event and a music video, in a deliberate
 * order. Blue Lily is not here because it leads the same section as a row of
 * its own; showing the same key art twice would cheapen both. An unknown slug
 * is simply skipped, so a renamed project cannot break the grid; it just
 * leaves a gap to notice.
 */
const FEATURED_SLUGS = [
  'flydubai-advert',
  'cleveland-clinic-event',
  'determined',
];

export const featuredProjects: Project[] = FEATURED_SLUGS.map((slug) =>
  getProjectBySlug(slug),
).filter((project): project is Project => project !== undefined);

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
