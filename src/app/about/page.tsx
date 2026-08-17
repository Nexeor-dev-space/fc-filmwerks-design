import { CinematicFooter } from '@/components/layout/CinematicFooter';
import { FloatingNav } from '@/components/layout/FloatingNav';
import {
  AboutChapterRail,
  AboutClosing,
  AboutCraft,
  AboutMasthead,
  AboutMethod,
  AboutOnSet,
  AboutPeople,
  AboutRecord,
  AboutStory,
} from '@/components/sections/about';
import { createMetadata } from '@/lib/seo';

export const metadata = createMetadata({
  title: 'About',
  description:
    'fcfilmwerks is a media production company specialising in pre- and post-production for films and commercials, working out of Dubai and India.',
  path: '/about',
});

/**
 * The About page is a dossier, not a second homepage.
 *
 * It shares the brand — navy, gold, the same grain and the same easing — and
 * nothing else with `/`. No hero video wall, no Featured Work grid, no services
 * posters, and no shared `CtaSection` at the end: it opens on type, runs as
 * seven numbered chapters with a fixed index beside them, and closes on its own
 * mission statement. The one component it borrows from the site chrome is the
 * footer, which every route shares by design.
 *
 * Section order is deliberate — who, how, what, where it happens, who does it,
 * who it was done for, and then the way in. `aboutChapters` in
 * `src/config/about.ts` mirrors this order and drives the rail, so a chapter
 * added here needs an entry there to appear in the index.
 */
export default function AboutPage() {
  return (
    <>
      {/*
       * `immediate` because there is no intro on this route to fire the event
       * the nav normally waits on — without it the nav never appears here.
       */}
      <FloatingNav immediate />

      <AboutChapterRail />

      <AboutMasthead />

      <AboutStory />

      <AboutMethod />

      <AboutCraft />

      <AboutOnSet />

      <AboutPeople />

      <AboutRecord />

      <AboutClosing />

      <CinematicFooter />
    </>
  );
}
