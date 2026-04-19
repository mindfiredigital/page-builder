import { SIDEBAR_ICONS } from './SidebarIcons';
import { SIDEBAR_TITLES } from './SidebarTitles';

/* Builds one draggable sidebar tile for a given component id */
export function buildSidebarItem(componentId: string): HTMLElement {
  const iconElement = document.createElement('div');
  iconElement.classList.add('draggable');
  iconElement.id = componentId;
  iconElement.setAttribute('draggable', 'true');
  iconElement.setAttribute('data-component', componentId);

  /* Use the mapped title or fall back to a generic label */
  const customTitle =
    SIDEBAR_TITLES[componentId] || `Drag to add ${componentId}`;
  iconElement.setAttribute('title', customTitle);

  if (SIDEBAR_ICONS[componentId]) {
    /* Inject the SVG and drag label together */
    iconElement.innerHTML = `${SIDEBAR_ICONS[componentId]}
      <div class="drag-text">${componentId}</div>`;

    /* Add a shared class so icon styles apply uniformly */
    const svgElement = iconElement.querySelector('svg');
    if (svgElement) svgElement.classList.add('component-icon');
  } else {
    console.warn(`Icon not found for component: ${customTitle}`);
  }

  return iconElement;
}

/* Builds a draggable tile for a Custom-category component (new config format) */
export function buildCustomSidebarItem(
  keyName: string,
  config: any
): HTMLElement {
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
    /* Show the first letter of the key as a fallback icon */
    letterSpan.textContent = keyName.charAt(0).toUpperCase();
    iconElement.appendChild(letterSpan);
  } else {
    /* New format: config object with component, svg, title, settingsComponent */
    const { component, svg, title, settingsComponent } = config;

    iconElement.setAttribute('data-tag-name', component);
    iconElement.setAttribute('title', title || `Drag to add ${keyName}`);

    /* Persist custom settings so the canvas can read them on drop */
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
      /* No SVG provided — fall back to first letter */
      const letterSpan = document.createElement('span');
      letterSpan.classList.add('custom-component-letter');
      letterSpan.textContent = keyName.charAt(0).toUpperCase();
      iconElement.appendChild(letterSpan);
    }
  }

  return iconElement;
}
