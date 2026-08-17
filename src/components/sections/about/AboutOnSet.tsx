'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { aboutOnSet } from '@/config/about';
import { useIsMobile, usePrefersReducedMotion } from '@/hooks';
import { cn } from '@/lib/utils';

import { ChapterMark, DisplayHeading } from './ChapterHeading';
import { ENTER, rise } from '@/components/animations';

/**
 * Ten production stills live in `public/images/behind-the-frame`. They are
 * decorative as a set — the strip as a whole is the content, and ten invented
 * descriptions would be noise to a screen reader rather than information.
 */
const FRAMES = Array.from({ length: aboutOnSet.frameCount }, (_, index) => ({
  src: `/images/behind-the-frame/bts-${String(index + 1).padStart(2, '0')}.jpg`,
  /* Alternating aspect ratios, so the strip reads as a contact sheet laid out
     by hand rather than a carousel of identical slots. */
  portrait: index % 3 === 1,
}));

/**
 * Chapter 04 — the strip, moving sideways as the page moves down.
 *
 * The travel is measured rather than guessed: a ResizeObserver keeps the track
 * and viewport widths current, and the scroll range maps onto exactly the
 * overflow between them. A hard-coded percentage would have been right at one
 * breakpoint and wrong at every other, because the frame widths are viewport
 * units and the overflow changes with them.
 *
 * Nothing here pins. The section keeps its natural height and only the track
 * translates, which sidesteps the pin-spacing problem this codebase has hit
 * before and leaves nothing to tear down.
 *
 * Phones and reduced-motion visitors get a plain swipe scroller instead. On a
 * phone the frames are most of the screen wide, so the same ten of them
 * overflow by roughly 1.6× the scroll distance available — the strip would tear
 * past at more than a pixel of sideways travel per pixel of scroll, which reads
 * as a glitch rather than a pan. Sideways is also the gesture a phone already
 * has. Either way the frames stay reachable; only the automation is dropped.
 */
export function AboutOnSet() {
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const manual = reducedMotion || isMobile;
  const sectionRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const measure = () => {
      setDistance(Math.max(0, track.scrollWidth - viewport.clientWidth));
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  /* Runs the full travel while the section is on screen, rather than only
     finishing as it leaves — the last frame should be readable, not glimpsed. */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 85%', 'end 20%'],
  });

  const trackX = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  return (
    <section
      id="about-on-set"
      aria-labelledby="about-on-set-heading"
      className="scroll-mt-24 overflow-hidden bg-[#0A131F] py-24 md:py-32 lg:py-40"
    >
      <div ref={sectionRef}>
        <div className="px-5 md:px-8 lg:px-14 xl:pl-52">
          <ChapterMark number="04" title="On set" still={reducedMotion} />

          <div className="mt-8 grid grid-cols-1 gap-y-8 lg:grid-cols-12 lg:gap-x-12">
            <div className="lg:col-span-6">
              <DisplayHeading
                id="about-on-set-heading"
                lines={aboutOnSet.heading}
                still={reducedMotion}
              />
            </div>

            <motion.p
              className="max-w-[46ch] text-[1rem] leading-[1.8] text-white/[0.6] lg:col-span-4 lg:col-start-9 lg:pt-3"
              variants={rise}
              custom={{ delay: 0.18, still: reducedMotion }}
              initial="hidden"
              whileInView="visible"
              viewport={ENTER}
            >
              {aboutOnSet.body}
            </motion.p>
          </div>
        </div>

        <div
          ref={viewportRef}
          className={cn(
            'mt-16 lg:mt-24',
            manual ? 'no-scrollbar overflow-x-auto' : 'overflow-hidden',
          )}
        >
          <motion.ul
            ref={trackRef}
            className="flex w-max items-end gap-4 px-5 md:gap-6 md:px-8 lg:px-14 xl:pl-52"
            style={manual ? undefined : { x: trackX }}
          >
            {FRAMES.map((frame, index) => (
              <li
                key={frame.src}
                className={cn(
                  'relative shrink-0 overflow-hidden rounded-[2px] border border-white/[0.08]',
                  frame.portrait
                    ? 'aspect-[3/4] w-[62vw] md:w-[30vw] lg:w-[21vw]'
                    : 'aspect-[4/3] w-[76vw] md:w-[40vw] lg:w-[28vw]',
                  /* Every third frame drops, so the baseline is broken and the
                     strip reads as a hand-laid sheet. */
                  index % 3 === 2 && 'mb-10 lg:mb-16',
                )}
              >
                <Image
                  src={frame.src}
                  alt=""
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 28vw, (min-width: 768px) 40vw, 76vw"
                  className="object-cover"
                />

                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#0A131F]/45 to-transparent"
                />

                <span className="absolute bottom-3 left-3 font-mono text-[0.625rem] tracking-[0.24em] text-white/55 uppercase">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
