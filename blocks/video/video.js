import { createOptimizedPicture } from '../../scripts/aem.js';
import { track } from '../../scripts/profile.js';
import { videoSource, buildPlayer } from '../../scripts/video.js';

/*
 * Video: a poster that turns into a player when clicked.
 * Rows / cells (any order):
 *  - a picture → poster
 *  - a link → the video, one of:
 *    - a Brightcove player URL
 *      (https://players.brightcove.net/<account>/<player>_default/index.html?videoId=<id>)
 *    - an AEM Assets (Dynamic Media with OpenAPI) delivery URL
 *      (https://delivery-pXXXX-eYYYY.adobeaemcloud.com/adobe/assets/urn:aaid:aem:…)
 *    - an .mp4
 *  - other text → caption under the player
 * Brightcove and AEM Assets links play in their own players (adaptive streaming, captions,
 * their analytics); .mp4 links play in the browser's player (see scripts/video.js). Without a
 * usable link the poster shows on its own.
 */

/**
 * @param {Element} block The video block
 */
export default function decorate(block) {
  const img = block.querySelector('img');
  const link = block.querySelector('a[href]');
  const source = link ? videoSource(link.getAttribute('href')) : null;
  const title = (link?.textContent.trim() && link.textContent.trim() !== link.getAttribute('href'))
    ? link.textContent.trim() : (img?.alt || 'Video');
  const captionText = [...block.querySelectorAll('p')]
    .filter((p) => !p.querySelector('picture, a') && p.textContent.trim());

  const frame = document.createElement('div');
  frame.className = 'video-frame';
  const poster = document.createElement(source ? 'button' : 'div');
  poster.className = 'video-poster';
  if (img) poster.append(createOptimizedPicture(img.src, img.alt, false, [{ width: '1600' }]));
  if (source) {
    poster.type = 'button';
    poster.setAttribute('aria-label', `Play video: ${title}`);
    const play = document.createElement('span');
    play.className = 'video-play';
    play.setAttribute('aria-hidden', 'true');
    poster.append(play);
    poster.addEventListener('click', () => {
      const player = buildPlayer(source, title);
      frame.replaceChildren(player);
      block.classList.add('is-playing');
      if (player.tagName === 'VIDEO') player.focus();
      track('video-play', { video: { title, host: source.type } });
    });
  } else {
    block.classList.add('no-source');
  }
  frame.append(poster);

  const parts = [frame];
  if (captionText.length) {
    const caption = document.createElement('div');
    caption.className = 'video-caption';
    caption.append(...captionText);
    parts.push(caption);
  }
  block.replaceChildren(...parts);
}
