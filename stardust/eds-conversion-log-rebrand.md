<!-- stardust:provenance
  writtenBy: stardust:deploy (blocks + local page only; foundation and DA steps skipped)
  writtenAt: 2026-11-03T20:30:00Z
  readArtifacts: [stardust/prototypes/index-R-proposed.html, stardust/prototypes/index-R-shape.md, stardust/rebrand/DESIGN.md, stardust/rebrand/DESIGN.json, stardust/rebrand/direction.md, stardust/eds-conversion-log.md, reference/BLOCK-LIBRARY.md, content/index.plain.html, content/index-stardust.plain.html]
  stardustVersion: 0.32.1
-->
# EDS conversion log: index-rebrand (rebrand R, "The Lobby Floor")

Prototype `stardust/prototypes/index-R-proposed.html` → page `content/index-rebrand.plain.html`
(local: `http://localhost:3001/content/index-rebrand`). This follows the precedent set by `stardust/eds-conversion-log.md` (index-stardust).

## Constraints that override the skill (named deviations)

- **Frozen foundation.** `styles/`, `scripts/`, `head.html`, `404.html`, existing `fonts/`, every existing block (incl. `sd-*`,
  `header`, `footer`, `fragment`) and every existing content file are untouched. Step 3 (foundation rebrand) is not run.
  Page tokens (`--rb-*`) are declared inside each `rb-*` block's own section container, as with `sd-*`.
- **Chrome restyled on this page only.** `rb-hero.js` adds `body.rb-page` and loads `blocks/rb-hero/rb-chrome.css`. Every
  rule in it starts with `body.rb-page`. It restyles the shared header (nav row and experience bar), footer and assistant
  launcher to the prototype's chrome. It also overrides `--body-font-family`, `--heading-font-family`, `--link-color`,
  `--link-hover-color`, `--nav-height` and `--experience-height` on `body.rb-page`. Checked: `/content/index`,
  `/content/index-stardust` and `/content/bd-breakaway` keep the white nav, ink bar, red launcher and CircularXX, and they
  load no `rb-` CSS.
- **New blocks only, prefixed `rb-`.** No existing block is reused, because they would bring the old look.
- **No metadata or section-metadata tables** in the local page (BLOCK-LIBRARY hard rule 4). The title and description
  rows are a delivery-time item.
- **No DA delivery** and no admin calls. The user approves remote actions separately.

## Fonts (self-hosted, OFL 1.1)

| File | Family / axes | Source |
|---|---|---|
| `fonts/archivo-latin-variable.woff2` (90 KB) | Archivo, wght 100–900, wdth 62–125 % | Google Fonts latin subset (Omnibus-Type, OFL 1.1) |
| `fonts/source-serif-4-latin-variable.woff2` (122 KB) | Source Serif 4 roman, wght 200–900, opsz 8–60 | Google Fonts latin subset (Adobe, OFL 1.1) |
| `fonts/source-serif-4-latin-italic-variable.woff2` (130 KB) | Source Serif 4 italic, same axes | Google Fonts latin subset (Adobe, OFL 1.1) |

`@font-face` is declared once in `blocks/rb-hero/rb-hero.css`, with root-relative `/fonts/` URLs, the latin
`unicode-range` and `font-display: swap`. No Google Fonts CSS is loaded at runtime. The OFL notice travels in each
file's name table. "→" (U+2192) is outside the latin subset, so it renders in the system fallback, as it does in the prototype.

## Triage and names (locked)

| # | Prototype section | Decision | Block | Decode tier | Row model mirrored |
|---|---|---|---|---|---|
| 1 | hero (scale-displacement + brass band + terrazzo) | block | `rb-hero` | template-slotted | site `hero` (h1 with `<br>`, p) |
| 2 | directory (role board) | block | `rb-directory` | reconstructive | live `adaptive` default row (eyebrow, h2, p, role links) |
| 3 | listings (bays 6/3/3) | block | `rb-listings` | reconstructive | site `cards promo` |
| 4 | connective tissue (terrazzo inlay) | block (see D1 note) | `rb-positioning` | template-slotted | columns (text cell + media cell) |
| 5 | spec sheet (spec rows + map) | block (head in-block: split layout) | `rb-spec-sheet` | reconstructive | site `stats` (value / label / `featured`) |
| 6 | proof ledger | head = default content; ledger = block | `rb-ledger` | reconstructive | site `tabs case-study` |
| 7 | leadership bays | head (h2 + lone link) = default content; bays = block | `rb-leaders` | reconstructive | site `cards leadership` |
| 8 | newsletter (saffron slab, fieldset) | block (form) | `rb-newsletter` | template-slotted | site `newsletter` |
| — | header / role strip / footer / launcher | existing shared chrome, restyled by `rb-chrome.css` | — | — | — |

**D1 note.** The same reason as `sd-statement` applies to `rb-positioning`, `rb-directory` and `rb-spec-sheet`. The
foundation is frozen, so a block is the only CSS scope that touches this page alone. The global `:is(h1,h2,h3) em`
green highlight is neutralised inside the block.

## Encode decisions

- Copy is verbatim from the prototype, which is verbatim from `content/index.plain.html`. Hrefs are the live
  root-relative ones. Images reuse `./images/home|logos|leadership/…`.
