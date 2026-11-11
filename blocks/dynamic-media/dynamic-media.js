/**
 * Dynamic Media — Experience Workspace: caption content is MOVED into the <figcaption>; every
 * other row is configuration consumed into attributes and URLs.
 * @ew-exempt <p> asset URL row — config: rendered as picture/player URLs (metadata)
 * @ew-exempt <p> `Alt` / `Caption` / `Crop` / `Ratio` / `Type` label cells — row keys (metadata)
 * @ew-exempt <p> Alt, Crop, Ratio, Type values — rendered as img alt / URL params (metadata)
 */
import { videoSource, buildPlayer } from '../../scripts/video.js';

/*
 * Dynamic Media: an Adobe Dynamic Media image or video, by URL.
 * Rows (authors may leave rows out; labelled rows can come in any order):
 *  - the asset URL (a link or plain text) → required
 *  - `Alt | text` → alt text for an image
 *  - `Caption | text` → caption (a <figcaption>; links and emphasis are kept)
 *  - `Crop | name` → smart crop or preset: `Large`, `:Large` or `$preset$`
 *  - `Ratio | 16:9` (or `1600x900`) → reserves the space before the image loads
 *  - `Type | video` → treat the URL as a video
 * Unlabelled single-cell rows after the URL are read as alt text, then caption; a row that
 * starts with `$` or `:` is the crop.
 * URL kinds:
 *  - Dynamic Media with OpenAPI (AEM Assets) delivery URLs
 *    https://delivery-pXXXX-eYYYY.adobeaemcloud.com/adobe/assets/urn:aaid:aem:…[/as/<name>.<ext>]
 *    → responsive <picture> (webp + jpg/png, width / quality / smartcrop params); a /play URL or
 *    a video file → the AEM Assets player (scripts/video.js)
 *  - Classic Dynamic Media (Scene7) URLs: https://*.scene7.com/is/image/<company>/<asset> or
 *    /is/image/ on a custom domain → responsive <picture> (wid / fmt / qlt params, crop or
 *    preset); /is/content/… video files → the browser's player (scripts/video.js)
 *  - any other URL scripts/video.js can play (.mp4, Brightcove) → that player
 * Anything else renders as a plain link, and an image that fails to load is swapped for a link.
 * Options (block classes): wide, full, narrow, left, right, rounded.
 */

const OPENAPI_HOST = /^delivery-p\d+-e\d+\.adobeaemcloud\.com$/;
const IMAGE_EXT = /^(jpe?g|png|webp|avif|gif|tiff?|bmp)$/i;
const VIDEO_EXT = /^(mp4|m4v|mov|webm|m3u8|mpd)$/i;
const WIDTHS = [750, 1200, 2000];
const FALLBACK_WIDTH = 1200;
const LABELS = ['alt', 'alttext', 'alternativetext', 'caption', 'crop', 'smartcrop', 'preset',
  'imagepreset', 'ratio', 'aspectratio', 'size', 'dimensions', 'type'];

/** Lower-case extension of the last path segment, or ''. */
function extension(path) {
  const match = path.match(/\.([a-z0-9]+)$/i);
  return match ? match[1].toLowerCase() : '';
}

/** Parses an authored ratio (`16:9`, `4/3`, `1600x900`) into width and height. */
function parseRatio(text) {
  const match = (text || '').match(/(\d+(?:\.\d+)?)\s*[:/x×]\s*(\d+(?:\.\d+)?)/i);
  if (!match) return null;
  const w = parseFloat(match[1]);
  const h = parseFloat(match[2]);
  if (!w || !h) return null;
  // scale small ratios (16:9) up to a realistic pixel size
  const scale = w < 100 ? FALLBACK_WIDTH / w : 1;
  return { width: Math.round(w * scale), height: Math.round(h * scale) };
}

