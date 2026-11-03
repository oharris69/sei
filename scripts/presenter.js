import { loadCSS } from './aem.js';
import {
  PERSONAS, STAGES, book, getProfile, lifecycleStage, onProfileChange, pageHref, resetProfile,
  setPersona, simulateStage, specialistFor,
} from './profile.js';

/*
 * Presenter menu (Figma "Menu"): a demo-only panel to jump between journeys, set the role or
 * lifecycle stage, book a call and reset — so a live demo never has to click through every page.
 * Turned on with ?presenter (remembered in this browser) or Alt+Shift+P; "Hide" turns it off.
 */

const KEY = 'sei-presenter';
const JOURNEYS = [
  { label: 'Home page', href: '/' },
  { label: 'Broker dealer', href: '/start/linkedin', note: 'starts at the LinkedIn ad' },
  { label: 'RIA Enterprise', href: '/start/ai-search', note: 'starts at the AI answer' },
  { label: 'IMS', href: '/asset-managers' },
];

const fmtLong = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
let root;

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function group(title) {
  const node = el('div', 'presenter-group');
  node.append(el('p', 'presenter-label', title));
  return node;
}

function chip(label, onClick, pressed) {
  const button = el('button', 'presenter-chip', label);
  button.type = 'button';
  button.setAttribute('aria-pressed', Boolean(pressed));
  button.addEventListener('click', onClick);
  return button;
}

function nextWeekday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  do d.setDate(d.getDate() + 1); while (d.getDay() === 0 || d.getDay() === 6);
  return d;
}

function renderPanel(panel) {
  const profile = getProfile();
  const stage = lifecycleStage(profile);
  panel.textContent = '';

  const status = el('p', 'presenter-status');
  status.textContent = [
    PERSONAS[profile.persona]?.label || 'No role',
    stage?.label || 'No stage',
    profile.booking ? `Booked with ${profile.booking.advisor}` : 'Not booked',
  ].join(' · ');
  panel.append(status);

  const journeys = group('Demo journeys');
  const list = el('ul', 'presenter-journeys');
  JOURNEYS.forEach((j) => {
    const li = el('li');
    const a = el('a', 'presenter-journey', j.label);
    a.href = pageHref(j.href);
    if (j.note) a.append(el('span', 'presenter-note', j.note));
    li.append(a);
    list.append(li);
  });
  journeys.append(list);
  panel.append(journeys);

  const roles = group('Role');
  const roleRow = el('div', 'presenter-chips');
  Object.entries(PERSONAS).forEach(([id, p]) => {
    roleRow.append(chip(p.label, () => setPersona(id, 'presenter'), profile.persona === id));
  });
  roleRow.append(chip('Unknown', () => setPersona(null), !profile.persona));
  roles.append(roleRow);
  panel.append(roles);

  const stages = group('Lifecycle stage');
  const stageRow = el('div', 'presenter-chips');
  STAGES.forEach((s) => {
    const button = chip(s.label, () => simulateStage(s.id), stage?.id === s.id);
    button.disabled = !profile.persona;
    stageRow.append(button);
  });
  stages.append(stageRow);
  if (!profile.persona) stages.append(el('p', 'presenter-note', 'Pick a role first.'));
  panel.append(stages);

  const actions = group('Actions');
  const actionRow = el('div', 'presenter-chips');
  const bookNow = chip('Book a call now', () => {
    const specialist = specialistFor();
    const date = nextWeekday();
    book({
      advisor: specialist.name,
      date: date.toISOString(),
      time: '11:00 AM',
      label: `${fmtLong.format(date)}, 11:00 AM`,
      channel: 'presenter',
    }, { name: 'Jennifer Lee', email: 'jennifer@summitwealth.com' });
  });
  bookNow.disabled = Boolean(profile.booking);
  const reset = chip('Reset demo', () => {
    resetProfile();
    window.location.reload();
  });
  const hide = chip('Hide this menu', () => {
    localStorage.removeItem(KEY);
    root.remove();
    root = null;
  });
  actionRow.append(bookNow, reset, hide);
  actions.append(actionRow);
  panel.append(actions);
}

function build() {
  root = el('div', 'presenter');
  const toggle = el('button', 'presenter-toggle');
  toggle.type = 'button';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', 'presenter-panel');
  toggle.append(el('span', 'presenter-toggle-icon'), el('span', '', 'Demo'));
  const panel = el('div', 'presenter-panel');
  panel.id = 'presenter-panel';
  panel.hidden = true;
  toggle.addEventListener('click', () => {
    const open = panel.hidden;
    if (open) renderPanel(panel);
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', open);
  });
  root.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.hidden) {
      panel.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }
  });
  onProfileChange(() => { if (!panel.hidden) renderPanel(panel); });
  root.append(panel, toggle);
  document.body.append(root);
  return { toggle, panel };
}

/**
 * Shows the presenter menu (and remembers it for this browser).
 * @param {boolean} [open] Open the panel straight away
 */
export default async function showPresenter(open = false) {
  try {
    localStorage.setItem(KEY, 'on');
  } catch { /* storage unavailable */ }
  await loadCSS(`${window.hlx.codeBasePath}/styles/presenter.css`);
  if (root) {
    if (open) root.querySelector('.presenter-toggle').click();
    return;
  }
  const { toggle } = build();
  if (open) toggle.click();
}
