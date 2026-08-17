'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { aboutChapters } from '@/config/about';
import { EASE } from '@/constants';
import { usePrefersReducedMotion } from '@/hooks';
import { cn } from '@/lib/utils';

/**
 * The dossier's index, fixed to the left edge.
 *
 * More than ornament: it is what makes the page read as a document with parts
 * rather than a scroll of sections, and it gives a reader who is four chapters
 * deep a way back out. It is also the single strongest signal that this is not
 * the homepage, which has no such structure.
 *
 * Only on `xl`. Below that the viewport is too narrow to carry a fixed column
 * beside the content without stealing measure from it, and the chapter marks in
 * the flow already do the labelling.
 *
 * Hidden until the reader is past the masthead: over chapter 00 it would be
 * pointing at a chapter nobody has reached yet.
 */
export function AboutChapterRail() {
  const reducedMotion = usePrefersReducedMotion();
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const sections = aboutChapters
      .map(({ id }) => document.getElementById(id))
      .filter((node): node is HTMLElement => node !== null);

    if (sections.length === 0) return;

    /*
     * A middle band for a root margin: a chapter becomes current when it
     * reaches the middle of the screen, not when its first pixel appears. The
     * observer is disconnected on unmount — a leaked one would keep firing
     * against detached nodes after a client-side navigation.
     */
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: '-48% 0px -48% 0px', threshold: 0 },
    );

    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <AnimatePresence>
      {activeId && (
        <motion.nav
          aria-label="About chapters"
          className="fixed top-1/2 left-6 z-[90] hidden -translate-y-1/2 xl:block"
          initial={{ opacity: 0, x: reducedMotion ? 0 : -12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: reducedMotion ? 0 : -12 }}
          transition={{ duration: reducedMotion ? 0.2 : 0.7, ease: EASE.out }}
        >
          <ol className="flex flex-col gap-4">
            {aboutChapters.map((chapter) => {
              const isActive = chapter.id === activeId;

              return (
                <li key={chapter.id}>
                  <a
                    href={`#${chapter.id}`}
                    aria-current={isActive ? 'true' : undefined}
                    className="group flex items-center gap-3 py-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#BFA76F]"
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        'h-px transition-all duration-[600ms] ease-out',
                        isActive
                          ? 'w-8 bg-[#BFA76F]'
                          : 'w-4 bg-white/25 group-hover:w-6 group-hover:bg-white/50',
                      )}
                    />

                    <span
                      className={cn(
                        'font-mono text-[0.625rem] tracking-[0.28em] uppercase transition-colors duration-500 ease-out',
                        isActive
                          ? 'text-[#BFA76F]'
                          : 'text-white/30 group-hover:text-white/70',
                      )}
                    >
                      {chapter.number}
                    </span>

                    {/* The label is held back until it is wanted — the numbers
                        alone keep the rail from competing with the page. */}
                    <span
                      className={cn(
                        'font-mono text-[0.625rem] tracking-[0.24em] whitespace-nowrap uppercase transition-opacity duration-500 ease-out',
                        isActive
                          ? 'text-white/70 opacity-100'
                          : 'text-white/50 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100',
                      )}
                    >
                      {chapter.title}
                    </span>
                  </a>
                </li>
              );
            })}
          </ol>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
