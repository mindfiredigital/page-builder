import { SIDEBAR_ICONS } from './SidebarIcons.js';
import { SIDEBAR_TITLES } from './SidebarTitles.js';
/* Builds one draggable sidebar tile for a given component id */
export function buildSidebarItem(componentId) {
  const iconElement = document.createElement('div');
  iconElement.classList.add('draggable');
  iconElement.id = componentId;
  iconElement.setAttribute('draggable', 'true');
  iconElement.setAttribute('data-component', componentId);
  const customTitle =
    SIDEBAR_TITLES[componentId] || `Drag to add ${componentId}`;
  iconElement.setAttribute('title', customTitle);
  if (SIDEBAR_ICONS[componentId]) {
    iconElement.innerHTML = `${SIDEBAR_ICONS[componentId]}
      <div class="drag-text">${componentId}</div>`;
    const svgElement = iconElement.querySelector('svg');
    if (svgElement) svgElement.classList.add('component-icon');
  } else {
    console.warn(`Icon not found for component: ${customTitle}`);
  }
  return iconElement;
}
/* Builds a draggable tile for a Custom-category component (new config format) */
export function buildCustomSidebarItem(keyName, config) {
  const iconElement = document.createElement('div');
  iconElement.classList.add('draggable', 'custom-component');
  iconElement.id = keyName;
  iconElement.setAttribute('draggable', 'true');
  iconElement.setAttribute('data-component', keyName);
  if (typeof config === 'string') {
    /* Legacy format: config is just the HTML tag name string */
    iconElement.setAttribute('data-tag-name', config);
    iconElement.setAttribute('title', `Drag to add ${keyName}`);
    const letterSpan = document.createElement('span');
    letterSpan.classList.add('custom-component-letter');
    letterSpan.textContent = keyName.charAt(0).toUpperCase();
    iconElement.appendChild(letterSpan);
  } else {
    /* New format: config object with component, svg, title, settingsComponent */
    const { component, svg, title, settingsComponent } = config;
    iconElement.setAttribute('data-tag-name', component);
    iconElement.setAttribute('title', title || `Drag to add ${keyName}`);
    if (settingsComponent) {
      iconElement.setAttribute(
        'data-custom-settings',
        JSON.stringify(settingsComponent)
      );
    }
    if (svg) {
      iconElement.innerHTML = `${svg}<div class="drag-text">${title}</div>`;
      const svgElement = iconElement.querySelector('svg');
      if (svgElement) svgElement.classList.add('component-icon');
    } else {
      const letterSpan = document.createElement('span');
      letterSpan.classList.add('custom-component-letter');
      letterSpan.textContent = keyName.charAt(0).toUpperCase();
      iconElement.appendChild(letterSpan);
    }
  }
  return iconElement;
}
