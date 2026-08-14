import { CinematicFooter } from '@/components/layout/CinematicFooter';
import { FloatingNav } from '@/components/layout/FloatingNav';
import { CtaSection } from '@/components/sections/CtaSection';
import { LensTransition } from '@/components/sections/LensTransition';
import {
  ContactDetails,
  ContactForm,
  ContactHero,
} from '@/components/sections/contact';
import { contactCta } from '@/config/contact';
import { createMetadata } from '@/lib/seo';

export const metadata = createMetadata({
  title: 'Contact',
  description:
    'Get in touch with fcfilmwerks — a media production studio in Dubai and India specialising in pre- and post-production for films and commercials.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <>
      {/* `immediate` because there is no intro on this route to fire the event
          the nav normally waits on — without it the nav never appears here. */}
      <FloatingNav immediate />

      <ContactHero />

      <ContactDetails />

      <ContactForm />

      {/*
       * The same closing the homepage, About and Portfolio pages use, with
       * this page's words and a single action rather than the usual pair —
       * the form above is already the second path through. These three are
       * coupled by scroll geometry: the footer is pulled up a full viewport
       * to cover the lens plate, so it has to follow LensTransition —
       * dropping the lens would leave the footer overlapping the CTA by
       * 100dvh.
       */}
      <CtaSection
        label={contactCta.label}
        headline={contactCta.headline}
        body={contactCta.body}
        showLocations={false}
        primary={contactCta.primary}
        secondary={null}
      />

      <LensTransition />

      <CinematicFooter />
    </>
  );
}
