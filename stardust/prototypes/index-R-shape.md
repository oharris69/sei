<!-- stardust:provenance
  writtenBy:        stardust:prototype/shape
  writtenAt:        2026-11-03T19:50:00Z
  page:             index
  pageUrl:          https://main--sei--oharris69.aem.live/
  variant:          R (bold from-scratch rebrand, single)
  againstDirection: stardust/rebrand/direction.md (Active 2026-11-03T19:40:00Z)
  consumedBy:       impeccable:craft
  readArtifacts:
    - stardust/current/pages/index.json
    - stardust/current/pages/index.html
    - stardust/current/_brand-extraction.json
    - stardust/current/assets/screenshots/index.png
    - DESIGN.md
    - DESIGN.json
    - PRODUCT.md
    - stardust/direction.md
  stardustVersion:  0.32.1
  _provenance:
    capturedSourceLineage:
      - { section: header, origin: "site-wide system-component (pages/index.html header .nav-brand / .nav-sections / .nav-tools; logo content/images/shared/sei-logo.png)" }
      - { section: role-strip, origin: "site-wide system-component (pages/index.html .nav-experience: 'I’m a / Choose your role', stage line, 'Why?', 'Talk to an advisor' → /modals/schedule-eric-dunn)" }
      - { section: hero, origin: "pages/index.json headings[0] + body[0] (hero block)" }
      - { section: directory, origin: "pages/index.html .adaptive block (eyebrow, h2, p, three role links)" }
      - { section: listings, origin: "pages/index.html .cards.promo (three tiles, images content/images/home/card-*.png)" }
      - { section: connective-tissue, origin: "pages/index.html .display section (h2 with <em>, p, ring image content/images/home/connective-tissue.png)" }
      - { section: spec-sheet, origin: "pages/index.html .stats-container (h2, p, three stats + featured $1.9T, background content/images/home/world-map.png)" }
      - { section: proof-ledger, origin: "pages/index.html .tabs.case-study (h2, p, four tab panels incl. hidden panels: copy, links, metrics; logos content/images/logos/*.png)" }
      - { section: leadership, origin: "pages/index.html .cards.leadership (h2, 'View all insights', four cards; portraits content/images/leadership/*.png)" }
      - { section: newsletter, origin: "site-wide system-component (pages/index.html .newsletter: eyebrow, h2, p, label, placeholder, submit, disclaimer)" }
      - { section: footer, origin: "site-wide system-component (pages/index.html footer: 4 link columns, brand row with content/images/shared/footer-logo.png, footer-nav, social icons, legal)" }
      - { section: assistant-launcher, origin: "site-wide system-component (pages/index.html a.assistant-launcher → /modals/assistant)" }
    antiTemplatePass:
      - { pattern: "hero composition", defaultReflex: "centered-stack hero with two-button CTA pair (captured hero had no CTA; outgoing brand: offset gradient bars)", alternatives: ["left-anchored display headline + split lede (split-5-3)", "scale-displacement headline with the second line set between two brass strips, aggregate infill to the right", "full-bleed terrazzo plate with headline on a slab-white plate"], picked: "scale-displacement + literal 'between the lines' strip", rationale: "The captured hero wordplay 'between the lines' becomes the system's own divider strip. No CTA pair is invented (none captured); text never sits on the aggregate." }
      - { pattern: "promo card row (3-up equal tiles with photo, captured as an expanding accordion)", defaultReflex: "3-up equal image-card grid", alternatives: ["equal 3-up grid", "asymmetric bays 6/3/3 separated by brass strips, lead bay horizontal", "typographic listing index with thumbnail"], picked: "asymmetric bays 6/3/3", rationale: "The captured accordion already makes Data Cloud the open (is-active) tile; the 6-col lead bay keeps that priority without JS. Bays sit flush on brass strips (layout language)." }
      - { pattern: "role chooser (dark panel with three pill buttons)", defaultReflex: "three buttons in a row on a dark card", alternatives: ["three role cards with icons", "lobby building-directory board: ruled rows with leader rule + arrow", "segmented control"], picked: "building-directory board", rationale: "1950s seed decade + listing register; each row is one captured role link (/bd-breakaway, /enterprise-ria, /asset-managers). The eyebrow 'Recommended for you' becomes the board's title plate (no kicker above the h2)." }
      - { pattern: "stat-callout bar (3 stats in a row + featured $1.9T circle over a world map)", defaultReflex: "horizontal trust bar of big numbers", alternatives: ["horizontal trust bar", "listing-sheet Spec Rows stacked, $1.9T as the lead row", "typed sentence paragraph"], picked: "Spec Rows (typographic substitution)", rationale: "Real-estate-listing register; avoids the toolkit's stat-callout move. The world map is kept as the sheet's plate image (inverted to verde dots)." }
      - { pattern: "case-study tabs (4 logo tabs, one visible panel)", defaultReflex: "logo tab strip + panel", alternatives: ["logo tab strip (needs JS)", "proof ledger: four listing rows, logo | summary + link | figure | features", "carousel"], picked: "proof ledger (document-shape)", rationale: "Shows all four captured case studies and their metrics at once without JS (the capture hid three behind tabs). It is a listing sheet with one row per property." }
      - { pattern: "leadership 4-up cards with portrait", defaultReflex: "4 rounded cards with photo + gradient title plate", alternatives: ["4-up rounded cards", "4 flush bays on brass strips: square portrait, name/role plate, serif dek", "alternating list rows"], picked: "flush bays on brass strips", rationale: "Keeps portraits at their captured semantic role (leader cards) under the strip layout language." }
      - { pattern: "nav-icon glyph (search)", defaultReflex: "magnifier glyph in a typographic header", alternatives: ["glyph only", "glyph + visible 'Search' label"], picked: "glyph + visible label", rationale: "Captured link has aria-label 'Search'; the label is captured, so it is shown." }
    surpriseMoves:
      - { move: "scale-displacement", where: hero, capturedSource: "headings[0]" }
      - { move: "typographic substitution", where: spec-sheet, capturedSource: ".stats-list + .stats-featured" }
      - { move: "document-shape (listing ledger, substrate-keyed slab sequence)", where: "proof-ledger + page rhythm", capturedSource: ".tabs.case-study panels" }
    substrateTransitions:
      default: "lobby-stone #E6EBE7"
      exceptions:
        - { section: directory, substrate: "verde-matrix", citation: "captured .adaptive-panel is a dark ink (#131517) panel" }
        - { section: proof-ledger, substrate: "rose-chip", citation: "captured .gradient.tabs-container is a full-bleed coloured band (green→cyan) distinct from page ground" }
        - { section: newsletter, substrate: "saffron-chip", citation: "captured .newsletter is a full-bleed coloured band (--gradient-newsletter)" }
      note: "Three in-main transitions exceed the ≤2 cap. Friction #2 carve-out: surprise high + document-shape move (substrate-keyed slab sequence, catalog-card sub-kind) + each exception cites the captured per-section ground convention it maps. Footer (verde) and the role strip (verde) are chrome, not main-content transitions."
    voiceClassification:
      - { section: header, classification: captured-verbatim, source: "nav labels + dropdown links + Client Login / Contact Us" }
      - { section: role-strip, classification: captured-verbatim, copy: "I’m a · Choose your role · Tell us who you are and we’ll map your path. · Why? · Talk to an advisor" }
      - { section: hero, classification: captured-verbatim, copy: "Financial value is created / between the lines. · One partner. One connected wealth enterprise." }
      - { section: directory, classification: captured-verbatim }
      - { section: listings, classification: captured-verbatim, copy: "incl. 'Thursday, October 1' / '11 am ET' (past date, kept verbatim)" }
      - { section: connective-tissue, classification: captured-verbatim }
      - { section: spec-sheet, classification: captured-verbatim }
      - { section: proof-ledger, classification: captured-verbatim, copy: "FFT summary duplicates Summit's in source; kept" }
      - { section: leadership, classification: captured-verbatim }
      - { section: newsletter, classification: captured-verbatim }
      - { section: footer, classification: captured-verbatim, copy: "©2026 SEI All rights reserved." }
      - { section: assistant-launcher, classification: captured-verbatim }
      - { section: role-strip/why-disclosure, classification: "placeholder", copy: "explanation text for 'Why?' not captured (modal content out of capture)" }
    signatureElements: []
    signatureNote: "Rebrand: the outgoing signatures (green→cyan field, offset heading bars) are deliberately retired per direction.md anti-references. No hero video/canvas/motion was captured, so § 8b has nothing to preserve. The SEI logo mark is kept (header, ring image, footer)."
