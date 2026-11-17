/**
 * @ew-exempt <p> Source / Root rows — configuration: which index and which folder to draw
 */
import fetchIndex, { pageBlocks, pageDate, pageTitle } from '../../scripts/query-index.js';

let uid = 0;

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== false) node.setAttribute(key, value);
  });
  node.append(...children.filter((child) => child !== null && child !== undefined));
  return node;
}

function readConfig(block) {
  const config = { source: '/query-index.json', root: '/' };
  [...block.children].forEach((row) => {
    const [label, value] = [...row.children].map((cell) => cell.textContent.trim());
    const key = (label || '').toLowerCase();
    if (value && (key === 'source' || key === 'index')) config.source = value;
    if (value && (key === 'root' || key === 'folder')) config.root = `/${value.replace(/^\/+|\/+$/g, '')}`;
  });
  return config;
}

function segmentsOf(path) {
  return path.split('/').filter(Boolean);
}

function humanize(segment) {
  return segment.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
}

/**
 * Builds the folder tree from page paths; folders without their own page are kept as labels.
 */
function buildTree(rows, root) {
  const base = segmentsOf(root);
  const top = {
    segment: base[base.length - 1] || '', path: root, children: new Map(), row: null,
  };
  rows.forEach((row) => {
    const segments = segmentsOf(row.path);
    if (base.some((segment, i) => segments[i] !== segment)) return;
    let node = top;
    segments.slice(base.length).forEach((segment) => {
      if (!node.children.has(segment)) {
        node.children.set(segment, {
          segment,
          path: `${node.path.replace(/\/$/, '')}/${segment}`,
          children: new Map(),
          row: null,
        });
      }
      node = node.children.get(segment);
    });
    node.row = row;
  });
  return top;
}

function countPages(node) {
  return [...node.children.values()]
    .reduce((sum, child) => sum + countPages(child), node.row ? 1 : 0);
}

/**
 * Label of a node: its page title; for a folder without a page, the title of its
 * same-named child page (/about-sei/about-sei), else the folder name; "Home" for the site root.
 */
function nodeLabel(node) {
  if (node.row && node.row.path === '/') return 'Home';
  if (node.row) return pageTitle(node.row);
  const namesake = node.children.get(node.segment);
  if (namesake && namesake.row) return pageTitle(namesake.row);
  return humanize(node.segment || 'Home');
}

function sortedChildren(node) {
  const label = nodeLabel;
  return [...node.children.values()].sort((a, b) => (b.children.size > 0) - (a.children.size > 0)
    || label(a).localeCompare(label(b)));
}

function card(node, dateFormat) {
  const { row } = node;
  const title = nodeLabel(node);
  const pages = countPages(node) - (row ? 1 : 0);
  const meta = [];
  if (row) {
    const blocks = pageBlocks(row).length;
    meta.push(`${blocks} ${blocks === 1 ? 'block' : 'blocks'}`);
    const date = pageDate(row);
    if (date) meta.push(`updated ${dateFormat.format(date)}`);
  } else {
    meta.push('folder (no page of its own)');
  }
  if (pages) meta.push(`${pages} ${pages === 1 ? 'page' : 'pages'} below`);

  return el(
    'div',
    { class: `visual-sitemap-card${row ? '' : ' is-folder'}` },
    row ? el('a', { href: row.path, class: 'visual-sitemap-title' }, title) : el('span', { class: 'visual-sitemap-title' }, title),
    el('span', { class: 'visual-sitemap-path' }, row ? row.path : `${node.path}/`),
    el('span', { class: 'visual-sitemap-meta' }, meta.join(' · ')),
  );
}

