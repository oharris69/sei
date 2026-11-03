/**
 * rb-newsletter — "Stay connected" sign-up slab, saffron, split 6/6 (rebrand R, index-rebrand).
 * Copy (h2 + lede) on the left; on the right a <fieldset> whose legend is the authored eyebrow,
 * a labelled email field, a verde submit button and the disclaimer.
 *
 * Content model (same shape as the site's `newsletter`):
 *   [eyebrow p (short ALL-CAPS, before the heading) → fieldset legend, h2, p copy…]
 *   [p field label, p placeholder, p button text (or a link to the form action), p disclaimer…]
 * Decode tier: template-slotted.
 * @ew-exempt <p> placeholder (cell 2, line 2) — becomes the input's placeholder attribute
 * @ew-exempt <p> button text (cell 2, line 3) — a <button> cannot host the editor (EW7)
 *
 * @param {Element} block The block element
 */
let instance = 0;

const isCaps = (text) => text.length > 0 && text.length <= 60 && /[A-Z]/.test(text)
  && text === text.toUpperCase();

function isEyebrow(el) {
  if (!el.matches('p') || el.querySelector('a, picture, img')) return false;
  if (el.classList.contains('eyebrow')) return true;
  return isCaps(el.textContent.trim()) && !!el.nextElementSibling?.matches('h1, h2, h3');
}

export default function decorate(block) {
  instance += 1;
  const [contentCell, formCell] = [...block.querySelectorAll(':scope > div > div')];
  const id = `rb-newsletter-email-${instance}`;

  const copy = document.createElement('div');
  copy.className = 'rb-newsletter-copy';
  let legendSource = null;
  if (contentCell) {
    [...contentCell.children].forEach((el) => {
      if (!legendSource && isEyebrow(el)) legendSource = el;
      else if (el.textContent.trim()) {
        if (el.matches('p')) el.classList.add('rb-newsletter-lede');
        copy.append(el);
      }
    });
  }

  const form = document.createElement('form');
  form.className = 'rb-newsletter-form';
  const fieldset = document.createElement('fieldset');
  fieldset.className = 'rb-newsletter-fieldset';
  form.append(fieldset);

  const lines = formCell ? [...formCell.querySelectorAll(':scope > p')] : [];
  // the eyebrow may also be authored as the first line of the form cell
  if (!legendSource && lines.length > 4 && isCaps(lines[0].textContent.trim())) {
    legendSource = lines.shift();
  }
  if (legendSource) {
    const legend = document.createElement('legend');
    legend.className = 'rb-newsletter-legend';
    legend.append(...legendSource.childNodes);
    legendSource.remove();
    fieldset.append(legend);
  }

  const [labelLine, placeholderLine, buttonLine, ...disclaimers] = lines;
  const actionLink = buttonLine?.querySelector('a');
  if (actionLink) form.action = actionLink.href;

  const label = document.createElement('label');
  label.className = 'rb-newsletter-label';
  label.htmlFor = id;
  if (labelLine) label.append(...labelLine.childNodes);
  else label.textContent = 'Email';
  fieldset.append(label);

  const row = document.createElement('div');
  row.className = 'rb-newsletter-row';
  const input = document.createElement('input');
  input.type = 'email';
  input.id = id;
  input.name = 'email';
  input.required = true;
  input.autocomplete = 'email';
  if (placeholderLine) input.placeholder = placeholderLine.textContent.trim();
  const button = document.createElement('button');
  button.type = 'submit';
  button.className = 'rb-newsletter-submit';
  button.textContent = buttonLine ? buttonLine.textContent.trim() : 'Subscribe';
  row.append(input, button);
  fieldset.append(row);

  disclaimers.forEach((p) => {
    p.className = 'rb-newsletter-fine';
    fieldset.append(p);
  });

  const status = document.createElement('p');
  status.className = 'rb-newsletter-status';
  status.setAttribute('role', 'status');
  fieldset.append(status);

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
