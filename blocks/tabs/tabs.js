/**
 * Tabs — Experience Workspace: panel copy is MOVED into role wrappers
 * (`.tabs-col-lead`, `.tabs-col-follow`, `.tabs-col-end`, `.tabs-caption-name`) and
 * styled through them, so it stays editable and looks the same while edited.
 * @ew-exempt <p> tab label text (cell 1) — rendered in the tab <button> (EW7)
 * @ew-exempt <p> media video link — source link, icon-only play button href/label (metadata)
 */
import { createOptimizedPicture } from '../../scripts/aem.js';

let tabsIdx = 0;

// Wrap an AUTHORED element in place in a generated wrapper that carries the class (EW1).
function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  node.replaceWith(w);
  w.append(node);
  return w;
}

/**
 * Decorates a panel cell that holds a picture and an optional caption / video link.
 * @param {Element} cell The panel cell
 */
function decorateMediaCell(cell) {
  cell.classList.add('tabs-media');
  const img = cell.querySelector('img');
  if (img) {
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '1000' }]);
    // keep the workspace image index on the visible <img> (EW1)
    if (img.dataset.imageIndex) optimized.querySelector('img').dataset.imageIndex = img.dataset.imageIndex;
    img.closest('picture').replaceWith(optimized);
  }
  const link = cell.querySelector('a');
  if (link) {
    const play = document.createElement('a');
    play.className = 'tabs-play';
    play.href = link.href;
    play.setAttribute('aria-label', link.textContent.trim() || 'Play video');
    const p = link.closest('p');
    link.remove();
    if (p && !p.textContent.trim()) p.remove();
    cell.append(play);
  }
  const caption = [...cell.children].filter((el) => !el.querySelector('picture') && !el.classList.contains('tabs-play'));
  if (caption.length) {
    const wrap = document.createElement('div');
    wrap.className = 'tabs-caption';
    caption.forEach((el) => wrap.append(el));
    cell.append(wrap);
    if (caption[0]) wrapNode(caption[0], 'tabs-caption-name');
  }
}

/**
 * Wraps a text column's authored elements by role (lead / follow-on paragraph / closing
 * paragraph) so the styles never depend on a positional selector on an authored element.
 * @param {Element} cell The panel column
 * @param {boolean} isFirst Whether this is the panel's first column
 */
function wrapColumnRoles(cell, isFirst) {
  const kids = [...cell.children];
  const last = kids[kids.length - 1];
  kids.forEach((el, i) => {
    if (!el.textContent.trim()) return;
    if (i === 0) wrapNode(el, 'tabs-col-lead');
    else if (isFirst && el === last && el.tagName === 'P') wrapNode(el, 'tabs-col-end');
    else if (el.tagName === 'P' && kids[i - 1].tagName === 'P') wrapNode(el, 'tabs-col-follow');
  });
}

/**
 * Tabs
 * Each row is a tab: [tab label] [panel column] [panel column] ...
 * The label may be text or logos: the first picture shows on the active tab,
 * an optional second picture shows on inactive tabs (e.g. a white logo).
 * Panel columns that are a picture (+ caption) render as media with an optional play button.
 * Bold (strong) label text or logos mark the tab that opens first.
 * Variants: `case-study` (dividers between stat columns)
 * @param {Element} block The tabs block element
 */
export default function decorate(block) {
  tabsIdx += 1;
  const tablist = document.createElement('div');
  tablist.className = 'tabs-list';
  tablist.setAttribute('role', 'tablist');
  const panels = document.createElement('div');
  panels.className = 'tabs-panels';

  const rows = [...block.children];
  // a tab whose label is bold opens first
  const initial = Math.max(0, rows.findIndex((row) => row.firstElementChild?.querySelector('strong')));

  rows.forEach((row, i) => {
    const [labelCell, ...panelCells] = [...row.children];
    const tabId = `tab-${tabsIdx}-${i}`;
    const panelId = `tabpanel-${tabsIdx}-${i}`;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'tabs-tab';
    button.id = tabId;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', panelId);
    button.setAttribute('aria-selected', i === initial);
    button.tabIndex = i === initial ? 0 : -1;

    const pictures = labelCell ? [...labelCell.querySelectorAll('picture')] : [];
    if (pictures.length) {
      const alt = pictures[0].querySelector('img')?.alt || labelCell.textContent.trim();
      button.setAttribute('aria-label', alt);
      pictures.forEach((pic, p) => {
        pic.classList.add(p === 0 ? 'tabs-logo-active' : 'tabs-logo-inactive');
        button.append(pic);
      });
      if (pictures.length > 1) button.classList.add('has-alt-logo');
    } else {
      button.textContent = labelCell?.textContent.trim() || `Tab ${i + 1}`;
    }
    tablist.append(button);

    const panel = document.createElement('div');
    panel.className = 'tabs-panel';
    panel.id = panelId;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tabId);
    panel.hidden = i !== initial;
    panelCells.forEach((cell, c) => {
      cell.className = 'tabs-panel-col';
      if (cell.querySelector('picture')) decorateMediaCell(cell);
      else wrapColumnRoles(cell, c === 0);
      panel.append(cell);
    });
    panel.style.setProperty('--tabs-cols', panelCells.length || 1);
    panels.append(panel);
  });

  const tabs = [...tablist.children];
  const select = (tab) => {
    tabs.forEach((t) => {
      const selected = t === tab;
      t.setAttribute('aria-selected', selected);
      t.tabIndex = selected ? 0 : -1;
      block.querySelector(`#${t.getAttribute('aria-controls')}`).hidden = !selected;
    });
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', (e) => {
      let next;
      if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (next) {
        e.preventDefault();
        select(next);
        next.focus();
      }
    });
  });

  block.replaceChildren(tablist, panels);
}