-->
---
slug: index
url: https://main--sei--oharris69.aem.live/
register: brand
surprise: high
dominantDimension: craft/terrazzo-slab-and-strip
---

# Page shape: index (rebrand R, "The Lobby Floor")

## Sections (in render order)

The IA is reordered (`ia-fidelity: reimagined`). The role directory moves up to sit directly under the promise ("route by role first"). The promos follow, then positioning, scale and proof. Proof sits after scale so the four case studies close the argument before leadership.

1. **header** (role `header`, not sticky): Lobby Stone. SEI block mark (`sei-logo.png`, 44px tall) on the left. Four disclosure menus (Solutions / Who We Serve / Our Insights / About SEI) use native `<details>`, each opening a square Slab White panel with a Brass top strip and the captured links. On the right: Search (glyph + label), Client Login (secondary button) and Contact Us (primary saffron).
2. **role-strip** (role `role-strip`): full-bleed Verde strip, 52px. "I’m a" (Mist label) + "Choose your role" is an in-page link to the directory section (#directory). The directory sits directly below, so a dropdown would offer the same three choices twice; this was changed after critique. The stage line "Tell us who you are and we’ll map your path." sits in the centre. "Why?" is a `<details>` whose body is a PLACEHOLDER (the explanation copy was not captured). "Talk to an advisor →" is a saffron text-link on the right.
3. **hero**: Lobby Stone, 12-col. The H1 runs at display scale.
   - Line 1, "Financial value is created", wraps freely.
   - Line 2, "between the lines.", sits in a full-bleed band bounded above and below by 3px Brass strips. The words sit on Lobby Stone; to the right of the words the band fills with the terrazzo aggregate (aria-hidden, never under text).
   - The lede "One partner. One connected wealth enterprise." is set in Source Serif 4 at lede size, aligned to cols 8–12 under the band.
   - No CTA is invented.
4. **directory** (`Tell us who you are`): Verde slab, split 5/7.
   - Left: h2 "Tell us who you are. We’ll tailor what you see." + p.
   - Right: the directory board, with a title plate "Recommended for you" (Mist label, Brass strip under it) and three ruled rows (Mist 1px rules). Each row holds an Archivo title-size role label, a flexible leader rule, and a saffron arrow square.
   - Hover/focus: the row label turns Saffron and the arrow inverts.
5. **listings** (promos): Lobby Stone; one row of flush bays on Brass strips at 6/3/3.
   - Bay 1 (Data Cloud webcast): horizontal; image left (square-cropped), body right. Copy: h3, p, then the date/time as two Rose badges ("Thursday, October 1", "11 am ET"), then Register now (primary).
   - Bays 2 and 3: image top (4:3 crop), h3, p, primary button ("Invest today", "Read Q2 press release").
6. **connective-tissue**: Lobby Stone, split 5/7.
   - Left: h2 "The connective tissue of modern finance." The `<em>` is rendered upright with a 0.14em Brass underline (no italic accent face). The p follows.
   - Right: a terrazzo field plate (aggregate, aria-hidden) holding a centred Lobby Stone inlay medallion with a double Brass edge. The ring image (`connective-tissue.png`, alt kept) runs through a Verde/Brass/Lobby SVG duotone, so the SEI mark renders Verde and the ring renders brass.
7. **spec-sheet** (stats): Lobby Stone, split 5/7.
   - Left: h2 "Depth you can feel. Reach you can measure." + p, with the world map below (inverted to verde dots at 18% opacity, decorative, alt="").
   - Right: a stack of Spec Rows (Brass strip above each). The lead row is "$1.9T / Assets Under Management & Administration" at figure scale on a Verde plate (Lobby text). Then 58 / years of institutional service, 15 / countries served, 2,000+ / industry experts worldwide.
8. **proof-ledger** (`Proof in practice.`): Rose slab.
   - Head: h2 + p.
   - Then four ledger rows on Slab White plates separated by Brass strips. Each row: logo (dark variant) | summary p + "Read the full case study →" | figure (value + label) | two features (Archivo title / serif sub).
   - Rows: Summit ($2B+ / Asset migration; Multi-custodian access / Built around client needs), FFT ($2B+ / Assets under management; Scalable growth / Built for generations), TCW ($206B+ / Assets under management; Alternative investing / Expanding market access), Kent State (8+ years / Trusted OCIO partnership; Strategic stewardship / Funding campus priorities).
9. **leadership**: Slab White slab. Head row: h2 "Perspectives from SEI Leadership." left, "View all insights →" right (baseline-aligned). Below: four flush bays on Brass strips. Each bay: a square-cropped portrait (4:5), h4 name + role (Verde Veil), h3 article title link (Archivo title) and the serif dek. The whole bay is clickable via the title link's stretched pseudo-element.
10. **newsletter** (role `cta-band`): Saffron slab, split 6/6.
    - Left: h2 "What’s New at SEI" + p.
    - Right: a form with a `<fieldset>` whose legend is "Stay connected", label "Business Email", input (placeholder yourname@company.com), submit "Subscribe to SEI Insights" (Verde fill, Lobby text) and the disclaimer.
11. **footer** (role `footer`): Verde. A 2px Brass edge runs across the top; the terrazzo band was removed after the finish review, so terrazzo stays on two surfaces. Then the four link columns, a brand row (white footer mark, footer-nav links, three social icons) and the legal row (©2026 SEI All rights reserved. + 7 legal links).
12. **assistant-launcher** (role `persistent-help`): fixed bottom-right square Saffron button with a chat glyph and "SEI Assistant — Ask a question" (label collapses to icon ≤640px with aria-label kept).

## Layout strategy

- Density: balanced. Section padding 64 / 48 / 32 (desktop / tablet / mobile).
- Container: 1320px max (rebrand, measure-first: 4-up leader bays at ~320px and a 6/3/3 promo row need the width), with 24px gutters. Recorded in DESIGN.json breakpoints. This is up from the captured 1280px.
- Strips: bays sit in a grid with `gap: 2px` over a Brass background (strip = gap). This is the layout language; no card gaps or shadows anywhere.
- ≤ 900px: split sections stack and bays stack, so strips become horizontal. ≤ 640px: the nav collapses to a stock hamburger, the listing lead bay goes image-top, and ledger rows stack.

## Key states

- Default as above. Hover/focus: colour inversions and underline/strip changes at 160ms; none under reduced motion.
- No loading/error states (static). The newsletter form is inert in the prototype (no captured success copy).

## Interaction model

- Nav menus, role menu, Why? and the mobile menu use `<details>`/`<summary>` (no JS needed for function). The ≤10-line inline script permitted by the mobile-nav pattern closes other open `<details>` on open and on Escape (a11y).
- Case studies: all four visible (no tabs, no JS).
- All links keep their captured hrefs, prefixed with the origin so they resolve from file://.

## Data attributes

- `header[data-section="header"][data-intent="navigate"][data-layout="contained"][data-nav-collapse="hamburger"]`
- `div[data-section="role-strip"][data-intent="route by role + talk to an advisor"][data-layout="full-bleed"]`
- `section[data-section="hero"][data-intent="brand promise"][data-layout="scale-displacement"][data-media="none"]`
- `section[data-section="directory"][data-intent="route by role"][data-layout="split-5-7"][data-items="3"]`
- `section[data-section="listings"][data-intent="timely promotions"][data-layout="bays-6-3-3"][data-items="3"][data-media="image"]`
- `section[data-section="connective-tissue"][data-intent="positioning"][data-layout="split-5-7"][data-media="image"]`
- `section[data-section="spec-sheet"][data-intent="prove scale"][data-layout="split-5-7"][data-items="4"][data-media="image"]`
- `section[data-section="proof-ledger"][data-intent="build trust"][data-layout="ledger"][data-items="4"][data-media="image"]`
- `section[data-section="leadership"][data-intent="thought leadership"][data-layout="bays-4"][data-items="4"][data-media="image"]`
- `section[data-section="newsletter"][data-intent="capture lead"][data-layout="split-6-6"][data-interactive="form"]`
- `footer[data-section="footer"][data-intent="navigate"][data-layout="contained"]`
- `a[data-section="assistant-launcher"][data-intent="persistent help"][data-layout="fixed"]`

## Unsourced content (placeholder list)

- `div[data-section="role-strip"] .why [data-placeholder]`: type `other`. The explanation shown by "Why?" was not captured (captured as a dialog trigger with no content).

## Open questions for craft

- Ring image treatment: grayscale + multiply vs. untreated. Resolved: grayscale + multiply. The image stays; only the retired gradient is neutralised.
- Promo art is green glass (outgoing look). Resolved after critique: it is kept at its semantic position, re-toned with a Verde→white screen duotone. Leader portraits are greyscale and return to colour on hover/focus.
