/**
 * ub-proof-wall — untabbed case-study wall: every case study on its own white card, side by
 * side, numbers first (uplift variant B). 4-up on desktop, 2×2 on tablet, stacked on mobile.
 * The section heading + lede stay default content above the block; the section container
 * paints the brand field band.
 *
 * Content model (one row per case study — the same shape as `ua-case-tabs` / `tabs case-study`):
 *   [logo picture (on light) — a second, white logo is ignored; or plain label text]
 *   [story p…, p <a> link]
 *   [lead metric: p value, p label] [second metric: p value, p label] [more metrics…]
 * Card order: logo, lead metric (large numeral), the other metrics (title-size, ruled), story,
 * link. The link gets an accessible name that includes the firm ("…: Summit Wealth Group").
 * Cells are classified by content, so a missing metric or story cell is skipped.
 * Decode tier: reconstructive (authored nodes are moved into the card frame).
 *
 * @param {Element} block The block element
 */
function el(tag, className, nodes = []) {
  const node = document.createElement(tag);
  node.className = className;
  node.append(...nodes);
  return node;
}

function isStory(cell) {
  return [...cell.children].some((c) => c.matches('p') && c.querySelector('a'))
    || cell.textContent.trim().length > 80;
}

function buildMetric(cell, lead) {
  const metric = el('div', lead ? 'ub-proof-metric is-lead' : 'ub-proof-metric');
  const parts = [...cell.children];
  if (!parts.length) {
    metric.append(el('p', 'ub-proof-value', [cell.textContent.trim()]));
    return metric;
  }
  const [value, ...labels] = parts;
  value.classList.add('ub-proof-value');
  labels.forEach((label) => label.classList.add('ub-proof-label'));
  metric.append(value, ...labels);
  return metric;
}

function buildCard(row) {
  const cells = [...row.children].filter((c) => c.textContent.trim() || c.querySelector('img'));
  if (!cells.length) return null;
  const card = el('li', 'ub-proof-card');
  const [labelCell, ...rest] = cells;
  let name = '';

  const picture = labelCell.querySelector('picture') || labelCell.querySelector('img');
  if (picture) {
    const img = picture.querySelector('img') || picture;
    img.loading = 'lazy';
    name = img.alt || '';
    card.append(el('div', 'ub-proof-logo', [picture]));
  } else {
    name = labelCell.textContent.trim();
    card.append(el('p', 'ub-proof-name', [...labelCell.childNodes]));
  }

  const storyCell = rest.find(isStory);
  const metricCells = rest.filter((c) => c !== storyCell);
  metricCells.forEach((cell, i) => card.append(buildMetric(cell, i === 0)));

  if (storyCell) {
    const story = el('div', 'ub-proof-story');
    const actions = [];
    [...storyCell.children].forEach((child) => {
      const link = child.matches('p') && child.querySelector('a');
      if (link && child.textContent.trim() === link.textContent.trim()) {
        link.classList.remove('button', 'primary', 'secondary', 'accent');
        link.classList.add('ub-proof-link');
        if (name && !link.getAttribute('aria-label')) {
          link.setAttribute('aria-label', `${link.textContent.trim()}: ${name}`);
        }
        child.className = 'ub-proof-action';
        actions.push(child);
      } else {
        story.append(child);
      }
    });
    if (story.children.length) card.append(story);
    card.append(...actions);
  }
  return card;
}

export default function decorate(block) {
  const list = el('ul', 'ub-proof-list');
  [...block.children].forEach((row) => {
    const card = buildCard(row);
    if (card) list.append(card);
  });
  // desktop columns: one per card, at most four (more cards wrap onto further rows)
  list.style.setProperty('--ub-cards', String(Math.min(Math.max(list.children.length, 1), 4)));
  block.replaceChildren(list);
}