function renderNode(node, dateFormat) {
  const children = sortedChildren(node);
  const item = el('li', { class: 'visual-sitemap-node' });
  const title = nodeLabel(node);
  item.dataset.search = `${title} ${node.path}`.toLowerCase();
  const head = el('div', { class: 'visual-sitemap-head' });

  if (children.length) {
    uid += 1;
    const id = `visual-sitemap-branch-${uid}`;
    const toggle = el('button', {
      type: 'button',
      class: 'visual-sitemap-toggle',
      'aria-expanded': 'true',
      'aria-controls': id,
      'aria-label': `Hide pages under ${title}`,
    });
    const branch = el('ul', { id, class: 'visual-sitemap-branch' }, ...children.map((child) => renderNode(child, dateFormat)));
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', open);
      toggle.setAttribute('aria-label', `${open ? 'Hide' : 'Show'} pages under ${title}`);
      branch.hidden = !open;
    });
    head.append(toggle, card(node, dateFormat));
    item.append(head, branch);
  } else {
    head.append(card(node, dateFormat));
    item.append(head);
  }
  return item;
}

function setAll(block, open) {
  block.querySelectorAll('.visual-sitemap-toggle').forEach((toggle) => {
    if ((toggle.getAttribute('aria-expanded') === 'true') !== open) toggle.click();
  });
}

/**
 * Shows matching pages and their parents; returns whether the node or a descendant matched.
 */
function filterNode(item, query) {
  const branch = item.querySelector(':scope > .visual-sitemap-branch');
  const childMatch = branch
    ? [...branch.children].map((child) => filterNode(child, query)).some(Boolean)
    : false;
  const selfMatch = !query || item.dataset.search.includes(query);
  item.hidden = !(selfMatch || childMatch);
  item.classList.toggle('is-match', Boolean(query) && selfMatch);
  if (query && childMatch) {
    const toggle = item.querySelector(':scope > .visual-sitemap-head > .visual-sitemap-toggle');
    if (toggle && toggle.getAttribute('aria-expanded') !== 'true') toggle.click();
  }
  return selfMatch || childMatch;
}

function render(block, rows, config) {
  const tree = buildTree(rows, config.root);
  const dateFormat = new Intl.DateTimeFormat(document.documentElement.lang || 'en-US', { dateStyle: 'medium' });
  const total = countPages(tree);
  const sections = sortedChildren(tree);
  const folders = sections.filter((node) => node.children.size).length;

  const search = el('input', { type: 'search', placeholder: 'Find a page by title or path' });
  const expand = el('button', { type: 'button', class: 'button secondary' }, 'Expand all');
  const collapse = el('button', { type: 'button', class: 'button secondary' }, 'Collapse all');
  const status = el('p', { class: 'visual-sitemap-status', 'aria-live': 'polite' });
  const summary = `${total} published ${total === 1 ? 'page' : 'pages'} · ${sections.length} top-level items · ${folders} sections with pages below`;
  status.textContent = summary;

  const toolbar = el(
    'div',
    { class: 'visual-sitemap-toolbar' },
    el('label', {}, el('span', {}, 'Find a page'), search),
    el('div', { class: 'visual-sitemap-actions' }, expand, collapse),
    status,
  );

  const rootCard = el('div', { class: 'visual-sitemap-root' }, card(tree, dateFormat));
  const board = el('ul', { class: 'visual-sitemap-board' }, ...sections.map((node) => renderNode(node, dateFormat)));

  expand.addEventListener('click', () => setAll(board, true));
  collapse.addEventListener('click', () => setAll(board, false));
  search.addEventListener('input', () => {
    const query = search.value.trim().toLowerCase();
    const matches = [...board.children].map((item) => filterNode(item, query));
    const found = board.querySelectorAll('.is-match').length;
    status.textContent = query
      ? `${found} ${found === 1 ? 'page matches' : 'pages match'} “${search.value.trim()}”`
      : summary;
    board.classList.toggle('is-empty', query && !matches.some(Boolean));
  });

  block.replaceChildren(toolbar, rootCard, board);
}

export default async function decorate(block) {
  const config = readConfig(block);
  block.replaceChildren(el('p', { class: 'visual-sitemap-status' }, 'Loading the sitemap…'));
  try {
    const rows = await fetchIndex(config.source);
    render(block, rows, config);
  } catch (e) {
    block.replaceChildren(el('p', { class: 'visual-sitemap-status' }, 'The sitemap could not be loaded right now. Please try again later.'));
  }
}
