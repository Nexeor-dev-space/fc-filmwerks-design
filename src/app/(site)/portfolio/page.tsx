

import { PortfolioGrid } from '@/components/sections/PortfolioGrid';
import { LensTransition } from '@/components/sections/LensTransition';
import { CtaSection } from '@/components/sections/CtaSection';
import { createMetadata } from '@/lib/seo';
import { FloatingNav } from '@/components/layout/FloatingNav';
import { CinematicFooter } from '@/components/layout/CinematicFooter';

export const metadata = createMetadata({ path: '/portfolio' });

export default function PortfolioPage() {
  return (
    <>
      <FloatingNav />
      <PortfolioGrid />
      <LensTransition />
      <CinematicFooter />
    </>
  );
}
