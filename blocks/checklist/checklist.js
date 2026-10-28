/**
 * Checklist: bordered card with an intro and icon columns of bullet lists,
 * e.g. "Prepare for your consultation."
 * Row 1 (optional, one cell): [h2 heading, p intro]
 * Following rows: one cell per column: [p>picture icon, h3 title, ul items]
 * (several columns may share a row, or each column may sit in its own row).
 * @param {Element} block The checklist block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  const [firstRow] = rows;
  const isIntro = (row) => row && row.children.length === 1
    && row.querySelector('h1, h2') && !row.querySelector('ul, ol, picture');

  const intro = document.createElement('div');
  intro.className = 'checklist-intro';
  if (isIntro(firstRow)) {
    intro.append(...firstRow.firstElementChild.childNodes);
    rows.shift();
  }

  const columns = document.createElement('div');
  columns.className = 'checklist-columns';
  rows.forEach((row) => {
    [...row.children].forEach((cell) => {
      if (!cell.textContent.trim() && !cell.querySelector('picture')) return;
      cell.className = 'checklist-column';
      const icon = cell.querySelector('picture');
      if (icon) {
        const wrapper = icon.closest('p') || icon;
        wrapper.classList.add('checklist-icon');
        cell.prepend(wrapper);
      }
      columns.append(cell);
    });
  });
  columns.style.setProperty('--checklist-cols', Math.max(columns.children.length, 1));

  block.replaceChildren(...(intro.children.length ? [intro] : []), columns);
}
