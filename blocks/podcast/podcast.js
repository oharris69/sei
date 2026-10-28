import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Podcast: a static podcast-player card (cover art, show, episode title, play button,
 * progress bar, waveform, provider logo and small action icons).
 *
 * Content model — one row, cells in any order:
 *  - picture-only cell → cover art (the first one); a second picture-only cell → provider logo
 *  - text cell →
 *      p              show name (paragraph before the heading), e.g. "SEI Podcasts"
 *      h2–h4          episode title
 *      p > a          episode link (play button / info / share fall back to it)
 *      p > a .mp3…    audio file: play toggles an <audio> element and the bar seeks
 *      p > a "RSS"    feed link (rss icon) — link text or href containing rss/feed
 *      p "32:15"      optional duration, shown as remaining time until the audio loads
 * @param {Element} block The podcast block element
 */

const AUDIO_RE = /\.(mp3|m4a|aac|ogg|oga|wav|opus)(\?|#|$)/i;
const FEED_RE = /\b(rss|feed)\b/i;
const DURATION_RE = /^\d{1,2}(:\d{2}){1,2}$/;

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const s = Math.floor(seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = String(s % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${sec}` : `${m}:${sec}`;
}

function parseTime(text) {
  return text.split(':').reduce((total, part) => total * 60 + Number(part), 0);
}

/** deterministic, speech-like bar heights (percent) so the waveform is stable between loads */
function waveformHeights(count, seedText) {
  let seed = [...seedText].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 2147483647, 7) || 7;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  return Array.from({ length: count }, (_, i) => {
    const envelope = i < count * 0.18 ? 1 : 0.42 + 0.12 * Math.sin(i / 9);
    const value = (0.25 + 0.75 * rand()) * envelope;
    return Math.max(8, Math.round(value * 100));
  });
}

function iconLink(name, label, href) {
  const el = document.createElement(href ? 'a' : 'button');
  el.className = `podcast-action podcast-action-${name}`;
  el.setAttribute('aria-label', label);
  el.title = label;
  if (href) {
    el.href = href;
  } else {
    el.type = 'button';
  }
  return el;
}

export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const pictureCells = cells.filter((c) => c.querySelector('picture') && !c.textContent.trim());
  const [coverCell, logoCell] = pictureCells;
  const textCell = cells.find((c) => !pictureCells.includes(c) && c.textContent.trim());

  const heading = textCell?.querySelector('h1, h2, h3, h4, h5, h6');
  const title = heading?.textContent.trim() || '';
  const links = [...(textCell?.querySelectorAll('a') || [])];
  const audioLink = links.find((a) => AUDIO_RE.test(a.getAttribute('href') || ''));
  const feedLink = links.find((a) => a !== audioLink
    && (FEED_RE.test(a.textContent) || FEED_RE.test(a.getAttribute('href') || '')));
  const episodeLink = links.find((a) => a !== audioLink && a !== feedLink);
  const paragraphs = [...(textCell?.querySelectorAll('p') || [])].filter((p) => !p.querySelector('a'));
  const durationP = paragraphs.find((p) => DURATION_RE.test(p.textContent.trim()));
  const textChildren = [...(textCell?.children || [])];
  const headingIndex = heading ? textChildren.indexOf(heading) : -1;
  const showP = paragraphs.find((p) => p !== durationP
    && (headingIndex < 0 || textChildren.indexOf(p) < headingIndex));

  const episodeHref = episodeLink?.href || audioLink?.href || '';
  let duration = durationP ? parseTime(durationP.textContent.trim()) : 0;

  block.textContent = '';

  // cover art
  if (coverCell) {
    const img = coverCell.querySelector('img');
    const cover = document.createElement('div');
    cover.className = 'podcast-cover';
    cover.append(createOptimizedPicture(img.src, img.alt, false, [{ width: '450' }]));
    block.append(cover);
  }

  const main = document.createElement('div');
  main.className = 'podcast-main';

  // header: show, title, provider logo + actions
  const header = document.createElement('div');
  header.className = 'podcast-header';
  const meta = document.createElement('div');
  meta.className = 'podcast-meta';
  if (showP) {
    const show = document.createElement('p');
    show.className = 'podcast-show';
    show.textContent = showP.textContent.trim();
    meta.append(show);
  }
  if (heading) {
    heading.className = 'podcast-title';
    meta.append(heading);
  }
  header.append(meta);

  const tools = document.createElement('div');
  tools.className = 'podcast-tools';
  if (logoCell) {
    const img = logoCell.querySelector('img');
    const logo = createOptimizedPicture(img.src, img.alt, false, [{ width: '240' }]);
    logo.classList.add('podcast-logo');
    tools.append(logo);
  }
  const actions = document.createElement('div');
  actions.className = 'podcast-actions';
  if (episodeHref) actions.append(iconLink('info', 'Episode details', episodeHref));
  if (feedLink) actions.append(iconLink('rss', 'Subscribe via RSS', feedLink.href));
  if (audioLink || episodeHref) {
    const download = iconLink('download', 'Download episode', audioLink?.href || episodeHref);
    if (audioLink) download.setAttribute('download', '');
    actions.append(download);
  }
  const share = iconLink('share', 'Share episode');
  share.addEventListener('click', async () => {
    const url = episodeHref || window.location.href;
    try {
      if (navigator.share) await navigator.share({ title, url });
      else await navigator.clipboard.writeText(url);
    } catch (e) {
      // user cancelled or clipboard blocked; nothing to do
    }
  });
  actions.append(share);
  tools.append(actions);
  header.append(tools);
  main.append(header);

  // player: play button, times, progress
  const player = document.createElement('div');
  player.className = 'podcast-player';

  const play = document.createElement(audioLink || !episodeHref ? 'button' : 'a');
  play.className = 'podcast-play';
  play.setAttribute('aria-label', `Play episode${title ? `: ${title}` : ''}`);
  if (play.tagName === 'A') play.href = episodeHref;
  else play.type = 'button';
  player.append(play);

  const timeline = document.createElement('div');
  timeline.className = 'podcast-timeline';
  const times = document.createElement('div');
  times.className = 'podcast-times';
  const current = document.createElement('span');
  current.className = 'podcast-current';
  current.textContent = '0:00';
  const remaining = document.createElement('span');
  remaining.className = 'podcast-remaining';
  remaining.textContent = `-${formatTime(duration)}`;
  times.append(current, remaining);

  const progress = document.createElement('input');
  progress.type = 'range';
  progress.className = 'podcast-progress';
  progress.min = 0;
  progress.max = 1000;
  progress.step = 1;
  progress.value = 0;
  progress.setAttribute('aria-label', 'Seek');
  if (!audioLink) {
    progress.disabled = true;
    progress.tabIndex = -1;
  }
  timeline.append(times, progress);
  player.append(timeline);
  main.append(player);

  // waveform (decorative)
  const wave = document.createElement('div');
  wave.className = 'podcast-wave';
  wave.setAttribute('aria-hidden', 'true');
  waveformHeights(160, title || 'podcast').forEach((h) => {
    const bar = document.createElement('span');
    bar.style.height = `${h}%`;
    wave.append(bar);
  });
  main.append(wave);
  block.append(main);

  const setProgress = (ratio) => {
    const r = Math.min(1, Math.max(0, ratio || 0));
    block.style.setProperty('--podcast-progress', `${r * 100}%`);
    progress.value = Math.round(r * 1000);
  };
  setProgress(0);

  if (!audioLink) return;

  // live audio
  const audio = document.createElement('audio');
  audio.preload = 'metadata';
  audio.src = audioLink.href;
  block.append(audio);

  const update = () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) duration = audio.duration;
    current.textContent = formatTime(audio.currentTime);
    remaining.textContent = `-${formatTime(Math.max(0, duration - audio.currentTime))}`;
    setProgress(duration ? audio.currentTime / duration : 0);
  };
  const setPlaying = (playing) => {
    block.classList.toggle('is-playing', playing);
    play.setAttribute('aria-label', `${playing ? 'Pause' : 'Play'} episode${title ? `: ${title}` : ''}`);
  };

  play.addEventListener('click', () => {
    if (audio.paused) audio.play().catch(() => setPlaying(false));
    else audio.pause();
  });
  progress.addEventListener('input', () => {
    if (duration) audio.currentTime = (progress.value / 1000) * duration;
    update();
  });
  audio.addEventListener('loadedmetadata', update);
  audio.addEventListener('timeupdate', update);
  audio.addEventListener('play', () => setPlaying(true));
  audio.addEventListener('pause', () => setPlaying(false));
  audio.addEventListener('ended', () => setPlaying(false));
}
