import {
  PERSONAS, getProfile, journeyStatus, onProfileChange, pageHref, currentPath,
  resetProfile, setPersona, specialistFor, calendarHref, track,
} from '../../scripts/profile.js';
import { whyButton } from '../../scripts/why.js';
import { getLocale, isLocalized } from '../../scripts/locale.js';

/*
 * Experience bar under the main nav: "I'm a…" persona chip, the visitor's journey progress
 * and the next step (talk to an advisor, or the call they have booked). Everything renders
 * from the visitor profile and re-renders whenever it changes. On locale pages (e.g. /es-us)
 * the bar's own text is translated and journey steps link to that locale's pages.
 */

const locale = getLocale();
const LANG = locale.lang === 'en' ? 'en-US' : locale.lang;

/*
 * The bar's text on locale pages comes from the locale's placeholders sheet (e.g.
 * /es-us/placeholders.json, editable in DA), looked up by key. Built-in Spanish is the fallback
 * when a key is missing or the sheet isn't published, then the English text.
 * Persona and journey labels come from scripts/profile.js.
 */
const LABELS = [
  // [placeholder key, English, built-in Spanish fallback]
  ['i-am', 'I’m a', 'Soy'],
  ['choose-your-role', 'Choose your role', 'Elija su perfil'],
  ['change-role', 'Change role', 'Cambiar perfil'],
  ['tell-us-who-you-are', 'Tell us who you are and we’ll map your path.', 'Díganos quién es y trazaremos su camino.'],
  ['talk-to-an-advisor', 'Talk to an advisor', 'Hable con un asesor'],
  ['why', 'Why?', '¿Por qué?'],
  ['why-am-i-seeing-this', 'Why am I seeing this?', '¿Por qué veo esto?'],
  ['start-over', 'Start over (clear demo profile)', 'Empezar de nuevo (borrar el perfil de la demo)'],
  ['your-call-with', 'Your call with', 'Su llamada con'],
  ['add-to-calendar', 'Add to calendar', 'Añadir al calendario'],
  ['your-journey', 'Your journey', 'Su recorrido'],
  ['journey-complete', 'complete', 'completado'],
  ['step-done', '(done)', '(completado)'],
  ['persona-financial-advisor', 'Financial advisor', 'Asesor financiero'],
  ['persona-enterprise-ria', 'Enterprise RIA', 'RIA empresarial'],
  ['persona-asset-manager', 'Asset manager', 'Gestor de activos'],
  ['persona-financial-advisor-detail', 'Considering independence from a broker-dealer', 'Evalúa independizarse de un broker-dealer'],
  ['persona-enterprise-ria-detail', 'Scaling an RIA with SEI ETFs and portfolios', 'Hace crecer un RIA con los ETFs y portafolios de SEI'],
  ['persona-asset-manager-detail', 'Looking for one fund administration partner', 'Busca un único socio de administración de fondos'],
  ['journey-breakaway', 'Breakaway to independence', 'Camino a la independencia'],
  ['journey-etf', 'ETF partnership', 'Alianza en ETFs'],
  ['journey-fund-administration', 'Fund administration', 'Administración de fondos'],
  ['step-explore', 'Explore', 'Explorar'],
  ['step-pathfinder', 'Pathfinder', 'Pathfinder'],
  ['step-meet-sei', 'Meet SEI', 'Conozca SEI'],
  ['step-partner-match', 'Partner match', 'Socio ideal'],
  ['step-sei-etfs', 'SEI ETFs', 'ETFs de SEI'],
  ['step-evaluate', 'Evaluate', 'Evaluar'],
  ['step-results', 'Results', 'Resultados'],
  ['step-client-stories', 'Client stories', 'Casos de clientes'],
  ['step-talk-to-sei', 'Talk to SEI', 'Hable con SEI'],
];
const BY_TEXT = new Map(LABELS.map(([key, en, es]) => [en, { key, es }]));
let placeholders = {};

/**
 * Sets the locale's placeholders (loaded by the header before the bar is built).
 * @param {Object<string, string>} values key → label
 */
export function setPlaceholders(values) {
  placeholders = values || {};
}

const t = (text) => {
  if (!locale.prefix) return text;
  const entry = BY_TEXT.get(text);
  if (!entry) return text;
  return placeholders[entry.key] || (locale.lang.startsWith('es') ? entry.es : '') || text;
};

