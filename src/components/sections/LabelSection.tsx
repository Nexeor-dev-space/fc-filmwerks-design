'use client';

import { motion, type Variants } from 'framer-motion';
import Image from 'next/image';

import { komBan } from '@/config/kom-ban';
import { EASE } from '@/constants';
import { cn } from '@/lib/utils';

import { SECTION_BAND, SECTION_GUTTER } from './rhythm';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE.out, delay },
  }),
};

/**
 * Kom Ban Records, on the homepage.
 *
 * Placed straight after the work, because it is more of the same claim: the
 * studio makes things of its own, and this is the second medium it does it in.
 * Before the studio section rather than after, so a reader meets everything the
 * house has made before being told who made it.
 *
 * The lockup is framed on black. That is not a fallback for a transparent PNG —
 * the artwork is gold on black and a record label's mark wants a sleeve around
 * it, which is also what stops it reading as an image that failed to composite
 * against the page's navy.
 *
 * Two sentences, the studio's own, and no call to action. There is no label site
 * to link to and no roster to list yet; a button here would have to invent a
 * destination. See `src/config/kom-ban.ts` for what is deliberately missing.
 */
export function LabelSection() {
  return (
    <section
      id="kom-ban"
      aria-labelledby="kom-ban-heading"
      className={cn('relative overflow-hidden bg-[#0A131F]', SECTION_BAND)}
    >
      <div className={SECTION_GUTTER}>
        <motion.p
          className="text-[0.875rem] font-semibold tracking-[0.28em] text-[#BFA76F] uppercase"
          variants={fadeUp}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
        >
          Also from the studio
        </motion.p>

        <div className="mt-12 grid grid-cols-1 items-center gap-y-14 lg:mt-16 lg:grid-cols-12 lg:gap-x-16">
          <motion.div
            className="lg:col-span-5"
            variants={fadeUp}
            custom={0.08}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="mx-auto max-w-[440px] rounded-[20px] border border-white/[0.08] bg-black p-8 shadow-[0_40px_120px_rgba(0,0,0,0.5)] md:p-12 lg:mx-0">
              <Image
                src={komBan.logo}
                alt={komBan.logoAlt}
                width={komBan.logoWidth}
                height={komBan.logoHeight}
                loading="lazy"
                sizes="(min-width: 1024px) 34vw, 80vw"
                className="h-auto w-full"
              />
            </div>
          </motion.div>

          <div className="lg:col-span-6 lg:col-start-7">
            <motion.h2
              id="kom-ban-heading"
              className="text-[2.625rem] leading-[0.95] font-semibold tracking-[-0.02em] text-white uppercase md:text-[3.375rem] lg:text-[4rem]"
              variants={fadeUp}
              custom={0.16}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
            >
              Kom Ban
              <br />
              Records
            </motion.h2>

            <motion.p
              className="mt-6 font-mono text-[0.6875rem] tracking-[0.3em] text-white/40 uppercase"
              variants={fadeUp}
              custom={0.22}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
            >
              {komBan.kind} · {komBan.origin}
            </motion.p>

            <motion.p
              className="mt-9 max-w-[46ch] text-[1.125rem] leading-[1.75] text-white/[0.88] md:text-[1.25rem]"
              variants={fadeUp}
              custom={0.28}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
            >
              {komBan.tagline}
            </motion.p>

            <motion.p
              className="mt-5 max-w-[46ch] text-[1rem] leading-[1.85] text-white/[0.62] md:text-[1.0625rem]"
              variants={fadeUp}
              custom={0.34}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
            >
              {komBan.ambition}
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
