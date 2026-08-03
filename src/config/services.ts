export interface Service {
  /** Zero-padded display number, 01–09. */
  number: string;
  title: string;
  /** Two or three supporting terms shown beneath the title. */
  keywords: string[];
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
    keywords: ['Editorial', 'Product', 'Portrait'],
    href: '/services/photography',
    image: '/images/services/photography.jpg',
  },
  {
    number: '02',
    title: 'Videography',
    keywords: ['Cinematography', 'Direction', 'Crew'],
    href: '/services/videography',
    image: '/images/services/videography.jpg',
  },
  {
    number: '03',
    title: 'Corporate Ads',
    keywords: ['Brand films', 'Campaigns', 'Strategy'],
    href: '/services/corporate-ads',
    image: '/images/services/corporate-ads.jpg',
  },
  {
    number: '04',
    title: 'Audio Solutions',
    keywords: ['Recording', 'Mixing', 'Sound design'],
    href: '/services/audio-solutions',
    image: '/images/services/audio-solutions.jpg',
  },
  {
    number: '05',
    title: 'Post Production',
    keywords: ['Editing', 'Colour', 'Finishing'],
    href: '/services/post-production',
    image: '/images/services/post-production.jpg',
  },
  {
    number: '06',
    title: 'Podcast Production',
    keywords: ['Studio', 'Series', 'Distribution'],
    href: '/services/podcast-production',
    image: '/images/services/podcast-production.jpg',
  },
  {
    number: '07',
    title: 'Event Coverage',
    keywords: ['Live', 'Multi-camera', 'Highlights'],
    href: '/services/event-coverage',
    image: '/images/services/event-coverage.jpg',
  },
  {
    number: '08',
    title: 'Home Theater Solutions',
    keywords: ['Design', 'Calibration', 'Install'],
    href: '/services/home-theater-solutions',
    image: '/images/services/home-theater-solutions.jpg',
  },
  {
    number: '09',
    title: 'Music Label',
    keywords: ['A&R', 'Production', 'Release'],
    href: '/services/music-label',
    image: '/images/services/music-label.jpg',
  },
];
