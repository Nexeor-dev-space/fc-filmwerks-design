'use client';

import { motion, type Variants } from 'framer-motion';
import Image from 'next/image';

import { clients, clientSectors } from '@/config/clients';
import { EASE } from '@/constants';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE.out, delay },
  }),
};

/** Logos arrive in sequence rather than as one block. */
const wallVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const logoVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE.out } },
};

/**
 * Trusted by — a quiet statement of credibility between the studio
 * introduction and the testimonials.
 *
 * Deliberately restrained: a still grid rather than a sliding logo belt, since
 * a carousel here would compete with the services carousel further up the page
 * and read as filler. The marquee underneath carries sectors, not logos, so it
 * adds texture without becoming the layout.
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

        <motion.ul
          className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:mt-24 lg:grid-cols-5"
          variants={wallVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {clients.map((client) => (
            <motion.li key={client.name} variants={logoVariants}>
              {/* Not a link: these are proof, not navigation. A whole grid of
                  dead anchors would be worse than none. */}
              {/*
               * Logos render in their own colours — no `grayscale`, no dimming
               * opacity. Client marks are brand assets and the studio does not
               * get to restyle them, so the only hover left is the lift.
               *
               * The trade-off is legibility: several of these are near-black
               * artwork on transparency (Pavanito, Mindspace, Heartland, and
               * ADCP's navy), and on this dark tile they sit close to their own
               * background. Anything that would fix that — a light chip behind
               * them, an invert, a drop shadow — alters the mark, which is the
               * thing being avoided here.
               */}
              {/*
               * Padding is the thing that actually sizes these, not the cap on
               * the image. The tile was 120px tall with `p-10`, which left only
               * 40px of usable height — so a `max-h-16` logo was clamped to a
               * third of its cap and read as a speck. The tile is taller and
               * the padding much tighter, and only then does raising the cap
               * do anything.
               */}
              <div className="group flex h-[180px] items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 transition-colors duration-500 ease-out hover:border-[rgba(191,167,111,0.35)] md:h-[200px] md:p-5">
                <Image
                  src={client.logo}
                  alt={client.name}
                  width={352}
                  height={352}
                  loading="lazy"
                  /* Square 352×352 artboards, not the wide 220×48 wordmarks the
                     placeholders were — hence `object-contain` and a cap set
                     against the tile's height rather than its width.
                     The tile must clear the cap plus both paddings or the
                     padding silently wins and the logo shrinks: 200 − 40 = 160
                     of usable height for a 150px mark. */
                  className="h-auto max-h-[140px] w-auto max-w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105 md:max-h-[150px]"
                />
              </div>
            </motion.li>
          ))}
        </motion.ul>

        {/* Sectors, drifting. Two identical tracks so the loop is seamless. */}
        <motion.div
          className="marquee-host relative mt-14 overflow-hidden lg:mt-20"
          variants={fadeUp}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
        >
          {/* Feathered edges, so the run appears out of and into the ground
              rather than being cut off by an invisible box. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#0F1C2E] to-transparent md:w-32"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#0F1C2E] to-transparent md:w-32"
          />

          <div className="animate-marquee flex w-max">
            {[0, 1].map((copy) => (
              <ul
                key={copy}
                className="flex shrink-0 items-center"
                // The duplicate is presentational; only the first is announced.
                aria-hidden={copy === 1}
              >
                {clientSectors.map((sector) => (
                  <li
                    key={sector}
                    className="flex items-center text-[0.8125rem] tracking-[0.28em] text-white/40 uppercase"
                  >
                    <span className="px-6 md:px-9">{sector}</span>
                    <span aria-hidden="true" className="text-[#BFA76F]/50">
                      •
                    </span>
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
