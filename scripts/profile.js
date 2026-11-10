/*
 * Visitor profile: persona, journey progress, booking and contact, kept in the browser
 * (localStorage) so the experience can adapt across pages and visits. Every change is
 * also pushed to the Adobe Client Data Layer (window.adobeDataLayer) so Web SDK / CJA
 * can pick the signals up once a property is connected. Demo data only — nothing leaves
 * the browser.
 */

const STORAGE_KEY = 'sei-profile';
const EVENT = 'sei:profile';

export const JOURNEYS = {
  breakaway: {
    name: 'Breakaway to independence',
    steps: [
      { id: 'explore', label: 'Explore', href: '/bd-breakaway' },
      { id: 'pathfinder', label: 'Pathfinder', href: '/pathfinder' },
      {
        id: 'meet', label: 'Meet SEI', href: '/pathfinder-specialist', completeOn: 'booking',
      },
      { id: 'match', label: 'Partner match', href: '/partner-match' },
    ],
  },
  etf: {
    name: 'ETF partnership',
    steps: [
      { id: 'explore', label: 'Explore', href: '/enterprise-ria' },
      { id: 'etfs', label: 'SEI ETFs', href: '/etfs' },
      { id: 'evaluate', label: 'Evaluate', href: '/portfolio-evaluator' },
      { id: 'results', label: 'Results', href: '/portfolio-evaluator-results' },
    ],
  },
  administration: {
    name: 'Fund administration',
    steps: [
      { id: 'explore', label: 'Explore', href: '/asset-managers' },
      // the home page tells the client stories; visiting it doesn't make someone an asset manager
      {
        id: 'proof', label: 'Client stories', href: '/', infer: false,
      },
      {
        id: 'meet', label: 'Talk to SEI', href: null, completeOn: 'booking',
      },
    ],
  },
};

export const PERSONAS = {
  advisor: {
    label: 'Financial advisor',
    audience: 'financial advisors',
    detail: 'Considering independence from a broker-dealer',
    journey: 'breakaway',
    specialist: { name: 'Eric Dunn', modal: '/modals/schedule-eric-dunn' },
    assistant: '/modals/assistant-advisor',
  },
  ria: {
    label: 'Enterprise RIA',
    audience: 'enterprise RIAs',
    detail: 'Scaling an RIA with SEI ETFs and portfolios',
    journey: 'etf',
    specialist: { name: 'Clayton Johnson', modal: '/modals/schedule-clayton-johnson' },
    assistant: '/modals/assistant-etf',
  },
  'asset-manager': {
    label: 'Asset manager',
    audience: 'asset managers',
    detail: 'Looking for one fund administration partner',
    journey: 'administration',
    specialist: { name: 'Clayton Johnson', modal: '/modals/schedule-clayton-johnson' },
    assistant: '/modals/assistant',
  },
};

const DEFAULT_SPECIALIST = PERSONAS.advisor.specialist;

/** SEI's lifecycle stages, as labelled across the journeys in the Figma file. */
export const STAGES = [
  { id: 'discover', label: 'Discover' },
  { id: 'engage', label: 'Engage' },
  { id: 'try', label: 'Try' },
  { id: 'buy', label: 'Buy' },
  { id: 'expand', label: 'Expand' },
];

const PAGE_STAGES = {
  '/': 'discover',
  '/start/linkedin': 'discover',
  '/start/ai-search': 'discover',
  '/bd-breakaway': 'engage',
  '/insights/videos/summit-wealth-partnering-with-purpose': 'engage',
  '/enterprise-ria': 'engage',
  '/asset-managers': 'engage',
  '/pathfinder': 'try',
  '/etfs': 'try',
  '/pathfinder-specialist': 'buy',
  '/portfolio-evaluator': 'buy',
  '/partner-match': 'expand',
  '/portfolio-evaluator-results': 'expand',
};

/** Campaigns (utm_campaign) and the persona their audience targets. */
const CAMPAIGNS = {
  'bd-breakaway': 'advisor',
  'enterprise-ria': 'ria',
  ims: 'asset-manager',
};

const local = window.location.pathname.startsWith('/content/');

/** Path of the current page without the local /content preview prefix. */
export function currentPath(pathname = window.location.pathname) {
  const path = pathname.replace(/^\/content(?=\/)/, '').replace(/\.html$/, '').replace(/\/index$/, '/');
  return path || '/';
}

/** Link to a site path, keeping the local preview's /content prefix. */
export function pageHref(path) {
  if (!local || !path || !path.startsWith('/')) return path;
  return `/content${path === '/' ? '/index' : path}`;
}

function blankProfile() {
  return {
    persona: null,
    personaSource: null,
    steps: {},
    booking: null,
    contact: {},
    views: {},
    campaign: null,
    firstCampaign: null,
    answers: {},
  };
}

