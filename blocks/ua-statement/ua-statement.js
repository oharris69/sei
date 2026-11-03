/**
 * ua-statement — positioning statement split: large heading + lede left, a cropped round
 * illustration right (uplift variant A).
 *
 * Content model (one row): [h2 (an <em> phrase gets the green highlighter bar), p…] [picture]
 * Cells are placed by role, so the media cell may come first; a text cell holding a picture
 * paragraph also works (the picture moves to the media column).
 * Decode tier: template-slotted (authored nodes are moved, never copied).
 *
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const text = document.createElement('div');
  text.className = 'ua-statement-text';
  const media = document.createElement('div');
  media.className = 'ua-statement-media';

  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    [...cell.children].forEach((el) => {
      const picture = el.matches('picture') ? el : el.querySelector('picture, img');
      if (picture && !el.textContent.trim()) {
        if (!media.children.length) media.append(picture);
      } else {
        text.append(el);
      }
    });
  });

  block.replaceChildren(text);
  if (media.children.length) block.append(media);
  else block.classList.add('no-media');
}
