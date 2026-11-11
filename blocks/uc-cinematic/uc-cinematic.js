/**
 * @ew-exempt <p> register name cell (kinetic-display) — config, never displayed
 */
import { loadCSS, loadScript } from '../../scripts/aem.js';

/**
 * uc-cinematic — page-level "kinetic-display" motion layer for uplift variant C
 * (index-uplift-c). It renders nothing itself: it adds runtime hooks (classes, custom
 * properties) to the page's decorated `ua-*` blocks and section headings and animates them.
 *
 * Content model: one optional cell naming the register (`kinetic-display`, the only one).
 * Author it in the first section, after `ua-hero`, so the hero hooks are in place before that
 * section is first shown (EDS keeps a section hidden until all of its blocks are decorated).
 *
 * Static layer (uc-cinematic.css, applies even if this script fails): variant C's layout
 * deltas from A — full-bleed hero field with three offset bars (lede on its own bar), every
 * section h2 set on its own bar with 2px cyan hairlines, stats as stacked numeral bars.
 *
 * Motion layer (this script; gated on `html.uc-motion`, which is only set when motion is
 * allowed and IntersectionObserver exists — no JS / reduced motion = static page):
 * - hero (load, once): the field wipes in R→L (900ms), each bar wipes in L→R (clip-path,
 *   800ms expo, 240ms + 110ms stagger) and its text rises out of the bar (700ms, +200ms).
 * - section heads (IO): the bar draws L→R (scaleX, 800ms expo), the hairlines appear (500ms
 *   delay) and the words wipe in (clip-path + 40% rise, 600ms, 120ms + 50ms per word).
 * - stats (IO): each row's cyan rule draws L→R (800ms) and its numeral wipes in along it
 *   (700ms, 160ms delay). Figures always show their true value (no count-up / split-flap).
 * - cards (IO, one-shot): promo tiles, role cards, the statement ring, the case-study tabs and
 *   leader cards wipe in L→R (clip-path, 640ms expo, 110ms stagger among siblings).
 * - case-study tab change: the newly shown panel wipes in (320ms).
 * Every hook is removed once its reveal ends, so the settled page is the static page.
 * Late sections: EDS loads sections lazily, so a MutationObserver on `data-section-status`
 * hooks each section when it turns `loaded` (before it is painted). Elements already scrolled
 * past are left static. `prefers-reduced-motion: reduce` (also when it changes mid-visit),
 * print and a missing IntersectionObserver all leave or force everything visible.
 *
 * Smooth scroll: Lenis (MIT, vendored in this folder) boots after the page `load` event, never
 * blocks early native scrolling, leaves anchors/keyboard/programmatic scrolling native, and
 * ignores wheel/touch inside the header, dialogs (SEI Assistant chat, modals), form fields and
 * any nested scroller (`prevent` + `allowNestedScroll`); it stops while a modal locks the page.
 * If Lenis fails to load, scrolling stays native and every reveal still runs.
 *
 * @param {Element} block The block element
 */
const BASE = `${window.hlx?.codeBasePath || ''}/blocks/uc-cinematic`;
const ROOT = document.documentElement;
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)');

const HEADS = [
  'main > .section > .default-content-wrapper > h2',
  '.ua-role-panel-intro > h2',
  '.ua-statement-text > h2',
  '.ua-newsletter-copy > h2',
].join(', ');
const ROWS = '.ua-stat';
const RISERS = [
  '.ua-promo',
  '.ua-role-panel-choices li',
  '.ua-statement-media',
  '.ua-case-tabs',
  '.ua-leader',
].join(', ');
const LENIS_PREVENT = [
  'header', 'dialog', '[role="dialog"]', '[aria-modal="true"]', '.assistant',
  'textarea', 'select', '[data-lenis-prevent]',
].join(', ');

const ENTER = 800;
const STAGGER = 110;
const WORD_STAGGER = 50;

let observer = null;
const pending = new Map(); // observed element -> hooked elements revealed with it

const motionOn = () => ROOT.classList.contains('uc-motion');

function scrolledPast(el) {
  return el.getBoundingClientRect().bottom < 0;
}

/** Removes an element's hooks once its reveal has finished: the static state takes over. */
function settle(el, hooks, after) {
  window.setTimeout(() => el.classList.remove(...hooks, 'is-in'), after);
}

