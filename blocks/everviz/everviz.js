/**
 * Everviz — Experience Workspace: the caption is MOVED into the <figcaption> and the
 * description is MOVED into a visually hidden element the figure points at; every other row is
 * configuration consumed into the chart, never displayed.
 * @ew-exempt <p> chart row — Everviz URL or chart id; config, rendered as the chart (metadata)
 * @ew-exempt <p> `Chart` / `Height` / `Alt` / `Description` / `Caption` label cells — row keys
 * @ew-exempt <p> Height value — rendered as the chart height (metadata)
 */

/*
 * Everviz: one Everviz chart, layout or table (formerly Highcharts Cloud), embedded the way
 * seic.com does it.
 * Rows (authors may leave rows out or add stray empty ones; labelled rows in any order):
 *  - the chart (required): an Everviz URL in any form — inject, embed or share link, as a link
 *    or plain text, a pasted seic.com embed snippet — or, in the first row only, a bare chart id
 *  - `Height | 600` → chart height in px (iframe height; space reserved while loading).
 *    Default 500px in iframe mode, 400px reserved in inject mode.
 *  - `Alt | text` (or `Description | text`) → accessible description of the chart
 *  - `Caption | text`, or any other text → caption under the chart (a <figcaption>)
 * Options (block classes):
 *  - (default) inject mode: the Everviz inject script renders the chart inline. The script loads
 *    once the block nears the viewport, at most once per chart id per page. If it fails or
 *    nothing renders within 10s, a "View chart" link to the embed page is shown instead.
 *  - `iframe`: the chart's embed page in a lazy <iframe>.
 *  - `wide` (content column), `narrow` (~720px). Default is a ~960px column.
 * The same chart id twice on one page cannot inject twice (DOM ids are unique), so the second
 * copy falls back to iframe mode.
 */

const ORIGIN = 'https://app.everviz.com';
const ID = '[A-Za-z0-9_-]+';
/** Everviz (or legacy Highcharts Cloud) URL: /inject/<id>, /embed/<id>, /share/<id>, … */
const URL_RE = new RegExp(`(?:everviz\\.com|cloud\\.highcharts\\.com)/(?:inject|embed|share|show|preview|chart|charts|layout|layouts)/(${ID})`, 'i');
/** Container id from a pasted embed snippet: everviz-layout-<id>, highcharts-<id>, … */
const CONTAINER_RE = new RegExp(`\\b(?:everviz-layout|everviz-table|highcharts)-(${ID})`);
/** A bare chart id (first row only); a plain word ("Diversification") is not an id. */
const BARE_RE = /^[A-Za-z0-9_-]{6,20}$/;
const isBareId = (text) => BARE_RE.test(text) && /[A-Z0-9_-]/.test(text.slice(1));
const RENDER_TIMEOUT = 10000;
const INJECT_HEIGHT = 400;
const IFRAME_HEIGHT = 500;

const CHART_LABELS = ['chart', 'chartid', 'id', 'url', 'link', 'src', 'source', 'embed', 'everviz'];
const HEIGHT_LABELS = ['height'];
const DESC_LABELS = ['alt', 'alttext', 'description', 'accessibledescription', 'summary'];
const CAPTION_LABELS = ['caption', 'title'];
const LABELS = [...CHART_LABELS, ...HEIGHT_LABELS, ...DESC_LABELS, ...CAPTION_LABELS];

/** Normalised label of a two-cell row ('' for any other row). */
function labelOf(cells) {
  return cells.length >= 2 ? cells[0].textContent.trim().toLowerCase().replace(/[^a-z]/g, '') : '';
}

/**
 * The chart id in a cell or row, or ''. Links win over text; a bare id counts only when allowed.
 * @param {Element} el
 * @param {boolean} allowBare
 */
function findId(el, allowBare) {
  const sources = [...el.querySelectorAll('a[href]')].map((a) => a.getAttribute('href'));
  const text = el.textContent.trim();
  sources.push(text);
  let id = '';
  sources.some((s) => {
    const m = s.match(URL_RE) || s.match(CONTAINER_RE);
    if (m) [, id] = m;
    return !!id;
  });
  if (!id && allowBare && isBareId(text)) id = text;
  return id;
}

