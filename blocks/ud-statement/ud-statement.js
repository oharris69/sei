/**
 * ud-statement — "What SEI does" (uplift variant D, Pink band): heading + lede, the three
 * capabilities as the stacked mark's ink blocks, the mark on its clear-space plate, and the
 * brand book's purpose line at display size.
 * Schema: stardust/eds-schema/index-uplift-d.json § what-sei-does (3 × li.line).
 *
 * Content model (cells classified by content, so rows/cells may be merged or reordered):
 *   [h2, p lede…]                 the cell holding the heading
 *   [ul capabilities] [picture]   list items become the ink bars; picture = the mark
 *   [p purpose…]                  any other text cell (display line under an ink rule)
 * In a single-cell authoring, paragraphs after the list or picture count as the purpose line.
 * The capability bars repeat words of the lede, so they are hidden from assistive tech
 * (as in the prototype).
 * Decode tier: template-slotted (authored nodes are moved into fixed slots).
 *
 * @param {Element} block The block element
 */
function div(className, nodes = []) {
  const el = document.createElement('div');
  el.className = className;
  el.append(...nodes);
  return el;
}

export default function decorate(block) {
  const copy = [];
  const caps = [];
  const purpose = [];
  let mark = null;
  let pastCopy = false;

  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    const hasHeading = !!cell.querySelector('h1, h2, h3');
    [...cell.children].forEach((el) => {
      const media = el.matches('picture, img') ? el : el.querySelector('picture, img');
      if (media && !el.textContent.trim()) {
        if (!mark) mark = el;
        pastCopy = true;
      } else if (el.matches('ul, ol')) {
        caps.push(el);
        pastCopy = true;
      } else if (el.matches('h1, h2, h3') || (hasHeading && !pastCopy)) {
        copy.push(el);
      } else if (el.textContent.trim()) {
        purpose.push(el);
      }
    });
    if (hasHeading) pastCopy = true;
  });

  const grid = div('ud-statement-grid');
  if (copy.length) grid.append(div('ud-statement-copy', copy));
  if (caps.length) {
    const capsWrap = div('ud-statement-caps', caps);
    capsWrap.setAttribute('aria-hidden', 'true');
    grid.append(capsWrap);
  }
  if (mark) {
    const img = mark.matches('img') ? mark : mark.querySelector('img');
    if (img) img.loading = 'lazy';
    grid.append(div('ud-statement-mark', [div('ud-statement-crop', [mark])]));
  }
  if (purpose.length) grid.append(div('ud-statement-purpose', purpose));
  block.replaceChildren(grid);
}