/** Image `sizes` attribute for the block's layout option. */
function sizesFor(block) {
  if (block.classList.contains('full')) return '100vw';
  if (block.classList.contains('narrow')) return '(min-width: 768px) 720px, calc(100vw - 40px)';
  if (block.classList.contains('left') || block.classList.contains('right')) {
    return '(min-width: 900px) min(42vw, 520px), calc(100vw - 40px)';
  }
  return '(min-width: 1280px) 1232px, calc(100vw - 48px)';
}

/**
 * Builds the URL for one rendition of a Dynamic Media with OpenAPI image.
 * @param {URL} url Authored delivery URL
 * @param {string} format webp, jpg or png
 * @param {number} width Rendition width
 * @param {string} crop Smart crop name, or ''
 */
function openApiRendition(url, format, width, crop) {
  const [, , , id] = url.pathname.split('/');
  const seo = url.pathname.match(/\/as\/([^/]+)$/)?.[1] || '';
  const name = seo.replace(/\.[^.]+$/, '') || 'image';
  const out = new URL(`/adobe/assets/${id}/as/${name}.${format}`, url.origin);
  url.searchParams.forEach((value, key) => {
    if (!['width', 'height', 'quality', 'preferwebp', 'format', 'smartcrop'].includes(key)) {
      out.searchParams.set(key, value);
    }
  });
  out.searchParams.set('width', width);
  if (crop) out.searchParams.set('smartcrop', crop.replace(/^[:$]+|\$+$/g, ''));
  out.searchParams.set('quality', '85');
  if (format !== 'webp') out.searchParams.set('preferwebp', 'true');
  return out.href;
}

/**
 * Builds the URL for one rendition of a Scene7 image. Built by hand: Scene7 presets are bare
 * `$name$` query keys that URLSearchParams would encode.
 * @param {URL} url Authored Scene7 URL
 * @param {string} format webp, jpg or png
 * @param {number} width Rendition width
 * @param {string} crop `:crop`, `crop` or `$preset$`, or ''
 */
function scene7Rendition(url, format, width, crop) {
  let path = url.pathname;
  const params = url.search.replace(/^\?/, '').split('&')
    .filter((p) => p && !/^(wid|hei|fmt|qlt|scl|fit)=/i.test(p));
  if (crop) {
    if (/^\$.+\$$/.test(crop)) {
      if (!params.includes(crop)) params.unshift(crop);
    } else {
      // smart crop: <asset>:<crop>, replacing any authored crop
      const asset = path.split('/').pop().replace(/:.*$/, '');
      path = `${path.slice(0, path.lastIndexOf('/') + 1)}${asset}:${encodeURIComponent(crop.replace(/^:/, ''))}`;
    }
  }
  params.push(`wid=${width}`, `fmt=${format}`, 'qlt=85');
  return `${url.origin}${path}?${params.join('&')}`;
}

/**
 * Works out what an authored URL is.
 * @returns {{kind: string, url?: URL, format?: string, source?: object}}
 */
