/**
 * @ew-exempt <ul> group options — structure: each option is a toggle <button> label (EW7)
 * @ew-exempt <p> group tone cell (green / orange / cyan) — config, never displayed
 */
import { createOptimizedPicture } from '../../scripts/aem.js';

const TONES = ['green', 'orange', 'cyan'];

function toSlug(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/**
 * Reads the options of a group cell: list items or paragraphs, each with an optional icon.
 * @param {Element} cell The options cell
 * @returns {{label: string, icon: Element|null}[]}
 */
function readOptions(cell) {
  let items = [...cell.querySelectorAll('li')];
  if (!items.length) items = [...cell.querySelectorAll('p')];
  if (!items.length && cell.textContent.trim()) items = [cell];
  return items
    .map((item) => ({ label: item.textContent.trim(), icon: item.querySelector('.icon') }))
    .filter((option) => option.label);
}

/**
 * Strategy finder: heading and criteria tiles beside an image with a results CTA.
 * Row 1 cells: [h1, intro p] [picture, p > a results link]
 * Following rows (one per criteria group):
 * [group label] [list of options, each `:icon-name: Label`] [optional tone: green | orange | cyan]
 * Tiles are toggle buttons; the CTA carries the selections as query parameters.
 * Groups with four or more options render as stacked (icon above label) tiles.
 * @param {Element} block The strategy-finder block element
 */
export default function decorate(block) {
  const [introRow, ...groupRows] = [...block.children];
  const [introCell, mediaCell] = introRow ? [...introRow.children] : [];
  block.textContent = '';

  const main = document.createElement('div');
  main.className = 'strategy-finder-main';
  if (introCell) {
    introCell.className = 'strategy-finder-intro';
    main.append(introCell);
  }

  const groups = document.createElement('div');
  groups.className = 'strategy-finder-groups';
  main.append(groups);
  block.append(main);

  let cta;
  const selections = new Map();
  const updateCta = () => {
    if (!cta) return;
    const url = new URL(cta.dataset.baseHref, window.location.href);
    selections.forEach((values, key) => {
      if (values.size) url.searchParams.set(key, [...values].join(','));
    });
    cta.href = url.origin === window.location.origin ? `${url.pathname}${url.search}` : url.href;
    // Figma: the results button turns dark once anything is picked
    cta.classList.toggle('is-ready', [...selections.values()].some((values) => values.size));
  };

  groupRows.forEach((row, index) => {
    const [labelCell, optionsCell, toneCell] = [...row.children];
    if (!labelCell || !optionsCell) return;
    const labelText = labelCell.textContent.trim();
    const options = readOptions(optionsCell);
    if (!options.length) return;

    const requestedTone = toneCell?.textContent.trim().toLowerCase();
    const tone = TONES.includes(requestedTone) ? requestedTone : TONES[index % TONES.length];
    const key = toSlug(labelText.replace(/^by\s+/i, '')) || `group-${index + 1}`;
    selections.set(key, new Set());

    const group = document.createElement('div');
    group.className = `strategy-finder-group tone-${tone}`;
    group.setAttribute('role', 'group');

    // the authored label paragraph MOVES into the label wrapper (EW1); the text fallback is
    // only for a cell without a paragraph (off-pipeline content)
    const heading = document.createElement('div');
    heading.className = 'strategy-finder-label';
    heading.id = `strategy-finder-${key}`;
    const labelPar = labelCell.querySelector('p');
    if (labelPar) heading.append(labelPar);
    else heading.textContent = labelText;
    group.setAttribute('aria-labelledby', heading.id);
    group.append(heading);

    const tiles = document.createElement('div');
    tiles.className = 'strategy-finder-tiles';
    if (options.length >= 4) tiles.classList.add('stacked');
    tiles.style.setProperty('--tile-count', options.length);
    tiles.style.setProperty('--tile-cols', options.length >= 4 ? 2 : options.length);

    options.forEach(({ label, icon }) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'strategy-finder-tile';
      button.setAttribute('aria-pressed', 'false');
      const iconWrap = document.createElement('span');
      iconWrap.className = 'strategy-finder-icon';
      iconWrap.setAttribute('aria-hidden', 'true');
      if (icon) iconWrap.append(icon);
      const text = document.createElement('span');
      text.className = 'strategy-finder-text';
      text.textContent = label;
      button.append(iconWrap, text);
      button.addEventListener('click', () => {
        const pressed = button.getAttribute('aria-pressed') !== 'true';
        button.setAttribute('aria-pressed', String(pressed));
        const values = selections.get(key);
        if (pressed) values.add(toSlug(label));
        else values.delete(toSlug(label));
        // Figma: once a group has a pick, its other tiles fade back
        group.classList.toggle('has-selection', values.size > 0);
        updateCta();
      });
      tiles.append(button);
    });

    group.append(tiles);
    groups.append(group);
  });

  if (mediaCell) {
    mediaCell.className = 'strategy-finder-media';
    const img = mediaCell.querySelector('img');
    if (img) {
      const optimized = createOptimizedPicture(img.src, img.alt, true, [{ media: '(width >= 900px)', width: '800' }, { width: '750' }]);
      // keep the AUTHORED img (it carries the editor's image index): take the optimized
      // sources and attributes, then move it into a picture at the top of the cell
      const holder = img.closest('picture') || img;
      const wrapper = holder.parentElement !== mediaCell ? holder.closest('p') : null;
      const fresh = optimized.querySelector('img');
      [...fresh.attributes].forEach(({ name, value }) => img.setAttribute(name, value));
      const picture = holder.matches('picture') ? holder : document.createElement('picture');
      picture.querySelectorAll('source').forEach((source) => source.remove());
      picture.prepend(...optimized.querySelectorAll('source'));
      picture.append(img);
      mediaCell.prepend(picture);
      if (wrapper && !wrapper.textContent.trim() && !wrapper.querySelector('img')) wrapper.remove();
    }
    cta = mediaCell.querySelector('a');
    if (cta) {
      cta.className = 'strategy-finder-cta';
      cta.dataset.baseHref = cta.getAttribute('href');
      // the CTA moves as its authored <p> into a wrapper that carries the class (EW3)
      const ctaWrap = document.createElement('div');
      ctaWrap.className = 'strategy-finder-cta-wrapper';
      const par = cta.closest('p');
      if (par) par.removeAttribute('class');
      (par || cta).before(ctaWrap);
      ctaWrap.append(par || cta);
    }
    block.append(mediaCell);
  }
}
