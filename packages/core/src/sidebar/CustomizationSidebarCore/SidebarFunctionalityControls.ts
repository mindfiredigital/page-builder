import { SidebarUtils } from '../../utils/customizationSidebarHelper';

/* Returns true when the component has at least one attribute defined */
export function shouldShowModal(
  componentAttributes?: ComponentAttribute[]
): boolean {
  return !!(componentAttributes && componentAttributes.length > 0);
}

/* Rebuilds the Attribute panel for the currently selected component */
export function populateFunctionalityControls(
  component: HTMLElement,
  functionsPanel: HTMLElement,
  basicComponentsConfig: BasicComponent[] | null,
  customComponentsConfig: CustomComponentConfig | null,
  editable: boolean | null,
  handleInputTrigger: (event: Event) => void
): void {
  functionsPanel.innerHTML = '';

  let componentConfig: BasicComponent | undefined;
  let showModalButton = false;

  const tableConfig = basicComponentsConfig?.find(c => c.name === 'table');

  if (component.classList.contains('table-component')) {
    componentConfig = tableConfig;
    /* table-component itself never shows the modal button — cells do */
    shouldShowModal(componentConfig?.attributes);
  } else if (component.classList.contains('text-component')) {
    componentConfig = basicComponentsConfig?.find(c => c.name === 'text');
    showModalButton = shouldShowModal(componentConfig?.attributes);
  } else if (component.classList.contains('header-component')) {
    componentConfig = basicComponentsConfig?.find(c => c.name === 'header');
    showModalButton = shouldShowModal(componentConfig?.attributes);
  } else if (component.classList.contains('table-cell-content')) {
    /* Individual table cells get the modal button to bind an attribute */
    showModalButton = shouldShowModal(tableConfig?.attributes);
  } else if (component.classList.contains('table-row')) {
    /* Table rows get visibility-rule controls, not the modal button */
    const tableInputAttr = tableConfig?.attributes?.filter(
      a => a.type === 'Input'
    );
    if (
      tableInputAttr &&
      tableInputAttr.length > 0 &&
      basicComponentsConfig &&
      editable !== false
    ) {
      SidebarUtils.populateRowVisibilityControls(component, tableInputAttr);
    }
    return;
  } else if (component.classList.contains('custom-component')) {
    /* Custom components render their own settings web-component */
    const componentType = Array.from(component.classList)
      .find(cls => cls.endsWith('-component'))
      ?.replace('-component', '');

    if (
      componentType &&
      customComponentsConfig?.[componentType]?.settingsComponentTagName
    ) {
      const tagName =
        customComponentsConfig[componentType].settingsComponentTagName;
      let settingsElement = functionsPanel.querySelector(tagName);
      if (!settingsElement) {
        settingsElement = document.createElement(tagName);
        functionsPanel.appendChild(settingsElement);
      }
      /* Pass the target component id so the settings element knows what to configure */
      settingsElement.setAttribute(
        'data-settings',
        JSON.stringify({ targetComponentId: component.id })
      );
    }
  }

  /* Render Input-type attribute controls into the panel */
  if (componentConfig?.attributes && componentConfig.attributes.length > 0) {
    componentConfig.attributes.forEach((attribute: any) => {
      if (attribute.type === 'Input') {
        SidebarUtils.createAttributeControls(
          attribute,
          functionsPanel,
          handleInputTrigger
        );
      }
    });
  }

  if (showModalButton) {
    SidebarUtils.populateModalButton(component, functionsPanel, editable);
  } else if (!componentConfig) {
    /* No recognised component — show a placeholder message */
    functionsPanel.innerHTML =
      '<p>No specific settings for this component.</p>';
  }
}
