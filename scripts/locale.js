/*
 * Site locales. English (US) lives at the site root; each other locale is a folder (e.g. /es-us)
 * filled by Experience Workspace translation projects (.da/translate). Pages in a locale folder
 * use that folder's nav and footer and declare its language.
 */

const DEFAULT_LOCALE = {
  prefix: '', lang: 'en', label: 'English', switchLabel: 'English',
};
const LOCALES = [
  {
    prefix: '/es-us', lang: 'es-US', label: 'Español', switchLabel: 'Español',
  },
];

/** The local dev server serves content under /content; keep that prefix out of locale maths. */
function splitPreviewPrefix(pathname) {
  const match = pathname.match(/^\/content(?=\/)/);
  return match ? ['/content', pathname.slice(match[0].length)] : ['', pathname];
}

/**
 * The locale of a path (defaults to the current page).
 * @param {string} [pathname]
 * @returns {{prefix: string, lang: string, label: string, switchLabel: string}}
 */
export function getLocale(pathname = window.location.pathname) {
  const [, path] = splitPreviewPrefix(pathname);
  return LOCALES.find((l) => path === l.prefix || path.startsWith(`${l.prefix}/`)) || DEFAULT_LOCALE;
}

/**
 * A site path (e.g. '/nav') inside the current page's locale folder.
 * @param {string} path
 * @returns {string}
 */
export function localizedPath(path) {
  return `${getLocale().prefix}${path}`;
}

/**
 * The language to switch to from the current page, with its counterpart URL and a fallback
 * (that locale's home page) to use when the counterpart doesn't exist.
 * @returns {{locale: object, href: string, fallback: string, probe: string}}
 */
export function getLanguageSwitch(pathname = window.location.pathname) {
  const [preview, path] = splitPreviewPrefix(pathname);
  const current = getLocale(pathname);
  const target = current.prefix ? DEFAULT_LOCALE : LOCALES[0];
  const bare = current.prefix ? path.slice(current.prefix.length) || '/' : path;
  const href = `${target.prefix}${bare}` || '/';
  const fallback = `${target.prefix}/`;
  const probePath = href.endsWith('/') ? `${href}index` : href;
  return {
    locale: target,
    href: `${preview}${href}`,
    fallback: `${preview}${fallback}`,
    probe: `${preview}${probePath}.plain.html`,
  };
}
