/*
 * Site search index (/query-index.json), defined in the site configuration (content/query.yaml).
 * One row per published page: path, title, description, image, template, tags, robots,
 * lastModified and blocks (one entry per block on the page: [name, ...options]).
 */

const PAGE_SIZE = 500;
const cache = new Map();

function loadPage(source, offset, rows) {
  const url = new URL(source, window.location.href);
  url.searchParams.set('offset', offset);
  url.searchParams.set('limit', PAGE_SIZE);
  return fetch(url)
    .then((resp) => {
      if (!resp.ok) throw new Error(`${source}: ${resp.status}`);
      return resp.json();
    })
    .then((json) => {
      const data = json.data || [];
      rows.push(...data);
      const next = offset + data.length;
      if (data.length && next < (json.total || 0)) return loadPage(source, next, rows);
      return rows;
    });
}

/**
 * Loads every row of a sheet-style index once per page (all pages of results).
 * @param {string} [source] index URL, defaults to the site index
 * @returns {Promise<Object[]>} rows
 */
export default function fetchIndex(source = '/query-index.json') {
  if (!cache.has(source)) cache.set(source, loadPage(source, 0, []));
  return cache.get(source);
}

/**
 * The blocks on an indexed page as { name, options } (accepts [name, ...] or "name opt").
 */
export function pageBlocks(row) {
  let list = row.blocks || [];
  if (typeof list === 'string') {
    try {
      list = JSON.parse(list);
    } catch (e) {
      list = list.split(',');
    }
  }
  return list
    .map((entry) => (Array.isArray(entry) ? entry : String(entry || '').trim().split(/\s+/)))
    .filter((classes) => classes[0])
    .map(([name, ...options]) => ({ name, options }));
}

/**
 * Page title without the site suffix ("About SEI | SEI", "… | SEI demo" → "About SEI").
 */
export function pageTitle(row) {
  const title = (row.title || '')
    .replace(/\s*\|\s*SEI\b[^|]*$/i, '')
    .replace(/^SEI\s*\|\s*(?=\S)/i, '')
    .trim();
  if (title) return title;
  const last = row.path.split('/').filter(Boolean).pop();
  return last ? last.replace(/-/g, ' ') : 'Home';
}

/**
 * Date of a lastModified value (seconds since 1970), or null.
 */
export function pageDate(row) {
  const seconds = Number(row.lastModified);
  return seconds ? new Date(seconds * 1000) : null;
}
