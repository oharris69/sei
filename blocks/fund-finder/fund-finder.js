import { toClassName } from '../../scripts/aem.js';

/**
 * Fund finder: fund search + category filters with an optional aside.
 * Drives the `fund-table` block(s) on the same page through a `fund-finder:change`
 * event on `document` (detail: `{ query, filters: { [key]: value } }`).
 * Rows (detected by content, any may be omitted):
 *  - search: [label] [placeholder]
 *  - filters (row holding lists): [label] then one cell per dropdown: [p name, ul options].
 *    The dropdown key is the slugified name (e.g. "Asset Class" → `asset-class`) and must
 *    match a hidden data column in the fund table.
 *  - aside (row with a heading or link): [h3 title, p copy, p > a link]
 * @param {Element} block The fund-finder block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  const form = document.createElement('form');
  form.className = 'fund-finder-form';
  form.setAttribute('role', 'search');
  let input;
  let aside;
  const selects = [];

  const makeLabel = (text, tag = 'p') => {
    const label = document.createElement(tag);
    label.className = 'fund-finder-label';
    label.textContent = text;
    return label;
  };

  const buildSearch = (cells) => {
    const [labelCell, placeholderCell] = cells;
    const id = 'fund-finder-search';
    const group = document.createElement('div');
    group.className = 'fund-finder-search';
    const label = makeLabel(labelCell?.textContent.trim() || 'Search funds', 'label');
    label.htmlFor = id;
    const field = document.createElement('div');
    field.className = 'fund-finder-field';
    input = document.createElement('input');
    input.type = 'search';
    input.id = id;
    input.name = 'query';
    input.autocomplete = 'off';
    input.placeholder = placeholderCell?.textContent.trim() || '';
    const button = document.createElement('button');
    button.type = 'submit';
    button.className = 'fund-finder-submit';
    button.setAttribute('aria-label', 'Search funds');
    field.append(input, button);
    group.append(label, field);
    form.append(group);
  };

  const buildFilters = (cells) => {
    const group = document.createElement('div');
    group.className = 'fund-finder-filters';
    const labelCell = cells.find((cell) => !cell.querySelector('ul, ol'));
    const labelId = 'fund-finder-filters-label';
    if (labelCell?.textContent.trim()) {
      const label = makeLabel(labelCell.textContent.trim());
      label.id = labelId;
      group.append(label);
      group.setAttribute('role', 'group');
      group.setAttribute('aria-labelledby', labelId);
    }
    const dropdowns = document.createElement('div');
    dropdowns.className = 'fund-finder-dropdowns';
    cells.filter((cell) => cell.querySelector('ul, ol')).forEach((cell) => {
      const list = cell.querySelector('ul, ol');
      const name = [...cell.children].find((el) => el !== list)?.textContent.trim()
        || `Filter ${selects.length + 1}`;
      const wrap = document.createElement('div');
      wrap.className = 'fund-finder-select';
      const select = document.createElement('select');
      select.name = toClassName(name);
      select.setAttribute('aria-label', name);
      select.append(new Option(name, ''));
      [...list.querySelectorAll(':scope > li')].forEach((li) => {
        const text = li.textContent.trim();
        if (text) select.append(new Option(text, text));
      });
      wrap.append(select);
      dropdowns.append(wrap);
      selects.push(select);
    });
    group.append(dropdowns);
    form.append(group);
  };

  rows.forEach((row) => {
    const cells = [...row.children];
    if (row.querySelector('ul, ol')) {
      buildFilters(cells);
    } else if (row.querySelector('a, h1, h2, h3, h4, h5, h6') || (input && !aside)) {
      aside = document.createElement('aside');
      aside.className = 'fund-finder-aside';
      cells.forEach((cell) => aside.append(...cell.childNodes));
      aside.querySelector('h1, h2, h3, h4, h5, h6')?.classList.add('fund-finder-aside-title');
      aside.querySelectorAll('a').forEach((a) => a.classList.add('fund-finder-aside-link'));
    } else if (!input) {
      buildSearch(cells);
    }
  });

  const emit = () => {
    const detail = {
      query: input ? input.value.trim() : '',
      filters: Object.fromEntries(selects.map((select) => [select.name, select.value])),
    };
    block.dataset.query = detail.query;
    document.dispatchEvent(new CustomEvent('fund-finder:change', { detail }));
  };

  input?.addEventListener('input', emit);
  selects.forEach((select) => select.addEventListener('change', () => {
    select.closest('.fund-finder-select').classList.toggle('is-active', !!select.value);
    emit();
  }));
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    emit();
    const table = document.querySelector('.fund-table');
    if (table) table.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // a fund table that loads later can ask for the current state
  document.addEventListener('fund-table:ready', emit);

  block.replaceChildren(form);
  if (aside) block.append(aside);
}
