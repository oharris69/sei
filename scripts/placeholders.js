import { getLocale } from './locale.js';

/*
 * Locale labels authored in DA: {locale}/placeholders.json (e.g. /es-us/placeholders.json), a
 * key/value sheet. English pages have no sheet and use the text built into the code.
 */

let cache;

/**
 * Loads the current locale's placeholders once per page.
 * @returns {Promise<Object<string, string>>} key → label
 */
export default function fetchPlaceholders() {
  if (cache) return cache;
  const { prefix } = getLocale();
  if (!prefix) {
    cache = Promise.resolve({});
    return cache;
  }
  const preview = window.location.pathname.startsWith('/content/') ? '/content' : '';
  cache = fetch(`${preview}${prefix}/placeholders.json`)
    .then((resp) => (resp.ok ? resp.json() : { data: [] }))
    .then((json) => Object.fromEntries((json.data || [])
      .filter((row) => row.key && row.value)
      .map((row) => [row.key.trim(), row.value])))
    .catch(() => ({}));
  return cache;
}
