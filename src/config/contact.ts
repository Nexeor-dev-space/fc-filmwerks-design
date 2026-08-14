/**
 * Copy and contact details for the Contact page. Kept separate from
 * `about.ts` because the wording differs even where the underlying details
 * (email, phone) are the same — those two are imported from there rather
 * than duplicated.
 */

export const contactHero = {
  label: 'Get in touch',
  headline: ["LET'S MAKE", 'SOMETHING', 'WORTH WATCHING.'],
  body: 'Have a story, campaign or idea in mind? Let’s turn it into something worth watching.',
} as const;

export const contactDetails = {
  label: 'Reach us',
  locations: ['Dubai, UAE', 'India'] as const,
} as const;

export const contactVisual = {
  image: '/images/services/videography-mg.jpg',
  imageAlt: 'A cinematographer framing a shot on set',
} as const;

export const contactForm = {
  label: 'Start a conversation',
  heading: ['TELL US', 'YOUR STORY.'],
} as const;

export const contactCta = {
  label: 'Have an idea?',
  headline: ["LET'S BUILD", 'IT TOGETHER.'],
  body: 'Every great production starts with a single message. Send us yours.',
  primary: {
    label: 'Start a conversation',
    href: 'mailto:letstalk@fcfilmwerks.com',
  },
} as const;
