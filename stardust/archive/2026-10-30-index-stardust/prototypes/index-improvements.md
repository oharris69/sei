<!--
_provenance:
  writtenBy: stardust:direct
  writtenAt: 2026-10-29T23:40:00Z
  readArtifacts:
    - stardust/current/_brand-extraction.json
    - stardust/current/brand-review.html
    - stardust/current/pages/index.json
    - stardust/current/_computed-styles.json
    - stardust/.work/extract/probe-live.json (computed type/colour/geometry probe, 1440)
  stardustVersion: 0.32.1
-->

# Improvements — index (home)

1. **[contrast]** Case-study metrics ("$2B+" at 60px, "Multi-custodian access" at 32px) render in green #a6ce39 on the white panel — 1.82:1, failing WCAG AA even for large text (3:1). This is the `T-color-imbalance` tension: green has no legible solid role.
   *Fix:* Metrics set in ink #131517 with a green→cyan gradient rule/underline beneath each value; green stays a gradient stop and a fill accent, never text on white.

2. **[contrast]** Leadership article titles are white on cyan #00c0f3 (24px/1000) — 2.14:1, failing AA. Names/roles on the same panel are ink (8.57:1), so the panel already proves ink works.
   *Fix:* Article titles in ink on the cyan panel (8.57:1), with an arrow affordance and an underline-on-hover; white text on cyan is retired.

3. **[dated-pattern]** Type scale is ad-hoc (`T-scale`: 64 → 48 → 36 → 34 → 30 → 24 → 20 px). Promo card h3 at 34px sits within 1.06× of the section h2 at 36px, and the display h2 jumps to 48px while every other h2 is 36px — the hierarchy is flat between card titles and section titles, and inconsistent between sections. Ledes vary 16/18/22/24px with no rule.
   *Fix:* One modular scale (ratio 1.25 on a 18px body step): display 72 / h2 46 / h3 29 / title 23 / lede 20 / body 18 / small 15; every section h2 uses the same step, card titles drop to the title step.

4. **[ia-clutter]** Spacing rhythm is unsystematic: section padding measured 0 / 0 / 0 / 40 / 28 / 0 / 0 px with the gaps coming from inner block margins, so the white band between "promo cards" and "connective tissue" reads tighter than the band before "Perspectives". The display section spends 628px of its 797px height on a centred ring illustration while its heading and copy are left-aligned on a different axis.
   *Fix:* A single section rhythm — 64px block padding desktop / 48 tablet / 32 mobile on every section (balanced tier; the 7-section multi-audience hard floor caps desktop at 64px), so every band-to-band gap is a consistent 128px on white and every band carries its own equal padding, and a two-column display section: heading + copy left, the ring illustration right at ~half the height, sharing a common top line.

5. **[missed-opportunity]** The page's proof is strong (4 case studies, $1.9T, 58 years, 2,000+ experts) but the stats band places three numerals small-left and one 417px disc right with ~775px fixed list width, leaving the dotted world map mostly hidden behind content; the numbers have no shared baseline or tabular figures.
   *Fix:* Stats as a mosaic of aligned tiles over the map — tabular-lining numerals on a shared baseline, hairline separators, the $1.9T featured stat kept as the cyan disc (brand motif) but aligned to the tile grid.
