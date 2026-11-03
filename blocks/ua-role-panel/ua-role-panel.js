import {
  PERSONAS, getProfile, lifecycleStage, onProfileChange, track,
} from '../../scripts/profile.js';
import { whyButton } from '../../scripts/why.js';

/**
 * ua-role-panel — "Tell us who you are" ink panel: copy on the left, the visitor's paths as
 * equal-weight outlined cards on the right (uplift variant A). Adapts to the visitor exactly
 * like the site's `adaptive` block, with the same content model:
 *
 *   one row per version: [who it is for] [content]
 *   - who: `default`, or a persona (`advisor`, `ria`, `asset-manager`) optionally followed by
 *     lifecycle stages (`advisor buy expand`)
 *   - content: optional picture (panel backdrop), optional short label paragraph before the
 *     heading (becomes the label above the cards), h2, p…, and one paragraph per path link
 *     (plain, <strong> or <em> links all render as the same outlined card)
 * Best match wins: persona + current stage, then persona, then default. Every version is
 * decorated once (authored nodes moved, never cloned) and the others are hidden.
 * Persona versions get a "Why am I seeing this?" button.
 *
 * @param {Element} block The block element
 */
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

function buildPanel(version, index) {
  const id = `ua-role-panel-${instance}-${index}`;
  const panel = document.createElement('div');
  panel.className = 'ua-role-panel-panel';
  const intro = document.createElement('div');
  intro.className = 'ua-role-panel-intro';
  const choices = document.createElement('div');
  choices.className = 'ua-role-panel-choices';
  choices.setAttribute('role', 'group');
  const list = document.createElement('ul');
  let label = null;

  [...version.content.children].forEach((el) => {
    const picture = el.querySelector('picture') || (el.matches('picture') ? el : null);
    const link = el.matches('p') && el.querySelector('a');
    if (picture && !el.textContent.trim()) {
      const media = document.createElement('div');
      media.className = 'ua-role-panel-media';
      media.setAttribute('aria-hidden', 'true');
      const img = picture.querySelector('img');
      if (img) img.loading = 'lazy';
      media.append(picture);
      panel.prepend(media);
      panel.classList.add('has-media');
    } else if (link && el.textContent.trim() === link.textContent.trim()) {
      link.classList.remove('button', 'primary', 'secondary', 'accent');
      link.classList.add('ua-role-card');
      const arrow = document.createElement('span');
      arrow.className = 'ua-role-card-arrow';
      arrow.setAttribute('aria-hidden', 'true');
      link.append(arrow);
      const item = document.createElement('li');
      item.append(link);
      el.remove();
      list.append(item);
    } else if (!label && isLabel(el)) {
      label = el;
      label.className = 'ua-role-panel-label';
      label.id = `${id}-label`;
    } else {
      intro.append(el);
    }
  });

  if (version.persona) intro.append(whyButton('ua-role-panel'));
  const heading = intro.querySelector('h1, h2, h3');
  if (label) {
    choices.setAttribute('aria-labelledby', label.id);
    choices.append(label);
  } else if (heading) {
    choices.setAttribute('aria-label', heading.textContent.trim());
  }
  if (list.children.length) choices.append(list);
  panel.append(intro);
  if (list.children.length || label) panel.append(choices);
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
