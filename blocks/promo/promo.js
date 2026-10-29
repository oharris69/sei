import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Promo: a tall image card with centred heading, copy and a white CTA (used in pop-ups).
 * Row cells: [picture] [heading, copy, p>a CTA]
 * @param {Element} block The promo block element
 */
export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const media = cells.find((cell) => cell.querySelector('picture') && !cell.textContent.trim());
  const content = cells.find((cell) => cell !== media);
  block.textContent = '';

  if (media) {
    media.className = 'promo-media';
    const img = media.querySelector('img');
    if (img) media.replaceChildren(createOptimizedPicture(img.src, img.alt, true, [{ width: '900' }]));
    block.append(media);
  }
  if (content) {
    content.className = 'promo-content';
    block.append(content);
  }
}
