/**
 * ud-newsletter — sign-up band on the Blue field (uplift variant D): copy on the left, the form
 * on the right (legend, label, input + ink button on one row, disclaimer).
 * Schema: stardust/eds-schema/index-uplift-d.json § newsletter.
 *
 * Content model (the same shape as `ua-newsletter` / the site's `newsletter`):
 *   [optional short label p before the heading, h2, p copy…]
 *   [p field label, p placeholder, p button text (or a link to the form action), p disclaimer…]
 * The short label paragraph becomes the form's legend (e.g. "Stay connected").
 * The form validates client-side and shows a status line (no external API).
 * @ew-exempt placeholder line (cell 2, line 2) — becomes the input's placeholder attribute
 * @ew-exempt button line (cell 2, line 3) — a <button> cannot host the editor
 * Decode tier: template-slotted (fixed form frame, authored lines moved into it).
 *
 * @param {Element} block The block element
 */
const SVG_NS = 'http://www.w3.org/2000/svg';
const ICONS = {
  arrow: [['path', { d: 'M4 12h15.5M13.5 6l6 6-6 6' }]],
};

/** Presentational outline icon (Nucleo outline style, as in the prototype): no text, hidden. */
function icon(name) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', `ud-icon ud-icon-${name}`);
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  ICONS[name].forEach(([tag, attrs]) => {
    const el = document.createElementNS(SVG_NS, tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    svg.append(el);
  });
  return svg;
}

/** Appends the trailing arrow once (idempotent: re-decoration never doubles it). */
function addArrow(el) {
  if (el && !el.querySelector(':scope > .ud-icon-arrow')) el.append(icon('arrow'));
}

let instance = 0;

function isLabel(el) {
  const next = el.nextElementSibling;
  const text = el.textContent.trim();
  return el.matches('p') && next?.matches('h1, h2, h3') && text.length <= 60
    && !el.querySelector('a, picture, img');
}

function div(className, nodes = []) {
  const el = document.createElement('div');
  el.className = className;
  el.append(...nodes);
  return el;
}

export default function decorate(block) {
  instance += 1;
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const contentCell = cells.find((c) => c.querySelector('h1, h2, h3')) || cells[0];
  const formCell = cells.find((c) => c !== contentCell);
  const id = `ud-newsletter-email-${instance}`;

  const copy = div('ud-newsletter-copy');
  let legendSource = null;
  if (contentCell) {
    [...contentCell.children].forEach((el) => {
      if (!legendSource && isLabel(el)) legendSource = el;
      else copy.append(el);
    });
  }

  const form = document.createElement('form');
  form.className = 'ud-newsletter-form';
  form.noValidate = true;
  const fieldset = document.createElement('fieldset');
  if (legendSource) {
    const legend = document.createElement('legend');
    legend.className = 'ud-newsletter-legend';
    legend.append(...legendSource.childNodes);
    legendSource.remove();
    fieldset.append(legend);
  }

  const lines = formCell ? [...formCell.children].filter((p) => p.textContent.trim()) : [];
  const [labelLine, placeholderLine, buttonLine, ...disclaimers] = lines;
  const actionLink = buttonLine?.querySelector('a');
  if (actionLink) form.action = actionLink.href;

  const label = document.createElement('label');
  label.className = 'ud-newsletter-label';
  label.htmlFor = id;
  if (labelLine) label.append(...labelLine.childNodes);

  const input = document.createElement('input');
  input.type = 'email';
  input.id = id;
  input.name = 'email';
  input.required = true;
  input.autocomplete = 'email';
  if (placeholderLine) input.placeholder = placeholderLine.textContent.trim();

  const button = document.createElement('button');
  button.type = 'submit';
  button.className = 'ud-newsletter-submit';
  if (buttonLine) button.textContent = buttonLine.textContent.trim();
  addArrow(button);

  fieldset.append(label, div('ud-newsletter-row', [input, button]));
  if (disclaimers.length) fieldset.append(div('ud-newsletter-fine', disclaimers));

  const status = document.createElement('p');
  status.className = 'ud-newsletter-status';
  status.setAttribute('role', 'status');
  fieldset.append(status);
  form.append(fieldset);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!input.checkValidity()) {
      input.setAttribute('aria-invalid', 'true');
      input.reportValidity();
      return;
    }
    input.removeAttribute('aria-invalid');
    // runtime value, same message as the site's existing newsletter block
    status.textContent = 'Thanks for subscribing. Look out for the next issue of SEI Insights.';
    form.classList.add('submitted');
    input.value = '';
  });

  block.replaceChildren(copy, form);
}
