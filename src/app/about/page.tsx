import { ChapterRail } from '@/components/layout/ChapterRail';
import { CinematicFooter } from '@/components/layout/CinematicFooter';
import { FloatingNav } from '@/components/layout/FloatingNav';
import {
  AboutCraft,
  AboutFilm,
  AboutMasthead,
  AboutMethod,
  AboutOnSet,
  AboutPeople,
  AboutStory,
} from '@/components/sections/about';
import { aboutChapters } from '@/config/about';
import { createMetadata } from '@/lib/seo';

export const metadata = createMetadata({
  title: 'About',
  description:
    'FC Filmwerks is a Dubai film studio founded in 2025 by award-winning director Gautam Raveendran: humane, emotional storytelling across corporate films, documentaries and original cinema, including the award-winning Blue Lily (2026).',
  path: '/about',
});

/**
 * The About page is a dossier, not a second homepage.
 *
 * It shares the brand — navy, gold, the same grain and the same easing — and
 * nothing else with `/`. No hero video wall, no Featured Work grid, no services
 * posters, and no shared `CtaSection` at the end: it opens on type, runs as
 * six numbered chapters with a fixed index beside them, and ends on the set.
 * The one component it borrows from the site chrome is the footer, which every
 * route shares by design and which carries the contact details.
 *
 * Every fact has one home. The trust figures and the client belt are on the
 * homepage and are not repeated here; the founder's record is in his biography
 * and nowhere else; the film's record is in its own chapter.
 *
 * Section order is deliberate: the studio, the two people who founded it, the
 * film that proves the claim, how the work is made, what the house holds, and
 * where it happens.
 * `aboutChapters` in `src/config/about.ts` mirrors this order and drives both
 * the rail and every chapter's number, so a chapter added here needs an entry
 * there to appear in the index.
 */
export default function AboutPage() {
  return (
    <>
      {/*
       * `immediate` because there is no intro on this route to fire the event
       * the nav normally waits on — without it the nav never appears here.
       */}
      <FloatingNav immediate />

      <ChapterRail chapters={aboutChapters} label="About chapters" />

      <AboutMasthead />

      <AboutStory />

      <AboutPeople />

      <AboutFilm />

      <AboutMethod />

      <AboutCraft />

      <AboutOnSet />

      <CinematicFooter />
    </>
  );
}
