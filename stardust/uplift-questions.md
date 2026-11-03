---
_provenance:
  writtenBy: stardust:uplift
  writtenAt: 2026-11-03T18:00:00Z
  againstInput: https://main--sei--oharris69.aem.live/
  readArtifacts:
    - stardust/current/_brand-extraction.json
    - stardust/current/pages/index.json
    - stardust/current/pages/index.html
    - stardust/current/brand-review.html
    - stardust/current/PRODUCT.md
  referenceResearch:
    tier: "2 — WebFetch"
    referencesUsed:
      - { name: "Addepar home", url: "https://www.addepar.com/", serves: "B composition anchor: routes by firm type (Banks / Family Offices / Fund Managers / Institutional Allocators / Wealth Management) as cards directly after the hero, then metrics + case studies" }
      - { name: "Stripe home", url: "https://stripe.com/", serves: "B anchor (audience routing by business type: Enterprises / Startups / Platforms); C register check (financial-infrastructure brand using an animated gradient field + moving logo/news rails as identity motion)" }
      - { name: "BlackRock Aladdin", url: "https://www.blackrock.com/aladdin", serves: "C register check, negative: institutional investment-tech page with essentially static composition; confirms motion must stay hard-edged and typographic, not decorative, to read institutional" }
---

# "What if…" candidates — https://main--sei--oharris69.aem.live/

Cinematic register for C (Phase 3a): **`kinetic-display`**. PRODUCT.md Brand Personality reads *confident, institutional, precise, connected*, and the captured surface carries a **display-typography signature**: CircularXX ExtraBlack set in offset white bars over the gradient ("between the lines"). That matches two rows of the heuristic. `arrival` fits on institutional (the brand is formal, but not civic or place-led). `kinetic-display` fits on display-typography signature. Tie-break per motion-registers.md: the surface has a defining typographic mark, so `kinetic-display`. Its refusals (soft long fades, decorative serifs, editorial body as canvas) conflict with no captured trait.

Vertical check (Phase 2.5c): the closest-vertical motion reference (Stripe) treats its gradient field and type as the moving identity layer. Aladdin shows that institutional finance stays credible when motion is hard-edged rather than floaty. Both support a hard-reveal display register over `arrival`'s soft photographic parallax, and SEI has no hero photograph for `arrival` to parallax anyway.

## Picked

### Variant C · Signature-gesture extension (the offset heading bars)
Source: catalog (#4)
What if: "What if the offset 'between the lines' bars stopped being a hero trick and became how SEI moves: every headline arriving on its own bar, every number landing on a line?"
Cinematic register: kinetic-display
Evidence:
- `_brand-extraction.json#motifs.patterns[0]` "offset white heading bars over a green-to-cyan gradient field (hero)". It appears in the hero only; every other h2 (`voiceTable.headlines[4–9]`) is plain type.
- `pages/index.json headings[0]` "Financial value is created / between the lines." is a two-line h1, rendered as two offset bars.
- `_brand-extraction.json#type.levels.h1` CircularXX 1000 / 80px / -0.4px.
Motion bet: the bars are the choreography. On load, each hero bar wipes in left to right (clip-path) and then its line unmasks. Section heads arrive on their own short ink or white bar, wiping in on scroll. The four stats and the case-study metrics count up and land on a cyan rule. No parallax, no soft fades. The IA and composition match A.

### Variant B · Audience-routing reframe (role first)
Source: catalog (#7)
What if: "What if SEI asked who you are before it told you anything else, with the three captured roles as the hero's second half instead of a dropdown in a bar and a panel 1,500px down?"
Captured trait amplified: personalisation and role routing ("Tell us who you are. We'll tailor what you see.")
Evidence:
- `pages/index.json ctas[6]` "I'm a Choose your role" (role bar), plus `ctas[12–14]` "I'm a financial advisor" → /bd-breakaway, "I'm at an enterprise RIA" → /enterprise-ria, "I'm an asset manager" → /asset-managers.
- `headings[4]` "Tell us who you are. We'll tailor what you see."
- brand-review T-route-twice.
- Above-the-fold CTA verbs: Choose your role / Why? / Talk to an advisor / Client Login / Contact Us. That is 5 distinct verbs, past the catalog's >4 trigger.
Composition bet: a split hero. The left half keeps the offset headline bars; the right half is three full-height role doors in the gradient field, using the captured labels and destinations. The single "Tell us who you are" moment moves into the first viewport. Proof is promoted to second place as an untabbed four-up proof wall (all four case-study metrics visible). The promo tiles drop to a compact "Now at SEI" rail after the proof. Connective tissue, stats, leadership and newsletter follow. The IA changes; the content set does not.
Compositional anchor: addepar.com (firm-type cards directly after the hero, then metrics and case studies). stripe.com routes by business type in the same way.

## Disqualified

- **Photography re-foregrounding (#2)**: disqualified. The captured photography is generic abstract stock: "Glass panels in green light", "Abstract network illustration", "Market chart over a blue background" (`media.imgs[2–4]`). The leadership portraits are standard corporate headshots on gray. Amplifying either exposes the weakness.
- **Live-data promotion (#3)**: disqualified. The page has no live or operational signal. The figures (58 years, 15 countries, 2,000+, $1.9T, $12B market cap) are static corporate stats with no timestamp or refresh, and a marketing surface can't fake liveness. This also rules out `live-systems` for C.

## Considered but not picked

- **Display-typography amplification (#1)**: not disqualified, since CircularXX is a signature face, not a generic one. But the trigger is weak: the display cut already sets every heading (ExtraBlack on 22/22 headings), so the family is not reserved for small uses. Its natural register (`kinetic-display`) is the one C already uses, and picking it for B would make B and C amplify the same typographic trait (stop condition d).
- **Voice-register pivot (#5)**: weak trigger. There is a mild contrast between the institutional declaratives ("Proof in practice.", "Depth you can feel. Reach you can measure.") and the warm second person ("Tell us who you are. We'll tailor what you see."). B's audience reframe already foregrounds the second-person voice through its IA, so a separate voice bet would duplicate it.
- **Color-ladder re-weighting (#6)**: real trigger. Green #a6ce39 is text-only (4×, brand-review T-color-imbalance) and ink is the only large dark ground. It is a composition-axis bet like B's, but weaker evidence than the duplicated role routing. Its legibility half is folded into A as improvement 1 (green becomes a highlighter bar).
- **Motif vocabulary swap (#8)**: trigger present (cards in a grid ×3 rows vs. one folder-tab switcher and one offset-bar hero). It overlaps C's gesture: swapping the primitive to "bars" is C's move expressed statically.
- **Gradient-as-connector line**: Source: derived.
  - Citations: `motifs.gradients[1]` 225° #a6ce39→#00c0f3 used as two fields; `media.imgs[5]` "The SEI logo inside a green-to-blue ring"; positioning copy "connective tissue".
  - Disqualified when: the gradient appears only once, or only as a flat band with no linear or connecting use.
  - Role: C (natural register `kinetic-display`, as a scroll-drawn line).
  - Not picked: it is a sub-move of C's bars gesture. C may use one gradient rule as the line numbers land on, recorded under C's motion bet rather than as a separate candidate.
