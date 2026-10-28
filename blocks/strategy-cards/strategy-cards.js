const MAX_RISK = 5;

/**
 * Builds the risk meter (filled dots out of five).
 * @param {number} level Risk level
 * @returns {Element}
 */
function buildRisk(level) {
  const risk = document.createElement('span');
  risk.className = 'strategy-cards-risk';
  risk.setAttribute('role', 'img');
  risk.setAttribute('aria-label', `Risk level ${level} of ${MAX_RISK}`);
  for (let i = 1; i <= MAX_RISK; i += 1) {
    const dot = document.createElement('span');
    if (i <= level) dot.className = 'filled';
    risk.append(dot);
  }
  return risk;
}

/**
 * Strategy cards: searchable, filterable strategy family cards.
 * Optional first row: [search placeholder text] (a single cell without a heading)
 * Card rows: [h3 title, p category, p tag…] [risk level 1–5] [description p, p > a link]
 * The first paragraph under the title is the category; filter chips are built from the
 * categories in card order, plus "All".
 * @param {Element} block The strategy-cards block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  let placeholder = 'Search strategies...';
  if (rows[0] && rows[0].children.length === 1 && !rows[0].querySelector('h2, h3, h4')) {
    placeholder = rows.shift().textContent.trim() || placeholder;
  }
  block.textContent = '';

  const list = document.createElement('ul');
  list.className = 'strategy-cards-list';
  const categories = [];

  rows.forEach((row) => {
    const cells = [...row.children];
    const titleCell = cells.find((cell) => cell.querySelector('h2, h3, h4')) || cells[0];
    if (!titleCell) return;
    const riskCell = cells.find((cell) => cell !== titleCell && /^\d+(\s*\/\s*\d+)?$/.test(cell.textContent.trim()));
    const bodyCell = cells.find((cell) => cell !== titleCell && cell !== riskCell);

    const li = document.createElement('li');
    li.className = 'strategy-cards-card';

    const header = document.createElement('div');
    header.className = 'strategy-cards-header';
    const titleWrap = document.createElement('div');
    const title = titleCell.querySelector('h2, h3, h4');
    let heading;
    if (title) {
      heading = document.createElement('h3');
      heading.innerHTML = title.innerHTML;
    } else {
      heading = document.createElement('h3');
      heading.textContent = titleCell.textContent.trim();
    }
    heading.className = 'strategy-cards-title';
    titleWrap.append(heading);

    const tags = [...titleCell.querySelectorAll('p')].map((p) => p.textContent.trim()).filter(Boolean);
    if (tags.length) {
      const meta = document.createElement('p');
      meta.className = 'strategy-cards-meta';
      tags.forEach((tag) => {
        const span = document.createElement('span');
        span.textContent = tag;
        meta.append(span);
      });
      titleWrap.append(meta);
    }
    header.append(titleWrap);

    if (riskCell) {
      const level = Math.min(MAX_RISK, Math.max(0, parseInt(riskCell.textContent, 10) || 0));
      header.append(buildRisk(level));
    }
    li.append(header);

    if (bodyCell) {
      bodyCell.className = 'strategy-cards-body';
      const link = bodyCell.querySelector('a');
      if (link) {
        link.className = 'strategy-cards-link';
        link.closest('p')?.classList.add('strategy-cards-link-wrapper');
        const hidden = document.createElement('span');
        hidden.className = 'strategy-cards-sr';
        hidden.textContent = ` about ${heading.textContent}`;
        link.append(hidden);
      }
      li.append(bodyCell);
    }

    const category = tags[0] || '';
    li.dataset.category = category.toLowerCase();
    const description = bodyCell?.querySelector('p:not(.strategy-cards-link-wrapper)')?.textContent || '';
    li.dataset.search = [heading.textContent, ...tags, description].join(' ').toLowerCase();
    if (category && !categories.includes(category)) categories.push(category);
    list.append(li);
  });

  // toolbar: search + category chips
  const toolbar = document.createElement('div');
  toolbar.className = 'strategy-cards-toolbar';

  const search = document.createElement('label');
  search.className = 'strategy-cards-search';
  const searchLabel = document.createElement('span');
  searchLabel.className = 'strategy-cards-sr';
  searchLabel.textContent = 'Search strategies';
  const input = document.createElement('input');
  input.type = 'search';
  input.placeholder = placeholder;
  input.autocomplete = 'off';
  search.append(searchLabel, input);

  const chips = document.createElement('div');
  chips.className = 'strategy-cards-chips';
  chips.setAttribute('role', 'group');
  chips.setAttribute('aria-label', 'Filter by category');

  const status = document.createElement('p');
  status.className = 'strategy-cards-status';
  status.setAttribute('aria-live', 'polite');

  let activeCategory = '';
  const applyFilters = () => {
    const query = input.value.trim().toLowerCase();
    let visible = 0;
    [...list.children].forEach((card) => {
      const show = (!activeCategory || card.dataset.category === activeCategory)
        && (!query || card.dataset.search.includes(query));
      card.hidden = !show;
      if (show) visible += 1;
    });
    status.textContent = visible ? '' : 'No strategies match your search.';
  };

  ['All', ...categories].forEach((name, i) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'strategy-cards-chip';
    chip.textContent = name;
    chip.dataset.category = i === 0 ? '' : name.toLowerCase();
    chip.setAttribute('aria-pressed', String(i === 0));
    chip.addEventListener('click', () => {
      activeCategory = chip.dataset.category;
      chips.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b === chip)));
      applyFilters();
    });
    chips.append(chip);
  });

  input.addEventListener('input', applyFilters);

  toolbar.append(search, chips);
  block.append(toolbar, list, status);
}
