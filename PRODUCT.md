<!-- stardust:provenance
  writtenBy: stardust:direct (via stardust:uplift Phase 4)
  writtenAt: 2026-11-03T18:15:00Z
  againstDirection: stardust/direction.md#active-direction
  readArtifacts:
    - stardust/current/PRODUCT.md
    - stardust/current/_brand-extraction.json
    - stardust/current/pages/index.json
    - stardust/uplift-improvements.md
    - stardust/uplift-questions.md
  synthesizedInputs: [Users, Positioning, Product Principles — inferred from captured copy; hands-off]
  stardustVersion: 0.32.1
-->
# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

<!-- _provenance: inferred — basis: "Who We Serve" nav, role bar and the three captured role CTAs; hands-off assumption -->

The audience is senior decision-makers at financial advisory firms, enterprise RIAs, asset managers, banks and wealth managers, and institutional investors. They are weighing SEI as a long-term technology, operations and investment partner. They want four answers quickly:

- what SEI is
- whether SEI is big and durable enough
- whether their peers trust it
- which path is theirs

They read on desktop at work and on phones between meetings.

## Product Purpose

The SEI home page presents one connected wealth enterprise, with investments, operations and advice under one roof, and routes each visitor by role to the next useful action. This run covers presales redesign prototypes of the home page (three variants, one of them cinematic). The content stays the same; execution and, for B, composition change.

## Positioning

<!-- _provenance: inferred — basis: "The connective tissue of modern finance" section + stats -->

SEI is the connective tissue of modern finance. It brings together capabilities rarely found under one roof, proven by 58 years of institutional service, 15 countries, 2,000+ experts and $1.9T in assets under management and administration.

## Capabilities and Constraints

- Brand-faithful: CircularXX (licensed, self-hosted `/fonts/`), the captured SEI palette and the green→cyan field. No new fonts or hues.
- WCAG 2.2 AA (financial-services norm). Every text/ground pairing must pass.
- Prototypes are static HTML under `stardust/prototypes/`. They reuse the site's own images from `content/images/**`.
- System components keep their roles: header, role bar, SEI Assistant launcher, newsletter band, footer.

## Brand Commitments

- Register: **brand**.
- Brand personality: confident, institutional, precise, connected, with a **display-typography signature** (CircularXX ExtraBlack set on offset bars, "between the lines").
- Voice: bold and direct. Declarative headlines end in a period; numbers are stated with confidence; no exclamation marks.
- Anti-references:
  - the Generic-2026-SaaS silhouette (centred hero + dual CTA + three icon cards + logo strip)
  - glassmorphism
  - gradient text
  - side-stripe accent borders
  - stock "smiling customer" imagery
  - hype adjectives
  - invented stats or quotes

## Evidence on Hand

- `stardust/current/pages/index.json` + `index.html`: the full home capture (2026-11-03).
- `stardust/current/_brand-extraction.json`: palette, type (CircularXX), motifs, voice.
- Real content:
  - 3 promo tiles (Data Cloud webcast; SEI Marketplace; $12B in market cap)
  - 3 role CTAs
  - connective-tissue paragraph and ring image
  - 4 case studies with copy + 2 metrics each
  - 4 stats
  - 4 leadership articles with portraits
  - newsletter copy
- Absent, never to be fabricated: testimonials/quotes, pricing, video, per-role page copy, client counts.

## Product Principles

1. **Prove scale with real numbers.** Every claim of size or trust points to a captured figure.
2. **Ask once, route clearly.** Role routing happens in one canonical place per page.
3. **Rank the actions.** Red is for the one or two actions that matter now, never for every button.
4. **Keep the signature.** The offset-bar headline gesture is SEI's mark. Variants extend it and never replace it.
5. **Institutional, never hype.** Restraint in decoration and precision in type.

## Accessibility & Inclusion

WCAG 2.2 AA: text contrast ≥ 4.5:1 (≥ 3:1 for ≥ 24px or bold ≥ 18.66px), visible focus on every control, keyboard-reachable tabs and role doors, `prefers-reduced-motion` honoured (C collapses to its static rendering).
