/**
 * sd-perspectives — leadership insight tiles (stardust redesign).
 * The section's heading + "View all insights" link stay default content above the block.
 *
 * Content model (one row per leader — the site's `cards leadership` cells, placed by role):
 *   [picture] [h3 <a> article title, p summary] [h4 name, p role]
 * Cells are classified by content (picture / h3 cell / h4 cell), so their order may vary;
 * authoring the article cell before the person cell keeps the heading outline h2 → h3 → h4.
 * Schema: stardust/eds-schema/index-stardust.json § perspectives. Decode tier: reconstructive.
 *
 * @param {Element} block The block element
 */
function slot(className, nodes) {
  const wrapper = document.createElement('div');
  wrapper.className = className;
  wrapper.append(...nodes);
  return wrapper;
}

export default function decorate(block) {
  const list = document.createElement('ul');
  list.className = 'sd-perspectives-list';

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const mediaCell = cells.find((c) => c.querySelector('picture, img') && !c.querySelector('h3, h4'));
    const articleCell = cells.find((c) => c.querySelector('h3, h2'));
    const personCell = cells.find((c) => c !== articleCell && c !== mediaCell && c.querySelector('h4, p'));
    if (!mediaCell && !articleCell && !personCell) return;

    const card = document.createElement('li');
    card.className = 'sd-lead';
    if (mediaCell) {
      const picture = mediaCell.querySelector('picture') || mediaCell.querySelector('img');
      card.append(slot('sd-lead-media', [picture]));
    }
    // DOM keeps h3 before h4 (outline); grid areas place the person caption above the article
    if (articleCell) card.append(slot('sd-lead-body', [...articleCell.children]));
    if (personCell) card.append(slot('sd-lead-who', [...personCell.children]));
    list.append(card);
  });

  block.replaceChildren(list);
}
