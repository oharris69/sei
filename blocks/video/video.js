import { createOptimizedPicture } from '../../scripts/aem.js';
import { track } from '../../scripts/profile.js';

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
 * their analytics); .mp4 links play in the browser's player. Without a usable link the poster
 * shows on its own.
 */

const AEM_ASSETS = /^delivery-p\d+-e\d+\.adobeaemcloud\.com$/;
const BRIGHTCOVE = /^\/\d+\/[\w-]+_[\w-]+\/index\.html$/;

/**
 * Works out how to play a video link.
 * @param {string} href The authored link
 * @returns {{type: string, src: string}|null} The player type and source
 */
export function videoSource(href) {
  let url;
  try {
    url = new URL(href, window.location);
  } catch {
    return null;
  }
  if (AEM_ASSETS.test(url.hostname) && url.pathname.startsWith('/adobe/assets/')) {
    // the asset's own player page: /adobe/assets/<id>/play
    const [, , , id] = url.pathname.split('/');
    const play = new URL(`/adobe/assets/${id}/play`, url.origin);
    url.searchParams.forEach((value, key) => play.searchParams.set(key, value));
    if (!play.searchParams.has('autoplay')) play.searchParams.set('autoplay', '1');
    return { type: 'aem-assets', src: play.href };
  }
  if (url.hostname === 'players.brightcove.net' && BRIGHTCOVE.test(url.pathname)
    && url.searchParams.get('videoId')) {
    const player = new URL(url.href);
    player.protocol = 'https:';
    if (!player.searchParams.has('autoplay')) player.searchParams.set('autoplay', 'true');
    return { type: 'brightcove', src: player.href };
  }
  if (/\.mp4$/i.test(url.pathname)) return { type: 'mp4', src: url.href };
  return null;
}

function buildPlayer(source, title) {
  if (source.type === 'mp4') {
    const video = document.createElement('video');
    video.className = 'video-player';
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.src = source.src;
    video.setAttribute('aria-label', title);
    return video;
  }
  const frame = document.createElement('iframe');
  frame.className = 'video-player';
  frame.src = source.src;
  frame.title = title;
  frame.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
  frame.allowFullscreen = true;
  frame.loading = 'lazy';
  return frame;
}

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
