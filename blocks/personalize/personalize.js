/**
 * Personalize — Experience Workspace: the label pill, the question and link options are MOVED
 * (the label into `.personalize-label`, a link option as its <p> into the option list).
 * @ew-exempt <p> plain-text options — rendered as choice <button>s (EW7)
 */

/**
 * Personalize: a "choose your path" question card.
 * Rows: [label pill] [question | optional logo picture] [option] [option] ...
 * Options may be links (the journey continues there) or plain text.
 * Two short options sit side by side; three or more stack. A bold option starts selected.
 * @param {Element} block The personalize block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  let labelRow;
  let questionRow;
  if (rows.length > 2 && !rows[0].querySelector('picture') && rows[0].children.length === 1) {
    [labelRow, questionRow] = rows;
  } else {
    [questionRow] = rows;
  }
  const optionRows = rows.slice(rows.indexOf(questionRow) + 1);

  block.textContent = '';

  if (labelRow) {
    const label = document.createElement('div');
    label.className = 'personalize-label';
    const cell = labelRow.firstElementChild || labelRow;
    label.append(...cell.childNodes);
    block.append(label);
  }

  const card = document.createElement('div');
  card.className = 'personalize-card';

  const header = document.createElement('div');
  header.className = 'personalize-question';
  [...questionRow.children].forEach((cell) => {
    const picture = cell.querySelector('picture');
    if (picture && !cell.textContent.trim()) {
      picture.classList.add('personalize-logo');
      header.append(picture);
    } else if (cell.textContent.trim()) {
      // move the authored question paragraph (a bare-text cell gets a <p> around its nodes)
      let q = cell.querySelector('p');
      if (!q) {
        q = document.createElement('p');
        q.append(...cell.childNodes);
      }
      q.id = `personalize-q-${Math.random().toString(36).slice(2, 8)}`;
      header.prepend(q);
    }
  });
  card.append(header);

  const options = document.createElement('ul');
  options.className = 'personalize-options';
  options.setAttribute('role', 'list');
  const question = header.querySelector('p');
  if (question) options.setAttribute('aria-labelledby', question.id);
  if (optionRows.length > 2) options.classList.add('stacked');

  optionRows.forEach((row) => {
    const li = document.createElement('li');
    const link = row.querySelector('a');
    const selected = !!row.querySelector('strong, a.button.primary');
    let option;
    if (link) {
      // a link option is the authored anchor, moved with its paragraph (EW3)
      option = link;
      if (option.title === option.textContent) option.removeAttribute('title');
      option.className = 'personalize-option';
      li.append(link.closest('p') || link);
    } else {
      option = document.createElement('button');
      option.className = 'personalize-option';
      option.textContent = row.textContent.trim();
      option.type = 'button';
      li.append(option);
    }
    if (selected) option.classList.add('selected');
    option.addEventListener('click', () => {
      options.querySelectorAll('.personalize-option').forEach((o) => o.classList.remove('selected'));
      option.classList.add('selected');
    });
    options.append(li);
  });
  card.append(options);
  block.append(card);
}
