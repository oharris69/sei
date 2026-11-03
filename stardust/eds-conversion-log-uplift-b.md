<!-- stardust:provenance
  writtenBy: stardust:deploy (conversion only; foundation/chrome/DA steps skipped by instruction)
  writtenAt: 2026-11-03T20:40:00Z
  readArtifacts: [stardust/prototypes/index-B-proposed.html, stardust/prototypes/index-B-shape.md, stardust/eds-conversion-log-uplift-a.md, content/index-uplift-a.plain.html, blocks/ua-*, reference/BLOCK-LIBRARY.md, scripts/profile.js]
  stardustVersion: 0.32.1
-->
# EDS conversion log — index-uplift-b

Prototype `stardust/prototypes/index-B-proposed.html` (uplift variant B, "role-first") → page
`content/index-uplift-b.plain.html` (`http://localhost:3001/content/index-uplift-b`). Precedent: `eds-conversion-log-uplift-a.md`.

## Constraints (same as variant A)

- Frozen foundation: no change to `styles/`, `scripts/`, `head.html`, `fonts/`, header/footer, any existing block (incl. `ua-*`)
  or content. Variant tokens (`--ub-*`) are declared on each new block's own section container.
- New blocks only where B's composition differs from A, prefixed `ub-`; every section B shares with A uses the `ua-*` block as is.
- No metadata / section-metadata tables locally; no DA delivery (no admin.* calls).
- Global chrome kept: header with its experience bar, footer, assistant launcher.

## Triage

| # | Prototype section | Decision | Block | Content model (row shape) |
|---|---|---|---|---|
| 1 | hero (split, role doors) | NEW | `ub-hero` | row 1: [h1 (lines split at `<br>`), p lede, opt. buttons]; row 2: [label p, h2, p lede, p link per role] |
| 2 | proof wall (4-up, untabbed) | NEW | `ub-proof-wall` | head = default content; rows as `ua-case-tabs`: [logo] [story p, link p] [metric] [metric]… |
| 3 | now-rail (compact promos) | NEW | `ub-promo-rail` | visually-hidden h2 = default content; rows as `ua-promos`: [picture] [h3, p…, when, CTA] [opt. `inverse`] |
| 4 | connective tissue | reuse | `ua-statement` | as A |
| 5 | stats | reuse | `ua-stats` | as A (head = default content) |
| 6 | leadership | reuse | `ua-leaders` | as A (head + lone link = default content) |
| 7 | newsletter | reuse | `ua-newsletter` | as A |

Why new and not `ua-*`: `ua-hero` has no doors side and paints the field behind the bars; `ua-case-tabs` is a tab switcher
(B shows all four at once, metrics first); `ua-promos` is an asymmetric 6/3/3 row of 420px tiles with 36px titles
(B: equal 260px tiles, 24px titles, vertical scrims). `ua-role-panel` is not used: B absorbs the tell-us panel into the hero.

## Encode decisions

- Copy verbatim from the prototype. Images reused from `content/images/home|logos|leadership`.
- Role doors are plain links to `/bd-breakaway`, `/enterprise-ria`, `/asset-managers` (as the live `adaptive` default version);
  the landing page sets the visitor's role through `scripts/profile.js` `recordView` (verified: clicking the advisor door →
  `sei-profile.persona = "advisor"`, `personaSource = "inferred"`). The doors panel gets `id="roles"`.
- The doors are static (prototype: "no JS beyond the burger"); persona versions of the tell-us panel are not carried (B has no panel).
- Proof order as the prototype: Summit, TCW, FFT, Kent State (keeps the two identical captured paragraphs apart). One (dark)
  logo per card. Each "Read the full case study" link gets `aria-label="Read the full case study: <firm>"` from the logo alt.
- Promo titles are h3 under a visually hidden default-content h2 "Featured" (the prototype's only authored string, a11y chrome).
- Hero split runs edge to edge (the block's wrapper drops the 1280 max-width); the left inset follows A's convention
  (`max(content-padding, (100vw − 1280) / 2 + content-padding)`, = 104px at 1440, aligned with the header logo).

## Verification (2026-11-03, Playwright, 1440×900 and 390×844)

- All 9 blocks load (`header`, 3 × `ub-*`, 4 × `ua-*`, `footer`); 0 console errors; 0 broken images; no horizontal page
  overflow at 1440/390 (also clean at 1920, 1280, 768, 641, 640, 414, 360).
- Section heights vs prototype: identical at both widths (1440: 600 / 740 / 425 / 344 / 446 / 708 vs 714 / 424 vs 426;
  390: 752 / 2153 / 887 / 416 / 680 / 712 / 652 vs 653). Headings, CTA labels, order and copy identical.
- `/content/index-uplift-a` re-rendered at 1440: pixel-identical to `/tmp/sei-shots/eds-A-1440.png` (0 differing pixels).
- Lint: `npx eslint blocks/ub-*` and `npx stylelint "blocks/ub-*/*.css"` clean; all lines ≤ 100 chars.
- Screenshots: `/tmp/sei-shots/eds-B-1440.png`, `/tmp/sei-shots/eds-B-390.png`.

## Remaining differences (accepted)

- **Experience bar is the site's**: the prototype hides the role-stage tagline in B and hides the chip + "Why?" at ≤900 so the
  doors are the only chooser; the global header cannot be changed from this page, so the bar keeps its tagline, chip and Why?.
  Its chip opens the header persona menu (not a jump to `#roles`).
- Content inset 104px vs the prototype's 80px at 1440 (A convention), so the doors' inner column and the proof cards are slightly
  narrower: the Summit, FFT and Kent State stories wrap one extra line at 1440, but the tallest card (TCW) is unchanged, so
  the band height matches.
- Site footer and red edge-tab launcher instead of the prototype's own; the global footer link row overflows at ~900–1024px
  on every page (pre-existing, same on `/content/index-uplift-a`).
