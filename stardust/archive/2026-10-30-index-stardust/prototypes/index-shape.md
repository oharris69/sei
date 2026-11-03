<!-- stardust:provenance
  writtenBy:        stardust:prototype/shape
  writtenAt:        2026-10-29T23:44:00Z
  page:             index
  pageUrl:          https://main--sei--oharris69.aem.live/
  againstDirection: stardust/direction.md (Active 2026-10-29T23:40:00Z)
  consumedBy:       impeccable:craft
  readArtifacts:
    - stardust/current/pages/index.json
    - content/index.plain.html
    - content/footer.plain.html
    - stardust/current/_brand-extraction.json
    - DESIGN.md
    - DESIGN.json
    - stardust/direction.md
    - stardust/prototypes/index-improvements.md
  stardustVersion:  0.32.1
  _provenance:
    capturedSourceLineage:
      - { section: header, source: "_brand-extraction.json#systemComponents[site-header]; existing global chrome, rendered as a stand-in only" }
      - { section: hero, source: "pages/index.json heroHeadline/heroLede; content/index.plain.html .hero.home (white-bar lines over gradient blocks)" }
      - { section: promos, source: "content/index.plain.html .cards.promo (3 rows, rows 1 and 3 'inverse')" }
      - { section: connective-tissue, source: "content/index.plain.html .display section (h2 with em + strong period, p, connective-tissue.png)" }
      - { section: proof, source: "content/index.plain.html .gradient section + .tabs.case-study (4 rows: logos, story, metric, metric)" }
      - { section: reach, source: "content/index.plain.html stats section (h2, p, world-map.png, 3 stats + featured $1.9T)" }
      - { section: perspectives, source: "content/index.plain.html .heading-link section + .cards.leadership (4 rows)" }
      - { section: newsletter, source: "content/index.plain.html .newsletter; _brand-extraction.json#systemComponents[newsletter] (cta-band role)" }
      - { section: footer, source: "content/footer.plain.html; existing global chrome, rendered as a stand-in only" }
      - { section: assistant-launcher, source: "_brand-extraction.json#systemComponents[sei-assistant-launcher]; existing global chrome stand-in" }
    antiTemplatePass:
      - pattern: hero composition
        defaultReflex: "centred type hero with two-button CTA pair (generic-2026-SaaS)"
        alternatives: ["full-bleed gradient hero with white type (fails contrast; drops the white-bar gesture)", "split 6/6 text + image (no image exists; would need invention)", "left-anchored white bars overlapping a top-right gradient field, promo row overlapping the hero foot"]
        picked: "left-anchored white bars overlapping the gradient field; promo row pulled up into the first viewport"
        rationale: "The white-bar 'between the lines' gesture is the captured signature (hero.css .hero.home); overlap keeps the IA-priority promo routing visible at 1440x900."
        reference: "MoMA — left alignment discipline"
      - pattern: promo card row
        defaultReflex: "3 icon cards with centred text"
        alternatives: ["horizontal carousel", "one featured + two stacked", "3 equal image tiles with bottom-anchored text over an ink scrim and one square red action each"]
        picked: "3 equal image tiles (mosaic craft) — text bottom-anchored over a scrim; marketplace tile (light image, non-inverse) keeps ink text on a paper caption plate"
        rationale: "Three captured promotions of equal weight; equal tiles are the mosaic translation; inverse flag preserved as scrim vs plate."
        reference: "Stripe — image cards with overlays"
      - pattern: display statement with illustration
        defaultReflex: "centred heading over a centred image"
        alternatives: ["full-width image band under the heading (captured, 628px of mostly white)", "image as a background watermark", "two-column: statement left, ring right, shared top line"]
        picked: "two-column 7/5 split, ring illustration right at ~460px tall"
        rationale: "Improvement 4 — the captured 628px centred image left heading and image on different axes."
      - pattern: case-study tabs
        defaultReflex: "logo strip + testimonial carousel"
        alternatives: ["four stacked case cards", "accordion", "folder tabs with logo labels joining a paper panel (captured), metrics as ledger entries"]
        picked: "captured folder tabs, re-tuned: Fog-on-gradient tabs, story left, two ledger metrics right with gradient rules"
        rationale: "The folder-tab switcher is a captured off-toolbox signature; improvement 1 moves metric colour from green text to ink."
      - pattern: stats band
        defaultReflex: "4-up big-number row"
        alternatives: ["4-up row with featured disc as the 4th tile", "ticker", "ledger rows (numeral + label, hairline separated) left, featured cyan disc right, map as backdrop"]
        picked: "ledger rows left + featured disc right, map visible as backdrop (mosaic/catalogue translation)"
        rationale: "Captured content (3 + featured); improvement 5 — shared baseline, tabular numerals, map no longer hidden."
        reference: "Addepar — stats grid with labels beneath"
      - pattern: leadership cards
        defaultReflex: "round avatar + quote cards"
        alternatives: ["list rows with small portraits", "2x2 large", "4-up portrait tiles with a cyan caption panel (captured), ink titles"]
        picked: "4-up portrait tiles, cyan panel with ink title (improvement 2), name/role as a caption over the portrait"
        rationale: "Captured portraits are the trust signal; image-reuse contract keeps them at portrait scale."
      - pattern: newsletter band
        defaultReflex: "centred email capture"
        alternatives: ["inline field on the gradient (captured; white label on light cyan fails)", "full ink band", "copy on the dark end of the captured current gradient, form on a paper card"]
        picked: "copy left on the dark end (#086c8a), form on a paper card right"
        rationale: "Keeps the captured gradient; fixes white-on-light-cyan contrast."
    surprise: low
    signatureElements:
      - { kind: motif, capturedSource: "hero.css .hero.home — white heading bars over green→cyan gradient blocks", mechanism: "CSS gradient panel + white bars with cyan hairlines", fallback: "static by design" }
      - { kind: motif, capturedSource: "_brand-extraction.json#motifs.gradients — green→cyan 225° field", mechanism: "proof band background", fallback: "static" }
      - { kind: motif, capturedSource: "stats featured disc (50% radius, cyan)", mechanism: "cyan circle", fallback: "static" }
    substrateTransitions:
      default: paper (#ffffff)
      exceptions:
        - { section: proof, substrate: "connective-field gradient", purpose: "the proof moment — captured .gradient section" }
        - { section: reach, substrate: "ink", purpose: "scale moment — captured stats band" }
      note: "Hero gradient is a graphic panel inside a paper section (not a substrate). Newsletter is the cross-site cta-band system component carried from the brand surface (its gradient is the component's own chrome). Header/footer are global chrome."
    voiceClassification:
      - { section: header, classification: captured-verbatim, source: "nav labels from pages/index.json#ctas" }
      - { section: hero, classification: captured-verbatim }
      - { section: promos, classification: captured-verbatim }
      - { section: connective-tissue, classification: captured-verbatim }
      - { section: proof, classification: captured-verbatim }
      - { section: reach, classification: captured-verbatim }
      - { section: perspectives, classification: captured-verbatim }
      - { section: newsletter, classification: captured-verbatim }
      - { section: footer, classification: captured-verbatim, source: "content/footer.plain.html" }
      - { section: assistant-launcher, classification: captured-verbatim }
    unsourcedContent: []
-->
---
slug: index
url: https://main--sei--oharris69.aem.live/
register: brand
surprise: low
ia-fidelity: verbatim
fidelity: refined
targetPath: /index-stardust
---

# Page shape: index (home) → /index-stardust

## Sections (in render order)

1. **header** (system-component role `header`) — existing global chrome. In the prototype, a faithful stand-in (logo, Solutions / Who We Serve / Our Insights / About SEI, search, Client Login, Contact Us). Not redesigned; the EDS build uses the real header.
2. **hero** — paper section, 12-col grid. A green→cyan gradient field occupies the top-right (cols 6–12, ~420px tall at 1440). Two white bars carry the H1 lines, starting at the content edge and overlapping the field: line 1 "Financial value is created" (Ink), line 2 "between the lines." (Deep Current #086c8a), each with the captured 2px cyan hairline. Lede "One partner. One connected wealth enterprise." beneath at the lede step. A thin connective rule band (cyan→green, 8px) runs from col 4 to the right edge at the hero foot. Hero ends ~600px tall at 1440 so the promo row peeks into the first viewport.
3. **promos** — 3 equal tiles, 15px radius, image full-bleed (card-data-cloud, card-marketplace, card-market-cap). Inverse tiles (1, 3): Ink scrim rising from the bottom, white title/copy, red square CTA. Tile 2 (marketplace, light image): paper caption plate at the foot, Ink text, red CTA. Copy verbatim incl. "Thursday, October 1 / 11 am ET". Titles at the title step (h3).
4. **connective-tissue** — two-column 7/5: H2 "The *connective tissue* of modern finance." — emphasis in Ink with a thick gradient underline; period kept; lede below. Ring illustration right (connective-tissue.png), top-aligned with the H2.
5. **proof** — connective-field gradient band. H2 "Proof in practice." + lede in Ink. Folder tabs: 4 logo tabs (white logos on an ink-tint rail when inactive, colour logos on paper when active). Panel (paper): story + "Read the full case study →" left (cols 1–6); two ledger metrics right (cols 8–12), each Ink numeral/term with a gradient rule beneath and the label in Slate.
6. **reach** — Ink band. H2 white, lede cyan. World map as a backdrop (right-weighted, 55% opacity). Left (cols 1–6): three ledger rows — numeral (cyan, tabular) + label (white), hairline separators at 14% white. Right (cols 8–12): featured disc (cyan, 400px) with "$1.9T" in Ink and "Assets Under Management & Administration".
7. **perspectives** — head row: H2 left, "View all insights →" text link right, baseline-aligned. 4 portrait tiles: portrait (Fog ground) with name + role caption top-left over the image; cyan panel below with H3 title link (Ink, underline on hover) and summary (Ink). DOM order puts H3 before the H4 name (visual order via grid) so headings never skip.
8. **newsletter** (system-component role `cta-band`) — current gradient re-angled 90° so copy sits on the dark end: "STAY CONNECTED" label, H2 "What’s New at SEI", copy (white). Paper form card right: label "Business Email", input placeholder "yourname@company.com", Ink "Subscribe to SEI Insights →" button, disclaimer in Slate.
9. **footer** (system-component role `footer`) — existing global chrome; stand-in only.
10. **assistant launcher** (system-component role `persistent-help`) — existing fixed red pill; stand-in only.

## Layout strategy

- Density: balanced (DESIGN.md spacing): 64px block padding per band desktop, 48 tablet, 32 mobile; 16px headline→lede, 40px lede→content (32 mobile).
- 12-col grid, 1280px content max (captured cap kept), 24px gutters (20px <600px).
- Breakpoints: 600 / 900 / 1200 (site pair + wide refinement). Promos 3-up ≥900, 1-up below (tablet 3-up becomes stacked 1-up with landscape crop). Perspectives 4-up ≥1200, 2-up 600–1199, 1-up <600. Proof panel stacks story over metrics <900. Reach stacks rows over disc <900 (disc 280px). Connective-tissue stacks <900 (ring below, 320px).
- Hero <900: gradient field becomes a full-width 220px block behind the top of the bars; bars full-width minus gutter.

## Key states

- Default — as above.
- Tabs: one panel visible; others `hidden`. Hover on inactive tab lifts tint to 40%; focus ring Ink/cyan.
- Cards: hover lift + 2px rise; disabled under reduced motion.
- Newsletter submit: client-side validity check + status line (mirrors the existing block behaviour).

## Interaction model

- Promo CTAs → `/insights/events/data-cloud-webcast`, `/etfs`, `/about/newsroom/q2-results`.
- Case-study tabs: click / ArrowLeft / ArrowRight; panels expose their own "Read the full case study" link.
- Leadership titles link to their articles; "View all insights" → `/insights/thought-leadership`.

## Data attributes

- `header[data-section="site-header"][data-intent="navigate"][data-layout="contained"]`
- `section[data-section="hero"][data-intent="value proposition"][data-layout="split-media"][data-media="none"]`
- `section[data-section="promos"][data-intent="route to timely actions"][data-layout="grid"][data-items="3"][data-media="image"]`
- `section[data-section="connective-tissue"][data-intent="positioning"][data-layout="split-media"][data-media="image"]`
- `section[data-section="proof"][data-intent="build trust"][data-layout="contained"][data-items="4"][data-interactive="tabs"][data-media="image"]`
- `section[data-section="reach"][data-intent="prove scale"][data-layout="split-media"][data-items="4"][data-media="image"]`
- `section[data-section="perspectives"][data-intent="thought leadership"][data-layout="grid"][data-items="4"][data-media="image"]`
- `section[data-section="newsletter"][data-intent="capture lead"][data-layout="split-media"][data-interactive="form"]`
- `footer[data-section="site-footer"][data-intent="navigate"][data-layout="contained"]`

## Unsourced content (placeholder list)

None. Every literal comes from `content/index.plain.html` / `pages/index.json` / `content/footer.plain.html`. No section eyebrows, index numerals, quotes or stats are added.

## Open questions for craft

- Hero bar widths at 1440: line 1 bar to ~88% of content width, line 2 to ~64% (captured proportions) — craft tunes against the 66px display step.
- Inactive tab rail tint: ink at 28% vs 35% over the gradient — pick the lowest that keeps white logos ≥ 3:1 against the tinted field.
