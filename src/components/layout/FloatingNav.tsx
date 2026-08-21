'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { clients } from '@/config/clients';
import { mainNav } from '@/config/navigation';
import { siteConfig } from '@/config/site';
import { DURATION, EASE } from '@/constants';
import { usePrefersReducedMotion } from '@/hooks';
import { INTRO_SEEN_EVENT, hasSeenIntro } from '@/lib/intro-seen';
import { cn } from '@/lib/utils';

/**
 * Transparent site navigation, fixed above everything.
 *
 * Rendered at page level rather than inside the hero, for two reasons: it has
 * to survive past the hero to stay on screen for the whole page, and a `fixed`
 * element nested inside the hero would be trapped anyway — the reveal scale on
 * its wrapper makes that wrapper the containing block for fixed descendants.
 *
 * Visibility is driven by an event rather than React context because it now
 * sits outside the intro's tree entirely. It stays hidden through the lens
 * sequence, which is meant to carry no navigation at all.
 *
 * MENU opens a full-screen overlay rather than being decorative: a control
 * that looks like a button should behave like one.
 */
interface FloatingNavProps {
  /**
   * Show the nav immediately instead of waiting for the intro to finish.
   *
   * Required on any page that does not mount `IntroExperience`. The reveal is
   * driven by an event the intro fires, and `hasSeenIntro()` reads an
   * attribute that is never persisted across page loads — so without this the
   * nav on a standalone route waits for a signal that can never arrive and
   * stays hidden for the whole visit.
   */
  immediate?: boolean;
}

/**
 * The three rules, top to bottom.
 *
 * `y` is ±8px because the outer rules sit 8px either side of the box centre —
 * exactly what carries them onto the middle line before they rotate, so the
 * cross closes on a single point rather than a seam. Change the box height or
 * the rule spacing and this has to move with it.
 *
 * The shortened bottom rule is the whole reason this reads as drawn rather
 * than defaulted: three identical rules are what every framework ships. It
 * runs out to full width on hover, which is also what makes the hover feel
 * like the icon opening rather than merely recolouring.
 *
 * Width is a CSS class rather than a Framer value on purpose — Framer owns
 * `transform` and `opacity` here, and animating width through it would put two
 * writers on the same element.
 */
const LINES = [
  {
    key: 'top',
    rest: 'top-0 w-full',
    variants: { closed: { y: 0, rotate: 0 }, open: { y: 8, rotate: 45 } },
  },
  {
    key: 'middle',
    rest: 'top-[8px] w-full',
    variants: {
      closed: { opacity: 1, scaleX: 1 },
      open: { opacity: 0, scaleX: 0 },
    },
  },
  {
    key: 'bottom',
    /* Full width while open, or the cross would come out lopsided. */
    rest: 'bottom-0 w-[64%] group-hover:w-full',
    openClass: 'bottom-0 w-full',
    variants: { closed: { y: 0, rotate: 0 }, open: { y: -8, rotate: -45 } },
  },
] as const;

const SOCIALS = [
  { label: 'Instagram', href: siteConfig.social.instagram },
  { label: 'LinkedIn', href: siteConfig.social.linkedin },
  { label: 'YouTube', href: siteConfig.social.youtube },
] as const;

/**
 * Small link for the menu foot — gold underline drawn left to right on hover.
 *
 * Deliberately not the panel's own link treatment: those carry a standing rule
 * because the list of pages is the point of the panel, whereas these are
 * details being offered rather than a menu being presented. It matches the
 * footer's `ContactLink` instead, which is the same job in the same tone.
 */
function FootLink({
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
      className="relative inline-block text-[0.9375rem] text-bone/[0.72] transition-colors duration-500 ease-out after:absolute after:bottom-[-3px] after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-[#BFA76F] after:transition-transform after:duration-500 after:ease-out hover:text-[#BFA76F] hover:after:scale-x-100 focus-visible:text-[#BFA76F] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#BFA76F]"
    >
      {children}
    </a>
  );
}

