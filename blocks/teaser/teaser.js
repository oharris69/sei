import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Teaser: full-bleed split promo band — copy and CTA in one half (#131517 by default),
 * an image filling the other half edge to edge.
 *
 * Content model — one row, cells in any order:
 *  - picture-only cell → image (right half by default; stacked on top on mobile)
 *  - text cell → optional icon (a paragraph holding only a picture or :icon:) above
 *    the heading (h1, h2 or h3), optional subline paragraph(s) (rendered cyan on the
 *    default ink panel), CTA button (p > strong > a) which sits at the bottom of the band
 *
 * Options (block classes):
 *  - image-left → image in the left half, copy in the right half (desktop)
 * The copy panel takes its colour from the section style when the section has one
 * the block knows (red, cyan, green, orange, light-grey); otherwise it stays ink.
 * @param {Element} block The teaser block element
 */
export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const media = cells.find((cell) => cell.querySelector('picture') && !cell.textContent.trim());
  const content = cells.find((cell) => cell !== media && cell.textContent.trim());

  block.textContent = '';

  if (content) {
    content.className = 'teaser-content';
    const paragraphs = [...content.querySelectorAll(':scope > p')];
    const children = [...content.children];
    const headingIndex = children.findIndex((el) => /^H[1-3]$/.test(el.tagName));

    // an icon is a text-less paragraph with a picture or :icon: that comes before the heading
    const icon = paragraphs.find((p) => !p.textContent.trim()
      && p.querySelector('picture, .icon')
      && headingIndex > children.indexOf(p));
    if (icon) icon.classList.add('teaser-icon');

    paragraphs.forEach((p) => {
      if (p === icon) return;
      if (!p.querySelector('a') && !p.querySelector('picture')) p.classList.add('teaser-subline');
    });
    const cta = paragraphs.find((p) => p.querySelector('a'));
    if (cta) cta.classList.add('teaser-cta');
    block.append(content);
  }

  if (media) {
    media.className = 'teaser-media';
    const img = media.querySelector('picture > img');
    if (img) {
      const url = new URL(img.src, window.location.href);
      if (url.origin === window.location.origin && !/\.svg$/i.test(url.pathname)) {
        img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [
          { media: '(min-width: 600px)', width: '1280' },
          { width: '750' },
        ]));
      }
    }
    block.append(media);
  }
}
