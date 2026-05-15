import { SidebarUtils } from '../../utils/customizationSidebarHelper.js';
/** Returns true when the component has at least one attribute defined */
export function shouldShowModal(componentAttributes) {
  return !!(componentAttributes && componentAttributes.length > 0);
}
/** Rebuilds the Attribute panel for the currently selected component */
export function populateFunctionalityControls(
  component,
  functionsPanel,
  basicComponentsConfig,
  customComponentsConfig,
  editable,
  handleInputTrigger
) {
  var _a, _b, _c;
  functionsPanel.innerHTML = '';
  let componentConfig;
  let showModalButton = false;
  const tableConfig =
    basicComponentsConfig === null || basicComponentsConfig === void 0
      ? void 0
      : basicComponentsConfig.find(c => c.name === 'table');
  if (component.classList.contains('table-component')) {
    componentConfig = tableConfig;
    /** table-component itself never shows the modal button — cells do */
    shouldShowModal(
      componentConfig === null || componentConfig === void 0
        ? void 0
        : componentConfig.attributes
    );
  } else if (component.classList.contains('text-component')) {
    componentConfig =
      basicComponentsConfig === null || basicComponentsConfig === void 0
        ? void 0
        : basicComponentsConfig.find(c => c.name === 'text');
    showModalButton = shouldShowModal(
      componentConfig === null || componentConfig === void 0
        ? void 0
        : componentConfig.attributes
    );
  } else if (component.classList.contains('header-component')) {
    componentConfig =
      basicComponentsConfig === null || basicComponentsConfig === void 0
        ? void 0
        : basicComponentsConfig.find(c => c.name === 'header');
    showModalButton = shouldShowModal(
      componentConfig === null || componentConfig === void 0
        ? void 0
        : componentConfig.attributes
    );
  } else if (component.classList.contains('table-cell-content')) {
    /** Individual table cells get the modal button to bind an attribute */
    showModalButton = shouldShowModal(
      tableConfig === null || tableConfig === void 0
        ? void 0
        : tableConfig.attributes
    );
  } else if (component.classList.contains('table-row')) {
    /** Table rows get visibility-rule controls, not the modal button */
    const tableInputAttr =
      (_a =
        tableConfig === null || tableConfig === void 0
          ? void 0
          : tableConfig.attributes) === null || _a === void 0
        ? void 0
        : _a.filter(a => a.type === 'Input');
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
    /** Custom components render their own settings web-component */
    const componentType =
      (_b = Array.from(component.classList).find(cls =>
        cls.endsWith('-component')
      )) === null || _b === void 0
        ? void 0
        : _b.replace('-component', '');
    if (
      componentType &&
      ((_c =
        customComponentsConfig === null || customComponentsConfig === void 0
          ? void 0
          : customComponentsConfig[componentType]) === null || _c === void 0
        ? void 0
        : _c.settingsComponentTagName)
    ) {
      const tagName =
        customComponentsConfig[componentType].settingsComponentTagName;
      let settingsElement = functionsPanel.querySelector(tagName);
      if (!settingsElement) {
        settingsElement = document.createElement(tagName);
        functionsPanel.appendChild(settingsElement);
      }
      /** Pass the target component id so the settings element knows what to configure */
      settingsElement.setAttribute(
        'data-settings',
        JSON.stringify({ targetComponentId: component.id })
      );
    }
  }
  /** Render Input-type attribute controls into the panel */
  if (
    (componentConfig === null || componentConfig === void 0
      ? void 0
      : componentConfig.attributes) &&
    componentConfig.attributes.length > 0
  ) {
    componentConfig.attributes.forEach(attribute => {
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
    /** No recognised component — show a placeholder message */
    functionsPanel.innerHTML =
      '<p>No specific settings for this component.</p>';
  }
}
