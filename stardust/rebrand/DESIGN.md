---
name: SEI — The Lobby Floor (rebrand R)
description: A mid-century terrazzo rebrand of SEI. Many pieces poured into one surface, divided by brass strips.
colors:
  lobby-stone: "#E6EBE7"
  slab-white: "#F5F7F5"
  verde-matrix: "#0F2B26"
  verde-veil: "#3D5450"
  brass-strip: "#A88231"
  brass-engraved: "#6B5117"
  saffron-chip: "#F2B33D"
  rose-chip: "#E8B6A6"
  mist-chip: "#C9D3CE"
  pebble-chip: "#93A19C"
typography:
  display:
    fontFamily: "Archivo, 'Archivo Fallback', Arial, sans-serif"
    fontSize: "clamp(2.75rem, 6.4vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 125"
  headline:
    fontFamily: "Archivo, 'Archivo Fallback', Arial, sans-serif"
    fontSize: "clamp(2rem, 3.6vw, 3.25rem)"
    fontWeight: 760
    lineHeight: 1.02
    letterSpacing: "-0.015em"
    fontVariation: "'wdth' 115"
  title:
    fontFamily: "Archivo, 'Archivo Fallback', Arial, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 700
    lineHeight: 1.15
    fontVariation: "'wdth' 105"
  body:
    fontFamily: "'Source Serif 4', Georgia, serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  lede:
    fontFamily: "'Source Serif 4', Georgia, serif"
    fontSize: "clamp(1.25rem, 1.6vw, 1.5rem)"
    fontWeight: 400
    lineHeight: 1.4
  title-lg:
    fontFamily: "Archivo, 'Archivo Fallback', Arial, sans-serif"
    fontSize: "clamp(1.375rem, 2.2vw, 2rem)"
    fontWeight: 700
    lineHeight: 1.15
    fontVariation: "'wdth' 112"
  small:
    fontFamily: "'Source Serif 4', Georgia, serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.4
  figure-sm:
    fontFamily: "Archivo, 'Archivo Fallback', Arial, sans-serif"
    fontSize: "clamp(2rem, 3.4vw, 3.25rem)"
    fontWeight: 800
    lineHeight: 1
    fontFeature: "'tnum' 1, 'lnum' 1"
    fontVariation: "'wdth' 125"
  label:
    fontFamily: "Archivo, 'Archivo Fallback', Arial, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "0.08em"
    fontVariation: "'wdth' 112"
  figure:
    fontFamily: "Archivo, 'Archivo Fallback', Arial, sans-serif"
    fontSize: "clamp(2.5rem, 5vw, 4.5rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontFeature: "'tnum' 1, 'lnum' 1"
    fontVariation: "'wdth' 125"
rounded:
  none: "0px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  strip: "2px"
  section-desktop: "64px"
  section-tablet: "48px"
  section-mobile: "32px"
components:
  button-primary:
    backgroundColor: "{colors.saffron-chip}"
    textColor: "{colors.verde-matrix}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "15px 22px"
  button-primary-hover:
    backgroundColor: "{colors.verde-matrix}"
    textColor: "{colors.saffron-chip}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.verde-matrix}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "13px 20px"
  card:
    backgroundColor: "{colors.slab-white}"
    textColor: "{colors.verde-matrix}"
    rounded: "{rounded.none}"
    padding: "24px"
  input:
    backgroundColor: "{colors.slab-white}"
    textColor: "{colors.verde-matrix}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "14px 16px"
    height: "52px"
  badge:
    backgroundColor: "{colors.rose-chip}"
    textColor: "{colors.verde-matrix}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "4px 8px"
  link:
    textColor: "{colors.verde-matrix}"
    typography: "{typography.label}"
---

<!-- stardust:provenance
  writtenBy: stardust:direct (--rebrand)
  writtenAt: 2026-11-03T19:40:00Z
  againstInput: "--rebrand bold from-scratch rebrand of the SEI home page (hands-off)"
  readArtifacts: [stardust/current/_brand-extraction.json, stardust/current/pages/index.json, PRODUCT.md]
  synthesizedInputs: [seed SEI|2026-11-03 → 1950s × Terrazzo × Real-estate listing × cream (ground overridden to monochrome-tint), palette anchor coolors "Monochrome Harmony"]
  stardustVersion: 0.32.1
-->

# Design System: SEI — The Lobby Floor

## Overview

**Creative North Star: "The Lobby Floor"**

Picture the floor of a 1950s financial building's lobby, poured in terrazzo. Chips of stone, glass and marble are bound in one cement matrix and divided into bays by thin brass strips. That floor is SEI's promise made physical: capabilities "rarely found under one roof", joined into one surface. The system is built from **slabs** (flat, square-edged fields of one tone) laid side by side and separated by **strips** (2px brass rules). The page reads as a plan of bays, not a stack of floating cards.

