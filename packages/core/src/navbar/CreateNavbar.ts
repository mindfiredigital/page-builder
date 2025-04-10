// Function to create the navbar
import { svgs } from '../icons/svgs';
export function createNavbar() {
  const navbar = document.createElement('nav');
  navbar.id = 'preview-navbar';

  const icons = {
    desktop: svgs.desktop,
    tablet: svgs.tablet,
    mobile: svgs.mobile,
    save: svgs.save,
    export: svgs.code,
    view: svgs.view,
    undo: svgs.undo,
    redo: svgs.redo,
    reset: svgs.reset,
  };

  // Array of button data with only titles
  const leftButtons = [
    { id: 'preview-desktop', icon: icons.desktop, title: 'Preview in Desktop' },
    { id: 'preview-tablet', icon: icons.tablet, title: 'Preview in Tablet' },
    { id: 'preview-mobile', icon: icons.mobile, title: 'Preview in Mobile' },
    { id: 'undo-btn', icon: icons.undo, title: 'Undo button' },
    { id: 'redo-btn', icon: icons.redo, title: 'Redo button' },
  ];

  const rightButtons = [
    { id: 'view-btn', icon: icons.view, title: 'View' },
    { id: 'save-btn', icon: icons.save, title: 'Save Layout' },
    { id: 'reset-btn', icon: icons.reset, title: 'Reset' },
    { id: 'export-html-btn', icon: icons.export, title: 'Export' },
  ];

  const leftContainer = document.createElement('div');
  leftContainer.classList.add('left-buttons');

  leftButtons.forEach(({ id, icon, title }) => {
    const button = document.createElement('button');
    button.id = id;
    button.classList.add('preview-btn');
    button.title = title;

    // Insert the SVG directly as innerHTML
    button.innerHTML = icon;

    const svgElement = button.querySelector('svg');
    if (svgElement) {
      svgElement.classList.add('nav-icon');
    }
    leftContainer.appendChild(button);
  });

  const centerText = document.createElement('div');
  centerText.classList.add('center-text');
  centerText.textContent = 'Page Builder';

  const rightContainer = document.createElement('div');
  rightContainer.classList.add('right-buttons');

  rightButtons.forEach(({ id, icon, title }) => {
    const button = document.createElement('button');
    button.id = id;
    button.classList.add('preview-btn');
    button.title = title;

    // Insert the SVG directly as innerHTML
    button.innerHTML = icon;

    const svgElement = button.querySelector('svg');
    if (svgElement) {
      svgElement.classList.add('nav-icon');
    }
    rightContainer.appendChild(button);
  });

  navbar.appendChild(leftContainer);
  navbar.appendChild(centerText);
  navbar.appendChild(rightContainer);

  return navbar;
}
