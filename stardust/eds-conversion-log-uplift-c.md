<!-- stardust:provenance
  writtenBy: stardust:deploy (conversion only; foundation/chrome/DA steps skipped by instruction)
  writtenAt: 2026-11-03T21:30:00Z
  readArtifacts: [stardust/prototypes/index-C-cinematic.html, stardust/prototypes/index-C-proposed.html, stardust/prototypes/index-C-shape.md, DESIGN-C.md, DESIGN-C.json, stardust/direction.md, stardust/eds-conversion-log-uplift-a.md, reference/BLOCK-LIBRARY.md, blocks/ua-*, prototype/reference/motion-validation.md]
  stardustVersion: 0.32.1
-->
# EDS conversion log — index-uplift-c

Prototype `stardust/prototypes/index-C-cinematic.html` (uplift variant C, kinetic-display) → page
`content/index-uplift-c.plain.html` (`http://localhost:3001/content/index-uplift-c`).
Precedent and shared constraints: `stardust/eds-conversion-log-uplift-a.md`. The foundation is frozen, there are no
metadata tables and no DA delivery. The global chrome is kept: the header with its experience bar, the footer and the
assistant launcher.

## Approach: A's blocks + one page-level layer

C has the same IA and copy as A. So the page is A's content with the same eight `ua-*` blocks, unchanged, plus one block:
`uc-cinematic`. It is authored as a single-cell block (`kinetic-display`) in the first section, after `ua-hero`.
No `ua-*` file is modified. Every hook is added at runtime or targeted by CSS from `uc-cinematic`.

`blocks/uc-cinematic/` contains:

- `uc-cinematic.css`, which has two parts:
  - **Static layer**: C's layout deltas from A, in CSS only, so they hold if the script fails.
  - **Motion layer**: start states, gated on `html.uc-motion` plus a runtime hook class.

  All rules are scoped `main:has(.uc-cinematic.block)`. The file loads only on pages that author the block. The two
  classes also lift these rules above the `ua-*` section-container rules they adjust.
- `uc-cinematic.js`: the motion runtime. Its behaviour is documented in the header comment.
- `lenis.min.js` and `lenis.min.css`: Lenis v1.3.19, MIT, copied from `stardust/prototypes/`.

### Static deltas (shape brief §1–3)

