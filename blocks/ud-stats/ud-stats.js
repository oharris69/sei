/**
 * ud-stats — scale band (uplift variant D): the section heading set as paper bars on the Orange
 * field, then four ink numerals on one shared baseline above one ink axis line.
 * The section heading + lede stay default content above the block (styled via the container);
 * this block only splits the heading's authored lines (<br>) into bar spans, in place.
 * Schema: stardust/eds-schema/index-uplift-d.json § scale (2 × span.line + 4 × li.tile-stat).
 *
 * Content model (the same shape as `ua-stats`, minus the map):
 *   [value] [label]              one row per figure
 *   [value] [label] [featured]   the leading figure (moved first, whatever its row position)
 *   [picture]                    optional; not used by this design (removed)
 * Value and label cells may hold plain text or paragraphs.
 * @ew-exempt flag cell ("featured") — text-as-metadata, never displayed
 * Decode tier: reconstructive (one item per authored row).
 *
 * @param {Element} block The block element
 */
const FLAG = /^\s*(featured|lead)\s*$/i;

function slot(className, cell) {
  const el = document.createElement('div');
  el.className = className;
  if (cell) el.append(...cell.childNodes);
  return el;
}

/** Splits the section heading at its <br>s into paper bars (moves its child nodes). */
function barHeading(block) {
  const head = block.closest('.section')?.querySelector(':scope > .default-content-wrapper');
  const heading = head?.querySelector('h2, h3');
  if (!heading || heading.querySelector('.ud-stats-bar')) return;
  const lines = [[]];
  [...heading.childNodes].forEach((node) => {
    if (node.nodeName === 'BR') {
      node.remove();
      lines.push([]);
    } else {
      lines[lines.length - 1].push(node);
    }
  });
  lines.filter((nodes) => nodes.some((n) => n.textContent.trim())).forEach((nodes) => {
    const line = document.createElement('span');
    line.className = 'ud-stats-line';
    const bar = document.createElement('span');
    bar.className = 'ud-stats-bar';
    bar.append(...nodes);
    line.append(bar);
    heading.append(line);
  });
}

export default function decorate(block) {
  barHeading(block);
  const row = document.createElement('ul');
  row.className = 'ud-stats-row';
  let lead = null;

  [...block.children].forEach((r) => {
    const cells = [...r.children];
    if (r.querySelector('picture, img') && !r.textContent.trim()) return;
    const isLead = cells.some((c) => FLAG.test(c.textContent) && !c.querySelector('a, img'));
    const [valueCell, labelCell] = cells.filter((c) => !FLAG.test(c.textContent));
    if (!valueCell || !valueCell.textContent.trim()) return;
    const item = document.createElement('li');
    item.className = 'ud-stat';
    item.append(slot('ud-stat-value', valueCell));
    if (labelCell) item.append(slot('ud-stat-label', labelCell));
    if (isLead && !lead) {
      lead = item;
      item.classList.add('is-lead');
    } else {
      row.append(item);
    }
  });
  if (lead) row.prepend(lead);
  block.replaceChildren(row);
}
