import { notFound } from 'next/navigation';

import { CinematicFooter } from '@/components/layout/CinematicFooter';
import { FloatingNav } from '@/components/layout/FloatingNav';
import { CtaSection } from '@/components/sections/CtaSection';
import {
  NextProject,
  ProjectFrame,
  ProjectGallery,
  ProjectHero,
  ProjectOverview,
  ProjectSpec,
  ProjectStory,
} from '@/components/sections/project';
import { getProjectBySlug, getProjectSlugs, projects } from '@/config/projects';
import { createMetadata } from '@/lib/seo';

/** Prerenders one static page per project at build time. */
export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return createMetadata({ title: 'Project', noIndex: true });

  return createMetadata({
    title: project.title,
    /* The standfirst rather than the raw summary: it is written as a single
       self-contained sentence, which is what a search result and a link preview
       both need. */
    description: project.caseStudy.standfirst,
    image: project.image,
    path: project.href,
  });
}

/**
 * A project case study.
 *
 * One route for every project, but not one *page* — the narrative is driven by
 * `caseStudy.chapters` in `src/config/projects.ts`, and both the number of
 * chapters and their titles are decided per project. An event that happens once
 * and a script-to-finish vertical campaign do not have the same story shape, so
 * they do not get the same headings. A page with no gallery imagery on file
 * simply has no gallery section; a project whose source copy names a place gets
 * a Location row and the other seven do not.
 *
 * The narrative is split around a full-bleed frame rather than running as one
 * block. Long-form reading needs a visual breath in the middle, and putting it
 * after the second chapter means it lands once the reader knows what the project
 * is but before the production detail starts.
 *
 * There are no invented results anywhere on this page — see the provenance note
 * on `ProjectCaseStudy` in the config for what each field may and may not say.
 */
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  const index = projects.findIndex((p) => p.href === project.href);
  const next = projects[(index + 1) % projects.length];
  const { chapters, delivered, details, gallery } = project.caseStudy;

  /*
   * Where the frame interrupts the story. After the second chapter for anything
   * with four or more, at the midpoint otherwise — a three-chapter page would
   * otherwise get its break one chapter from the end, which is a stall rather
   * than a breath. `slice` past the end is safe, so a one-chapter project would
   * simply run its frame afterwards.
   */
  const breakAt = chapters.length >= 4 ? 2 : Math.ceil(chapters.length / 2);

  return (
    <>
      <FloatingNav immediate />

      <article>
        <ProjectHero project={project} index={index} total={projects.length} />

        <ProjectOverview project={project} />

        <ProjectStory chapters={chapters.slice(0, breakAt)} />

        <ProjectFrame
          src={project.image}
          alt={`${project.client} — ${project.category}`}
        />

        <ProjectStory chapters={chapters.slice(breakAt)} />

        <ProjectSpec delivered={delivered} details={details} />

        {/* Only where the studio has stills for this project. See the note in
            ProjectGallery for why this is not padded out with the generic
            behind-the-scenes archive. */}
        {gallery && gallery.length > 0 && <ProjectGallery images={gallery} />}

        <NextProject project={next} />
      </article>

      <CtaSection
        label="Have a story to tell?"
        headline={["LET'S BUILD", 'TOGETHER.']}
        body="Every great production begins with a conversation. Tell us what you have in mind and we will show you what it could become."
        showLocations={false}
        primary={{ label: 'Start a project', href: '/contact' }}
        secondary={{ label: 'Contact us', href: '/contact' }}
      />

      <CinematicFooter />
    </>
  );
}