| Delta | Implementation (on the `ua-*` DOM) |
|---|---|
| Full-bleed hero field | `.ua-hero-container` gets the 225° field; `.ua-hero-field` (A's half field) is hidden; padding 72/64 (36/32 at ≤640) |
| Three offset bars | bar 2 (`.ua-hero-bar.is-ink`) is offset 80px (40 at ≤900, 20 at ≤640); the lede `p` becomes bar 3: white, 24/500 (19 at ≤640), cyan hairlines; bars are capped on mobile |
| Every h2 on a bar | the h2s of default content, `.ua-role-panel-intro`, `.ua-statement-text` and `.ua-newsletter-copy` become inline bars with 2px cyan hairlines that hang from the page edge. The bar fill is a `::before`, so it can draw. Ink bar on paper grounds; paper bar on the proof field, the stats ink and the panels (the panel bars are inset). "connective tissue" is green on ink (the highlighter is removed). Font sizes as the prototype: 44/34/28 statement, 30/24 panels |
| Stacked numeral bars | `.ua-stats-row` becomes a stack. Each `.ua-stat` is a 400px numeral column (300 at ≤900; 1 column at ≤640) plus a label column, with a 2px cyan rule on top. Numerals are 104 / lead 144 cyan (76/104, 60/80); labels 20/500 |
| Promo row | starts 48px below the field |

## Motion layer (kinetic-display)

| Choreography | Trigger | What animates | Timing |
|---|---|---|---|
| hero-bars | load, once | section field clip R→L; each bar clip L→R; the text inside each bar rises (translateY 105%→0, masked by the bar) | field 900ms; bars 800ms expo at 240 + i×110ms; text 700ms at 440 + i×110ms |
| head-bars | IO | bar `::before` scaleX 0→1; hairlines transparent→cyan; words (runtime `.uc-word` spans) clip L→R + rise 40% | 800ms expo; hairlines 200ms at +500ms; words 600ms at 120 + w×50ms (≤ 570ms) |
| numeral-wipes | IO | each stat's cyan rule scaleX; numeral clip L→R + rise 18% | 800ms; 700ms at +160ms. True values at every frame (no count-up) |
| card-wipes | IO, one-shot | promo tiles, role cards, statement ring, case-study tabs, leader cards: clip L→R | 640ms expo, 110ms stagger among siblings |
| tab-swap | tab change | the newly shown case-study panel: clip L→R | 320ms |

- **Hooks.** Selectors on the `ua-*` DOM:
  - `.ua-hero-bar`, `.ua-hero-lede p`;
  - the h2 list above;
  - `.ua-stat` with its `.ua-stat-value > p`;
  - `.ua-promo`, `.ua-role-panel-choices li`, `.ua-statement-media`, `.ua-case-tabs`, `.ua-leader`;
  - `.ua-case-panel[hidden]` changes, watched by a MutationObserver.

  The runtime adds `uc-hero`, `uc-bar`, `uc-bt`, `uc-head`, `uc-word`, `uc-srow`, `uc-nm`, `uc-rise` and `uc-swap`,
  plus `--uc-i/w/k`. Hook classes are removed when each reveal ends, so the settled page is the static page. Clipped
  cards are observed through their unclipped parent. IO uses threshold 0 and rootMargin −6% bottom.
- **Lazy sections.** The block decorates while its own section is still hidden, so the hero hooks are in place before
  the first paint. A MutationObserver on `data-section-status` hooks every later section when it turns `loaded`. It runs
  in a microtask, before that section is painted. Elements already scrolled past are left static.
- **Persona versions** of `ua-role-panel` are hooked too. Their cards wipe in when the persona switch shows them.
- **Fallbacks.**
  - No JS, the script blocked, reduced motion, or no IntersectionObserver: `uc-motion` is never set, so nothing is hidden.
  - Reduced motion turned on mid-visit: everything is forced to its final state and Lenis is destroyed.
  - A `prefers-reduced-motion` CSS block and a print CSS block also force final states.
  - `beforeprint` reveals everything that is still pending.

## Lenis

- **Loading.** Loaded from `/blocks/uc-cinematic/` with `loadScript` and `loadCSS`, after the window `load` event. It is
  never loaded under reduced motion.
- **Options.** `lerp 0.1`, `smoothWheel`, `syncTouch: false` (touch stays native), `anchors: false`, `autoRaf`,
  `allowNestedScroll`.
- **Prevent list.** `prevent` matches `header`, `dialog`, `[role=dialog]`, `[aria-modal=true]`, `.assistant`, `textarea`,
  `select` and `[data-lenis-prevent]`. Wheel input there stays native: the SEI Assistant docked chat, the mobile nav and
  the modals.
- **Modals.** A MutationObserver on `body.modal-open` (or `dialog:modal`) stops Lenis while a modal locks the page and
  restarts it afterwards.
- **Failure.** If Lenis fails, scrolling stays native and every reveal still runs: the runtime does not depend on it.
- `window.__lenis` is exposed for the stardust Pass 6a contract.

## Verification (2026-11-03, Playwright, 1440×900 and 390×844)

- **Blocks, errors, overflow.** All 11 blocks load: header, 8 × `ua-*`, `uc-cinematic`, footer. 0 console errors, 0 broken
  images, 0px horizontal overflow at both widths.
- **Static layout** matches the prototype section by section: hero bars, head bars, stacked stats, newsletter card bar.
- **Motion.** The hero bars are clipped mid-load (e.g. `inset(0 70% 0 0)` at about 250ms) and fully open after settling.
  At the top after settling, 0 elements in the viewport are hidden. A wheel scroll-through of the whole page (through
  Lenis) leaves 0 hidden elements and 0 hooks on visible elements. The 13 hooks left are in hidden persona versions.
- **Reduced motion** (`reducedMotion: 'reduce'`): no `uc-motion` class, no Lenis, no word spans, 0 hidden at any position.
  All 11 h2 bars and the stack layout are present.
- **Script blocked** (`uc-cinematic.js` routed to 404): the static C layout still applies (block CSS loads), 0 hidden. The
  only errors are the expected 404 and "failed to load module".
- **Lenis blocked** (`lenis.min.js` 404): every reveal still runs; 0 hidden after the scroll-through.
- **Scroll-jack checks.** At 1440 (the full interaction probe ran at 1440 only):
  - The wheel scrolls the page within 250ms of the first section showing.
  - PageDown, ArrowDown, End and Home all move the page.
  - An anchor click jumps natively. It lands at the same offset with and without Lenis (the site's 40px `scroll-margin`).
  - Back/forward scroll restoration was not tested.
- **Dialogs** (1440):
  - SEI Assistant chat (docked dialog): the wheel over the thread scrolls the thread (scrollTop 0→480) and the page does
    not move.
  - Modal (`schedule-eric-dunn`): Lenis is stopped, the page does not move on wheel, and Lenis restarts on close.
- **Other interactions** (1440): a tab change runs the panel wipe, then `clip-path: none`. Switching the persona to
  advisor wipes in the 2 new role cards. Turning reduced motion on mid-visit removes all hooks and Lenis, with no leftover
  `lenis` class.
- **Variant A unchanged.** `/content/index-uplift-a` at 1440: the full-page screenshot is pixel-identical to the one taken
  before this work (0 px differ).
- **Lint.** `npx eslint blocks/uc-*` and `npx stylelint "blocks/uc-*/*.css"` are clean, with all lines ≤ 100 chars.
  - `lenis.min.js` is skipped by the project's existing `.eslintignore` (`*.min.js`) and is byte-identical to the
    prototype copy.
  - `lenis.min.css` got one `/* stylelint-disable … vendored */` header line; the body is byte-identical.
  - Two `no-underscore-dangle` disables cover `window.__lenis`.
- **Screenshots** (full page, after the scroll-through): `/tmp/sei-shots/eds-C-1440.png`, `/tmp/sei-shots/eds-C-390.png`.

## Remaining differences (accepted)

- **Content width and chrome are inherited from A.**
  - The content width is 1232px, with text at x=104 at 1440. The bars still hang from x=0, so the bar text sits 24px
    further right than in the prototype.
  - The chrome is the site's: experience bar, footer and red edge launcher.
- **Mobile hero.** Bar 1 wraps as "Financial value / is created" (2 lines). The prototype shows 3 lines, an artifact of
  its nested shrink-to-fit spans; the bar caps are the same.
- **Hero start.** The load moment starts when the first section is shown, after the block module loads. The prototype
  gates it with a head script. There is no flash: the section stays hidden until it is hooked.
- **Lenis boot time.** Lenis boots after `load`, not inline. Native scrolling covers the gap.
- **Hooks are removed after each reveal.** The prototype keeps them. As a result, focus rings and the leader-card hover
  lift are never clipped. The hero bars use `overflow: hidden` only while animating.
- **Not built.** The hover/focus hairline draw is listed as open ceiling polish in the prototype too.
- **Pre-existing 404, outside scope.** Opening the `schedule-eric-dunn` modal requests
  `content/modals/images/modals/video-bill-coffey.png`, which does not exist. It comes from that modal's content, on
  every page.
