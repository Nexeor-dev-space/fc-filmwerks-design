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
  /** Optional video asset for the project. Can be a direct video URL string or an object with YouTube details. */
  video?: string | { youtubeId: string; label: string; href: string };
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
            'FC Filmwerks was founded on an observation: that the market it works in was short of humane, emotional storytelling. A claim like that is easy to make in a pitch and hard to make on a screen. An original film is where it gets tested, there is no brief to interpret, no brand to serve, and nothing to hide behind but the work.',
            'Blue Lily is that test. Every discipline the studio offers a client, from script and direction to sound, edit and grade, was brought to bear on a story the studio chose for itself.',
          ],
        },
        {
          number: '02',
          title: 'Emotion as the brief',
          body: [
            'The studio\u2019s method runs Listen, Emote, Visualise, Repeat, and an original film is the purest version of it. With no client to listen to, the listening is done to the story: what it is about, who it is for, and the one feeling an audience should leave with.',
            'That feeling decides everything downstream. Casting, location, the length of a shot, the choice to hold on a face rather than cut away: each is a decision about emotion before it is a decision about craft.',
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
            'Blue Lily was recognised at five international festivals, taking Best Director and Best Actress at The Buddha International Film Festival and Special Jury Awards at IFA Film Festival Abu Dhabi and IIFF, with official selections at MEI International Film Festival and the Calgary Independent Film Festival. It screened theatrically in Kochi and Dubai.',
            'For a studio founded in 2025, that is the record the rest of the work stands on.',
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
            'A short film has none of the room a feature has to earn tension slowly. The genre has to be established in the first minute and paid off before the audience has settled. Your Place or Mine works inside that constraint rather than against it: a small cast, a tight premise, and a title that is already a question.',
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
            'The edit is where a thriller is finally made. Information is released a beat later than the audience wants it, and the sound design is doing at least half of the frightening. English subtitles were part of the delivery from the start, so the film could travel beyond a Malayalam-speaking audience.',
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
            'So the film is built the way the studio builds everything: the feeling first, then the frame. What an audience should leave with is decided before the first shot is planned, and every choice after that is measured against it.',
          ],
        },
        {
          number: '02',
          title: 'Cut to the bar',
          body: [
            'A music video is edited to the track, not around it. Performance, movement and cut all land on the beat, and the rhythm of the rap decides the rhythm of the picture. The camera stays close, because the intensity of a performance lives in a face, not in a wide shot.',
          ],
        },
        {
          number: '03',
          title: 'Six hundred in the room',
          body: [
            'The video was launched and released at a public event at World Trade Centre Dubai, in front of six hundred people. A release like that is itself a production: a room, a screen, a moment that has to land once. The studio\u2019s events background is what made it the natural way to put the film into the world.',
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
      'Event film of the Steppi app’s early launch and demo, covered cinematically.',
    summary:
      'An Event for Cleveland and Steppi App. Steppi’s Early Launch and Demo Event coverage done in a cinematic manner.',
    href: '/portfolio/cleveland-clinic-event',
    image: '/images/works/Cleveland%20Clinic-Event.jpg',
    video: '/videos/portfolio/ClevelandClinic.mp4',
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
            '\u201CIn a cinematic manner\u201D was the brief\u2019s own phrase, and it decides the coverage. A record of an event points the camera at whoever is speaking. A film of an event also holds on the listening: the demo landing, the question from the floor, the moment a room understands what it is being shown.',
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
    number: '05',
    category: 'Advert',
    title: 'ID Fresh - Blend | Advert',
    client: 'ID Fresh',
    description:
      'Launch advert for Blend, built around the emotion attached to its taste.',
    summary:
      'ID’s brand came up with a new product by the name of Blend and wanted us to showcase the emotion attached to the taste of the product.',
    href: '/portfolio/id-fresh-blend-advert',
    image: '/images/works/ID-Fresh-Blend-Advert.jpg',
    video: '/videos/portfolio/fresh_placeholder.mp4',
    caseStudy: {
      standfirst:
        'A launch advert for Blend, a new product from ID Fresh, built around the emotion attached to the way it tastes.',
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
            'Food work lives or dies on light and on timing. Steam holds for seconds. A surface goes dull almost as fast. The production is arranged so the camera is ready before the food is, rather than the other way round, and so the product is at its best in the frame where it matters most.',
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
      'Festival advert tying the emotions of Onam to the brand and its designs.',
    summary:
      'Silk Route, explained the need of connecting emotions of ONAM to their brand and their designs.',
    href: '/portfolio/silk-route-advert',
    /* PLACEHOLDER: no project still available yet. */
    image: '/images/services/photography.jpg',
    video: '/videos/portfolio/SilkRoute.mp4',
    caseStudy: {
      standfirst:
        'An advert for Silk Route, tying the emotions of Onam to the brand and to the designs it makes.',
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
            'A festival is easy to use as decoration and hard to use as meaning. The approach was to treat Onam as what the film is about: the gathering, the preparation, the particular warmth of a house on the day, so the brand arrives inside a feeling the audience already has, rather than beside one.',
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
    number: '07',
    category: 'Social Media',
    title: 'MalabarGold | Social Media',
    client: 'Malabar Gold',
    description:
      'Influencer campaign of two vertical adverts, taken from script to finished master.',
    summary:
      'A Social media Influencer campaign with 2 vertical adverts, we were able to provide Malabar Gold a full script to finish Advert.',
    href: '/portfolio/malabargold-social-media',
    image: '/images/works/MalabarGold-Social-Media.jpg',
    caseStudy: {
      standfirst:
        'A social media influencer campaign for Malabar Gold: two vertical adverts, taken from script all the way to finish.',
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
            'Campaigns split across a writer, a production company and an editor lose something at every handover, and what they lose is usually the idea. Holding scripting, production and post together means the thing written on page one is the thing that ships, and that a change late in the edit can be answered rather than absorbed.',
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
      'Advert showing off Dubai in style, and the experience customers get by choosing the brand.',
    summary:
      'Go Sands needed an Advert that showed off Dubai in a stylish cinematic manner, while also showing the customers of the kind of experience they would get if they chose the brand.',
    href: '/portfolio/go-sands-advert',
    image: '/images/works/Go-Sands-Advert.jpg',
    caseStudy: {
      standfirst:
        'An advert that had to do two jobs at once: show off Dubai in a stylish cinematic manner, and show a customer exactly what choosing Go Sands would feel like.',
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
      'Social campaign of two vertical adverts, taken from script to finished master.',
    summary:
      'A Social media campaign with 2 vertical adverts, we were able to provide Ecovacs a full script to finish Advert.',
    href: '/portfolio/ecovacs-social-media',
    /* PLACEHOLDER: no project still available yet. */
    image: '/images/services/corporate-ads.jpg',
    caseStudy: {
      standfirst:
        'A social media campaign for Ecovacs: two vertical adverts, provided as a full script-to-finish production.',
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
      'Advert for the airline’s sports and social division, made to grow staff participation.',
    summary:
      'The Sports and social division of flydubai wanted to showcase the activities they do, and conjoin them with the emotions of how the staff feels by participating, to attract more participation.',
    href: '/portfolio/flydubai-advert',
    image: '/images/works/flydubai-Advert.jpg',
    caseStudy: {
      standfirst:
        'A film for flydubai\u2019s sports and social division, made to show the activities they run and how it feels to take part, in order to get more people taking part.',
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
            'Showing the activities is straightforward. Showing how it feels to be in them is not, and \u201Cconjoin\u201D was the brief\u2019s own word for the difficulty: the two cannot be alternated, they have to arrive together.',
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
    number: '11',
    category: 'Advert',
    title: 'M & S Cosmetics | Advert',
    client: 'M & S Cosmetics',
    description:
      'B2B advert focused on the brand’s ingredients and uniqueness, made for the presentation room.',
    summary:
      'M&S Cosmetics apporached us for an advert that represented the brand well for a B2B presentation that focused on the ingredients and the uniqueness of the brand.',
    href: '/portfolio/ms-cosmetics-advert',
    image: '/images/works/M-S-Cosmetics-Advert.jpg',
    video: '/videos/portfolio/cosmetics.mp4',
    caseStudy: {
      standfirst:
        'A B2B advert for M&S Cosmetics, focused on the ingredients and on what makes the brand different, made for the room it would be presented in.',
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
            'A consumer advert sells a feeling. A B2B film is shown to people who are deciding whether to stock, distribute or partner, and they are looking at what is in the product and at what nobody else has. The film is made for that viewer, which is why it opens on substance rather than on lifestyle.',
          ],
        },
        {
          number: '03',
          title: 'Ingredients, in close-up',
          body: [
            'Macro work is where cosmetics becomes cinema: texture, viscosity, the way a raw material behaves under a hard light. Shooting the ingredients this closely is what turns a claim about quality into something the room can see for itself, and it is the difference between saying a brand is unique and showing why.',
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
