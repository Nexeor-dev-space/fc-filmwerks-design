export interface Review {
  name: string;
  date: string;
  rating: number;
  quote: string;
}

/**
 * Placeholder Google Reviews.
 *
 * The names and quotes are invented to demonstrate the layout — replace with
 * real reviews before launch. Nothing in the component depends on the specific
 * wording, only on the shape.
 */
export const reviews: Review[] = [
  {
    name: 'Arjun Patel',
    date: '3 weeks ago',
    rating: 5,
    quote:
      'FC Filmwerks delivered a brand film that exceeded every expectation. From the initial brief to the final cut, their attention to detail and creative vision were outstanding. The team truly understood our story and brought it to life.',
  },
  {
    name: 'Maria Santos',
    date: '1 month ago',
    rating: 5,
    quote:
      'Absolutely world-class production. They managed to capture the essence of our brand in a way we never thought possible. Every frame feels intentional and cinematic.',
  },
  {
    name: 'David Chen',
    date: '2 months ago',
    rating: 5,
    quote:
      'We hired FC Filmwerks for our product launch video and the results speak for themselves. Views tripled compared to our previous campaigns. Professional, creative, and incredibly easy to work with.',
  },
  {
    name: 'Priya Sharma',
    date: '2 months ago',
    rating: 5,
    quote:
      "The team brought a level of artistry to our corporate film that we didn't think was possible. They turned a standard company overview into something our entire team is proud to share.",
  },
  {
    name: 'James Mitchell',
    date: '3 months ago',
    rating: 5,
    quote:
      "From concept to delivery, everything was seamless. FC Filmwerks doesn't just make videos — they craft visual stories. Our wedding film still makes us emotional every time we watch it.",
  },
  {
    name: 'Fatima Al-Hassan',
    date: '4 months ago',
    rating: 5,
    quote:
      'Exceptional quality and professionalism. They took the time to understand our vision and delivered something far beyond what we imagined. Would recommend to anyone looking for premium production.',
  },
  {
    name: 'Ravi Kumar',
    date: '5 months ago',
    rating: 5,
    quote:
      'The music video they produced for our independent release was cinematic perfection. Their understanding of pacing, lighting and mood is remarkable. Already planning our next project together.',
  },
  {
    name: 'Sophie Laurent',
    date: '6 months ago',
    rating: 5,
    quote:
      'We needed a documentary-style piece for our heritage brand and FC Filmwerks nailed it. The storytelling is authentic, the visuals are stunning, and the edit brought everything together beautifully.',
  },
];

/** Replace with the real Google Business page URL before launch. */
export const GOOGLE_REVIEWS_URL = '#';