function reveal(el) {
  el.classList.add('is-in');
  if (el.classList.contains('uc-head')) {
    const words = el.querySelectorAll('.uc-word').length;
    settle(el, ['uc-head'], Math.max(ENTER, 120 + words * WORD_STAGGER + 600) + 100);
  } else if (el.classList.contains('uc-srow')) {
    settle(el, ['uc-srow'], ENTER + 160);
  } else if (el.classList.contains('uc-rise')) {
    const k = Number(el.style.getPropertyValue('--uc-k')) || 0;
    settle(el, ['uc-rise'], k * STAGGER + 740);
  }
}

function watch(target, el) {
  if (!observer) return;
  if (!pending.has(target)) {
    pending.set(target, []);
    observer.observe(target);
  }
  pending.get(target).push(el);
}

function onIntersect(entries) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    observer.unobserve(entry.target);
    (pending.get(entry.target) || []).forEach(reveal);
    pending.delete(entry.target);
  });
}

/** Wraps each word of a heading in a span (inline markup such as <em> is kept). */
function splitWords(heading) {
  let index = 0;
  const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
  const texts = [];
  while (walker.nextNode()) texts.push(walker.currentNode);
  texts.forEach((text) => {
    const parts = text.textContent.split(/(\s+)/);
    if (!parts.some((p) => p.trim())) return;
    const frag = document.createDocumentFragment();
    parts.forEach((part) => {
      if (!part) return;
      if (!part.trim()) {
        frag.append(part);
        return;
      }
      const word = document.createElement('span');
      word.className = 'uc-word';
      word.style.setProperty('--uc-w', index);
      index += 1;
      word.textContent = part;
      frag.append(word);
    });
    text.replaceWith(frag);
  });
}

function hookHeads(scope) {
  scope.querySelectorAll(HEADS).forEach((h) => {
    if (h.dataset.ucHooked || !h.closest('main') || scrolledPast(h)) return;
    h.dataset.ucHooked = 'head';
    if (!h.querySelector('.uc-word')) splitWords(h);
    h.classList.add('uc-head');
    watch(h, h);
  });
}

function hookRows(scope) {
  scope.querySelectorAll(ROWS).forEach((row) => {
    if (row.dataset.ucHooked || scrolledPast(row)) return;
    const value = row.querySelector('.ua-stat-value');
    if (!value) return;
    row.dataset.ucHooked = 'row';
    let numeral = value.querySelector(':scope > p');
    if (!numeral) {
      numeral = document.createElement('span');
      numeral.append(...value.childNodes);
      value.append(numeral);
    }
    numeral.classList.add('uc-nm');
    row.classList.add('uc-srow');
    watch(row, row);
  });
}

function hookRisers(scope) {
  scope.querySelectorAll(RISERS).forEach((el) => {
    if (el.dataset.ucHooked || scrolledPast(el)) return;
    el.dataset.ucHooked = 'rise';
    const siblings = [...el.parentElement.children].filter((s) => s.matches(RISERS));
    el.style.setProperty('--uc-k', Math.max(0, siblings.indexOf(el)));
    el.classList.add('uc-rise');
    // clip-path empties an element's intersection rect: observe the unclipped parent
    watch(el.parentElement, el);
  });
}

/** One load moment: only hooked while the hero's section has not been painted yet. */
function hookHero(section) {
  const hero = section.querySelector('.ua-hero');
  if (!hero || section.dataset.ucHero) return;
  section.dataset.ucHero = 'seen';
  if (section.dataset.sectionStatus === 'loaded' && !section.dataset.ucFresh) return;
  const bars = [...hero.querySelectorAll('.ua-hero-bar, .ua-hero-lede p')];
  bars.forEach((bar, i) => {
    const text = document.createElement('span');
    text.className = 'uc-bt';
    text.append(...bar.childNodes);
    bar.append(text);
    bar.classList.add('uc-bar');
    bar.style.setProperty('--uc-i', i);
  });
  section.classList.add('uc-hero');
  const last = (bars.length - 1) * STAGGER;
  window.setTimeout(() => {
    section.classList.remove('uc-hero');
    bars.forEach((bar) => bar.classList.remove('uc-bar'));
  }, Math.max(900, 440 + last + 700) + 150);
}

