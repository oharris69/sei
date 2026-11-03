import { createOptimizedPicture } from '../../scripts/aem.js';
import {
  PERSONAS, getProfile, lifecycleStage, onProfileChange, track,
} from '../../scripts/profile.js';
import { whyButton } from '../../scripts/why.js';

/*
 * Adaptive: content that changes with the visitor. Each row is one version:
 *  - first cell: who it is for — a persona (`advisor`, `ria`, `asset-manager`) optionally
 *    followed by lifecycle stages (`advisor buy expand`), or `default`
 *  - second cell: the content (optional picture, eyebrow, heading, text, buttons)
 * The best match wins: persona + current stage, then persona, then default. A "Why am I seeing
 * this?" link explains the choice.
 */

function readVariants(block) {
  return [...block.children].map((row) => {
    const [key, content] = row.children;
    const words = (key?.textContent || '').trim().toLowerCase().split(/[\s,]+/).filter(Boolean);
    const persona = words.find((w) => PERSONAS[w]) || null;
    return {
      persona,
      stages: words.filter((w) => w !== persona && w !== 'default'),
      isDefault: words.includes('default') || !words.length,
      content,
    };
  });
}

function pick(variants, profile) {
  const stage = lifecycleStage(profile)?.id;
  const forPersona = variants.filter((v) => v.persona && v.persona === profile.persona);
  return forPersona.find((v) => stage && v.stages.includes(stage))
    || forPersona.find((v) => !v.stages.length)
    || variants.find((v) => v.isDefault)
    || null;
}

function render(block, variant, variants) {
  const panel = document.createElement('div');
  panel.className = 'adaptive-panel';
  const content = variant.content.cloneNode(true);
  const picture = content.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    const media = document.createElement('div');
    media.className = 'adaptive-media';
    media.append(createOptimizedPicture(img.src, img.alt, false, [{ width: '900' }]));
    (picture.closest('p') || picture).remove();
    panel.append(media);
    block.classList.add('has-media');
  } else {
    block.classList.remove('has-media');
  }
  const body = document.createElement('div');
  body.className = 'adaptive-body';
  body.append(...content.childNodes);
  // keep the buttons side by side
  const buttons = [...body.querySelectorAll(':scope > .button-wrapper')];
  if (buttons.length) {
    const actions = document.createElement('div');
    actions.className = 'adaptive-actions';
    buttons[0].before(actions);
    actions.append(...buttons);
  }
  if (variant.persona) body.append(whyButton('adaptive'));
  panel.append(body);
  block.replaceChildren(panel);
  block.dataset.variant = `${variant.persona || 'default'}${variant.stages.length ? ` ${variant.stages.join(' ')}` : ''}`;
  block.dataset.variantIndex = variants.indexOf(variant);
}

/**
 * @param {Element} block The adaptive block
 */
export default function decorate(block) {
  const variants = readVariants(block);
  let shown;
  const update = () => {
    const variant = pick(variants, getProfile());
    if (!variant || variant === shown) return;
    shown = variant;
    render(block, variant, variants);
    if (variant.persona) {
      track('adaptive-shown', { adaptive: { variant: block.dataset.variant, page: window.location.pathname } });
    }
  };
  update();
  onProfileChange(update);
}
