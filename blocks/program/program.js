/**
 * Program — Experience Workspace: the authored step list (<ul>), the panel copy and the
 * duration paragraph are MOVED (never rebuilt) into the nav, `.program-copy` and the
 * control bar; styles reach them through those wrappers.
 */

/**
 * Builds the decorative video control bar of the `video` variant.
 * @param {Element} duration The authored duration element (e.g. "21:15"), moved in
 * @returns {Element} The control bar
 */
function buildControls(duration) {
  const controls = document.createElement('div');
  controls.className = 'program-controls';
  controls.setAttribute('aria-hidden', 'true');
  ['play', 'volume-off'].forEach((name) => {
    const icon = document.createElement('span');
    icon.className = `program-control program-control-${name}`;
    controls.append(icon);
  });
  const track = document.createElement('span');
  track.className = 'program-track';
  controls.append(track);
  if (duration) {
    const time = document.createElement('span');
    time.className = 'program-time';
    // the minus sign is presentation: added by CSS unless authored (EW1 — never edit the text)
    if (!duration.textContent.trim().startsWith('-')) time.classList.add('program-time-remaining');
    time.append(...(duration.tagName === 'P' ? [duration] : duration.childNodes));
    controls.append(time);
  }
  ['list', 'captions'].forEach((name) => {
    const icon = document.createElement('span');
    icon.className = `program-control program-control-${name}`;
    controls.append(icon);
  });
  return controls;
}

/**
 * Turns the authored step list into the vertical step navigation.
 * @param {Element} cell The steps cell
 * @returns {Element} The step navigation
 */
function buildSteps(cell) {
  const nav = document.createElement('nav');
  nav.className = 'program-steps';
  nav.setAttribute('aria-label', 'Program steps');
  // the authored list is the editable unit: move it whole and decorate its items in place
  const authoredList = cell?.querySelector('ul, ol');
  const list = authoredList || document.createElement('ul');
  const items = authoredList ? [...authoredList.querySelectorAll(':scope > li')] : [];
  const sources = items.length ? items : [...(cell?.querySelectorAll('p') || [])];
  const here = window.location.pathname.replace(/\/$/, '');
  // bold paragraphs may already have been turned into buttons by decorateButtons
  const isBold = (el) => !!el.querySelector('strong, b, a.button');
  const explicit = sources.some(isBold);
  const isCurrent = (a) => !!a && new URL(a.href, window.location).pathname.replace(/\/$/, '') === here;

  sources.forEach((source) => {
    const isItem = source.tagName === 'LI';
    const li = isItem ? source : document.createElement('li');
    li.classList.add('program-step');
    const link = source.querySelector('a');
    const active = explicit ? isBold(source) : isCurrent(link);
    // unwrap the bold marker (presentation only; the text content is unchanged)
    source.querySelectorAll('strong, b').forEach((el) => el.replaceWith(...el.childNodes));
    let target;
    if (link) {
      target = link;
      target.removeAttribute('class');
    } else {
      // move the step's own nodes into a label span (never copy them)
      target = document.createElement('span');
      target.append(...source.childNodes);
    }
    if (active) {
      li.classList.add('active');
      if (link) link.setAttribute('aria-current', 'page');
    }
    // steps carrying an icon (e.g. "Meet with SEI :calendar:") are compact action rows
    const icon = target.querySelector('.icon');
    if (icon) {
      li.classList.add('program-action');
      const img = icon.querySelector('img');
      const name = [...icon.classList].find((c) => c.startsWith('icon-'))?.substring(5);
      const src = img?.src || (name ? `${window.hlx?.codeBasePath || ''}/icons/${name}.svg` : '');
      if (src) icon.style.maskImage = `url('${src}')`;
    }
    if (isItem) {
      if (target.parentElement !== li) li.append(target);
    } else {
      // a paragraph step keeps its <p> (the editor index lives on it)
      source.replaceChildren(target);
      li.append(source);
      list.append(li);
    }
  });

  if (list.children.length && !list.querySelector('.active')) list.firstElementChild.classList.add('active');
  nav.append(list);
  return nav;
}

/**
 * Program: the SEI Pathfinder module, a vertical step nav beside a content panel.
 * Row 1 cells: [steps] [panel]
 *  - steps: a list of links (or one paragraph per step). Bold (`<strong>`) marks the active step;
 *    without bold, the step linking to the current page (else the first) is active.
 *    Steps that contain an icon (`:calendar:`, `:download:`) render as compact action rows.
 *  - panel: default content (headings, paragraphs, `code` chips, buttons). A paragraph holding
 *    only an icon renders as a cyan badge.
 * Row 2 (optional, `video` variant): [duration, e.g. "21:15"] shown in the control bar.
 * A `specialist` block placed directly after this block (same section) is moved into the panel.
 * Variants: `video` (panel styled as a video poster: grey, brand circles, control bar)
 * @param {Element} block The program block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  const [mainRow, ...extraRows] = rows;
  const cells = mainRow ? [...mainRow.children] : [];
  const [stepsCell, panelCell] = cells.length > 1 ? cells : [null, cells[0]];
  const durationCell = extraRows[0]?.firstElementChild;
  const duration = durationCell?.textContent.trim()
    ? (durationCell.querySelector('p') || durationCell) : null;

  const steps = buildSteps(stepsCell);

  const panel = document.createElement('div');
  panel.className = 'program-panel';
  const body = document.createElement('div');
  body.className = 'program-body';
  // authored panel copy moves into .program-copy (kept apart from an adopted specialist block)
  const copy = document.createElement('div');
  copy.className = 'program-copy';
  if (panelCell) copy.append(...panelCell.childNodes);
  [...copy.querySelectorAll(':scope > p')].forEach((p) => {
    const icon = p.querySelector(':scope > .icon');
    if (icon && !p.textContent.trim() && p.children.length === 1) {
      const badge = document.createElement('div');
      badge.className = 'program-badge';
      p.replaceWith(badge);
      badge.append(p);
    }
  });
  body.append(copy);
  panel.append(body);

  if (block.classList.contains('video')) {
    body.classList.add('program-poster');
    const art = document.createElement('div');
    art.className = 'program-art';
    art.setAttribute('aria-hidden', 'true');
    body.prepend(art);
    panel.append(buildControls(duration));
  }

  // blocks cannot nest in authored markup: adopt a specialist block authored right after
  const next = block.parentElement?.nextElementSibling;
  if (next && next.matches('.specialist-wrapper')) {
    next.classList.add('program-specialist');
    body.append(next);
  }

  block.replaceChildren(steps, panel);
}
