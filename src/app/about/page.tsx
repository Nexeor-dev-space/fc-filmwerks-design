import { CinematicFooter } from '@/components/layout/CinematicFooter';
import { FloatingNav } from '@/components/layout/FloatingNav';
import { CtaSection } from '@/components/sections/CtaSection';
import { LensTransition } from '@/components/sections/LensTransition';
import {
  AboutHero,
  AboutIntro,
  AboutMission,
  AboutPhilosophy,
} from '@/components/sections/about';
import { createMetadata } from '@/lib/seo';

export const metadata = createMetadata({
  title: 'About',
  description:
    'fcfilmwerks is a leading media production company specialising in pre- and post-production for films and commercials.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <>
      {/*
       * `immediate` because there is no intro on this route to fire the event
       * the nav normally waits on — without it the nav never appears here.
       */}
      <FloatingNav immediate />

      <AboutHero />

      <AboutIntro />

      <AboutPhilosophy />

      <AboutMission />

      {/*
       * The same closing the homepage uses, and deliberately not a variation:
       * these three are coupled by scroll geometry. The footer is pulled up a
       * full viewport to cover the lens plate, so it has to follow
       * LensTransition — dropping the lens here would leave the footer
       * overlapping the CTA by 100dvh.
       */}
      <CtaSection />

      <LensTransition />

      <CinematicFooter />
    </>
  );
}
