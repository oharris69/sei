<!-- stardust:provenance
  writtenBy: stardust:direct
  writtenAt: 2026-10-29T23:40:00Z
  againstDirection: stardust/direction.md#active-direction
  readArtifacts:
    - stardust/current/PRODUCT.md
    - stardust/current/_brand-extraction.json
    - stardust/current/pages/index.json
    - stardust/prototypes/index-improvements.md
  synthesizedInputs: [Users, Positioning, Product Principles — inferred from captured copy; hands-off]
  stardustVersion: 0.32.1
-->
# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

<!-- _provenance: inferred — basis: "Who We Serve" nav (asset managers, banks and wealth managers, financial advisors, institutional investors) and home-page copy; hands-off assumption -->

Senior decision-makers at wealth managers, asset managers, banks, advisory firms and institutions who are evaluating SEI as a long-term technology, operations and investment partner. They scan the home page to answer four questions fast: what SEI is, how big and durable it is, whether peers trust it, and where to go next (event, marketplace, results, insights, newsletter). They read on desktop at work and on phones between meetings.

## Product Purpose

The SEI home page presents one connected wealth enterprise — investments, operations and advice under one roof — and routes each visitor to the next useful action. Scope of this redesign: a refreshed copy of the home page at `/index-stardust`; same content, same order, modernized execution.

## Positioning

"The connective tissue of modern finance": capabilities rarely found under one roof, proven by named client outcomes (Summit Wealth Group, FFT Wealth Management, TCW, Kent State) and scale ($1.9T assets under management and administration, 58 years, 15 countries, 2,000+ experts).

## Capabilities and Constraints

- Edge Delivery Services site. The redesign ships as new `sd-*` blocks and a new content page; the global header, footer and the floating SEI Assistant launcher remain the existing site code, untouched.
- Content fidelity is verbatim: every section, heading, copy line, CTA and image of the current home page, in the same order. No new copy, numbers, names or images.
- Brand face CircularXX is licensed and unavailable; DM Sans (self-hosted, variable 100–1000) is the type of record.
- No cinematic motion. Subtle CSS transitions only; `prefers-reduced-motion` honoured.
- Remote delivery (DA upload, preview, publish) is deferred to a separate user approval.

## Brand Commitments

- **Register:** brand.
- **Palette (pinned):** ink #131517, signal red #d82b2a (actions only), SEI cyan #00c0f3, SEI green #a6ce39, the green→cyan 225° gradient as the signature field.
- **Type (pinned):** DM Sans, heavy (900–1000) tightly-tracked headlines that end in a period.
- **Voice (pinned):** bold-direct — short declarative headlines, confident numbers, no exclamation marks.
- **Personality:** confident, institutional, connected, precise — moved from "familiar" to "slightly distinctive" through hierarchy, rhythm and component polish, not new motifs.
- **Anti-references:** the Generic-2026-SaaS silhouette (centred hero + dual CTA + three icon cards + logo strip), glassmorphism, gradient text, stock-photo heroes, dark-mode-by-default, invented stats or testimonials.

## Evidence on Hand

- Home capture: `stardust/current/pages/index.json` (+ `index.html`, screenshot `stardust/current/assets/screenshots/index.png`).
- Brand surface: `stardust/current/_brand-extraction.json`, `_computed-styles.json`.
- Authored content: `content/index.plain.html`; images in `content/images/home/`, `logos/`, `leadership/`.
- Real proof: 3 promo cards, 4 case studies with two metrics each, 4 headline stats, 4 leadership articles with portraits, newsletter sign-up.
- Absent — must not be fabricated: testimonials/quotes, customer logo strip beyond the four case-study logos, pricing, video, section eyebrows other than "STAY CONNECTED".

## Product Principles

1. **Prove with numbers, never adjectives.** Every figure on the page is real and gets the most legible treatment on the page.
2. **One partner, one system.** Every band uses the same rhythm, grid and type scale — the layout itself says "connected".
3. **Lead each audience to an action.** Promotions, case studies and insights each end in one clear, labelled action.
4. **Institutional confidence over hype.** Restraint in motion and decoration; distinctiveness comes from precision.

## Accessibility & Inclusion

WCAG 2.2 AA: text contrast ≥ 4.5:1 (≥ 3:1 for ≥ 24px bold), visible focus on every interactive element, keyboard-operable case-study tabs, meaningful alt text kept from the source, `prefers-reduced-motion` respected.
