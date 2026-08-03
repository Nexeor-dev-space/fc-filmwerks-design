import { IntroExperience } from '@/components/intro';
import { Hero } from '@/components/sections/Hero';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { createMetadata } from '@/lib/seo';

export const metadata = createMetadata({ path: '/' });

export default function HomePage() {
  return (
    <>
      {/* The intro pins for its scroll sequence and hands off to the hero;
          everything after it scrolls normally once that pin releases. */}
      <IntroExperience>
        <Hero />
      </IntroExperience>

      <ServicesSection />
    </>
  );
}
