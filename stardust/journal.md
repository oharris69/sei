# Journal — SEI redesign

Chronological log of every prompt execution. Most recent at the bottom.
See `skills/stardust/reference/journal-format.md` for entry format.

---

## 2026-10-29T23:33:30Z — extract (state-and-report) — single-page capture of the SEI home

**Prompt:** Hands-off brand-faithful refresh of the SEI home page, delivered as a new EDS page `/index-stardust`; extract only the live home page first.

**Decisions:**
- Scope = 1 page (`--pages /`, user decision); flow `redesign` stamped with `flowSource: "user"`, `handsOff: true`.
- Ran the bundled `crawl.mjs`, `style-census.mjs` (1440 + 390) and `cap-probe.mjs` from the plugin tree (no copies into the project).
- Vision check: `index` ok — hero is a CSS gradient field, so `cssBackgrounds: []` is believable.
- Brand surface: palette ink/red/cyan/green, DM Sans (CircularXX substitute), 15px radius, green→cyan 225° gradient, ad-hoc type scale.

**Artifacts touched:**
- stardust/current/pages/index.json, index.html, assets/screenshots/index.png — created (crawler)
- stardust/current/_computed-styles.json — created (census)
- stardust/current/_brand-extraction.json, _crawl-log.json — created
- stardust/current/PRODUCT.md, DESIGN.md, DESIGN.json (+ cap model), brand-review.html — created
- stardust/state.json, status.jsonl — created

**Findings worth flagging:**
- The sandbox refuses heredocs containing regex-like `/x/` tokens and `cd` outside the project; helper scripts are written with the file tool under `stardust/.work/`.

**Open questions:**
- none

**Next:** `stardust:direct` — resolve the brand-faithful refresh direction.

---

## 2026-10-29T23:41:00Z — intent / direct — brand-faithful refresh direction resolved (hands-off)

**Prompt:** Resolve the brand-faithful refresh direction for the home page (palette, voice, content pinned; hierarchy, rhythm, type scale, polish moved; static motion; verbatim IA).

**Decisions:**
- Mode A (signal-strong) + Mode B agent-sourced anchors via WebFetch (Addepar, Stripe, MoMA); seed SEI|2026-10-29 rolled Mosaic tile x Auction catalogue, decade reasoned to 2025-now, ground stark-white (agrees with brand).
- Density balanced: the 7-section multi-audience hard floor caps desktop section padding at 64px (named assumption; user said "balanced/airy").
- Contrast failures fixed by role reassignment inside the pinned palette: Ink on all colour fields; captured #086c8a (Deep Current) as accent text on white.
- One 1.25 type scale from a 17px body; static motion (register null).

**Artifacts touched:**
- PRODUCT.md, DESIGN.md, DESIGN.json (project root) — created
- stardust/direction.md, stardust/prototypes/index-improvements.md — created
- stardust/state.json — index extracted to directed

**Findings worth flagging:**
- Live home fails AA in three brand pairings: green metrics 1.82:1, white-on-cyan titles 2.14:1, cyan hero line 2.14:1.

**Open questions:**
- Whether the user wants an explicitly airy (96px) rhythm despite the floor — default kept at 64px.

**Next:** stardust:prototype index.

---

## 2026-10-30T00:08:00Z — prototype (plan, render, critique, audit, adapt, approval) — index-proposed.html approved hands-off

**Prompt:** Prototype the home page against the brand-faithful direction, run every quality gate, approve under hands-off when the gates clear.

**Decisions:**
- Shape brief `stardust/prototypes/index-shape.md`: 10 sections verbatim, surprise low, 2 substrate exceptions (proof gradient, reach ink), 0 unsourced content.
- Render delegated to impeccable (new-work, established-world surface; concept seed exempt because the structure is brief-pinned). Finish reviewer ran 2 correction rounds: 4 fixes resolved, 1 partial (promo scrim brightness at 1440), 1 acknowledged (global assistant pill overlap).
- Critique (isolated A+B subagents) and audit (15/20 Good) found 0 P0. Both P1s fixed (focus ring on dark tiles; newsletter status via CSS :target with copy from the existing newsletter block), plus 7 P2s. 4 brand-faithful dismissals recorded.
- Adapt: clean at 1920 down to 360; hamburger nav under 900; tabs as 2x2 under 600. Motion validation not fired (static).
- Approved with `approvedBy: hands-off`.

