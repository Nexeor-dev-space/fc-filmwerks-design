import { IntroExperience } from '@/components/intro';
import { FloatingNav } from '@/components/layout/FloatingNav';
import { FeaturedWorkSection } from '@/components/sections/FeaturedWorkSection';
import { Hero } from '@/components/sections/Hero';
import { AboutSection } from '@/components/sections/AboutSection';
import { ClientsSection } from '@/components/sections/ClientsSection';
import { ManifestoSection } from '@/components/sections/ManifestoSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { CtaSection } from '@/components/sections/CtaSection';
import { createMetadata } from '@/lib/seo';

export const metadata = createMetadata({ path: '/' });

export default function HomePage() {
  return (
    <>
      <FloatingNav />

      {/* The intro pins for its scroll sequence and hands off to the hero;
          everything after it scrolls normally once that pin releases. */}
      <IntroExperience>
        <Hero />
      </IntroExperience>

      <ServicesSection />

      <FeaturedWorkSection />

      <ManifestoSection />

      <AboutSection />

      <ClientsSection />

      <TestimonialsSection />

      <CtaSection />
    </>
  );
}
