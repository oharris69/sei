import { createOptimizedPicture } from '../../scripts/aem.js';

const THEMES = ['inverse'];

/**
 * Cards
 * Each row is a card. Cells:
 *  - picture-only cell → card image (background art for `promo`, photo for `leadership`)
 *  - text cells → card body; for `leadership` the first text cell is the person (name, role)
 *    and the second is the topic (title, summary, optional link)
 *  - optional single-word cell `inverse` → white text on dark art
 * Variants: `promo`, `leadership`, `promo expand` (desktop accordion: the active tile widens
 * and shows its copy, the others narrow to their title)
 * @param {Element} block The cards block element
 */
export default function decorate(block) {
  const isLeadership = block.classList.contains('leadership');
  const isStacked = block.classList.contains('stacked');
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    const cells = [...row.children];
    let textCells = 0;

    cells.forEach((cell) => {
      const text = cell.textContent.trim().toLowerCase();
      if (THEMES.includes(text) && !cell.querySelector('picture')) {
        li.classList.add(`cards-card-${text}`);
        return;
      }
      if (cell.children.length === 1 && cell.querySelector('picture') && !cell.textContent.trim()) {
        cell.className = 'cards-card-image';
      } else {
        textCells += 1;
        cell.className = isLeadership && textCells === 1 && cells.length > 2
          ? 'cards-card-person'
          : 'cards-card-body';
      }
      li.append(cell);
    });

    // a card with a single link becomes clickable as a whole
    const links = li.querySelectorAll('a');
    if ((isLeadership || isStacked) && links.length === 1) {
      li.classList.add('cards-card-linked');
      links[0].classList.add('cards-card-link');
    }

    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const width = block.classList.contains('promo') ? '800' : '600';
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width }]));
  });

  block.replaceChildren(ul);
  // eslint-disable-next-line no-use-before-define
  if (block.classList.contains('expand')) expandTiles(ul);
}

/**
 * Accordion behaviour for `promo expand`: hovering, focusing or tapping a tile makes it the
 * active (wide) one. Copy in narrow tiles stays in the tab order, so focusing it expands the tile.
 * @param {Element} ul The card list
 */
function expandTiles(ul) {
  const tiles = [...ul.children];
  const activate = (tile) => {
    tiles.forEach((t) => t.classList.toggle('is-active', t === tile));
  };
  tiles.forEach((tile) => {
    tile.addEventListener('mouseenter', () => activate(tile));
    tile.addEventListener('focusin', () => activate(tile));
    tile.addEventListener('click', (e) => {
      if (!tile.classList.contains('is-active')) {
        e.preventDefault();
        activate(tile);
      }
    });
  });
  activate(tiles[0]);
}
