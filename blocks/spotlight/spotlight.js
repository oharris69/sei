import { createOptimizedPicture } from '../../scripts/aem.js';
import { track } from '../../scripts/profile.js';
import { videoSource, buildPlayer } from '../../scripts/video.js';

/**
 * Spotlight: a video thumbnail beside a headline, quote and attribution.
 * Row cells: [picture (+ optional video link)] [headline, quote, name, role]
 * A Brightcove, AEM Assets or .mp4 video link plays in place of the thumbnail (scripts/video.js);
 * any other link opens its page.
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
    const source = link ? videoSource(link.getAttribute('href')) : null;
    const label = link?.textContent.trim() || 'Play video';
    let play;
    if (source) {
      play = document.createElement('button');
      play.type = 'button';
      play.addEventListener('click', () => {
        const title = label.replace(/^play video:\s*/i, '') || 'Video';
        media.replaceChildren(buildPlayer(source, title, 'spotlight-player'));
        media.classList.add('is-playing');
        track('video-play', { video: { title, host: source.type, from: 'spotlight' } });
      });
    } else {
      play = document.createElement(link ? 'a' : 'span');
      if (link) play.href = link.href;
    }
    play.className = 'spotlight-play';
    if (link) {
      play.setAttribute('aria-label', label);
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
    // a paragraph holding just one link (e.g. "Watch the full story") is a text link with an arrow
    body.querySelectorAll(':scope > p').forEach((p) => {
      const a = p.querySelector(':scope > a:only-child');
      if (a && p.textContent.trim() === a.textContent.trim()) {
        a.className = 'arrow-link';
        p.className = 'spotlight-link';
      }
    });
    block.append(body);
  }
}
