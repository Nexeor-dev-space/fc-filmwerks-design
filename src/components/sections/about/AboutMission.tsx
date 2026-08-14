'use client';

import { motion, type Variants } from 'framer-motion';

import { aboutContact, aboutMission } from '@/config/about';
import { EASE } from '@/constants';
import { usePrefersReducedMotion } from '@/hooks';

interface Cue {
  index: number;
  still: boolean;
}

/**
 * Line-by-line mask reveal, matching the hero and the footer headline.
 *
 * The still branch zeroes the duration rather than omitting `y` — the reduced
 * motion preference resolves false on first render, so Framer bakes the moving
 * `initial` into the DOM before it settles, and a variant that dropped `y`
 * would strand every line below its mask permanently.
 */
const lineReveal: Variants = {
  hidden: ({ still }: Cue) => ({ y: still ? '0%' : '110%' }),
  visible: ({ index, still }: Cue) => ({
    y: '0%',
    transition: still
      ? { duration: 0, delay: index * 0.07 }
      : { duration: 1.05, ease: EASE.expo, delay: index * 0.07 },
  }),
};

const fadeUp: Variants = {
  hidden: ({ still }: { delay: number; still: boolean }) => ({
    opacity: 0,
    y: still ? 0 : 28,
  }),
  visible: ({ delay, still }: { delay: number; still: boolean }) => ({
    opacity: 1,
    y: 0,
    transition: still
      ? { duration: 0.4, ease: EASE.out, delay, y: { duration: 0 } }
      : { duration: 0.85, ease: EASE.expo, delay },
  }),
};

/**
 * The mission, set at statement scale.
 *
 * Deliberately the quietest section on the page: no imagery, no grain, no
 * parallax — just the sentence, given the whole measure. The contact details
 * sit beneath it because this is where a reader who has finished the page
 * looks for them, and it keeps the closing CTA free to be a single action.
 */
export function AboutMission() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section
      id="about-mission"
      aria-labelledby="about-mission-heading"
      className="bg-[#0F1012] pt-20 pb-20 md:pt-28 md:pb-24 lg:pt-32 lg:pb-28"
    >
      <div className="w-full px-4 md:px-[3vw]">
        <motion.p
          className="mb-10 text-[0.875rem] font-semibold tracking-[0.28em] text-[#BFA76F] uppercase md:mb-14"
          variants={fadeUp}
          custom={{ delay: 0, still: reducedMotion }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
        >
          {aboutMission.label}
        </motion.p>

        <motion.h2
          id="about-mission-heading"
          className="max-w-[24ch] text-[clamp(28px,6vw,44px)] leading-[1.12] font-light tracking-[-0.01em] text-white lg:text-[clamp(40px,4.2vw,72px)]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {aboutMission.statement.map((line, index) => (
            <span key={line} className="block overflow-hidden pb-[0.12em]">
              <motion.span
                className="block"
                variants={lineReveal}
                custom={{ index, still: reducedMotion }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </motion.h2>

        {/* Contact, as a quiet editorial strip rather than a card. */}
        <motion.dl
          className="mt-20 flex flex-col gap-10 border-t border-white/[0.12] pt-10 md:flex-row md:gap-20 lg:mt-28"
          variants={fadeUp}
          custom={{ delay: 0.1, still: reducedMotion }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          <div>
            <dt className="mb-3 text-[0.6875rem] font-semibold tracking-[0.28em] text-white/35 uppercase">
              Email
            </dt>
            <dd>
              <a
                href={`mailto:${aboutContact.email}`}
                className="relative inline-block text-[0.9375rem] text-white/[0.72] transition-colors duration-500 ease-out after:absolute after:bottom-[-3px] after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-[#BFA76F] after:transition-transform after:duration-500 after:ease-out hover:text-[#BFA76F] hover:after:scale-x-100 focus-visible:text-[#BFA76F] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#BFA76F]"
              >
                {aboutContact.email}
              </a>
            </dd>
          </div>

          <div>
            <dt className="mb-3 text-[0.6875rem] font-semibold tracking-[0.28em] text-white/35 uppercase">
              Phone
            </dt>
            <dd>
              <a
                href={aboutContact.phoneHref}
                className="relative inline-block text-[0.9375rem] text-white/[0.72] transition-colors duration-500 ease-out after:absolute after:bottom-[-3px] after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-[#BFA76F] after:transition-transform after:duration-500 after:ease-out hover:text-[#BFA76F] hover:after:scale-x-100 focus-visible:text-[#BFA76F] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#BFA76F]"
              >
                {aboutContact.phone}
              </a>
            </dd>
          </div>

          <div>
            <dt className="mb-3 text-[0.6875rem] font-semibold tracking-[0.28em] text-white/35 uppercase">
              Locations
            </dt>
            <dd className="text-[0.9375rem] text-white/[0.72]">
              {aboutContact.locations}
            </dd>
          </div>
        </motion.dl>
      </div>
    </section>
  );
}
