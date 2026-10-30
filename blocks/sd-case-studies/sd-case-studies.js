/**
 * sd-case-studies — folder-tab case-study switcher on the brand field (stardust redesign).
 * The section's heading + lede stay default content above the block (styled via the container).
 *
 * Content model (one row per case study — same shape as the site's `tabs case-study`):
 *   [logo picture (active), logo picture (inactive, white)] [story p…, p link] [metric] [metric]
 * Each metric cell: p value, p label. A value starting with a digit or currency sign is set as a
 * numeral; anything else as a term.
 * Schema: stardust/eds-schema/index-stardust.json § proof. Decode tier: reconstructive.
 *
 * @param {Element} block The block element
 */
let instance = 0;

function buildMetric(cell) {
  const metric = document.createElement('div');
  metric.className = 'sd-case-metric';
  const [value, ...rest] = [...cell.children];
  const isNumber = value && /^[$€£\d]/.test(value.textContent.trim());
  metric.classList.add(isNumber ? 'is-number' : 'is-term');
  if (value) {
    const valueWrap = document.createElement('div');
    valueWrap.className = 'sd-case-value';
    valueWrap.append(value);
    metric.append(valueWrap);
  }
  if (rest.length) {
    const labelWrap = document.createElement('div');
    labelWrap.className = 'sd-case-label';
    labelWrap.append(...rest);
    metric.append(labelWrap);
  }
  return metric;
}

export default function decorate(block) {
  instance += 1;
  const rail = document.createElement('div');
  rail.className = 'sd-case-rail';
  rail.setAttribute('role', 'tablist');
  rail.setAttribute('aria-label', 'Case studies');
  const panels = document.createElement('div');
  panels.className = 'sd-case-panels';

  const rows = [...block.children].filter((row) => row.children.length);
  rows.forEach((row, i) => {
    const [labelCell, storyCell, ...metricCells] = [...row.children];
    const tabId = `sd-case-tab-${instance}-${i}`;
    const panelId = `sd-case-panel-${instance}-${i}`;

    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'sd-case-tab';
    tab.id = tabId;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panelId);
    tab.setAttribute('aria-selected', String(i === 0));
    tab.tabIndex = i === 0 ? 0 : -1;
    const pictures = labelCell ? [...labelCell.querySelectorAll('picture')] : [];
    if (pictures.length) {
      tab.setAttribute('aria-label', pictures[0].querySelector('img')?.alt || '');
      pictures.forEach((pic, p) => {
        pic.classList.add(p === 0 ? 'sd-logo-on' : 'sd-logo-off');
        tab.append(pic);
      });
      if (pictures.length === 1) tab.classList.add('single-logo');
    } else if (labelCell) {
      tab.append(...labelCell.childNodes);
    }
    rail.append(tab);

    const panel = document.createElement('div');
    panel.className = 'sd-case-panel';
    panel.id = panelId;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tabId);
    panel.hidden = i !== 0;
    const story = document.createElement('div');
    story.className = 'sd-case-story';
    if (storyCell) story.append(...storyCell.children);
    const metrics = document.createElement('div');
    metrics.className = 'sd-case-metrics';
    metricCells.forEach((cell) => metrics.append(buildMetric(cell)));
    panel.append(story, metrics);
    panels.append(panel);
  });

  const tabs = [...rail.children];
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

  block.replaceChildren(rail, panels);
}