export function FloatingNav({ immediate = false }: FloatingNavProps = {}) {
  const [revealed, setRevealed] = useState(false);
  const [open, setOpen] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (immediate || hasSeenIntro()) {
      setRevealed(true);
      return;
    }

    const onSeen = () => setRevealed(true);
    window.addEventListener(INTRO_SEEN_EVENT, onSeen);
    return () => window.removeEventListener(INTRO_SEEN_EVENT, onSeen);
  }, [immediate]);

  // Nothing behind the overlay should scroll while it is up, and Escape is the
  // expected way out of a full-screen layer.
  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-[110]"
        initial={{ opacity: 0, y: -16 }}
        animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: -16 }}
        transition={{ duration: DURATION.slow, ease: EASE.out, delay: 0.1 }}
        style={{ pointerEvents: revealed ? 'auto' : 'none' }}
      >
        <div className="w-full px-4 py-8 md:px-[3vw] md:py-10 lg:py-12">
          <nav
            aria-label="Main"
            className="flex items-center justify-between gap-6"
          >
            <Link href="/" className="inline-flex" aria-label={siteConfig.name}>
              <Image
                src="/images/logo-2.png"
                alt={siteConfig.name}
                width={2040}
                height={393}
                priority
                className="h-6 w-auto md:h-7 lg:h-8"
              />
            </Link>

            {/*
             * Three rules and nothing else — no pill, border or backing shape.
             * The 48px box is an invisible hit target, not a container: the
             * icon is 18px tall and would otherwise be far below the minimum
             * touch size.
             *
             * The split of duties matters. Framer owns `transform` and
             * `opacity` for the morph; CSS owns `background-color` and `width`
             * for the hover. Both write to the same elements, so putting the
             * hover on a transform would mean one silently overwriting the
             * other every time the menu opened.
             */}
            <button
              type="button"
              onClick={() => setOpen((wasOpen) => !wasOpen)}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="group -mr-3 inline-flex h-12 w-12 items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#BFA76F]"
            >
              <span className="relative block h-[18px] w-9 md:w-10">
                {LINES.map((line) => (
                  <motion.span
                    key={line.key}
                    aria-hidden="true"
                    className={cn(
                      'absolute left-0 block h-[2px] rounded-full bg-[#F8F7F4]',
                      'transition-[width,background-color] duration-500 ease-out',
                      'group-hover:bg-[#BFA76F]',
                      open && 'openClass' in line ? line.openClass : line.rest,
                    )}
                    animate={open ? 'open' : 'closed'}
                    variants={line.variants}
                    transition={
                      reducedMotion
                        ? { duration: 0 }
                        : { duration: DURATION.fast, ease: EASE.inOut }
                    }
                  />
                ))}
              </span>
            </button>
          </nav>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            /*
             * Inset and rounded to the same measure as the intro frame
             * (`inset-2 md:inset-3`), so the menu reads as the same floating
             * panel language rather than a full-bleed takeover.
             *
             * `overflow-y-auto` rather than `overflow-hidden`: the radius needs
             * a clipping context either way, but on a short landscape phone the
             * link list can outrun the panel, and hidden would strand it with
             * no way to reach the last item.
             */
            className="fixed inset-2 z-100 flex flex-col overflow-y-auto rounded-[28px] bg-navy md:inset-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.fast, ease: EASE.out }}
          >
            {/*
             * No header of its own. The panel used to repeat the logo and
             * carry a bordered close button, but the site header now sits
             * above it and its trigger morphs into the cross — so both were
             * duplicates of controls already on screen. The top padding is
             * what clears that header.
             *
             * Focus is not moved anywhere on open, which is deliberate: the
             * trigger stays mounted and is itself the close control, so the
             * key that opened the menu also closes it without a tab.
             */}
            {/* `shrink-0` on both children: in a scrolling flex column the
                default would let the link list compress instead of scroll. */}
            <div className="mt-28 w-full shrink-0 px-4 md:mt-36 md:px-[3vw]">
              <ul className="flex flex-col gap-6 md:gap-8">
                {mainNav.map((item, index) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: DURATION.base,
                      ease: EASE.out,
                      delay: 0.06 * index,
                    }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      /*
                       * The rule sits under the text at rest rather than
                       * arriving on hover — it is part of how the list is set,
                       * not a hover affordance. Hover lifts the text and the
                       * rule to gold together, so the two never disagree about
                       * which item is being pointed at.
                       *
                       * Drawn as an `::after` bar rather than `border-b`, which
                       * is the same approach `.link-accent` takes in
                       * globals.css. A border here came out invisible: Tailwind
                       * v4 sets `border-bottom-style: var(--tw-border-style)`
                       * alongside the width, so the rule paints only if that
                       * variable resolves — and when it does not, you get a
                       * 2px-wide border with no style and nothing on screen.
                       * A background on a positioned pseudo-element has no such
                       * dependency.
                       *
                       * `pb-2` keeps the bar clear of the descenders.
                       */
                      className="relative inline-block pb-2 text-3xl font-medium tracking-tight text-bone transition-colors duration-300 after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:bg-bone/55 after:transition-colors after:duration-300 after:content-[''] hover:text-[#BFA76F] hover:after:bg-[#BFA76F] md:text-5xl"
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/*
             * The same client belt that closes the Trusted-by section, run
             * along the foot of the menu: the panel is otherwise a large field
             * of empty navy below the links, and this fills it with proof
             * rather than decoration.
             *
             * Deliberately a copy of the markup rather than a shared
             * component. It shares only the `animate-marquee-logos` keyframe;
             * everything else differs — smaller cap, tighter spacing, no
             * scroll-triggered entrance (the panel itself is the entrance) —
             * so the abstraction would be two configs pretending to be one.
             *
             * `mt-auto` is why the panel is a flex column: it pins the belt to
             * the bottom on a tall screen while still being pushed down by the
             * links on a short one.
             */}
            {/* The belt and the contact block travel together as one foot
                to the panel, so `mt-auto` goes on the group rather than on the
                belt — the spacing between the two then stays fixed however
                tall the screen is. */}
            <div className="mt-auto shrink-0">
              <div className="marquee-host relative overflow-hidden py-10 md:py-12">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-navy to-transparent md:w-32"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-navy to-transparent md:w-32"
                />

                <div className="animate-marquee-logos flex w-max">
                  {[0, 1].map((copy) => (
                    <ul
                      key={copy}
                      className="flex shrink-0 items-center"
                      // The duplicate is presentational; only the first is
                      // announced.
                      aria-hidden={copy === 1}
                    >
                      {clients.map((client) => (
                        <li
                          key={client.name}
                          className="flex shrink-0 items-center justify-center px-8 md:px-10"
                        >
                          {/* Same contrast-then-brightness treatment as the
                            Trusted-by belt — see the note there for why plain
                            grayscale loses the near-black marks on navy — and
                            the same hover, which drops every filter so the mark
                            comes up in full colour while it is being looked at.
                            The belt pauses under the cursor via `.marquee-host`
                            on the wrapper, so the logo stays still long enough
                            to be read. */}
                          <Image
                            src={client.logo}
                            alt={client.name}
                            width={352}
                            height={352}
                            loading="lazy"
                            className="h-auto max-h-[52px] w-auto max-w-none object-contain opacity-80 brightness-[1.85] contrast-[0.45] grayscale transition-[opacity,filter] duration-500 ease-out hover:opacity-100 hover:brightness-100 hover:contrast-100 hover:grayscale-0 md:max-h-[72px]"
                          />
                        </li>
                      ))}
                    </ul>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-5 border-t border-bone/15 px-4 py-8 md:gap-6 md:px-[3vw] md:py-10">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-6">
                  <p className="text-[0.6875rem] font-semibold tracking-[0.28em] text-bone/35 uppercase sm:w-28 sm:shrink-0">
                    Contact us
                  </p>
                  {/* The rule between items IS the sketch's `|`, drawn rather
                      than typed so it cannot be read aloud or copied. */}
                  <ul className="flex flex-wrap items-baseline gap-x-5 gap-y-2 [&>li+li]:border-l [&>li+li]:border-bone/20 [&>li+li]:pl-5">
                    {siteConfig.contact.phone && (
                      <li>
                        <FootLink href={`tel:${siteConfig.contact.phone}`}>
                          {siteConfig.contact.phone}
                        </FootLink>
                      </li>
                    )}
                    <li>
                      <FootLink href={`mailto:${siteConfig.contact.email}`}>
                        {siteConfig.contact.email}
                      </FootLink>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-6">
                  <p className="text-[0.6875rem] font-semibold tracking-[0.28em] text-bone/35 uppercase sm:w-28 sm:shrink-0">
                    Follow us
                  </p>
                  <ul className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
                    {SOCIALS.map((social) => (
                      <li key={social.label}>
                        <FootLink href={social.href || '#'} external>
                          {social.label}
                        </FootLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
