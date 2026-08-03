'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

import { Container } from '@/components/ui';
import { mainNav } from '@/config/navigation';
import { siteConfig } from '@/config/site';
import { useScrollDirection } from '@/hooks';
import { cn } from '@/lib/utils';

/**
 * Structural shell only — the visual design has not been applied yet.
 * The behaviour it already handles: hide-on-scroll-down, condense past the
 * fold, mobile menu open/close, and closing the menu on navigation.
 */
export function Header() {
  const pathname = usePathname();
  const { direction, isScrolled } = useScrollDirection();
  const [menuOpen, setMenuOpen] = useState(false);

  // Route changes are client-side, so the menu has to be closed explicitly.
  useEffect(() => setMenuOpen(false), [pathname]);

  // Prevent the page behind the mobile menu from scrolling under it.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const hidden = direction === 'down' && isScrolled && !menuOpen;

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-transform duration-300 ease-out',
        hidden && '-translate-y-full',
        isScrolled && 'bg-background/80 backdrop-blur-md',
      )}
    >
      <Container>
        <nav
          aria-label="Main"
          className="flex h-16 items-center justify-between md:h-20"
        >
          <Link
            href="/"
            className="text-sm font-semibold tracking-widest uppercase"
          >
            {siteConfig.name}
          </Link>

          <ul className="hidden items-center gap-8 md:flex">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'text-sm transition-colors',
                    pathname === item.href
                      ? 'text-foreground'
                      : 'text-muted hover:text-foreground',
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="md:hidden"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </Container>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-0 top-16 bg-background md:hidden"
        >
          <Container>
            <ul className="flex flex-col gap-6 py-10">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-2xl">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </div>
      )}
    </header>
  );
}
