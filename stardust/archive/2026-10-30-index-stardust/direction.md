<!-- stardust:provenance
  writtenBy: stardust:direct
  writtenAt: 2026-10-29T23:40:00Z
  readArtifacts:
    - stardust/state.json
    - stardust/current/_brand-extraction.json
    - stardust/current/PRODUCT.md
    - stardust/current/brand-review.html
    - stardust/.work/extract/probe-live.json
  synthesizedInputs: [named assumptions below — hands-off]
  stardustVersion: 0.32.1
-->
---
title: "brand-faithful refresh of the SEI home page, delivered as /index-stardust"
resolvedAt: 2026-10-29T23:40:00Z
toolkitVersion: "v1.0 (stardust v2)"
schemaVersion: 1
---

**HANDS-OFF MODE ACTIVATED** (2026-10-29T23:33Z) — `--hands-off` on the invocation; `state.json.handsOff: true`. Interactive gates auto-resolve per `skills/stardust/SKILL.md` § Hands-off mode; every quality gate runs at full strength. Flow: `redesign` (`flowSource: "user"` — the user explicitly chose the redesign flow; scope cap 1 page).

# Active direction (2026-10-29T23:40:00Z)

## Phrase

> brand-faithful refresh of the home page: keep SEI palette (ink #131517, red #d82b2a, cyan #00c0f3, green #a6ce39, green→cyan gradient), voice and all content; modernize hierarchy, spacing rhythm, typography scale and component polish; distinctiveness familiar→slightly distinctive; density balanced/airy; no cinematic motion (subtle CSS transitions only, prefers-reduced-motion); ia-fidelity verbatim — every section, heading, copy line, CTA and image in the same order

## Restatement

Keep the SEI brand surface exactly — palette, DM Sans, bold-direct voice, every piece of content in its current order — and move only execution: a modular type scale replaces the ad-hoc one, a single section rhythm replaces the inconsistent gaps, components get polish and AA-passing colour pairings, and the page reads slightly more distinctive through precision (alignment, tabular numerals, the white-bar gesture re-tuned) rather than new motifs. Motion stays static with micro-transitions.

## Movements

- **register** — `brand` (inherited from `current/PRODUCT.md`)
- **expressive axis** — `restrained` → `committed` on hierarchy only (bigger weight contrast between display and body; no new decoration)
- **tone** — unchanged (`bold-direct`, pinned by phrase "voice")
- **density** — `balanced` (named assumption: the phrase said "balanced/airy"; the home page has 7 sections, so the multi-audience hard floor (`intent-dimensions.md` § 4) caps `sectionPadding.desktop` at ≤ 64px; airy (96px+) needs an explicit pin, and hands-off accepts the floor — option (b)). Air is recovered inside sections (heading/lede/content gaps, wider card gutters).
- **distinctiveness** — `familiar` → `slightly distinctive` (moved by phrase)
- **audience** — wealth/asset managers, banks, advisors, institutions (named assumption: derived from captured "Who We Serve" nav; not re-asked)
- **ia-fidelity** — `verbatim` (auto-pinned by phrase: "every section, heading, copy line, CTA and image in the same order")
- **motion** — static + micro-transitions (pinned by phrase); `DESIGN.json.extensions.motion.register: null`
- **constraints** — WCAG 2.2 AA (named assumption: financial-services norm); EDS delivery as new `sd-*` blocks on `/index-stardust`; no edits to existing blocks, global styles, header/footer/nav or existing content; remote actions forbidden this run

## Gaps and questions

Hands-off — no questions asked. Each gap resolved as a named assumption:

1. **Q (density, would have been asked):** airy vs balanced vs packed. **A (assumption):** `balanced` — see Movements; hard floor fired (7 sections).
2. **Q (ia-fidelity):** not asked — auto-pinned `verbatim` by the phrase.
3. **Assumption — contrast fixes are "polish", not palette moves.** Three captured pairings fail AA (green metrics on white 1.82:1, white titles on cyan 2.14:1, cyan hero line on white 2.14:1). They are fixed by role reassignment inside the pinned palette (Ink on fields; captured #086c8a "Deep Current" for accent text on white), not by adding colours.
4. **Assumption — the green emphasis word** ("connective tissue") becomes Ink with a green→cyan gradient underline, and the hero's cyan second line becomes Deep Current #086c8a on its white bar; both keep the brand gesture at AA.
5. **Assumption — newsletter form** stays functionally the same as the existing newsletter block (email field + subscribe button + consent line); its copy is verbatim.
6. **Assumption — section index numerals** (auction-catalogue device) are NOT added: they would be numbers absent from the capture (fabricated-content guard).

## Anchor references

Research tier 2 (WebFetch; refero MCP and WebSearch unavailable), all implying decade `2025-now`:
- **Addepar** (https://www.addepar.com/) — in-category: stats grid with large numerals + labels beneath; case-study cards ending in one action.
- **Stripe** (https://stripe.com/) — adjacent fintech: metric grid, generous whitespace between bands, image cards with overlays.
- **MoMA** (https://www.moma.org/) — out-of-category, shared institutional register: whitespace-led band separation, consistent left alignment.

## Anti-references

- The Generic-2026-SaaS silhouette (toolkit § 1) — centred hero + dual CTA + three icon cards + logo strip. Guardrailed because "modernize" is its most common trigger. The hero stays left-anchored with the white-bar gesture and no CTA pair.
- Glassmorphism, gradient text, decorative/cinematic motion, invented stats/quotes/eyebrows.

## Divergence inputs

- **mode** — Mode A (brand-faithful, `signal-strong`: 8 palette roles, DM Sans named) composed with Mode B (agent-sourced anchors).
- **seed** — `SEI|2026-10-29` MD5 `002373fd…` → rolled `1920s × Mosaic tile × Auction catalogue × stark-white`; decade overridden to `2025-now` (reasoned: anchors); craft and register kept (deterministic) and translated as: stat band as an aligned tile mosaic; catalogue precision (hairline rules, caption name/role pairs, tabular numerals).
- **ground-family** — `stark-white`, agrees with captured #ffffff (no Mode C override).
- **picked_by** — mixed (decade reasoned; craft/register/ground deterministic).
- **font deck** — `brand-inherited` (DM Sans), `picked_by: user-constraint`.
- **palette** — inherited from `_brand-extraction.json`, role-renamed brand-native (ink, signal-red, sei-cyan, sei-green, deep-current, paper, fog, hairline, slate).
- **anti-toolbox audit** — 2 hits, both justified by captured content (big-number stat row = the page's own stats; rounded cards = captured 15px motif). 1 audit adjustment (section numerals dropped).
- **brand-faithful inversions** — pure-white retention; hex format retention; saturated red retention; sharp 0px action corners retained.

Divergence (brand-faithful mode):
```
  decade           ✓ reasoned  → 2025-now (anchors)
  craft            ✓ rolled    → Mosaic tile (stat mosaic, equal tile rows)
  register         ✓ rolled    → Auction catalogue (hairlines, captions, tabular numerals)
  ground-family    agrees      → stark-white (brand-native)
  font deck        inherited   → DM Sans
  palette          inherited   → SEI 5-colour set + captured neutrals
```

## Improvements list

`stardust/prototypes/index-improvements.md` — 5 items (2 contrast, 1 dated type scale, 1 rhythm/IA, 1 missed proof opportunity), each with a measured observation.

## Command sequence (proposed)

1. `$stardust direct` (this command) — direction + target tokens.
2. `$stardust prototype index` — shape brief, then `$impeccable craft` for the static render against DESIGN.md (brand-faithful, verbatim IA).
3. `$impeccable typeset` — enforce the one-scale rule (improvement 3).
4. `$impeccable layout` — section rhythm + display/stats composition (improvements 4, 5).
5. `$impeccable critique` and `$impeccable audit` — gate cascade (Phases 2.5–2.6), contrast checks (improvements 1, 2).
6. `$impeccable adapt` — 768/390 behaviour.
7. `$impeccable polish` — final pass; no `animate`/`overdrive` (static by phrase).
8. `$stardust deploy` — new `sd-*` blocks + `content/index-stardust.plain.html`; DA delivery deferred.
9. `$stardust diff` (eds profile) — prototype ↔ built page.

## User confirmation

> Hands-off: plan recorded here instead of awaiting "go" (`skills/stardust/SKILL.md` § Hands-off mode). The user's brief pre-confirmed direction, scope and constraints.

## Pages in scope

- `index` (home) → new page `/index-stardust`. Cap = 1 page (user decision). The existing `/` (`content/index.plain.html`) and every other page are untouched.

## Named deviations

- **delivery deferred — user approves remote actions separately.** The deploy skill's DA upload / preview / publish steps are not run in this pass; delivery stops at the local EDS page `http://localhost:3001/content/index-stardust`. No git commit or push (the hands-off "commit at end of each phase" default is suspended by the user's explicit instruction).
- **Helper probes under `stardust/.work/tools/`** (`validate.mjs`, `probe-live.mjs`, `crop.mjs`) supplement — not replace — the shipped instruments: `validate.mjs` runs the master skill's 3-viewport validation loop (console, network, broken images, overflow, landmarks, heading order), because no shipped instrument covers that loop end to end; `probe-live.mjs` measured the contrast/geometry evidence for the improvements list.

## Named deviations — deploy (2026-10-30T00:35Z)

- **delivery deferred — user approves remote actions separately.** `stardust:deploy`'s DA upload, preview and publish (and the deployed-URL Step 10 checks: CLS probe, chrome crop gate, AI-readability, cap-probe compare against the deployed origin) were not run. The page is delivered locally at `http://localhost:3001/content/index-stardust`. No git commit or push.
- **Foundation frozen (deploy Step 3 / 4 / 6 skipped).** By user instruction, `styles/styles.css`, `styles/fonts.css`, `scripts/*.js`, `head.html`, `blocks/header`, `blocks/footer` and every existing block and content file are untouched. Page tokens (`--sd-*`) live inside each `sd-*` block's section container, and every block carries a scoped `box-sizing: border-box` reset, because the site has no global reset (#106). DM Sans and the global `--color-*` tokens are reused as they are.
- **No metadata block** on `content/index-stardust.plain.html` (BLOCK-LIBRARY hard rule 4), so Title/Description fall back to runtime defaults. A metadata row belongs in the delivery step.
- **D4 waived (davids-model-lint 17 🔴).** Images are authored as local `./images/...` paths, per the user and the EMA deploy notice ("D4 is inapplicable here"). All 23 images resolve locally (0 broken).
- **D1 deviation: `sd-statement`** is a block, not default content, because no section style can be added to the frozen foundation and the global heading highlight colours fail AA (see `stardust/eds-conversion-log.md`).
- **Post-approval prototype alignment (no design change):** (1) content cap changed from 1328 to the captured 1280px border-box (the cap-probe value and the site's `main > .section > div`), which the qa-gate #124 required; (2) arrow icons switched from inline `<svg>` to a CSS mask of the site's own `/icons/arrow-right.svg` (inlined as a data URI in the prototype) so prototype and build use the same mechanism. Both are recorded in the prototype's `iteratedVia`.
- **Helper probes** `stardust/.work/tools/{section-heights,probe-children,contract-check,adapt-sweep}.mjs` add measurements alongside the shipped instruments (block-roundtrip, qa-gate, ew-editability-probe, content-diff, visual-diff); they do not replace them.
