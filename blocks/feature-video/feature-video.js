/**
 * Feature video — Experience Workspace: the presenter lines and feature titles are MOVED
 * into generated wrappers (`.feature-video-name` / `-role`, the `.feature-video-title`
 * heading); CSS styles them through the wrapper.
 * @ew-exempt <p> video link (row 1) — source link, the icon-only play button href/label (metadata)
 */
import { createOptimizedPicture } from '../../scripts/aem.js';

// Optimized copy of an authored picture that keeps the workspace image index (EW1).
function optimizedPicture(img, alt, width) {
  const picture = createOptimizedPicture(img.src, alt, false, [{ width }]);
  if (img.dataset.imageIndex) picture.querySelector('img').dataset.imageIndex = img.dataset.imageIndex;
  return picture;
}

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
    if (img) media.append(optimizedPicture(img, img.alt, '1400'));

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
        const wrap = document.createElement('div');
        wrap.className = i === 0 ? 'feature-video-name' : 'feature-video-role';
        wrap.append(p);
        caption.append(wrap);
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
          icon.append(optimizedPicture(img, '', '128'));
        } else {
          icon.append(pic);
        }
      }
      // move the authored title (EW1): a paragraph goes inside the generated <h3>; an
      // authored heading keeps its own tag inside a styled wrapper
      const source = textCell || iconCell;
      const authored = [...source.children].filter((el) => !el.querySelector('picture, .icon')
        && el.tagName !== 'PICTURE' && el.textContent.trim());
      const isHeading = authored.length === 1 && /^H[1-6]$/.test(authored[0].tagName);
      const title = document.createElement(isHeading ? 'div' : 'h3');
      title.className = 'feature-video-title';
      if (authored.length) title.append(...authored);
      else title.append(...[...source.childNodes].filter((n) => n.nodeType === Node.TEXT_NODE));
      li.append(icon, title);
      list.append(li);
    });
    block.append(list);
  }
}
