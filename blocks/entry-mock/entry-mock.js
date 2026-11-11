/**
 * @ew-exempt <p> row key cells (Profile, Ad, Post, Promoted, Assistant, Question, Answer) — config
 * @ew-exempt <p> stats lines (e.g. 247 likes · 32 comments) — derived: split into two counters
 */
import { createOptimizedPicture, toClassName } from '../../scripts/aem.js';
import { pageHref, track } from '../../scripts/profile.js';

/*
 * Entry mock: a simulated third-party screen where a journey starts (Figma "Stage 1 Discover"):
 * a social feed with an SEI ad, or an AI assistant answer that recommends SEI. The page drops
 * the SEI header, footer and chat so it reads as the other site, and carries a "simulated" label.
 * Rows are keyed by their first cell:
 *  - `social`: Profile | name, headline · Ad | sponsor, followers, picture, h2, CTA link, stats ·
 *    Post | name, role, text, stats (repeatable) · Promoted | title, text
 *  - `ai-answer`: Assistant | product name · Question | text · Answer | rich text with a link
 * Links carry utm_* parameters so the landing page knows where the visitor came from.
 * Authored paragraphs, headings and pictures MOVE into class-carrying wrappers (EW1/EW2); the
 * text fallbacks only fire for cells without elements (off-pipeline content).
 */

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

/** A generated wrapper holding an authored element (or a text fallback). */
function slot(className, node, fallback = '') {
  const wrap = el('div', className);
  if (node) wrap.append(node);
  else if (fallback) wrap.textContent = fallback;
  return wrap;
}

function readRows(block) {
  return [...block.children].map((row) => {
    const [key, value] = row.children;
    return { key: toClassName(key?.textContent || ''), value: value || key };
  });
}

function who(nameNode, metaNode, metaClass = '') {
  const node = el('div');
  node.append(
    slot('entry-mock-name', nameNode),
    slot(`entry-mock-meta${metaClass ? ` ${metaClass}` : ''}`, metaNode),
  );
  return node;
}

function avatar(name) {
  const initials = name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2)
    .toUpperCase();
  const node = el('span', 'entry-mock-avatar', initials);
  node.setAttribute('aria-hidden', 'true');
  return node;
}

function stats(text) {
  const [likes, comments] = text.split('·').map((t) => t.trim());
  const row = el('div', 'entry-mock-stats');
  row.append(el('span', '', likes || ''), el('span', '', comments || ''));
  const actions = el('div', 'entry-mock-actions');
  ['Like', 'Comment', 'Repost', 'Send'].forEach((label) => actions.append(el('span', '', label)));
  return [row, actions];
}

/**
 * Optimizes an authored picture IN PLACE: the authored <img> (which carries the editor's image
 * index) takes the optimized sources and attributes instead of being replaced.
 */
function optimizePicture(picture, breakpoints) {
  const img = picture.querySelector('img');
  if (!img) return picture;
  const optimized = createOptimizedPicture(img.src, img.alt, false, breakpoints);
  const fresh = optimized.querySelector('img');
  [...fresh.attributes].forEach(({ name, value }) => img.setAttribute(name, value));
  picture.querySelectorAll('source').forEach((source) => source.remove());
  picture.prepend(...optimized.querySelectorAll('source'));
  picture.append(img);
  return picture;
}

