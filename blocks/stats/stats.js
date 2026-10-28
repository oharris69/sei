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
    const v = document.createElement('p');
    v.className = 'stats-value';
    v.textContent = value?.textContent.trim() || '';
    const l = document.createElement('p');
    l.className = 'stats-label';
    l.innerHTML = label?.innerHTML.replace(/<\/?p>/g, '') || '';
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
