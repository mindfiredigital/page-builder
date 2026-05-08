import {
  getLeftButtons,
  getRightButtons,
  buildLeftContainer,
  buildRightContainer,
} from './CreateNavbarCore/index.js';
/* Builds and returns the full navbar element */
export function createNavbar(
  editable,
  brandTitle = 'Page Builder',
  showAttributeTab
) {
  const navbar = document.createElement('nav');
  navbar.id = 'preview-navbar';
  /* Brand title centered between the two button groups */
  const centerText = document.createElement('div');
  centerText.classList.add('center-text');
  centerText.textContent = brandTitle;
  /* Build button containers using resolved config arrays */
  const leftContainer = buildLeftContainer(getLeftButtons(editable));
  const rightContainer = buildRightContainer(
    getRightButtons(editable, showAttributeTab)
  );
  navbar.appendChild(leftContainer);
  navbar.appendChild(centerText);
  navbar.appendChild(rightContainer);
  return navbar;
}
