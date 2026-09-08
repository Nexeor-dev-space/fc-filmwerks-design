/**
 * Kom Ban Records — the studio's music label.
 *
 * Not a client and not a past job: a second venture the studio owns, alongside
 * the film work. It therefore has no case study, no brief and no deliverables
 * list, and it is deliberately absent from the portfolio archive — putting it
 * among the commissions would say the studio was hired to make it.
 *
 * One record, read by the homepage band and by the About page's label chapter,
 * so the two cannot drift.
 *
 * PROVENANCE: `tagline` and `ambition` are the studio's own two sentences,
 * verbatim and unedited. "God's Own Country" is Kerala, which is where the
 * label is from and where the studio's Malayalam work is rooted — it is the
 * state's own phrase for itself, not a flourish added here. Everything else on
 * this record is a fact about the artwork or a label for the layout.
 *
 * WHAT IS NOT HERE, and why: no artists, no releases, no launch date and no
 * link. None were supplied. When the label has any of them, this is where they
 * go and both sections are built to grow a list.
 */
export const komBan = {
  name: 'Kom Ban Records',
  /** Set as the display heading, one line per entry. */
  nameLines: ['Kom Ban', 'Records'],
  kind: 'Music label',
  origin: 'God’s Own Country',
  tagline: 'Our premium record label, from God’s Own Country.',
  ambition:
    'We are destined to take Original Music Production to levels unfathomed.',
  /**
   * The label's own lockup, supplied by the studio.
   *
   * The artwork carries its own near-black ground, which is why both sections
   * frame it on black rather than knocking it out onto the site's navy: a
   * plate around it reads as a sleeve, where the bare file on navy would read
   * as an image that failed to composite.
   */
  logo: '/images/brand/komban-records-FCF.avif',
  logoAlt:
    'Kom Ban Records: the name lettered in gold, the O formed by a vinyl record, with an elephant’s head and trunk drawn into the K',
  /** Native proportion of the lockup, so `next/image` reserves the right box. */
  logoWidth: 620,
  logoHeight: 534,
} as const;
