import { IntroExperience } from '@/components/intro';
import { ChapterRail } from '@/components/layout/ChapterRail';
import { CinematicFooter } from '@/components/layout/CinematicFooter';
import { FloatingNav } from '@/components/layout/FloatingNav';
import { FeaturedWorkSection } from '@/components/sections/FeaturedWorkSection';
import { Hero } from '@/components/sections/Hero';
import { LabelSection } from '@/components/sections/LabelSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ClientsSection } from '@/components/sections/ClientsSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { TrustSection } from '@/components/sections/TrustSection';
import { CtaSection } from '@/components/sections/CtaSection';
import { homeChapters } from '@/config/home';
import { createMetadata } from '@/lib/seo';

export const metadata = createMetadata({ path: '/' });

export default function HomePage() {
  return (
    <>
      <FloatingNav />

      {/* The same fixed index the About page carries. Every section below the
          hero pads its content by `xl:pl-52` so the rail has its own gutter. */}
      <ChapterRail chapters={homeChapters} label="Page sections" />

      {/* The intro pins for its scroll sequence and hands off to the hero;
          the trust strip slides over the hero and everything after it scrolls
          normally once that pin releases. */}
      <IntroExperience>
        <Hero />
      </IntroExperience>

      {/* Climbs over the pinned hero; see the note on the component. */}
      <TrustSection />

      <ServicesSection />

      <FeaturedWorkSection />

      {/* The studio's music label: more of what the house makes for itself,
          so it follows the work and precedes the studio itself. */}
      <LabelSection />

      <AboutSection />

      <ClientsSection />

      <TestimonialsSection />

      <CtaSection />

      <CinematicFooter />
    </>
  );
}
