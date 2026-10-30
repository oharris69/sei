<!-- stardust:provenance
  writtenBy: stardust:extract
  writtenAt: 2026-10-29T23:32:00Z
  readArtifacts:
    - https://main--sei--oharris69.aem.live/
    - stardust/current/pages/index.json
    - stardust/current/_brand-extraction.json
    - content/index.plain.html
  synthesizedInputs: [Users, Product Purpose, Positioning, Product Principles inferred from captured copy]
  stardustVersion: 0.32.1
-->
# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

_provenance: inferred — basis: nav labels ("Who We Serve": asset managers, banks and wealth managers, financial advisors, institutional investors) and home-page copy.

Decision-makers at wealth and asset-management firms — COOs, CTOs, heads of platform, advisors evaluating a breakaway, and institutional investment committees — who are assessing SEI as a long-term operating, technology and investment partner. They arrive on the home page to orient: what SEI is, how big it is, whether peers trust it, and where to go next.

## Product Purpose

_provenance: inferred — basis: hero lede and display section copy.

The home page is the corporate front door for SEI, a wealth and investment technology, operations and asset-management firm. It positions SEI as "one partner, one connected wealth enterprise", routes visitors to timely promotions (webcast, marketplace, earnings), proves scale (case studies, stats), surfaces leadership thought pieces, and captures newsletter subscriptions.

## Positioning

_provenance: inferred — basis: "The connective tissue of modern finance" section.

SEI sits at the intersection of investments, operations and advice — capabilities "rarely found under one roof". The claim is breadth integrated into one relationship, backed by 58 years of institutional service and $1.9T in assets under management and administration.

## Capabilities and Constraints

- Edge Delivery Services site; content authored as blocks (hero, cards promo/leadership, tabs case-study, stats, newsletter) with a global header, footer and a floating "SEI Assistant" launcher.
- Brand face CircularXX is licensed and unavailable; DM Sans (self-hosted, variable weight to 1000) is the substitute.
- Newsletter band is a cross-site system component above the footer.

## Brand Commitments

- Register: **brand** (marketing landing page, no auth, hero with marketing copy, social proof, stats).
- Palette: ink #131517, red #d82b2a (actions), cyan #00c0f3, green #a6ce39, green→cyan 225° gradient as the signature field.
- Voice: bold-direct — short declarative headlines that end in a period, confident numbers, no exclamation marks.
- Personality (observed): confident, institutional, modern, connected.
- Anti-references (observed by absence): no stock-photo hero, no playful illustration, no dark-mode-by-default.

## Evidence on Hand

- `stardust/current/pages/index.json` + `index.html` — full capture of the home page.
- `stardust/current/assets/screenshots/index.png` — full-page 1440 screenshot.
- `stardust/current/_computed-styles.json` — style census at 1440 and 390.
- `stardust/current/_brand-extraction.json` — consolidated brand surface.
- Real content: 3 promo cards, 4 case studies (Summit, FFT, TCW, Kent State) with stats, 4 headline stats, 4 leadership articles with portraits. Images local under `content/images/{home,logos,leadership,shared}/`.
- Absent: testimonials/quotes, pricing, video. Do not fabricate.

## Product Principles

_provenance: inferred

1. Prove scale with real numbers, never adjectives.
2. One connected partner — every section reinforces integration across investments, operations and advice.
3. Lead with the next useful action (register, invest, read) for each audience.
4. Institutional confidence over hype.

## Accessibility & Inclusion

Target WCAG 2.2 AA (financial-services norm); no product-specific requirement captured.
