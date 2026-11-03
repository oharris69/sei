<!-- stardust:provenance
  writtenBy:        stardust:prototype/shape
  writtenAt:        2026-11-03T17:55:00Z
  page:             index
  variant:          A
  pageUrl:          https://main--sei--oharris69.aem.live/
  againstDirection: stardust/direction.md (Active 2026-11-03T18:10:00Z) § Variant A
  consumedBy:       impeccable:craft
  readArtifacts:
    - stardust/current/pages/index.json
    - stardust/current/pages/index.html
    - stardust/current/_brand-extraction.json
    - DESIGN-A.md
    - DESIGN-A.json
    - stardust/uplift-improvements.md
    - stardust/direction.md
  stardustVersion:  0.32.1
  dominantDimension: fidelity (improvements-led)
  surprise: low
  capturedSourceLineage: see ## Sections (every section cites its captured origin)
  signatureElements:
    - { kind: motif, capturedSource: "_brand-extraction.json#motifs.patterns[0] offset white heading bars over green→cyan field", mechanism: "two offset bars on the hero h1 (line 2 on an ink bar in cyan for contrast)", fallback: "n/a (static)" }
    - { kind: motif, capturedSource: "motifs.gradients[1] 225° #a6ce39→#00c0f3", mechanism: "hero field + proof band", fallback: "n/a" }
    - { kind: motif, capturedSource: "media.imgs[5] SEI logo in gradient ring", mechanism: "connective-tissue ring image at 280px", fallback: "n/a" }
  antiTemplatePass:
    - { pattern: hero, defaultReflex: "centred stack + dual CTA", alternatives: ["captured offset bars over half field (left-anchored)", "split text/photo", "full-bleed type poster"], picked: "captured offset bars, compressed to ~640px", rationale: "signature gesture; improvement 4 fixes the poster height not the composition", reference: "stripe.com (headline+lede+exit in one viewport)" }
    - { pattern: promo cards, defaultReflex: "3 equal image cards", alternatives: ["captured wide+2 narrow asymmetric row", "single featured + list", "carousel"], picked: "captured asymmetric row (wide webcast + 2 narrow)", rationale: "captured expanding-accordion shape is the brand's; equal cards would flatten it" }
    - { pattern: stats, defaultReflex: "map + bubble infographic", alternatives: ["typographic numeral row on ink", "4-up stat cards", "stat ledger list"], picked: "typographic numeral row, $1.9T leading", rationale: "improvement 6", reference: "addepar.com four-metric grid" }
    - { pattern: case studies, defaultReflex: "logo tabs hiding three proofs", alternatives: ["tabs with lead metric on each tab", "4-up proof wall", "carousel"], picked: "tabs with lead metric on each tab", rationale: "A keeps captured composition (tabs); proof wall is B's bet" }
  substrateTransitions: { default: paper, exceptions: ["hero field (signature)", "ink: recommended panel + stats band (captured)", "field: proof band (captured)", "deep gradient: newsletter (captured cross-promo)"], note: "all transitions are captured bands reproduced, not added; A adds none" }
  voiceClassification: all copy captured-verbatim from pages/index.json / index.html (headings, body[], ctas[], nav, footer); no direction-authorized rewrites; aria-labels authored for a11y only
  compositionDelta_vs_B: ["hero-layout: offset bars over half field → split hero with three role doors", "section-order: promo→role panel→…→proof  vs  proof promoted second, promo rail third", "section-presence: standalone 'Tell us who you are' panel present (absorbed into hero in B)", "ia-priority: promotions lead → role routing leads"]
  compositionDelta_vs_C: ["hero-layout: compact bars over half field → full-bleed field with three bars (lede on its own bar)", "stats-layout: single numeral row → stacked numeral bars", "motion: static → kinetic-display choreography"]
-->
---
slug: index
variant: A
url: https://main--sei--oharris69.aem.live/
register: brand
---

# Page shape: index — Variant A (faithful + improvements)

Captured IA, same order. All seven items from `stardust/uplift-improvements.md` are applied and nothing else.

## Sections (in render order)

