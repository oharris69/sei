import {
  PERSONAS, getProfile, journeyStatus, onProfileChange, pageHref, currentPath,
  resetProfile, setPersona, specialistFor, calendarHref, track,
} from '../../scripts/profile.js';
import { whyButton } from '../../scripts/why.js';

/*
 * Experience bar under the main nav: "I'm a…" persona chip, the visitor's journey progress
 * and the next step (talk to an advisor, or the call they have booked). Everything renders
 * from the visitor profile and re-renders whenever it changes.
 */

const fmtShort = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
const fmtDay = new Intl.DateTimeFormat('en-US', { weekday: 'short' });

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

/** Short booking label, e.g. "Thu, Nov 5 · 11:00 AM". */
export function bookingWhen(booking) {
  const date = new Date(booking.date);
  return Number.isNaN(date.getTime()) ? booking.label : `${fmtShort.format(date)} · ${booking.time}`;
}

function buildMenu(menu, toggle) {
  const profile = getProfile();
  menu.textContent = '';
  const list = el('ul', 'experience-options');
  Object.entries(PERSONAS).forEach(([id, persona]) => {
    const li = el('li');
    const option = el('button', 'experience-option');
    option.type = 'button';
    option.setAttribute('aria-pressed', profile.persona === id);
    option.append(el('span', 'experience-option-label', persona.label), el('span', 'experience-option-detail', persona.detail));
    option.addEventListener('click', () => {
      // stay on the page: the journey strip appears and links to the next step
      setPersona(id);
      toggle.setAttribute('aria-expanded', 'false');
      menu.hidden = true;
      toggle.focus();
    });
    li.append(option);
    list.append(li);
  });
  menu.append(list);
  if (profile.persona || profile.booking) {
    const reset = el('button', 'experience-reset', 'Start over (clear demo profile)');
    reset.type = 'button';
    reset.addEventListener('click', () => {
      resetProfile();
      window.location.reload();
    });
    menu.append(reset);
  }
}

function renderJourney(journeyEl, stageEl, profile) {
  journeyEl.textContent = '';
  const status = journeyStatus(profile);
  if (!status) {
    journeyEl.hidden = true;
    stageEl.textContent = 'Tell us who you are and we’ll map your path.';
    return;
  }
  journeyEl.hidden = false;
  journeyEl.setAttribute('aria-label', `Your journey: ${status.journey.name}`);
  status.steps.forEach((step, i) => {
    const li = el('li', 'experience-step');
    li.classList.toggle('done', step.done);
    const isCurrent = i === status.index && !step.done;
    li.classList.toggle('current', isCurrent);
    const specialist = specialistFor(profile);
    const href = step.href ? pageHref(step.href) : specialist.modal;
    const link = el('a', 'experience-step-link');
    link.href = href;
    if (isCurrent) link.setAttribute('aria-current', 'step');
    if (step.href === currentPath()) li.classList.add('here');
    const marker = el('span', 'experience-step-marker', step.done ? '' : String(i + 1));
    marker.setAttribute('aria-hidden', 'true');
    link.append(marker, el('span', 'experience-step-label', step.label));
    if (step.done) link.append(el('span', 'experience-sr', ' (done)'));
    link.addEventListener('click', () => track('journey-step-click', { journeyStep: { id: step.id, index: i + 1 } }));
    li.append(link);
    journeyEl.append(li);
  });
  const all = status.steps.every((s) => s.done);
  // shown instead of the strip on small screens
  stageEl.textContent = all
    ? `${status.journey.name}: complete`
    : `${status.index + 1}/${status.steps.length} · ${status.current.label}`;
}

function renderAction(actionEl, profile) {
  actionEl.textContent = '';
  const { booking } = profile;
  if (booking) {
    const pill = el('p', 'experience-booked');
    const when = el('strong', '', bookingWhen(booking));
    const date = new Date(booking.date);
    const short = el('strong', 'experience-booked-short', `${Number.isNaN(date.getTime()) ? '' : fmtDay.format(date)} ${booking.time}`.trim());
    pill.append(el('span', 'experience-booked-label', `Your call with ${booking.advisor}`), when, short);
    pill.setAttribute('aria-label', `Your call with ${booking.advisor}, ${bookingWhen(booking)}`);
    const ics = el('a', 'experience-ics', 'Add to calendar');
    ics.href = calendarHref(booking);
    ics.download = 'sei-call.ics';
    ics.addEventListener('click', () => track('calendar-download', { booking: { advisor: booking.advisor } }));
    actionEl.append(pill, ics);
    return;
  }
  const specialist = specialistFor(profile);
  const talk = el('a', 'experience-talk');
  talk.append(el('span', 'experience-talk-label', 'Talk to an advisor'));
  talk.setAttribute('aria-label', `Talk to an advisor (${specialist.name})`);
  talk.href = specialist.modal;
  talk.setAttribute('aria-haspopup', 'dialog');
  talk.addEventListener('click', () => track('talk-to-advisor-click', { specialist: specialist.name }));
  actionEl.append(talk);
}

/**
 * Builds the experience bar.
 * @returns {Element} The bar
 */
export default function buildExperience() {
  const bar = el('div', 'nav-experience');
  const inner = el('div', 'experience-inner');

  const persona = el('div', 'experience-persona');
  const toggle = el('button', 'experience-persona-toggle');
  toggle.type = 'button';
  toggle.setAttribute('aria-expanded', 'false');
  const menuId = 'experience-menu';
  toggle.setAttribute('aria-controls', menuId);
  const kicker = el('span', 'experience-kicker', 'I’m a');
  const current = el('span', 'experience-persona-label');
  toggle.append(kicker, current);
  const menu = el('div', 'experience-menu');
  menu.id = menuId;
  menu.hidden = true;
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    if (open) buildMenu(menu, toggle);
    toggle.setAttribute('aria-expanded', open);
    menu.hidden = !open;
    if (open) menu.querySelector('button')?.focus();
  });
  persona.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.hidden) {
      e.stopPropagation();
      menu.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }
  });
  persona.addEventListener('focusout', (e) => {
    if (!persona.contains(e.relatedTarget)) {
      menu.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
  persona.append(toggle, menu);

  const progress = el('div', 'experience-progress');
  const journeyEl = el('ol', 'experience-journey');
  const stageEl = el('p', 'experience-stage');
  stageEl.setAttribute('aria-live', 'polite');
  progress.append(journeyEl, stageEl);

  const actionEl = el('div', 'experience-action');

  const render = (profile = getProfile()) => {
    const p = PERSONAS[profile.persona];
    current.textContent = p ? p.label : 'Choose your role';
    toggle.setAttribute('aria-label', p ? `I’m a ${p.label}. Change role` : 'Choose your role');
    bar.dataset.persona = profile.persona || '';
    bar.dataset.journey = p ? p.journey : '';
    bar.classList.toggle('booked', Boolean(profile.booking));
    renderJourney(journeyEl, stageEl, profile);
    renderAction(actionEl, profile);
  };
  onProfileChange((profile) => render(profile));
  render();

  const why = whyButton('header', 'Why?');
  why.classList.add('experience-why');
  why.setAttribute('aria-label', 'Why am I seeing this?');

  inner.append(persona, progress, why, actionEl);
  bar.append(inner);
  return bar;
}
