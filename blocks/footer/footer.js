import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Groups each heading with the list that follows it into a link column.
 * @param {Element} wrapper The default content wrapper of the first footer section
 */
function buildLinkColumns(wrapper) {
  const columns = document.createElement('div');
  columns.className = 'footer-columns';
  let column;
  [...wrapper.children].forEach((el) => {
    if (/^H[1-6]$/.test(el.tagName) || !column) {
      column = document.createElement('div');
      column.className = 'footer-column';
      columns.append(column);
    }
    column.append(el);
  });
  wrapper.replaceChildren(columns);
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  const [links, brand, legal] = footer.children;
  if (links) {
    links.classList.add('footer-links');
    const wrapper = links.querySelector('.default-content-wrapper');
    if (wrapper) buildLinkColumns(wrapper);
  }
  if (brand) {
    brand.classList.add('footer-brand');
    const lists = brand.querySelectorAll('ul');
    if (lists[0]) lists[0].classList.add('footer-nav');
    if (lists[1]) lists[1].classList.add('footer-social');
  }
  if (legal) legal.classList.add('footer-legal');

  footer.querySelectorAll('a.arrow-link').forEach((a) => a.classList.remove('arrow-link'));
  footer.querySelectorAll('.footer-social a').forEach((a) => {
    if (!a.getAttribute('aria-label')) a.setAttribute('aria-label', a.title);
  });

  block.append(footer);
}
