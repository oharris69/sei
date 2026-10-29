import { createOptimizedPicture } from '../../scripts/aem.js';

const REPLY = 'Thanks for your question. An SEI specialist will follow up shortly — in the meantime, the resources above are a great place to start.';

/**
 * Turns a row cell into a chat bubble, upgrading a picture + link into a video thumbnail.
 * @param {Element} cell The authored cell
 * @returns {Element} The bubble
 */
function buildBubble(cell) {
  const bubble = document.createElement('div');
  bubble.className = 'assistant-bubble';
  bubble.append(...cell.childNodes);

  const img = bubble.querySelector('img');
  if (img) {
    const picture = createOptimizedPicture(img.src, img.alt, false, [{ width: '600' }]);
    const link = [...bubble.querySelectorAll('a')].find((a) => !a.querySelector('img'));
    const media = document.createElement(link ? 'a' : 'div');
    media.className = 'assistant-video';
    if (link) {
      media.href = link.href;
      media.setAttribute('aria-label', link.textContent.trim() || img.alt || 'Play video');
      const p = link.closest('p');
      link.remove();
      if (p && !p.textContent.trim()) p.remove();
    }
    media.append(picture);
    const holder = img.closest('p') || img.closest('picture');
    holder.replaceWith(media);
  }
  return bubble;
}

/**
 * Builds the quick-action buttons from a row that only holds links.
 * @param {Element[]} links The authored links
 * @returns {Element} The actions list
 */
function buildActions(links) {
  const list = document.createElement('ul');
  list.className = 'assistant-actions';
  if (links.length > 1) list.classList.add('grid');
  links.forEach((link) => {
    const li = document.createElement('li');
    link.className = 'assistant-action';
    li.append(link);
    list.append(li);
  });
  return list;
}

/**
 * Assistant: the "SEI Assistant" chat panel shown in the docked modal.
 * Rows (in order): optional [h2 title] for the red header bar, then one row per message:
 *  - text / lists / a picture with a video link → assistant bubble
 *  - a row holding only links → quick-action buttons
 *  - a row holding only italic text → placeholder for the message box
 * @param {Element} block The assistant block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  const header = document.createElement('div');
  header.className = 'assistant-header';
  const thread = document.createElement('div');
  thread.className = 'assistant-thread';
  thread.setAttribute('role', 'log');
  thread.setAttribute('aria-live', 'polite');
  let placeholder = 'Enter your message...';

  rows.forEach((row, i) => {
    const cell = row.firstElementChild;
    if (!cell) return;
    const heading = cell.querySelector('h1, h2, h3');
    if (i === 0 && heading && !cell.querySelector('picture')) {
      const title = document.createElement('p');
      title.className = 'assistant-title';
      title.id = heading.id || 'assistant-title';
      title.textContent = heading.textContent.trim();
      header.append(title);
      return;
    }
    const text = cell.textContent.trim();
    const links = [...cell.querySelectorAll('a')];
    const linkText = links.map((a) => a.textContent.trim()).join('');
    if (links.length && !cell.querySelector('img') && text.replace(/\s/g, '') === linkText.replace(/\s/g, '')) {
      thread.append(buildActions(links));
      return;
    }
    const em = cell.querySelector('em');
    if (em && em.textContent.trim() === text && !links.length) {
      placeholder = text;
      return;
    }
    thread.append(buildBubble(cell));
  });

  const form = document.createElement('form');
  form.className = 'assistant-form';
  const inputId = `assistant-input-${Math.random().toString(36).slice(2, 8)}`;
  form.innerHTML = `<label class="assistant-sr" for="${inputId}">Message</label>
    <input id="${inputId}" type="text" name="message" autocomplete="off" placeholder="${placeholder.replace(/"/g, '&quot;')}">
    <button type="submit" class="assistant-send" aria-label="Send message"></button>`;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input');
    const message = input.value.trim();
    if (!message) return;
    const mine = document.createElement('div');
    mine.className = 'assistant-bubble assistant-user';
    mine.textContent = message;
    thread.append(mine);
    input.value = '';
    const typing = document.createElement('div');
    typing.className = 'assistant-bubble assistant-typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    typing.setAttribute('aria-label', 'SEI Assistant is typing');
    thread.append(typing);
    thread.scrollTop = thread.scrollHeight;
    setTimeout(() => {
      typing.classList.remove('assistant-typing');
      typing.removeAttribute('aria-label');
      typing.textContent = REPLY;
      thread.scrollTop = thread.scrollHeight;
    }, 900);
  });

  block.replaceChildren(header, thread, form);
}
