# visual-sitemap

Visual page hierarchy of the published site, drawn from the site search index (`/query-index.json`). Updates itself whenever pages are published.

## Authoring (Document Authoring)

| Visual Sitemap | |
| --- | --- |
| Source | `/query-index.json` (optional, the default) |
| Root | `/` (optional; e.g. `/about-sei` draws only that branch) |

## Shows

- Home at the top, then one column per top-level section; nested pages as a tree with connector lines.
- Each card: title (linked), path, number of blocks, last updated, pages below. Folders without a page of their own are dashed (labelled from a same-named child page, e.g. `/about-sei/about-sei`).
- Find by title or path (matches highlighted, parents kept), Expand all / Collapse all, per-branch toggles.

## Limits

- Published pages only; pages excluded from the index (fragments, nav, footer, library, drafts, modals) are not drawn.
- The XML sitemap for search engines (`/sitemap.xml`) is separate and generated automatically.
