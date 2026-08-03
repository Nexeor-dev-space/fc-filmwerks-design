# FC Filmwerks — working notes

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind v4 · Framer Motion ·
GSAP + ScrollTrigger · Lenis.

## Conventions

- **Tailwind v4 has no `tailwind.config.ts`.** The theme is CSS-first, in
  `src/app/globals.css`. Add design tokens to `:root` and expose them through
  the `@theme inline` block.
- **Colour comes from tokens, never literals.** Use `bg-background`,
  `text-muted`, `border-border`, `bg-accent`. Read `docs/brand.md` before
  using gold for anything — it fails contrast as text on light surfaces.
- **Import GSAP from `@/lib/gsap`,** never from `gsap` directly. That module
  registers ScrollTrigger exactly once and sets shared defaults.
- **Server components by default.** Add `'use client'` to the smallest leaf
  that needs interactivity, not to a whole section.
- **Animation values come from `src/constants/animations.ts`** so timing stays
  consistent across Framer Motion and GSAP.
- **Layout wrappers**: `Section` owns vertical rhythm, `Container` owns
  horizontal. Sections should not set their own max-width or gutters.
- **Every GSAP effect must clean up** — use the `useGsap` hook, or wrap in
  `gsap.context()` and `revert()` on unmount. Uncleaned ScrollTriggers leak
  across client-side navigation.
- **Never nest a pinned ScrollTrigger section inside a flex container.**
  ScrollTrigger cannot add pin spacing there — it writes a fixed height on the
  spacer instead, and the section's scroll distance vanishes with no warning.
  `<body>` is a plain block for this reason.
- **One transform per element.** An idle loop and a scroll timeline animating
  the same element will overwrite each other; give each its own wrapper.
- Content and routes live in `src/config`. A page added to `mainNav` appears in
  the header and the sitemap automatically.

## Checks

Run before considering a change done:

```bash
npm run check
```

That is `typecheck` + `lint` + `format:check`. `npm run build` for the full
production pass.
