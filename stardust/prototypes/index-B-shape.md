<!-- stardust:provenance
  writtenBy:        stardust:prototype/shape
  writtenAt:        2026-11-03T18:35:00Z
  page:             index
  variant:          B
  pageUrl:          https://main--sei--oharris69.aem.live/
  againstDirection: stardust/direction.md (Active) § Variant B
  consumedBy:       impeccable:craft
  readArtifacts: [stardust/current/pages/index.json, stardust/current/pages/index.html, DESIGN-B.md, DESIGN-B.json, stardust/uplift-questions.md, stardust/prototypes/index-A-proposed.html (frozen canon)]
  stardustVersion:  0.32.1
  dominantDimension: ia-priority (role routing leads)
  surprise: medium
  surpriseMove: "one captured cliché replaced: the duplicated role chooser (dropdown in a bar + panel 1,500px down) becomes the hero's second half (bank move: 'promote a buried decision into the first viewport'); the tab switcher becomes an untabbed proof wall"
  canonInherited: "tokens, @font-face, header, role bar, newsletter, footer, launcher, buttons — copied from index-A-proposed.html (A froze canon)"
  capturedSourceLineage: see ## Sections
  signatureElements:
    - { kind: motif, capturedSource: "motifs.patterns[0] offset heading bars", mechanism: "two offset bars on h1, left half of split hero", fallback: n/a }
    - { kind: motif, capturedSource: "motifs.gradients[1] field", mechanism: "field fills the hero's right half behind the role doors; proof band", fallback: n/a }
  antiTemplatePass:
    - { pattern: hero, defaultReflex: "split hero text-left / image-right", alternatives: ["text-left / three role doors right on the field", "type poster with role chips under", "role tabs above hero"], picked: "three role doors on the field", rationale: "the right half carries a decision, not an image; captured role CTAs + Addepar/Stripe routing anchors", reference: "addepar.com firm-type routing after hero; stripe.com business-type routing" }
    - { pattern: case studies, defaultReflex: "tabs or carousel", alternatives: ["untabbed 4-up proof wall", "ledger list", "featured + 3"], picked: "4-up proof wall, metrics first", rationale: "four comparable proofs at a glance is the trait B amplifies after routing (who are you → who like you trusts SEI)" }
    - { pattern: promos, defaultReflex: "big image cards high on page", alternatives: ["compact 'now' rail after proof", "inline strip in hero", "drop"], picked: "compact rail, same three items, same CTAs", rationale: "promos are time-bound; B leads with role, so promos demote but stay present" }
  substrateTransitions: { default: paper, exceptions: ["hero field (signature)", "proof band field", "ink stats band", "deep newsletter band"], note: "captured bands only" }
  voiceClassification: all copy captured-verbatim; the 'Recommended for you' label + 'Tell us who you are. We’ll tailor what you see.' h2 + lede moved into the hero door stack verbatim
  improvementsFloor: [1, 3, 5, 6, 7] (2 and 4 superseded by composition)
  compositionDelta_vs_A: ["hero-layout: offset bars over half field → split hero with three role doors", "section-presence: standalone tell-us panel removed (absorbed into hero)", "section-order: promos 2nd → promos 4th (after proof)", "ia-priority: promotions lead → role routing leads", "proof-layout: tabs → untabbed 4-up wall"]
  compositionDelta_vs_C: ["hero-layout: split with role doors → full-bleed field with three bars", "section-order: proof 2nd vs C's captured order (promos 2nd)", "section-presence: tell-us panel absent vs present in C", "motion: static vs kinetic-display"]
-->
---
slug: index
variant: B
register: brand
---

# Page shape: index — Variant B (role-first)

This variant amplifies SEI's captured personalisation promise ("Tell us who you are. We'll tailor what you see.") in service of PRODUCT principle 2, "Ask once, route clearly".

## Sections (in render order)

1. **header**: canon from A.
2. **role bar**: canon from A. The chip links to `#roles` (the hero doors). In B the tagline is hidden, and at ≤900 the chip and Why? are hidden too, so the doors are the one chooser.
3. **hero** (lineage `headings[0]`, `body[0]` + `headings[4]`, `body[7–11]`, `ctas[12–14]`). Split 7/5 inside the container, about 640px.
   - Left: offset bars (white bar 1; ink bar 2 with cyan text), then the lede.
   - Right: the gradient field panel (15px radius on its left corners, bleeding to the right edge) holding the **door stack**:
     - "Recommended for you" group label (ink on field, 10:1)
     - h2 "Tell us who you are. We'll tailor what you see." (28px, ink)
     - the captured lede (ink)
     - three full-width ink doors with the captured labels and destinations: white 20px/900 label, arrow, 72px tall; hover = paper door with ink text
2b. Persistent: the role bar's "Talk to an advisor" stays the only red in the first viewport.
4. **proof wall** (lineage `headings[6]`, tab panels). The field band, with h2 + lede in ink. A 4-up grid of white cards (15px radius), each showing:
   - logo (dark variant)
   - lead metric (ExtraBlack 44px, deep-current) + label
   - second metric (24px/950) + label
   - the captured paragraph (15px)
   - "Read the full case study →"

   Tablet 2×2; mobile stack.
5. **now at SEI rail** (lineage promo `body[1–6]`, `ctas[9–11]`; images unchanged). The rail is a 3-up of equal tiles (min 260px; content-driven ≈300px at 1440) with the same scrim rules as A; "Register now" is the only red. It is headed by a visually-hidden h2, "Featured", for heading order (a11y-only label; classification: direction-authorized chrome).
6. **connective tissue**: as A (split, highlighter, ring).
7. **stats**: as A (numeral row).
8. **leadership**: as A.
9. **newsletter**, **footer**, **launcher**: canon from A.

## Layout strategy
Canon tokens. Section padding is 64 / 48 / 32. Hero split stacks at ≤ 900 (doors below the h1, full width).

## Interaction model
Doors and cards are links to their captured destinations. No tabs (no JS beyond the burger).

## Data attributes
- `section[data-section="hero"][data-intent="route by role"][data-layout="split-media"][data-items="3"]`
- `section[data-section="proof-wall"][data-intent="build trust"][data-layout="grid"][data-items="4"]`
- `section[data-section="now-rail"][data-intent="drive action"][data-layout="grid"][data-items="3"][data-media="image"]`
- Every other section carries A's attributes.

## Unsourced content
None. The only authored string is the visually hidden "Featured" heading (a11y chrome).
