import { toClassName } from '../../scripts/aem.js';

const STEPS = ['Advisor', 'Date & Time', 'Your Details', 'Confirm'];
const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const DEFAULT_TIMES = ['9:00 AM', '~9:30 AM', '10:00 AM', '~10:30 AM', '11:00 AM', '11:30 AM', '1:00 PM', '~1:30 PM', '2:00 PM', '2:30 PM', '~3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'];

const fmtLong = new Intl.DateTimeFormat('en-US', {
  weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
});
const fmtMonth = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });
const sameDay = (a, b) => a && b && a.toDateString() === b.toDateString();

/**
 * Next `count` weekdays starting tomorrow.
 * @param {number} count Number of bookable days
 * @returns {Date[]} The bookable dates
 */
function bookableDays(count) {
  const days = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  while (days.length < count) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) days.push(new Date(d));
  }
  return days;
}

/**
 * Reads the key/value rows (advisor, times, timezone, days) and the title row.
 * Times are listed in one cell; struck-through or ~prefixed times are unavailable.
 * @param {Element} block The scheduler block
 */
function readConfig(block) {
  const config = {
    title: '', advisor: '', timezone: 'EST', days: 10, times: [],
  };
  [...block.children].forEach((row) => {
    const [key, value] = row.children;
    const heading = row.querySelector('h1, h2, h3');
    if (heading && !config.title) {
      config.title = heading.textContent.trim();
      return;
    }
    if (!key || !value) return;
    const name = toClassName(key.textContent);
    if (name === 'times') {
      const items = value.querySelectorAll('li').length ? [...value.querySelectorAll('li')] : value.textContent.split(',');
      config.times = items.map((item) => {
        const label = (typeof item === 'string' ? item : item.textContent).trim();
        const struck = typeof item !== 'string' && item.querySelector('s, del');
        return { label: label.replace(/^~/, ''), available: !struck && !label.startsWith('~') };
      }).filter((t) => t.label);
      value.querySelectorAll('s, del').forEach((struck) => {
        const t = config.times.find((x) => x.label === struck.textContent.trim());
        if (t) t.available = false;
      });
    } else if (name === 'days') {
      config.days = Number(value.textContent.trim()) || config.days;
    } else if (name in config) {
      config[name] = value.textContent.trim();
    }
  });
  if (!config.times.length) {
    config.times = DEFAULT_TIMES.map((t) => ({ label: t.replace(/^~/, ''), available: !t.startsWith('~') }));
  }
  if (!config.advisor) {
    const match = config.title.match(/with\s+([^,]+)/i);
    config.advisor = match ? match[1].trim() : 'your SEI advisor';
  }
  return config;
}

function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html !== undefined) node.innerHTML = html;
  return node;
}

/**
 * Scheduler: book a conversation with an SEI advisor (Advisor → Date & Time → Details → Confirm).
 * Rows: [h2 title] then optional key/value rows: Advisor | name, Times | list (struck = taken),
 * Timezone | EST, Days | number of bookable weekdays. On confirm it fires `sei:booked` on window.
 * @param {Element} block The scheduler block element
 */
