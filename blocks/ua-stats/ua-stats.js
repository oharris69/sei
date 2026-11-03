/**
 * ua-stats — typographic numeral row on an ink band, the featured figure leading at display
 * size with a cyan rule; an optional map sits behind as a faint texture (uplift variant A).
 * The section heading + lede stay default content above the block (styled via the container).
 *
 * Content model (the same shape as the site's `stats`):
 *   [picture]                    optional background texture (decorative, alt="")
 *   [value] [label]              one row per figure
 *   [value] [label] [featured]   the leading figure (moved first, whatever its row position)
 * Value and label cells may hold plain text or paragraphs.
 * @ew-exempt flag cell ("featured") — text-as-metadata, never displayed
 *
 * @param {Element} block The block element
 */
const FLAG = /^\s*(featured|lead)\s*$/i;

function slot(tag, className, cell) {
  const el = document.createElement(tag);
  el.className = className;
  if (cell) el.append(...cell.childNodes);
  return el;
}

export default function decorate(block) {
  const row = document.createElement('ul');
  row.className = 'ua-stats-row';
  let map = null;
  let lead = null;

  [...block.children].forEach((r) => {
    const cells = [...r.children];
    const picture = r.querySelector('picture') || r.querySelector('img');
    if (picture && !map && !r.textContent.trim()) {
      map = picture;
      return;
    }
    const isLead = cells.some((c) => FLAG.test(c.textContent) && !c.querySelector('a, img'));
    const [valueCell, labelCell] = cells.filter((c) => !FLAG.test(c.textContent));
    if (!valueCell || !valueCell.textContent.trim()) return;
    const item = document.createElement('li');
    item.className = 'ua-stat';
    item.append(slot('div', 'ua-stat-value', valueCell));
    if (labelCell) item.append(slot('div', 'ua-stat-label', labelCell));
    if (isLead && !lead) {
      lead = item;
      item.classList.add('is-lead');
    } else {
      row.append(item);
    }
  });
  if (lead) row.prepend(lead);
  else block.classList.add('no-lead');
  row.style.setProperty('--ua-rest', String(Math.max(row.children.length - (lead ? 1 : 0), 1)));

  block.replaceChildren(row);
  if (map) {
    const wrap = document.createElement('div');
    wrap.className = 'ua-stats-map';
    wrap.setAttribute('aria-hidden', 'true');
    const img = map.querySelector('img') || map;
    img.alt = '';
    img.loading = 'lazy';
    wrap.append(map);
    block.prepend(wrap);
  }
}
