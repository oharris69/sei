/**
 * ua-case-tabs — folder-tab case studies with each tab's lead metric shown on the tab itself
 * (uplift variant A). The section heading + lede stay default content above the block; the
 * section container paints the brand field band.
 *
 * Content model (one row per case study — the same shape as the site's `tabs case-study`):
 *   [logo picture (on light), logo picture (on dark, white) — or plain label text]
 *   [story p…, p <a> link]
 *   [metric: p value, p label] [metric…]
 * The first metric also appears on the tab. A value starting with a digit or currency sign is set
 * as a numeral; anything else as a term. ARIA tabs with Arrow/Home/End keys.
 * Decode tier: reconstructive (tabs/panels are built around the moved authored nodes).
 *
 * @param {Element} block The block element
 */
let instance = 0;
const NUMERIC = /^[$€£\d]/;

function lowerFirst(text) {
  return text ? text.charAt(0).toLowerCase() + text.slice(1) : '';
}

function buildMetric(cell) {
  const metric = document.createElement('div');
  metric.className = 'ua-case-metric';
  const [value, ...rest] = [...cell.children];
  if (!value) {
    metric.textContent = cell.textContent.trim();
    return metric;
  }
  metric.classList.add(NUMERIC.test(value.textContent.trim()) ? 'is-number' : 'is-term');
  value.classList.add('ua-case-value');
  metric.append(value);
  rest.forEach((el) => el.classList.add('ua-case-label'));
  metric.append(...rest);
  return metric;
}

function tabMetric(cell) {
  const [value, label] = cell ? [...cell.children] : [];
  if (!value) return null;
  const wrap = document.createElement('span');
  wrap.className = 'ua-case-tab-metric';
  const strong = document.createElement('b');
  strong.textContent = value.textContent.trim();
  wrap.append(strong);
  if (label) wrap.append(` ${label.textContent.trim()}`);
  return { el: wrap, value: strong.textContent, label: label?.textContent.trim() || '' };
}

export default function decorate(block) {
  instance += 1;
  const tablist = document.createElement('div');
  tablist.className = 'ua-case-tablist';
  tablist.setAttribute('role', 'tablist');
  tablist.setAttribute('aria-label', 'Case studies');
  const panels = document.createElement('div');
  panels.className = 'ua-case-panels';

  const rows = [...block.children].filter((row) => row.children.length);
  rows.forEach((row, i) => {
    const [labelCell, storyCell, ...metricCells] = [...row.children];
    const tabId = `ua-case-tab-${instance}-${i}`;
    const panelId = `ua-case-panel-${instance}-${i}`;

    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'ua-case-tab';
    tab.id = tabId;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panelId);
    tab.setAttribute('aria-selected', String(i === 0));
    tab.tabIndex = i === 0 ? 0 : -1;

    const pictures = labelCell ? [...labelCell.querySelectorAll('picture')] : [];
    let name = '';
    if (pictures.length) {
      const logos = document.createElement('span');
      logos.className = 'ua-case-logos';
      pictures.slice(0, 2).forEach((pic, p) => {
        pic.classList.add(p === 0 ? 'ua-logo-on' : 'ua-logo-off');
        logos.append(pic);
      });
      if (pictures.length === 1) tab.classList.add('single-logo');
      tab.append(logos);
      name = pictures[0].querySelector('img')?.alt || '';
    } else if (labelCell) {
      const text = document.createElement('span');
      text.className = 'ua-case-tab-label';
      text.append(...labelCell.childNodes);
      tab.append(text);
      name = text.textContent.trim();
    }
    const lead = tabMetric(metricCells[0]);
    if (lead) {
      tab.append(lead.el);
      const summary = `${lead.value} ${lowerFirst(lead.label)}`.trim();
      if (name) tab.setAttribute('aria-label', `${name}: ${summary}`);
    } else if (name) {
      tab.setAttribute('aria-label', name);
    }
    tablist.append(tab);

    const panel = document.createElement('div');
    panel.className = 'ua-case-panel';
    panel.id = panelId;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tabId);
    panel.hidden = i !== 0;
    panel.style.setProperty('--ua-metrics', String(Math.max(metricCells.length, 1)));
    const story = document.createElement('div');
    story.className = 'ua-case-story';
    if (storyCell) {
      [...storyCell.children].forEach((el) => {
        const link = el.matches('p') && el.querySelector('a');
        if (link && el.textContent.trim() === link.textContent.trim()) {
          el.classList.add('ua-case-action');
          link.classList.add('ua-case-link');
        }
        story.append(el);
      });
    }
    panel.append(story);
    metricCells.forEach((cell) => panel.append(buildMetric(cell)));
    panels.append(panel);
  });

  const tabs = [...tablist.children];
  const select = (tab) => {
    tabs.forEach((t) => {
      const selected = t === tab;
      t.setAttribute('aria-selected', String(selected));
      t.tabIndex = selected ? 0 : -1;
      panels.querySelector(`#${t.getAttribute('aria-controls')}`).hidden = !selected;
    });
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', (e) => {
      let next;
      if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === 'Home') [next] = tabs;
      if (e.key === 'End') next = tabs[tabs.length - 1];
      if (next) {
        e.preventDefault();
        select(next);
        next.focus();
      }
    });
  });

  block.replaceChildren(tablist, panels);
}
