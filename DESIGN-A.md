<!-- stardust:provenance
  writtenBy: stardust:direct (via stardust:uplift Phase 4)
  writtenAt: 2026-11-03T18:20:00Z
  againstDirection: stardust/direction.md#active-direction
  readArtifacts:
    - stardust/current/DESIGN.md
    - stardust/current/_brand-extraction.json
    - stardust/current/_computed-styles.json
    - stardust/uplift-improvements.md
    - styles/fonts.css
  synthesizedInputs: [role names (brand-native), mobile type steps (computed from the desktop scale)]
  stardustVersion: 0.32.1
  note: Shared site system for the three uplift variants. Variant A file: shared system + the variant section at the end.
-->
---
name: SEI — uplift variant A (faithful + improvements)
description: Variant A: captured IA with every improvement applied; static.
colors:
  ink: "#131517"
  slate: "#364153"
  paper: "#ffffff"
  hairline: "#e5e7eb"
  mist: "#d9d9d9"
  signal-red: "#d82b2a"
  signal-red-deep: "#b82322"
  sei-cyan: "#00c0f3"
  sei-green: "#a6ce39"
  deep-current: "#086c8a"
  footer-surface: "#2b2f33"
  muted-on-ink: "#999999"
typography:
  display:
    fontFamily: "circularxx, circularxx-heading-fallback, sans-serif"
    fontSize: "80px"
    fontWeight: 950
    lineHeight: 1.1
    letterSpacing: "-0.4px"
  headline-xl:
    fontFamily: "circularxx, circularxx-heading-fallback, sans-serif"
    fontSize: "48px"
    fontWeight: 950
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "circularxx, circularxx-heading-fallback, sans-serif"
    fontSize: "36px"
    fontWeight: 950
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  title:
    fontFamily: "circularxx, circularxx-heading-fallback, sans-serif"
    fontSize: "24px"
    fontWeight: 950
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  lede:
    fontFamily: "circularxx, circularxx-fallback, sans-serif"
    fontSize: "20px"
    fontWeight: 500
    lineHeight: 1.45
  body:
    fontFamily: "circularxx, circularxx-fallback, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "-0.01em"
  body-sm:
    fontFamily: "circularxx, circularxx-fallback, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "circularxx, circularxx-fallback, sans-serif"
    fontSize: "15px"
    fontWeight: 900
    lineHeight: 1.2
  eyebrow:
    fontFamily: "circularxx, circularxx-fallback, sans-serif"
    fontSize: "13px"
    fontWeight: 900
    letterSpacing: "0.12em"
  numeral:
    fontFamily: "circularxx, circularxx-heading-fallback, sans-serif"
    fontSize: "72px"
    fontWeight: 950
    lineHeight: 0.95
    letterSpacing: "-0.03em"
rounded:
  primary: "15px"
  card: "15px"
  tab: "15px 15px 0 0"
  action: "2px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "48px"
  2xl: "64px"
  section: "64px"
  section-tablet: "48px"
  section-mobile: "32px"
  gutter: "24px"
  gutter-mobile: "20px"
  content-max: "1280px"
components:
  button-primary:
    backgroundColor: "{colors.signal-red}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.action}"
    padding: "14px 22px"
  button-primary-hover:
    backgroundColor: "{colors.signal-red-deep}"
  button-secondary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.action}"
  button-outline-on-dark:
    backgroundColor: "transparent"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.action}"
  card:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.card}"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.action}"
  link:
    textColor: "{colors.ink}"
---

# Design System: SEI — uplift variant A (faithful + improvements)

## Overview

**Creative North Star: "Between the Lines"**

SEI's identity is a heavy CircularXX headline set on white bars that overlap a green→cyan field: the bars *are* the lines value is created between. The system keeps that gesture as its signature and tidies everything around it:
- one type scale (80 / 48 / 36 / 24)
- accents used as grounds and rules rather than as text
- red ranked to the actions that matter now
- proof set as numbers rather than infographics

Every pairing passes WCAG 2.2 AA.

**Key Characteristics:**
- CircularXX ExtraBlack headlines (950) ending in a period, tightly tracked.
- Offset white (or ink) heading bars over the 225° green→cyan field.
- Ink as the dark ground; cyan and green as fills, rules and numerals on ink.
- Near-square red actions; 15px radius on cards and panels; tab tops rounded.
- Tabular ExtraBlack numerals for every stat.

## Colors

