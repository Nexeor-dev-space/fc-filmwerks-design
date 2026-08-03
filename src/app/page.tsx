import { IntroExperience } from '@/components/intro';
import { Hero } from '@/components/sections/Hero';
import { createMetadata } from '@/lib/seo';

export const metadata = createMetadata({ path: '/' });

export default function HomePage() {
  return (
    <IntroExperience>
      <Hero />
    </IntroExperience>
  );
}
