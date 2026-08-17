import { CinematicFooter } from '@/components/layout/CinematicFooter';
import { FloatingNav } from '@/components/layout/FloatingNav';
import { CtaSection } from '@/components/sections/CtaSection';
import {
  PortfolioArchive,
  PortfolioMasthead,
  PortfolioStatement,
  ProductionGallery,
} from '@/components/sections/portfolio';
import { createMetadata } from '@/lib/seo';

export const metadata = createMetadata({
  title: 'Portfolio',
  description:
    'The FC Filmwerks archive — events, adverts and social campaigns for brands across Dubai and India, filterable by discipline.',
  path: '/portfolio',
});

/**
 * The portfolio, built as an archive rather than as a second homepage.
 *
 * The page previously opened on the homepage's Featured Work header and then
 * repeated its card grid underneath, which is what made the two read as the
 * same page twice. Every band below is specific to this route: a type-first
 * masthead with a drifting filmstrip, a sticky filter rail, a twelve-track
 * composed gallery, the full production contact sheet, and the studio's
 * creative statement. Only the closing CTA is shared, and that is deliberate —
 * it is the site's sign-off, not a section.
 */
export default function PortfolioPage() {
  return (
    <>
      {/* `immediate` because there is no intro on this route to fire the event
          the nav normally waits on — without it the nav never appears here. */}
      <FloatingNav immediate />

      <PortfolioMasthead />

      <PortfolioArchive />

      <ProductionGallery />

      <PortfolioStatement />

      <CtaSection
        label="Seen something you like?"
        headline={['YOUR PROJECT,', 'IN THIS', 'ARCHIVE.']}
        body="Every film on this page began as a conversation about what a brand needed people to feel. Tell us yours and we will show you what it could become."
        showLocations={false}
        primary={{ label: 'Start a project', href: '/contact' }}
        secondary={{ label: 'View services', href: '/services' }}
      />

      <CinematicFooter />
    </>
  );
}
