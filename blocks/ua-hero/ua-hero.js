/**
 * ua-hero — offset heading bars over the brand field (uplift variant A, index-uplift-a).
 * Each headline line sits on its own bar that runs to the viewport's left edge; the last line
 * is set on an ink bar. A green→cyan field fills the right half behind the bars.
 *
 * Content model (one row, one cell — the site's `hero home` shape, minus the picture):
 *   h1 (or h2) with lines separated by <br>
 *   p…              lede paragraph(s)
 *   p <a>…          optional buttons (decorated by the site: <strong> red, <em> ink)
 * A picture, if authored, is ignored by this design (the field replaces it).
 * Decode tier: template-slotted (authored nodes are moved, never copied).
 *
 * @param {Element} block The block element
 */
function wrap(className, nodes) {
  const el = document.createElement('div');
  el.className = className;
  el.append(...nodes);
  return el;
}

/**
 * Splits a heading at its <br>s into bar spans by moving its child nodes.
 * @param {Element} heading The authored heading
 */
function splitLines(heading) {
  const lines = [[]];
  [...heading.childNodes].forEach((node) => {
    if (node.nodeName === 'BR') {
      node.remove();
      lines.push([]);
    } else {
      lines[lines.length - 1].push(node);
    }
  });
  lines
    .filter((nodes) => nodes.some((n) => n.textContent.trim()))
    .forEach((nodes, i, all) => {
      const bar = document.createElement('span');
      bar.className = `ua-hero-bar${i === all.length - 1 && all.length > 1 ? ' is-ink' : ''}`;
      bar.append(...nodes);
      heading.append(bar);
    });
}

export default function decorate(block) {
  const heading = block.querySelector('h1, h2');
  const paragraphs = [...block.querySelectorAll('p')]
    .filter((p) => !p.querySelector('picture, img') && p.textContent.trim());
  const buttons = paragraphs.filter((p) => p.classList.contains('button-wrapper'));
  const ledes = paragraphs.filter((p) => !buttons.includes(p));

  const parts = [];
  if (heading) {
    splitLines(heading);
    const field = document.createElement('div');
    field.className = 'ua-hero-field';
    field.setAttribute('aria-hidden', 'true');
    parts.push(wrap('ua-hero-headline', [field, heading]));
  }
  if (ledes.length) parts.push(wrap('ua-hero-lede', ledes));
  if (buttons.length) parts.push(wrap('ua-hero-actions', buttons));
  block.replaceChildren(...parts);
}
