/**
 * Fund cards: bordered "performance leader" cards.
 * Each row is a card; all cells of a row are merged into the card body:
 *  - heading (h2–h4) → big ticker, e.g. "SEIV"
 *  - first paragraph after the heading → fund name
 *  - further paragraphs → description
 *  - p > strong > a → red "Explore" button (pinned to the card bottom)
 * @param {Element} block The fund-cards block element
 */
export default function decorate(block) {
  const list = document.createElement('ul');

  [...block.children].forEach((row) => {
    const card = document.createElement('li');
    card.className = 'fund-cards-card';
    [...row.children].forEach((cell) => card.append(...cell.childNodes));
    if (!card.textContent.trim()) return;

    const heading = card.querySelector('h1, h2, h3, h4, h5, h6');
    heading?.classList.add('fund-cards-ticker');

    const textParas = [...card.querySelectorAll(':scope > p')].filter((p) => !p.classList.contains('button-wrapper'));
    const next = heading?.nextElementSibling;
    const name = textParas.includes(next) ? next : null;
    name?.classList.add('fund-cards-name');
    textParas.filter((p) => p !== name).forEach((p) => p.classList.add('fund-cards-description'));

    list.append(card);
  });

  block.replaceChildren(list);
}