- The IA order follows the prototype: hero → directory → listings → connective → spec sheet → proof → leadership → newsletter.
- Re-toning is CSS only. Promo art: greyscale + `mix-blend-mode: screen` over verde. Ring image: an SVG duotone filter
  (`#rb-brass-duo`), injected once by `rb-positioning.js` as a hidden inline `<svg>`. Map: `brightness(0)` at 50 % opacity.
  Portraits: greyscale, back to colour on hover/focus.
- The terrazzo tile ships as `terrazzo-tile.svg` inside both blocks that use it (`rb-hero`, `rb-positioning`, 86 KB, 21 KB gzipped),
  so each block stays self-contained.
- Headings follow the prototype outline. Promo titles are h2 (the live page uses h3). Leader names are p, not h4, so
  leadership runs h2 → h3. `rb-leaders` also accepts h4 names.
- Directory: the eyebrow "RECOMMENDED FOR YOU" (ALL-CAPS p before the h2) becomes the board's title plate and the nav's
  accessible name. The role links are plain `<p><a>`; button-formatted links are accepted too.
- Listings: a link-less `<br>` paragraph becomes one rose badge per line. The live `inverse` flags are dropped. An
  optional `lead` flag cell can move the lead bay (default: first row).
- Spec sheet: the `featured` flag marks the verde lead row. It is authored first, as in the prototype.
- Ledger: one picture per logo cell. The live white-logo variants are not authored; a second picture is ignored if present.
- Newsletter: the eyebrow "STAY CONNECTED" becomes the `<legend>`. The placeholder and button-text lines are EW-exempt
  (same as `sd-newsletter`). Submit runs client-side validation and shows the same status message as the site's newsletter.
- CTAs: listing CTAs `<p><strong><a>` → saffron primary. Case-study and "View all insights" links are text links with a
  brass underline. Arrows are CSS `content: '→' / ''`, so assistive tech skips them.

## Final inventory (2026-11-03)

| Block | Files | Notes |
|---|---|---|
| rb-hero | `rb-hero.{js,css}`, `rb-chrome.css`, `terrazzo-tile.svg` | `@font-face` home; adds `body.rb-page`; awaits the chrome CSS; the last h1 line goes into the band |
| rb-directory | `rb-directory.{js,css}` | nav labelled by the plate; dotted leader rule ≥641px; saffron arrow inverts on hover/focus |
| rb-listings | `rb-listings.{js,css}` | 1 → 2 (lead full width, horizontal) → 6/3/3 at 641 / 1181px |
| rb-positioning | `rb-positioning.{js,css}`, `terrazzo-tile.svg` | em = upright + 0.12em brass underline; double brass edge on the inlay |
| rb-spec-sheet | `rb-spec-sheet.{js,css}` | `<dl>` with `dt` figure / `dd` label; lead row on verde |
| rb-ledger | `rb-ledger.{js,css}` | 4 columns ≥901px (180 / 220px logo column); logo + summary full width, then figure and features side by side below |
| rb-leaders | `rb-leaders.{js,css}` | stretched title link; `:has()` focus ring on the bay; 4 → 2 → row cards |
| rb-newsletter | `rb-newsletter.{js,css}` | fieldset + legend; the input row stacks ≤640px |

## Verification

- Lint: `npx eslint blocks/rb-*` and `npx stylelint "blocks/rb-*/*.css"` both clean.
- 1440×900 and 390×844: all 8 `rb-*` blocks plus header and footer load. No console errors, no broken images, no
  horizontal overflow; the overflow check also passed at 360, 768, 1024, 1280 and 1920. Only Archivo and Source Serif 4
  load, all three from `/fonts/` (HTTP 200).
- Page height matches the prototype: 5710 vs 5710 at 1440, 9384 vs 9384 at 390. Full-page RMSE vs the prototype is 1.1 %
  at 1440 and 8 % at 390; the mobile figure comes from 1–2px sub-pixel shifts in the role strip text.
- A text-matched structural probe at 1440 matched 141 text nodes. The only differences left are matching artefacts
  (`<strong>` wrappers, pseudo-element text) and the chrome items listed below.
- Interactions checked: desktop dropdown, persona menu, mobile menu, the Why? dialog, launcher hover, newsletter submit.
- Screenshots: `/tmp/sei-shots/eds-R-1440.png`, `/tmp/sei-shots/eds-R-390.png`.

## Remaining differences from the prototype (and why)

- **Role strip behaviour.** "Choose your role" is the header's real persona button, which opens the persona menu, not an
  in-page `#directory` anchor. "Why?" opens the site's real "Why am I seeing this?" dialog instead of the PLACEHOLDER
  panel. The header is shared and cannot be edited.
- **Header details.** The visible "Search" label is CSS-generated next to the icon; the captured link name is its
  aria-label. On mobile the EDS hamburger panel opens with its menus expanded (stock header behaviour), and the collapsed
  bar hides the tools. There is no skip link: the site has none, and adding one would mean editing the shared chrome.
- **Tablet role strip (641–900px).** It uses the same two-row grid as mobile. In the prototype the stage line wraps
  under a single row instead. The visual difference is small.
- **Launcher glyph.** It uses the site's `chat.svg` mask, not the prototype's square speech bubble. The site's "compact"
  logic still runs, and the label reveals on hover/focus as in the prototype.
- **Fixed in the build, not copied.** At 1024px the prototype's newsletter row overflows its column (539px in 456px).
  The block lets the input shrink.
- Not run: the skill's block round-trip and Experience Workspace simulation gates. Each block's content model and
  EW-exempt cells are documented at the top of its JS.
