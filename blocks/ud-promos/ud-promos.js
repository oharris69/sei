/**
 * ud-promos — "Now at SEI" rail on the Ink band (uplift variant D): one wide featured tile
 * (image beside the copy) and narrower tiles (image above), every copy panel on one Blue field.
 * Schema: stardust/eds-schema/index-uplift-d.json § now-at-sei (3 × li.promo).
 *
 * Content model (one row per tile — the same shape as `ua-promos` / the site's `cards promo`):
 *   [picture] [h2/h3 title, p copy…, p "when" line, p CTA] [optional flag, e.g. "inverse"]
 * - The first row is the wide featured tile.
 * - "When" line: a link-free paragraph with a digit that is all <strong> or holds a <br>
 *   (date/time); it gets a calendar icon.
 * - CTA: <p><strong><a> = red primary button; a plain <p><a> = underlined text link with arrow.
 * Cells are classified by content, so their order may vary. Flags are ignored by this design.
 * @ew-exempt flag cell ("inverse") — text-as-metadata, never displayed
 * Decode tier: reconstructive (one tile per authored row).
 *
 * @param {Element} block The block element
 */
const SVG_NS = 'http://www.w3.org/2000/svg';
const ICONS = {
  arrow: [['path', { d: 'M4 12h15.5M13.5 6l6 6-6 6' }]],
  calendar: [
    ['rect', {
      x: 4, y: 5.5, width: 16, height: 14, rx: 1.5,
    }],
    ['path', { d: 'M4 10h16M8.5 3.5v4M15.5 3.5v4' }],
  ],
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

const FLAG = /^\s*(inverse|dark|light|wide)\s*$/i;

function div(className, nodes = []) {
  const el = document.createElement('div');
  el.className = className;
  el.append(...nodes);
  return el;
}

function classify(cells) {
  const out = { media: null, body: null };
  cells.forEach((cell) => {
    const text = cell.textContent.trim();
    const pic = cell.querySelector('picture') || cell.querySelector('img');
    if (!out.media && pic && !cell.querySelector('h1, h2, h3, h4, a') && !text) {
      out.media = pic;
    } else if (FLAG.test(text) && !cell.querySelector('a, picture, img')) {
      // design flag from other variants' content: no effect here
    } else if (text) {
      out.body = out.body ? out.body.concat([...cell.children]) : [...cell.children];
    }
  });
  return out;
}

function isWhen(el) {
  if (!el.matches('p') || el.querySelector('a') || !/\d/.test(el.textContent)) return false;
  const strong = el.querySelector('strong, b');
  const allStrong = strong && strong.textContent.trim() === el.textContent.trim();
  return allStrong || !!el.querySelector('br');
}

function decorateBody(children) {
  const field = div('ud-promo-field');
  const actions = [];
  children.forEach((el) => {
    const link = el.matches('p') && el.querySelector('a');
    if (link && el.textContent.trim() === link.textContent.trim()) {
      addArrow(link);
      actions.push(el);
    } else if (isWhen(el)) {
      field.append(div('ud-promo-when', [icon('calendar'), el]));
    } else {
      field.append(el);
    }
  });
  if (actions.length) field.append(div('ud-promo-action', actions));
  return field;
}

export default function decorate(block) {
  const list = document.createElement('ul');
  list.className = 'ud-promos-rail';

  [...block.children].forEach((row) => {
    const { media, body } = classify([...row.children]);
    if (!media && !body) return;
    const tile = document.createElement('li');
    tile.className = 'ud-promo';
    if (!list.children.length) tile.classList.add('is-wide');
    if (media) {
      const img = media.querySelector('img') || media;
      img.loading = 'lazy';
      tile.append(div('ud-promo-media', [media]));
    }
    if (body) tile.append(decorateBody(body));
    list.append(tile);
  });

  block.replaceChildren(list);
}
