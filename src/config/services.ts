export interface Service {
  /** Zero-padded display number, 01–09. */
  number: string;
  title: string;
  /** Sales copy shown beneath the title on the card. */
  description: string;
  /** Route for the service's own page. */
  href: string;
  /** Still revealed on hover. Lives in /public/images/services. */
  image: string;
}

/**
 * Drives the services grid, the sitemap and — eventually — each service page,
 * so a service is defined in exactly one place.
 *
 * `image` is a still rather than a video on purpose: nine autoplaying loops in
 * one viewport costs far more bandwidth and decode time than the effect is
 * worth. Swap an entry for a `<video>` in `ServiceTile` if a particular
 * service warrants motion.
 */
export const services: Service[] = [
  {
    number: '01',
    title: 'Photography',
    description:
      'Custom photography crafted for brands, products, portraits and events, delivering timeless visuals tailored to every unique story.',
    href: '/services/photography',
    image: '/images/services/photography.jpg',
  },
  {
    number: '02',
    title: 'Videography',
    description:
      'Tailor-made films and cinematic storytelling for brands, businesses and personal projects, designed to inspire and engage audiences.',
    href: '/services/videography',
    image: '/images/services/videography-mg.jpg',
  },
  {
    number: '03',
    title: 'Corporate Ads',
    description:
      'Cinematic corporate commercials created from concept to delivery, helping brands connect, engage and leave lasting impressions.',
    href: '/services/corporate-ads',
    image: '/images/services/corporate-ads.jpg',
  },
  {
    number: '04',
    title: 'Audio Solutions',
    description:
      'Professional audio production, recording and sound design for commercials, events, podcasts and creative media projects.',
    href: '/services/audio-solutions',
    image: '/images/services/audio-solutions.jpg',
  },
  {
    number: '05',
    title: 'Post Production',
    description:
      'Expert video editing, colour grading and finishing that transforms raw footage into polished cinematic stories.',
    href: '/services/post-production',
    image: '/images/services/post-production.jpg',
  },
  {
    number: '06',
    title: 'Podcast Production',
    description:
      'Complete podcast production with recording, audio engineering, editing and delivery, creating exceptional sound for every episode.',
    href: '/services/podcast-production',
    image: '/images/services/podcast-production.jpg',
  },
  {
    number: '07',
    title: 'Event Coverage',
    description:
      'End-to-end technical AV and lighting solutions, with expertise on location, for all kinds of events — big or small.',
    href: '/services/event-coverage',
    image: '/images/services/event-coverage.jpg',
  },
  {
    number: '08',
    title: 'Home Theater Solutions',
    description:
      '7.1, ten to twenty seater, full-fledged home theater setups and installations, tailor made to customer preferences.',
    href: '/services/home-theater-solutions',
    image: '/images/services/home-theater-solutions.jpg',
  },
  {
    number: '09',
    title: 'Music Label',
    description:
      'Our premium record label, from God’s Own Country. We are destined to take original music production to levels unfathomed.',
    href: '/services/music-label',
    image: '/images/services/music-label.jpg',
  },
];