function classify(href, wantsVideo) {
  let url;
  try {
    url = new URL(href, window.location.href);
  } catch {
    return { kind: 'unknown' };
  }
  if (!/^https?:$/.test(url.protocol)) return { kind: 'unknown' };

  if (OPENAPI_HOST.test(url.hostname) && /^\/adobe\/assets\/[^/]+/.test(url.pathname)) {
    const [, , , id] = url.pathname.split('/');
    const asPart = url.pathname.match(/\/as\/([^/]+)$/);
    const ext = asPart ? extension(asPart[1]) : '';
    if (wantsVideo || /\/play\/?$/.test(url.pathname) || VIDEO_EXT.test(ext)) {
      const play = new URL(`/adobe/assets/${id}/play`, url.origin);
      url.searchParams.forEach((value, key) => play.searchParams.set(key, value));
      if (!play.searchParams.has('autoplay')) play.searchParams.set('autoplay', '0');
      const source = videoSource(play.href);
      return source ? { kind: 'video', source } : { kind: 'unknown' };
    }
    if (ext && !IMAGE_EXT.test(ext)) return { kind: 'unknown' };
    return {
      kind: 'openapi', url, format: ['png', 'gif'].includes(ext) ? 'png' : 'jpg',
    };
  }

  const scene7 = /(^|\.)scene7\.com$/i.test(url.hostname);
  if (/\/is\/image\//.test(url.pathname) && (scene7 || /^\/is\/image\/[^/]+\/[^/]+/.test(url.pathname))) {
    return { kind: 'scene7', url, format: 'jpg' };
  }
  if (/\/is\/content\//.test(url.pathname)) {
    if (wantsVideo || VIDEO_EXT.test(extension(url.pathname))) {
      return { kind: 'video', source: { type: 'mp4', src: url.href } };
    }
    return { kind: 'unknown' };
  }

  const source = videoSource(url.href);
  if (source) {
    if (source.type === 'brightcove') {
      const player = new URL(source.src);
      if (!url.searchParams.has('autoplay')) player.searchParams.set('autoplay', 'false');
      source.src = player.href;
    }
    return { kind: 'video', source };
  }
  return { kind: 'unknown' };
}

/** Plain link shown when the URL can't be rendered as media. */
function fallbackLink(href, text) {
  const p = document.createElement('p');
  p.className = 'dynamic-media-fallback';
  if (!href) {
    p.textContent = text || '';
    return p;
  }
  const a = document.createElement('a');
  a.href = href;
  a.textContent = text || href;
  p.append(a);
  return p;
}

/**
 * Builds a responsive picture for an OpenAPI or Scene7 image.
 */
function buildPicture(info, {
  alt, crop, ratio, eager, sizes,
}) {
  const rendition = info.kind === 'openapi' ? openApiRendition : scene7Rendition;
  const srcset = (format, max = Infinity) => WIDTHS.filter((w) => w <= max)
    .map((w) => `${rendition(info.url, format, w, crop)} ${w}w`).join(', ');

  const picture = document.createElement('picture');
  const webp = document.createElement('source');
  webp.type = 'image/webp';
  webp.srcset = srcset('webp');
  webp.sizes = sizes;
  picture.append(webp);

  const img = document.createElement('img');
  img.alt = alt;
  img.srcset = srcset(info.format);
  img.sizes = sizes;
  img.src = rendition(info.url, info.format, FALLBACK_WIDTH, crop);
  img.loading = eager ? 'eager' : 'lazy';
  img.decoding = 'async';
  if (eager) img.fetchPriority = 'high';
  if (ratio) {
    img.width = ratio.width;
    img.height = ratio.height;
  }
  picture.append(img);

  // some Dynamic Media accounts cap the rendition size: retry once without the large
  // candidates, and only then give up (the caller swaps in a link)
  let retried = false;
  img.addEventListener('error', (e) => {
    if (retried) return;
    retried = true;
    e.stopImmediatePropagation();
    webp.srcset = srcset('webp', FALLBACK_WIDTH);
    img.srcset = srcset(info.format, FALLBACK_WIDTH);
  });
  return picture;
}

