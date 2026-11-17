# block-usage

Report of which blocks are used on which published pages, read from the site search index (`/query-index.json`). The index is defined in the site configuration (`content/query.yaml`, config service); its `blocks` column lists every block on a page as `[name, ...options]`, taken from `main > div > div[class]` in the published markup.

## Authoring (Document Authoring)

| Block Usage | |
| --- | --- |
| Source | `/query-index.json` (optional, the default) |
| Library | `/library/blocks.json` (optional; set empty to hide the "not on a published page" list) |

## Shows

- Totals: pages indexed, distinct blocks, block instances, library blocks unused on published pages.
- One row per block: pages using it, uses, share of pages, variants with counts; expand for every page (title, path, variant, uses).
- Find (by block name) and sort (most pages, most uses, A–Z).

## Limits

- Published pages only (indexing runs on publish); preview-only pages are not counted.
- Blocks inside a fragment are counted on the fragment page, which the index excludes; host pages show `fragment`.
- Blocks added by code at runtime (auto-blocks) are not in the published markup, so not counted.
- The library list is shown only where `/library/blocks.json` is reachable (it is on preview; publish it for live).