### Primary
- **Signal Red** (#d82b2a): actions only. White on red = 4.89:1. Hover/active **Signal Red Deep** (#b82322, 6.36:1).

### Secondary
- **SEI Cyan** (#00c0f3): fills (leadership panels, rules, the gradient end) and text **on ink only** (8.57:1). Never text on white (2.14:1), and never white text on cyan.

### Tertiary
- **SEI Green** (#a6ce39): gradient start, highlighter bars, rules, and text on ink (10.03:1). Never text on white (1.82:1).
- **Deep Current** (#086c8a, captured as the newsletter gradient end): the cyan family's text colour on white (5.96:1) and white-on ground (5.96:1).

### Neutral
- **Ink** (#131517): text, role bar, dark bands, footer.
- **Slate** (#364153): secondary text on white.
- **Paper** (#ffffff): page ground. Pure white is retained as a brand-faithful inversion.
- **Hairline** (#e5e7eb) / **Mist** (#d9d9d9): rules, borders, quiet wells.
- **Footer Surface** (#2b2f33), **Muted on Ink** (#999999, 6.42:1 on ink): footer only.

### Named Rules
- **Accents are grounds, not ink.** Cyan and green carry text only on Ink. On paper they become bars, rules and fields.
- **Red is ranked.** At most two red-filled actions per viewport.

## Typography

**Display / Headline / Body:** CircularXX (licensed, Lineto), self-hosted `fonts/CircularXXSub-{Regular,Medium,Black,ExtraBlack}.woff2`. The weight map mirrors `styles/fonts.css`: 100–450 Regular, 451–750 Medium, 751–925 Black, 926–1000 ExtraBlack.

### Hierarchy
- **Display** (950, 80px / 1.1, -0.4px): hero h1 only. Mobile 44px.
- **Headline XL** (950, 48px / 1.1): the display-section h2 ("connective tissue"). Mobile 34px.
- **Headline** (950, 36px / 1.15): every other section h2. Mobile 28px.
- **Title** (950, 24px / 1.25): card, tile and article titles; promo tile heads step to 36 (wide) / 24 (narrow).
- **Lede** (500, 20px / 1.45): one paragraph under a section head (Figma body 20 Medium); max 60ch.
- **Body** (400, 17px / 1.55): card and panel copy; max 65ch.
- **Label** (900, 15px): buttons. **Eyebrow** (900, 13px, +0.12em, uppercase): captured eyebrows only.
- **Numeral** (950, 72px / 0.95, tabular-nums): stat values. The lead stat steps to 120px.

### Named Rules
- **One scale.** 80 / 48 / 36 / 24 / 20 / 17. No 34px or 30px.
- **Periods stay.** Headlines keep their captured terminal period.

## Layout

Content max 1280px. Gutters 24px (20px mobile). Section padding 64px (48px tablet, 32px mobile); the multi-audience hard floor fires, so 64px is the ceiling. 12-column grid; heroes and splits stay left-anchored.

## Elevation & Depth

Flat by default. **Lift** (`0 12px 32px rgba(19,21,23,.12)`) on card hover only. **Launcher** (`0 10px 30px rgba(0,0,0,.2)`) for the floating assistant. Depth otherwise comes from banding (paper, field, ink).

## Shapes

Cards and panels use 15px. Tabs round only their top corners. Actions are near-square (2px). Pills (999px) only for the role-picker chip.

## Components

### Buttons
- **Primary:** Signal Red, white Label, 14×22 padding, 48px min height, trailing arrow. Hover → #b82322 and the arrow nudges 3px (160ms). Focus: 3px ink outline offset 3px (paper outline on dark).
- **Secondary:** Ink fill, white label.
- **Outline on dark:** 1.5px white border, white label; hover fills white with ink text.

### Cards / Containers
- **Promo tile:** image ground, ink scrim at ≥ 60% under the text, white title, 15px radius.
- **Role card/door:** ink or paper, label + arrow, one destination, equal weight.
- **Leadership card:** portrait on mist, name/role overlay in ink; a cyan panel below with **ink** title and body.

### Inputs / Fields
- Email field: paper, 2px radius, 52px tall, ink text, hairline border; focus ring ink. Submit = Secondary button.

### Navigation
- The global header (logo, 4 menus, search, Client Login, Contact Us) and the ink role bar (role chip, explainer line, Why?, Talk to an advisor) are system components, restyled within the palette and never relabelled.

## Do's and Don'ts

### Do:
- **Do** keep the offset heading bars on the hero h1.
- **Do** set every stat in tabular ExtraBlack numerals.
- **Do** keep red for the one or two actions that matter now.

### Don't:
- **Don't** set cyan or green text on white, or white text on cyan or green.
- **Don't** use gradient text, glassmorphism, or side-stripe accents.
- **Don't** invent stats, quotes, eyebrows or people.

## Variant A — Faithful + improvements

**Role:** the risk-averse green-light. "Yes, that's us, with the obvious fixes."
**Composition:** the captured IA and section order:
header + role bar → hero → promo tiles → Tell us who you are → connective tissue → proof in practice → stats → leadership → newsletter → footer.
**Motion:** static. Only hover/focus transitions ≤ 200ms; nothing animates on load or scroll.

### Improvements applied (stardust/uplift-improvements.md)
1. **Contrast roles.**
   - "between the lines." is cyan on an **ink** bar.
   - "connective tissue" is ink over a green highlighter bar.
   - Leadership panels use ink text on cyan.
   - The proof h2 is ink on the field.
   - Newsletter copy sits on the deep-current end of its gradient.
2. **One role chooser.** The "Tell us who you are" panel holds three equal-weight role cards (captured labels and destinations, no red). The role-bar chip links to it.
3. **Ranked red.** Red fills only "Talk to an advisor" and "Register now". The assistant launcher becomes an ink pill with a red icon tile.
4. **One-viewport hero.** About 640px tall. The field wraps the bars, the lede sits inside the hero, and the promo row's top edge shows above the fold at 1440×900.
5. **Tab metrics.** Each case-study tab shows its lead metric under the logo. The tabs stay keyboard-operable (ARIA tabs).
6. **Typographic stats.** One ExtraBlack numeral row on ink, with $1.9T leading at 120px on a cyan rule. The map is a 12%-opacity texture.
7. **One scale.** Steps are 80/48/36/24. The display section is a two-column split (heading + lede | 280px ring), about 440px tall.
