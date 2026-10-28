/**
 * Hero
 * Rows (any order, any may be omitted):
 *  - a row/cell holding only a picture → background image
 *  - a row/cell with text → eyebrow, heading, copy and CTAs
 * Variants: (default) full-bleed image, `short`, `home`
 * @param {Element} block The hero block element
 */
export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const media = cells.find((cell) => cell.querySelector('picture') && !cell.textContent.trim());
  const content = cells.find((cell) => cell !== media && cell.textContent.trim());

  block.textContent = '';

  if (media) {
    media.className = 'hero-media';
    const img = media.querySelector('img');
    if (img) {
      img.loading = 'eager';
      img.fetchPriority = 'high';
    }
    block.append(media);
  }

  if (content) {
    content.className = 'hero-content';
    if (block.classList.contains('home')) {
      // each line of the heading sits in its own white band
      const heading = content.querySelector('h1, h2');
      if (heading) {
        const lines = heading.innerHTML.split(/<br\s*\/?>/i).filter((l) => l.trim());
        heading.innerHTML = lines.map((line) => `<span class="hero-line">${line.trim()}</span>`).join('');
      }
    }
    block.append(content);
  }
}
