<!-- stardust:provenance
  writtenBy: stardust:direct
  writtenAt: 2026-10-29T23:40:00Z
  againstDirection: stardust/direction.md#active-direction
  readArtifacts:
    - stardust/current/_brand-extraction.json
    - stardust/current/_computed-styles.json
    - stardust/current/DESIGN.md
    - stardust/prototypes/index-improvements.md
    - PRODUCT.md
  synthesizedInputs: [type scale (1.25 ratio), spacing scale, component defaults — derived from captured tokens + direction]
  stardustVersion: 0.32.1
-->
---
name: SEI — brand-faithful refresh
description: One partner. One connected wealth enterprise — the SEI system, re-tuned for hierarchy, rhythm and polish.
colors:
  ink: "#131517"
  slate: "#364153"
  paper: "#ffffff"
  fog: "#f3f4f6"
  hairline: "#e5e7eb"
  signal-red: "#d82b2a"
  signal-red-deep: "#b82322"
  sei-cyan: "#00c0f3"
  sei-green: "#a6ce39"
  deep-current: "#086c8a"
typography:
  display:
    fontFamily: "DM Sans, dm-sans-fallback, sans-serif"
    fontSize: "clamp(2.625rem, 1.4rem + 3.4vw, 4.125rem)"
    fontWeight: 1000
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "DM Sans, dm-sans-fallback, sans-serif"
    fontSize: "clamp(2rem, 1.5rem + 1.4vw, 2.625rem)"
    fontWeight: 1000
    lineHeight: 1.08
    letterSpacing: "-0.03em"
  title:
    fontFamily: "DM Sans, dm-sans-fallback, sans-serif"
    fontSize: "clamp(1.375rem, 1.2rem + 0.4vw, 1.65rem)"
    fontWeight: 900
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  subtitle:
    fontFamily: "DM Sans, dm-sans-fallback, sans-serif"
    fontSize: "1.3125rem"
    fontWeight: 900
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  lede:
    fontFamily: "DM Sans, dm-sans-fallback, sans-serif"
    fontSize: "clamp(1.125rem, 1.05rem + 0.3vw, 1.3125rem)"
    fontWeight: 500
    lineHeight: 1.45
    letterSpacing: "-0.01em"
  body:
    fontFamily: "DM Sans, dm-sans-fallback, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "-0.005em"
  label:
    fontFamily: "DM Sans, dm-sans-fallback, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "0.12em"
  numeral:
    fontFamily: "DM Sans, dm-sans-fallback, sans-serif"
    fontSize: "clamp(3rem, 2rem + 3vw, 5.25rem)"
    fontWeight: 1000
    lineHeight: 0.95
    letterSpacing: "-0.04em"
rounded:
  none: "0px"
  card: "15px"
  tab: "15px 15px 0 0"
  pill: "999px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "24px"
  "6": "32px"
  "7": "48px"
  "8": "64px"
  section-desktop: "64px"
  section-tablet: "48px"
  section-mobile: "32px"
  content-max: "1280px"
  gutter: "24px"
components:
  button-primary:
    backgroundColor: "{colors.signal-red}"
    textColor: "{colors.paper}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "14px 22px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.signal-red-deep}"
  button-secondary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "14px 22px"
  link:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
  card:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.card}"
    padding: "24px"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    height: "52px"
    padding: "0 16px"
---

# Design System: SEI — brand-faithful refresh

## Overview

**Creative North Star: "The Connected Ledger"**

SEI's system already owns a field — the green→cyan gradient — and a gesture — headlines on white bars that sit "between the lines". The refresh keeps both and spends its effort on precision: one modular type scale, one section rhythm, one 12-column grid, and every number set like a ledger entry — tabular, aligned, legible. Distinctiveness comes from the rigour of the alignment and the confidence of the numerals, not from new decoration.

Density is balanced: 64px section padding on desktop with generous internal gaps, so seven bands read as a calm sequence rather than a stack. Colour is used structurally — white ground, gradient fields at the two moments that matter (the hero and the proof band), one ink band for scale, red only where something happens.

**Key Characteristics:**
- Heavy DM Sans headlines (900–1000), tight tracking, ending in a period.
- The green→cyan 225° field and the white-bar headline as the two brand signatures.
- Ink text on every coloured field; white text only on ink or on darkened imagery.
- Tabular, baseline-aligned numerals for every figure.
- Square red actions; 15px cards; hairline rules as the catalogue device.

## Colors

The captured SEI palette, pinned; roles tightened so every text pairing passes AA.

