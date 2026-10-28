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
    const label = document.createElement('p');
    label.className = 'personalize-label';
    label.textContent = labelRow.textContent.trim();
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
    } else {
      const q = document.createElement('p');
      q.id = `personalize-q-${Math.random().toString(36).slice(2, 8)}`;
      q.textContent = cell.textContent.trim();
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
    const option = document.createElement(link ? 'a' : 'button');
    option.className = 'personalize-option';
    option.textContent = row.textContent.trim();
    if (link) option.href = link.href;
    else option.type = 'button';
    if (row.querySelector('strong')) option.classList.add('selected');
    option.addEventListener('click', () => {
      options.querySelectorAll('.personalize-option').forEach((o) => o.classList.remove('selected'));
      option.classList.add('selected');
    });
    li.append(option);
    options.append(li);
  });
  card.append(options);
  block.append(card);
}
