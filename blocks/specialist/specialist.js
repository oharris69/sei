/**
 * Specialist — Experience Workspace: every authored paragraph (name, role, location,
 * availability, booking link, reasons label) is MOVED into a generated wrapper that carries
 * the class (`.specialist-name`, `.specialist-next`, `.specialist-book`, …); CSS styles the
 * authored element through it.
 */
import { createOptimizedPicture } from '../../scripts/aem.js';
import { getProfile } from '../../scripts/profile.js';

// Wrap an AUTHORED element in a generated wrapper that carries the class (EW1/EW2).
function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

/**
 * Specialist: the SEI person a visitor has been matched with.
 * Row 1 cells: [photo + name, role, location] [label + list of match reasons] [optional CTA]
 * Row 2 (optional): [availability text] [booking link]
 * @param {Element} block The specialist block element
 */
export default function decorate(block) {
  const [mainRow, availabilityRow] = [...block.children];
  const [personCell, reasonsCell, ctaCell] = mainRow ? [...mainRow.children] : [];
  block.textContent = '';

  const person = document.createElement('div');
  person.className = 'specialist-person';
  if (personCell) {
    const profile = document.createElement('div');
    profile.className = 'specialist-profile';
    const img = personCell.querySelector('img');
    if (img) {
      const pic = createOptimizedPicture(img.src, img.alt, false, [{ width: '160' }]);
      // keep the workspace image index on the visible <img> (EW1)
      if (img.dataset.imageIndex) pic.querySelector('img').dataset.imageIndex = img.dataset.imageIndex;
      pic.classList.add('specialist-photo');
      profile.append(pic);
    }
    const details = document.createElement('div');
    details.className = 'specialist-details';
    [...personCell.children].filter((el) => !el.querySelector('picture') && el.tagName !== 'PICTURE')
      .forEach((el, i) => {
        const role = ['specialist-name', 'specialist-role', 'specialist-location'][i] || 'specialist-meta';
        details.append(wrapNode(el, role));
      });
    profile.append(details);
    person.append(profile);
  }

  if (availabilityRow) {
    const [textCell, linkCell] = [...availabilityRow.children];
    const availability = document.createElement('div');
    availability.className = 'specialist-availability';
    // move the authored availability paragraph (a bare-text cell gets a <p> around its nodes)
    let text = textCell?.querySelector('p');
    if (!text) {
      text = document.createElement('p');
      if (textCell?.textContent.trim()) text.append(...textCell.childNodes);
    }
    availability.append(wrapNode(text, 'specialist-next'));
    const link = linkCell?.querySelector('a');
    if (link) availability.append(wrapNode(link.closest('p') || link, 'specialist-book'));
    person.append(availability);
  }
  block.append(person);

  if (reasonsCell) {
    reasonsCell.className = 'specialist-reasons';
    const label = reasonsCell.querySelector('p, h3, h4');
    if (label) {
      const wrap = document.createElement('div');
      wrap.className = 'specialist-label';
      label.replaceWith(wrap);
      wrap.append(label);
    }
    block.append(reasonsCell);
  }

  if (ctaCell && ctaCell.textContent.trim()) {
    ctaCell.className = 'specialist-cta';
    block.append(ctaCell);
  }

  // reflect a booking made in the scheduler pop-up ("You are booked")
  const name = block.querySelector('.specialist-name')?.textContent.trim();
  const showBooked = (booking) => {
    if (!booking || !name || !booking.advisor || !name.includes(booking.advisor)) return;
    block.classList.add('booked');
    let availability = block.querySelector('.specialist-availability');
    if (!availability) {
      availability = document.createElement('div');
      availability.className = 'specialist-availability';
      person.append(availability);
    }
    const text = document.createElement('p');
    text.className = 'specialist-next';
    text.innerHTML = 'You are booked: <strong></strong>';
    text.querySelector('strong').textContent = booking.label;
    availability.replaceChildren(text);
    const scope = block.closest('.program-panel') || block.closest('.section');
    scope?.querySelectorAll('h2').forEach((h2) => {
      if (/matched you with a specialist/i.test(h2.textContent)) h2.textContent = 'You are booked.';
    });
    scope?.querySelectorAll('a[href*="/modals/schedule"]').forEach((a) => {
      if (!block.contains(a)) a.closest('.button-wrapper')?.remove();
    });
  };
  window.addEventListener('sei:booked', (e) => showBooked(e.detail));
  showBooked(getProfile().booking);
}
