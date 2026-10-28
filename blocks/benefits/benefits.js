import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Benefits: two columns separated by a vertical rule
 * (e.g. "What are the key benefits of ETFs?" | "Our active approach.").
 * One row; each cell is a column:
 *  - h2 (+ optional paragraphs) → column intro
 *  - each h3 starts an item; the paragraphs after it are its copy
 *  - a picture paragraph directly before an h3 → that item's icon
 * Columns with icons render icon + text items; columns without get orange item titles.
 * @param {Element} block The benefits block element
 */
export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const columns = cells.filter((cell) => cell.textContent.trim() || cell.querySelector('picture'));

  const built = columns.map((cell) => {
    const col = document.createElement('div');
    col.className = 'benefits-col';
    const intro = document.createElement('div');
    intro.className = 'benefits-intro';
    const items = document.createElement('div');
    items.className = 'benefits-items';
    let item = null;
    let pendingIcon = null;

    const target = () => (item ? item.querySelector('.benefits-text') : intro);

    [...cell.children].forEach((el) => {
      const isIcon = el.querySelector('picture') && !el.textContent.trim();
      if (isIcon) {
        if (pendingIcon) target().append(pendingIcon);
        pendingIcon = el;
        return;
      }
      if (el.tagName === 'H3' || el.tagName === 'H4') {
        item = document.createElement('div');
        item.className = 'benefits-item';
        if (pendingIcon) {
          const icon = document.createElement('div');
          icon.className = 'benefits-icon';
          const img = pendingIcon.querySelector('img');
          icon.append(img
            ? createOptimizedPicture(img.src, img.alt, false, [{ width: '64' }])
            : pendingIcon.querySelector('picture'));
          item.append(icon);
          col.classList.add('benefits-col-icons');
          pendingIcon = null;
        }
        const text = document.createElement('div');
        text.className = 'benefits-text';
        text.append(el);
        item.append(text);
        items.append(item);
        return;
      }
      if (pendingIcon) {
        target().append(pendingIcon);
        pendingIcon = null;
      }
      target().append(el);
    });
    if (pendingIcon) target().append(pendingIcon);

    if (intro.children.length) col.append(intro);
    if (items.children.length) col.append(items);
    return col;
  });

  block.replaceChildren(...built);
  if (built.length > 1) block.classList.add('benefits-split');
}
