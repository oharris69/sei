/**
 * ud-leaders — "Perspectives from SEI Leadership" on the Green band (uplift variant D):
 * creatively cropped portraits above Yellow field panels with name, role, article title and
 * summary; the whole card links to the article.
 * The section heading + "View all insights" link stay default content above the block; the
 * container lays them out on one row.
 * Schema: stardust/eds-schema/index-uplift-d.json § leadership (4 × li).
 *
 * Content model (one row per leader — the same cells as `ua-leaders` / `cards leadership`):
 *   [picture] [person: name (h4 or p), p role…] [article: h3 <a> title, p summary]
 * Cells are classified by content (picture / heading-or-link / remaining text), so their order
 * may vary. The article link is stretched over the card (accessible name = article title).
 * Decode tier: reconstructive (authored nodes are moved into the card frame).
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

function div(className, nodes = []) {
  const el = document.createElement('div');
  el.className = className;
  el.append(...nodes);
  return el;
}

export default function decorate(block) {
  // the section head's lone "View all insights" link (default content) gets the arrow
  const head = block.closest('.section')?.querySelector(':scope > .default-content-wrapper');
  head?.querySelectorAll('p > a').forEach((a) => {
    if (a.parentElement.textContent.trim() === a.textContent.trim()) addArrow(a);
  });
  const list = document.createElement('ul');
  list.className = 'ud-leaders-grid';

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const mediaCell = cells.find((c) => c.querySelector('picture, img') && !c.textContent.trim());
    const articleCell = cells.find((c) => c !== mediaCell && c.querySelector('a'))
      || cells.find((c) => c !== mediaCell && c.querySelector('h2, h3'));
    const personCell = cells.find((c) => c !== mediaCell && c !== articleCell
      && c.textContent.trim());
    if (!mediaCell && !articleCell && !personCell) return;

    const card = document.createElement('li');
    card.className = 'ud-leader';
    const photo = div('ud-leader-photo');
    if (mediaCell) {
      const pic = mediaCell.querySelector('picture') || mediaCell.querySelector('img');
      const img = pic.querySelector('img') || pic;
      img.loading = 'lazy';
      photo.append(pic);
    }
    card.append(photo);

    const text = div('ud-leader-text');
    if (personCell) {
      const [name, ...roles] = [...personCell.children].filter((el) => el.textContent.trim());
      const person = div('ud-leader-person');
      if (name) person.append(div('ud-leader-name', [name]));
      if (roles.length) person.append(div('ud-leader-role', roles));
      text.append(person);
    }
    if (articleCell) {
      const kids = [...articleCell.children];
      const heading = kids.find((el) => el.matches('h2, h3, h4'));
      const article = div('ud-leader-article');
      if (heading) article.append(div('ud-leader-title', [heading]));
      const rest = kids.filter((el) => el !== heading);
      if (rest.length) article.append(div('ud-leader-dek', rest));
      text.append(article);
    }
    card.append(text);
    list.append(card);
  });

  block.replaceChildren(list);
}