/** Re-runs the wipe on the case-study panel that a tab change reveals. */
function hookTabs(scope) {
  scope.querySelectorAll('.ua-case-panels').forEach((panels) => {
    if (panels.dataset.ucHooked) return;
    panels.dataset.ucHooked = 'tabs';
    new MutationObserver((records) => {
      if (!motionOn()) return;
      records.forEach(({ target }) => {
        if (target.hidden || !target.matches('.ua-case-panel')) return;
        target.classList.remove('uc-swap');
        target.getBoundingClientRect(); // restart the animation
        target.classList.add('uc-swap');
        target.addEventListener('animationend', () => target.classList.remove('uc-swap'), {
          once: true,
        });
      });
    }).observe(panels, { subtree: true, attributes: true, attributeFilter: ['hidden'] });
  });
}

function hookSection(section) {
  if (!motionOn()) return;
  hookHero(section);
  hookHeads(section);
  hookRows(section);
  hookRisers(section);
  hookTabs(section);
}

/** Forces every pending reveal to its final state (reduced motion switched on, print). */
function revealAll() {
  pending.forEach((els, target) => {
    observer?.unobserve(target);
    els.forEach((el) => el.classList.remove('uc-head', 'uc-srow', 'uc-rise'));
  });
  pending.clear();
  document.querySelectorAll('.uc-hero').forEach((s) => s.classList.remove('uc-hero'));
  document.querySelectorAll('.uc-bar').forEach((b) => b.classList.remove('uc-bar'));
}

let lenis = null;

function syncLenisLock() {
  if (!lenis) return;
  const locked = document.body.classList.contains('modal-open')
    || !!document.querySelector('dialog[open]:modal');
  if (locked) lenis.stop();
  else lenis.start();
}

async function bootLenis() {
  if (REDUCED.matches || lenis) return;
  try {
    await Promise.all([
      loadCSS(`${BASE}/lenis.min.css`),
      loadScript(`${BASE}/lenis.min.js`),
    ]);
    if (typeof window.Lenis !== 'function' || REDUCED.matches) return;
    lenis = new window.Lenis({
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: false,
      anchors: false,
      autoRaf: true,
      allowNestedScroll: true,
      prevent: (node) => node.matches?.(LENIS_PREVENT),
    });
    // stardust motion-validation contract (Pass 6a) looks for window.__lenis
    // eslint-disable-next-line no-underscore-dangle
    window.__lenis = lenis;
    new MutationObserver(syncLenisLock)
      .observe(document.body, { attributes: true, attributeFilter: ['class'] });
    syncLenisLock();
  } catch {
    lenis = null; // native scrolling stays in place
  }
}

function stopMotion() {
  ROOT.classList.remove('uc-motion');
  revealAll();
  if (lenis) {
    lenis.stop(); // ends any in-flight smooth scroll, which would re-add its classes later
    lenis.destroy();
    lenis = null;
    // eslint-disable-next-line no-underscore-dangle
    delete window.__lenis;
  }
}

export default function decorate(block) {
  block.textContent = '';
  block.setAttribute('aria-hidden', 'true');
  if (ROOT.dataset.ucCinematic) return; // one motion layer per page
  ROOT.dataset.ucCinematic = 'kinetic-display';

  const main = block.closest('main') || document.querySelector('main');
  if (!main || REDUCED.matches || !('IntersectionObserver' in window)) return;

  ROOT.classList.add('uc-motion');
  observer = new IntersectionObserver(onIntersect, {
    threshold: 0,
    rootMargin: '0px 0px -6% 0px',
  });

  // the block's own section is still hidden here, so its hero can take the load animation
  const own = block.closest('.section');
  if (own) own.dataset.ucFresh = 'true';
  main.querySelectorAll('.section').forEach((section) => {
    if (section === own || section.dataset.sectionStatus === 'loaded') hookSection(section);
  });
  if (own) delete own.dataset.ucFresh;

  // sections decorated later: hook each one as it turns `loaded`, before it is painted
  new MutationObserver((records) => {
    records.forEach(({ target }) => {
      if (target.dataset.sectionStatus !== 'loaded') return;
      target.dataset.ucFresh = 'true';
      hookSection(target);
      delete target.dataset.ucFresh;
    });
  }).observe(main, { subtree: true, attributes: true, attributeFilter: ['data-section-status'] });

  REDUCED.addEventListener('change', (e) => {
    if (e.matches) stopMotion();
  });
  window.addEventListener('beforeprint', revealAll);

  const boot = () => window.setTimeout(bootLenis, 0);
  if (document.readyState === 'complete') boot();
  else window.addEventListener('load', boot, { once: true });
}