The register borrows the structure of a **property listing sheet**: facts are set in ruled specification rows, features are listed plainly and each bay has one labelled action. Type pairs a mid-century **expanded grotesque** (Archivo at width 125) for display and figures with a sturdy **reading serif** (Source Serif 4) for prose. That pairing is the opposite of SEI's outgoing all-geometric-sans voice. Density is balanced (64px section rhythm). The design is static: only state transitions move.

**Key Characteristics:**
- Cool mineral ground (lobby stone), deep verde matrix ink, saffron chips for actions, rose chips for proof.
- Square corners everywhere (0px). Depth comes from slab tone, never from shadow.
- 2px brass strips divide bays horizontally and vertically. They are the system's only ornament besides the terrazzo field.
- Terrazzo aggregate field: discrete chips in palette colours, used on at most two surfaces per page.
- Figures are set as specification rows, never as a trust bar.

## Colors

A cool stone-and-verde mineral palette, warmed by two chip colours that do the talking.

### Primary
- **Verde Matrix** (#0F2B26 / oklch(26.6% 0.035 180)): the cement that binds the floor. Primary text on light grounds and the ground of dark slabs (directory, stats, footer). 12.5:1 on Lobby Stone.
- **Saffron Chip** (#F2B33D / oklch(80.6% 0.147 79)): the action colour. Primary button fill (Verde text, 8.1:1) and the newsletter slab. It is never used as text on light grounds.

### Secondary
- **Rose Chip** (#E8B6A6 / oklch(81.7% 0.063 38)): proof. Ground of the case-study slab and the badge fill. Verde text 8.4:1.
- **Brass Strip** (#A88231 / oklch(62.8% 0.108 83)): divider strips, the ruled lines of spec rows and the "between the lines" bars. Decorative only, never text.
- **Brass Engraved** (#6B5117 / oklch(45.1% 0.081 83)): eyebrow labels on light slabs (6.2:1 on Lobby Stone).

### Neutral
- **Lobby Stone** (#E6EBE7 / oklch(93.5% 0.008 152)): page ground. Cool mineral. It passes the cream test (R−B = −1).
- **Slab White** (#F5F7F5 / oklch(97.4% 0.003 146)): raised slab surface (listing bays, plates, inputs).
- **Verde Veil** (#3D5450 / oklch(42.6% 0.029 183)): secondary text on light (6.7:1 on Lobby Stone, 7.6:1 on Slab White).
- **Mist Chip** (#C9D3CE / oklch(85.8% 0.013 165)): secondary text and rules on Verde (9.8:1).
- **Pebble Chip** (#93A19C / oklch(69.6% 0.017 172)): terrazzo aggregate only.

### Named Rules
**The Chip Dose Rule.** Saffron and Rose are chips, not paint. Each covers at most one full slab per page. Elsewhere they appear only as buttons, badges and aggregate.

**The No Gradient Rule.** The outgoing green→cyan field is retired. No gradients on any surface, text or border.

## Typography

**Display Font:** Archivo (OFL 1.1, Omnibus-Type; variable wdth 62–125, wght 100–900), with Arial fallback
**Body Font:** Source Serif 4 (OFL 1.1, Adobe; variable opsz 8–60, wght 200–900), with Georgia fallback

**Character:** Archivo at width 125 is broad and level, like a 1950s extended grotesque cut into a lobby directory. Source Serif 4 is a calm, workmanlike reading face that makes long copy feel considered rather than marketed.

### Hierarchy
- **Display** (800, wdth 125, clamp(2.75rem, 6.4vw, 6rem), lh 0.98): the hero headline only.
- **Headline** (760, wdth 115, clamp(2rem, 3.6vw, 3.25rem), lh 1.02): section h2s.
- **Title** (700, wdth 105, 1.375rem, lh 1.15): card titles, leader names, article titles.
- **Figure** (800, wdth 125, tabular lining, clamp(2.5rem, 5vw, 4.5rem)): stat and case-study values.
- **Lede** (Source Serif 4 400, clamp(1.25rem, 1.6vw, 1.5rem), lh 1.4): section intros, max 38ch.
- **Body** (Source Serif 4 400, 1.0625rem, lh 1.6): paragraphs, max 62ch.
- **Label** (Archivo 650, wdth 112, 0.8125rem, +0.08em, uppercase): eyebrows, buttons, nav, spec-row labels.

### Named Rules
**The Two Voices Rule.** Archivo speaks in names, numbers and actions. Source Serif 4 speaks in sentences. A paragraph is never set in Archivo, and a button is never set in the serif.

**The No Accent Face Rule.** No third family, no italic display accents and no monospace metadata.

## Layout

A 12-column plan grid (max 1320px, 24px gutters, 24px page margin under 768px). Sections are full-bleed slabs that meet edge to edge, and 2px brass strips mark every slab boundary inside a section. Bays inside a section sit flush; strips replace gutters (no gaps between cards). Section padding is 64px desktop, 48px tablet and 32px mobile (balanced density, multi-audience floor). Under 900px the bays stack and vertical strips become horizontal ones. Listing rows collapse from three columns to one.

## Elevation & Depth

Flat by doctrine. There are no shadows anywhere. Depth is conveyed by slab tone (Lobby Stone < Slab White for raised, Verde for recessed) and by the strips.

### Named Rules
**The Poured Floor Rule.** Nothing floats. A surface that needs emphasis changes tone or gains a brass strip. It never gains a shadow, blur or glass.

## Shapes

Square-cut throughout (0px radius): buttons, inputs, slabs, images and tabs. Captured images that ship with baked rounded corners are cropped inside a square frame (overflow hidden, 1.04 scale) so the square edge holds. The only non-rectilinear shapes are the terrazzo chips: irregular polygons, never circles, never rotated stamps.

## Components

### Buttons
- **Shape:** square (0px).
- **Primary:** Saffron Chip fill, Verde Matrix label (Archivo label style), padding 15px 22px, with a trailing arrow glyph.
- **Hover / Focus:** fill and label invert to Verde with Saffron (160ms colour transition). Focus is a 3px Verde outline at 3px offset; on dark grounds the outline is Saffron.
- **Secondary:** transparent with a 2px Verde border; on hover it fills Verde with a Lobby Stone label.

### Chips (badges)
- **Style:** Rose Chip fill, Verde label, 4px 8px. Used for date/time and spec tags.

### Cards / Containers (bays)
- **Corner Style:** 0px.
- **Background:** Slab White on Lobby Stone, or Lobby Stone on Verde.
- **Shadow Strategy:** none (see Elevation).
- **Border:** none. Bays are separated by 2px Brass strips.
- **Internal Padding:** 24px (mobile 20px).

### Inputs / Fields
- **Style:** Slab White fill, 2px Verde border, 0px radius, 52px tall. The label sits above in label style.
- **Focus:** the border becomes 3px Verde and an outer 3px Saffron outline appears.

### Navigation
- Not sticky. Archivo label style in Verde on Lobby Stone. A disclosure button opens a square Slab White panel separated by a Brass strip. On mobile the nav collapses behind a "Menu" disclosure button.

### Spec Row (signature)
A ruled row: Brass strip above, a Figure value left and a Label/serif description right. It is used for stats and case-study metrics. Rows stack vertically like a listing sheet; they never line up horizontally as a trust bar.

### Terrazzo Field (signature)
A dense SVG aggregate on Lobby Stone (200px seamless tile):
- About 780 irregular polygon chips, mostly 2–8px across.
- At most four larger Verde chips.
- Rose plus Saffron is about 8% of the chips.

It is decorative (aria-hidden), appears on at most two surfaces per page (the hero "between the lines" band and one inlay plate) and never sits behind text.

### Lines Band (signature)
The display line set between two 3px Brass rules. This double-weight strip is reserved for the band. The words sit on Lobby Stone and the aggregate fills the rest of the band to the viewport edge. The text column has a fixed em width, so content beneath can align to the aggregate's left edge. Under 640px the aggregate drops to a 56px strip below the words.

### Inlay Medallion
A captured mark shown on a Lobby Stone plate with a double Brass edge (2px border, plus a 2px outline at 6px offset), set inside the terrazzo plate. The image runs through a three-tone SVG duotone: the darkest 20% of luminance maps to Verde, the mid-tones to Brass, and the lights to Lobby Stone.

### Directory Board
A Verde slab with a Brass frame and title plate. Each ruled row holds an Archivo name, a pebble dot leader and an outlined Saffron arrow square. Hover or focus fills the arrow and turns the label Saffron.

### Image treatments
Captured imagery keeps its position and alt text, re-toned into the palette:
- Promo art is shown as a Verde→white screen duotone.
- Leader portraits are greyscale and return to colour on hover or focus.
- The world map is set as Verde dots at 50%.

### Assistant Launcher
A fixed 52px Verde square with a Saffron edge and glyph. The label reveals on hover/focus. The launcher inverts to Saffron fill on interaction.

## Do's and Don'ts

### Do:
- **Do** separate bays with 2px Brass strips (#A88231) instead of gaps or shadows.
- **Do** set every figure in Archivo wdth 125 with tabular lining numerals, inside a Spec Row.
- **Do** keep Saffron (#F2B33D) for actions and at most one full slab per page.
- **Do** crop images square inside a frame and keep them at their captured semantic role.

### Don't:
- **Don't** use rounded corners, shadows, gradients, glass or blur.
- **Don't** reintroduce SEI's outgoing green→cyan field, red action buttons or CircularXX.
- **Don't** line up three or four big numbers horizontally as a trust bar.
- **Don't** put text on the terrazzo field or set display copy over a photograph.
- **Don't** use Saffron, Rose or Brass Strip as text colours on light grounds.