**Artifacts touched:**
- stardust/prototypes/index-shape.md, index-proposed.html, assets/favicon.ico — created
- DESIGN.json — divergence notes + prototype audit amendments
- stardust/validation/index-proposed/ — clean-pass screenshots (1440/768/390 + adapt sweep)

**Findings worth flagging:**
- Copy-cadence detector fires on verbatim source copy ("drive growth"); waived inline in the proposed file only (Discipline 9).

**Open questions:**
- Promo tiles 1 and 3 still read mostly dark at desktop because the long verbatim webcast copy fills ~60% of the tile.

**Next:** stardust:deploy — convert to sd-* EDS blocks and content/index-stardust.plain.html (DA delivery deferred).

---

## 2026-10-30T00:36:00Z — deploy (runtime-probe, 1-audit, 2-decide, 2b-section, 7-blocks, 9-content, local-qa, 10-reconcile) — /index-stardust built locally, diff clean

**Prompt:** Convert the approved prototype into new `sd-*` EDS blocks and a new page `content/index-stardust.plain.html` without touching any existing file; verify against the prototype with the diff skill; no remote delivery.

**Decisions:**
- 7 new blocks (sd-hero, sd-promos, sd-statement, sd-case-studies, sd-reach, sd-perspectives, sd-newsletter); section heads for proof/reach/perspectives are default content styled through their block containers.
- Foundation, chrome and DA delivery skipped as named deviations (direction.md); D4 waived for local images.
- Prototype aligned after approval (1280 content cap, CSS-mask arrows); no design change.

**Artifacts touched:**
- blocks/sd-*/ (14 files), content/index-stardust.plain.html — created
- stardust/runtime-contract.json, eds-conversion-log.md, eds-schema/index-stardust.json, diff/index-stardust/ — created
- stardust/prototypes/index-proposed.html — aligned; stardust/state.json — index approved to migrated

**Findings worth flagging:**
- No global box-sizing reset on this site; new blocks must carry a scoped one.
- `pkill -f <pattern>` matches its own shell; stop servers by PID.

**Open questions:**
- Remote delivery (DA upload, preview, publish) and a Title/Description metadata row await the user's approval.

**Next:** user review of http://localhost:3001/content/index-stardust; on approval, DA delivery plus the deployed-URL Step 10 checks (CLS, chrome crop, AI-readability).

---

## 2026-10-30T20:00:00Z — direction (user decision) — 64px section spacing confirmed

**Prompt:** "keep the 64px spacing"

**Decisions:**
- density pinned `balanced` by the user: `sectionPadding.desktop` stays 64px; the named assumption in direction.md (density, Q1) is now user-confirmed, not hands-off-derived. No airy (96px) variant.
- Recorded post-deploy changes since the last entry: SEI Assistant launcher collapses to its icon when it would cover content (sitewide, scripts.js + styles.css); sd-promos dark tiles show more image (shallower overlay, 428px desktop tiles). Both shipped to main and live; DA/preview/publish of /index-stardust done with title/description/noindex metadata.

**Artifacts touched:**
- stardust/journal.md — this entry (no design or code change)

**Open questions:**
- Remove `noindex` from /index-stardust in DA if it should appear in search.

**Next:** none pending on spacing.

---

## 2026-11-02T00:00:00Z — deploy (metadata) — /index-stardust indexable with its own title and description

**Prompt:** "Remove noindex from index-stardust in DA", then "give index-stardust its own title and description", each followed by preview + publish.