/** Reads the authored rows into a plain description of the asset. */
function readRows(block) {
  const config = {
    href: '', text: '', alt: '', crop: '', ratio: null, type: '', caption: [],
  };
  const loose = [];
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (!row.textContent.trim() && !row.querySelector('a[href]')) return;
    const label = cells.length >= 2
      ? cells[0].textContent.trim().toLowerCase().replace(/[^a-z]/g, '') : '';
    if (['url', 'link', 'asset', 'src', 'source'].includes(label)) {
      const link = cells[1].querySelector('a[href]');
      config.href = link ? link.getAttribute('href') : cells[1].textContent.trim();
      config.text = link ? link.textContent.trim() : '';
      return;
    }
    if (!config.href && !LABELS.includes(label)) {
      const link = row.querySelector('a[href]');
      const text = row.textContent.trim();
      if (link || /^https?:\/\//i.test(text)) {
        config.href = link ? link.getAttribute('href') : text.split(/\s+/)[0];
        config.text = link ? link.textContent.trim() : '';
        return;
      }
    }
    if (cells.length >= 2) {
      const key = label;
      const valueCell = cells[1];
      const value = valueCell.textContent.trim();
      if (['alt', 'alttext', 'alternativetext'].includes(key)) config.alt = value;
      else if (key === 'caption') config.caption = [...valueCell.childNodes];
      else if (['crop', 'smartcrop', 'preset', 'imagepreset'].includes(key)) config.crop = value;
      else if (['ratio', 'aspectratio', 'size', 'dimensions'].includes(key)) {
        config.ratio = parseRatio(value);
      } else if (key === 'type') config.type = value.toLowerCase();
      else loose.push(valueCell);
      return;
    }
    const cell = cells[0] || row;
    const text = cell.textContent.trim();
    if (/^(\$[^$\s]+\$|:\S+)$/.test(text)) config.crop = text;
    else loose.push(cell);
  });

  // unlabelled rows: alt text, then caption; formatted text or links are always caption
  loose.forEach((cell) => {
    const formatted = cell.querySelector('a, em, strong, ul, ol');
    if (!formatted && !config.alt && !config.caption.length) {
      config.alt = cell.textContent.trim();
    } else if (!config.caption.length) {
      config.caption = [...cell.childNodes];
    } else {
      config.caption.push(...cell.childNodes);
    }
  });
  return config;
}

/**
 * @param {Element} block The dynamic-media block
 */
export default function decorate(block) {
  const config = readRows(block);
  const eager = block.closest('main')?.querySelector('.block') === block;
  const info = config.href
    ? classify(config.href, config.type === 'video')
    : { kind: 'unknown' };

  const figure = document.createElement('figure');
  figure.className = 'dynamic-media-figure';
  const frame = document.createElement('div');
  frame.className = 'dynamic-media-media';

  if (info.kind === 'openapi' || info.kind === 'scene7') {
    block.classList.add('is-image', `is-${info.kind}`);
    const picture = buildPicture(info, {
      alt: config.alt,
      crop: config.crop,
      ratio: config.ratio,
      eager,
      sizes: sizesFor(block),
    });
    if (config.ratio) frame.style.aspectRatio = `${config.ratio.width} / ${config.ratio.height}`;
    picture.querySelector('img').addEventListener('error', () => {
      // never leave a broken image: fall back to a link to the asset
      frame.style.removeProperty('aspect-ratio');
      block.classList.remove('is-image');
      block.classList.add('is-fallback');
      frame.replaceChildren(fallbackLink(config.href, config.alt || config.text || 'View image'));
    });
    frame.append(picture);
  } else if (info.kind === 'video') {
    block.classList.add('is-video');
    const title = config.alt || (config.text && config.text !== config.href ? config.text : 'Video');
    const player = buildPlayer(info.source, title, 'dynamic-media-player');
    if (player.tagName === 'VIDEO') {
      // inline, not autoplaying: never compete with the page load
      player.autoplay = false;
      player.removeAttribute('autoplay');
      player.preload = 'metadata';
    }
    if (config.ratio) frame.style.aspectRatio = `${config.ratio.width} / ${config.ratio.height}`;
    frame.append(player);
  } else {
    block.classList.add('is-fallback');
    frame.append(fallbackLink(config.href, config.text || config.alt));
  }
  figure.append(frame);

  if (config.caption.length && config.caption.some((n) => n.textContent.trim())) {
    const caption = document.createElement('figcaption');
    caption.className = 'dynamic-media-caption';
    caption.append(...config.caption);
    figure.append(caption);
  }
  block.replaceChildren(figure);
}
