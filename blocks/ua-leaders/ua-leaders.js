/**
 * ua-leaders — leadership perspective cards: portrait with a paper name chip, article title and
 * summary on a cyan panel; the whole card links to the article (uplift variant A).
 * The section heading + "View all insights" link stay default content above the block; the
 * container lays them out on one row.
 *
 * Content model (one row per leader — the site's `cards leadership` cells, placed by role):
 *   [picture] [person: name (h4 or p), p role] [article: h3 <a> title, p summary]
 * Cells are classified by content (picture / heading-with-link / remaining text), so their order
 * may vary. Under 640px the cards become a horizontal swipe rail.
 * Decode tier: reconstructive (authored nodes are moved into the card frame).
 *
 * @param {Element} block The block element
 */
function slot(className, nodes) {
  const el = document.createElement('div');
  el.className = className;
  el.append(...nodes);
  return el;
}

export default function decorate(block) {
  const list = document.createElement('ul');
  list.className = 'ua-leaders-list';

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const mediaCell = cells.find((c) => c.querySelector('picture, img')
      && !c.textContent.trim());
    const articleCell = cells.find((c) => c !== mediaCell && c.querySelector('h2, h3, a'));
    const personCell = cells.find((c) => c !== mediaCell && c !== articleCell
      && c.textContent.trim());
    if (!mediaCell && !articleCell && !personCell) return;

    const card = document.createElement('li');
    card.className = 'ua-leader';
    const photo = slot('ua-leader-photo', []);
    if (mediaCell) {
      photo.append(mediaCell.querySelector('picture') || mediaCell.querySelector('img'));
    }
    if (personCell) {
      const [name, ...roles] = [...personCell.children];
      if (name) name.classList.add('ua-leader-name');
      roles.forEach((r) => r.classList.add('ua-leader-role'));
      photo.append(slot('ua-leader-id', [...personCell.children]));
    }
    card.append(photo);
    if (articleCell) {
      const link = articleCell.querySelector('a');
      if (link) link.classList.add('ua-leader-link');
      card.append(slot('ua-leader-text', [...articleCell.children]));
    }
    list.append(card);
  });

  block.replaceChildren(list);
}
