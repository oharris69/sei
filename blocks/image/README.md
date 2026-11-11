# image

Custom **image** block: one image, with an optional caption and an optional link, for ad-hoc content updates.

## Authoring (Document Authoring)

Model: `standalone`

Single block table, one cell per row. Only the picture row is required; rows may come in any order and empty rows are ignored.

| Image |
| --- |
| Picture (drag the image in; its alt text is used) |
| Caption text (optional; links, **bold** and *italic* are kept) |
| A link on its own (optional; the image links there) |

- Without a picture the block renders nothing.
- A row holding nothing but one link is the image link, not caption. A link wrapped around the picture itself also works.
- Images uploaded to DA are served optimised (webp, responsive widths). Images from another site, and SVGs, are shown as authored.
- The image loads lazily, except when this is the first block on the page (then it loads eagerly with high priority).
- `left` / `right`: put the block **before** the text it should sit beside, in the same section. Below 900px the image stacks above the text.

## Supported variations

| Variation | Option class | Result |
| --- | --- | --- |
| Default | (none) | Natural size, centred, never wider than the content column |
| Wide | `wide` | Fills the content column (1280px max) |
| Full width | `full` | Edge to edge; caption stays in the content column |
| Narrow | `narrow` | ~720px reading column |
| Left | `left` | Floats left of the following text on desktop |
| Right | `right` | Floats right of the following text on desktop |
| Rounded | `rounded` | Site card radius (15px) |
| Bordered | `bordered` | 1px light-grey hairline |

Options combine, e.g. `Image (narrow, rounded)`.

## Universal Editor fields

N/A (Document Authoring project)
