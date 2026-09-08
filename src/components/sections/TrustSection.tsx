'use client';

import { animate, motion, useInView, type Variants } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { trustFigures, type TrustFigure } from '@/config/trust';
import { EASE } from '@/constants';
import { usePrefersReducedMotion } from '@/hooks';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE.out, delay },
  }),
};

const drawLine: Variants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 1.1, ease: EASE.expo } },
};

/**
 * One figure, counted up from zero as it arrives.
 *
 * The count is what makes the strip catch the eye without a single extra
 * colour: four numbers settling at once reads as the page presenting its
 * credentials rather than listing them. Under reduced motion the final value
 * is set outright, and the animation is stopped on unmount so a navigation
 * mid-count leaves nothing running.
 */
function Figure({
  figure,
  index,
  still,
}: {
  figure: TrustFigure;
  index: number;
  still: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (still) {
      setShown(figure.value);
      return;
    }

    const controls = animate(0, figure.value, {
      duration: 1.6,
      ease: EASE.out,
      delay: 0.2 + index * 0.1,
      onUpdate: (value) => setShown(Math.round(value)),
    });

    return () => controls.stop();
  }, [inView, still, figure.value, index]);

  return (
    <motion.div
      ref={ref}
      className="flex flex-col"
      variants={fadeUp}
      custom={0.1 + index * 0.08}
    >
      <dd className="order-1 text-[clamp(2.75rem,7vw,3.5rem)] leading-[0.95] font-light tracking-[-0.04em] text-white tabular-nums lg:text-[clamp(3.25rem,4.2vw,4.5rem)]">
        {shown}
        <span className="text-[#BFA76F]">{figure.suffix}</span>
      </dd>
      <dt className="order-2 mt-4 text-[0.6875rem] font-semibold tracking-[0.28em] text-white/45 uppercase">
        {figure.label}
      </dt>
    </motion.div>
  );
}

/**
 * The studio in four numbers, directly under the hero.
 *
 * This is the section that climbs over the pinned hero. The hero stays at
 * `position: sticky; top: 0` inside the intro's tall wrapper; this section is
 * pulled up into the last stretch of that wrapper by a negative margin, and
 * because it is opaque and edge to edge it slides over the hero like a
 * curtain. Services follows it in normal flow.
 *
 * The margin equals the cover phase's share of the wrapper's scroll range,
 * not the raw `cover` span, because the timeline's spans are fractions of
 * that range:
 *   mobile   1.1 / 3.95 × 200svh ≈ 56svh
 *   desktop  1.2 / 4.1  × 240svh ≈ 70svh
 * That puts the band's top edge at the bottom of the viewport exactly at
 * `coverStart`, so the hero and its call to action hold for the whole `hold`
 * span after the iris opens, and the band arrives as the timeline hands off.
 * The intro retires its tree just before that point and swaps in a shorter
 * wrapper while keeping the band where the reader sees it, so the same margin
 * carries the hand-off in the post-intro layout as well. Pull the band up
 * further and it covers the hero's buttons during the hold, which is what it
 * did before this was written down. Change the SPANS or the wrapper heights
 * in IntroExperience and this has to move with them.
 *
 * `motion-reduce:mt-0` cancels the margin when the sticky wrapper is absent
 * and sections stack in normal flow.
 *
 * No bottom padding of its own: the services section's top padding sets the
 * distance to the next block, so the two read as one continuous surface.
 */
export function TrustSection() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section
      id="trust"
      aria-label="The studio in numbers"
      className="relative z-10 -mt-[56svh] bg-[#0f1012] pt-16 motion-reduce:!mt-0 md:-mt-[70svh] md:pt-20 lg:pt-24"
    >
      <div className="w-full px-4 md:px-[3vw] xl:pl-52">
        <motion.dl
          className="relative grid grid-cols-2 gap-x-8 gap-y-12 py-10 md:grid-cols-4 lg:py-14"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          <motion.div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px origin-left bg-white/[0.12]"
            variants={drawLine}
          />

          {trustFigures.map((figure, index) => (
            <Figure
              key={figure.label}
              figure={figure}
              index={index}
              still={reducedMotion}
            />
          ))}

          <motion.div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-px origin-left bg-white/[0.12]"
            variants={drawLine}
          />
        </motion.dl>
      </div>
    </section>
  );
}
