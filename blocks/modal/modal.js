// eslint-disable-next-line import/no-cycle
import { loadFragment } from '../fragment/fragment.js';
import { loadCSS } from '../../scripts/aem.js';

/*
 * Modal
 * Not authored as a block: any link to /modals/<name> opens the fragment at that path in a dialog.
 * The dialog gets a `modal-<name>` class so a fragment can be sized/positioned per pop-up;
 * fragments whose name starts with `assistant` dock to the bottom-right as a chat panel.
 */

const dialogs = new Map();

/**
 * Normalises a modal link to the fragment path, e.g. /modals/schedule-eric-dunn
 * @param {string} href Link href or path
 * @returns {string} The modal fragment path
 */
export function getModalPath(href) {
  const { pathname } = new URL(href, window.location);
  return pathname.replace(/^\/content(?=\/modals\/)/, '').replace(/\.html$/, '');
}

function lockScroll(locked) {
  document.body.classList.toggle('modal-open', locked);
}

/**
 * Builds (or reuses) the dialog for a modal fragment.
 * @param {string} path The modal fragment path
 * @returns {Promise<HTMLDialogElement|null>} The dialog
 */
async function getDialog(path) {
  if (dialogs.has(path)) return dialogs.get(path);

  await loadCSS(`${window.hlx.codeBasePath}/blocks/modal/modal.css`);
  const fragment = await loadFragment(path);
  if (!fragment) return null;

  const name = path.split('/').pop();
  const dialog = document.createElement('dialog');
  dialog.className = `modal modal-${name}`;
  if (name.startsWith('assistant')) dialog.classList.add('modal-docked');
  dialog.setAttribute('aria-modal', 'true');

  const heading = fragment.querySelector('h1, h2, h3');
  if (heading) {
    heading.id = heading.id || `modal-title-${name}`;
    dialog.setAttribute('aria-labelledby', heading.id);
  }

  const content = document.createElement('div');
  content.className = 'modal-content';
  content.append(...fragment.childNodes);

  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'modal-close';
  close.setAttribute('aria-label', 'Close');
  close.addEventListener('click', () => dialog.close());

  dialog.append(close, content);

  // close on backdrop click
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => lockScroll(false));
  // non-modal (docked) dialogs don't get Escape handling for free
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dialog.open) dialog.close();
  });
  // let content inside the modal close it, e.g. the scheduler's "Done" button
  dialog.addEventListener('modal:close', () => dialog.close());

  document.body.append(dialog);
  dialogs.set(path, dialog);
  return dialog;
}

/**
 * Opens the modal for a /modals/ link or path.
 * @param {string} href Link href or path
 */
export async function openModal(href) {
  const path = getModalPath(href);
  const dialog = await getDialog(path);
  if (!dialog || dialog.open) return;
  if (dialog.classList.contains('modal-docked')) dialog.show();
  else dialog.showModal();
  lockScroll(!dialog.classList.contains('modal-docked'));
  dialog.dispatchEvent(new CustomEvent('modal:open'));
  const focusTarget = dialog.querySelector('[autofocus], input, .modal-content button, .modal-content a');
  if (focusTarget && dialog.classList.contains('modal-docked')) focusTarget.focus();
}

/**
 * Makes every /modals/ link on the page open its modal instead of navigating.
 * @param {Document} doc The document
 */
export function autolinkModals(doc) {
  doc.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
    let url;
    try {
      url = new URL(link.href, window.location);
    } catch {
      return;
    }
    if (url.origin !== window.location.origin || !/^(\/content)?\/modals\//.test(url.pathname)) return;
    e.preventDefault();
    openModal(url.href);
  });
}

/**
 * Opens a modal automatically after a delay, once per browser session.
 * @param {string} href The modal path
 * @param {number} delaySeconds Delay before opening
 */
export function scheduleModal(href, delaySeconds = 8) {
  const path = getModalPath(href);
  const key = `sei-modal-shown:${path}`;
  try {
    if (sessionStorage.getItem(key)) return;
  } catch { /* storage unavailable */ }
  setTimeout(() => {
    if (document.querySelector('dialog.modal[open]')) return;
    openModal(path);
    try {
      sessionStorage.setItem(key, '1');
    } catch { /* storage unavailable */ }
  }, Math.max(0, delaySeconds) * 1000);
}