export function getProfile() {
  try {
    return { ...blankProfile(), ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') };
  } catch {
    return blankProfile();
  }
}

/**
 * Pushes an event onto the Adobe Client Data Layer with the visitor context attached.
 * @param {string} event Event name, e.g. "persona-selected"
 * @param {object} [data] Extra event data
 */
export function track(event, data = {}) {
  const profile = getProfile();
  const persona = PERSONAS[profile.persona];
  window.adobeDataLayer = window.adobeDataLayer || [];
  window.adobeDataLayer.push({
    event,
    page: { path: currentPath(), stage: PAGE_STAGES[currentPath()] || null },
    visitor: {
      persona: profile.persona,
      personaSource: profile.personaSource,
      journey: persona?.journey || null,
      // eslint-disable-next-line no-use-before-define
      stage: journeyStatus(profile)?.current?.id || null,
      // eslint-disable-next-line no-use-before-define
      lifecycleStage: lifecycleStage(profile)?.id || null,
      booked: Boolean(profile.booking),
      campaign: profile.campaign
        ? { source: profile.campaign.source, campaign: profile.campaign.campaign } : null,
    },
    ...data,
  });
}

function save(profile, reason) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch { /* storage unavailable */ }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { profile, reason } }));
  return profile;
}

/** Subscribes to profile changes. */
export function onProfileChange(callback) {
  window.addEventListener(EVENT, (e) => callback(e.detail.profile, e.detail.reason));
}

/** Journey, current step and completed steps for a profile (null without a persona). */
export function journeyStatus(profile = getProfile()) {
  const persona = PERSONAS[profile.persona];
  if (!persona) return null;
  const journey = JOURNEYS[persona.journey];
  const done = profile.steps[persona.journey] || [];
  const steps = journey.steps.map((step) => ({ ...step, done: done.includes(step.id) }));
  const firstOpen = steps.findIndex((step) => !step.done);
  const index = firstOpen === -1 ? steps.length - 1 : firstOpen;
  return {
    persona, journey, steps, current: steps[index], index,
  };
}

/**
 * The furthest lifecycle stage the visitor has reached: the stages of the pages they have
 * seen, and at least "Buy" once a call is booked.
 */
export function lifecycleStage(profile = getProfile()) {
  const reached = Object.keys(profile.views || {})
    .map((path) => STAGES.findIndex((stage) => stage.id === PAGE_STAGES[path]))
    .concat(profile.booking ? [3] : []);
  const index = Math.max(-1, ...reached);
  return index < 0 ? null : { ...STAGES[index], index };
}

/** The lifecycle stage of a page. */
export function pageStage(path = currentPath()) {
  return STAGES.find((stage) => stage.id === PAGE_STAGES[path]) || null;
}

/**
 * Reads campaign parameters (utm_*) from the landing URL. A campaign for a known audience
 * sets the persona, unless the visitor picked one themselves.
 */
function readCampaign(profile) {
  const params = new URLSearchParams(window.location.search);
  const source = params.get('utm_source');
  if (!source) return null;
  const campaign = {
    source,
    medium: params.get('utm_medium'),
    campaign: params.get('utm_campaign'),
    content: params.get('utm_content'),
    landing: currentPath(),
    at: new Date().toISOString(),
  };
  profile.campaign = campaign;
  profile.firstCampaign = profile.firstCampaign || campaign;
  const persona = CAMPAIGNS[campaign.campaign];
  if (persona && profile.personaSource !== 'selected') {
    profile.persona = persona;
    profile.personaSource = 'campaign';
  }
  return campaign;
}

/** The SEI specialist a visitor should book with. */
export function specialistFor(profile = getProfile()) {
  return PERSONAS[profile.persona]?.specialist || DEFAULT_SPECIALIST;
}

/** The chat fragment for the visitor's persona. */
export function assistantFor(profile = getProfile()) {
  return PERSONAS[profile.persona]?.assistant || '/modals/assistant';
}

export function setPersona(id, source = 'selected') {
  const profile = getProfile();
  if (id && !PERSONAS[id]) return profile;
  profile.persona = id || null;
  profile.personaSource = id ? source : null;
  save(profile, 'persona');
  track(id ? 'persona-selected' : 'persona-cleared', { persona: { id, source } });
  return profile;
}

/** Stores what the visitor told an interactive tool, e.g. the readiness check. */
export function saveAnswers(key, value) {
  const profile = getProfile();
  profile.answers = { ...profile.answers, [key]: { ...value, at: new Date().toISOString() } };
  save(profile, 'answers');
  return profile;
}

function markStep(profile, journeyId, stepId) {
  const done = new Set(profile.steps[journeyId] || []);
  done.add(stepId);
  profile.steps[journeyId] = [...done];
}

/**
 * Records a page view: marks the journey step for this page and, when the visitor has not
 * chosen a persona, infers one from the journey the page belongs to.
 */
