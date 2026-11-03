<!-- stardust:provenance
  writtenBy:        stardust:prototype/shape
  writtenAt:        2026-11-03T19:00:00Z
  page:             index
  variant:          C
  pageUrl:          https://main--sei--oharris69.aem.live/
  againstDirection: stardust/direction.md (Active) § Variant C
  consumedBy:       impeccable:craft (static C) + stardust:prototype Phase 2.4 (cinematic layer)
  readArtifacts: [stardust/current/pages/index.json, stardust/current/pages/index.html, DESIGN-C.md, DESIGN-C.json, stardust/uplift-questions.md, stardust/prototypes/index-A-proposed.html (frozen canon), skills/prototype/reference/motion-registers.md, motion-runtime.md, motion-attributes.md]
  stardustVersion:  0.32.1
  dominantDimension: motion-energy (kinetic-display)
  surprise: high
  surpriseMoves:
    - "cliché 1 replaced: plain section h2s → every h2 set on its own offset bar with cyan hairlines (signature-gesture extension; bank move 'promote the hero device to the system')"
    - "cliché 2 replaced: stat row → stacked numeral bars (one figure per line, split-flap / count-up landing on a cyan rule)"
    - "document-shape substitution: the page reads as a signage sequence of bars — hero three bars, every section head a bar, every number a bar"
  canonInherited: "tokens, @font-face, header, role bar, promo tiles, tell-us panel, proof tabs, leadership cards, newsletter, footer, launcher — from index-A-proposed.html"
  capturedTraitAmplified: "signature gesture — offset white heading bars (_brand-extraction.json#motifs.patterns[0]; hero only today)"
  register: kinetic-display (DESIGN-C.json extensions.motion.register; registerSource: direct)
  choreographies:
    - { name: hero-bars, kind: load, mechanism: "CSS @keyframes barWipe (clip-path inset 0 100% 0 0 → 0, 800ms expo, 110ms stagger) + text unmask (translateY 100% → 0) under html.js-anim gate", fallback: "no js-anim class → static; reduced-motion → static" }
    - { name: head-bars, kind: scroll, mechanism: "canonical runtime .display-head .word clip-path word wipes (scroll-driven) + IO .is-in → bar ::before scaleX 0→1", fallback: "noscript + reduced-motion force final" }
    - { name: numerals, kind: io, mechanism: "[data-flip] on digit cells ($1.9T, 2,000+, $206B+, $2B+, 8+) and [data-countup] on integers (58, 15); cyan rule under each stat scaleX 0→1 via .is-in", fallback: "text holds final values in markup; reduced-motion jumps to target" }
    - { name: card-rise, kind: scroll, mechanism: "[data-anim] on promo tiles, role cards, proof panel, leader cards (canonical scroll entrance, slide 48px, stagger 0.16)", fallback: "noscript + reduced-motion" }
  refused: [parallax pulls, soft long fades, marquee (no captured signage copy), bounce, letter-blur [data-split] on headings (legibility; words wipe instead)]
  compositionDelta_vs_A: ["hero-layout: bars over half field → full-bleed field with three bars (lede on its own bar)", "stats-layout: numeral row → stacked numeral bars", "section-heads: plain → on bars (system-wide)", "motion: static → kinetic-display"]
  compositionDelta_vs_B: ["hero-layout: split with role doors → full-bleed field with three bars", "section-order: captured order (promos 2nd, tell-us 3rd) vs B's proof-first", "section-presence: tell-us panel present (absorbed in B)", "proof: tabs vs proof wall"]
  voiceClassification: all copy captured-verbatim
  unsourcedContent: []
-->
---
slug: index
variant: C
register: brand
---

# Page shape: index — Variant C (kinetic bars)

The IA is identical to A: header, role bar, hero, promo tiles, tell us, connective tissue, proof, stats, leadership, newsletter, footer, launcher. The copy is the same as A's.

## Sections (deltas from A only)

1. **hero**
   - A full-bleed green→cyan field fills the whole hero, about 640px.
   - Three offset bars, all starting at the left page edge:
     - bar 1: white, "Financial value is created" (80/950, ink)
     - bar 2: ink, "between the lines." (cyan), offset right by about 80px
     - bar 3: white, short, "One partner. One connected wealth enterprise." (24/500)
   - Every bar carries 2px cyan hairlines top and bottom.
   - The promo row peeks above the fold at 1440×900.
2. **section heads**
   - Every h2 in the page sections sits on its own bar with cyan hairlines.
   - On paper sections the bar is ink with white text: "Perspectives from SEI Leadership.", and "The connective tissue of modern finance." with "connective tissue" in green on ink (10:1).
   - On the field, ink and deep sections the bar is paper with ink text.
   - Bars hang from the container's left edge; the lede stays below on the section ground.
3. **stats: stacked numeral bars**
   - Four rows on ink, each separated by a cyan 2px rule.
   - Each row is a numeral (left, 112px; $1.9T at 144px in cyan) plus its captured label (right, 20/500).
   - The world-map texture sits behind at 10%.

## Motion (kinetic-display)
See `choreographies` in provenance. Only one load moment (the hero bars). Everything else is scroll- or IO-triggered, with hard reveals.

## Data attributes
As A, with `section[data-section="stats"][data-layout="stack"]`.

## Unsourced content
None.
