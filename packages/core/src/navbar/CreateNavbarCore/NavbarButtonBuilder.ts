import {
  wireSidebarMenuToggle,
  wireMenuButtonToggle,
} from './NavbarToggleHandlers';

/* Creates a single navbar button and attaches any special toggle handlers */
export function buildNavButton(btn: NavButton): HTMLButtonElement {
  const button = document.createElement('button');
  button.id = btn.id;
  button.className = 'preview-btn';
  button.title = btn.title;
  button.style.color = '#000';

  /* Inject the SVG icon directly as HTML */
  button.innerHTML = btn.icon;

  /* Apply a shared class to the embedded SVG for uniform icon styling */
  const svgElement = button.querySelector('svg');
  if (svgElement) svgElement.classList.add('nav-icon');

  /* Wire special toggle behaviour for known button ids */
  if (btn.id === 'sidebar-menu') wireSidebarMenuToggle(button);
  if (btn.id === 'menu-btn') wireMenuButtonToggle(button);

  return button;
}

/* Builds the left container div and appends all left-side buttons */
export function buildLeftContainer(buttons: NavButton[]): HTMLDivElement {
  const leftContainer = document.createElement('div');
  leftContainer.classList.add('left-buttons');
  buttons.forEach(btn => leftContainer.appendChild(buildNavButton(btn)));
  return leftContainer;
}

/* Builds the right container div and appends all right-side buttons */
export function buildRightContainer(buttons: NavButton[]): HTMLDivElement {
  const rightContainer = document.createElement('div');
  rightContainer.classList.add('right-buttons');
  buttons.forEach(btn => rightContainer.appendChild(buildNavButton(btn)));
  return rightContainer;
}
