# teaser

Custom **teaser** block. 

## Authoring (Document Authoring)

Model: `standalone`

Single block table, one row, two cells in either order:

| Teaser |  |
| --- | --- |
| Heading (H1, H2 or H3), optional subline paragraph(s), optional **bold link** CTA | Picture (no text) |

- Optional icon: put a paragraph holding only a small picture or `:icon-name:` before the heading. It renders 40px, in the panel's text colour.
- Panel colour: ink by default. Give the section a `style` of `red`, `cyan`, `green`, `orange` or `light-grey` (Section Metadata) to colour the copy panel; text, subline, icon and the CTA button switch to match.
- Portrait (`portrait` option): same two cells. Picture cell: a headshot (shown as a ~250px circle centred in its half). Copy cell: the person's name as the heading (cyan), then a paragraph with the job title (white, bold), a paragraph with a label such as `Area of expertise` (small grey uppercase) and a paragraph with its value. No CTA needed.
- Existing teasers (H2 + subline + CTA, image on the right) render exactly as before.

## Supported variations

| Variation | Option class |
| --- | --- |
| Image left | `image-left` |
| Portrait | `portrait` |

## Universal Editor fields

N/A (Document Authoring project)
