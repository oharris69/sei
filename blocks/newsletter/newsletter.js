/**
 * Newsletter sign-up band.
 * Row cells: [eyebrow, heading, copy]
 * [field label, placeholder, button text (or link to the form action), disclaimer]
 * @param {Element} block The newsletter block element
 */
export default function decorate(block) {
  const [content, formCell] = [...block.querySelectorAll(':scope > div > div')];
  block.textContent = '';

  if (content) {
    content.className = 'newsletter-content';
    block.append(content);
  }

  if (!formCell) return;
  const lines = [...formCell.querySelectorAll('p')];
  const [labelText, placeholder, buttonLine, ...disclaimer] = lines;
  const actionLink = buttonLine?.querySelector('a');

  const form = document.createElement('form');
  form.className = 'newsletter-form';
  form.noValidate = false;
  if (actionLink) form.action = actionLink.href;

  const id = `newsletter-email-${Math.random().toString(36).slice(2, 8)}`;
  const label = document.createElement('label');
  label.htmlFor = id;
  label.textContent = labelText?.textContent.trim() || 'Business Email';

  const input = document.createElement('input');
  input.type = 'email';
  input.id = id;
  input.name = 'email';
  input.required = true;
  input.autocomplete = 'email';
  input.placeholder = placeholder?.textContent.trim() || 'yourname@company.com';

  const button = document.createElement('button');
  button.type = 'submit';
  button.className = 'newsletter-submit';
  button.textContent = buttonLine?.textContent.trim() || 'Subscribe';

  const status = document.createElement('p');
  status.className = 'newsletter-status';
  status.setAttribute('role', 'status');

  form.append(label, input, button);
  disclaimer.forEach((p) => {
    p.classList.add('newsletter-disclaimer');
    form.append(p);
  });
  form.append(status);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!input.checkValidity()) {
      input.reportValidity();
      return;
    }
    status.textContent = 'Thanks for subscribing. Look out for the next issue of SEI Insights.';
    form.classList.add('submitted');
    input.value = '';
  });

  block.append(form);
}
