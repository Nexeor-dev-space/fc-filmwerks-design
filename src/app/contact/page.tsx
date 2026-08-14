import { CinematicFooter } from '@/components/layout/CinematicFooter';
import { FloatingNav } from '@/components/layout/FloatingNav';
import { CtaSection } from '@/components/sections/CtaSection';
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

      {/* The site's standard closing, matching the homepage. */}
      <CtaSection
        label={contactCta.label}
        headline={contactCta.headline}
        body={contactCta.body}
        showLocations={false}
        primary={contactCta.primary}
        secondary={null}
      />

      <CinematicFooter />
    </>
  );
}
