/**
 * @ew-exempt <p> Source / Library rows — configuration: which index and library sheet to read
 */
import fetchIndex, { pageBlocks, pageTitle } from '../../scripts/query-index.js';

const IGNORED = new Set(['section-metadata', 'metadata', 'library-metadata']);

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== false) node.setAttribute(key, value);
  });
  node.append(...children.filter((child) => child !== null && child !== undefined));
  return node;
}

function readConfig(block) {
  const config = { source: '/query-index.json', library: '/library/blocks.json' };
  [...block.children].forEach((row) => {
    const [label, value] = [...row.children].map((cell) => cell.textContent.trim());
    const key = (label || '').toLowerCase();
    if (value && (key === 'source' || key === 'index')) config.source = value;
    if (key === 'library') config.library = value || '';
  });
  return config;
}

function humanize(name) {
  return name.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
}

function libraryNames(rows) {
  const names = new Map();
  rows.forEach((row) => {
    const id = (row.path || '').split('/').filter(Boolean).pop();
    if (id && row.name) names.set(id.toLowerCase(), row.name);
  });
  return names;
}

/**
 * Groups the index by block: pages using it, instances, options (variants) and their counts.
 */
function aggregate(rows) {
  const blocks = new Map();
  rows.forEach((row) => {
    pageBlocks(row).forEach(({ name, options }) => {
      if (IGNORED.has(name)) return;
      if (!blocks.has(name)) {
        blocks.set(name, {
          name, pages: new Map(), instances: 0, variants: new Map(),
        });
      }
      const entry = blocks.get(name);
      entry.instances += 1;
      const variant = options.join(' ') || 'default';
      entry.variants.set(variant, (entry.variants.get(variant) || 0) + 1);
      if (!entry.pages.has(row.path)) {
        entry.pages.set(row.path, { row, count: 0, variants: new Set() });
      }
      const page = entry.pages.get(row.path);
      page.count += 1;
      page.variants.add(variant);
    });
  });
  return [...blocks.values()];
}

function statTile(value, label) {
  return el('li', { class: 'block-usage-stat' }, el('strong', {}, String(value)), el('span', {}, label));
}

function renderBlock(entry, totalPages, names) {
  const pageCount = entry.pages.size;
  const share = totalPages ? Math.round((pageCount / totalPages) * 100) : 0;
  const label = names.get(entry.name) || humanize(entry.name);

  const bar = el('span', { class: 'block-usage-bar', 'aria-hidden': 'true' });
  bar.style.setProperty('--share', `${share}%`);

  const summary = el(
    'summary',
    {},
    el('span', { class: 'block-usage-name' }, label, el('code', {}, entry.name)),
    bar,
    el(
      'span',
      { class: 'block-usage-counts' },
      el('strong', {}, `${pageCount} ${pageCount === 1 ? 'page' : 'pages'}`),
      el('span', {}, ` · ${entry.instances} ${entry.instances === 1 ? 'use' : 'uses'} · ${share}% of pages`),
    ),
  );

  const variants = [...entry.variants.entries()].sort((a, b) => b[1] - a[1]);
  const variantList = el(
    'p',
    { class: 'block-usage-variants' },
    el('span', {}, 'Variants: '),
    ...variants.map(([variant, count]) => el('span', { class: 'block-usage-chip' }, `${variant} (${count})`)),
  );

  const pages = [...entry.pages.values()].sort((a, b) => a.row.path.localeCompare(b.row.path));
  const table = el(
    'table',
    {},
    el('caption', { class: 'block-usage-sr' }, `Pages using the ${label} block`),
    el('thead', {}, el('tr', {}, el('th', { scope: 'col' }, 'Page'), el('th', { scope: 'col' }, 'Variant'), el('th', { scope: 'col' }, 'Uses'))),
    el('tbody', {}, ...pages.map(({ row, count, variants: used }) => el(
      'tr',
      {},
      el('td', {}, el('a', { href: row.path }, pageTitle(row)), el('span', { class: 'block-usage-path' }, row.path)),
      el('td', {}, [...used].join(', ')),
      el('td', {}, String(count)),
    ))),
  );

  const item = el('li', { 'data-name': `${entry.name} ${label}`.toLowerCase() });
  item.append(el('details', {}, summary, el('div', { class: 'block-usage-detail' }, variantList, table)));
  return item;
}

