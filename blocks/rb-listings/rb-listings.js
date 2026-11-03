/**
 * rb-listings — "what's on" promo bays on brass strips, 6/3/3 (rebrand R, index-rebrand).
 * The first bay is the lead (horizontal: image left, body right); the others stack image-top.
 * Images are re-toned in CSS (verde → white screen duotone).
 *
 * Content model (one row per bay — same row shape as the site's `cards promo`):
 *   [picture] [h2/h3 title, p copy…, p date line(s) split by <br>, p <strong><a> CTA]
 *   [optional flag cell: "lead" — makes that bay the lead instead of the first]
 * A paragraph with no link whose lines are split by <br> (e.g. "Thursday, October 1<br>11 am ET")
 * renders as one rose badge per line. Legacy flags ("inverse") are ignored.
 * Decode tier: reconstructive.
 * @ew-exempt <div> flag cell ("lead") — text-as-metadata, never displayed
 *
 * @param {Element} block The block element
 */
const FLAG = /^\s*(lead|featured|inverse|dark)\s*$/i;

function classify(cells) {
  const out = { media: null, body: null, lead: false };
  cells.forEach((cell) => {
    const text = cell.textContent.trim();
    if (!out.media && cell.querySelector('picture, img') && !cell.querySelector('h1, h2, h3, h4')) {
      out.media = cell.querySelector('picture') || cell.querySelector('img');
    } else if (FLAG.test(text) && !cell.querySelector('a, picture, img')) {
      if (/lead|featured/i.test(text)) out.lead = true;
    } else if (text) {
      out.body = cell;
    }
  });
  return out;
}

/**
 * Splits a <br>-separated paragraph into badge spans by moving its inline content.
 * @param {Element} p The paragraph
 */
function badges(p) {
  const source = p.querySelector(':scope > strong:only-child, :scope > b:only-child') || p;
  const lines = [[]];
  [...source.childNodes].forEach((node) => {
    if (node.nodeName === 'BR') lines.push([]);
    else lines[lines.length - 1].push(node);
  });
  const spans = lines.filter((nodes) => nodes.some((n) => n.textContent.trim()))
    .map((nodes) => {
      const span = document.createElement('span');
      span.className = 'rb-listings-badge';
      span.append(...nodes);
      return span;
    });
  p.replaceChildren(...spans);
  p.className = 'rb-listings-when';
}

function decorateBody(body) {
  const content = document.createElement('div');
  content.className = 'rb-listings-body';
  [...body.children].forEach((el) => {
    if (el.matches('h1, h2, h3, h4, h5, h6')) {
      el.classList.add('rb-listings-title');
    } else if (el.matches('p') && !el.querySelector('a, picture') && el.querySelector('br')) {
      badges(el);
    } else if (el.matches('p') && el.querySelector('a')) {
      el.classList.add('rb-listings-cta');
      const a = el.querySelector('a');
      a.classList.add('button');
      if (!a.matches('.secondary, .accent')) a.classList.add('primary');
    } else if (el.matches('p') && el.querySelector(':scope > strong:only-child')
      && el.textContent.trim() === el.querySelector('strong').textContent.trim()) {
      el.classList.add('rb-listings-strong');
    }
    content.append(el);
  });
  return content;
}

export default function decorate(block) {
  const list = document.createElement('ul');
  list.className = 'rb-listings-bays';
  const bays = [];

  [...block.children].forEach((row) => {
    const { media, body, lead } = classify([...row.children]);
    if (!media && !body) return;
    const bay = document.createElement('li');
    bay.className = 'rb-listings-bay';
    if (media) {
      const frame = document.createElement('div');
      frame.className = 'rb-listings-frame';
      frame.append(media);
      bay.append(frame);
    }
    if (body) bay.append(decorateBody(body));
    bays.push({ bay, lead });
  });

  const leadIndex = Math.max(0, bays.findIndex((b) => b.lead));
  bays.forEach(({ bay }, i) => {
    if (i === leadIndex) bay.classList.add('is-lead');
    if (i === leadIndex) list.prepend(bay);
    else list.append(bay);
  });
  block.replaceChildren(list);
}
