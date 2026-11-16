# everviz

Custom **everviz** block: one Everviz chart, chart layout or table (formerly Highcharts Cloud), embedded the way seic.com embeds them in article rich text.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Only the chart row is required; labelled rows may come in any order and empty rows are ignored.

| Everviz | |
| --- | --- |
| `https://app.everviz.com/inject/r9SKBTsZ_/` (the chart: link or plain text) | |
| Caption | Text under the chart (optional; links, **bold** and *italic* are kept) |
| Alt | Accessible description of the chart (optional; read by screen readers, not shown) |
| Height | `600` (optional; px) |

- The chart row accepts any Everviz URL (`/inject/<id>/`, `/embed/<id>/`, share links, legacy `cloud.highcharts.com` links), a pasted seic.com embed snippet (`<div id="everviz-layout-…"><script src="…/inject/…">`), or, in the first row, a bare chart id such as `r9SKBTsZ_`. `Chart | <url or id>` also works.
- Any other unlabelled text becomes the caption. `Title` is accepted for `Caption`, and `Description` for `Alt`.
- Without a recognisable chart URL or id the block renders nothing.
- The block works with both kinds of Everviz id, layouts (`everviz-layout-<id>`) and single charts or tables (`highcharts-<id>`, `everviz-table-<id>`), without being told which one it has.
- Inject mode loads the Everviz script only when the block scrolls within ~200px of the viewport, once per chart id. Its space is reserved while it loads (400px, or the Height row).
- If the script fails (for example a deleted chart) or nothing renders within 10 seconds, a **View chart** link to `https://app.everviz.com/embed/<id>/` is shown under the caption instead of an empty box.
- The same chart id twice on one page cannot render inline twice, so the second copy uses the iframe automatically.
- Experience Workspace: the caption and the Alt text are editable in place. The chart URL and the Height value are configuration (declared `@ew-exempt`).

## Supported variations

| Variation | Option class | Result |
| --- | --- | --- |
| Default | (none) | Inline via the Everviz inject script (like seic.com), ~960px column |
| Iframe | `iframe` | The chart's Everviz embed page in a lazy iframe; Height row sets its height (default 500px) |
| Wide | `wide` | Fills the content column (1280px max) |
| Narrow | `narrow` | ~720px reading column |

Options combine, e.g. `Everviz (iframe, narrow)`.

## Universal Editor fields

N/A (Document Authoring project)
