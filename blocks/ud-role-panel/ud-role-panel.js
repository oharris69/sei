import {
  PERSONAS, getProfile, lifecycleStage, onProfileChange, track,
} from '../../scripts/profile.js';
import { whyButton } from '../../scripts/why.js';

/**
 * ud-role-panel — the fold's Yellow base block: copy on the left, the visitor's paths as three
 * equal ink "doors" on the right (uplift variant D). Adapts to the visitor exactly like the
 * site's `adaptive` block (and `ua-role-panel`), with the same content model:
 * Schema: stardust/eds-schema/index-uplift-d.json § recommended.
 *
 *   one row per version: [who it is for] [content]
 *   - who: `default`, or a persona (`advisor`, `ria`, `asset-manager`) optionally followed by
 *     lifecycle stages (`advisor buy expand`)
 *   - content: optional picture (shown as a square plate before the copy), optional short label
 *     paragraph before the heading (becomes the label above the doors), h2, p…, and one
 *     paragraph per path link (plain, <strong> or <em> links all render as the same ink door)
 * Best match wins: persona + current stage, then persona, then default. Every version is
 * decorated once (authored nodes moved, never cloned) and the others are hidden.
 * Persona versions get a "Why am I seeing this?" button.
 * @ew-exempt row key cell (`default`, persona, stages) — text-as-metadata, never displayed
 * Decode tier: reconstructive (one panel per authored version).
 *
 * @param {Element} block The block element
 */
const SVG_NS = 'http://www.w3.org/2000/svg';
const ICONS = {
  arrow: [['path', { d: 'M4 12h15.5M13.5 6l6 6-6 6' }]],
};

/** Presentational outline icon (Nucleo outline style, as in the prototype): no text, hidden. */
function icon(name) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', `ud-icon ud-icon-${name}`);
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  ICONS[name].forEach(([tag, attrs]) => {
    const el = document.createElementNS(SVG_NS, tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    svg.append(el);
  });
  return svg;
}

/** Appends the trailing arrow once (idempotent: re-decoration never doubles it). */
function addArrow(el) {
  if (el && !el.querySelector(':scope > .ud-icon-arrow')) el.append(icon('arrow'));
}

let instance = 0;

function readVersions(block) {
  return [...block.children].map((row) => {
    const [key, content] = row.children;
    const words = (key?.textContent || '').trim().toLowerCase().split(/[\s,]+/).filter(Boolean);
    const persona = words.find((w) => PERSONAS[w]) || null;
    return {
      persona,
      stages: words.filter((w) => w !== persona && w !== 'default'),
      isDefault: words.includes('default') || !words.length,
      content: content || key,
    };
  }).filter((v) => v.content);
}

function pick(versions, profile) {
  const stage = lifecycleStage(profile)?.id;
  const forPersona = versions.filter((v) => v.persona && v.persona === profile.persona);
  return forPersona.find((v) => stage && v.stages.includes(stage))
    || forPersona.find((v) => !v.stages.length)
    || versions.find((v) => v.isDefault)
    || versions[0]
    || null;
}

function isLabel(el) {
  const next = el.nextElementSibling;
  const text = el.textContent.trim();
  return el.matches('p') && next?.matches('h1, h2, h3') && text.length <= 60
    && !el.querySelector('a, picture, img');
}

function div(className) {
  const el = document.createElement('div');
  el.className = className;
  return el;
}

function buildPanel(version, index) {
  const id = `ud-role-panel-${instance}-${index}`;
  const panel = div('ud-role-panel-panel');
  const intro = div('ud-role-panel-intro');
  const doors = div('ud-role-panel-doors');
  doors.setAttribute('role', 'group');
  const list = document.createElement('ul');
  let label = null;

  [...version.content.children].forEach((el) => {
    const picture = el.matches('picture, img') ? el : el.querySelector('picture, img');
    const link = el.matches('p') && el.querySelector('a');
    if (picture && !el.textContent.trim()) {
      const media = div('ud-role-panel-media');
      media.setAttribute('aria-hidden', 'true');
      const img = picture.querySelector('img') || picture;
      img.loading = 'lazy';
      media.append(el);
      panel.prepend(media);
      panel.classList.add('has-media');
    } else if (link && el.textContent.trim() === link.textContent.trim()) {
      // every path is the same ink door, whatever emphasis the author used
      link.classList.remove('button', 'primary', 'secondary', 'accent');
      el.classList.remove('button-wrapper');
      addArrow(link);
      const item = document.createElement('li');
      item.append(el);
      list.append(item);
    } else if (!label && isLabel(el)) {
      label = div('ud-role-panel-label');
      label.id = `${id}-label`;
      label.append(el);
    } else {
      intro.append(el);
    }
  });

  if (version.persona) intro.append(whyButton('ud-role-panel'));
  const heading = intro.querySelector('h1, h2, h3');
  if (label) {
    doors.setAttribute('aria-labelledby', label.id);
    doors.append(label);
  } else if (heading) {
    doors.setAttribute('aria-label', heading.textContent.trim());
  }
  if (list.children.length) doors.append(list);
  panel.append(intro);
  if (list.children.length || label) panel.append(doors);
  panel.dataset.variant = [version.persona || 'default', ...version.stages].join(' ');
  return panel;
}

export default function decorate(block) {
  instance += 1;
  const versions = readVersions(block);
  const panels = versions.map((v, i) => buildPanel(v, i));
  block.replaceChildren(...panels);

  let shown;
  const update = () => {
    const version = pick(versions, getProfile());
    if (!version || version === shown) return;
    shown = version;
    const index = versions.indexOf(version);
    panels.forEach((panel, i) => { panel.hidden = i !== index; });
    block.dataset.variant = panels[index].dataset.variant;
    if (version.persona) {
      track('adaptive-shown', {
        adaptive: { variant: block.dataset.variant, page: window.location.pathname },
      });
    }
  };
  update();
  onProfileChange(update);
}
