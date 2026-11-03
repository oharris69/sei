/**
 * ua-newsletter — sign-up band on the deep gradient: copy on a deep-current card, the form on
 * an ink card (uplift variant A).
 *
 * Content model (the same shape as the site's `newsletter`):
 *   [optional short label p before the heading, h2, p copy…]
 *   [p field label, p placeholder, p button text (or a link to the form action), p disclaimer…]
 * The short label paragraph becomes the form's legend (e.g. "Stay connected").
 * The form validates client-side and shows a status line (no external API).
 * @ew-exempt placeholder line (cell 2, line 2) — becomes the input's placeholder attribute
 * @ew-exempt button line (cell 2, line 3) — a <button> cannot host the editor
 *
 * @param {Element} block The block element
 */
let instance = 0;

function isLabel(el) {
  const next = el.nextElementSibling;
  const text = el.textContent.trim();
  return el.matches('p') && next?.matches('h1, h2, h3') && text.length <= 60
    && !el.querySelector('a, picture, img');
}

export default function decorate(block) {
  instance += 1;
  const [contentCell, formCell] = [...block.querySelectorAll(':scope > div > div')];
  const id = `ua-newsletter-email-${instance}`;

  const copy = document.createElement('div');
  copy.className = 'ua-newsletter-copy';
  let legendSource = null;
  if (contentCell) {
    [...contentCell.children].forEach((el) => {
      if (!legendSource && isLabel(el)) legendSource = el;
      else copy.append(el);
    });
  }

  const form = document.createElement('form');
  form.className = 'ua-newsletter-form';
  const fieldset = document.createElement('fieldset');
  if (legendSource) {
    const legend = document.createElement('legend');
    legend.className = 'ua-newsletter-legend';
    legend.append(...legendSource.childNodes);
    legendSource.remove();
    fieldset.append(legend);
  }

  const lines = formCell ? [...formCell.querySelectorAll(':scope > p')] : [];
  const [labelLine, placeholderLine, buttonLine, ...disclaimers] = lines;
  const actionLink = buttonLine?.querySelector('a');
  if (actionLink) form.action = actionLink.href;

  const label = document.createElement('label');
  label.className = 'ua-newsletter-label';
  label.htmlFor = id;
  if (labelLine) label.append(...labelLine.childNodes);
  else label.textContent = 'Email';

  const input = document.createElement('input');
  input.type = 'email';
  input.id = id;
  input.name = 'email';
  input.required = true;
  input.autocomplete = 'email';
  if (placeholderLine) input.placeholder = placeholderLine.textContent.trim();

  const button = document.createElement('button');
  button.type = 'submit';
  button.className = 'ua-newsletter-submit';
  button.textContent = buttonLine ? buttonLine.textContent.trim() : 'Subscribe';

  fieldset.append(label, input, button);
  disclaimers.forEach((p) => {
    p.classList.add('ua-newsletter-fine');
    fieldset.append(p);
  });

  const status = document.createElement('p');
  status.className = 'ua-newsletter-status';
  status.setAttribute('role', 'status');
  fieldset.append(status);
  form.append(fieldset);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!input.checkValidity()) {
      input.reportValidity();
      return;
    }
    // runtime value, same message as the site's existing newsletter block
    status.textContent = 'Thanks for subscribing. Look out for the next issue of SEI Insights.';
    form.classList.add('submitted');
    input.value = '';
  });

  block.replaceChildren(copy, form);
}
