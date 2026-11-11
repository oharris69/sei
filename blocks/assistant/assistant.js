/**
 * @ew-exempt <p> video link label — metadata: the video thumbnail's aria-label, never displayed
 * @ew-exempt <p> italic-only row — config: the message box's placeholder attribute
 */
import { createOptimizedPicture } from '../../scripts/aem.js';
import {
  PERSONAS, book, calendarHref, currentPath, getProfile, journeyStatus, onProfileChange,
  pageHref, setPersona, specialistFor, track,
} from '../../scripts/profile.js';
import { answer, personaIn, suggestions } from './answers.js';

const fmtLong = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
const fmtShort = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
const SLOT_TIMES = ['10:00 AM', '2:00 PM'];

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
    // optimize the AUTHORED picture in place: its <img> keeps the editor's image index (EW1)
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '600' }]);
    const holder = img.closest('p') || img.closest('picture') || img;
    const picture = img.closest('picture') || document.createElement('picture');
    const link = [...bubble.querySelectorAll('a')].find((a) => !a.querySelector('img'));
    const media = document.createElement(link ? 'a' : 'div');
    holder.replaceWith(media);
    [...optimized.querySelector('img').attributes]
      .forEach(({ name, value }) => img.setAttribute(name, value));
    picture.querySelectorAll('source').forEach((source) => source.remove());
    picture.prepend(...optimized.querySelectorAll('source'));
    picture.append(img);
    media.className = 'assistant-video';
    if (link) {
      media.href = link.href;
      media.setAttribute('aria-label', link.textContent.trim() || img.alt || 'Play video');
      const p = link.closest('p');
      link.remove();
      if (p && !p.textContent.trim()) p.remove();
    }
    media.append(picture);
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
    // an authored link moves as its <p> (EW3); styled by element through the list (EW2)
    const par = link.closest('p');
    if (par) par.removeAttribute('class');
    li.append(par || link);
    list.append(li);
  });
  return list;
}

function newBubble(className = '') {
  const node = document.createElement('div');
  node.className = `assistant-bubble ${className}`.trim();
  return node;
}

function para(text, tag = 'p') {
  const p = document.createElement(tag);
  p.textContent = text;
  return p;
}

/** Next bookable slots: two times on each of the next two weekdays. */
function nextSlots() {
  const slots = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  while (slots.length < SLOT_TIMES.length * 2) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) {
      SLOT_TIMES.forEach((time) => slots.push({ date: new Date(d), time }));
    }
  }
  return slots;
}

/**
 * The live part of the chat: a greeting for who the visitor is and where they are,
 * quick replies, canned answers and booking a call without leaving the conversation.
 * @param {Element} thread The message thread
 */
