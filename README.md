# FC Filmwerks

Website for FC Filmwerks — a film production studio.

**Status: intro experience built; the rest of the site is not.** The scaffold,
design tokens, animation infrastructure and SEO plumbing are in place, plus the
full-screen intro and its aperture transition. The hero it reveals is a
placeholder.

## Stack

| Concern       | Choice                                                                    |
| ------------- | ------------------------------------------------------------------------- |
| Framework     | Next.js 15 (App Router), React 19                                         |
| Language      | TypeScript (strict)                                                       |
| Styling       | Tailwind CSS v4 — CSS-first config, no `tailwind.config`                  |
| Animation     | Framer Motion (entrances, layout), GSAP + ScrollTrigger (scroll-scrubbed) |
| Smooth scroll | Lenis, driven by the GSAP ticker                                          |
| Icons         | Lucide React                                                              |
| Tooling       | ESLint 9 (flat config), Prettier + Tailwind class sorting                 |

## Getting started

```bash
npm install
```

```bash
cp .env.example .env.local
```

```bash
npm run dev
```

The app runs at http://localhost:3000.

## Scripts

| Script              | Does                                            |
| ------------------- | ----------------------------------------------- |
| `npm run dev`       | Dev server with Turbopack                       |
| `npm run build`     | Production build                                |
| `npm run start`     | Serve the production build                      |
| `npm run lint`      | ESLint                                          |
| `npm run typecheck` | `tsc --noEmit`                                  |
| `npm run format`    | Prettier write                                  |
| `npm run check`     | typecheck + lint + format check — run before PR |

## Structure

```
src/
├── app/                      Routes, layouts, SEO route handlers
│   ├── page.tsx              Home — intro experience, no chrome by design
│   ├── (site)/               Content pages (header + footer chrome)
│   │   ├── layout.tsx
│   │   ├── error.tsx
│   │   └── loading.tsx
│   ├── layout.tsx            Root: fonts, providers, base metadata, JSON-LD
│   ├── globals.css           Tailwind theme + design tokens
│   ├── global-error.tsx
│   ├── not-found.tsx
│   ├── sitemap.ts            Generated from the nav config
│   ├── robots.ts             Blocks non-production deploys
│   └── manifest.ts
├── components/
│   ├── animations/           FadeIn, Stagger (Framer Motion), Parallax (GSAP)
│   ├── intro/                Intro experience + aperture transition
│   ├── layout/               Header, Footer
│   ├── providers/            SmoothScrollProvider (Lenis ↔ GSAP)
│   ├── sections/             Page sections — one file per block
│   ├── seo/                  JsonLd
│   └── ui/                   Button, Container, Section
├── config/                   site.ts, navigation.ts — content lives here
├── constants/                Animation timings, breakpoints
├── hooks/                    useGsap, useMediaQuery, useScrollDirection, …
├── lib/                      utils (cn), fonts, gsap, seo, api/
└── types/                    Shared TypeScript types
```

## Conventions

Read [`AGENTS.md`](AGENTS.md) for the working rules and
[`docs/brand.md`](docs/brand.md) for the colour system — in particular, why
gold is restricted to accents.

The short version:

- **Server components by default.** `'use client'` goes on the smallest leaf
  that needs it.
- **Import GSAP from `@/lib/gsap`**, never the package directly — plugins are
  registered there, once.
- **Colours come from tokens** (`bg-background`, `text-muted`, `bg-accent`),
  never hex literals.
- **`Section` owns vertical rhythm, `Container` owns horizontal.** Sections do
  not set their own max-width.
- Adding a route to `mainNav` in `src/config/navigation.ts` puts it in the
  header and the sitemap automatically.

## The intro experience

`src/components/intro/` holds the opening sequence. It is one pinned,
scrubbed GSAP timeline:

1. the headline and scroll cue retire while the lens grows
2. a nine-blade iris swings shut over the frame
3. a held beat of black — the intro is swapped for the hero behind the blades
4. the iris reopens onto the hero, which settles from slightly oversized

`<IntroExperience>` takes the hero as its children and owns the whole handoff:

```tsx
<IntroExperience>
  <Hero />
</IntroExperience>
```

The aperture is real mechanics, not a shrinking circle. Each blade is a rigid
leaf pivoting on a ring, and the opening is the hole left where no blade
covers — so it forms the curved nine-sided shape a cinema iris actually makes.
The geometry, and the reason the timeline animates _opening radius_ rather than
blade angle, is documented in [`src/lib/aperture.ts`](src/lib/aperture.ts).

Two constraints worth knowing before editing:

- **Do not put a pinned section inside a flex container.** ScrollTrigger cannot
  add pin spacing there; it writes a fixed height instead and the scroll
  distance silently disappears. This is why `<body>` is a plain block and the
  column layout lives in `app/(site)/layout.tsx`.
- **Idle loops and the scroll timeline must not share an element.** They both
  write `transform`, so the lens uses nested wrappers — `.lens-scroll`,
  `.lens-float`, `.lens-tilt`, `.lens-breathe` — one property each.

Lens sizes are 280 / 450 / 750 px by breakpoint, each clamped against viewport
height so a short screen scales it down rather than cropping it. Motion
intensity halves on mobile, and `prefers-reduced-motion` drops the pin, the
iris and every idle loop in favour of two plainly stacked sections.

## Animation

Two libraries, two jobs:

- **Framer Motion** — entrances, exits, layout transitions, anything reacting to
  React state. Start with `FadeIn` and `Stagger`.
- **GSAP + ScrollTrigger** — timelines and effects scrubbed against scroll
  position. Start with `Parallax` and the `useGsap` hook.

Lenis smooth scrolling is wired to the GSAP ticker in `SmoothScrollProvider`, so
both run on one frame loop and scroll-linked animations cannot drift behind the
scroll position. Visitors who prefer reduced motion get native scrolling.

## SEO

- `createMetadata()` in `src/lib/seo.ts` builds per-page metadata — title,
  canonical, Open Graph, Twitter, robots — from a few optional fields.
- `sitemap.ts` and `robots.ts` are generated; previews are excluded from
  indexing automatically.
- Organisation and WebSite JSON-LD render in the root layout.

Before launch: set `NEXT_PUBLIC_SITE_URL`, add `/opengraph-image.png`
(1200×630), and add real icons to `public/` and `manifest.ts`.
