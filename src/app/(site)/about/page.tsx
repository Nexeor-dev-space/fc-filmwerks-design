import { FloatingNav } from '@/components/layout/FloatingNav';
import { CinematicFooter } from '@/components/layout/CinematicFooter';
import { AboutSection } from '@/components/sections/AboutSection';
import { LensTransition } from '@/components/sections/LensTransition';

import { createMetadata } from '@/lib/seo';

export const metadata = createMetadata({ path: '/about' });

export default function AboutPage() {
  return (
    <>
      <FloatingNav />
      <AboutSection isStandalone />
      <LensTransition />
      <CinematicFooter />
    </>
  );
}
