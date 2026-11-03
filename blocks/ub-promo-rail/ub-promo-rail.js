/**
 * ub-promo-rail — compact "now at SEI" rail: equal promo tiles in one row, demoted after the
 * proof wall (uplift variant B). 3-up on desktop, featured tile full width over two on tablet,
 * stacked on mobile.
 *
 * Content model (one row per tile — the same shape as `ua-promos` / the site's `cards promo`):
 *   [picture] [h2/h3 title, p copy…, p "when" line (date with <br>), p CTA] [optional "inverse"]
 * - The first row is the featured tile (darker scrim; spans the row on tablet).
 * - "inverse" tiles sit on dark art (ink scrim, white text); others keep their light art, ink text.
 * - CTA: <p><strong><a> = red primary button; a plain <p><a> = underlined text link with arrow.
 * - A paragraph with a <br> and a digit and no link is the event's date/time line.
 * Cells are classified by content, so their order may vary.
 * Section heading: author an h2 as default content above the block (e.g. "Featured"); the
 * section container keeps it for screen readers and heading order but hides it visually.
 * @ew-exempt flag cell ("inverse") — text-as-metadata, never displayed
 *
 * @param {Element} block The block element
 */
const FLAG = /^\s*(inverse|dark)\s*$/i;

function classify(cells) {
  const out = { media: null, body: null, inverse: false };
  cells.forEach((cell) => {
    const text = cell.textContent.trim();
    const hasPicture = cell.querySelector('picture, img');
    if (!out.media && hasPicture && !cell.querySelector('h1, h2, h3, h4, a')) {
      out.media = cell.querySelector('picture') || cell.querySelector('img');
    } else if (FLAG.test(text) && !cell.querySelector('a, picture, img')) {
      out.inverse = true;
    } else if (text) {
      out.body = cell;
    }
  });
  return out;
}

function decorateBody(body) {
  const content = document.createElement('div');
  content.className = 'ub-rail-body';
  const action = document.createElement('div');
  action.className = 'ub-rail-action';
  let dekDone = false;
  [...body.children].forEach((el) => {
    const link = el.matches('p') && el.querySelector('a');
    const linkOnly = link && el.textContent.trim() === link.textContent.trim();
    if (linkOnly) {
      if (!link.classList.contains('button')) link.classList.add('ub-rail-link');
      action.append(el);
    } else if (el.matches('p') && el.querySelector('br') && /\d/.test(el.textContent)) {
      el.classList.add('ub-rail-when');
      content.append(el);
    } else if (el.matches('p') && !dekDone) {
      el.classList.add('ub-rail-dek');
      dekDone = true;
      content.append(el);
    } else {
      content.append(el);
    }
  });
  if (action.children.length) content.append(action);
  return content;
}

export default function decorate(block) {
  const list = document.createElement('ul');
  list.className = 'ub-rail-list';

  [...block.children].forEach((row) => {
    const { media, body, inverse } = classify([...row.children]);
    if (!media && !body) return;
    const tile = document.createElement('li');
    tile.className = `ub-rail-tile ${inverse ? 'is-inverse' : 'is-light'}`;
    if (!list.children.length) tile.classList.add('is-featured');
    if (media) {
      const frame = document.createElement('div');
      frame.className = 'ub-rail-media';
      frame.append(media);
      const img = media.querySelector('img') || media;
      img.loading = 'lazy';
      tile.append(frame);
    }
    if (body) tile.append(decorateBody(body));
    list.append(tile);
  });

  // desktop columns: equal tiles, one per promo, at most four per row
  list.style.setProperty('--ub-tiles', String(Math.min(Math.max(list.children.length, 1), 4)));
  block.replaceChildren(list);
}