1. **header** (system-component `header`; lineage `_brand-extraction.json#systemComponents[site-header]`). White, 80px tall. SEI logo (`../../content/images/shared/sei-logo.png`, 44×40) on the left. Four menu triggers (Solutions / Who We Serve / Our Insights / About SEI) with chevrons. On the right: search icon, then "Client Login" and "Contact Us" as hairline-bordered buttons. Menus are `<details>` disclosures listing the captured submenu links. Mobile: stock hamburger.
2. **role bar** (system-component `role-bar`; lineage `systemComponents[role-bar]`). Ink strip, 48px.
   - Pill chip "I'm a **Choose your role**" (cyan label on ink, 8.57:1), linking to `#tell-us` (improvement 2).
   - Explainer "Tell us who you are and we'll map your path." (white 80%).
   - "Why?" text button.
   - Red "Talk to an advisor" → `/modals/schedule-eric-dunn` (one of only two red fills, improvement 3).
3. **hero** (lineage `pages/index.json headings[0]` + `body[0]`; motif `patterns[0]`). About 640px tall.
   - The green→cyan field fills the right ~55% and runs full height behind the bar edges.
   - Bar 1: white, "Financial value is created" in ink, 80px / 950.
   - Bar 2, offset right: **ink**, "between the lines." in cyan (improvement 1).
   - Lede "One partner. One connected wealth enterprise." 24px Medium, inside the hero on paper.
   - The gradient strip is rejoined to the field (improvement 4). The promo row's top edge shows above the fold at 1440×900.
4. **promo tiles** (lineage `body[1–6]`, `ctas[9–11]`, `media.imgs[2–4]`). 3-up asymmetric row: wide (6/12) + narrow (3/12) + narrow (3/12), 15px radius, 420px tall.
   - Wide tile: "Data Cloud webcast" (36/950), the lede, "Thursday, October 1 · 11 am ET", red "Register now" → `/insights/events/data-cloud-webcast`. Ink scrim ≥ 60% under the text.
   - "SEI Marketplace": "Explore our ETFs and funds.", "Invest today →" (white text link) → `/etfs`. The image has a light ground, so this tile carries an ink scrim plate.
   - "$12B in market cap": "SEI's momentum makes its mark.", "Read Q2 press release →" → `/about/newsroom/q2-results`.
   - Narrow-tile heads at 24/950 (scale snap, improvement 7).
5. **tell us who you are** (`id="tell-us"`; lineage `body[7–11]`, `headings[4]`, `ctas[12–14]`). Ink rounded panel (15px).
   - Green eyebrow "RECOMMENDED FOR YOU".
   - h2 "Tell us who you are. We'll tailor what you see." (36/950, white).
   - The captured lede.
   - **Three equal-weight role cards** in a 3-up grid inside the panel: "I'm a financial advisor" → `/bd-breakaway`, "I'm at an enterprise RIA" → `/enterprise-ria`, "I'm an asset manager" → `/asset-managers`. Each has a 1.5px white outline, white label and arrow; hover fills paper with ink text. No red (improvements 2, 3).
6. **connective tissue** (lineage `headings[5]`, `body[12]`, `media.imgs[5]`). A two-column split about 440px tall.
   - Left: h2 "The **connective tissue** of modern finance." (48/950). "connective tissue" is ink over a green highlighter bar (lower 0.42em); the cyan full stop becomes ink (improvement 1).
   - Below it, the lede (20 Medium).
   - Right: the ring image at 280px (improvement 7).
7. **proof in practice** (lineage `headings[6]`, `body[13–19]`, index.html tab panels, logos `content/images/logos/*`). Green→cyan field band.
   - h2 "Proof in practice." in **ink** (improvement 1), plus the captured lede in ink.
   - ARIA tablist of 4 folder tabs (15px top radius), each showing the logo **and its lead metric**: Summit "$2B+ · Asset migration", FFT "$2B+ · Assets under management", TCW "$206B+ · Assets under management", Kent State "8+ years · Trusted OCIO partnership" (improvement 5).
   - White panel: the captured paragraph, "Read the full case study →", and two metric columns (ExtraBlack numerals in **deep-current** on white, 5.96:1; captured labels).
   - Arrow-key navigation via a small inline script (a11y only, documented).
8. **stats** (lineage `headings[7]`, `body[20–31]`, `media` world-map `content/images/home/world-map.png`). Ink band.
   - h2 "Depth you can feel. Reach you can measure." (white), plus the lede in cyan (on ink, 8.57:1).
   - Numeral row: **$1.9T** leads at 120px cyan with a 6px cyan rule under it and the label "Assets Under Management & Administration". Then 58 / 15 / 2,000+ at 72px, white numerals, with labels "years of institutional service" / "countries served" / "industry experts worldwide".
   - The world map is a 12%-opacity texture behind (improvement 6).
