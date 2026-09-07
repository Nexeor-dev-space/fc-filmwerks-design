'use client';

import { motion, type Variants } from 'framer-motion';
import Image from 'next/image';

import { Button } from '@/components/ui';
import { siteConfig } from '@/config/site';
import { EASE } from '@/constants';
import { usePrefersReducedMotion } from '@/hooks';

/** Fine film grain, same texture used across cinematic sections. */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

const HEADLINE_LINES = ["LET'S CREATE", 'THE NEXT', 'STORY.'];

/**
 * Dust motes drifting through the key light. Positions are fixed rather than
 * random so the server and client always render the same markup.
 */
const PARTICLES = [
  { left: '12%', top: '24%', size: 3, duration: 19, delay: 0 },
  { left: '28%', top: '62%', size: 2, duration: 23, delay: 2.4 },
  { left: '43%', top: '18%', size: 2, duration: 17, delay: 5.1 },
  { left: '58%', top: '71%', size: 3, duration: 26, delay: 1.2 },
  { left: '71%', top: '33%', size: 2, duration: 21, delay: 3.8 },
  { left: '84%', top: '56%', size: 3, duration: 24, delay: 6.3 },
  { left: '91%', top: '21%', size: 2, duration: 18, delay: 0.9 },
] as const;

/*
 * Reveals take the reduced-motion preference through `custom`, the same way
 * the service cards do. Under reduced motion the travel goes and the fade
 * stays, so the staggered reading order survives.
 *
 * Both branches always name the same values, and the still branch zeroes the
 * transform's duration rather than dropping `y` from the variant. That is
 * deliberate: `usePrefersReducedMotion` is false on the first render by
 * design, so Framer bakes the moving `initial` into the DOM before the
 * preference resolves. A still variant that simply omitted `y` would never
 * animate that baked transform away — the headline lines would sit at `110%`,
 * stranded below their masks, and never appear at all.
 */
type Reveal = { delay?: number; still: boolean };
type LineCue = { index: number; still: boolean };

/** Snaps a transform into place while its fade still runs. */
const INSTANT_Y = { duration: 0 } as const;

const fadeUp: Variants = {
  hidden: ({ still }: Reveal) => ({ opacity: 0, y: still ? 0 : 36 }),
  visible: ({ delay = 0, still }: Reveal) => ({
    opacity: 1,
    y: 0,
    transition: still
      ? { duration: 0.4, ease: EASE.out, delay, y: INSTANT_Y }
      : { duration: 0.85, ease: EASE.expo, delay },
  }),
};

/*
 * The headline is a mask reveal — the line slides up out of an
 * `overflow-hidden` strip, and carries no opacity of its own. With the travel
 * removed there is nothing left to tween, so reduced motion simply cuts the
 * line into place on the beat it would have arrived on.
 */
const lineReveal: Variants = {
  hidden: ({ still }: LineCue) => ({ y: still ? '0%' : '110%' }),
  visible: ({ index, still }: LineCue) => ({
    y: '0%',
    transition: still
      ? { duration: 0, delay: 0.15 + index * 0.1 }
      : { duration: 1.05, ease: EASE.expo, delay: 0.15 + index * 0.1 },
  }),
};

/** Contact links share one underline treatment — gold, drawn left to right. */
function ContactLink({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="relative inline-block text-[0.9375rem] text-white/[0.72] transition-colors duration-500 ease-out after:absolute after:bottom-[-3px] after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-[#BFA76F] after:transition-transform after:duration-500 after:ease-out hover:text-[#BFA76F] hover:after:scale-x-100 focus-visible:text-[#BFA76F] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#BFA76F]"
    >
      {children}
    </a>
  );
}

/**
 * Closing footer — the credits scene of the site.
 *
 * A rounded card, just short of a viewport tall, floating inside a margin of
 * page background and bookending the intro's inset frame. Depth comes from
 * ordered layers: base
 * gradients, a slowly rotating cinema lens, drifting dust, film grain, then a
 * monumental wordmark cropped by the card's bottom edge, with the editorial
 * content above all of it.
 *
 * The lens never translates or scales — rotation is the only motion, slow
 * enough to read as ambience rather than animation. Everything runs on
 * transform/opacity so the whole scene stays on the compositor.
 */
