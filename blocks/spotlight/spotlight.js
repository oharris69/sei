import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Spotlight: a video thumbnail beside a headline, quote and attribution.
 * Row cells: [picture (+ optional video link)] [headline, quote, name, role]
 * @param {Element} block The spotlight block element
 */
export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const media = cells.find((cell) => cell.querySelector('picture'));
  const body = cells.find((cell) => cell !== media);

  block.textContent = '';

  if (media) {
    media.className = 'spotlight-media';
    const img = media.querySelector('img');
    if (img) {
      const picture = createOptimizedPicture(img.src, img.alt, false, [{ width: '1200' }]);
      const wrapper = img.closest('p');
      img.closest('picture').remove();
      if (wrapper && !wrapper.textContent.trim() && !wrapper.querySelector('a')) wrapper.remove();
      media.prepend(picture);
    }
    const link = media.querySelector('a');
    const play = document.createElement(link ? 'a' : 'span');
    play.className = 'spotlight-play';
    if (link) {
      play.href = link.href;
      play.setAttribute('aria-label', link.textContent.trim() || 'Play video');
      link.closest('p')?.remove();
      link.remove();
    } else {
      play.setAttribute('aria-hidden', 'true');
    }
    media.append(play);
    block.append(media);
  }

  if (body) {
    body.className = 'spotlight-body';
    // the paragraph in quotes / italics is the quote; the following lines are attribution
    const quote = [...body.querySelectorAll('p')].find((p) => p.querySelector('em') || /^[“"]/.test(p.textContent.trim()));
    if (quote) {
      quote.classList.add('spotlight-quote');
      let next = quote.nextElementSibling;
      if (next) next.classList.add('spotlight-name');
      next = next?.nextElementSibling;
      if (next) next.classList.add('spotlight-role');
    }
    block.append(body);
  }
}
