/**
 * rb-spec-sheet — listing-sheet "Spec Rows" for scale figures (rebrand R, index-rebrand).
 * Split 5/7: headline, lede and the world map (re-toned as verde dots) on the left; a stack of
 * brass-ruled spec rows on the right. The featured row is the lead, set on a verde plate.
 *
 * Content model (rows classified by content):
 *   [h2, p lede…, optional p > picture map]   ← intro row (the one with a heading)
 *   [picture]                                 ← optional separate map row
 *   [value] [label] [optional flag: "featured"]   ← one row per figure
 * With no "featured" flag the first figure row is the lead. Decode tier: reconstructive.
 * @ew-exempt <div> flag cell ("featured") — text-as-metadata, never displayed
 *
 * @param {Element} block The block element
 */
const FLAG = /^\s*(featured|lead)\s*$/i;

function moveInto(tag, cell, className) {
  const el = document.createElement(tag);
  el.className = className;
  const only = cell.children.length === 1 && cell.firstElementChild.matches('p')
    ? cell.firstElementChild : cell;
  el.append(...only.childNodes);
  return el;
}

export default function decorate(block) {
  const intro = document.createElement('div');
  intro.className = 'rb-spec-sheet-intro';
  const list = document.createElement('dl');
  list.className = 'rb-spec-sheet-list';
  let map = null;
  const rows = [];

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (row.querySelector('h1, h2, h3, h4')) {
      cells.forEach((cell) => [...cell.children].forEach((el) => {
        const pic = el.matches('picture') ? el : el.querySelector('picture');
        if (pic && !el.textContent.trim()) {
          map = map || pic;
        } else if (el.textContent.trim()) {
          if (el.matches('p')) el.classList.add('rb-spec-sheet-lede');
          intro.append(el);
        }
      }));
      return;
    }
    const content = cells.filter((cell) => !FLAG.test(cell.textContent));
    if (content.length === 1 && content[0].querySelector('picture') && !content[0].textContent.trim()) {
      map = map || content[0].querySelector('picture');
      return;
    }
    const [value, label] = content.filter((cell) => cell.textContent.trim());
    if (!value) return;
    const item = document.createElement('div');
    item.className = 'rb-spec-sheet-row';
    item.append(moveInto('dt', value, 'rb-spec-sheet-figure'));
    if (label) item.append(moveInto('dd', label, 'rb-spec-sheet-label'));
    rows.push({ item, lead: cells.some((cell) => FLAG.test(cell.textContent)) });
  });

  const leadIndex = Math.max(0, rows.findIndex((r) => r.lead));
  rows.forEach(({ item }, i) => {
    if (i === leadIndex) {
      item.classList.add('is-lead');
      list.prepend(item);
    } else {
      list.append(item);
    }
  });

  if (map) {
    const frame = document.createElement('div');
    frame.className = 'rb-spec-sheet-map';
    const img = map.querySelector('img');
    if (img && !img.getAttribute('alt')) img.setAttribute('alt', '');
    frame.append(map);
    intro.append(frame);
  }
  block.replaceChildren(intro, list);
}
