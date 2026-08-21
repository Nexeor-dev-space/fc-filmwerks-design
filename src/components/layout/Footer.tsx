import Link from 'next/link';

import { Container } from '@/components/ui';
import { footerNav } from '@/config/navigation';
import { siteConfig } from '@/config/site';

/**
 * Structural shell only — the visual design has not been applied yet.
 * A server component: it renders navigation from config and needs no client
 * JavaScript.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border">
      <Container className="py-16">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <p className="text-sm font-semibold tracking-widest uppercase">
              {siteConfig.name}
            </p>
            <p className="mt-3 text-sm text-muted">{siteConfig.tagline}</p>
            {siteConfig.contact.email && (
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="mt-4 inline-block text-sm underline underline-offset-4"
              >
                {siteConfig.contact.email}
              </a>
            )}
          </div>

          <div className="flex gap-12 sm:gap-16">
            {footerNav.map((section) => (
              <nav key={section.title} aria-label={section.title}>
                <p className="text-xs tracking-widest text-muted uppercase">
                  {section.title}
                </p>
                <ul className="mt-4 flex flex-col gap-3">
                  {section.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-sm text-muted transition-colors hover:text-foreground"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <p className="mt-16 text-xs text-muted">
          © {year} {siteConfig.name}. All rights reserved.
          <a href="https://nexeor.com">| CREATED BY NEXEOR</a>
        </p>
      </Container>
    </footer>
  );
}
