/**
 * Callout: brand-gradient band with copy on the left and a stat on a clipboard on the right.
 * Row cells: [heading + copy] [optional clipboard picture, stat heading, stat copy, CTA]
 * @param {Element} block The callout block element
 */
export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const [content, stat] = cells;
  block.textContent = '';

  if (content) {
    content.className = 'callout-content';
    block.append(content);
  }

  if (stat) {
    stat.className = 'callout-stat';
    const picture = stat.querySelector('picture');
    if (picture) {
      const art = document.createElement('div');
      art.className = 'callout-art';
      art.append(picture);
      picture.closest('p')?.remove();
      stat.prepend(art);
    }
    const inner = document.createElement('div');
    inner.className = 'callout-stat-inner';
    [...stat.children].filter((el) => !el.classList.contains('callout-art')).forEach((el) => inner.append(el));
    stat.append(inner);
    block.append(stat);
  }
}
