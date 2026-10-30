<!-- stardust:provenance
  writtenBy: stardust:deploy
  writtenAt: 2026-10-30T00:12:00Z
  readArtifacts: [stardust/prototypes/index-proposed.html, stardust/eds-schema/index-stardust.json, stardust/runtime-contract.json, reference/BLOCK-LIBRARY.md, content/index.plain.html]
  stardustVersion: 0.32.1
-->
# EDS conversion log — index-stardust

Prototype `stardust/prototypes/index-proposed.html` → page `content/index-stardust.plain.html` (`/index-stardust`).
Schema: `stardust/eds-schema/index-stardust.json`. Runtime: `stardust/runtime-contract.json`.

## Constraints that override the skill (user decisions)

- **Frozen foundation.** `styles/styles.css`, `styles/fonts.css`, `scripts/scripts.js`, `scripts/aem.js`, `head.html`,
  `blocks/header`, `blocks/footer` and every existing block/content file are untouched. Step 3 (foundation rebrand)
  and Step 6 (chrome) are therefore not run. DM Sans and the global palette tokens (`--color-*`, `--gradient-*`,
  `--radius-card`, `--content-padding`) already exist globally and are reused. Page-specific tokens (`--sd-*`)
  are declared inside each `sd-*` block's own section container, so no other page can change.
- **New blocks only, prefixed `sd-`.** No existing block reused (they would carry the old look) and none modified.
- **No metadata / section-metadata tables** in the local page (BLOCK-LIBRARY hard rule 4). The page title falls
  back to the runtime default; a Title/Description metadata row is a delivery-time item.
- **No DA delivery** — delivery deferred; user approves remote actions separately.

## Triage (D1 / D11) and names — locked

| # | Prototype section | Decision | Block | Decode tier | Collection pattern mirrored |
|---|---|---|---|---|---|
| 1 | hero | block (bespoke composition: field, strip, white bars) | `sd-hero` | template-slotted (node-slotting) | hero |
| 2 | promos | block (3 repeating tiles) | `sd-promos` | reconstructive | cards (same row model as the site's `cards promo`) |
| 3 | connective-tissue | block — see deviation below | `sd-statement` | template-slotted | columns (text cell + media cell) |
| 4 | proof | section head = default content; tabs = block | `sd-case-studies` | reconstructive | tabs (same row model as the site's `tabs case-study`) |
| 5 | reach | head = default content; stat band = block | `sd-reach` | reconstructive | (bespoke stat band; same row model as the site's `stats`) |
| 6 | perspectives | head (h2 + lone link) = default content; cards = block | `sd-perspectives` | reconstructive | cards (same row model as the site's `cards leadership`) |
| 7 | newsletter | block (form) | `sd-newsletter` | template-slotted | (same row model as the site's `newsletter`) |
| — | header / footer / assistant launcher | existing global chrome | — | — | — |

**D1 deviation — `sd-statement`.** The connective-tissue section is prose plus one image, which D1 would author as
default content with a section `style`. The foundation is frozen, so no section style can be added, and the
global `:is(h1,h2,h3) em/strong` highlight colours (green and cyan on white, both below AA) would apply. A block is
the only CSS scope available that touches this page alone. It holds no repeat units; its authored content is
plain `h2` + `p` + `picture`.

## Encode decisions

- Content verbatim from `content/index.plain.html`, same section order and images (`./images/home|logos|leadership/…`).
- Perspectives rows author the article cell (h3) before the person cell (h4), so the heading outline runs h2 → h3 → h4
  (matching the prototype); the block places each cell by role, not by position.
- Promo `inverse` and stat `featured` flag cells are kept from the site's existing content model (metadata text, EW5 exempt).
- CTAs: promo actions keep `<p><strong><a>` (red primary); the case-study link and "View all insights" stay plain links.

## Per-instance variants to reproduce (style-fingerprint)

hero line 2 colour (Deep Current); promo tile 2 light vs 1/3 inverse; active vs inactive case-study tab; last ledger row bottom rule.

## Final inventory (2026-10-30)

| Block | Files | Notes |
|---|---|---|
| sd-hero | blocks/sd-hero/sd-hero.{js,css} | h1 split at `<br>` into bar spans (presentational; collapses to one bar while editing in Experience Workspace) |
| sd-promos | blocks/sd-promos/sd-promos.{js,css} | inverse flag → ink scrim on the text zone only; stretched CTA link; first image eager + fetchpriority high; edit-mode CTA repaint |
| sd-statement | blocks/sd-statement/sd-statement.{js,css} | em = ink + gradient underline; strong period = Deep Current |
| sd-case-studies | blocks/sd-case-studies/sd-case-studies.{js,css} | ARIA tabs (Arrow/Home/End), 2×2 rail under 600px; metric value/label wrappers |
| sd-reach | blocks/sd-reach/sd-reach.{js,css} | ledger via subgrid ≥600px; featured disc; map behind content (isolation) |
| sd-perspectives | blocks/sd-perspectives/sd-perspectives.{js,css} | subgrid-aligned rows; person caption in the cyan panel; stretched article link |
| sd-newsletter | blocks/sd-newsletter/sd-newsletter.{js,css} | client-side validity + status line (same runtime message as the site's newsletter block) |

Gates: eslint + stylelint clean; block-roundtrip 0 structural 🔴 (EW 73/78 editable, 0 dead, 0 duplicated, 5 declared exempt);
qa-gate PASS 25 ok / 2 advisory warn (decorative full-bleed layers) / 0 fail; ew --simulate-editor residual drift: hero line split, 1 case-study, 3 promo button props.

Lessons for next time: the site has no global border-box reset (a padded disc rendered 516 instead of 420), so every new block needs a scoped reset;
mobile-first translation of a max-width prototype must carry the narrow-width values (min-height, aspect-ratio) into the base rule.
