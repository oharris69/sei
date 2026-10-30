/**
 * sd-newsletter — "Stay connected" sign-up band (stardust redesign).
 * Copy sits on the dark end of the current gradient; the form sits on a paper card.
 *
 * Content model (same shape as the site's `newsletter`):
 *   [eyebrow p, h2, p copy] [p field label, p placeholder, p button text (or link to the
 *   form action), p disclaimer…]
 * Schema: stardust/eds-schema/index-stardust.json § newsletter. Decode tier: template-slotted.
 * @ew-exempt <p> placeholder (cell 2, line 2) — becomes the input's placeholder attribute
 * @ew-exempt <p> button text (cell 2, line 3) — a <button> cannot host the editor (EW7)
 *
 * @param {Element} block The block element
 */
let instance = 0;

export default function decorate(block) {
  instance += 1;
  const [contentCell, formCell] = [...block.querySelectorAll(':scope > div > div')];

  const copy = document.createElement('div');
  copy.className = 'sd-newsletter-copy';
  if (contentCell) {
    [...contentCell.children].forEach((el) => {
      const next = el.nextElementSibling;
      const label = el.textContent.trim();
      const isEyebrow = el.matches('p') && next?.matches('h1, h2, h3') && label.length <= 60
        && label === label.toUpperCase() && !el.querySelector('a, picture');
      if (isEyebrow) {
        const eyebrow = document.createElement('div');
        eyebrow.className = 'sd-newsletter-eyebrow';
        eyebrow.append(el);
        copy.append(eyebrow);
      } else {
        copy.append(el);
      }
    });
  }

  const form = document.createElement('form');
  form.className = 'sd-newsletter-form';
  form.noValidate = false;

  const id = `sd-newsletter-email-${instance}`;
  const lines = formCell ? [...formCell.querySelectorAll(':scope > p')] : [];
  const [labelLine, placeholderLine, buttonLine, ...disclaimers] = lines;
  const actionLink = buttonLine?.querySelector('a');
  if (actionLink) form.action = actionLink.href;

  if (labelLine) {
    labelLine.id = `${id}-label`;
    labelLine.classList.add('sd-newsletter-label');
    form.append(labelLine);
  }

  const input = document.createElement('input');
  input.type = 'email';
  input.id = id;
  input.name = 'email';
  input.required = true;
  input.autocomplete = 'email';
  if (labelLine) input.setAttribute('aria-labelledby', labelLine.id);
  else input.setAttribute('aria-label', 'Email');
  if (placeholderLine) input.placeholder = placeholderLine.textContent.trim();
  form.append(input);

  const button = document.createElement('button');
  button.type = 'submit';
  button.className = 'button secondary sd-newsletter-submit';
  button.textContent = buttonLine ? buttonLine.textContent.trim() : '';
  form.append(button);

  disclaimers.forEach((p) => {
    const fine = document.createElement('div');
    fine.className = 'sd-newsletter-fine';
    fine.append(p);
    form.append(fine);
  });

  const status = document.createElement('p');
  status.className = 'sd-newsletter-status';
  status.setAttribute('role', 'status');
  form.append(status);

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
