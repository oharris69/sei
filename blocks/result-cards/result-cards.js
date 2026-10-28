const TONES = [
  { tone: 'orange', match: /growth|aggressive|equity|high/i },
  { tone: 'blue', match: /conservative|income|preserv|low/i },
  { tone: 'green', match: /moderate|balanced|core/i },
];

function toneFor(text) {
  return TONES.find(({ match }) => match.test(text))?.tone || 'orange';
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
    const heading = mainCell.querySelector('h2, h3, h4');
    if (heading) heading.classList.add('result-cards-title');
    const paragraphs = [...mainCell.querySelectorAll(':scope > p')];
    const tagsP = paragraphs.find((p) => p.querySelector('code'));
    const textPs = paragraphs.filter((p) => p !== tagsP);
    const headingIndex = heading ? [...mainCell.children].indexOf(heading) : -1;
    textPs.forEach((p) => {
      const isTeam = headingIndex >= 0 && p.previousElementSibling === heading;
      p.classList.add(isTeam ? 'result-cards-team' : 'result-cards-description');
    });
    if (tagsP) {
      const tags = document.createElement('ul');
      tags.className = 'result-cards-tags';
      [...tagsP.querySelectorAll('code')].forEach((code, i) => {
        const tag = document.createElement('li');
        tag.textContent = code.textContent.trim();
        if (i > 0) tag.className = `tone-${toneFor(tag.textContent)}`;
        tags.append(tag);
      });
      tagsP.replaceWith(tags);
    }
    li.append(mainCell);

    const footer = document.createElement('div');
    footer.className = 'result-cards-footer';
    if (statsCell) {
      const stats = document.createElement('dl');
      stats.className = 'result-cards-stats';
      [...statsCell.querySelectorAll('p, li')].forEach((item) => {
        const valueEl = item.querySelector('strong, b');
        const value = valueEl ? valueEl.textContent.trim() : '';
        const label = valueEl
          ? item.textContent.replace(valueEl.textContent, '').replace(/[:\s]+$/, '').trim()
          : item.textContent.split(':')[0].trim();
        if (!label && !value) return;
        const group = document.createElement('div');
        const dt = document.createElement('dt');
        dt.textContent = label;
        const dd = document.createElement('dd');
        dd.textContent = value || item.textContent.split(':').slice(1).join(':').trim();
        group.append(dt, dd);
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