function buildConversation(thread) {
  let chips;
  const scroll = () => { thread.scrollTop = thread.scrollHeight; };

  function linkList(links) {
    return buildActions(links.map(([label, href]) => {
      const a = document.createElement('a');
      a.href = pageHref(href);
      a.textContent = label;
      return a;
    }));
  }

  function choice(label, onPick, className = 'assistant-chip') {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.textContent = label;
    button.addEventListener('click', () => onPick(label));
    return button;
  }

  function choices(items, onPick, className) {
    const list = document.createElement('ul');
    list.className = 'assistant-chips';
    items.forEach(([label, value]) => {
      const li = document.createElement('li');
      li.append(choice(label, () => {
        list.querySelectorAll('button').forEach((b) => { b.disabled = true; });
        onPick(value, label);
      }, className));
      list.append(li);
    });
    return list;
  }

  function say(build, delay = 700) {
    const typing = newBubble('assistant-typing');
    typing.innerHTML = '<span></span><span></span><span></span>';
    typing.setAttribute('aria-label', 'SEI Assistant is typing');
    thread.append(typing);
    scroll();
    return new Promise((resolve) => {
      setTimeout(() => {
        typing.remove();
        build();
        scroll();
        resolve();
      }, delay);
    });
  }

  function confirmBooking(slot, specialist) {
    const booking = {
      advisor: specialist.name,
      date: slot.date.toISOString(),
      time: slot.time,
      label: `${fmtLong.format(slot.date)}, ${slot.time}`,
      channel: 'assistant',
    };
    const { contact } = getProfile();
    say(() => {
      const request = newBubble();
      request.append(para(`${fmtShort.format(slot.date)} at ${slot.time} EST with ${specialist.name}. Where should I send the invitation?`));
      const form = document.createElement('form');
      form.className = 'assistant-inline-form';
      const id = `assistant-email-${Math.random().toString(36).slice(2, 8)}`;
      form.innerHTML = `<label for="${id}">Work email</label>
        <div><input id="${id}" type="email" name="email" autocomplete="email" required>
        <button type="submit">Confirm</button></div>`;
      const input = form.querySelector('input');
      input.value = contact.email || '';
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!input.checkValidity()) {
          input.reportValidity();
          return;
        }
        form.querySelectorAll('input, button').forEach((f) => { f.disabled = true; });
        book(booking, { email: input.value });
        // eslint-disable-next-line no-use-before-define
        showBooked(booking, input.value);
      });
      request.append(form);
      thread.append(request);
      input.focus();
    });
  }

  function startBooking() {
    const specialist = specialistFor();
    track('chat-booking-started', { specialist: specialist.name });
    say(() => {
      const msg = newBubble();
      msg.append(para(`Here are ${specialist.name}’s next openings (30 minutes, video or phone):`));
      thread.append(msg);
      const slots = nextSlots();
      thread.append(choices(
        slots.map((slot, i) => [`${fmtShort.format(slot.date)} · ${slot.time}`, i]),
        (i) => confirmBooking(slots[i], specialist),
        'assistant-chip assistant-slot',
      ));
      const more = document.createElement('a');
      more.className = 'assistant-more';
      more.href = specialist.modal;
      more.textContent = 'See all times';
      thread.append(more);
    });
  }

  function showBooked(booking, email) {
    say(() => {
      const msg = newBubble('assistant-booked');
      msg.append(para('You are booked.', 'strong'));
      msg.append(para(`${booking.advisor} · ${fmtShort.format(new Date(booking.date))} at ${booking.time} EST.${email ? ` The invitation is on its way to ${email}.` : ''}`));
      const ics = document.createElement('a');
      ics.className = 'assistant-ics';
      ics.href = calendarHref(booking);
      ics.download = 'sei-call.ics';
      ics.textContent = 'Add to calendar';
      msg.append(ics);
      thread.append(msg);
      // eslint-disable-next-line no-use-before-define
      showChips();
    });
  }

  function showChips() {
    chips?.remove();
    const profile = getProfile();
    if (!PERSONAS[profile.persona]) {
      chips = choices(
        Object.entries(PERSONAS).map(([id, p]) => [p.label, id]),
        (id, label) => {
          const mine = newBubble('assistant-user');
          mine.textContent = `I’m a ${label.toLowerCase()}`;
          thread.append(mine);
          setPersona(id, 'assistant');
          // eslint-disable-next-line no-use-before-define
          say(() => { thread.append(greeting()); showChips(); });
        },
      );
    } else {
      // eslint-disable-next-line no-use-before-define
      chips = choices(suggestions(profile, currentPath()).map((q) => [q, q]), (q) => ask(q, 'suggested'));
    }
    chips.classList.add('assistant-suggestions');
    thread.append(chips);
    scroll();
  }

  function greeting() {
    const profile = getProfile();
    const status = journeyStatus(profile);
    const name = profile.contact?.name?.split(' ')[0];
    const msg = newBubble('assistant-greeting');
    if (profile.booking) {
      const { booking } = profile;
      msg.append(para(`Your call with ${booking.advisor} is set for ${fmtShort.format(new Date(booking.date))} at ${booking.time} EST.`));
      msg.append(para('Want help getting ready for it?'));
    } else if (status) {
      const done = status.steps.every((s) => s.done);
      msg.append(para(`${name ? `Hi ${name} — you’re` : 'You’re'} on the ${status.journey.name} path${done ? '' : `, step ${status.index + 1} of ${status.steps.length}: ${status.current.label}`}.`));
      msg.append(para('Ask me anything, or pick a topic:'));
    } else {
      msg.append(para('Hi, I’m the SEI Assistant. Tell me who you are and I’ll tailor what you see:'));
    }
    return msg;
  }

  function ask(message, source) {
    const mine = newBubble('assistant-user');
    mine.textContent = message;
    thread.append(mine);
    chips?.remove();
    chips = null;
    const switchTo = personaIn(message);
    if (switchTo) {
      setPersona(switchTo, 'assistant');
      track('chat-message', { chat: { source, topic: 'persona' } });
      say(() => { thread.append(greeting()); showChips(); });
      return;
    }
    const reply = answer(message, { specialist: specialistFor() });
    track('chat-message', { chat: { source, topic: reply.id } });
    if (reply.book && !reply.text) {
      startBooking();
      return;
    }
    say(() => {
      const msg = newBubble();
      msg.append(para(reply.text));
      thread.append(msg);
      if (reply.links?.length) thread.append(linkList(reply.links));
      if (reply.book) {
        thread.append(choices([[`Book a call with ${specialistFor().name}`, true]], startBooking));
      } else {
        showChips();
      }
    });
  }

  // a booking made in the scheduler pop-up shows up in the chat too
  onProfileChange((profile, reason) => {
    if (reason !== 'booking' || profile.booking?.channel === 'assistant') return;
    thread.append(greeting());
    showChips();
  });

  return {
    greet() {
      thread.prepend(greeting());
      showChips();
    },
    ask,
  };
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
      // the authored heading MOVES into the title wrapper (EW1)
      const title = document.createElement('div');
      title.className = 'assistant-title';
      heading.id = heading.id || 'assistant-title';
      title.append(heading);
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

  const conversation = buildConversation(thread);
  conversation.greet();

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
    input.value = '';
    conversation.ask(message, 'typed');
  });

  block.replaceChildren(header, thread, form);
}
