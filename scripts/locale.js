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

/**
 * Pages (site paths without the locale folder) that are published in Spanish. The English/Español
 * switch links straight to the counterpart for these and to the other language's home page for the
 * rest, without probing the server (a probe logs a 404 on every page that has no counterpart).
 * Add a path here when its /es-us version goes live.
 */
const LOCALIZED_PATHS = new Set([
  '/', '/about-sei/about-sei', '/asset-managers', '/bd-breakaway', '/enterprise-ria', '/etfs',
]);

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
 * Whether a site path (without locale folder) is published in the other locales.
 * @param {string} path
 * @returns {boolean}
 */
export function isLocalized(path) {
  return LOCALIZED_PATHS.has(path);
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
 * The language to switch to from the current page: the same page in the other language when it is
 * published there (LOCALIZED_PATHS), otherwise that language's home page.
 * @returns {{locale: object, href: string}}
 */
export function getLanguageSwitch(pathname = window.location.pathname) {
  const [preview, path] = splitPreviewPrefix(pathname);
  const current = getLocale(pathname);
  const target = current.prefix ? DEFAULT_LOCALE : LOCALES[0];
  const bare = (current.prefix ? path.slice(current.prefix.length) : path).replace(/\/index$/, '/') || '/';
  const href = LOCALIZED_PATHS.has(bare) ? `${target.prefix}${bare}` : `${target.prefix}/`;
  return { locale: target, href: `${preview}${href === '/' && preview ? '/index' : href}` };
}