export function recordView(path = currentPath()) {
  const profile = getProfile();
  profile.views[path] = (profile.views[path] || 0) + 1;
  const campaign = readCampaign(profile);
  Object.entries(JOURNEYS).forEach(([journeyId, journey]) => {
    const step = journey.steps.find((s) => s.href === path);
    if (!step) return;
    if (!profile.persona && step.infer !== false) {
      const inferred = Object.keys(PERSONAS).find((id) => PERSONAS[id].journey === journeyId);
      profile.persona = inferred;
      profile.personaSource = 'inferred';
    }
    if (PERSONAS[profile.persona]?.journey === journeyId && step.completeOn !== 'booking') {
      markStep(profile, journeyId, step.id);
    }
  });
  save(profile, 'view');
  if (campaign) track('campaign-landing', { campaign });
  track('page-view');
  return profile;
}

/** Stores a booking (from the scheduler or the chat) and completes the "meet" step. */
function setBooking(booking, contact = {}) {
  const profile = getProfile();
  profile.booking = booking;
  ['name', 'email', 'firm', 'phone'].forEach((key) => {
    if (contact[key]) profile.contact[key] = contact[key];
  });
  if (!profile.persona) {
    profile.persona = Object.keys(PERSONAS)
      .find((id) => PERSONAS[id].specialist.name === booking.advisor) || null;
    profile.personaSource = profile.persona ? 'inferred' : null;
  }
  const persona = PERSONAS[profile.persona];
  if (persona) markStep(profile, persona.journey, 'meet');
  save(profile, 'booking');
  track('booking-confirmed', {
    booking: { advisor: booking.advisor, time: booking.label, channel: booking.channel || 'scheduler' },
  });
  return profile;
}

/**
 * Presenter shortcut: marks the visitor's journey as visited up to a lifecycle stage, as if they
 * had walked it (pages viewed and journey steps done; booking-only steps stay open).
 * @param {string} stageId One of STAGES
 */
export function simulateStage(stageId) {
  const profile = getProfile();
  const persona = PERSONAS[profile.persona];
  if (!persona) return profile;
  const target = STAGES.findIndex((s) => s.id === stageId);
  const journey = JOURNEYS[persona.journey];
  profile.views = {};
  profile.steps[persona.journey] = [];
  journey.steps.forEach((step) => {
    const index = STAGES.findIndex((s) => s.id === PAGE_STAGES[step.href]);
    if (step.href && index > -1 && index <= target) {
      profile.views[step.href] = 1;
      if (step.completeOn !== 'booking') markStep(profile, persona.journey, step.id);
    }
  });
  save(profile, 'simulate');
  track('presenter-stage', { presenter: { stage: stageId } });
  return profile;
}

export function resetProfile() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    // let the auto-opening pop-ups play again
    Object.keys(sessionStorage).filter((key) => key.startsWith('sei-modal-shown:'))
      .forEach((key) => sessionStorage.removeItem(key));
  } catch { /* storage unavailable */ }
  const profile = save(blankProfile(), 'reset');
  track('profile-reset');
  return profile;
}

/**
 * Books a call: stores it in the profile, then announces it with `sei:booked` so the
 * header, journey and chat can update.
 * @param {object} booking { advisor, date (ISO), time, label, channel }
 * @param {object} [contact] { name, email, firm, phone }
 */
export function book(booking, contact = {}) {
  setBooking(booking, contact);
  window.dispatchEvent(new CustomEvent('sei:booked', { detail: booking }));
}

/** The instant of a US Eastern wall-clock time (handles daylight saving). */
function easternTime(year, month, date, hours, minutes) {
  const guess = Date.UTC(year, month, date, hours, minutes);
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York', hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric',
  }).formatToParts(new Date(guess)).map((p) => [p.type, Number(p.value)]));
  const wall = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute);
  return new Date(guess + (guess - wall));
}

/** A calendar file (.ics) for a booking, as a data URL. */
export function calendarHref(booking) {
  // slots are SEI (US Eastern) times, whatever the visitor's own time zone
  const day = new Date(booking.date);
  const [, h, m, ampm] = (booking.time || '').match(/(\d+):(\d+)\s*(AM|PM)/i) || [];
  const hours = h ? (Number(h) % 12) + (/pm/i.test(ampm) ? 12 : 0) : 9;
  const start = easternTime(
    day.getFullYear(),
    day.getMonth(),
    day.getDate(),
    hours,
    Number(m || 0),
  );
  const end = new Date(start.getTime() + 30 * 60000);
  const stamp = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//SEI//Demo//EN', 'BEGIN:VEVENT',
    `UID:${stamp(start)}-sei-demo`, `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`, `DTEND:${stamp(end)}`,
    `SUMMARY:SEI conversation with ${booking.advisor}`,
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n');
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}