### Primary
- **Signal Red** (#d82b2a): primary actions only (buttons, the assistant launcher). White text on it is 4.89:1. Hover deepens to **Signal Red Deep** (#b82322).

### Secondary
- **SEI Cyan** (#00c0f3): fills — leadership panels, the featured-stat disc, gradient end, numerals on ink (8.57:1). Never text on white (2.14:1).

### Tertiary
- **SEI Green** (#a6ce39): gradient start, fills and rules. Green text on white fails even the large-text bar (1.82:1), so green appears as fill, rule and gradient only; an emphasis word on white is set in Ink with a thick green→cyan gradient underline.
- **Deep Current** (#086c8a): dark end of the newsletter gradient (captured). Also the accent *text* colour on white (5.96:1) — it carries the cyan family where cyan itself cannot be read: the hero's second line, emphasis words.

### Neutral
- **Ink** (#131517): text, the scale band, primary dark surface.
- **Slate** (#364153): secondary text on white (10.4:1).
- **Paper** (#ffffff): page ground.
- **Fog** (#f3f4f6): quiet alternate surface (case-study panel ground, input wells).
- **Hairline** (#e5e7eb): rules and dividers.

### Named Rules
**The Red Means Go Rule.** Signal Red appears only on things you can press. Never on headings, rules or decoration.
**The Ink On Field Rule.** Text on the gradient, cyan or green fields is always Ink. White text lives on Ink and on scrimmed imagery only.

## Typography

**Display Font:** DM Sans (with dm-sans-fallback, Arial size-adjusted)
**Body Font:** DM Sans
**Label Font:** DM Sans, uppercase, tracked

**Character:** One geometric family carried at extreme weight contrast — 1000-weight headlines over 400-weight body — so hierarchy comes from mass, not from a second face.

### Hierarchy
- **Display** (1000, 42→66px, 1.02, −0.035em): the hero headline only.
- **Headline** (1000, 32→42px, 1.08, −0.03em): every section h2, identical across sections.
- **Title** (900, 22→26px, 1.15): promo card titles, case-study logo row labels.
- **Subtitle** (900, 21px, 1.2): leadership article titles, featured metrics.
- **Lede** (500, 18→21px, 1.45): the one paragraph under each section headline; max 60ch.
- **Body** (400, 17px, 1.55): card and panel copy; max 65ch.
- **Label** (800, 13px, +0.12em, uppercase): the existing "STAY CONNECTED" eyebrow, stat labels' small caps where captured copy is already a label.
- **Numeral** (1000, 48→84px, 0.95, tabular-nums): every stat value.

### Named Rules
**The One Scale Rule.** Ratio 1.25 from a 17px body. No ad-hoc sizes; a new size is a new step or it does not exist.
**The Ledger Rule.** Numbers use `font-variant-numeric: tabular-nums lining-nums` and share a baseline with their siblings.

## Layout

12-column grid inside a 1280px content max, 24px gutters (20px under 600px). Section block padding 64px desktop / 48px tablet / 32px mobile on every band, no exceptions; headline-to-lede gap 16px, lede-to-content gap 40px desktop / 32px mobile. Two breakpoints: 600px and 900px (the site's existing pair), plus a 1200px refinement for four-up rows. Mobile stacks single-column; four-up rows go 2×2 at tablet.

## Elevation & Depth

Flat by default. Depth comes from colour bands, image scrims and the white-bar overlap. One shadow vocabulary for interactive lift:
- **Lift** (`box-shadow: 0 12px 32px rgba(19, 21, 23, 0.12)`): card hover only.
- **Launcher** (`box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2)`): the global assistant launcher (existing, untouched).

**The Flat At Rest Rule.** Surfaces are flat at rest; lift appears only as a response to hover or focus.

## Shapes

15px radius on cards and media; tabs round only the top (15px 15px 0 0); buttons and inputs are square (0px) — the brand's sharp action shape; the featured stat stays a full circle. Hairline 1px rules separate catalogue rows (case-study metrics, stat tiles).

## Components

### Buttons
- **Shape:** square (0px).
- **Primary:** Signal Red, white 800-weight 16px label, 14px 22px padding, 48px min height, trailing arrow.
- **Hover / Focus:** background deepens to #b82322 and the arrow nudges 3px right (160ms ease-out); focus is a 3px Ink outline offset 3px.
- **Secondary:** Ink fill, white label — used for the newsletter submit.

### Cards / Containers
- **Corner Style:** 15px.
- **Background:** Paper, or full-bleed image with an Ink scrim (≥ 55% at the text zone).
- **Shadow Strategy:** Flat at rest; Lift on hover with a 2px rise (honours reduced motion).
- **Internal Padding:** 24px (28px ≥ 900px).

### Inputs / Fields
- **Style:** Paper fill, 1px Hairline-to-Ink border, square, 52px tall, visible label above.
- **Focus:** border to Ink plus 3px cyan outline ring.

### Navigation
- Global header/footer are the existing site chrome and are not restyled.

### Case-study switcher (signature)
Folder tabs carrying client logos on a Fog rail; the active tab joins a Paper panel. Panel: story copy left, two metrics right in Ink numerals with a gradient rule beneath each. Keyboard: arrow keys move between tabs.

### Stat mosaic (signature)
Ink band, dotted world map as a low-contrast backdrop, stat tiles on a shared baseline separated by hairlines at 12% white, the featured stat as the cyan disc with Ink text.

## Do's and Don'ts

### Do:
- **Do** keep every heading, line of copy, CTA and image of the source page, in order.
- **Do** set text on gradient, cyan and green fields in Ink (#131517).
- **Do** use one headline size for every section h2 (32→42px).
- **Do** give every figure tabular lining numerals on a shared baseline.
- **Do** honour `prefers-reduced-motion`: no transforms, no smooth scroll.

### Don't:
- **Don't** put white text on cyan (2.14:1) or green text on white (1.82:1).
- **Don't** use Signal Red for anything that is not pressable.
- **Don't** add eyebrows, stats, quotes, logos or copy that the source page does not carry.
- **Don't** use gradient text, glassmorphism or decorative motion.
- **Don't** introduce a second typeface or a colour outside the captured palette.
