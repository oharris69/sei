<!-- stardust:provenance
  writtenBy: stardust:extract
  writtenAt: 2026-11-03T17:42:00Z
  againstInput: https://main--sei--oharris69.aem.live/ (uplift --re-extract)
  readArtifacts:
    - stardust/current/_computed-styles.json
    - stardust/current/_brand-extraction.json
    - styles/fonts.css
  synthesizedInputs: []
  stardustVersion: 0.32.1
-->
---
name: SEI (current)
description: Descriptive snapshot of the live SEI home page design system (CircularXX live).
colors:
  ink: "#131517"
  white: "#ffffff"
  red: "#d82b2a"
  red-dark: "#b82322"
  cyan: "#00c0f3"
  green: "#a6ce39"
  gray-300: "#d9d9d9"
  gray-200: "#e5e7eb"
  footer-surface: "#2b2f33"
  muted: "#999999"
  slate: "#364153"
typography:
  display:
    fontFamily: "circularxx, circularxx-heading-fallback, sans-serif"
    fontSize: "80px"
    fontWeight: 1000
    lineHeight: 1.1
    letterSpacing: "-0.4px"
  headline:
    fontFamily: "circularxx, circularxx-heading-fallback, sans-serif"
    fontSize: "36px"
    fontWeight: 1000
    lineHeight: 1.4
    letterSpacing: "-0.02em"
  title:
    fontFamily: "circularxx, circularxx-heading-fallback, sans-serif"
    fontSize: "24px"
    fontWeight: 1000
    lineHeight: 1.33
  body:
    fontFamily: "circularxx, circularxx-fallback, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "-0.16px"
  lede:
    fontFamily: "circularxx, circularxx-fallback, sans-serif"
    fontSize: "22px"
    fontWeight: 500
    lineHeight: 1.25
  label:
    fontFamily: "circularxx, circularxx-fallback, sans-serif"
    fontSize: "14px"
    fontWeight: 900
rounded:
  card: "15px"
  tab: "15px 15px 0 0"
  pill: "50%"
spacing:
  content-padding: "24px"
  section: "64px"
  content-max: "1280px"
components:
  button-primary:
    backgroundColor: "{colors.red}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "{colors.red-dark}"
  card-promo:
    rounded: "{rounded.card}"
    textColor: "{colors.white}"
  card-leadership:
    backgroundColor: "{colors.cyan}"
    rounded: "{rounded.card}"
---

# Design System: SEI (current)

## Overview

**Creative North Star: "The Connective Field"**

The live home page is a white canvas punctuated by the signature green→cyan gradient field. Headlines in CircularXX ExtraBlack sit on white "bars" that overlap the gradient in the hero, a literal reading of "between the lines". Bands alternate white, gradient, ink and cyan, and red is kept for actions. A dark role bar under the header ("I'm a … Choose your role") and a dark "Recommended for you" panel bring in a personalisation layer.

Density is uneven. The hero runs about 770px with a large empty band below the heading bars, and the "Tell us who you are" panel opens with about 500px of whitespace above it at 1440. Elsewhere, sections sit 64px apart and headings hug their body copy. The type scale is ad hoc (80/48/36/34/24).

**Key Characteristics:**
- Heavy CircularXX headlines (ExtraBlack) with tight tracking, ending in a period.
- Green→cyan 225° gradient as the brand field.
- Red near-square CTAs reserved for actions.
- 15px card radius; tabs with 15px top corners.
- Ink stats band with a dotted world map and a cyan featured disc.

## Colors

### Primary
- **SEI Red** (#d82b2a): CTA buttons, "Talk to an advisor" and the SEI Assistant launcher; hover #b82322.

### Secondary
- **SEI Cyan** (#00c0f3): hero line 2, stat numerals, the featured stat disc, leadership card panels, the newsletter gradient and the role-bar picker label.

### Tertiary
- **SEI Green** (#a6ce39): the "connective tissue" emphasis, the RECOMMENDED FOR YOU eyebrow, case-study metrics and the gradient start.

### Neutral
- **Ink** (#131517): text, role bar, recommended panel, stats band and footer.
- **White** (#ffffff): canvas, and text on dark.
- **Hairline Gray** (#d9d9d9 / #e5e7eb): borders.
- **Footer Surface** (#2b2f33) and **Muted** (#999999): the footer legal row.

## Typography

**Display Font:** CircularXX (licensed, Lineto), ExtraBlack cut (weights 926–1000), self-hosted `/fonts/CircularXXSub-ExtraBlack.woff2`.
**Body Font:** CircularXX, Regular 400 / Medium 500; Black 900 for button labels.

### Hierarchy
- **Display** (1000, 80px, 88px line-height, -0.4px): the hero h1, split into an ink line and a cyan line.
- **Headline** (1000, 36–48px): section h2s. "Connective tissue" is 48px; the others are 36px.
- **Title** (1000, 24–48px): promo tile headings (48 / 34) and leadership article titles (24).
- **Lede** (500, 22–24px): hero lede and the display section paragraph.
- **Body** (400, 16–18px, 1.5): copy.
- **Label** (900, 14–16px): button text.

## Layout

The content max width is 1280px with 24px gutters and 64px between sections. Promo tiles sit in a 3-up asymmetric row (wide + 2 narrow). Case studies are a 4-tab folder. Stats is a two-column composition (numbers left, disc right) over a dotted map. Leadership cards run 4-up.

## Elevation & Depth

The page is mostly flat. Its one shadow (`rgba(0,0,0,0.2) 0 10px 30px`) sits on the floating assistant launcher. Depth comes from colour banding and image overlays.

## Shapes

Cards and the case-study panel use a 15px radius. Tabs round only their top corners. The featured stat is a full circle. Buttons are near-square.

## Components

### Buttons
- **Primary:** red fill, white Black-weight label, small padding; hover darkens to #b82322.
- **Outline on dark:** white 1px border, white label (role buttons).
- **Text link CTA:** ink bold text that turns red on hover (e.g. "View all insights →").

### Cards / Containers
- **Promo tile:** full-bleed image, large headline over the image, red CTA on the wide tile, 15px radius.
- **Recommended panel:** ink rounded panel with a green eyebrow, white h2 and three role buttons.
- **Leadership card:** portrait on gray with a name/role overlay, and a cyan text panel below holding the article title link.

### Inputs / Fields
- Newsletter email field: white, pill-ish radius, on a cyan→teal gradient band, with an ink submit button.

### Navigation
- Global header: logo, four dropdown triggers, search, Client Login and Contact Us. Beneath it, an ink role bar: role picker, explanatory line, "Why?" and the red "Talk to an advisor".

## Do's and Don'ts

### Do:
- **Do** reserve red for actions.
- **Do** use the green→cyan gradient as the signature field.

### Don't:
- **Don't** set body copy below 14px.
