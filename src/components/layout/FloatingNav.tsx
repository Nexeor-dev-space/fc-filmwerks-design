'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

import { useHeroRevealed } from '@/components/intro/HeroRevealContext';
import { Container } from '@/components/ui';
import { mainNav } from '@/config/navigation';
import { siteConfig } from '@/config/site';
import { DURATION, EASE } from '@/constants';

/**
 * Transparent navigation floating over the hero video.
 *
 * It is absolutely positioned so the footage runs full-bleed underneath it,
 * and it waits for the aperture to open before fading in — otherwise its
 * entrance is spent behind the intro.
 *
 * MENU opens a full-screen overlay rather than being decorative: a control
 * that looks like a button should behave like one.
 */
export function FloatingNav() {
  const revealed = useHeroRevealed();
  const [open, setOpen] = useState(false);

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
        className="absolute inset-x-0 top-0 z-50"
        initial={{ opacity: 0, y: -16 }}
        animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: -16 }}
        transition={{ duration: DURATION.slow, ease: EASE.out, delay: 0.1 }}
      >
        <Container size="wide" className="py-8 md:py-10 lg:py-12">
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

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="rounded-full bg-[#F8F7F4] px-7 py-3 text-[0.6875rem] font-semibold tracking-[0.28em] text-[#0F1C2E] uppercase transition-colors duration-300 ease-out hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#BFA76F] md:px-9 md:py-3.5 md:text-xs"
            >
              Menu
            </button>
          </nav>
        </Container>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            className="fixed inset-0 z-100 bg-navy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.fast, ease: EASE.out }}
          >
            <Container size="wide" className="py-8 md:py-10 lg:py-12">
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
            </Container>

            <Container size="wide" className="mt-16 md:mt-24">
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
                      className="inline-block text-4xl font-medium tracking-tight text-bone transition-colors duration-300 hover:text-[#BFA76F] md:text-6xl"
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
