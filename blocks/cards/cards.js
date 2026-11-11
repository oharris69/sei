/**
 * Cards — Experience Workspace: authored elements are MOVED into role wrappers
 * (`.cards-card-heading`, `.cards-card-subtitle`, `.cards-card-date`, `.cards-card-title`,
 * `.cards-card-cta`, `.cards-card-name`); CSS styles them through the wrapper.
 * @ew-exempt <p> `inverse` theme cell — variant selector, never displayed (metadata)
 */
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

// Wrap an AUTHORED element in a generated wrapper that carries the layout class (EW1).
function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  node.replaceWith(w);
  w.append(node);
  return w;
}

/**
 * Wraps the authored children of a text cell by role, so the styles survive the
 * editor swap (no class, child combinator or sibling combinator on authored elements).
 * @param {Element} cell The text cell
 * @param {object} opts Variant flags
 */
function wrapRoles(cell, { isPromo, isStacked, isPlain }) {
  const kids = [...cell.children];
  kids.forEach((el, i) => {
    const isCta = el.matches('p.button-wrapper');
    if (/^H[1-6]$/.test(el.tagName)) {
      wrapNode(el, 'cards-card-heading');
    } else if (isPromo && isCta) {
      wrapNode(el, 'cards-card-cta');
    } else if (isStacked && i === 0 && kids.length > 1 && el.tagName === 'P') {
      wrapNode(el, 'cards-card-date');
    } else if (isPromo && el.tagName === 'P' && !isCta && /^H[23]$/.test(kids[i - 1]?.tagName)) {
      wrapNode(el, 'cards-card-subtitle');
    } else if (isPlain && i === 0 && el.tagName === 'P' && el.querySelector(':scope > a:only-child')) {
      wrapNode(el, 'cards-card-title');
    }
  });
}

export default function decorate(block) {
  const isLeadership = block.classList.contains('leadership');
  const isStacked = block.classList.contains('stacked');
  const isPromo = block.classList.contains('promo');
  const isPlain = !isPromo && !isLeadership;
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
        const isPerson = isLeadership && textCells === 1 && cells.length > 2;
        cell.className = isPerson ? 'cards-card-person' : 'cards-card-body';
        if (isPerson) {
          if (cell.firstElementChild) wrapNode(cell.firstElementChild, 'cards-card-name');
        } else {
          wrapRoles(cell, { isPromo, isStacked, isPlain });
        }
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
    const width = isPromo ? '800' : '600';
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width }]);
    // keep the workspace image index on the visible <img> (EW1)
    if (img.dataset.imageIndex) optimized.querySelector('img').dataset.imageIndex = img.dataset.imageIndex;
    img.closest('picture').replaceWith(optimized);
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
