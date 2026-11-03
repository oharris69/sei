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
 */

function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html !== undefined) node.innerHTML = html;
  return node;
}

function readRows(block) {
  return [...block.children].map((row) => {
    const [key, value] = row.children;
    return { key: toClassName(key?.textContent || ''), value: value || key };
  });
}

function who(name, meta) {
  const node = el('div');
  node.append(el('p', 'entry-mock-name'), el('p', 'entry-mock-meta'));
  node.firstChild.textContent = name;
  node.lastChild.textContent = meta;
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
      const nameEl = el('p', 'entry-mock-name');
      nameEl.textContent = name;
      card.append(el('div', 'entry-mock-cover'), avatar(name), nameEl);
      paras.slice(1).forEach((p) => card.append(el('p', 'entry-mock-headline', p.innerHTML)));
      left.append(card);
    } else if (key === 'ad') {
      const post = el('article', 'entry-mock-card entry-mock-post entry-mock-ad');
      const [sponsor, followers] = paras.filter((p) => !p.querySelector('picture, a') && p.tagName === 'P');
      const head = el('div', 'entry-mock-post-head');
      const logo = value.querySelector('picture');
      const mark = el('span', 'entry-mock-logo');
      if (logo) mark.append(logo);
      head.append(mark, who(sponsor?.textContent.trim() || '', `${followers?.textContent.trim() || ''} · Promoted`));
      post.append(head);

      const link = value.querySelector('a');
      const creative = el(link ? 'a' : 'div', 'entry-mock-creative');
      const art = [...value.querySelectorAll('picture')].find((p) => p !== logo);
      if (art) {
        const img = art.querySelector('img');
        creative.append(createOptimizedPicture(img.src, img.alt, false, [{ width: '1200' }]));
      }
      const headline = value.querySelector('h2, h3');
      if (headline) creative.append(el('p', 'entry-mock-ad-headline', headline.innerHTML));
      if (link) {
        creative.href = pageHref(link.getAttribute('href'));
        creative.append(el('span', 'entry-mock-cta', link.textContent.trim()));
        creative.addEventListener('click', () => track('ad-click', { ad: { headline: headline?.textContent.trim(), href: link.getAttribute('href') } }));
      }
      post.append(creative);
      const statLine = paras.find((p) => p.textContent.includes('·') && p !== followers);
      if (statLine) post.append(...stats(statLine.textContent));
      feed.append(post);
    } else if (key === 'post') {
      const post = el('article', 'entry-mock-card entry-mock-post');
      const [name, role, ...rest] = paras;
      const head = el('div', 'entry-mock-post-head');
      head.append(avatar(name?.textContent.trim() || ''), who(name?.textContent.trim() || '', role?.textContent.trim() || ''));
      post.append(head);
      const statLine = rest.length > 1 ? rest.pop() : null;
      rest.forEach((p) => post.append(el('p', 'entry-mock-text', p.innerHTML)));
      if (statLine) post.append(...stats(statLine.textContent));
      feed.append(post);
    } else if (key === 'promoted') {
      const card = el('div', 'entry-mock-card entry-mock-promoted');
      card.append(el('p', 'entry-mock-meta', 'Promoted'));
      paras.forEach((p, i) => card.append(el('p', i === 0 ? 'entry-mock-name' : 'entry-mock-text', p.innerHTML)));
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
      thread.append(el('div', 'entry-mock-question', value.innerHTML));
    } else if (key === 'answer') {
      const answer = el('div', 'entry-mock-answer');
      answer.append(...value.childNodes);
      answer.querySelectorAll('a').forEach((a) => {
        a.className = 'entry-mock-source';
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
  const product = rows.find((r) => r.key === 'assistant')?.value.textContent.trim();

  const chrome = el('div', 'entry-mock-bar');
  const label = isAnswer ? `${product || 'AI assistant'} (simulated)` : 'Social feed (simulated)';
  chrome.append(el('span', 'entry-mock-site', label));
  if (!isAnswer) chrome.append(el('span', 'entry-mock-search', 'Search'));

  const note = el('p', 'entry-mock-note', 'Simulated for the SEI demo. Not a real third-party page.');
  block.replaceChildren(note, chrome, isAnswer ? buildAnswer(rows) : buildSocial(rows));
  document.body.classList.add('entry-mock-page');
}
