'use client';

import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

import { aboutContact } from '@/config/about';
import { contactDetails, contactVisual } from '@/config/contact';
import { siteConfig } from '@/config/site';
import { EASE } from '@/constants';
import { usePrefersReducedMotion } from '@/hooks';

/** Fine film grain, the same texture used across the cinematic sections. */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

/**
 * The follow row, built only from the networks that actually have a URL in
 * `siteConfig.social`. Those fields are still empty, so rather than rendering
 * `href="#"` links — which look live but jump the visitor back to the top —
 * the row drops any network that is not configured, and hides itself if none
 * are. Filling in `src/config/site.ts` lights the row up with no change here.
 */
const socials: { label: string; href: string }[] = [
  { label: 'Instagram', href: siteConfig.social.instagram },
  { label: 'LinkedIn', href: siteConfig.social.linkedin },
  { label: 'YouTube', href: siteConfig.social.youtube },
  { label: 'Vimeo', href: siteConfig.social.vimeo },
].filter((entry) => Boolean(entry.href));

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
      : { duration: 0.9, ease: EASE.expo, delay },
  }),
};

/** Contact links share one underline treatment — gold, drawn left to right. */
function ContactLink({
  href,
  children,
  className,
  external,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={
        className ??
        'relative inline-block text-[0.9375rem] text-white/[0.72] transition-colors duration-500 ease-out after:absolute after:bottom-[-3px] after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-[#BFA76F] after:transition-transform after:duration-500 after:ease-out hover:text-[#BFA76F] hover:after:scale-x-100 focus-visible:text-[#BFA76F] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#BFA76F]'
      }
    >
      {children}
    </a>
  );
}

/**
 * Editorial contact information, paired with a cinematic still.
 *
 * Typography carries the information rather than cards — the same choice the
 * About page's mission strip makes for the same details. The still on the
 * right is the page's one large visual: a slow scroll-driven zoom, exactly
 * the treatment `AboutStory` gives its own still, so the two pages read as
 * one system.
 */
export function ContactDetails() {
  const reducedMotion = usePrefersReducedMotion();
  const stillRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: stillRef,
    offset: ['start end', 'end start'],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [24, -24]);
  const parallaxScale = useTransform(scrollYProgress, [0, 1], [1.15, 1]);
  const revealOpacity = useTransform(scrollYProgress, [0, 0.3], [0.25, 1]);

  return (
    <section
      id="contact-details"
      aria-labelledby="contact-details-heading"
      className="bg-[#0F1012] pt-20 pb-20 md:pt-28 md:pb-24 lg:pt-32 lg:pb-28"
    >
      <div className="w-full px-4 md:px-[3vw]">
        <div className="flex flex-col gap-16 lg:flex-row lg:items-start lg:justify-between lg:gap-20">
          {/* Editorial info column */}
          <div className="lg:w-[38%] lg:shrink-0">
            <motion.p
              id="contact-details-heading"
              className="mb-8 text-[0.875rem] font-semibold tracking-[0.28em] text-[#BFA76F] uppercase md:mb-10"
              variants={fadeUp}
              custom={{ delay: 0, still: reducedMotion }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.6 }}
            >
              {contactDetails.label}
            </motion.p>

            <motion.div
              variants={fadeUp}
              custom={{ delay: 0.08, still: reducedMotion }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
            >
              <p className="mb-3 text-[0.6875rem] font-semibold tracking-[0.28em] text-white/35 uppercase">
                Locations
              </p>
              <ul className="flex flex-col gap-1 text-[1.75rem] leading-[1.2] font-light tracking-[-0.01em] text-white uppercase md:text-[2.25rem]">
                {contactDetails.locations.map((location) => (
                  <li key={location}>{location}</li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              className="mt-12"
              variants={fadeUp}
              custom={{ delay: 0.16, still: reducedMotion }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.6 }}
            >
              <p className="mb-3 text-[0.6875rem] font-semibold tracking-[0.28em] text-white/35 uppercase">
                Phone
              </p>
              <ContactLink
                href={aboutContact.phoneHref}
                className="relative inline-block text-[1.5rem] font-light text-white transition-colors duration-500 ease-out after:absolute after:bottom-[-4px] after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-[#BFA76F] after:transition-transform after:duration-500 after:ease-out hover:text-[#BFA76F] hover:after:scale-x-100 focus-visible:text-[#BFA76F] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#BFA76F] md:text-[1.75rem]"
              >
                {aboutContact.phone}
              </ContactLink>
            </motion.div>

            <motion.div
              className="mt-12"
              variants={fadeUp}
              custom={{ delay: 0.24, still: reducedMotion }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.6 }}
            >
              <p className="mb-3 text-[0.6875rem] font-semibold tracking-[0.28em] text-white/35 uppercase">
                Email
              </p>
              <ContactLink
                href={`mailto:${aboutContact.email}`}
                className="relative inline-block text-[1.5rem] font-light text-white transition-colors duration-500 ease-out after:absolute after:bottom-[-4px] after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-[#BFA76F] after:transition-transform after:duration-500 after:ease-out hover:text-[#BFA76F] hover:after:scale-x-100 focus-visible:text-[#BFA76F] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#BFA76F] md:text-[1.75rem]"
              >
                {aboutContact.email}
              </ContactLink>
            </motion.div>

            {socials.length > 0 && (
              <motion.div
                className="mt-16 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/[0.08] pt-8"
                variants={fadeUp}
                custom={{ delay: 0.32, still: reducedMotion }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.6 }}
              >
                <span className="text-[0.6875rem] font-semibold tracking-[0.28em] text-white/35 uppercase">
                  Follow
                </span>
                {socials.map(({ label, href }) => (
                  <ContactLink key={label} href={href} external>
                    {label}
                  </ContactLink>
                ))}
              </motion.div>
            )}
          </div>

          {/* Cinematic still, almost edge to edge inside the gutter — same
              three-layer treatment (parallax, pull-out, image) as AboutStory,
              so no two animations ever share a `transform`. */}
          <div
            ref={stillRef}
            className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px] border border-white/[0.08] md:aspect-video lg:aspect-[4/5] lg:w-[500px] lg:shrink-0"
          >
            <motion.div
              className="absolute inset-x-0 -top-10 -bottom-10"
              style={
                reducedMotion
                  ? undefined
                  : { y: parallaxY, opacity: revealOpacity }
              }
            >
              <motion.div
                className="absolute inset-0"
                style={reducedMotion ? undefined : { scale: parallaxScale }}
              >
                <Image
                  src={contactVisual.image}
                  alt={contactVisual.imageAlt}
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="object-cover"
                />
              </motion.div>
            </motion.div>

            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-[#0A131F]/65 via-transparent to-[#0A131F]/25"
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.1] mix-blend-overlay"
              style={{ backgroundImage: GRAIN }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
