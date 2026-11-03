<!-- stardust:provenance
  writtenBy: stardust:deploy (conversion only; foundation/chrome/DA steps skipped by instruction)
  writtenAt: 2026-11-03T20:30:00Z
  readArtifacts: [stardust/prototypes/index-A-proposed.html, stardust/prototypes/index-A-shape.md, DESIGN-A.md, stardust/eds-conversion-log.md, reference/BLOCK-LIBRARY.md, content/index.plain.html, content/index-stardust.plain.html, blocks/sd-*, blocks/adaptive]
  stardustVersion: 0.32.1
-->
# EDS conversion log — index-uplift-a

Prototype `stardust/prototypes/index-A-proposed.html` (uplift variant A, "faithful + improvements") → page
`content/index-uplift-a.plain.html` (`http://localhost:3001/content/index-uplift-a`). Precedent: `stardust/eds-conversion-log.md`.

## Constraints that override the skill (same named deviations as index-stardust)

- **Frozen foundation.** No change to `styles/`, `scripts/`, `head.html`, `fonts/`, header/footer or any existing block or content.
  Foundation rebrand and chrome steps not run. CircularXX and the global tokens (`--color-*`, `--radius-card`,
  `--content-padding`, `--content-max-width`) are reused; variant tokens (`--ua-*`) are declared on each block's own
  section container (`main > .section.ua-*-container`), so no other page changes.
- **New blocks only, prefixed `ua-`**, generic and content-driven (for reuse by variants B and C).
- **No metadata / section-metadata tables** locally; **no DA delivery** (no admin.* calls).
- Global chrome kept: header with its experience bar (stands in for the prototype's role bar), footer, assistant launcher.

## Triage and names

| # | Prototype section | Decision | Block | Content model (row shape) |
|---|---|---|---|---|
| 1 | hero | block | `ua-hero` | one cell: h1 (lines split at `<br>`), p lede, optional buttons |
| 2 | promo-tiles | block | `ua-promos` | `cards promo` rows: [picture] [h2/h3, p…, p CTA] [opt. `inverse`]; row 1 = wide tile |
| 3 | tell-us | block (adaptive) | `ua-role-panel` | `adaptive` rows: [`default` / persona (+stages)] [opt. picture, label p, h2, p, link p…] |
| 4 | connective-tissue | block (see D1 note) | `ua-statement` | one row: [h2 with `<em>` highlight, p…] [picture] |
| 5 | proof | head = default content; tabs = block | `ua-case-tabs` | `tabs case-study` rows: [2 logos] [story, link] [metric]… ; metric 1 also shown on the tab |
| 6 | stats | head = default content; row = block | `ua-stats` | `stats` rows: [picture] then [value] [label] [opt. `featured`]; featured leads |
| 7 | leadership | head (h2 + lone link) = default content; cards = block | `ua-leaders` | `cards leadership` rows: [picture] [name p, role p] [h3>a, p] (cells by content) |
| 8 | newsletter | block (form) | `ua-newsletter` | `newsletter` rows: [label p, h2, p] [label, placeholder, button text, disclaimer…] |

**D1 note — `ua-statement`.** Prose + one image would normally be default content with a section style, but the frozen
foundation's `:is(h1,h2,h3) em` (green text) would apply; a block is the only page-local CSS scope (same as `sd-statement`).

**Tell-us = the live page's `adaptive` block.** The prototype shows the adaptive block's `default` version restyled as an ink
panel with three equal outlined role cards. `ua-role-panel` keeps the `adaptive` content model and selection logic
(persona + stage via `scripts/profile.js`, "Why am I seeing this?" via `scripts/why.js`, `adaptive-shown` event), and the
page carries all six live versions verbatim, so persona switching from the header still works. Each version is decorated
once (nodes moved, not cloned) and the others are `hidden`.

## Encode decisions

- Copy verbatim from the prototype (= live home copy). Images reused from `content/images/home|logos|leadership|…`.
- Prototype-driven content edits vs. the live page (all from the prototype): promo titles are h2; the dek is no longer bold;
  only "Register now" stays a red `<strong>` button, the other promo CTAs are plain links (text links with arrows);
  role links are plain links (all cards equal, no red); "connective tissue" period is plain ink (no `<strong>`);
  `$1.9T` row is authored first; leader names are paragraphs (prototype sets them as chip text, not headings);
  eyebrows use the prototype's case: "Recommended for you" (card group label), "Stay connected" (form legend).
- Arrows on CTAs are CSS masks of `/icons/arrow-right.svg` (no authored icons needed).
- Each block carries a scoped `box-sizing: border-box` reset (lesson from the precedent).

## Verification (2026-11-03, Playwright, 1440×900 and 390×844)

- All 10 blocks load (`header`, 8 × `ua-*`, `footer`); 0 console errors; 0 broken images; no horizontal overflow at 1440/390
  (also clean at 1280, 768, 641, 640, 414, 360).
- Section-by-section geometry vs prototype: within ±5px height at both widths, except proof at 1440 (+14px, see below).
  Type sizes/weights/colours match for h1 and every h2/lede checked. Headings and CTA labels/order are identical; copy identical.
- Tabs (click, Arrow/Home/End), persona switch (default ↔ advisor ↔ reset), newsletter validation + status all work.
- Lint: `npx eslint blocks/ua-*` and `npx stylelint "blocks/ua-*/*.css"` clean; all lines ≤ 100 chars.
- Screenshots: `/tmp/sei-shots/eds-A-1440.png`, `/tmp/sei-shots/eds-A-390.png`.

## Remaining differences (accepted)

- **Content width 1232px vs 1280px** at ≥1328px viewports: blocks follow the site's section wrapper so they line up with the
  global header's logo (prototype: content and its own header both at x=80; EDS: both at x=104). Consequence: the proof
  panel story wraps one extra line (+14px), and desktop tab side padding is 20px (prototype 24px) so the longest tab metric
  stays on one line.
- **Chrome is the site's**, not the prototype's: experience bar instead of the prototype role bar (mobile bar is shorter: the
  prototype wraps "Talk to an advisor" onto a second row), site footer layout, and the red edge-tab assistant launcher instead
  of the prototype's ink pill.
- Leader cards: the prototype wraps each whole card in one `<a>`; EDS keeps the authored `h3 > a` and stretches it over the
  card (accessible name = article title).
- Hidden persona versions of `ua-role-panel` are in the DOM (`hidden`); the original `adaptive` block renders only one.
- Pre-existing, outside scope: the global footer's link row overflows horizontally at ~900–1024px on every page
  (`/content/index`, `/content/index-stardust` too).
