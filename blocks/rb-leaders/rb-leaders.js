/**
 * rb-leaders — "Perspectives from SEI Leadership" bays on brass strips (rebrand R, index-rebrand).
 * Four flush bays: greyscale 4:5 portrait (colour on hover/focus), name + role over a brass rule,
 * article title link (stretched over the whole bay) and the serif dek.
 *
 * Content model (one row per leader — same row shape as the site's `cards leadership`;
 * cells are classified by content, so their order does not matter):
 *   [picture portrait] [p or h4 name, p role] [h3 > a article title, p dek]
 * The section's h2 + lone "View all insights" link above the block are default content
 * (laid out by this block's CSS). Decode tier: reconstructive.
 *
 * @param {Element} block The block element
 */
function classify(cells) {
  const out = { media: null, person: null, article: null };
  cells.forEach((cell) => {
    const text = cell.textContent.trim();
    if (!out.media && cell.querySelector('picture, img') && !text) {
      out.media = cell.querySelector('picture') || cell.querySelector('img');
    } else if (!out.article && cell.querySelector('h1, h2, h3, a[href]')) {
      out.article = cell;
    } else if (text) {
      out.person = out.person || cell;
    }
  });
  return out;
}

export default function decorate(block) {
  const list = document.createElement('ul');
  list.className = 'rb-leaders-bays';

  [...block.children].forEach((row) => {
    const { media, person, article } = classify([...row.children]);
    if (!media && !person && !article) return;
    const bay = document.createElement('li');
    bay.className = 'rb-leaders-bay';
    if (media) {
      const frame = document.createElement('div');
      frame.className = 'rb-leaders-frame';
      frame.append(media);
      bay.append(frame);
    }
    const body = document.createElement('div');
    body.className = 'rb-leaders-body';
    if (person) {
      const [name, ...roles] = [...person.children];
      if (name) {
        name.classList.add('rb-leaders-name');
        body.append(name);
      }
      roles.forEach((p) => {
        p.classList.add('rb-leaders-role');
        body.append(p);
      });
    }
    if (article) {
      [...article.children].forEach((el) => {
        if (el.matches('h1, h2, h3, h4')) {
          el.classList.add('rb-leaders-title');
          el.querySelector('a')?.classList.add('rb-leaders-link');
        } else {
          el.classList.add('rb-leaders-dek');
        }
        body.append(el);
      });
    }
    bay.append(body);
    list.append(bay);
  });
  block.replaceChildren(list);
}
