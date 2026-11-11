/**
 * Adaptive — Experience Workspace: each version's content is MOVED into its own panel (shown
 * one at a time), so every version stays editable when it is the one displayed.
 * @ew-exempt <p> audience key (cell 1, e.g. `advisor buy expand`) — variant selector (metadata)
 */
import { createOptimizedPicture } from '../../scripts/aem.js';
import {
  PERSONAS, getProfile, lifecycleStage, onProfileChange, track,
} from '../../scripts/profile.js';
import { whyButton } from '../../scripts/why.js';

/**
 * Adaptive: content that changes with the visitor. Each row is one version:
 *  - first cell: who it is for — a persona (`advisor`, `ria`, `asset-manager`) optionally
 *    followed by lifecycle stages (`advisor buy expand`), or `default`
 *  - second cell: the content (optional picture, eyebrow, heading, text, buttons)
 * The best match wins: persona + current stage, then persona, then default. A "Why am I seeing
 * this?" link explains the choice.
 * Every version is rendered once (authored nodes moved) and only the chosen one is shown.
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

/**
 * Builds one version's panel once, MOVING the authored content (never cloning it) so every
 * version stays editable in Experience Workspace when it is the one shown (EW1/EW9).
 * @param {object} variant The version
 * @returns {Element} The (hidden) panel
 */
function buildPanel(variant) {
  const panel = document.createElement('div');
  panel.className = 'adaptive-panel';
  panel.hidden = true;
  const { content } = variant;
  const picture = content?.querySelector('picture');
  variant.hasMedia = !!picture;
  if (picture) {
    const img = picture.querySelector('img');
    const media = document.createElement('div');
    media.className = 'adaptive-media';
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '900' }]);
    // keep the workspace image index on the visible <img> (EW1)
    if (img.dataset.imageIndex) optimized.querySelector('img').dataset.imageIndex = img.dataset.imageIndex;
    media.append(optimized);
    const holder = picture.closest('p');
    if (holder && content.contains(holder) && holder.textContent.trim()) {
      // the runtime folded a picture-led cell into ONE <p>: keep that paragraph (it carries
      // the editor index) and let it add no box, so its content lays out as body children
      picture.remove();
      holder.classList.add('adaptive-fold');
    } else {
      (holder || picture).remove();
    }
    panel.append(media);
  }
  const body = document.createElement('div');
  body.className = 'adaptive-body';
  if (content) body.append(...content.childNodes);
  const scope = body.querySelector(':scope > p.adaptive-fold') || body;
  // the eyebrow class dies in the editor; the wrapper keeps the paint (EW2)
  scope.querySelectorAll(':scope > p.eyebrow').forEach((p) => {
    const wrap = document.createElement('div');
    wrap.className = 'eyebrow-wrap';
    p.replaceWith(wrap);
    wrap.append(p);
  });
  // keep the buttons side by side
  const buttons = [...scope.querySelectorAll(':scope > .button-wrapper')];
  if (buttons.length) {
    const actions = document.createElement('div');
    actions.className = 'adaptive-actions';
    buttons[0].before(actions);
    actions.append(...buttons);
  }
  if (variant.persona) body.append(whyButton('adaptive'));
  panel.append(body);
  return panel;
}

function show(block, variant, variants) {
  variants.forEach((v) => { v.panel.hidden = v !== variant; });
  block.classList.toggle('has-media', variant.hasMedia);
  block.dataset.variant = `${variant.persona || 'default'}${variant.stages.length ? ` ${variant.stages.join(' ')}` : ''}`;
  block.dataset.variantIndex = variants.indexOf(variant);
}

/**
 * @param {Element} block The adaptive block
 */
export default function decorate(block) {
  const variants = readVariants(block);
  variants.forEach((v) => { v.panel = buildPanel(v); });
  block.replaceChildren(...variants.map((v) => v.panel));
  let shown;
  const update = () => {
    const variant = pick(variants, getProfile());
    if (!variant || variant === shown) return;
    shown = variant;
    show(block, variant, variants);
    if (variant.persona) {
      track('adaptive-shown', { adaptive: { variant: block.dataset.variant, page: window.location.pathname } });
    }
  };
  update();
  onProfileChange(update);
}
