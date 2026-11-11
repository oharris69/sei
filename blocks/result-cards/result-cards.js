/**
 * @ew-exempt <p> icon-only action labels — metadata: the link's aria-label/title, never displayed
 */
const TONES = [
  { tone: 'orange', match: /growth|aggressive|equity|high/i },
  { tone: 'blue', match: /conservative|income|preserv|low/i },
  { tone: 'green', match: /moderate|balanced|core/i },
];

function toneFor(text) {
  return TONES.find(({ match }) => match.test(text))?.tone || 'orange';
}

/** Wraps an authored element in place in a generated wrapper that carries the class (EW1). */
function wrapInPlace(el, className) {
  const wrap = document.createElement('div');
  wrap.className = className;
  el.before(wrap);
  wrap.append(el);
  return wrap;
}

/**
 * Result cards: matched strategies with tags, key figures and quick actions.
 * Row per card: [h3 title, p team, p with `code` tags, p description]
 * [p "Label <strong>value</strong>" per figure] [optional p > a links, each with an :icon:]
 * The first tag is neutral; later tags are tinted by keyword
 * (growth = orange, conservative = blue, moderate = green).
 * @param {Element} block The result-cards block element
 */
export default function decorate(block) {
  const list = document.createElement('ul');
  list.className = 'result-cards-list';

  [...block.children].forEach((row) => {
    const [mainCell, statsCell, actionsCell] = [...row.children];
    if (!mainCell) return;
    const li = document.createElement('li');
    li.className = 'result-cards-card';

    mainCell.className = 'result-cards-main';
    // authored elements stay in place inside class-carrying wrappers (EW1/EW2)
    const heading = mainCell.querySelector('h2, h3, h4');
    const paragraphs = [...mainCell.querySelectorAll(':scope > p')];
    const tagsP = paragraphs.find((p) => p.querySelector('code'));
    const textPs = paragraphs.filter((p) => p !== tagsP);
    const roles = textPs.map((p) => (heading && p.previousElementSibling === heading
      ? 'result-cards-team' : 'result-cards-description'));
    if (heading) wrapInPlace(heading, 'result-cards-title');
    textPs.forEach((p, i) => wrapInPlace(p, roles[i]));
    if (tagsP) {
      // the tags paragraph stays one editable unit: its <code> chips are tinted in place
      [...tagsP.querySelectorAll('code')].forEach((code, i) => {
        if (i > 0) code.className = `tone-${toneFor(code.textContent)}`;
      });
      wrapInPlace(tagsP, 'result-cards-tags');
    }
    li.append(mainCell);

    const footer = document.createElement('div');
    footer.className = 'result-cards-footer';
    if (statsCell) {
      const stats = document.createElement('div');
      stats.className = 'result-cards-stats';
      [...statsCell.querySelectorAll('p, li')].forEach((item) => {
        const valueEl = item.querySelector('strong, b');
        if (valueEl && item.matches('p')) {
          // "Label <strong>value</strong>": the authored paragraph moves whole (EW1); CSS
          // stacks the label above the value
          const group = document.createElement('div');
          group.className = 'result-cards-stat';
          group.append(item);
          stats.append(group);
          return;
        }
        // fallback for "Label: value" text (no <strong>): rebuilt, not editable in place
        const value = valueEl ? valueEl.textContent.trim() : '';
        const label = valueEl
          ? item.textContent.replace(valueEl.textContent, '').replace(/[:\s]+$/, '').trim()
          : item.textContent.split(':')[0].trim();
        if (!label && !value) return;
        const group = document.createElement('div');
        group.className = 'result-cards-stat';
        const par = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = value || item.textContent.split(':').slice(1).join(':').trim();
        par.append(label, strong);
        group.append(par);
        stats.append(group);
      });
      footer.append(stats);
    }
    if (actionsCell) {
      const actions = document.createElement('ul');
      actions.className = 'result-cards-actions';
      [...actionsCell.querySelectorAll('a')].forEach((a) => {
        const item = document.createElement('li');
        const label = a.textContent.trim();
        a.className = 'result-cards-action';
        a.removeAttribute('title');
        if (a.querySelector('.icon')) {
          [...a.childNodes].forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) node.remove();
          });
          a.setAttribute('aria-label', label);
          a.title = label;
        }
        item.append(a);
        actions.append(item);
      });
      if (actions.children.length) footer.append(actions);
    }
    if (footer.children.length) li.append(footer);
    list.append(li);
  });

  block.replaceChildren(list);
}