/** A journey step's site path in the current locale when that page is published there. */
const localeHref = (path) => {
  if (!locale.prefix || !path || !path.startsWith('/') || !isLocalized(path)) return path;
  return path === '/' ? `${locale.prefix}/` : `${locale.prefix}${path}`;
};
/** The current path without the locale folder, to match journey steps. */
const barePath = () => {
  const path = currentPath();
  return locale.prefix && path.startsWith(locale.prefix) ? path.slice(locale.prefix.length) || '/' : path;
};

const fmtShort = new Intl.DateTimeFormat(LANG, { weekday: 'short', month: 'short', day: 'numeric' });
const fmtDay = new Intl.DateTimeFormat(LANG, { weekday: 'short' });

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
    option.append(el('span', 'experience-option-label', t(persona.label)), el('span', 'experience-option-detail', t(persona.detail)));
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
    const reset = el('button', 'experience-reset', t('Start over (clear demo profile)'));
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
    stageEl.textContent = t('Tell us who you are and we’ll map your path.');
    return;
  }
  journeyEl.hidden = false;
  journeyEl.setAttribute('aria-label', `${t('Your journey')}: ${t(status.journey.name)}`);
  status.steps.forEach((step, i) => {
    const li = el('li', 'experience-step');
    li.classList.toggle('done', step.done);
    const isCurrent = i === status.index && !step.done;
    li.classList.toggle('current', isCurrent);
    const specialist = specialistFor(profile);
    const href = step.href ? pageHref(localeHref(step.href)) : specialist.modal;
    const link = el('a', 'experience-step-link');
    link.href = href;
    if (isCurrent) link.setAttribute('aria-current', 'step');
    if (step.href === barePath()) li.classList.add('here');
    const marker = el('span', 'experience-step-marker', step.done ? '' : String(i + 1));
    marker.setAttribute('aria-hidden', 'true');
    link.append(marker, el('span', 'experience-step-label', t(step.label)));
    if (step.done) link.append(el('span', 'experience-sr', ` ${t('(done)')}`));
    link.addEventListener('click', () => track('journey-step-click', { journeyStep: { id: step.id, index: i + 1 } }));
    li.append(link);
    journeyEl.append(li);
  });
  const all = status.steps.every((s) => s.done);
  // shown instead of the strip on small screens
  stageEl.textContent = all
    ? `${t(status.journey.name)}: ${t('complete')}`
    : `${status.index + 1}/${status.steps.length} · ${t(status.current.label)}`;
}

function renderAction(actionEl, profile) {
  actionEl.textContent = '';
  const { booking } = profile;
  if (booking) {
    const pill = el('p', 'experience-booked');
    const when = el('strong', '', bookingWhen(booking));
    const date = new Date(booking.date);
    const short = el('strong', 'experience-booked-short', `${Number.isNaN(date.getTime()) ? '' : fmtDay.format(date)} ${booking.time}`.trim());
    pill.append(el('span', 'experience-booked-label', `${t('Your call with')} ${booking.advisor}`), when, short);
    pill.setAttribute('aria-label', `${t('Your call with')} ${booking.advisor}, ${bookingWhen(booking)}`);
    const ics = el('a', 'experience-ics', t('Add to calendar'));
    ics.href = calendarHref(booking);
    ics.download = 'sei-call.ics';
    ics.addEventListener('click', () => track('calendar-download', { booking: { advisor: booking.advisor } }));
    actionEl.append(pill, ics);
    return;
  }
  const specialist = specialistFor(profile);
  const talk = el('a', 'experience-talk');
  talk.append(el('span', 'experience-talk-label', t('Talk to an advisor')));
  talk.setAttribute('aria-label', `${t('Talk to an advisor')} (${specialist.name})`);
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
  const kicker = el('span', 'experience-kicker', t('I’m a'));
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
    current.textContent = p ? t(p.label) : t('Choose your role');
    toggle.setAttribute('aria-label', p ? `${t('I’m a')} ${t(p.label)}. ${t('Change role')}` : t('Choose your role'));
    bar.dataset.persona = profile.persona || '';
    bar.dataset.journey = p ? p.journey : '';
    bar.classList.toggle('booked', Boolean(profile.booking));
    renderJourney(journeyEl, stageEl, profile);
    renderAction(actionEl, profile);
  };
  onProfileChange((profile) => render(profile));
  render();

  const why = whyButton('header', t('Why?'));
  why.classList.add('experience-why');
  why.setAttribute('aria-label', t('Why am I seeing this?'));

  inner.append(persona, progress, why, actionEl);
  bar.append(inner);
  return bar;
}
