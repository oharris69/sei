import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Feature video: a video thumbnail with presenter caption beside a list of icon features.
 * Row 1: [picture, p name, p role, optional p > a video link]
 * Rows 2+: [icon picture (or :icon:)] [feature title]
 * @param {Element} block The feature-video block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  const videoRow = rows.find((row) => row.children.length === 1 && row.querySelector('picture'));
  const featureRows = rows.filter((row) => row !== videoRow);
  block.textContent = '';

  if (videoRow) {
    const cell = videoRow.firstElementChild;
    const media = document.createElement('div');
    media.className = 'feature-video-media';
    const img = cell.querySelector('img');
    if (img) media.append(createOptimizedPicture(img.src, img.alt, false, [{ width: '1400' }]));

    const link = cell.querySelector('a');
    const play = document.createElement(link ? 'a' : 'span');
    play.className = 'feature-video-play';
    if (link) {
      play.href = link.href;
      play.setAttribute('aria-label', link.textContent.trim() || 'Play video');
      link.closest('p')?.remove();
    } else {
      play.setAttribute('aria-hidden', 'true');
    }
    media.append(play);

    const lines = [...cell.querySelectorAll('p')].filter((p) => !p.querySelector('picture') && p.textContent.trim());
    if (lines.length) {
      const caption = document.createElement('div');
      caption.className = 'feature-video-caption';
      lines.forEach((p, i) => {
        p.className = i === 0 ? 'feature-video-name' : 'feature-video-role';
        caption.append(p);
      });
      media.append(caption);
    }
    block.append(media);
  }

  if (featureRows.length) {
    const list = document.createElement('ul');
    list.className = 'feature-video-list';
    featureRows.forEach((row) => {
      const cells = [...row.children];
      const iconCell = cells.find((c) => c.querySelector('picture, .icon'));
      const textCell = cells.find((c) => c !== iconCell && c.textContent.trim());
      if (!textCell && !iconCell) return;
      const li = document.createElement('li');
      const icon = document.createElement('span');
      icon.className = 'feature-video-icon';
      icon.setAttribute('aria-hidden', 'true');
      const pic = iconCell?.querySelector('picture, .icon');
      if (pic) {
        const img = pic.querySelector('img');
        if (pic.tagName === 'PICTURE' && img) {
          icon.append(createOptimizedPicture(img.src, '', false, [{ width: '128' }]));
        } else {
          icon.append(pic);
        }
      }
      const title = document.createElement('h3');
      title.className = 'feature-video-title';
      title.textContent = (textCell || iconCell).textContent.trim();
      li.append(icon, title);
      list.append(li);
    });
    block.append(list);
  }
}
