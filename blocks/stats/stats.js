/**
 * Stats — Experience Workspace: the authored value / label paragraphs are MOVED into the
 * `.stats-value` / `.stats-label` wrappers (which carry the type), so both stay editable.
 * @ew-exempt <p> `featured` flag (cell 3) — variant selector, never displayed (metadata)
 */

/**
 * Stats: key figures over an optional background picture.
 * Rows: [picture] (optional background), then one row per stat:
 * [value] [label] [optional `featured`]
 * A featured stat renders large inside a circle.
 * @param {Element} block The stats block element
 */
export default function decorate(block) {
  const list = document.createElement('ul');
  list.className = 'stats-list';
  let featured;
  let background;

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 1 && row.querySelector('picture') && !row.textContent.trim()) {
      background = row.querySelector('picture');
      return;
    }
    const [value, label, flag] = cells;
    const item = document.createElement('li');
    item.className = 'stats-item';
    // move the authored cell content into the styled wrappers (EW1)
    const v = document.createElement('div');
    v.className = 'stats-value';
    if (value) v.append(...value.childNodes);
    const l = document.createElement('div');
    l.className = 'stats-label';
    if (label) l.append(...label.childNodes);
    item.append(v, l);
    if (flag && flag.textContent.trim().toLowerCase() === 'featured') {
      featured = document.createElement('div');
      featured.className = 'stats-featured';
      featured.append(v, l);
    } else {
      list.append(item);
    }
  });

  block.textContent = '';
  if (background) {
    const bg = document.createElement('div');
    bg.className = 'stats-background';
    bg.append(background);
    block.append(bg);
  }
  block.append(list);
  if (featured) block.append(featured);
}