function buildSocial(rows) {
  const page = el('div', 'entry-mock-social');
  const left = el('aside', 'entry-mock-left');
  const feed = el('div', 'entry-mock-feed');
  const right = el('aside', 'entry-mock-right');

  rows.forEach(({ key, value }) => {
    const paras = [...value.querySelectorAll(':scope > p, :scope > h2, :scope > h3')];
    if (key === 'profile') {
      const card = el('div', 'entry-mock-card entry-mock-profile');
      const name = paras[0]?.textContent.trim() || '';
      card.append(el('div', 'entry-mock-cover'), avatar(name), slot('entry-mock-name', paras[0]));
      paras.slice(1).forEach((p) => card.append(slot('entry-mock-headline', p)));
      left.append(card);
    } else if (key === 'ad') {
      const post = el('article', 'entry-mock-card entry-mock-post entry-mock-ad');
      const [sponsor, followers] = paras.filter((p) => !p.querySelector('picture, a') && p.tagName === 'P');
      const statLine = paras.find((p) => p.textContent.includes('·') && p !== followers);
      const head = el('div', 'entry-mock-post-head');
      const logo = value.querySelector('picture');
      const mark = el('span', 'entry-mock-logo');
      if (logo) mark.append(logo);
      // " · Promoted" follows the authored followers line as generated content (CSS)
      head.append(mark, who(sponsor, followers || el('p', '', ''), 'is-promoted'));
      post.append(head);

      const link = value.querySelector('a');
      const creative = el(link ? 'a' : 'div', 'entry-mock-creative');
      const art = [...value.querySelectorAll('picture')].find((p) => p !== logo);
      if (art) creative.append(optimizePicture(art, [{ width: '1200' }]));
      const headline = value.querySelector('h2, h3');
      if (headline) creative.append(slot('entry-mock-ad-headline', headline));
      if (link) {
        const href = link.getAttribute('href');
        creative.href = pageHref(href);
        // card-as-link (EW6): the CTA paragraph moves into the card, its inner anchor unwraps
        const par = link.closest('p');
        const cta = el('div', 'entry-mock-cta');
        if (par) {
          par.removeAttribute('class');
          cta.append(par);
          link.replaceWith(...link.childNodes);
        } else {
          cta.textContent = link.textContent.trim();
        }
        creative.append(cta);
        creative.addEventListener('click', () => track('ad-click', { ad: { headline: headline?.textContent.trim(), href } }));
      }
      post.append(creative);
      if (statLine) post.append(...stats(statLine.textContent));
      feed.append(post);
    } else if (key === 'post') {
      const post = el('article', 'entry-mock-card entry-mock-post');
      const [name, role, ...rest] = paras;
      const head = el('div', 'entry-mock-post-head');
      head.append(avatar(name?.textContent.trim() || ''), who(name, role));
      post.append(head);
      const statLine = rest.length > 1 ? rest.pop() : null;
      rest.forEach((p) => post.append(slot('entry-mock-text', p)));
      if (statLine) post.append(...stats(statLine.textContent));
      feed.append(post);
    } else if (key === 'promoted') {
      const card = el('div', 'entry-mock-card entry-mock-promoted');
      card.append(el('p', 'entry-mock-meta', 'Promoted'));
      paras.forEach((p, i) => card.append(slot(i === 0 ? 'entry-mock-name' : 'entry-mock-text', p)));
      right.append(card);
    }
  });

  page.append(left, feed, right);
  return page;
}

function buildAnswer(rows) {
  const page = el('div', 'entry-mock-ai');
  const thread = el('div', 'entry-mock-thread');
  rows.forEach(({ key, value }) => {
    if (key === 'question') {
      const question = el('div', 'entry-mock-question');
      question.append(...value.childNodes);
      thread.append(question);
    } else if (key === 'answer') {
      const answer = el('div', 'entry-mock-answer');
      answer.append(...value.childNodes);
      // source links are styled by element through the answer wrapper (EW2/EW3)
      answer.querySelectorAll('a').forEach((a) => {
        a.classList.remove('button', 'primary', 'secondary', 'accent');
        a.href = pageHref(a.getAttribute('href'));
        a.closest('.button-wrapper')?.classList.remove('button-wrapper');
        a.addEventListener('click', () => track('ai-referral-click', { href: a.getAttribute('href') }));
      });
      thread.append(answer);
    }
  });
  page.append(thread);
  return page;
}

/**
 * @param {Element} block The entry-mock block
 */
export default function decorate(block) {
  const rows = readRows(block);
  const isAnswer = block.classList.contains('ai-answer');
  const productCell = rows.find((r) => r.key === 'assistant')?.value;
  const product = productCell?.textContent.trim();

  const chrome = el('div', 'entry-mock-bar');
  if (isAnswer) {
    // the authored product name moves into the bar; " (simulated)" is generated content (CSS)
    const productPar = productCell?.querySelector('p');
    const site = slot('entry-mock-site', productPar, `${product || 'AI assistant'} (simulated)`);
    if (productPar) site.classList.add('is-product');
    chrome.append(site);
  } else {
    chrome.append(el('span', 'entry-mock-site', 'Social feed (simulated)'));
    chrome.append(el('span', 'entry-mock-search', 'Search'));
  }

  const note = el('p', 'entry-mock-note', 'Simulated for the SEI demo. Not a real third-party page.');
  block.replaceChildren(note, chrome, isAnswer ? buildAnswer(rows) : buildSocial(rows));
  document.body.classList.add('entry-mock-page');
}
