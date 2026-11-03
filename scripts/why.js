import { loadCSS } from './aem.js';
import {
  PERSONAS, STAGES, getProfile, journeyStatus, lifecycleStage, onProfileChange, resetProfile,
  track,
} from './profile.js';

/*
 * "Why am I seeing this?": a side panel that explains what the site knows about the visitor
 * and why the experience looks the way it does — role and where it came from, lifecycle stage,
 * journey progress, recent pages and booking. Opened from the header and adaptive content.
 */

let dialog;

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

const SOURCES = {
  linkedin: 'a LinkedIn ad',
  'chatgpt.com': 'an AI assistant answer',
};

/** Plain-language reason for the visitor's role. */
function roleReason(profile) {
  const persona = PERSONAS[profile.persona];
  if (!persona) return 'We don’t know your role yet, so you see the general SEI experience.';
  const { campaign } = profile;
  switch (profile.personaSource) {
    case 'selected': return `You chose “${persona.label}” in the “I’m a…” menu.`;
    case 'assistant': return `You told the SEI Assistant you’re one of our ${persona.audience}.`;
    case 'campaign': {
      const from = SOURCES[campaign?.source] || campaign?.source || 'a campaign';
      const ad = campaign?.content ? ` (ad “${campaign.content}”)` : '';
      return `You arrived from ${from}${ad} for ${persona.audience}.`;
    }
    case 'readiness': return `You took the readiness check for ${persona.audience}.`;
    case 'presenter': return 'A presenter set this role for the demo.';
    case 'not-in-demo': return `You picked the journey for ${persona.audience}.`;
    default: return `You visited pages for ${persona.audience}, so we assumed that’s you.`;
  }
}

function section(title) {
  const node = el('section', 'why-section');
  node.append(el('h3', 'why-heading', title));
  return node;
}

function render(body) {
  const profile = getProfile();
  const persona = PERSONAS[profile.persona];
  body.textContent = '';

  const role = section('Your role');
  role.append(el('p', 'why-value', persona ? persona.label : 'Not known yet'), el('p', 'why-reason', roleReason(profile)));
  body.append(role);

  const stage = lifecycleStage(profile);
  const life = section('Where you are');
  const list = el('ol', 'why-stages');
  STAGES.forEach((s, i) => {
    const li = el('li', 'why-stage', s.label);
    if (stage && i < stage.index) li.classList.add('done');
    if (stage && i === stage.index) {
      li.classList.add('current');
      li.setAttribute('aria-current', 'step');
    }
    list.append(li);
  });
  life.append(list);
  const status = journeyStatus(profile);
  if (status) {
    const done = status.steps.filter((s) => s.done).length;
    life.append(el('p', 'why-reason', `${status.journey.name}: ${done} of ${status.steps.length} steps done${status.steps.every((s) => s.done) ? '' : `, next is ${status.current.label}`}.`));
  }
  body.append(life);

  const activity = section('What you’ve done');
  const items = el('ul', 'why-list');
  const pages = Object.keys(profile.views || {});
  items.append(el('li', '', `${pages.length} page${pages.length === 1 ? '' : 's'} viewed`));
  if (profile.campaign) items.append(el('li', '', `Came from ${SOURCES[profile.campaign.source] || profile.campaign.source}`));
  const readiness = profile.answers?.readiness;
  if (readiness) items.append(el('li', '', `Readiness check: ${readiness.answers.join(', ')}`));
  if (profile.booking) items.append(el('li', '', `Booked a call with ${profile.booking.advisor} (${profile.booking.label})`));
  if (profile.contact?.email) items.append(el('li', '', 'Shared a work email for the invitation'));
  activity.append(items);
  body.append(activity);

  const how = section('How this works');
  how.append(el('p', 'why-reason', 'This demo keeps these signals in your browser only. In production they would come from Adobe Experience Platform and Customer Journey Analytics, and drive the same changes across the site.'));
  const reset = el('button', 'why-reset', 'Clear my profile');
  reset.type = 'button';
  reset.addEventListener('click', () => {
    resetProfile();
    window.location.reload();
  });
  how.append(reset);
  body.append(how);
}

function build() {
  dialog = el('dialog', 'why-panel');
  dialog.setAttribute('aria-labelledby', 'why-title');
  const head = el('div', 'why-head');
  const title = el('h2', 'why-title', 'Why am I seeing this?');
  title.id = 'why-title';
  const close = el('button', 'why-close');
  close.type = 'button';
  close.setAttribute('aria-label', 'Close');
  close.addEventListener('click', () => dialog.close());
  head.append(title, close);
  const body = el('div', 'why-body');
  dialog.append(head, body);
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  onProfileChange(() => { if (dialog.open) render(body); });
  document.body.append(dialog);
}

/**
 * Opens the panel.
 * @param {string} from Where it was opened from, for analytics
 */
export async function openWhy(from = 'unknown') {
  await loadCSS(`${window.hlx.codeBasePath}/styles/why.css`);
  if (!dialog) build();
  render(dialog.querySelector('.why-body'));
  dialog.showModal();
  track('why-opened', { why: { from } });
}

/**
 * A "Why am I seeing this?" button.
 * @param {string} from Where it sits, for analytics
 * @param {string} [label] Button text
 * @returns {HTMLButtonElement} The button
 */
export function whyButton(from, label = 'Why am I seeing this?') {
  const button = el('button', 'why-button', label);
  button.type = 'button';
  button.setAttribute('aria-haspopup', 'dialog');
  button.addEventListener('click', () => openWhy(from));
  return button;
}
