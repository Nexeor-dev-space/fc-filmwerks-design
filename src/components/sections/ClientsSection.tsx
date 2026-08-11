'use client';

import { motion, type Variants } from 'framer-motion';
import Image from 'next/image';

import { clients } from '@/config/clients';
import { EASE } from '@/constants';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE.out, delay },
  }),
};

/**
 * Trusted by — a quiet statement of credibility between the studio
 * introduction and the testimonials.
 *
 * A single drifting belt of client marks. The sectors ticker that used to run
 * beneath it has been removed; `clientSectors` is still exported from the
 * config and now has no consumer.
 *
 * Padding and gutters mirror every other homepage section.
 */
export function ClientsSection() {
  return (
    <section
      id="clients"
      aria-labelledby="clients-heading"
      className="bg-[#0F1C2E] pt-16 pb-20 md:pt-20 md:pb-24 lg:pt-24 lg:pb-28"
    >
      <div className="w-full px-4 md:px-[3vw]">
        <header className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-20">
          <div className="max-w-[700px]">
            <motion.p
              className="mb-5 text-[0.875rem] font-semibold tracking-[0.28em] text-[#BFA76F] uppercase"
              variants={fadeUp}
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.6 }}
            >
              Trusted by
            </motion.p>

            <motion.h2
              id="clients-heading"
              className="text-[2.5rem] leading-[0.95] font-semibold tracking-[-0.02em] text-white uppercase md:text-[3.375rem] lg:text-[4rem] xl:text-[4.5rem]"
              variants={fadeUp}
              custom={0.08}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.6 }}
            >
              Trusted by
              <br />
              leading brands
            </motion.h2>
          </div>

          <motion.p
            className="max-w-[500px] text-[1rem] leading-[1.8] text-white/[0.72] md:text-[1.0625rem] lg:shrink-0 lg:pt-4 lg:text-[1.125rem]"
            variants={fadeUp}
            custom={0.16}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
          >
            We&rsquo;re proud to collaborate with ambitious brands,
            organizations and creative partners to produce films that inspire,
            engage and leave a lasting impression.
          </motion.p>
        </header>

        {/*
         * The logo belt. Two identical tracks translated by exactly half the
         * pair's width, so the moment the first copy leaves the second is
         * already in its place — the loop has no seam and no reset to see.
         *
         * No tiles, borders or backgrounds: the marks sit directly on the
         * section ground, held in line by a shared height cap rather than by
         * a box. Because the artboards are square, capping the height also
         * settles the width, which is what keeps the rhythm even.
         *
         * Grayscale is a client instruction and it overrides the earlier note
         * about never restyling brand assets — worth knowing that it is a
         * decision, not an oversight, before anyone "restores" the colour.
         */}
        <motion.div
          className="marquee-host relative mt-16 overflow-hidden lg:mt-24"
          variants={fadeUp}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Feathered edges, so the belt appears out of and into the ground
              rather than being cut off by an invisible box. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#0F1C2E] to-transparent md:w-32"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#0F1C2E] to-transparent md:w-32"
          />

          <div className="animate-marquee-logos flex w-max">
            {[0, 1].map((copy) => (
              <ul
                key={copy}
                className="flex shrink-0 items-center"
                // The duplicate is presentational; only the first is announced.
                aria-hidden={copy === 1}
              >
                {clients.map((client) => (
                  <li
                    key={client.name}
                    className="flex shrink-0 items-center justify-center px-10 md:px-14"
                  >
                    {/* Not a link: these are proof, not navigation. A whole
                        belt of dead anchors would be worse than none.
                        Monochrome at rest, full colour on hover — the mark is
                        restyled only while it is being looked at. */}
                    <Image
                      src={client.logo}
                      alt={client.name}
                      width={352}
                      height={352}
                      loading="lazy"
                      /*
                       * `contrast(0.45) brightness(1.85)` is doing the real
                       * work, not the grayscale. These artboards range from
                       * near-black (Pavanito reads a mean luminance of 6) to
                       * fairly light, and plain `grayscale` left the dark half
                       * invisible on this navy. Brightness alone cannot fix
                       * that — it is multiplicative, so black stays black.
                       * Dropping contrast first pulls every tone toward mid
                       * grey, and only then does the brightness lift land on
                       * something it can raise. Internal detail survives:
                       * knocked-out text inside a filled disc still separates.
                       */
                      className="h-auto max-h-[120px] w-auto max-w-none object-contain opacity-80 brightness-[1.85] contrast-[0.45] grayscale transition-[opacity,filter] duration-500 ease-out hover:opacity-100 hover:brightness-100 hover:contrast-100 hover:grayscale-0 md:max-h-[150px]"
                    />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
