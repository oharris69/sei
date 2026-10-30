/**
 * sd-statement — positioning statement with its illustration (stardust redesign).
 * Heading and copy on the left, the SEI ring illustration on the right, sharing a top line.
 *
 * Content model (one row): [h2 (may hold <em> emphasis and a <strong> period), p…] [picture]
 * Cells are placed by role, so the media cell may come first.
 * Schema: stardust/eds-schema/index-stardust.json § connective-tissue.
 * Decode tier: template-slotted.
 *
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const text = document.createElement('div');
  text.className = 'sd-statement-text';
  const media = document.createElement('div');
  media.className = 'sd-statement-media';

  cells.forEach((cell) => {
    const hasText = cell.querySelector('h1, h2, h3, h4, p:not(:has(picture, img))');
    const picture = cell.querySelector('picture') || cell.querySelector('img');
    if (picture && !hasText) {
      media.append(picture);
    } else {
      text.append(...cell.children);
    }
  });

  block.replaceChildren(text);
  if (media.children.length) block.append(media);
}
