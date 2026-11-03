/**
 * rb-directory — lobby "building directory" role router (rebrand R, index-rebrand).
 * Verde slab, split 5/7: intro copy on the left, a brass-framed board on the right whose title
 * plate is the authored eyebrow and whose ruled rows are the role links (leader rule + arrow).
 *
 * Content model (one row; cells are classified by content, not position):
 *   [eyebrow p (short ALL-CAPS, before the heading) → board title plate, h2, p copy…]
 *   [p > a role link, one per row …]
 * Link paragraphs may sit in either cell and may be plain or button-formatted; a single-cell
 * row works too. Decode tier: reconstructive (links are moved into rows, never copied).
 *
 * @param {Element} block The block element
 */
let instance = 0;

function isEyebrow(el) {
  if (!el.matches('p') || el.querySelector('a, picture, img')) return false;
  if (el.classList.contains('eyebrow')) return true;
  const text = el.textContent.trim();
  const next = el.nextElementSibling;
  return text.length > 0 && text.length <= 60 && text === text.toUpperCase()
    && /[A-Z]/.test(text) && !!next?.matches('h1, h2, h3');
}

function linkOf(el) {
  const links = el.querySelectorAll('a[href]');
  if (links.length !== 1) return null;
  return el.textContent.trim() === links[0].textContent.trim() ? links[0] : null;
}

function decorative(className, text = '') {
  const span = document.createElement('span');
  span.className = className;
  span.setAttribute('aria-hidden', 'true');
  span.textContent = text;
  return span;
}

export default function decorate(block) {
  instance += 1;
  const intro = document.createElement('div');
  intro.className = 'rb-directory-intro';
  const list = document.createElement('ul');
  list.className = 'rb-directory-list';
  let plate = null;

  const addRow = (link) => {
    const name = document.createElement('span');
    name.className = 'rb-directory-name';
    name.append(...link.childNodes);
    link.className = 'rb-directory-row';
    link.append(name, decorative('rb-directory-leader'), decorative('rb-directory-arrow', '→'));
    const item = document.createElement('li');
    item.append(link);
    list.append(item);
  };

  [...block.querySelectorAll(':scope > div > div')]
    .flatMap((cell) => [...cell.children])
    .forEach((el) => {
      const link = el.matches('p, h3, h4') ? linkOf(el) : null;
      const items = el.matches('ul, ol') ? [...el.children].map(linkOf) : [];
      if (link) {
        addRow(link);
      } else if (items.length && items.every(Boolean)) {
        items.forEach(addRow);
      } else if (!plate && isEyebrow(el)) {
        plate = el;
      } else if (el.textContent.trim() || el.querySelector('picture')) {
        intro.append(el);
      }
    });

  const children = [intro];
  if (list.children.length || plate) {
    const board = document.createElement('nav');
    board.className = 'rb-directory-board';
    if (plate) {
      plate.className = 'rb-directory-plate';
      plate.id = `rb-directory-plate-${instance}`;
      board.setAttribute('aria-labelledby', plate.id);
      board.append(plate);
    } else {
      board.setAttribute('aria-label', 'Choose your role');
    }
    board.append(list);
    children.push(board);
  }
  block.replaceChildren(...children);
}