/** Height in px from `600`, `600px`; null when unreadable. */
function parseHeight(text) {
  const m = text.trim().match(/^(\d{2,4})\s*(px)?$/i);
  if (!m) return null;
  const px = Number(m[1]);
  return px >= 100 && px <= 3000 ? px : null;
}

/** The authored content of a cell, as nodes to MOVE (bare text is wrapped in a <p>). */
function contentOf(cell) {
  if (cell.querySelector(':scope > :is(p, ul, ol, h1, h2, h3, h4, h5, h6)')) return [...cell.childNodes];
  const p = document.createElement('p');
  p.append(...cell.childNodes);
  return [p];
}

/** Read the rows into a config; nothing is moved yet. */
function readRows(block) {
  const config = {
    id: '', height: null, desc: null, caption: [],
  };
  let first = true;
  [...block.children].forEach((row) => {
    if (!row.textContent.trim() && !row.querySelector('a[href]')) return;
    const isFirst = first;
    first = false;
    const cells = [...row.children];
    const label = labelOf(cells);
    if (CHART_LABELS.includes(label)) {
      if (!config.id) config.id = findId(cells[1], true);
      return;
    }
    if (HEIGHT_LABELS.includes(label)) {
      config.height = parseHeight(cells[1].textContent) ?? config.height;
      return;
    }
    if (DESC_LABELS.includes(label)) {
      if (cells[1].textContent.trim()) [, config.desc] = cells;
      return;
    }
    if (CAPTION_LABELS.includes(label)) {
      config.caption.push(cells[1]);
      return;
    }
    if (!config.id && !LABELS.includes(label)) {
      const id = findId(row, isFirst);
      if (id) {
        config.id = id;
        return;
      }
    }
    // anything else with text is caption
    cells.forEach((cell) => {
      if (cell.textContent.trim()) config.caption.push(cell);
    });
  });
  return config;
}

/** A DOM id unique on the page. */
function uniqueId(base) {
  let id = base;
  let n = 1;
  while (document.getElementById(id)) {
    n += 1;
    id = `${base}-${n}`;
  }
  return id;
}

/** The "View chart" fallback link. */
function buildFallback(id) {
  const p = document.createElement('p');
  p.className = 'everviz-fallback';
  const a = document.createElement('a');
  a.href = `${ORIGIN}/embed/${id}/`;
  a.target = '_blank';
  a.rel = 'noopener';
  a.textContent = 'View chart';
  a.setAttribute('aria-label', 'View chart (opens in a new tab)');
  p.append(a);
  return p;
}

/** iframe mode: the embed page in a lazy iframe. */
function buildIframe(id, title, height) {
  const iframe = document.createElement('iframe');
  iframe.src = `${ORIGIN}/embed/${id}/`;
  iframe.loading = 'lazy';
  iframe.title = title;
  iframe.setAttribute('allowfullscreen', '');
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  iframe.style.height = `${height}px`;
  return iframe;
}

/**
 * Inject mode: nested containers so both layouts (everviz-layout-<id>), tables
 * (everviz-table-<id>) and single charts (highcharts-<id>) render without knowing the type.
 */
function buildStage(id) {
  const layout = document.createElement('div');
  layout.id = `everviz-layout-${id}`;
  const table = document.createElement('div');
  table.id = `everviz-table-${id}`;
  const chart = document.createElement('div');
  chart.id = `highcharts-${id}`;
  table.append(chart);
  layout.append(table);
  return { layout, skeleton: [layout, table, chart] };
}

