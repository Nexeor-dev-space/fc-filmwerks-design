import { CinematicFooter } from '@/components/layout/CinematicFooter';
import { FloatingNav } from '@/components/layout/FloatingNav';
import { CtaSection } from '@/components/sections/CtaSection';
import { LensTransition } from '@/components/sections/LensTransition';
import {
  BehindTheFrame,
  PortfolioGallery,
  PortfolioHero,
} from '@/components/sections/portfolio';
import { createMetadata } from '@/lib/seo';

export const metadata = createMetadata({
  title: 'Portfolio',
  description:
    'Selected films, campaigns and commercials by FC Filmwerks — events, adverts and social media work for brands across Dubai and India.',
  path: '/portfolio',
});

export default function PortfolioPage() {
  return (
    <>
      {/* `immediate` because there is no intro on this route to fire the event
          the nav normally waits on — without it the nav never appears here. */}
      <FloatingNav immediate />

      <PortfolioHero />

      <PortfolioGallery />

      {/* The production side, deliberately quieter than the project cards
          above it — see the note in the component. */}
      <BehindTheFrame />

      {/*
       * The same closing the homepage and About page use, with this page's
       * words. These three are coupled by scroll geometry: the footer is
       * pulled up a full viewport to cover the lens plate, so it has to follow
       * LensTransition — dropping the lens would leave the footer overlapping
       * the CTA by 100dvh.
       */}
      <CtaSection
        label="Have a story to tell?"
        headline={["LET'S BUILD", 'TOGETHER.']}
        body="Every great production begins with a conversation. Tell us what you have in mind and we will show you what it could become."
        showLocations={false}
        primary={{ label: 'Start a project', href: '/contact' }}
        secondary={{ label: 'Contact us', href: '/contact' }}
      />

      <LensTransition />

      <CinematicFooter />
    </>
  );
}
