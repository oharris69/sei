/**
 * rb-ledger — "proof ledger": every case study on one listing sheet (rebrand R, index-rebrand).
 * Rose slab; one slab-white ledger row per case study, divided by brass strips:
 * logo | summary + "read" link | headline figure | features. No tabs: all rows are visible.
 *
 * Content model (one row per case study — same row shape as the site's `tabs case-study`;
 * cells are classified by content):
 *   [picture logo (a second, white variant is ignored)]
 *   [p summary…, p > a link]
 *   [p figure value, p figure label]
 *   [p feature title, p feature line (pairs may repeat)]
 * The section's h2 + p above the block are default content (laid out by this block's CSS).
 * Decode tier: reconstructive.
 *
 * @param {Element} block The block element
 */
function paragraphs(cell) {
  const ps = [...cell.querySelectorAll(':scope > p')];
  if (ps.length) return ps;
  const text = cell.textContent.trim();
  if (!text) return [];
  const p = document.createElement('p');
  p.append(...cell.childNodes);
  return [p];
}

function cellDiv(className, ...nodes) {
  const div = document.createElement('div');
  div.className = className;
  div.append(...nodes);
  return div;
}

function classify(cells) {
  const out = {
    logo: null, summary: null, figure: null, features: null,
  };
  const rest = [];
  cells.forEach((cell) => {
    const text = cell.textContent.trim();
    if (!out.logo && cell.querySelector('picture, img') && !text) out.logo = cell;
    else if (!out.summary && cell.querySelector('a[href]')) out.summary = cell;
    else if (text) rest.push(cell);
  });
  const numeric = rest.filter((cell) => /\d/.test(paragraphs(cell)[0]?.textContent || ''));
  out.figure = numeric.length === 1 ? numeric[0] : rest[0] || null;
  out.features = rest.find((cell) => cell !== out.figure) || null;
  return out;
}

function decorateFigure(cell) {
  const [value, ...labels] = paragraphs(cell);
  value.className = 'rb-ledger-value';
  labels.forEach((p) => { p.className = 'rb-ledger-label'; });
  return cellDiv('rb-ledger-figure', value, ...labels);
}

function decorateFeatures(cell) {
  const ps = paragraphs(cell);
  const out = cellDiv('rb-ledger-features');
  for (let i = 0; i < ps.length; i += 2) {
    ps[i].className = 'rb-ledger-feature-title';
    const feature = cellDiv('rb-ledger-feature', ps[i]);
    if (ps[i + 1]) {
      ps[i + 1].className = 'rb-ledger-feature-line';
      feature.append(ps[i + 1]);
    }
    out.append(feature);
  }
  return out;
}

export default function decorate(block) {
  const rows = [...block.children].map((row) => {
    const {
      logo, summary, figure, features,
    } = classify([...row.children]);
    if (!logo && !summary && !figure) return null;
    const article = document.createElement('article');
    article.className = 'rb-ledger-row';
    if (logo) {
      const pictures = [...logo.querySelectorAll('picture')];
      const mark = pictures[0] || logo.querySelector('img');
      pictures.slice(1).forEach((pic) => pic.remove());
      const alt = mark.querySelector?.('img')?.alt || mark.alt;
      if (alt) article.setAttribute('aria-label', alt);
      article.append(cellDiv('rb-ledger-logo', mark));
    }
    if (summary) {
      const ps = paragraphs(summary);
      ps.forEach((p) => {
        const link = p.querySelector('a[href]');
        if (link && p.textContent.trim() === link.textContent.trim()) {
          link.className = 'rb-ledger-link';
          p.className = 'rb-ledger-link-wrapper';
        }
      });
      article.append(cellDiv('rb-ledger-summary', ...ps));
    }
    if (figure) article.append(decorateFigure(figure));
    if (features) article.append(decorateFeatures(features));
    return article;
  }).filter(Boolean);

  const ledger = cellDiv('rb-ledger-sheet', ...rows);
  block.replaceChildren(ledger);
}
