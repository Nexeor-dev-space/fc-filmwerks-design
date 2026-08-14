import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { CinematicFooter } from '@/components/layout/CinematicFooter';
import { FloatingNav } from '@/components/layout/FloatingNav';
import { CtaSection } from '@/components/sections/CtaSection';
import { LensTransition } from '@/components/sections/LensTransition';
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
    description: project.summary,
    image: project.image,
    path: project.href,
  });
}

/**
 * One reusable template for every project — there is deliberately no
 * per-project layout. A new entry in `src/config/projects.ts` gets a page,
 * metadata and a static route with no code change here.
 *
 * The closing three sections are the site's standard ending, and they are
 * coupled by scroll geometry: the footer is pulled up a full viewport to
 * cover the lens plate, so it has to follow `LensTransition`.
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

  return (
    <>
      <FloatingNav immediate />

      <article>
        <header className="bg-[#0F1012] pt-32 pb-12 md:pt-40 md:pb-16">
          <div className="w-full px-4 md:px-[3vw]">
            <Link
              href="/portfolio"
              className="group inline-flex items-center gap-2.5 text-[0.6875rem] font-semibold tracking-[0.24em] text-white/55 uppercase transition-colors duration-500 ease-out hover:text-[#BFA76F] focus-visible:text-[#BFA76F] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#BFA76F] md:text-[0.75rem]"
            >
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-500 ease-out group-hover:-translate-x-1.5"
              >
                ←
              </span>
              All work
            </Link>

            <p className="mt-10 text-[0.875rem] font-semibold tracking-[0.28em] text-[#BFA76F] uppercase">
              {project.category}
            </p>

            <h1 className="mt-5 max-w-[18ch] text-[2.5rem] leading-[0.95] font-semibold tracking-[-0.02em] text-white uppercase md:text-[3.25rem] lg:text-[4rem]">
              {project.title}
            </h1>
          </div>
        </header>

        {/* The still, full width inside the gutter. */}
        <div className="bg-[#0F1012]">
          <div className="w-full px-4 md:px-[3vw]">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#13233A] md:aspect-[21/9]">
              <Image
                src={project.image}
                alt={`${project.client} — ${project.category}`}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="bg-[#0F1012] pt-16 pb-20 md:pt-20 md:pb-24 lg:pt-24 lg:pb-28">
          <div className="w-full px-4 md:px-[3vw]">
            <div className="flex flex-col gap-12 lg:flex-row lg:gap-20">
              <dl className="flex flex-row gap-12 lg:w-[28%] lg:shrink-0 lg:flex-col lg:gap-10">
                <div>
                  <dt className="mb-3 text-[0.6875rem] font-semibold tracking-[0.28em] text-white/35 uppercase">
                    Client
                  </dt>
                  <dd className="text-[0.9375rem] text-white/[0.72]">
                    {project.client}
                  </dd>
                </div>
                <div>
                  <dt className="mb-3 text-[0.6875rem] font-semibold tracking-[0.28em] text-white/35 uppercase">
                    Discipline
                  </dt>
                  <dd className="text-[0.9375rem] text-white/[0.72]">
                    {project.category}
                  </dd>
                </div>
              </dl>

              <p className="max-w-[62ch] text-[1.125rem] leading-[1.7] text-white/[0.82] lg:text-[1.375rem] lg:leading-[1.6]">
                {project.summary}
              </p>
            </div>

            {/* Route-through to the next project, so the archive is walkable
                without going back to the index each time. */}
            <Link
              href={next.href}
              className="group mt-20 flex flex-col gap-2 border-t border-white/[0.12] pt-10 lg:mt-28"
            >
              <span className="text-[0.6875rem] font-semibold tracking-[0.24em] text-white/35 uppercase md:text-[0.75rem]">
                Next project
              </span>
              <span className="inline-flex items-center gap-4 text-[1.5rem] leading-[1.15] font-extralight tracking-tight text-white transition-colors duration-500 ease-out group-hover:text-[#BFA76F] md:text-[2rem]">
                {next.title}
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-500 ease-out group-hover:translate-x-2"
                >
                  →
                </span>
              </span>
            </Link>
          </div>
        </div>
      </article>

      <CtaSection
        label="Have a story to tell?"
        headline={["LET'S BUILD", 'TOGETHER.']}
        body="Every great production begins with a conversation. Tell us what you have in mind and we will show you what it could become."
        showLocations={false}
        primary={{ label: 'Start a project', href: '/contact' }}
        secondary={{ label: 'Contact us', href: '/contact' }}
      />

      <LensTransition />

      <CinematicFooter />
    </>
  );
}