export function CinematicFooter() {
  const reducedMotion = usePrefersReducedMotion();

  const year = new Date().getFullYear();

  return (
    <footer
      aria-label="Site footer"
      /*
       * The footer ELEMENT stays exactly one viewport tall, shortened from
       * inside by an even gutter on all four edges so the card floats in
       * page background the way the intro's frame floats in it. The gutter
       * deliberately matches that frame's `inset-2 md:inset-3` exactly, so
       * the two bookend the page at the same measure — change it there and
       * it has to change here.
       *
       * Gutter and card height are one number split in two:
       *
       *   base  0.5rem  + (100dvh − 1rem)   + 0.5rem  = 100dvh
       *   md    0.75rem + (100dvh − 1.5rem) + 0.75rem = 100dvh
       */
      className="relative z-[5] bg-[#07192A] p-2 md:p-3"
    >
      {/*
       * A viewport less the gutter above and below — see the arithmetic above.
       *
       * Height is a floor on small screens and an exact fit from `lg` up.
       * Phones stack the contact columns under the heading, which cannot fit
       * one viewport at a readable size — there the card grows and the page
       * scrolls. From `lg` the two columns sit side by side and it does fit,
       * so `h` pins it to the height above and `min-h-0` clears the floor that
       * would otherwise let it grow past that.
       */}
      <div className="relative flex min-h-[calc(100dvh-1rem)] flex-col overflow-hidden rounded-[28px] bg-[#07192A] md:min-h-[calc(100dvh-1.5rem)] md:rounded-[48px] lg:h-[calc(100dvh-1.5rem)] lg:min-h-0">
        {/* ── Layer 1 · lighting ── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 55% at 50% 12%, rgba(31,68,105,0.35) 0%, transparent 65%)',
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 45% 40% at 78% 68%, rgba(191,167,111,0.05) 0%, transparent 70%)',
          }}
        />

        {/* Gentle moving shadow — a cloud drifting past the key light. */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          animate={
            reducedMotion
              ? undefined
              : { x: ['-4%', '4%', '-4%'], opacity: [0.5, 0.8, 0.5] }
          }
          transition={
            reducedMotion
              ? undefined
              : { duration: 26, repeat: Infinity, ease: 'easeInOut' }
          }
          style={{
            background:
              'radial-gradient(ellipse 55% 45% at 30% 45%, rgba(4,12,20,0.5) 0%, transparent 70%)',
          }}
        />

        {/* ── Layer 2 · atmosphere ── */}
        {!reducedMotion &&
          PARTICLES.map((p, i) => (
            <motion.span
              key={i}
              aria-hidden="true"
              className="pointer-events-none absolute rounded-full bg-white/40"
              style={{
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
              }}
              animate={{ y: [0, -26, 0], opacity: [0, 0.5, 0] }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.09] mix-blend-overlay"
          style={{ backgroundImage: GRAIN }}
        />

        {/* Vignette seats every layer into the frame. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 85% 75% at 50% 45%, transparent 45%, rgba(3,10,17,0.6) 100%)',
          }}
        />

        {/* ── Layer 4 · content ── */}
        {/* Bottom padding is the wordmark band plus 2vh, so the copyright
            always clears it whatever the viewport height. The band now sits on
            the card's bottom edge rather than lifted off it, so the clearance
            is that much smaller — 11vh + 2, 12vh + 2. */}
        <div className="relative z-10 flex min-h-0 flex-1 flex-col px-6 pt-10 pb-[20vh] md:px-12 md:pt-12 md:pb-[22vh] lg:px-16 lg:pt-8">
          <div className="flex flex-1 flex-col justify-center">
            <div className="flex flex-col gap-16 lg:flex-row lg:items-end lg:justify-between lg:gap-24">
              {/* Heading, standfirst and CTAs */}
              <div className="max-w-[720px]">
                <motion.h2
                  className="text-[clamp(44px,9vw,64px)] leading-[0.94] font-bold tracking-[-0.02em] text-[#BFA76F] lg:text-[clamp(56px,5.4vw,96px)]"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.4 }}
                >
                  {HEADLINE_LINES.map((line, index) => (
                    <span
                      key={line}
                      className="block overflow-hidden pb-[0.08em]"
                    >
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

                <motion.p
                  className="mt-8 max-w-[480px] text-[1rem] leading-[1.8] text-white/[0.65] md:text-[1.0625rem]"
                  variants={fadeUp}
                  custom={{ delay: 0.4, still: reducedMotion }}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.6 }}
                >
                  From the first frame to the final grade — if you can picture
                  it, we can film it.
                </motion.p>

                <motion.div
                  className="mt-10 flex flex-wrap gap-4 md:mt-12"
                  variants={fadeUp}
                  custom={{ delay: 0.5, still: reducedMotion }}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.6 }}
                >
                  <Button
                    href="/contact"
                    className="group rounded-full bg-[#F8F7F4] text-[#0F1C2E] transition-[background-color,transform,box-shadow] duration-500 ease-out hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_8px_30px_rgba(248,247,244,0.15)]"
                    size="lg"
                  >
                    Start a project
                    <span
                      aria-hidden="true"
                      className="inline-block transition-transform duration-500 ease-out group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </Button>

                  <Button
                    href="/portfolio"
                    variant="outline"
                    className="group rounded-full border-[#BFA76F]/40 text-white transition-[color,border-color,transform,box-shadow] duration-500 ease-out hover:-translate-y-0.5 hover:border-[#BFA76F] hover:text-[#BFA76F] hover:shadow-[0_8px_30px_rgba(191,167,111,0.08)]"
                    size="lg"
                  >
                    View our work
                    <span
                      aria-hidden="true"
                      className="inline-block transition-transform duration-500 ease-out group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </Button>
                </motion.div>
              </div>

              {/* Contact information */}
              <motion.div
                className="flex shrink-0 flex-col gap-10 md:flex-row md:gap-20 lg:flex-col lg:gap-12 lg:pb-2"
                variants={fadeUp}
                custom={{ delay: 0.35, still: reducedMotion }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
              >
                <div>
                  <p className="mb-4 text-[0.6875rem] font-semibold tracking-[0.28em] text-white/35 uppercase">
                    Locations
                  </p>
                  <ul className="flex flex-col gap-2 text-[0.9375rem] text-white/[0.72]">
                    <li>Dubai</li>
                    <li>Kerala</li>
                    <li>Worldwide</li>
                  </ul>
                </div>

                <div>
                  <p className="mb-4 text-[0.6875rem] font-semibold tracking-[0.28em] text-white/35 uppercase">
                    Contact
                  </p>
                  <ul className="flex flex-col gap-2">
                    <li>
                      <ContactLink href={`mailto:${siteConfig.contact.email}`}>
                        {siteConfig.contact.email}
                      </ContactLink>
                    </li>
                    {siteConfig.contact.phone && (
                      <li>
                        <ContactLink href={`tel:${siteConfig.contact.phone}`}>
                          {siteConfig.contact.phone}
                        </ContactLink>
                      </li>
                    )}
                  </ul>
                </div>

                <div>
                  <p className="mb-4 text-[0.6875rem] font-semibold tracking-[0.28em] text-white/35 uppercase">
                    Follow
                  </p>
                  <ul className="flex flex-col gap-2">
                    <li>
                      <ContactLink
                        href={siteConfig.social.instagram || '#'}
                        external
                      >
                        Instagram
                      </ContactLink>
                    </li>
                    <li>
                      <ContactLink
                        href={siteConfig.social.linkedin || '#'}
                        external
                      >
                        LinkedIn
                      </ContactLink>
                    </li>
                    <li>
                      <ContactLink
                        href={siteConfig.social.youtube || '#'}
                        external
                      >
                        YouTube
                      </ContactLink>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>

          {/* ── Layer 5 · copyright ── */}
          <motion.p
            className="mt-12 text-center text-[0.75rem] tracking-[0.22em] text-white/30 uppercase md:mt-14 lg:mt-8"
            variants={fadeUp}
            custom={{ delay: 0.6, still: reducedMotion }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.8 }}
          >
            © {year} {siteConfig.name}. All rights reserved.
            <a href="https://nexeor.com"> | CREATED BY NEXEOR</a>
          </motion.p>
        </div>

        {/*
         * ── Layer 6 · monumental wordmark ──
         * Full-bleed across the card and deliberately cut off by its bottom
         * edge, so the lockup reads as something far larger than the frame
         * rather than a logo placed inside it.
         *
         * The visible band is measured in `vh`, not derived from the card's
         * width. Width-derived sizing meant a wide monitor produced a very
         * tall wordmark, which pushed the card past the viewport on exactly
         * the screens that had the least vertical room to spare. Anchoring it
         * to viewport height keeps the footer's vertical budget fixed, so the
         * card fits the screen the way the hero frame does.
         *
         * Flush to the bottom edge (`bottom-0`) — lifting it off left a dead
         * band of empty card beneath the lockup, which read as a mistake
         * rather than as margin.
         */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[16vh] overflow-hidden md:h-[18vh]"
          initial={{ opacity: 0, y: reducedMotion ? 0 : 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={
            reducedMotion
              ? { duration: 0.4, ease: EASE.out, y: INSTANT_Y }
              : { duration: 1.4, ease: EASE.expo, delay: 0.3 }
          }
        >
          <Image
            src="/images/logo-2.png"
            alt=""
            width={2040}
            height={393}
            loading="lazy"
            className="h-auto w-full opacity-[0.17]"
          />
        </motion.div>
      </div>
    </footer>
  );
}
