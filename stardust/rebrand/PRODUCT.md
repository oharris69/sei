<!-- stardust:provenance
  writtenBy: stardust:direct (--rebrand)
  writtenAt: 2026-11-03T19:40:00Z
  againstInput: "--rebrand bold from-scratch rebrand of the SEI home page (hands-off)"
  readArtifacts:
    - stardust/state.json
    - stardust/current/PRODUCT.md
    - stardust/current/pages/index.json
    - stardust/current/pages/index.html
    - stardust/current/_brand-extraction.json
  synthesizedInputs: [Brand Commitments and Product Principles re-authored for the rebrand; Users / Purpose / Positioning carried from the 2026-11-03 capture]
  stardustVersion: 0.32.1
-->
# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

<!-- _provenance: inferred --> Basis: nav labels ("Who We Serve": asset managers, banks and wealth managers, financial advisors, institutional investors), the role bar ("I'm a … Choose your role") and the three role doors in "Tell us who you are".

Decision-makers at wealth and asset-management firms: COOs, CTOs, heads of platform, advisors weighing a breakaway, enterprise RIAs and institutional investment committees. They judge SEI as a long-term operating, technology and investment partner. They use the home page to get oriented: what SEI is, how big it is, whether peers trust it, and which path is theirs.

## Product Purpose

SEI's corporate front door: one partner for investments, operations and advice. The page routes visitors by role, surfaces timely promotions (Data Cloud webcast, SEI Marketplace, $12B market cap / Q2 results), proves scale with case studies and stats, carries leadership perspectives and captures newsletter subscriptions.

## Positioning

<!-- _provenance: inferred --> Basis: "The connective tissue of modern finance" section.

SEI sits where investments, operations and advice meet, bringing together capabilities "rarely found under one roof". The claim is breadth joined up in one relationship, backed by 58 years of institutional service, 15 countries, 2,000+ experts and $1.9T in assets under management and administration.

## Capabilities and Constraints

- Edge Delivery Services site; the rebrand is a review prototype only (no block, style or content changes).
- Rebrand typefaces must be freely licensed (OFL / Google Fonts). CircularXX and DM Sans are retired for this direction.
- Static rendering: no cinematic motion layer; subtle CSS transitions only, all disabled under `prefers-reduced-motion: reduce`.
- Every captured content item is kept (headings, copy, CTAs, stats, case studies, leaders, images). IA may be reordered and regrouped.

## Brand Commitments

- Register: **brand** (marketing landing page).
- Kept from the old brand: the name "SEI" and the SEI logo mark (black block mark on light, white mark on dark). Nothing else is inherited.
- New personality: **mid-century institutional, materially honest, composed, quietly bold**. SEI reads as a building with a well-made lobby floor: many pieces bound into one surface.
- Voice (carried, because it is content): short declarative headlines ending in a period, numbers stated plainly, no exclamation marks.
- Anti-references:
  - SEI's own outgoing system (green→cyan gradient field, red action buttons, CircularXX ExtraBlack, 15px rounded cards).
  - The Generic-2026-SaaS silhouette (oversized sans hero + solid/outline CTA pair + sticky nav + serial footer).
  - The stat-callout trust bar.
  - Cream / paper grounds and the archival-editorial palette.
  - Navy-and-gold "private bank" cliché.

## Evidence on Hand

- `stardust/current/pages/index.json` + `index.html`: full capture of the home page (2026-11-03).
- `stardust/current/assets/screenshots/index.png`: full-page 1440 screenshot.
- Images: `content/images/{home,logos,leadership,shared}/` (promo art, ring image, world map, client logos, four leadership portraits, SEI logo marks).
- Real content: 3 promo tiles, 3 role doors, 4 case studies, each with its own metrics (Summit $2B+ asset migration, FFT $2B+ AUM, TCW $206B+ AUM, Kent State 8+ years), 4 headline stats (58 / 15 / 2,000+ / $1.9T), 4 leadership articles.
- Absent: testimonials, pricing, video, office addresses, phone numbers. Do not fabricate.

## Product Principles

1. **Bind the pieces visibly.** Every section shows investments, operations and advice as parts of one surface (moves *distinctiveness* to singular).
2. **Prove with numbers set like facts.** Figures are typeset as a specification, not shouted as a trust bar (moves *tone* to composed).
3. **Route by role first.** The visitor's role is asked for directly after the promise (IA priority: audience routing).
4. **One next action per block.** Each block offers one clear, labelled action.
5. **Material honesty over effects.** Depth comes from slabs and strips, not shadows, gradients or glass (moves *expressive* to committed).

## Accessibility & Inclusion

WCAG 2.2 AA: every text-on-ground pair is validated at ≥ 4.5:1 (body) / ≥ 3:1 (large display). Visible focus on every interactive element. Motion is limited to state transitions and is removed under `prefers-reduced-motion`.
