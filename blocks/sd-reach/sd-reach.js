/**
 * sd-reach — scale band: stat ledger + featured disc over the dotted world map (stardust redesign).
 * The section's heading + lede stay default content above the block (styled via the container).
 *
 * Content model (same shape as the site's `stats`):
 *   [picture]                         background map (decorative, alt="")
 *   [value] [label]                   one row per ledger stat
 *   [value] [label] [featured]        the featured stat, rendered as the cyan disc
 * Schema: stardust/eds-schema/index-stardust.json § reach. Decode tier: reconstructive.
 * @ew-exempt <p> flag cell ("featured") — text-as-metadata, never displayed
 *
 * @param {Element} block The block element
 */
const FLAG = /^\s*featured\s*$/i;

function firstElement(cell) {
  if (!cell) return null;
  return cell.firstElementChild || cell;
}

export default function decorate(block) {
  const ledger = document.createElement('ul');
  ledger.className = 'sd-reach-ledger';
  let map = null;
  let featured = null;

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const picture = row.querySelector('picture') || row.querySelector('img');
    if (picture && !map && cells.length === 1) {
      map = picture;
      return;
    }
    const isFeatured = cells.some((c) => FLAG.test(c.textContent) && !c.querySelector('a, img'));
    const [valueCell, labelCell] = cells.filter((c) => !FLAG.test(c.textContent));
    const value = firstElement(valueCell);
    const label = firstElement(labelCell);
    if (!value) return;

    if (isFeatured && !featured) {
      featured = document.createElement('div');
      featured.className = 'sd-reach-featured';
      const valueWrap = document.createElement('div');
      valueWrap.className = 'sd-reach-featured-value';
      valueWrap.append(...valueCell.children);
      featured.append(valueWrap);
      if (labelCell) {
        const labelWrap = document.createElement('div');
        labelWrap.className = 'sd-reach-featured-label';
        labelWrap.append(...labelCell.children);
        featured.append(labelWrap);
      }
      return;
    }
    const item = document.createElement('li');
    const valueWrap = document.createElement('div');
    valueWrap.className = 'sd-reach-value';
    valueWrap.append(value);
    item.append(valueWrap);
    if (label) {
      const labelWrap = document.createElement('div');
      labelWrap.className = 'sd-reach-label';
      labelWrap.append(label);
      item.append(labelWrap);
    }
    ledger.append(item);
  });

  const grid = document.createElement('div');
  grid.className = 'sd-reach-grid';
  grid.append(ledger);
  if (featured) grid.append(featured);

  block.replaceChildren(grid);
  if (map) {
    const mapWrap = document.createElement('div');
    mapWrap.className = 'sd-reach-map';
    mapWrap.setAttribute('aria-hidden', 'true');
    mapWrap.append(map);
    block.prepend(mapWrap);
  }
}
