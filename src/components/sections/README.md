# Sections

One file per full-width block of a page — `Hero.tsx`, `ShowreelSection.tsx`,
`ServicesSection.tsx`, and so on.

Conventions:

- A section owns its own `Section` + `Container` wrappers, so a page body reads
  as a list of section components with no layout markup between them.
- Keep sections server components. Push `'use client'` down into the specific
  interactive or animated child that needs it, so the section's markup still
  renders on the server.
- Content comes in through props or `src/config`, never hard-coded inline —
  that is what makes a section reusable across pages and easy to hand to a CMS
  later.
- Group by page once a page owns several sections: `sections/home/Hero.tsx`.
