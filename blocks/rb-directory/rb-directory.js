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

  // A paragraph link becomes a generated row anchor; the authored <p> moves into the row's
  // name slot and its inner anchor is unwrapped after reading the href (EW3/EW6).
  const addRow = (link) => {
    const par = link.closest('p, h3, h4');
    const row = document.createElement('a');
    [...link.attributes].forEach((attr) => {
      if (attr.name !== 'class') row.setAttribute(attr.name, attr.value);
    });
    row.className = 'rb-directory-row';
    const name = document.createElement('div');
    name.className = 'rb-directory-name';
    if (par.matches('p.button-wrapper')) par.classList.remove('button-wrapper');
    name.append(par);
    link.replaceWith(...link.childNodes);
    row.append(name, decorative('rb-directory-leader'), decorative('rb-directory-arrow', '→'));
    const item = document.createElement('li');
    item.append(row);
    list.append(item);
  };
  // An authored list of links stays the authored <ul>/<ol> (one editable unit); its
  // anchors become rows in place (inner restructuring only).
  const lists = [];
  const decorateListRow = (link) => {
    const name = document.createElement('span');
    name.className = 'rb-directory-name';
    name.append(...link.childNodes);
    link.className = 'rb-directory-row';
    link.append(name, decorative('rb-directory-leader'), decorative('rb-directory-arrow', '→'));
  };

  [...block.querySelectorAll(':scope > div > div')]
    .flatMap((cell) => [...cell.children])
    .forEach((el) => {
      const link = el.matches('p, h3, h4') ? linkOf(el) : null;
      const items = el.matches('ul, ol') ? [...el.children].map(linkOf) : [];
      if (link) {
        addRow(link);
      } else if (items.length && items.every(Boolean)) {
        items.forEach(decorateListRow);
        lists.push(el);
      } else if (!plate && isEyebrow(el)) {
        plate = document.createElement('div');
        plate.className = 'rb-directory-plate';
        plate.append(el);
      } else if (el.textContent.trim() || el.querySelector('picture')) {
        intro.append(el);
      }
    });

  const children = [intro];
  if (list.children.length || lists.length || plate) {
    const board = document.createElement('nav');
    board.className = 'rb-directory-board';
    if (plate) {
      plate.id = `rb-directory-plate-${instance}`;
      board.setAttribute('aria-labelledby', plate.id);
      board.append(plate);
    } else {
      board.setAttribute('aria-label', 'Choose your role');
    }
    if (list.children.length || !lists.length) board.append(list);
    board.append(...lists);
    children.push(board);
  }
  block.replaceChildren(...children);
}
