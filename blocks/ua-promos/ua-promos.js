/**
 * ua-promos — asymmetric promo row: one wide featured tile + narrower tiles (uplift variant A).
 *
 * Content model (one row per tile — the same shape as the site's `cards promo`):
 *   [picture] [h2/h3 title, p copy…, p "when" line (date with <br>), p CTA] [optional "inverse"]
 * - The first row is the wide featured tile; its first paragraph is set as a larger dek.
 * - "inverse" tiles sit on dark art (ink scrim, white text); others keep their light art, ink text.
 * - CTA: <p><strong><a> = red primary button; a plain <p><a> = underlined text link with arrow.
 * - A paragraph with a <br> and a digit and no link is the event's date/time line.
 * Cells are classified by content, so their order may vary.
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
  content.className = 'ua-promo-body';
  const action = document.createElement('div');
  action.className = 'ua-promo-action';
  let dekDone = false;
  [...body.children].forEach((el) => {
    const link = el.matches('p') && el.querySelector('a');
    const linkOnly = link && el.textContent.trim() === link.textContent.trim();
    if (linkOnly) {
      if (!link.classList.contains('button')) link.classList.add('ua-promo-link');
      action.append(el);
    } else if (el.matches('p') && el.querySelector('br') && /\d/.test(el.textContent)) {
      el.classList.add('ua-promo-when');
      content.append(el);
    } else if (el.matches('p') && !dekDone) {
      el.classList.add('ua-promo-dek');
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
  list.className = 'ua-promos-list';

  [...block.children].forEach((row) => {
    const { media, body, inverse } = classify([...row.children]);
    if (!media && !body) return;
    const tile = document.createElement('li');
    tile.className = `ua-promo ${inverse ? 'is-inverse' : 'is-light'}`;
    if (!list.children.length) tile.classList.add('is-wide');
    if (media) {
      const frame = document.createElement('div');
      frame.className = 'ua-promo-media';
      frame.append(media);
      tile.append(frame);
    }
    if (body) tile.append(decorateBody(body));
    list.append(tile);
  });

  // the row sits in the first viewport: load its art eagerly, the featured tile first
  list.querySelectorAll('img').forEach((img, i) => {
    img.loading = 'eager';
    if (i === 0) img.fetchPriority = 'high';
  });
  block.replaceChildren(list);
}
