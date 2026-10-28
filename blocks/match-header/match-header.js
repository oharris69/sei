/**
 * Match header: personalised page header with copy beside a partner logo.
 * Row 1 cells: [copy] [logo]
 *  - copy: eyebrow p, h1, optional badge (a short paragraph that starts with an icon,
 *    e.g. ":star: TOP RECOMMENDATION"), body paragraphs (use <strong> for the firm name),
 *    a paragraph of `code` chips, and a button (p>strong>a, may contain an icon).
 *  - logo: picture (optional)
 * @param {Element} block The match-header block element
 */
export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const copyCell = cells.find((cell) => cell.querySelector('h1, h2')) || cells[0];
  const logoCell = cells.find((cell) => cell !== copyCell && cell.querySelector('picture'));

  const copy = document.createElement('div');
  copy.className = 'match-header-copy';
  if (copyCell) copy.append(...copyCell.childNodes);

  copy.querySelectorAll(':scope > p').forEach((p) => {
    const nodes = [...p.childNodes]
      .filter((n) => n.nodeType !== Node.TEXT_NODE || n.textContent.trim());
    const [first] = nodes;
    // badge: a short paragraph that starts with an icon
    const short = p.textContent.trim().length <= 60;
    if (first?.classList?.contains('icon') && !p.querySelector('a') && short) {
      p.classList.add('match-header-badge');
      const name = [...first.classList].find((c) => c.startsWith('icon-'))?.substring(5);
      const fallback = name ? `${window.hlx?.codeBasePath || ''}/icons/${name}.svg` : '';
      const src = first.querySelector('img')?.src || fallback;
      if (src) first.style.maskImage = `url('${src}')`;
    }
    // tags: a paragraph made only of `code` chips
    if (nodes.length && nodes.every((n) => n.nodeName === 'CODE')) p.classList.add('match-header-tags');
  });

  const children = [copy];
  if (logoCell) {
    const logo = document.createElement('div');
    logo.className = 'match-header-logo';
    logo.append(...logoCell.querySelectorAll('picture'));
    children.push(logo);
  }
  block.replaceChildren(...children);
}
