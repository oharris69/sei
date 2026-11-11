/**
 * Accordion — Experience Workspace: body content is MOVED (never copied) into the item body;
 * its first element sits in a `.accordion-item-lead` wrapper so no positional selector is
 * needed on an authored element.
 * @ew-exempt <p> item label (cell 1) — rendered inside the native <summary> toggle (EW7)
 */

/**
 * Accordion: a stack of native disclosures (<details>/<summary>), closed by default.
 *
 * Content model — one row per item:
 *  - first cell → the label (plain text or a paragraph)
 *  - second cell → the body (any rich text: paragraphs, lists, links, images)
 * A row with only one cell becomes a label with an empty body; empty rows are dropped.
 * Native <details> gives keyboard (Enter/Space) and screen-reader support for free.
 * @param {Element} block The accordion block element
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    const [labelCell, ...bodyCells] = [...row.children];
    if (!labelCell || !labelCell.textContent.trim()) {
      row.remove();
      return;
    }

    const summary = document.createElement('summary');
    summary.className = 'accordion-item-label';
    // a single wrapping paragraph or heading is unwrapped so the label stays inline text
    const only = labelCell.children.length === 1 ? labelCell.firstElementChild : null;
    const source = only && /^(P|H[1-6])$/.test(only.tagName) ? only : labelCell;
    summary.append(...source.childNodes);

    const body = document.createElement('div');
    body.className = 'accordion-item-body';
    bodyCells.forEach((cell) => body.append(...cell.childNodes));
    const lead = body.firstElementChild;
    if (lead) {
      const wrap = document.createElement('div');
      wrap.className = 'accordion-item-lead';
      lead.replaceWith(wrap);
      wrap.append(lead);
    }

    const details = document.createElement('details');
    details.className = 'accordion-item';
    details.append(summary, body);
    row.replaceWith(details);
  });
}
