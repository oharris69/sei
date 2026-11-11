/**
 * ud-proof — "Proof in practice" ledger (uplift variant D): one case per line, its metric on a
 * flat brand-colour block that bleeds to the left edge, then logo · story · outcome + link.
 * The section heading + lede stay default content above the block (laid out by the container).
 * Schema: stardust/eds-schema/index-uplift-d.json § proof (4 × li.case).
 *
 * Content model (one row per case study, ≤ 4 cells, classified by content so order may vary):
 *   [metric: p value ("$2B+"), p label]
 *   [logo picture]
 *   [story: p…]
 *   [outcome: p headline, p sub-label, p <a> link]
 * Also accepts `ua-case-tabs` rows ([2 logos] [story, link] [metric] [outcome]): only the first
 * logo is shown on this paper band (the second is the on-dark variant and is not rendered).
 * Metric colours follow the row position: Pink, Orange, Blue, Green, then repeat.
 * Decode tier: reconstructive (authored nodes moved into the ledger frame).
 *
 * @param {Element} block The block element
 */
const SVG_NS = 'http://www.w3.org/2000/svg';
const ICONS = {
  arrow: [['path', { d: 'M4 12h15.5M13.5 6l6 6-6 6' }]],
};

/** Presentational outline icon (Nucleo outline style, as in the prototype): no text, hidden. */
function icon(name) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', `ud-icon ud-icon-${name}`);
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  ICONS[name].forEach(([tag, attrs]) => {
    const el = document.createElementNS(SVG_NS, tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    svg.append(el);
  });
  return svg;
}

/** Appends the trailing arrow once (idempotent: re-decoration never doubles it). */
function addArrow(el) {
  if (el && !el.querySelector(':scope > .ud-icon-arrow')) el.append(icon('arrow'));
}

const FIELDS = ['pink', 'orange', 'blue', 'green'];
const VALUE = /^[$€£]?\s?\d[\d.,]*\s?[A-Za-z%]{0,6}\+?(\s?(years?|yrs?))?$/i;

function div(className, nodes = []) {
  const el = document.createElement('div');
  el.className = className;
  el.append(...nodes);
  return el;
}

function readRow(row) {
  const out = {
    logo: null, value: null, valueLabel: null, story: [], side: [], cta: [],
  };
  [...row.children].forEach((cell) => {
    const media = [...cell.querySelectorAll('picture, img')]
      .filter((m) => !(m.matches('img') && m.closest('picture')));
    if (media.length && !cell.textContent.trim()) {
      if (!out.logo) [out.logo] = media;
      media.slice(out.logo === media[0] ? 1 : 0).forEach((m) => m.remove());
      return;
    }
    let kids = [...cell.children].filter((el) => el.textContent.trim());
    if (!kids.length && cell.textContent.trim()) {
      // bare-text cell (harness / un-pipelined content): move the text node into a <p>
      const p = document.createElement('p');
      p.append(...cell.childNodes);
      kids = [p];
    }
    kids.forEach((el, i) => {
      const text = el.textContent.trim();
      const link = el.querySelector('a');
      if (link && text === link.textContent.trim()) {
        out.cta.push(el);
      } else if (!out.value && i === 0 && VALUE.test(text)) {
        out.value = el;
        const next = kids[1];
        if (next && !next.querySelector('a')) out.valueLabel = next;
      } else if (el === out.valueLabel) {
        // already taken as the metric's label
      } else if (text.length > 90) {
        out.story.push(el);
      } else {
        out.side.push(el);
      }
    });
  });
  return out;
}

export default function decorate(block) {
  const list = document.createElement('ol');
  list.className = 'ud-proof-ledger';

  [...block.children].forEach((row) => {
    const c = readRow(row);
    if (!c.value && !c.logo && !c.story.length) return;
    const item = document.createElement('li');
    item.className = `ud-proof-case is-${FIELDS[list.children.length % FIELDS.length]}`;

    const metric = div('ud-proof-metric');
    if (c.value) metric.append(div('ud-proof-value', [c.value]));
    if (c.valueLabel) metric.append(div('ud-proof-metric-label', [c.valueLabel]));
    item.append(metric);

    const body = div('ud-proof-body');
    const logoImg = c.logo && (c.logo.querySelector('img') || c.logo);
    if (c.logo) {
      const heading = document.createElement('h3');
      heading.className = 'ud-proof-logo';
      logoImg.loading = 'lazy';
      heading.append(c.logo);
      body.append(heading);
    }
    if (c.story.length) body.append(div('ud-proof-story', c.story));
    const side = div('ud-proof-side');
    const [word, ...labels] = c.side;
    if (word) side.append(div('ud-proof-word', [word]));
    if (labels.length) side.append(div('ud-proof-label', labels));
    if (c.cta.length) {
      c.cta.forEach((p) => {
        const a = p.querySelector('a');
        a.classList.remove('button', 'primary', 'secondary', 'accent');
        p.classList.remove('button-wrapper');
        addArrow(a);
        // names the destination for assistive tech (runtime attribute, no visible words)
        if (logoImg?.alt && !a.getAttribute('aria-label')) {
          a.setAttribute('aria-label', `${a.textContent.trim()}: ${logoImg.alt}`);
        }
      });
      side.append(div('ud-proof-cta', c.cta));
    }
    if (side.children.length) body.append(side);
    item.append(body);
    list.append(item);
  });

  block.replaceChildren(list);
}
