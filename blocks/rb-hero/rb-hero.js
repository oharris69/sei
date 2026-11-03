/**
 * rb-hero — "between the lines" display hero (rebrand R, "The Lobby Floor", index-rebrand).
 * The headline's last line sits in a full-bleed band bounded by brass strips; the band fills
 * with terrazzo aggregate to the right of the words (decorative, never under text). The lede
 * sits under the aggregate bay.
 *
 * Content model (one row, one cell):
 *   h1 (lines separated by <br>; the last line goes into the band), p lede.
 * Decode tier: template-slotted (authored nodes are moved, never copied).
 *
 * Page scope: this block also marks the page with `body.rb-page` and loads `rb-chrome.css`,
 * which restyles the shared header / footer / assistant launcher on this page only.
 *
 * @param {Element} block The block element
 */
import { loadCSS } from '../../scripts/aem.js';

function line(nodes, className) {
  const span = document.createElement('span');
  span.className = className;
  span.append(...nodes);
  return span;
}

/**
 * Splits the authored heading at its <br>s by MOVING its child nodes: every line but the last
 * becomes a contained line; the last line goes into the brass-ruled band.
 * @param {Element} heading The authored heading
 */
function splitHeading(heading) {
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
  if (!filled.length) return;
  const last = filled.length > 1 ? filled.pop() : null;
  filled.forEach((nodes) => heading.append(line(nodes, 'rb-hero-l1')));
  if (last) {
    const band = document.createElement('span');
    band.className = 'rb-hero-band';
    const agg = document.createElement('span');
    agg.className = 'rb-hero-agg';
    agg.setAttribute('aria-hidden', 'true');
    band.append(line(last, 'rb-hero-l2'), agg);
    heading.append(band);
  }
}

export default async function decorate(block) {
  document.body.classList.add('rb-page');
  const chrome = loadCSS(`${window.hlx.codeBasePath}/blocks/rb-hero/rb-chrome.css`);

  const heading = block.querySelector('h1, h2');
  const ledes = [...block.querySelectorAll('p')].filter((p) => p.textContent.trim()
    && !p.querySelector('picture, img'));

  const children = [];
  if (heading) {
    heading.classList.add('rb-hero-h1');
    splitHeading(heading);
    children.push(heading);
  }
  if (ledes.length) {
    const foot = document.createElement('div');
    foot.className = 'rb-hero-foot';
    ledes.forEach((p) => p.classList.add('rb-hero-lede'));
    foot.append(...ledes);
    children.push(foot);
  }
  block.replaceChildren(...children);
  await chrome;
}
