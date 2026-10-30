/**
 * sd-promos — three equal promo tiles that ride the hero strip (stardust redesign).
 *
 * Content model (one row per tile — same shape as the site's `cards promo`):
 *   [picture] [h3 title, p copy…, p <strong><a> CTA] [optional flag: "inverse"]
 * "inverse" tiles sit on a dark image (ink scrim, white text); others get a paper plate.
 * Schema: stardust/eds-schema/index-stardust.json § promos. Decode tier: reconstructive.
 * @ew-exempt <p> flag cell ("inverse") — text-as-metadata, never displayed
 *
 * @param {Element} block The block element
 */
const FLAG = /^\s*(inverse|dark)\s*$/i;

function classify(cells) {
  const out = { media: null, body: null, inverse: false };
  cells.forEach((cell) => {
    const text = cell.textContent.trim();
    if (!out.media && cell.querySelector('picture, img') && !cell.querySelector('h1, h2, h3, h4')) {
      out.media = cell.querySelector('picture') || cell.querySelector('img');
    } else if (FLAG.test(text) && !cell.querySelector('a, picture, img')) {
      out.inverse = true;
    } else if (text) {
      out.body = cell;
    }
  });
  return out;
}

export default function decorate(block) {
  const list = document.createElement('ul');
  list.className = 'sd-promos-list';

  [...block.children].forEach((row) => {
    const { media, body, inverse } = classify([...row.children]);
    if (!media && !body) return;
    const tile = document.createElement('li');
    tile.className = `sd-promo ${inverse ? 'is-inverse' : 'is-light'}`;
    if (media) {
      const frame = document.createElement('div');
      frame.className = 'sd-promo-media';
      frame.append(media);
      tile.append(frame);
    }
    if (body) {
      const content = document.createElement('div');
      content.className = 'sd-promo-body';
      [...body.children].forEach((el) => {
        if (el.matches('p') && el.querySelector('br') && /\d/.test(el.textContent) && !el.querySelector('a')) {
          const when = document.createElement('div');
          when.className = 'sd-promo-when';
          when.append(el);
          content.append(when);
        } else {
          content.append(el);
        }
      });
      tile.append(content);
    }
    list.append(tile);
  });

  const first = list.querySelector('img');
  if (first) {
    first.loading = 'eager';
    first.fetchPriority = 'high';
  }
  block.replaceChildren(list);
}
