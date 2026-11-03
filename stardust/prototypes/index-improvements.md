---
_provenance:
  writtenBy: stardust:uplift (mirrored for stardust:direct Phase 2.5 / prototype Phase 1)
  writtenAt: 2026-11-03T17:55:00Z
  againstInput: https://main--sei--oharris69.aem.live/
  readArtifacts:
    - stardust/current/_brand-extraction.json
    - stardust/current/pages/index.json
    - stardust/current/pages/index.html
    - stardust/current/brand-review.html
    - stardust/current/_computed-styles.json
    - stardust/current/assets/screenshots/index.png
  auditConsumed: none (no stardust/audit/<domain>/audit.json for this origin)
  referenceResearch:
    tier: "2 — WebFetch (no Refero MCP; no WebSearch tool, fetched named sites directly)"
    referencesUsed:
      - { name: "Stripe home", url: "https://stripe.com/", serves: "item 4 counter-example (hero = headline + lede + CTA in one viewport); item 6 (stats as bold numerals)" }
      - { name: "Addepar home", url: "https://www.addepar.com/", serves: "item 6 counter-example (four key metrics as a typographic grid, no infographic)" }
      - { name: "BlackRock Aladdin", url: "https://www.blackrock.com/aladdin", serves: "item 2 context (audience routing by institution type lives in one place)" }
  geometryProbe: "stardust/.work/uplift/geom.cjs @1440x900 (section tops/heights)"
---

# Improvements — https://main--sei--oharris69.aem.live/

1. **[contrast-or-density]** The brand accents carry text they can't hold. Measured: cyan #00c0f3 on white is 2.14:1 (hero line 2 at 80px) and green #a6ce39 on white is 1.82:1 ("connective tissue" at 48px), both under the 3:1 large-text floor. White on cyan is 2.14:1 (16px leadership-panel body), white "Proof in practice." on the green→cyan field is about 1.8–2.2:1, and newsletter body on the cyan end is about 2.0:1. Source: brand-review T-contrast. · The pattern at fault is brand colour used as text colour on light grounds. · Fix: the accents become grounds and rules, and ink or white takes the text where it passes:
   - cyan text only on ink (8.57:1)
   - "between the lines." on an ink bar in cyan
   - "connective tissue" in ink over a green highlighter bar
   - ink text on cyan leadership panels (8.57:1)
   - ink h2 on the gradient band
   - newsletter copy on the deep-teal end (#086c8a, 5.96:1)
2. **[ia-clutter]** Role routing is asked twice, in two vocabularies. The role bar under the header ("I'm a … Choose your role" dropdown) and the "Recommended for you" panel 1,491px down ("I'm a financial advisor / at an enterprise RIA / an asset manager") are two widgets for one decision. Source: brand-review T-route-twice; pages/index.json ctas[6], [12–14]. · The pattern at fault is a duplicated chooser. · Fix: the role bar stays as the persistent system echo. The panel becomes the single in-page chooser: three equal-weight role cards that keep the captured labels and destinations, with the bar's "Choose your role" pointing to it.
3. **[contrast-or-density]** Four red actions compete for the first 1,600px with no hierarchy between them. Red #d82b2a fills "Talk to an advisor" (role bar, y≈104), the "SEI Assistant" launcher (fixed, y≈794), "Register now" (promo tile, y≈1,360) and "I'm a financial advisor" (role panel, y≈1,750). Source: brand-review T-red-overload; census colors[#d82b2a] button-background 6×. · The pattern at fault is primary colour on every action. · Fix: keep red for actions only, ranked:
   - red fill for "Talk to an advisor" and the time-bound "Register now"
   - role buttons become ink or white outline at equal weight
   - the launcher becomes an ink pill with a red icon tile
4. **[dated-pattern]** The hero spends the whole first viewport and has no action in it. Measured: the hero section runs y=128→930 (802px) at 1440×900. Below the lede at y≈673 sits a 160px detached gradient strip (y≈768–930), and the first content (promo tiles) starts at y=994, below the fold. · The pattern at fault is the poster hero with no exit. Contemporary counter-example: stripe.com puts headline, lede and both CTAs in one viewport over its gradient field. · Fix: compress the hero to about 640px. Keep the offset white bars, join the gradient strip back into the hero field, and let the top edge of the promo row show above the fold.
5. **[missed-opportunity]** Three of the four proofs sit behind tabs. All four case studies carry copy and two metrics: Summit $2B+ asset migration, FFT $2B+ AUM, TCW $206B+ AUM, Kent State 8+ years OCIO. The folder tabs show one at a time, so the visible proof is one panel plus three logos. Source: pages/index.html tab panels; brand-review T-proof-hidden. · The pattern at fault is a tab switcher hiding comparable proof. · Fix: keep the tabs, but put each tab's lead metric on the tab itself under the logo, so all four numbers read at a glance. FFT's copy is identical to Summit's in the capture; it is kept verbatim, not rewritten.
6. **[dated-pattern]** The stats band is a "global reach" infographic: a dotted world map behind three numerals and a 420px cyan disc for $1.9T. Source: pages/index.json body[21–31]; census radius 50% on the disc. · The pattern at fault is the circa-2015 map-and-bubble stat. Contemporary counter-example: addepar.com sets its four platform metrics as a plain typographic grid. · Fix: set all four figures as one CircularXX ExtraBlack numeral row on ink, with $1.9T leading at display size. The map drops to a low-contrast texture, and the disc becomes a cyan rule under the lead figure.
7. **[contrast-or-density]** The type scale is ad hoc (80→48→36→34→24) and the display section is sparse. The "connective tissue" section is 797px tall for one 48px heading, one 22px paragraph and a 360px logo-in-ring image. Source: brand-review T-scale; geometry probe display section y=1882 h=797. · The pattern at fault is an off-scale 34px step and a near-empty section. · Fix: snap to the Figma steps 80 / 48 / 36 / 24, so promo tile heads move from 34 to 36. Put the ring beside the heading at about 280px, which takes the section to about 440px.
