<!-- stardust:provenance
  writtenBy: stardust:uplift (direction authored in Phase 3d; Phase 4 delegated to stardust:direct procedure)
  writtenAt: 2026-11-03T18:10:00Z
  againstInput: "uplift https://main--sei--oharris69.aem.live/ --re-extract — three variants per stardust/direction.md"
  readArtifacts:
    - stardust/state.json
    - stardust/current/_brand-extraction.json
    - stardust/current/PRODUCT.md
    - stardust/current/DESIGN.md
    - stardust/current/brand-review.html
    - stardust/uplift-improvements.md
    - stardust/uplift-questions.md
  synthesizedInputs: [named assumptions below — hands-off]
  stardustVersion: 0.32.1
-->
---
title: "uplift presales redesign of the SEI home page — three variants (A faithful+improvements · B role-first · C kinetic bars)"
resolvedAt: 2026-11-03T18:10:00Z
toolkitVersion: "v1.0 (stardust v2)"
schemaVersion: 1
---

**HANDS-OFF MODE** (carried from 2026-10-29; `state.json.handsOff: true`). Interactive gates auto-resolve per `skills/stardust/SKILL.md` § Hands-off mode, and every quality gate runs at full strength. Hands-off's "one canonical direction" default is overridden by the invocation itself: `uplift` contracts three role-differentiated variants.

# Active direction (2026-11-03T18:10:00Z)

## Phrase

