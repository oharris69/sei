<!-- stardust:provenance
  writtenBy: stardust:extract
  writtenAt: 2026-11-03T17:40:00Z
  againstInput: https://main--sei--oharris69.aem.live/ (uplift --re-extract, single page)
  readArtifacts:
    - https://main--sei--oharris69.aem.live/
    - stardust/current/pages/index.json
    - stardust/current/_brand-extraction.json
    - stardust/current/_computed-styles.json
  synthesizedInputs: [Users, Product Purpose, Positioning, Product Principles inferred from captured copy]
  stardustVersion: 0.32.1
-->
# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

_provenance: inferred — basis: nav labels ("Who We Serve": asset managers, banks and wealth managers, financial advisors, institutional investors), the role bar ("I'm a … Choose your role") and the three role buttons in "Tell us who you are" (financial advisor / enterprise RIA / asset manager).

Decision-makers at wealth and asset-management firms: COOs, CTOs, heads of platform, advisors evaluating a breakaway, enterprise RIAs and institutional investment committees. They are judging SEI as a long-term operating, technology and investment partner. They use the home page to get oriented: what SEI is, how big it is, whether their peers trust it, and which path is theirs.

## Product Purpose

_provenance: inferred — basis: hero lede, role bar and display section copy.

The home page is SEI's corporate front door. SEI is a wealth and investment technology, operations and asset-management firm, and the page positions it as "one partner, one connected wealth enterprise". The page:

- routes visitors to timely promotions (Data Cloud webcast, SEI Marketplace, $12B market cap / Q2 results)
- asks visitors who they are (role bar and the "Recommended for you" panel)
- proves scale with case studies and stats
- surfaces leadership thought pieces
- captures newsletter subscriptions

A floating "SEI Assistant" launcher and the role bar's "Talk to an advisor" give a direct line to SEI on every view.

## Positioning

_provenance: inferred — basis: "The connective tissue of modern finance" section.

SEI sits where investments, operations and advice meet: capabilities "rarely found under one roof". The claim is breadth, joined up in one relationship, and it is backed by 58 years of institutional service, 15 countries, 2,000+ experts and $1.9T in assets under management and administration.

## Capabilities and Constraints

- An Edge Delivery Services site. Content is authored as blocks: hero, promo accordion tiles, recommended/role panel, display + ring image, case-study tabs, stats, leadership cards and newsletter. A global header, role bar, footer and a floating "SEI Assistant" launcher wrap the page.
- Brand face **CircularXX** (licensed, Lineto) is self-hosted from `/fonts/` (Regular 400, Medium 500, Black 900, ExtraBlack 950–1000, Italic, MediumItalic). It replaces the DM Sans stand-in recorded by the 2026-10-29 capture.
- The newsletter band is a cross-site system component above the footer.

## Brand Commitments

- Register: **brand**. It is a marketing landing page with no auth, a hero with marketing copy, social proof and stats.
- Palette: ink #131517, red #d82b2a (actions), cyan #00c0f3, green #a6ce39. The green→cyan 225° gradient is the signature field.
- Typography: CircularXX throughout. Display and headings use ExtraBlack (computed 1000), buttons Black 900, body Medium 500 / Regular 400. Hero h1 is 80px.
- Voice: bold and direct. Short declarative headlines end in a period, numbers are stated with confidence, and there are no exclamation marks. The hero plays on words: "between the lines".
- Personality (observed): confident, institutional, precise, connected, quietly modern.
- Anti-references (observed by absence): no stock-photo hero, no playful illustration, no dark-mode-by-default, no hype superlatives.

## Evidence on Hand

- `stardust/current/pages/index.json` + `index.html`: full capture of the home page (2026-11-03, Playwright, waitMode medium, HTTP 200).
- `stardust/current/assets/screenshots/index.png`: full-page 1440 screenshot (5633px tall).
- `stardust/current/_computed-styles.json`: style census at 1440.
- `stardust/current/_brand-extraction.json`: consolidated brand surface.
- Real content:
  - 3 promo tiles
  - 3 role CTAs
  - 4 case studies (Summit, FFT, TCW, Kent State); only Summit's panel carries stats ($2B+ asset migration, multi-custodian access)
  - 4 headline stats (58 / 15 / 2,000+ / $1.9T)
  - 4 leadership articles with portraits
- Images are local under `content/images/{home,logos,leadership,shared}/`.
- Absent: testimonials/quotes, pricing, video. Do not fabricate.

## Product Principles

_provenance: inferred

1. Prove scale with real numbers, never adjectives.
2. One connected partner: every section reinforces how investments, operations and advice join up.
3. Know the visitor: route by role before routing by product.
4. Lead with the next useful action (register, invest, talk to an advisor) for each audience.
5. Institutional confidence over hype.

## Accessibility & Inclusion

Target WCAG 2.2 AA (financial-services norm); no product-specific requirement captured.
