# dynamic-media

Custom **dynamic-media** block: an Adobe Dynamic Media image or video, placed by URL.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. The URL row is required; every other row is optional. Labelled two-cell rows can come in any order.

| Dynamic Media | |
| --- | --- |
| URL of the asset (link or plain text) | |
| Alt | Alternative text for an image |
| Caption | Caption text (links, **bold** and *italic* are kept) |
| Crop | Smart crop name (`Large`, `:Large`) or image preset (`$preset$`) |
| Ratio | `16:9`, `4:3` or `1600x900`: reserves the space before the image loads |
| Type | `video` (only needed when the URL does not say it is a video) |

Unlabelled single-cell rows after the URL are read as alt text, then caption; a row that starts with `$` or `:` is the crop / preset. Labelled rows are clearer and recommended.

### Supported URLs

| Source | URL pattern | Renders |
| --- | --- | --- |
| Dynamic Media with OpenAPI (AEM Assets) image | `https://delivery-p7954-e2285674.adobeaemcloud.com/adobe/assets/urn:aaid:aem:<id>/as/<name>.jpg` | Responsive picture: webp + jpg (png kept for .png/.gif), `?width=750/1200/2000&quality=85&preferwebp=true`; Crop adds `smartcrop=<name>` |
| Dynamic Media with OpenAPI video | `.../adobe/assets/urn:aaid:aem:<id>/play`, an `/as/<name>.mp4`, or Type = video | AEM Assets player (scripts/video.js), not autoplaying |
| Classic Dynamic Media (Scene7) image | `https://s7d1.scene7.com/is/image/<company>/<asset>` (any `*.scene7.com`, or `/is/image/` on a custom domain) | Responsive picture: `?wid=750/1200/2000&fmt=webp` or `jpg`, `&qlt=85`; Crop gives `<asset>:<crop>` or `?$preset$` |
| Scene7 video | `/is/content/<company>/<asset>.mp4` (or Type = video) | Browser video player (scripts/video.js) |
| Other video links | any `.mp4`, a Brightcove player URL | The matching player (scripts/video.js) |
| Anything else | | A plain link, never a broken image |

- An image that fails to load (asset unpublished, wrong URL) is replaced by a link to it.
- Images load lazily with a `sizes` attribute; the first block on the page loads eagerly. Add a Ratio row to set width/height and avoid layout shift.
- Videos never autoplay and load only metadata.
- `left` / `right`: put the block **before** the text it should sit beside, in the same section. Below 900px it stacks.

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

Options combine, e.g. `Dynamic Media (narrow, rounded)`.

## Universal Editor fields

N/A (Document Authoring project)