> uplift presales redesign — three variants per stardust/direction.md (uplift https://main--sei--oharris69.aem.live/ --re-extract)

## Restatement

Keep SEI's captured brand surface pinned:
- CircularXX (now live), ExtraBlack display / Medium body
- ink, red, cyan, green and the green→cyan field
- the bold-direct voice and every captured content item

Then produce three propositions:
- **A** fixes what the capture measurably gets wrong (contrast, duplicated routing, red overload, the action-less poster hero, hidden proof, the dated stats infographic, the off-scale type) without moving the IA.
- **B** asks what happens if the page leads with SEI's own personalisation promise, "Tell us who you are", and reorders around it.
- **C** keeps A's IA and makes the hero's offset-bar gesture the site's motion identity.

## Movements

- **register**: `brand` (inherited from `current/PRODUCT.md`).
- **expressive axis**: `committed`, unchanged on palette. The hierarchy contrast sharpens in all three variants.
- **tone**: unchanged (`bold-direct`).
- **density**: `balanced` (named assumption: hands-off default; the 8-section inventory with 3 audience tracks fires the multi-audience hard floor, so `sectionPadding.desktop ≤ 64px` on every variant).
- **distinctiveness**: A `familiar → slightly distinctive`; B `distinctive` (composition); C `distinctive` (motion).
- **audience**: wealth and asset managers, banks, financial advisors, enterprise RIAs, institutional investors (named assumption: captured nav + role CTAs).
- **ia-fidelity**: `reimagined` (named assumption: uplift's three-variant contract requires B to move IA; A and C keep the captured IA by role contract, not by fidelity pin).
- **motion**: A and B static (micro-transitions only). C cinematic, register `kinetic-display` (DESIGN-C.json only).
- **constraints**: WCAG 2.2 AA (financial-services norm). Brand-faithful Mode A. No fabricated stats, quotes or persons. Prototype-only: no approval, migration or deploy in this run.

## Gaps and questions

Hands-off: no questions asked. Named assumptions:

1. **Density** `balanced`, with the hard floor applied (see Movements).
2. **ia-fidelity** `reimagined` (see Movements).
3. **Contrast fixes are role moves, not palette moves.** Accents stop carrying text on light grounds; no new hues are introduced (improvement 1). Deep teal #086c8a is captured, as the newsletter gradient end (`motifs.gradients[0]`), and may carry text.
4. **Role bar and SEI Assistant launcher** are system components. Variants restyle them within the palette but keep their labels, positions and destinations.
5. **Case-study copy** is verbatim, including FFT's paragraph, which duplicates Summit's.
6. **"Why?" disclosure** stays as a link affordance (its modal is out of scope).
7. **Images** are the repo's own `content/images/**` (the same assets the live site serves), referenced from prototypes as `../../content/images/…`.

## Anchor references

Research tier 2 (WebFetch; no Refero MCP, no WebSearch). Decade `2025-now`:
- **Stripe** (https://stripe.com/): hero = headline + lede + CTA in one viewport over a moving gradient field; audience routing by business type; bold numeral stats. It anchors A item 4, B's routing, and C's vertical motion check.
- **Addepar** (https://www.addepar.com/): firm-type routing cards directly after the hero, then a four-metric typographic grid and case-study cards. It anchors A item 6 and B's composition.
- **BlackRock Aladdin** (https://www.blackrock.com/aladdin): institutional investment technology with a near-static composition. It is a negative check that keeps C's motion hard-edged and typographic, not decorative.

## Anti-references

- The Generic-2026-SaaS silhouette (centred hero + dual CTA + three icon cards + logo strip). Guardrailed for all three variants: the hero stays left-anchored on the offset bars.
- Glassmorphism, gradient text, side-stripe accents, invented stats, quotes or eyebrows.
- For C: parallax pulls, floaty long fades, bouncy easings, marquees of invented copy.

## Divergence inputs

- **mode**: Mode A (brand-faithful; `signal-strong`, with 9 palette roles and CircularXX named) composed with Mode B (agent-sourced anchors above).
- **decade**: `2025-now` (reasoned from the anchors).
- **craft / cultural register**: `institutional signage × financial broadsheet` (reasoned: offset bars plus tabular numerals). `picked_by: reasoned`, because the deterministic seed roll was not used once anchors were available.
- **ground-family**: `stark-white`, agreeing with the captured #ffffff (no Mode C override).
- **font deck**: `brand-inherited` (CircularXX, licensed; `../../fonts/CircularXXSub-*.woff2`), `picked_by: user-constraint`.
- **palette**: inherited from `_brand-extraction.json`, role-renamed brand-native (ink, signal-red, sei-cyan, sei-green, deep-current, paper, fog, hairline, slate).
- **anti-toolbox audit**: 3 hits, all justified by captured content:
  - big-number stat row: the page's own four stats
  - rounded 15px cards: the captured motif
  - split hero (B): the anchors plus the captured role CTAs
- **brand-faithful inversions**: pure-white retention, hex-format retention, saturated red retention, near-square action corners retained (2px).

```
Divergence (brand-faithful mode):
  decade           ✓ reasoned  → 2025-now (anchors)
  craft            ✓ reasoned  → institutional signage (offset bars as structure)
  register         ✓ reasoned  → financial broadsheet (tabular numerals, hairlines)
  ground-family    agrees      → stark-white (brand-native)
  font deck        inherited   → CircularXX (licensed, live)
  palette          inherited   → SEI 4-colour set + gradient + captured neutrals
```

## Improvements list

`stardust/uplift-improvements.md` (mirrored to `stardust/prototypes/index-improvements.md` for prototype Phase 1) has 7 items: 3 contrast/density, 1 IA-clutter, 2 dated-pattern, 1 missed-opportunity.

## Variant A — Faithful + improvements

Role: risk-averse green-light. "Yes, that's us, with the obvious fixes."
Composition: same as captured. Same section sequence: header + role bar → hero → promo tiles → Tell us who you are → connective tissue → proof in practice → stats → leadership → newsletter → footer.
Motion: static (no cinematic layer; hover/focus transitions ≤ 200ms only).
Improvements applied:
1. contrast role moves
2. one role chooser
3. ranked red
4. one-viewport hero with an exit
5. tab metrics visible on the tabs
6. typographic stats row
7. scale snapped to 80/48/36/24 and a compact display section

## Variant B — What if we amplified role-first routing?

Role: design-team motivator. The brand's underused capability (personalisation) foregrounded.
What if: "What if SEI asked who you are before it told you anything else, with the three captured roles as the hero's second half instead of a dropdown in a bar and a panel 1,500px down?"
Captured trait amplified: personalisation and role routing ("Tell us who you are. We'll tailor what you see.").
Evidence: `pages/index.json ctas[6]` (role bar) + `ctas[12–14]` (three role CTAs with destinations) + `headings[4]`; brand-review T-route-twice; 5 distinct above-the-fold CTA verbs.
Composition:
- Split hero: offset headline bars left, three full-height role doors right, in the gradient field.
- The untabbed proof wall (4 case studies, metrics visible) promoted to second.
- Promo tiles demoted to a compact "Now at SEI" rail after proof.
- Then connective tissue, stats, leadership, newsletter.
- The "Recommended for you" panel is absorbed into the hero (same copy, same three CTAs).
Motion: static (no cinematic layer).

## Variant C — What if motion was part of the identity?

Role: visionary pitch. The brand's third dimension: kinetic.
What if: "What if the offset 'between the lines' bars stopped being a hero trick and became how SEI moves: every headline arriving on its own bar, every number landing on a line?"
Cinematic register: `kinetic-display` (auto-picked from PRODUCT.md Brand Personality: the display-typography signature wins the tie over `arrival`'s institutional match. See `stardust/uplift-questions.md`).
Captured trait amplified: signature gesture, the offset white heading bars (`_brand-extraction.json#motifs.patterns[0]`, hero only today).
Evidence: `pages/index.json headings[0]` two-line h1 on two offset bars; `type.levels.h1` CircularXX 1000 / 80px / -0.4px; no other heading uses the gesture.
Composition: identical IA to A. The bet is motion, not layout.
Motion: cinematic, register `kinetic-display`:
- bar wipe-ins (clip-path)
- section heads wiping in on their own bars
- count-up numerals landing on a cyan rule
- reduced-motion = A's static rendering

## Command sequence (proposed)

1. `$stardust direct` procedure: PRODUCT.md, DESIGN.md/json (shared), DESIGN-A/B/C.{md,json} (this run).
2. `$stardust prototype index` × 3. Each variant runs a shape brief, then `$impeccable craft` (static render), against its DESIGN-<id> file.
3. C only: Phase 2.4 motion application from `DESIGN-C.json.extensions.motion.register`. It emits `index-C-cinematic.html` (Lenis + inline runtime).
4. Phases 2.5–2.8 per variant: `$impeccable critique`, `$impeccable audit`, `$impeccable adapt` (768 / 390); C adds motion validation Pass 1–6.
5. Discipline 10 variant-convergence detector across A/B/C.
6. STOP: no approval, migrate or deploy in this run (user reviews and chooses).

## User confirmation

> Hands-off: plan recorded here instead of awaiting "go". The invocation pre-approved the uplift run end to end up to rendered and validated prototypes.

## Pages in scope

- `index` (home) only. Cap = 1 page (uplift default).

## Named deviations

- **State linearity.** The `index` page was `migrated` (2026-10-30 run, archived at `stardust/archive/2026-10-30-index-stardust/`). Per state-machine.md § Linearity rule, its status is not demoted: this run appends `extracted` / `directed` / `prototyped` history entries with `state.mjs advance --history-only` and flags the page `stale` (the migrated `/index-stardust` reflects the archived direction).
- **Media capture.** `crawl.mjs` does not download page media. The prototypes reuse the repo's own `content/images/**`, the same files the live site serves (image-reuse contract satisfied at semantic positions).
- **Helper probes** under `stardust/.work/uplift/` (`shot.cjs`, `geom.cjs`, `validate.cjs`) supplement, not replace, the shipped instruments. They run the master skill's 3-viewport validation loop and the motion position probes with the repo's Playwright, because the Playwright MCP server is unavailable in this session.

---

# History

## Prior direction (2026-10-29T23:40:00Z): superseded

"brand-faithful refresh of the home page … ia-fidelity verbatim" (DM Sans stand-in, single variant, migrated to `/index-stardust`). The full text is archived at `stardust/archive/2026-10-30-index-stardust/direction.md`.
