/**
 * Newsletter — Experience Workspace: the eyebrow, field label and disclaimer paragraphs are
 * MOVED into generated wrappers (`.eyebrow-wrap`, the <label>, `.newsletter-disclaimer`).
 * @ew-exempt <p> placeholder (form cell, line 2) — rendered as the input's placeholder attribute
 * @ew-exempt <p> button text (form cell, line 3) — rendered in the submit <button> (EW7)
 */

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
    // the eyebrow class dies in the editor; the wrapper keeps the paint (EW2)
    content.querySelectorAll(':scope > p.eyebrow').forEach((p) => {
      const wrap = document.createElement('div');
      wrap.className = 'eyebrow-wrap';
      p.replaceWith(wrap);
      wrap.append(p);
    });
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
  if (labelText) {
    // move the authored paragraph (EW1); while it is being edited, a click on it
    // must place the caret instead of focusing the input
    label.append(labelText);
    label.addEventListener('click', (e) => {
      if (e.target.closest('.prosemirror-editor')) e.preventDefault();
    });
  } else {
    label.textContent = 'Business Email';
  }

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
    const wrap = document.createElement('div');
    wrap.className = 'newsletter-disclaimer';
    wrap.append(p);
    form.append(wrap);
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
