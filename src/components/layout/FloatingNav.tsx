'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, type MouseEvent } from 'react';

import { useRouteTransition } from '@/components/transition';
import { Button, Magnetic } from '@/components/ui';
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

export function FloatingNav({ immediate = false }: FloatingNavProps = {}) {
  const [revealed, setRevealed] = useState(false);
  const [open, setOpen] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const transition = useRouteTransition();

  /*
   * Header links leave through the iris. The menu closes either way; the
   * transition then takes the navigation itself, unless the browser should
   * keep it: a modifier click, a link to the page already open, or a visitor
   * who has asked for reduced motion.
   */
  const cut = (href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    setOpen(false);
    transition.intercept(event, href);
  };

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
      {/*
       * The header lets pointer events through everywhere except its own
       * controls. Its padding makes the fixed box a good deal taller than the
       * logo and buttons look, and anything sticky that parks just under them,
       * such as the portfolio's filter rail, sits inside that invisible band.
       * With the box catching pointer events, taps on the upper half of every
       * filter went to this padding and did nothing, which made the rail feel
       * as though it only worked sometimes. Only the nav row is a target, and
       * only once it has been revealed.
       */}
      <motion.header
        className="pointer-events-none fixed inset-x-0 top-0 z-[110]"
        initial={{ opacity: 0, y: -16 }}
        animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: -16 }}
        transition={{ duration: DURATION.slow, ease: EASE.out, delay: 0.1 }}
      >
        <div className="w-full px-4 py-8 md:px-[3vw] md:py-10 lg:py-12">
          <nav
            aria-label="Main"
            className={cn(
              'flex items-center justify-between gap-6',
              revealed && 'pointer-events-auto',
            )}
          >
            <Link
              href="/"
              className="inline-flex"
              aria-label={siteConfig.name}
              onClick={cut('/')}
            >
              <Image
                src="/images/logo-2.png"
                alt={siteConfig.name}
                width={2040}
                height={393}
                priority
                className="h-6 w-auto md:h-7 lg:h-8"
              />
            </Link>

            <div className="flex items-center gap-3 md:gap-5">
              {/*
               * The one call to action that is on screen for the whole visit.
               * The homepage hero sits two viewports into the lens intro and
               * its copy fades as the next section climbs, so a CTA that lived
               * only there was seen for a few seconds of scroll. This one does
               * not move. Bone rather than gold, so it never competes with a
               * page's own gold action in the same viewport.
               */}
              <Magnetic className="hidden sm:inline-flex">
                <Button
                  href="/contact"
                  size="sm"
                  className="rounded-full bg-[#F8F7F4] text-[#0F1C2E] transition-[background-color,transform,box-shadow] duration-500 ease-out hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_8px_30px_rgba(248,247,244,0.15)] focus-visible:outline-[#BFA76F]"
                  onClick={cut('/contact')}
                >
                  Start a project
                </Button>
              </Magnetic>

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
              <Magnetic className="-mr-3">
                <button
                  type="button"
                  onClick={() => setOpen((wasOpen) => !wasOpen)}
                  aria-expanded={open}
                  aria-controls="site-menu"
                  aria-label={open ? 'Close menu' : 'Open menu'}
                  className="group inline-flex h-12 w-12 items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#BFA76F]"
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
                          open && 'openClass' in line
                            ? line.openClass
                            : line.rest,
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
              </Magnetic>
            </div>
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
            className="fixed inset-2 z-100 overflow-y-auto rounded-[28px] bg-navy md:inset-3"
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
            <div className="mt-28 w-full px-4 md:mt-36 md:px-[3vw]">
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
                      onClick={cut(item.href)}
                      className="inline-block text-3xl font-medium tracking-tight text-bone transition-colors duration-300 hover:text-[#BFA76F] md:text-5xl"
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
