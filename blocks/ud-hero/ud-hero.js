/**
 * ud-hero — the logo's bar-gap-bar construction at page scale (uplift variant D, iteration 2):
 * line 1 of the headline on a full-bleed Blue bar, a paper gap, then the following line(s) and
 * the lede on one offset Green block that runs to the right edge.
 * Schema: stardust/eds-schema/index-uplift-d.json § hero.
 *
 * Content model (one row, one cell — the same shape as `ua-hero`):
 *   h1 (or h2) with lines separated by <br>
 *   p…              lede paragraph(s)
 *   p <a>…          optional buttons (decorated by the site: <strong> red, <em> ink)
 * A picture, if authored, is ignored by this design (the colour fields replace it).
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
    .forEach((nodes, i) => {
      const bar = document.createElement('span');
      bar.className = `ud-hero-bar ${i === 0 ? 'is-upper' : 'is-lower'}`;
      bar.append(...nodes);
      heading.append(bar);
    });
}

export default function decorate(block) {
  const heading = block.querySelector('h1, h2');
  const paragraphs = [...block.querySelectorAll('p')]
    .filter((p) => !p.querySelector('picture, img') && p.textContent.trim());
  const buttons = paragraphs.filter((p) => p.classList.contains('button-wrapper')
    || (p.querySelector('a') && p.textContent.trim() === p.querySelector('a').textContent.trim()));
  const ledes = paragraphs.filter((p) => !buttons.includes(p));

  const parts = [];
  if (heading) {
    splitLines(heading);
    parts.push(wrap('ud-hero-headline', [heading]));
  }
  const tail = [];
  if (ledes.length) tail.push(wrap('ud-hero-lede', ledes));
  if (buttons.length) tail.push(wrap('ud-hero-actions', buttons));
  if (tail.length) parts.push(wrap('ud-hero-tail', tail));
  block.replaceChildren(...parts);
}
