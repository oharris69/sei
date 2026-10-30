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
