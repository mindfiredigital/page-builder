import {
  createPageSizeSelect,
  createControl,
  createSelectControl,
  rgbToHex,
  createAttributeControls,
  populateModalButton,
  populateRowVisibilityControls,
} from './sidebarHelperCore.js';
/*
 * SidebarUtils — public API used by CustomizationSidebar and other consumers.
 * All logic lives in ./sidebarHelperCore/; this class is a thin delegation layer
 * so every existing import of SidebarUtils continues to work without changes.
 */
export class SidebarUtils {
  /* Builds the page-size preset dropdown for the canvas control panel */
  static createPageSizeSelect(container, canvasElement) {
    createPageSizeSelect(container, canvasElement);
  }
  /* Builds an input row (number / color / text) with optional unit selector */
  static createControl(
    label,
    id,
    type,
    value,
    controlsContainer,
    attributes = {}
  ) {
    createControl(label, id, type, value, controlsContainer, attributes);
  }
  /* Builds a labelled <select> control */
  static createSelectControl(
    label,
    id,
    currentValue,
    options,
    controlsContainer
  ) {
    createSelectControl(label, id, currentValue, options, controlsContainer);
  }
  /* Converts a computed rgb/rgba string to a hex color string */
  static rgbToHex(rgb) {
    return rgbToHex(rgb);
  }
  /* Builds a single attribute input row with event-trigger wiring */
  static createAttributeControls(
    attribute,
    functionsPanel,
    handleInputTrigger
  ) {
    createAttributeControls(attribute, functionsPanel, handleInputTrigger);
  }
  /* Appends Set Attribute / Delete Attribute buttons to the functions panel */
  static populateModalButton(component, functionsPanel, editable) {
    populateModalButton(component, functionsPanel, editable);
  }
  /* Builds the row-visibility rule builder in the functions panel */
  static populateRowVisibilityControls(row, inputs) {
    populateRowVisibilityControls(row, inputs);
  }
}