export default function decorate(block) {
  const config = readConfig(block);
  const days = bookableDays(config.days);
  const state = {
    step: 1,
    date: days[0],
    time: null,
    month: new Date(days[0].getFullYear(), days[0].getMonth(), 1),
    details: {},
  };
  const uid = Math.random().toString(36).slice(2, 8);

  const header = el('div', 'scheduler-header');
  const title = el('h2', 'scheduler-title');
  title.id = `scheduler-title-${uid}`;
  title.textContent = config.title || `Connect with ${config.advisor}`;
  header.append(title);

  const stepper = el('ol', 'scheduler-steps');
  STEPS.forEach((label, i) => {
    const html = `<span class="scheduler-step-dot">${i + 1}</span><span class="scheduler-step-label">${label}</span>`;
    stepper.append(el('li', 'scheduler-step', html));
  });
  const stepsWrap = el('div', 'scheduler-stepper');
  stepsWrap.append(stepper);

  const body = el('div', 'scheduler-body');
  const footer = el('div', 'scheduler-footer');
  const back = el('button', 'scheduler-back', 'Back');
  back.type = 'button';
  const progress = el('span', 'scheduler-progress');
  const next = el('button', 'scheduler-next', 'Continue');
  next.type = 'button';
  const footerEnd = el('div', 'scheduler-footer-end');
  footerEnd.append(progress, next);
  footer.append(back, footerEnd);

  // step 2: date & time
  const dateTime = el('div', 'scheduler-panel scheduler-datetime');
  const calendarCol = el('div', 'scheduler-col');
  calendarCol.append(el('h3', '', 'Select a Date'));
  const calendar = el('div', 'scheduler-calendar');
  const calHead = el('div', 'scheduler-cal-head');
  const prev = el('button', 'scheduler-cal-nav prev');
  prev.type = 'button';
  prev.setAttribute('aria-label', 'Previous month');
  const monthLabel = el('span', 'scheduler-cal-month');
  monthLabel.setAttribute('aria-live', 'polite');
  const nextMonth = el('button', 'scheduler-cal-nav next');
  nextMonth.type = 'button';
  nextMonth.setAttribute('aria-label', 'Next month');
  calHead.append(prev, monthLabel, nextMonth);
  const weekdays = el('div', 'scheduler-cal-weekdays', DAYS.map((d) => `<span>${d}</span>`).join(''));
  const grid = el('div', 'scheduler-cal-grid');
  grid.setAttribute('role', 'grid');
  calendar.append(calHead, weekdays, grid);
  const selectedDate = el('p', 'scheduler-selected-date');
  calendarCol.append(calendar, selectedDate);

  const timeCol = el('div', 'scheduler-col');
  timeCol.append(el('h3', '', `Select a Time<span>${config.timezone}</span>`));
  const times = el('div', 'scheduler-times');
  timeCol.append(times);
  dateTime.append(calendarCol, timeCol);

  // step 3: details
  const detailsPanel = el('form', 'scheduler-panel scheduler-details');
  detailsPanel.noValidate = true;
  detailsPanel.innerHTML = `
    <h3>Your Details</h3>
    <div class="scheduler-fields">
      <label>Full name<input name="name" type="text" autocomplete="name" required></label>
      <label>Work email<input name="email" type="email" autocomplete="email" required></label>
      <label>Firm name<input name="firm" type="text" autocomplete="organization"></label>
      <label>Phone (optional)<input name="phone" type="tel" autocomplete="tel"></label>
      <label class="wide">What would you like to discuss?<textarea name="notes" rows="3"></textarea></label>
    </div>`;

  // step 4: confirm + success
  const confirmPanel = el('div', 'scheduler-panel scheduler-confirm');
  const donePanel = el('div', 'scheduler-panel scheduler-done');

  body.append(dateTime, detailsPanel, confirmPanel, donePanel);

  function renderCalendar() {
    monthLabel.textContent = fmtMonth.format(state.month);
    grid.textContent = '';
    const first = new Date(state.month);
    const lastDay = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
    for (let i = 0; i < first.getDay(); i += 1) grid.append(el('span', 'scheduler-cal-pad'));
    for (let d = 1; d <= lastDay; d += 1) {
      const date = new Date(first.getFullYear(), first.getMonth(), d);
      const btn = el('button', 'scheduler-cal-day', String(d));
      btn.type = 'button';
      const available = days.some((x) => sameDay(x, date));
      btn.disabled = !available;
      btn.setAttribute('aria-label', fmtLong.format(date));
      if (sameDay(date, state.date)) {
        btn.classList.add('selected');
        btn.setAttribute('aria-pressed', 'true');
      }
      btn.addEventListener('click', () => {
        state.date = date;
        state.time = null;
        // eslint-disable-next-line no-use-before-define
        render();
      });
      grid.append(btn);
    }
    const months = days.map((x) => x.getFullYear() * 12 + x.getMonth());
    const current = state.month.getFullYear() * 12 + state.month.getMonth();
    prev.disabled = current <= Math.min(...months);
    nextMonth.disabled = current >= Math.max(...months);
    selectedDate.textContent = state.date ? fmtLong.format(state.date) : '';
  }

  function renderTimes() {
    times.textContent = '';
    config.times.forEach((t) => {
      const btn = el('button', 'scheduler-time', t.label);
      btn.type = 'button';
      btn.disabled = !t.available;
      if (!t.available) btn.setAttribute('aria-label', `${t.label} unavailable`);
      if (state.time === t.label) {
        btn.classList.add('selected');
        btn.setAttribute('aria-pressed', 'true');
      }
      btn.addEventListener('click', () => {
        state.time = t.label;
        // eslint-disable-next-line no-use-before-define
        render();
      });
      times.append(btn);
    });
  }

  function summaryRows() {
    const d = state.details;
    return [
      ['Advisor', config.advisor],
      ['Date', fmtLong.format(state.date)],
      ['Time', `${state.time} ${config.timezone}`],
      ['Name', d.name],
      ['Email', d.email],
      ['Firm', d.firm],
    ].filter(([, v]) => v).map(([k, v]) => `<div><dt>${k}</dt><dd>${v.replace(/</g, '&lt;')}</dd></div>`).join('');
  }

  function render() {
    [...stepper.children].forEach((li, i) => {
      li.classList.toggle('done', i < state.step || state.step === 4);
      li.classList.toggle('current', i === state.step && state.step < 4);
      if (i === state.step && state.step < 4) li.setAttribute('aria-current', 'step');
      else li.removeAttribute('aria-current');
    });
    dateTime.hidden = state.step !== 1;
    detailsPanel.hidden = state.step !== 2;
    confirmPanel.hidden = state.step !== 3;
    donePanel.hidden = state.step !== 4;
    footer.hidden = state.step === 4;
    progress.textContent = `Step ${state.step + 1} of ${STEPS.length}`;
    next.textContent = state.step === 3 ? 'Confirm booking' : 'Continue';
    if (state.step === 1) {
      renderCalendar();
      renderTimes();
      next.disabled = !state.time;
    } else {
      next.disabled = false;
    }
    if (state.step === 3) {
      confirmPanel.innerHTML = `<h3>Confirm your conversation</h3><dl class="scheduler-summary">${summaryRows()}</dl>`;
    }
  }

  prev.addEventListener('click', () => {
    state.month = new Date(state.month.getFullYear(), state.month.getMonth() - 1, 1);
    renderCalendar();
  });
  nextMonth.addEventListener('click', () => {
    state.month = new Date(state.month.getFullYear(), state.month.getMonth() + 1, 1);
    renderCalendar();
  });

  back.addEventListener('click', () => {
    if (state.step <= 1) {
      block.dispatchEvent(new CustomEvent('modal:close', { bubbles: true }));
      return;
    }
    state.step -= 1;
    render();
  });

  next.addEventListener('click', () => {
    if (state.step === 2) {
      const invalid = [...detailsPanel.querySelectorAll('input, textarea')].find((f) => !f.checkValidity());
      if (invalid) {
        invalid.reportValidity();
        return;
      }
      state.details = Object.fromEntries(new FormData(detailsPanel).entries());
    }
    if (state.step === 3) {
      const label = `${fmtLong.format(state.date).replace(/, \d{4}$/, '')}, ${state.time}`;
      const booking = {
        advisor: config.advisor, date: state.date.toISOString(), time: state.time, label,
      };
      try {
        sessionStorage.setItem('sei-booking', JSON.stringify(booking));
      } catch { /* storage unavailable */ }
      window.dispatchEvent(new CustomEvent('sei:booked', { detail: booking }));
      donePanel.innerHTML = `<span class="scheduler-done-icon" aria-hidden="true"></span>
        <h3>You are booked.</h3>
        <p>Your conversation with ${config.advisor} is set for <strong>${fmtLong.format(state.date)} at ${state.time} ${config.timezone}</strong>.</p>
        <p>A calendar invitation is on its way to ${(state.details.email || 'your inbox').replace(/</g, '&lt;')}.</p>
        <p><button type="button" class="scheduler-finish">Done</button></p>`;
      donePanel.querySelector('.scheduler-finish').addEventListener('click', () => {
        block.dispatchEvent(new CustomEvent('modal:close', { bubbles: true }));
      });
    }
    state.step += 1;
    render();
    body.scrollTop = 0;
  });

  detailsPanel.addEventListener('submit', (e) => {
    e.preventDefault();
    next.click();
  });

  block.replaceChildren(header, stepsWrap, body, footer);
  render();
}
