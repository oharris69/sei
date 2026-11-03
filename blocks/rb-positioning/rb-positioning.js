/**
 * rb-positioning — "connective tissue" positioning statement (rebrand R, index-rebrand).
 * Split 5/7: headline (the <em> renders upright with a brass underline) and lede on the left;
 * on the right a terrazzo plate holds a lobby-stone inlay medallion with a double brass edge.
 * The authored image runs through a verde / brass / stone SVG duotone (CSS filter).
 *
 * Content model (one row; cells classified by content):
 *   [h2 (optional <em> highlight), p lede…] [picture]
 * The picture may also sit inside the text cell. Decode tier: template-slotted.
 *
 * @param {Element} block The block element
 */
const FILTER_ID = 'rb-brass-duo';

/** Adds the duotone filter definition once per document (decorative, hidden). */
function ensureFilter() {
  if (document.getElementById(FILTER_ID)) return;
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.classList.add('rb-positioning-defs');
  svg.innerHTML = `<filter id="${FILTER_ID}" color-interpolation-filters="sRGB">`
    + '<feColorMatrix type="saturate" values="0"/><feComponentTransfer>'
    + '<feFuncR type="table" tableValues="0.059 0.059 0.659 0.659 0.659 0.902"/>'
    + '<feFuncG type="table" tableValues="0.169 0.169 0.510 0.510 0.510 0.922"/>'
    + '<feFuncB type="table" tableValues="0.149 0.149 0.192 0.192 0.192 0.906"/>'
    + '</feComponentTransfer></filter>';
  document.body.append(svg);
}

export default function decorate(block) {
  const copy = document.createElement('div');
  copy.className = 'rb-positioning-copy';
  let media = null;

  [...block.querySelectorAll(':scope > div > div')].forEach((cell) => {
    [...cell.children].forEach((el) => {
      const picture = el.matches('picture') ? el : el.querySelector('picture, img');
      if (picture && !media && !el.textContent.trim()) {
        media = picture;
      } else if (el.textContent.trim()) {
        if (el.matches('p')) el.classList.add('rb-positioning-lede');
        copy.append(el);
      }
    });
  });

  const children = [copy];
  if (media) {
    ensureFilter();
    const plate = document.createElement('div');
    plate.className = 'rb-positioning-plate';
    const inlay = document.createElement('div');
    inlay.className = 'rb-positioning-inlay';
    inlay.append(media);
    plate.append(inlay);
    children.push(plate);
  }
  block.replaceChildren(...children);
}