**Decisions:**
- Robots `noindex` row removed from the DA document; the page is now indexable.
- Own metadata so it is distinguishable from Home: Title "SEI | The connective tissue of modern finance"; Description "Investments, operations and advice under one roof: SEI supports $1.9T in assets under management and administration with 2,000+ experts in 15 countries." (figures from the page's own stats section).

**Artifacts touched:**
- DA: index-stardust.html metadata table — edited; previewed and published (main--sei--oharris69.aem.live/index-stardust)
- stardust/journal.md — this entry

**Findings worth flagging:**
- Page body still mirrors Home's content; search engines may treat the two as near-duplicates despite distinct metadata.

**Open questions:**
- none (the 2026-10-30 noindex question is resolved)

**Next:** none pending.

---

## 2026-11-03T19:10:00Z — uplift (extract, tensions, direct, prototype ×3) — three presales variants of the home page, CircularXX capture

**Prompt:** "uplift https://main--sei--oharris69.aem.live/ --re-extract": three brand-faithful variants of `index` (A faithful + improvements, B a captured trait amplified, C cinematic). Hands-off. Stop before approve/migrate/deploy.

**Decisions:**
- Re-extracted with `crawl.mjs --max 1`, `style-census.mjs` and `cap-probe.mjs`. The capture now records **CircularXX** as heading and body family (computed `circularxx` on every measured node; `--heading-font-family` / `--body-font-family`). Hero h1 is 80px / 1000 / -0.4px. The DM Sans capture is retired (archived at stardust/archive/2026-10-30-index-stardust/).
- Brand review covers 9 tensions: T-scale, T-logo-variants, T-color-imbalance ×3, T-contrast, plus agent-found T-route-twice, T-red-overload and T-proof-hidden. T-proof-hidden corrects an initial misread: all four case-study tabs do carry metrics, the capture had filtered hidden panels.
- `uplift-improvements.md` lists 7 items, grounded with WebFetch (tier-2) references: Stripe, Addepar and BlackRock Aladdin.
- `uplift-questions.md` walks 8 catalog candidates plus 1 derived. Photography and live-data are disqualified.
- C register: `kinetic-display` (display-typography signature beats `arrival` on the tie-break). C's trait is signature-gesture extension (the offset heading bars). B's trait is audience-routing reframe (role-first).
- ia-fidelity `reimagined`, density `balanced` (64px hard floor), Mode A brand-faithful. Shared PRODUCT.md / DESIGN.md / DESIGN.json plus DESIGN-A/B/C written at root. Only DESIGN-C.json carries `extensions.motion.register`.
- A was rendered first and froze the canon (tokens, chrome). B and C were built from A sequentially; the parallel path was not used (memory limits).
- Every variant went through a finish reviewer, dual-agent critique and an audit. Fixes were applied in at most 2–3 rounds per variant.
- C's motion was reworked after critique and audit. Split-flap and count-up are removed: they flashed false figures such as "$6.8T" AUM. Scroll-scrubbed card fades became one-shot clip-path wipes. Heading word wipes are now time-based. The motion supplement runs before Lenis, so a Lenis failure strands nothing.
- State: `index` stays `migrated` under the linearity rule. Extracted, directed and prototyped history entries were appended with `--history-only`, and the page is flagged `stale`. No approval recorded.

**Artifacts touched:**
- stardust/current/* (fresh capture: pages/index.{json,html}, _brand-extraction.json, _computed-styles.json, _crawl-log.json, PRODUCT.md, DESIGN.md, DESIGN.json, brand-review.html, assets/screenshots)
- stardust/uplift-improvements.md, stardust/uplift-questions.md, stardust/direction.md (new active direction; prior is in History), stardust/prototypes/index-improvements.md (mirror)
- PRODUCT.md, DESIGN.md, DESIGN.json, DESIGN-A/B/C.{md,json} (root)
- stardust/prototypes/index-{A,B,C}-shape.md, index-A-proposed.html, index-B-proposed.html, index-C-proposed.html, index-C-cinematic.html, lenis.min.{js,css}
- stardust/validation/index-{A,B,C,C-proposed}/ (screenshots); stardust/state.json; stardust/status.jsonl
- stardust/.work/uplift/ helper probes (named deviation in direction.md)

**Findings worth flagging:**
- The captured FFT case-study paragraph is identical to Summit's. B's untabbed proof wall makes this visible. This is a source-content issue for SEI, not rewritten.
- The webcast date "Thursday, October 1" is captured verbatim and is now in the past.
- B: the fixed SEI Assistant launcher can cover the third role door's arrow at 390 on first paint (recorded).
- C: two ceiling-polish items are left open: a hairline leading each card wipe, and hover/focus hairline draws.
- The old single-variant files stardust/prototypes/index-proposed.html and index-shape.md (2026-10-30 run) are still on disk; copies are in the archive.

**Open questions:**
- Which variant should go forward (A, B or C)? Approval follows the standard prototype flow.

**Next:** the user reviews the three variants. Iterate via chat or approve one; nothing was migrated or deployed in this run.

---

## 2026-11-03T21:05:00Z — direct --rebrand + prototype — rebrand variant R ("The Lobby Floor") of the home page, in an isolated worktree

**Prompt:** Produce one bold from-scratch rebrand of the SEI home page as a review prototype. New palette, type pairing and layout language; keep the SEI name, the logo mark and every captured content item; IA may be reordered; distinctiveness high; density balanced; static. Hands-off. Delivered to the main checkout under `-R` / `stardust/rebrand/` names, so the uplift A/B/C direction there stays active.

**Decisions:**
- **Mode: rebrand.** The `--rebrand` flag and the phrase ("from-scratch", "not brand-faithful") triggered it. Mode A pins are off even though the capture is `signal-strong`.
- **Seed.** Full divergence-seed roll: `SEI|2026-11-03` → 1950s × Terrazzo × Real-estate listing × cream.
  - Cream was overridden by audit to monochrome-tint. A cream ground has no print-category justification for SEI; terrazzo's cement matrix is cool stone.
  - Research tier skipped: the caller requested a full roll, and no refero or WebSearch was available.
- **Palette.** 10 role tokens derived from the coolors anchor "Monochrome Harmony" (library v0.7.0): Lobby Stone #E6EBE7, Slab White #F5F7F5, Verde Matrix #0F2B26, Verde Veil #3D5450, Brass Strip #A88231, Brass Engraved #6B5117, Saffron Chip #F2B33D, Rose Chip #E8B6A6, Mist #C9D3CE, Pebble #93A19C. Every text pair passes AA.
- **Type.** Archivo at wdth 112–125 for display, figures and labels (OFL 1.1, Omnibus-Type), paired with Source Serif 4 for prose (OFL 1.1, Adobe). Both load from Google Fonts CSS in the prototype. Deck: swiss-modernist with reflex substitutions; reflex-reject hits: 0.
- **Layout language.** Square poured slabs, with 2px brass strips in place of gutters and shadows.
  - "between the lines." sits literally inside a brass-ruled band filled with terrazzo.
  - The role router is a 1950s lobby directory board.
  - Stats and case metrics are set as listing-sheet spec rows, with all four case studies visible and no tabs.
- **IA.** The directory moved up to directly after the hero. The rest of the order is promos → positioning → scale → proof → leaders → newsletter.
- **Prototype gates.**
  - Critique ran dual-agent: 21/32, with 2 P1 and 3 P2 fixed.
  - Audit: 15/20, with 1 P1 and 3 P2 fixed or acknowledged.
  - Adapt sweep 1920–360: no overflow; the mobile-nav audit passed.
  - Finish reviewer: 8 material fixes plus 1 regression, all resolved after two verdict rounds.
  - The impeccable concept-seed (key 3357419e) was run and recorded, but the brief-pinned composition was kept.

**Artifacts touched (main checkout):**
- stardust/prototypes/index-R-proposed.html — created
- stardust/prototypes/index-R-shape.md — created
- stardust/prototypes/assets/rebrand/terrazzo-tile.svg — created (a reference copy of the 200px aggregate tile that is inlined in the prototype; no other new assets are needed)
- stardust/rebrand/direction.md, DESIGN.md, DESIGN.json, PRODUCT.md — created
- stardust/journal.md — this entry appended
- Not touched: state.json, root PRODUCT.md / DESIGN*, stardust/direction.md, blocks/, scripts/, styles/, content/, fonts/

**Findings worth flagging:**
- `content/` is git-excluded (`.git/info/exclude`), so worktrees have no images. Renders were checked through a path-remapped copy, and the final file is verified in the main checkout.
- The only remaining detector finding is the monospace on stardust's mandatory PLACEHOLDER eyebrow. It applies to the uncaptured "Why?" explanation and is kept by contract.
- Captured imagery is re-toned, not replaced: promo duotone, greyscale portraits and a brass medallion ring. Images, positions and alt text are unchanged.

**Open questions:**
- Does the rebrand direction go forward next to, or instead of, uplift A/B/C?
- The "Why?" explanation copy is a placeholder.
- Fonts would need self-hosting at migrate.

**Next:** review `stardust/prototypes/index-R-proposed.html` against index-A/B/C. No approval is recorded and nothing was migrated or deployed.

---
