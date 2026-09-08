import { notFound } from 'next/navigation';

import { ChapterRail } from '@/components/layout/ChapterRail';
import { CinematicFooter } from '@/components/layout/CinematicFooter';
import { FloatingNav } from '@/components/layout/FloatingNav';
import { JsonLd } from '@/components/seo';
import { CtaSection } from '@/components/sections/CtaSection';
import {
  NextProject,
  ProjectFrame,
  ProjectGallery,
  ProjectHero,
  ProjectOverview,
  ProjectSpec,
} from '@/components/sections/project';
import { getProjectBySlug, getProjectSlugs, projects } from '@/config/projects';
import {
  createMetadata,
  breadcrumbJsonLd,
  videoObjectJsonLd,
  creativeWorkJsonLd,
} from '@/lib/seo';
import type { Chapter } from '@/types';

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
 * Deliberately short. The page is the film, what the project was, and what left
 * the studio — nothing else. It used to run the `caseStudy.chapters` narrative
 * between the overview and the spec, several hundred words of craft writing per
 * project; the studio asked for all of it to come off, and it is a fair call.
 * A visitor on a film's page is there to watch the film, and prose about method
 * belongs on About, where the method chapter already says it once for the whole
 * studio rather than eleven times over.
 *
 * `caseStudy.chapters` is still in the config and still typed. Nothing reads it
 * today. It was left rather than deleted because it is the studio's own writing
 * and getting it back is a matter of restoring one section here — see the git
 * history for `ProjectStory`, removed 2026-09-07.
 *
 * What remains still varies per project: a page with no gallery imagery on file
 * simply has no gallery section, and a project whose source copy names a place
 * gets a Location row where the others do not.
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
  const { delivered, details, gallery } = project.caseStudy;

  /*
   * The page's numbering and its index, decided together so they cannot drift.
   * Short as it now is, the page is still a document with named parts, and the
   * rail is what a reader uses to jump between them and to see where they are.
   * The gallery earns an entry only on the projects that have one.
   */
  const railChapters: Chapter[] = [
    { number: '01', title: 'Overview', id: 'project-overview' },
    { number: '02', title: 'Delivered', id: 'project-spec' },
    ...(gallery && gallery.length > 0
      ? [{ number: '03', title: 'Stills', id: 'project-gallery' }]
      : []),
  ];

  const breadcrumbs = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: project.title, path: project.href },
  ]);

  const videoSchema = project.video
    ? videoObjectJsonLd({
        title: project.title,
        description: project.caseStudy.standfirst,
        thumbnailUrl: project.image,
        director: 'Gautam Raveendran',
      })
    : null;

  const creativeSchema = creativeWorkJsonLd({
    title: project.title,
    description: project.summary,
    image: project.image,
    creator: 'Gautam Raveendran',
  });

  const schemas = [
    breadcrumbs,
    creativeSchema,
    ...(videoSchema ? [videoSchema] : []),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <FloatingNav immediate />

      {/* The same fixed index Home and About carry. Every band below the hero
          pads its content by `xl:pl-52` — see `PROJECT_GUTTER`. */}
      <ChapterRail chapters={railChapters} label="Case study sections" />

      <article>
        {/* A published film plays in the hero itself; see `ProjectHero`. */}
        <ProjectHero project={project} index={index} total={projects.length} />

        <ProjectOverview project={project} number="01" />

        {/* A full-bleed frame between the overview and the spec, for projects
            with no moving image on the page. It is the one visual breath a
            still-only case study gets; a project whose film plays in the hero
            already has a better one and skips it. */}
        {!project.video && (
          <ProjectFrame
            src={project.image}
            alt={`${project.client}, ${project.category}`}
          />
        )}

        <ProjectSpec delivered={delivered} details={details} number="02" />

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
