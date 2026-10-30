<!-- stardust:provenance
  writtenBy: stardust:extract
  writtenAt: 2026-10-29T23:32:00Z
  readArtifacts:
    - stardust/current/_computed-styles.json
    - stardust/current/_brand-extraction.json
    - styles/styles.css
  synthesizedInputs: []
  stardustVersion: 0.32.1
-->
---
name: SEI (current)
description: Descriptive snapshot of the live SEI home page design system.
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
    fontFamily: "DM Sans, dm-sans-fallback, sans-serif"
    fontSize: "64px"
    fontWeight: 1000
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "DM Sans, dm-sans-fallback, sans-serif"
    fontSize: "36px"
    fontWeight: 1000
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "DM Sans, dm-sans-fallback, sans-serif"
    fontSize: "24px"
    fontWeight: 1000
    lineHeight: 1.2
  body:
    fontFamily: "DM Sans, dm-sans-fallback, sans-serif"
    fontSize: "16px"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "-0.01em"
  label:
    fontFamily: "DM Sans, dm-sans-fallback, sans-serif"
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

The live home page is a white canvas punctuated by a signature green→cyan gradient field. Headlines in heavy DM Sans (weight 1000) sit on white "bars" that offset over the gradient in the hero, a literal reading of "between the lines". Bands alternate white, gradient, ink-dark and cyan; red is reserved for actions.

Density is moderate-to-tight: section spacing is 64 px, headings sit close to their body copy, and body copy runs small (14–16 px) relative to the very heavy headlines. The scale is ad-hoc (64/48/36/34/30/24/20).

**Key Characteristics:**
- Heavy, tightly-tracked sans headlines ending in a period.
- Green→cyan 225° gradient as the brand field.
- Red square-ish CTAs reserved for actions.
- 15 px card radius; tabs with 15 px top corners.
- Ink-dark stats band with a dotted world map and a cyan featured disc.

## Colors

### Primary
- **SEI Red** (#d82b2a): CTA buttons and the SEI Assistant launcher; hover #b82322.

### Secondary
- **SEI Cyan** (#00c0f3): hero second line, stat numerals, featured stat disc, leadership card panels, newsletter gradient end.

### Tertiary
- **SEI Green** (#a6ce39): emphasis word in the display heading, gradient start, case-study metrics.

### Neutral
- **Ink** (#131517): text, dark band, footer.
- **White** (#ffffff): canvas, text on dark.
- **Hairline Gray** (#d9d9d9 / #e5e7eb): borders.
- **Footer Surface** (#2b2f33), **Muted** (#999999): footer legal row.

## Typography

**Display Font:** DM Sans (substitute for licensed CircularXX), fallback Arial-adjusted.
**Body Font:** DM Sans.

### Hierarchy
- **Display** (1000, 64px, 1.2): hero h1.
- **Headline** (1000, 36px, 1.2): section h2s.
- **Title** (1000, 20–34px): card and tab headings.
- **Body** (500, 14–18px, 1.5): copy; often 14px in cards.
- **Label** (900, 14px): button text.

## Layout

1280 px max content width, 24 px gutters (20 px mobile), 64 px section spacing (48 px mobile). Cards in 3- and 4-column rows; the case-study block is a 4-tab folder; stats is a two-column composition (numbers left, disc right) over a map.

## Elevation & Depth

Mostly flat. One shadow (`rgba(0,0,0,0.2) 0 10px 30px`) on the floating assistant launcher. Depth comes from colour banding and image overlays.

## Shapes

15 px radius on cards and the case-study panel; tabs round only the top; the featured stat is a full circle; buttons are near-square.

## Components

### Buttons
- **Primary:** red fill, white bold label, small padding; hover darkens to #b82322.
- **Text link CTA:** ink bold text, hover red (e.g. "View all insights →").

### Cards / Containers
- **Promo card:** full-bleed image, dark overlay, white title/copy, red CTA, 15 px radius.
- **Leadership card:** portrait on gray with name/role overlay, cyan text panel below with article title link.

### Inputs / Fields
- Newsletter email field: white, 15 px radius on a cyan gradient band; ink pill submit button.

### Navigation
- Global header (not in scope of the redesign): logo, four dropdown triggers, search, Client Login, Contact Us.

## Do's and Don'ts

### Do:
- **Do** reserve red for actions.
- **Do** use the green→cyan gradient as the signature field.

### Don't:
- **Don't** set body copy below 14px.
