/**
 * Image — Experience Workspace: caption content is MOVED into the <figcaption>.
 * @ew-exempt <p> link-only row — the image's link target, rendered as the wrapping <a> (metadata)
 */
import { createOptimizedPicture } from '../../scripts/aem.js';

/*
 * Image: one authored picture, with an optional caption and an optional link around it.
 * Rows (any order; authors may leave rows out or add stray empty ones):
 *  - a picture → the image (required; without one the block renders nothing)
 *  - a row holding only a link → the image links there
 *  - any other text → caption (a <figcaption>; links and emphasis are kept)
 * Options (block classes): wide, full, narrow, left, right, rounded, bordered.
 * Same-origin images are re-encoded with createOptimizedPicture; external images keep their
 * authored <picture>. The image is lazy unless the block is the first block on the page.
 */

/** Breakpoints for createOptimizedPicture, by layout option. */
function breakpoints(block) {
  if (block.classList.contains('full')) {
    return [
      { media: '(min-width: 1200px)', width: '2400' },
      { media: '(min-width: 600px)', width: '1600' },
      { width: '750' },
    ];
  }
  if (['narrow', 'left', 'right'].some((c) => block.classList.contains(c))) {
    return [{ media: '(min-width: 600px)', width: '1200' }, { width: '750' }];
  }
  return [{ media: '(min-width: 600px)', width: '2000' }, { width: '750' }];
}

/** Whether a link is the only content of its row (the image link, not part of a caption). */
function isLinkRow(row) {
  const links = row.querySelectorAll('a[href]');
  return links.length === 1 && !row.querySelector('picture')
    && row.textContent.trim() === links[0].textContent.trim();
}

/**
 * @param {Element} block The image block
 */
export default function decorate(block) {
  const img = block.querySelector('picture > img, img');
  if (!img) {
    block.replaceChildren();
    block.classList.add('is-empty');
    return;
  }

  const rows = [...block.children];
  const imageRow = rows.find((row) => row.contains(img));
  // a link around the picture itself, or a row holding only a link
  let link = img.closest('a[href]');
  if (!link) {
    const linkRow = rows.find((row) => row !== imageRow && isLinkRow(row));
    link = linkRow?.querySelector('a[href]') || null;
    linkRow?.remove();
  }

  // everything else with text is caption
  const captionNodes = [];
  rows.filter((row) => row !== imageRow && row.isConnected).forEach((row) => {
    row.querySelectorAll(':scope > div').forEach((cell) => {
      if (!cell.textContent.trim()) return;
      if (cell.querySelector(':scope > :is(p, ul, ol, h1, h2, h3, h4, h5, h6)')) {
        captionNodes.push(...cell.childNodes);
      } else {
        const p = document.createElement('p');
        p.append(...cell.childNodes);
        captionNodes.push(p);
      }
    });
  });
  // text authored next to the picture in its own cell also counts as caption
  imageRow?.querySelectorAll(':scope > div').forEach((cell) => {
    if (cell.contains(img)) return;
    if (cell.textContent.trim()) captionNodes.push(...cell.childNodes);
  });

  const eager = block.closest('main')?.querySelector('.block') === block;
  let picture = img.closest('picture');
  const url = new URL(img.getAttribute('src') || '', window.location.href);
  if (url.origin === window.location.origin && !/\.svg$/i.test(url.pathname)) {
    const optimized = createOptimizedPicture(img.src, img.alt, eager, breakpoints(block));
    const newImg = optimized.querySelector('img');
    ['width', 'height', 'data-image-index'].forEach((attr) => {
      if (img.hasAttribute(attr)) newImg.setAttribute(attr, img.getAttribute(attr));
    });
    picture = optimized;
  } else {
    // external or SVG: keep the authored picture, just set loading
    if (!picture) {
      picture = document.createElement('picture');
      picture.append(img);
    }
    img.loading = eager ? 'eager' : 'lazy';
  }
  const finalImg = picture.querySelector('img');
  finalImg.alt = img.alt || '';
  if (eager) finalImg.fetchPriority = 'high';

  const figure = document.createElement('figure');
  figure.className = 'image-figure';
  let media = picture;
  if (link) {
    const a = document.createElement('a');
    a.className = 'image-link';
    a.href = link.href;
    if (link.target) a.target = link.target;
    if (link.target === '_blank') a.rel = 'noopener';
    if (!finalImg.alt) {
      const text = link.textContent.trim();
      a.setAttribute('aria-label', text && text !== link.href ? text : link.href);
    }
    a.append(picture);
    media = a;
  }
  const frame = document.createElement('div');
  frame.className = 'image-media';
  frame.append(media);
  figure.append(frame);

  if (captionNodes.length) {
    const caption = document.createElement('figcaption');
    caption.className = 'image-caption';
    caption.append(...captionNodes);
    figure.append(caption);
  }
  block.replaceChildren(figure);
}