9. **leadership** (lineage `headings[8–16]`, `body[32–44]`, `ctas[16–20]`, `content/images/leadership/*`).
   - h2 "Perspectives from SEI Leadership." plus "View all insights →" (ink, red on hover) → `/insights/thought-leadership`.
   - Four cards: portrait on mist with the name (24 Medium) and role overlaid in ink. Below, a cyan panel with the **ink** article title (24/950) and **ink** dek (improvement 1). The whole card links to the captured article.
10. **newsletter** (system-component `newsletter`; lineage `headings[17]`, `body[45–47]`). Deep gradient band (225° #00c5fa→#086c8a).
    - The left copy column sits over the **deep-current** half: eyebrow "STAY CONNECTED", h2 "What's New at SEI", the captured paragraph in white, 5.96:1+ (improvement 1).
    - Right: "Business Email" label, email input (placeholder "yourname@company.com"), ink "Subscribe to SEI Insights →" button, and the consent line in white on the ink-tinted side.
    - Form is `action="#"` (prototype).
11. **footer** (system-component `footer`). Ink. Four columns (Solutions / Who we serve / Our insights / Contact us) with captured links. Second row: About SEI / Client login / Contact us / Locations / Newsroom / Investor relations / Careers. Footer logo, social icons, then the legal row "©2026 SEI All rights reserved." with Cookies Settings / Cookie policy / Privacy notice / Accessibility statement / Terms of use / Fund documents / Corporate governance (muted #999 on ink, 6.42:1).
12. **SEI Assistant launcher** (system-component `persistent-help`). Fixed bottom-right, an **ink** pill with a red 32px icon tile and the label "SEI Assistant — Ask a question" → `/modals/assistant` (improvement 3). It collapses to the icon only at ≤ 640px.

## Layout strategy

- Density: balanced. Section padding 64 / 48 / 32 (hard floor ≤ 64).
- 12-column grid, content max 1280px, gutters 24 / 20.
- Breakpoints: ≤ 900px (tablet: promo tiles 2+1, role cards stack, connective tissue stacks, stats 2×2, leadership 2×2). ≤ 640px (mobile: hero h1 44px, single column, tabs become a horizontal scroll strip with metric under logo, burger nav).

## Key states

- Tabs: one panel visible, the others `hidden`; the selected tab is paper (white) and unselected tabs ink at 30% over the field.
- Hover: buttons deepen to #b82322; cards lift. Focus: 3px ink outline (paper on dark).

## Interaction model

All links use captured destinations. Menus use `<details>`. Tabs use ARIA tabs with arrow keys. The newsletter form is inert in the prototype.

## Data attributes

- `header[data-section="header"][data-intent="navigate"][data-layout="contained"]`
- `div[data-section="role-bar"][data-intent="route by role"][data-layout="full-bleed"]`
- `section[data-section="hero"][data-intent="emotional hook"][data-layout="split-media"][data-media="none"]`
- `section[data-section="promo-tiles"][data-intent="drive action"][data-layout="grid"][data-items="3"][data-media="image"]`
- `section[data-section="tell-us"][data-intent="route by role"][data-layout="contained"][data-items="3"]`
- `section[data-section="connective-tissue"][data-intent="value proposition"][data-layout="split-media"][data-media="image"]`
- `section[data-section="proof"][data-intent="build trust"][data-layout="contained"][data-items="4"][data-interactive="tabs"]`
- `section[data-section="stats"][data-intent="prove scale"][data-layout="full-bleed"][data-items="4"]`
- `section[data-section="leadership"][data-intent="thought leadership"][data-layout="grid"][data-items="4"][data-media="image"]`
- `section[data-section="newsletter"][data-intent="capture lead"][data-layout="split-media"][data-interactive="form"]`
- `footer[data-section="footer"][data-intent="navigate"][data-layout="contained"]`

## Unsourced content (placeholder list)

None. Every literal comes from `pages/index.json` / `pages/index.html`.

## Open questions for craft

- Marketplace tile's light image: the ink plate behind its text is resolved in favour of legibility.
