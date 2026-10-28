import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Teaser: full-bleed dark split promo band — copy and CTA on the left (#131517),
 * an image filling the right half edge to edge.
 *
 * Content model — one row, cells in any order:
 *  - picture-only cell → image (right half; stacked on top on mobile)
 *  - text cell → heading, optional subline paragraph(s) (rendered cyan),
 *    CTA button (p > strong > a) which sits at the bottom of the band
 * @param {Element} block The teaser block element
 */
export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const media = cells.find((cell) => cell.querySelector('picture') && !cell.textContent.trim());
  const content = cells.find((cell) => cell !== media && cell.textContent.trim());

  block.textContent = '';

  if (content) {
    content.className = 'teaser-content';
    content.querySelectorAll(':scope > p').forEach((p) => {
      if (!p.querySelector('a') && !p.querySelector('picture')) p.classList.add('teaser-subline');
    });
    const cta = [...content.querySelectorAll(':scope > p')].find((p) => p.querySelector('a'));
    if (cta) cta.classList.add('teaser-cta');
    block.append(content);
  }

  if (media) {
    media.className = 'teaser-media';
    const img = media.querySelector('img');
    if (img) {
      img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [
        { media: '(min-width: 600px)', width: '1280' },
        { width: '750' },
      ]));
    }
    block.append(media);
  }
}
