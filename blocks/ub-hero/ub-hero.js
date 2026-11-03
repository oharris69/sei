/**
 * ub-hero — role-first split hero (uplift variant B, index-uplift-b). Left: the headline on
 * offset bars (each line on its own bar running to the viewport's left edge, the last line on
 * an ink bar) and the lede. Right: the green→cyan field bleeding to the right edge, holding the
 * role "doors" — a group label, a heading, a lede and one full-width ink door per role link.
 * The doors replace the page's separate "Tell us who you are" panel (one chooser, asked once).
 *
 * Content model (two rows, or two cells in one row):
 *   [h1 with lines separated by <br>, p lede…, optional p <a> buttons]
 *   [optional short label p (e.g. "Recommended for you"), h2, p lede…, p <a> per role…]
 * - Each paragraph that holds only a link becomes a door, whatever its formatting.
 * - Role links go to the persona landing pages (/bd-breakaway, /enterprise-ria,
 *   /asset-managers); those pages set the visitor's role through scripts/profile.js.
 * - If everything is authored in one cell, the doors start at the first heading after the h1.
 * A picture, if authored, is ignored by this design (the field replaces it).
 * Decode tier: template-slotted (authored nodes are moved, never copied).
 *
 * @param {Element} block The block element
 */
let instance = 0;

function wrap(className, nodes = []) {
  const el = document.createElement('div');
  el.className = className;
  el.append(...nodes);
  return el;
}

function linkOnly(el) {
  const link = el.matches('p') && el.querySelector('a');
  return link && el.textContent.trim() === link.textContent.trim() ? link : null;
}

function isLabel(el) {
  const next = el.nextElementSibling;
  const text = el.textContent.trim();
  return el.matches('p') && next?.matches('h2, h3') && text.length <= 60
    && !el.querySelector('a, picture, img');
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
      bar.className = `ub-hero-bar${i === all.length - 1 && all.length > 1 ? ' is-ink' : ''}`;
      bar.append(...nodes);
      heading.append(bar);
    });
}

/** Splits the authored content into the headline side and the doors side. */
function readSides(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')]
    .filter((cell) => cell.textContent.trim() || cell.querySelector('picture, img'));
  if (cells.length > 1) {
    const textIndex = Math.max(cells.findIndex((c) => c.querySelector('h1')), 0);
    const text = [...cells[textIndex].children];
    const doors = cells.filter((_, i) => i !== textIndex).flatMap((c) => [...c.children]);
    return { text, doors };
  }
  const all = cells[0] ? [...cells[0].children] : [];
  const h1 = all.findIndex((el) => el.matches('h1'));
  let split = all.findIndex((el, i) => i > h1 && el.matches('h2, h3'));
  if (split > 0 && isLabel(all[split - 1])) split -= 1;
  // no doors heading: the doors start at the first plain (unformatted, non-button) link
  if (split < 0) {
    split = all.findIndex((el, i) => i > h1 && linkOnly(el) && !el.querySelector('strong, em'));
  }
  if (split < 0) return { text: all, doors: [] };
  return { text: all.slice(0, split), doors: all.slice(split) };
}

function buildText(nodes) {
  const text = wrap('ub-hero-text');
  const heading = nodes.find((el) => el.matches('h1, h2'));
  const ledes = [];
  const buttons = [];
  nodes.forEach((el) => {
    if (el === heading || el.querySelector('picture, img') || !el.textContent.trim()) return;
    if (linkOnly(el)) buttons.push(el);
    else ledes.push(el);
  });
  if (heading) {
    splitLines(heading);
    text.append(wrap('ub-hero-headline', [heading]));
  }
  if (ledes.length) text.append(wrap('ub-hero-lede', ledes));
  if (buttons.length) text.append(wrap('ub-hero-actions', buttons));
  return text;
}

function buildDoors(nodes) {
  const id = `ub-hero-doors-${instance}`;
  const panel = wrap('ub-hero-doors');
  panel.id = instance === 1 ? 'roles' : id;
  const inner = wrap('ub-hero-doors-inner');
  inner.setAttribute('role', 'group');
  const list = document.createElement('ul');
  list.className = 'ub-hero-door-list';
  let label = null;

  nodes.forEach((el) => {
    const link = linkOnly(el);
    if (el.querySelector('picture, img') && !el.textContent.trim()) return;
    if (link) {
      link.classList.remove('button', 'primary', 'secondary', 'accent');
      link.classList.add('ub-hero-door');
      const arrow = document.createElement('span');
      arrow.className = 'ub-hero-door-arrow';
      arrow.setAttribute('aria-hidden', 'true');
      link.append(arrow);
      const item = document.createElement('li');
      item.append(link);
      list.append(item);
    } else if (!label && !inner.children.length && isLabel(el)) {
      label = el;
      label.className = 'ub-hero-doors-label';
      label.id = `${id}-label`;
      inner.append(label);
    } else {
      if (el.matches('p')) el.classList.add('ub-hero-doors-lede');
      inner.append(el);
    }
  });

  const heading = inner.querySelector('h2, h3');
  if (label) inner.setAttribute('aria-labelledby', label.id);
  else if (heading) inner.setAttribute('aria-label', heading.textContent.trim());
  if (list.children.length) inner.append(list);
  panel.append(inner);
  return panel;
}

export default function decorate(block) {
  instance += 1;
  const { text, doors } = readSides(block);
  const parts = [buildText(text)];
  if (doors.length) parts.push(buildDoors(doors));
  else block.classList.add('no-doors');
  block.replaceChildren(...parts);
}
