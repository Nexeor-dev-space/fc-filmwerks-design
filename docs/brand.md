# Brand system

Premium, cinematic, modern, luxurious — not corporate. Navy carries the brand;
gold is a garnish.

## Palette

| Token          | Value     | Role                                                      |
| -------------- | --------- | --------------------------------------------------------- |
| `--brand-navy` | `#0F1C2E` | Dominant. Text on light, backgrounds on dark, all chrome. |
| `--brand-gold` | `#BFA76F` | Accent only — see the rule below.                         |
| `--brand-bone` | `#F8F7F4` | Default page background, text on navy.                    |
| `--brand-ink`  | `#0A131F` | Deeper navy for full-bleed film sections, letterboxing.   |

All three are declared once in [`src/app/globals.css`](../src/app/globals.css).
Every other colour token is mixed from them with `color-mix()`, so retuning the
brand is a three-line change.

## The gold rule

Gold measures **2.0:1 against bone** — well under the 4.5:1 needed for text. On
a light background it is a decorative colour, not a legible one.

Use gold for:

- button and badge **fills**, with navy text on top (7.9:1 — passes)
- **dividers and hairlines** — the `.rule-accent` utility
- **underlines and hover states** — the `.link-accent` utility keeps the label
  in navy and animates a gold rule beneath it
- small **icons and marks** that are not carrying meaning on their own

Never use gold for:

- body copy, headings, or link text on the bone background
- large filled areas — it stops reading as precious the moment it covers a
  section
- more than one primary call to action in a viewport

On navy surfaces gold reaches 7.9:1 and _can_ carry text and links. That is
where the accent is meant to live, and why the dark theme is the expressive one.

If gold-family text is genuinely needed on a light background, use
`--accent-ink` (`#856A30`, 4.8:1) rather than lightening the layout around it.

## Contrast reference

| Combination     | Ratio  | Verdict                   |
| --------------- | ------ | ------------------------- |
| Navy on bone    | 16.0:1 | Body text, headings       |
| Bone on navy    | 16.0:1 | Body text, headings       |
| Gold on navy    | 7.9:1  | Text and links            |
| Navy on gold    | 7.9:1  | Button labels             |
| Gold on bone    | 2.0:1  | Decorative only — no text |
| Accent-ink/bone | 4.8:1  | Small text, sparingly     |

## Form

- **Radius** is `2px` (`--radius`), not a pill. Near-square edges read as title
  cards and editorial layout; fully rounded buttons read as SaaS.
- **Buttons** are uppercase with `0.12em` tracking — the letter-spacing does
  more for the premium feel than any colour choice.
- **Motion** is slow and eased out (`--ease-out-expo`), matching the Lenis
  scroll. Nothing should snap.
- **Space** is the main luxury signal. When a section looks thin, add vertical
  room via `Section spacing="xl"` before adding ornament.
