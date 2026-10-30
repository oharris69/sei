/**
 * sd-hero — "between the lines" home hero (stardust redesign, index-stardust).
 * Headline lines sit on white bars that overlap a green→cyan field; a gradient strip runs under
 * the fold so the promo row (sd-promos) can ride onto it.
 *
 * Content model (one row, one cell): h1 (lines separated by <br>), p lede.
 * Schema: stardust/eds-schema/index-stardust.json § hero. Decode tier: template-slotted
 * (node-slotting — authored elements are moved, never copied).
 *
 * @param {Element} block The block element
 */
function wrapNode(node, className) {
  const wrapper = document.createElement('div');
  wrapper.className = className;
  wrapper.append(node);
  return wrapper;
}

function decorative(className) {
  const el = document.createElement('div');
  el.className = className;
  el.setAttribute('aria-hidden', 'true');
  return el;
}

/**
 * Splits an authored heading at its <br>s into line spans by MOVING its child nodes
 * (presentation refinement; text content is unchanged).
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
  const filled = lines.filter((nodes) => nodes.some((n) => n.textContent.trim()));
  filled.forEach((nodes) => {
    const line = document.createElement('span');
    line.className = 'sd-hero-line';
    line.append(...nodes);
    heading.append(line);
  });
}

export default function decorate(block) {
  const heading = block.querySelector('h1, h2');
  const lede = [...block.querySelectorAll('p')].find((p) => !p.querySelector('picture, img'));

  const content = document.createElement('div');
  content.className = 'sd-hero-content';
  if (heading) {
    splitLines(heading);
    content.append(wrapNode(heading, 'sd-hero-headline'));
  }
  if (lede) content.append(wrapNode(lede, 'sd-hero-lede'));

  block.replaceChildren(decorative('sd-hero-field'), decorative('sd-hero-strip'), content);
}
