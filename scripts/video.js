/*
 * Shared video playback for blocks (video, spotlight): recognises the video links authors use
 * and builds the matching player.
 *  - Brightcove player URL
 *    (https://players.brightcove.net/<account>/<player>_default/index.html?videoId=<id>)
 *  - AEM Assets (Dynamic Media with OpenAPI) delivery URL
 *    (https://delivery-pXXXX-eYYYY.adobeaemcloud.com/adobe/assets/urn:aaid:aem:…)
 *  - an .mp4 file
 * Brightcove and AEM Assets play in their own players (adaptive streaming, captions, their
 * analytics); .mp4 plays in the browser's player.
 */

const AEM_ASSETS = /^delivery-p\d+-e\d+\.adobeaemcloud\.com$/;
const BRIGHTCOVE = /^\/\d+\/[\w-]+_[\w-]+\/index\.html$/;

/**
 * Works out how to play a video link.
 * @param {string} href The authored link
 * @returns {{type: string, src: string}|null} The player type and source, or null if the link
 * is not a playable video (e.g. a page link)
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

/**
 * Builds the player element for a video source.
 * @param {{type: string, src: string}} source From videoSource()
 * @param {string} title Accessible name for the player
 * @param {string} [className] Class for the player element
 * @returns {HTMLVideoElement|HTMLIFrameElement} The player
 */
export function buildPlayer(source, title, className = 'video-player') {
  if (source.type === 'mp4') {
    const video = document.createElement('video');
    video.className = className;
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.src = source.src;
    video.setAttribute('aria-label', title);
    return video;
  }
  const frame = document.createElement('iframe');
  frame.className = className;
  frame.src = source.src;
  frame.title = title;
  frame.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
  frame.allowFullscreen = true;
  frame.loading = 'lazy';
  return frame;
}