/** Load the inject script for a stage, once per id, and watch for the render. */
function inject(block, {
  id, stage, skeleton, frame,
}) {
  const src = `${ORIGIN}/inject/${id}/?v=5`;
  // once per id: a script already in this document (state lives in the DOM, so a re-run of
  // loadPage() on a fresh body — Experience Workspace — loads it again)
  if ([...document.querySelectorAll('script[data-everviz]')].some((s) => s.dataset.everviz === id)) return;

  let fallback = null;
  let timer = 0;
  let poll = 0;
  // rendered = anything Everviz added: new elements (charts, layouts) or a shadow root on one of
  // the skeleton divs (tables render into a shadow root on the container's first child)
  const isRendered = () => [...stage.querySelectorAll('*')].some((el) => el.tagName !== 'SCRIPT'
    && (!skeleton.includes(el) || (el.shadowRoot && el.shadowRoot.childNodes.length)));
  let observer = null;
  const stop = () => {
    observer?.disconnect();
    clearTimeout(timer);
    clearInterval(poll);
  };
  const check = () => {
    if (!isRendered()) return;
    stop();
    fallback?.remove();
    block.classList.remove('is-loading', 'is-fallback');
    block.classList.add('is-rendered');
  };
  const fail = () => {
    clearInterval(poll);
    if (isRendered()) {
      check();
      return;
    }
    if (fallback) return;
    block.classList.remove('is-loading');
    block.classList.add('is-fallback');
    fallback = buildFallback(id);
    frame.append(fallback);
  };
  // a late render (slow network) still replaces the fallback
  observer = new MutationObserver(check);
  observer.observe(stage, { childList: true, subtree: true, attributes: true });
  poll = setInterval(check, 500);

  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  script.dataset.everviz = id;
  script.addEventListener('error', () => {
    // a failed script never renders; stop watching
    stop();
    fail();
  });
  timer = setTimeout(fail, RENDER_TIMEOUT);
  frame.append(script);
}

/**
 * @param {Element} block The everviz block
 */
export default function decorate(block) {
  const config = readRows(block);
  if (!config.id) {
    block.replaceChildren();
    block.classList.add('is-empty');
    return;
  }
  const { id } = config;

  const figure = document.createElement('figure');
  figure.className = 'everviz-figure';
  const frame = document.createElement('div');
  frame.className = 'everviz-frame';
  figure.append(frame);

  let captionText = '';
  if (config.caption.length) {
    const caption = document.createElement('figcaption');
    caption.className = 'everviz-caption';
    config.caption.forEach((cell) => caption.append(...contentOf(cell)));
    captionText = caption.textContent.trim();
    figure.append(caption);
  }
  let descText = '';
  if (config.desc) {
    const desc = document.createElement('div');
    desc.className = 'everviz-description';
    desc.id = uniqueId(`everviz-desc-${id}`);
    desc.append(...contentOf(config.desc));
    descText = desc.textContent.trim();
    figure.append(desc);
    figure.setAttribute('aria-describedby', desc.id);
  }
  if (!captionText) figure.setAttribute('aria-label', descText || 'Chart');

  // the same id twice on a page cannot inject twice: the second copy uses the iframe
  const iframeMode = block.classList.contains('iframe')
    || !!document.getElementById(`everviz-layout-${id}`);

  if (iframeMode) {
    block.classList.add('is-iframe');
    frame.append(buildIframe(id, captionText || descText || 'Everviz chart', config.height || IFRAME_HEIGHT));
    block.replaceChildren(figure);
    return;
  }

  const stage = document.createElement('div');
  stage.className = 'everviz-chart';
  const { layout, skeleton } = buildStage(id);
  stage.append(layout);
  stage.style.setProperty('--everviz-height', `${config.height || INJECT_HEIGHT}px`);
  frame.append(stage);
  block.classList.add('is-loading');
  block.replaceChildren(figure);

  const start = () => inject(block, {
    id, stage, skeleton, frame,
  });
  if (!('IntersectionObserver' in window)) {
    start();
    return;
  }
  const io = new IntersectionObserver((entries) => {
    if (!entries.some((e) => e.isIntersecting)) return;
    io.disconnect();
    start();
  }, { rootMargin: '200px 0px' });
  io.observe(block);
}
