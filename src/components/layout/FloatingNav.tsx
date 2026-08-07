'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

import { mainNav } from '@/config/navigation';
import { siteConfig } from '@/config/site';
import { DURATION, EASE } from '@/constants';
import { INTRO_SEEN_EVENT, hasSeenIntro } from '@/lib/intro-seen';

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
export function FloatingNav() {
  const [revealed, setRevealed] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (hasSeenIntro()) {
      setRevealed(true);
      return;
    }

    const onSeen = () => setRevealed(true);
    window.addEventListener(INTRO_SEEN_EVENT, onSeen);
    return () => window.removeEventListener(INTRO_SEEN_EVENT, onSeen);
  }, []);

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
        className="fixed inset-x-0 top-0 z-50"
        initial={{ opacity: 0, y: -16 }}
        animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: -16 }}
        transition={{ duration: DURATION.slow, ease: EASE.out, delay: 0.1 }}
        style={{ pointerEvents: revealed ? 'auto' : 'none' }}
      >
        <div className="w-full px-4 py-8 max-[340px]:px-2.5 max-[340px]:py-4 md:px-[3vw] md:py-10 lg:py-12">
          <nav
            aria-label="Main"
            className="flex items-center justify-between gap-6 max-[340px]:gap-2"
          >
            <Link href="/" className="inline-flex" aria-label={siteConfig.name}>
              <Image
                src="/images/logo-2.png"
                alt={siteConfig.name}
                width={2040}
                height={393}
                priority
                className="h-6 w-auto max-[340px]:h-4.5 max-[280px]:h-4 md:h-7 lg:h-8"
              />
            </Link>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="rounded-full bg-[#F8F7F4] px-7 py-3 text-[0.6875rem] font-semibold tracking-[0.28em] text-[#0F1C2E] uppercase transition-colors duration-300 ease-out hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#BFA76F] max-[340px]:px-3.5 max-[340px]:py-2 max-[340px]:text-[9px] max-[340px]:tracking-[0.1em] md:px-9 md:py-3.5 md:text-xs"
            >
              Menu
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
            className="fixed inset-2 z-100 overflow-y-auto rounded-[28px] bg-navy md:inset-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.fast, ease: EASE.out }}
          >
            <div className="w-full px-4 py-8 md:px-[3vw] md:py-10 lg:py-12">
              <div className="flex items-center justify-between gap-6">
                <Image
                  src="/images/logo-2.png"
                  alt=""
                  width={2040}
                  height={393}
                  className="h-6 w-auto md:h-7 lg:h-8"
                />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  autoFocus
                  className="rounded-full border border-white/25 p-3 text-bone transition-colors duration-300 hover:border-[#BFA76F] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#BFA76F]"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="mt-16 w-full px-4 md:mt-24 md:px-[3vw]">
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
