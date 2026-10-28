import { toClassName } from '../../scripts/aem.js';

/**
 * Fund table: responsive data table of funds (scrolls horizontally on small screens).
 * Rows: the first row is the header; every other row is a fund.
 *  - column 1: fund name (usually a link to the fund page) — sortable
 *  - column 2: ticker (searched together with the name)
 *  - other columns: plain values; a link holding only an icon (e.g. :download:) becomes
 *    an icon button labelled with the header text and fund name
 *  - header cells written in italics (`<em>Asset Class</em>`) are hidden data columns:
 *    their values become `data-<header>` attributes used by the `fund-finder` filters
 * Listens for `fund-finder:change` on `document`.
 * @param {Element} block The fund-table block element
 */
/**
 * Returns a cell's content, dropping a lone wrapping paragraph.
 * @param {Element} cell The authored cell
 * @returns {Node[]} The nodes to move into the table cell
 */
function cellContent(cell) {
  const only = cell.children.length === 1 ? cell.firstElementChild : null;
  if (only?.tagName === 'P' && only.textContent.trim() === cell.textContent.trim()) {
    return [...only.childNodes];
  }
  return [...cell.childNodes];
}

export default function decorate(block) {
  const [headRow, ...bodyRows] = [...block.children];
  if (!headRow) return;

  const headCells = [...headRow.children];
  const dataCols = new Map(); // column index → data key
  headCells.forEach((cell, i) => {
    const em = cell.querySelector('em');
    const text = cell.textContent.trim();
    if (i > 0 && em && em.textContent.trim() === text) dataCols.set(i, toClassName(text));
  });
  const visibleCount = headCells.length - dataCols.size;

  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const headTr = document.createElement('tr');
  const headLabels = [];
  headCells.forEach((cell, i) => {
    if (dataCols.has(i)) return;
    const th = document.createElement('th');
    th.scope = 'col';
    th.append(...cellContent(cell));
    headLabels[i] = th.textContent.trim();
    headTr.append(th);
  });
  thead.append(headTr);

  const tbody = document.createElement('tbody');
  const rows = bodyRows.map((row) => {
    const tr = document.createElement('tr');
    const cells = [...row.children];
    const name = cells[0]?.textContent.trim() || '';
    const ticker = cells[1]?.textContent.trim() || '';
    cells.forEach((cell, i) => {
      if (dataCols.has(i)) {
        tr.setAttribute(`data-${dataCols.get(i)}`, cell.textContent.trim().toLowerCase());
        return;
      }
      const td = document.createElement('td');
      td.append(...cellContent(cell));
      if (i === 0) td.className = 'fund-table-name';
      if (i === 1) td.className = 'fund-table-ticker';
      td.querySelectorAll('a').forEach((a) => {
        if (!a.textContent.trim() && a.querySelector('.icon')) {
          a.classList.add('fund-table-icon-link');
          a.setAttribute('aria-label', `Download ${(headLabels[i] || 'file').toLowerCase()}: ${name}`);
          a.title = a.getAttribute('aria-label');
        }
      });
      tr.append(td);
    });
    tr.dataset.search = `${name} ${ticker}`.toLowerCase();
    tbody.append(tr);
    return tr;
  });

  const empty = document.createElement('tr');
  empty.className = 'fund-table-empty';
  empty.hidden = true;
  const emptyCell = document.createElement('td');
  emptyCell.colSpan = visibleCount;
  emptyCell.textContent = 'No funds match your search. Try a different name, ticker or category.';
  empty.append(emptyCell);
  tbody.append(empty);

  table.append(thead, tbody);

  // sortable fund name column
  const sortTh = headTr.firstElementChild;
  if (sortTh && rows.length > 1) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'fund-table-sort';
    button.append(...sortTh.childNodes);
    sortTh.append(button);
    sortTh.setAttribute('aria-sort', 'none');
    button.addEventListener('click', () => {
      const dir = sortTh.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
      sortTh.setAttribute('aria-sort', dir);
      const factor = dir === 'ascending' ? 1 : -1;
      [...rows]
        .sort((a, b) => factor * a.cells[0].textContent.trim()
          .localeCompare(b.cells[0].textContent.trim(), undefined, { sensitivity: 'base' }))
        .forEach((tr) => tbody.insertBefore(tr, empty));
    });
  }

  // filtering driven by the fund-finder block
  const dataKeys = [...dataCols.values()];
  document.addEventListener('fund-finder:change', ({ detail = {} }) => {
    const query = (detail.query || '').toLowerCase();
    const filters = Object.entries(detail.filters || {})
      .filter(([key, value]) => value && dataKeys.includes(key));
    let shown = 0;
    rows.forEach((tr) => {
      const match = (!query || tr.dataset.search.includes(query))
        && filters.every(([key, value]) => tr.getAttribute(`data-${key}`) === value.toLowerCase());
      tr.hidden = !match;
      if (match) shown += 1;
    });
    empty.hidden = shown > 0;
  });

  const scroller = document.createElement('div');
  scroller.className = 'fund-table-scroll';
  scroller.tabIndex = 0;
  scroller.setAttribute('role', 'region');
  scroller.setAttribute('aria-label', 'Funds');
  scroller.append(table);
  block.replaceChildren(scroller);

  document.dispatchEvent(new CustomEvent('fund-table:ready'));
}
