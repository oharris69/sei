/**
 * @ew-exempt <p> row key cells (Question / Result N / Persona) and the persona value — config
 * @ew-exempt <ul> answer lists — structure: each answer is a choice <button> label (EW7)
 */
import {
  getProfile, saveAnswers, setPersona, track,
} from '../../scripts/profile.js';

/*
 * Readiness: a short interactive check (one question at a time) that ends in a tailored next
 * step. Rows:
 *  - first row: [heading + intro]
 *  - `Question` | [question text + list of answers, least to most ready]
 *  - `Result N` | [heading, text, buttons] — shown when the score is at least N
 *    (the highest match wins)
 *  - optional `Persona` | advisor — the persona the check identifies
 * Answers score 0, 1, 2… in list order. In the hero section it sits over the hero art.
 * Every question and result view is built ONCE from the moved authored nodes and shown or
 * hidden, so each authored text keeps its editor index (EW1); only one view shows at a time.
 */

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function readConfig(block) {
  const config = {
    intro: null, questions: [], results: [], persona: null,
  };
  [...block.children].forEach((row, i) => {
    const [key, value] = row.children;
    const label = key?.textContent.trim().toLowerCase() || '';
    if (i === 0 && !value) {
      config.intro = key;
    } else if (label === 'question' && value) {
      const list = value.querySelector('ul, ol');
      const textNodes = [...value.children].filter((c) => c !== list);
      config.questions.push({
        textNodes,
        // harness-only fallback: a question cell with bare text and no elements
        text: textNodes.length ? '' : value.firstChild?.textContent.trim(),
        answers: list ? [...list.children].map((li) => li.textContent.trim()) : [],
      });
    } else if (label.startsWith('result') && value) {
      config.results.push({ min: Number(label.replace('result', '').trim()) || 0, content: value });
    } else if (label === 'persona' && value) {
      config.persona = value.textContent.trim().toLowerCase();
    }
  });
  config.results.sort((a, b) => b.min - a.min);
  return config;
}

/**
 * @param {Element} block The readiness block
 */
export default function decorate(block) {
  const config = readConfig(block);
  if (!config.questions.length) return;
  const answers = [];
  const card = el('div', 'readiness-card');
  const live = el('div', 'readiness-live');
  live.setAttribute('aria-live', 'polite');

  const intro = el('div', 'readiness-intro');
  if (config.intro) intro.append(...config.intro.childNodes);

  const views = [];
  const show = (view) => views.forEach((v) => { v.hidden = v !== view; });

  const resultViews = config.results.map((result) => {
    const view = el('div', 'readiness-result');
    [...result.content.children].forEach((child) => {
      // eyebrow and CTA paragraphs get class-carrying wrappers so edit mode styles them too
      let wrapClass = '';
      if (child.matches('p.eyebrow')) wrapClass = 'readiness-eyebrow eyebrow-wrap';
      else if (child.matches('p') && child.querySelector('a')
        && child.textContent.trim() === child.querySelector('a').textContent.trim()) {
        wrapClass = 'readiness-cta';
      }
      view.append(wrapClass ? el('div', wrapClass) : child);
      if (wrapClass) view.lastElementChild.append(child);
    });
    const again = el('button', 'readiness-again', 'Start over');
    again.type = 'button';
    again.addEventListener('click', () => {
      answers.length = 0;
      // eslint-disable-next-line no-use-before-define
      showQuestion(0);
    });
    view.append(again);
    view.hidden = true;
    return view;
  });

  function showResult() {
    const score = answers.reduce((sum, a) => sum + a, 0);
    const index = config.results.findIndex((r) => score >= r.min);
    const at = index >= 0 ? index : config.results.length - 1;
    const result = config.results[at];
    const view = resultViews[at];
    show(view || null);
    if (config.persona) setPersona(config.persona, 'readiness');
    saveAnswers('readiness', {
      score,
      max: config.questions.reduce((sum, q) => sum + q.answers.length - 1, 0),
      answers: answers.map((a, i) => config.questions[i].answers[a]),
    });
    track('readiness-completed', { readiness: { score, result: result?.min ?? null } });
    view?.querySelector('h2, h3')?.setAttribute('tabindex', '-1');
    view?.querySelector('h2, h3')?.focus();
  }

  const questionViews = config.questions.map((question, index) => {
    const view = el('fieldset', 'readiness-question');
    const legend = el('legend', 'readiness-legend', question.text || undefined);
    legend.append(...question.textNodes);
    const step = el('p', 'readiness-step', `${index + 1} of ${config.questions.length}`);
    const options = el('div', 'readiness-options');
    question.answers.forEach((answer, a) => {
      const option = el('button', 'readiness-option', answer);
      option.type = 'button';
      option.setAttribute('aria-pressed', 'false');
      option.addEventListener('click', () => {
        answers[index] = a;
        if (index === 0) track('readiness-started');
        // eslint-disable-next-line no-use-before-define
        if (index + 1 < config.questions.length) showQuestion(index + 1);
        else showResult();
      });
      options.append(option);
    });
    view.append(step, legend, options);
    if (index > 0) {
      const back = el('button', 'readiness-back', 'Back');
      back.type = 'button';
      // eslint-disable-next-line no-use-before-define
      back.addEventListener('click', () => showQuestion(index - 1));
      view.append(back);
    }
    view.hidden = true;
    return view;
  });
  views.push(...questionViews, ...resultViews);
  live.append(...views);

  function showQuestion(index) {
    const view = questionViews[index];
    view.querySelectorAll('.readiness-option').forEach((option, a) => {
      option.setAttribute('aria-pressed', String(answers[index] === a));
    });
    show(view);
    if (index > 0) view.querySelector('.readiness-option')?.focus();
  }

  card.append(intro, live);
  block.replaceChildren(card);
  block.closest('.section')?.classList.add('has-readiness');
  showQuestion(0);
  // returning visitors see where they landed last time
  if (getProfile().answers?.readiness) block.classList.add('answered');
}