function render(block, rows, library) {
  const entries = aggregate(rows);
  const names = libraryNames(library);
  const instances = entries.reduce((sum, entry) => sum + entry.instances, 0);
  const used = new Set(entries.map((entry) => entry.name));
  const unused = [...names.entries()].filter(([id]) => !used.has(id));

  const stats = el(
    'ul',
    { class: 'block-usage-stats' },
    statTile(rows.length, 'published pages indexed'),
    statTile(entries.length, 'different blocks in use'),
    statTile(instances, 'block instances'),
    library.length ? statTile(unused.length, 'library blocks not on a published page') : null,
  );

  const search = el('input', { type: 'search', placeholder: 'e.g. hero, cards, everviz', 'aria-describedby': 'block-usage-count' });
  const sort = el(
    'select',
    {},
    el('option', { value: 'pages' }, 'Most pages'),
    el('option', { value: 'uses' }, 'Most uses'),
    el('option', { value: 'name' }, 'A–Z'),
  );
  const count = el('p', { class: 'block-usage-count', id: 'block-usage-count', 'aria-live': 'polite' });
  const controls = el(
    'div',
    { class: 'block-usage-controls' },
    el('label', {}, el('span', {}, 'Find a block'), search),
    el('label', {}, el('span', {}, 'Sort by'), sort),
    count,
  );

  const list = el('ul', { class: 'block-usage-list' });
  const items = new Map(entries.map((entry) => [entry, renderBlock(entry, rows.length, names)]));

  const update = () => {
    const query = search.value.trim().toLowerCase();
    const order = {
      pages: (a, b) => b.pages.size - a.pages.size || b.instances - a.instances,
      uses: (a, b) => b.instances - a.instances || b.pages.size - a.pages.size,
      name: (a, b) => a.name.localeCompare(b.name),
    }[sort.value];
    const visible = [...entries].sort(order)
      .filter((entry) => items.get(entry).dataset.name.includes(query));
    list.replaceChildren(...visible.map((entry) => items.get(entry)));
    count.textContent = visible.length === entries.length
      ? `Showing all ${entries.length} blocks`
      : `Showing ${visible.length} of ${entries.length} blocks`;
  };
  search.addEventListener('input', update);
  sort.addEventListener('change', update);
  update();

  block.replaceChildren(stats, controls, list);

  if (unused.length) {
    block.append(el(
      'div',
      { class: 'block-usage-unused' },
      el('h3', {}, 'In the library, not on any published page'),
      el('p', {}, ...unused
        .sort((a, b) => a[1].localeCompare(b[1]))
        .map(([id, name]) => el('span', { class: 'block-usage-chip', title: id }, name))),
    ));
  }

  const updated = rows.reduce((max, row) => Math.max(max, Number(row.lastModified) || 0), 0);
  block.append(el(
    'p',
    { class: 'block-usage-note' },
    'Counts come from the site search index, which updates whenever a page is published. Preview-only pages and blocks inside fragments are counted on their own pages, not where they are used.',
    updated ? ` Latest page change: ${new Date(updated * 1000).toLocaleDateString(document.documentElement.lang || 'en-US', { dateStyle: 'medium' })}.` : '',
  ));
}

export default async function decorate(block) {
  const config = readConfig(block);
  block.replaceChildren(el('p', { class: 'block-usage-loading' }, 'Loading block usage…'));
  try {
    const [rows, library] = await Promise.all([
      fetchIndex(config.source),
      config.library ? fetchIndex(config.library).catch(() => []) : Promise.resolve([]),
    ]);
    render(block, rows, library);
  } catch (e) {
    block.replaceChildren(el('p', { class: 'block-usage-loading' }, 'Block usage could not be loaded right now. Please try again later.'));
  }
}
