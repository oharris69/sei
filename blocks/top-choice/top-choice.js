/**
 * Top choice: a personalized "SEI top choice" recommendation panel.
 * Rows: [heading + intro, e.g. "SEI top choice." / "Suggested for you"]
 *       [ticker heading, fund name, p>strong>a CTA]
 * A single-row block is treated as the card only.
 * @param {Element} block The top-choice block element
 */
export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const [intro, card] = cells.length > 1 ? cells : [null, cells[0]];
  block.textContent = '';

  if (intro) {
    intro.className = 'top-choice-intro';
    block.append(intro);
  }

  if (card) {
    card.className = 'top-choice-card';
    const ticker = card.querySelector('h2, h3, h4');
    ticker?.classList.add('top-choice-ticker');
    const name = ticker?.nextElementSibling;
    if (name?.tagName === 'P' && !name.classList.contains('button-wrapper')) name.classList.add('top-choice-name');
    block.append(card);
  }
}
