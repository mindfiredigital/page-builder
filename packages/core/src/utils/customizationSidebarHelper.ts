import {
  createPageSizeSelect,
  createControl,
  createSelectControl,
  createSpacingControl,
  rgbToHex,
  createAttributeControls,
  populateModalButton,
  populateRowVisibilityControls,
} from './sidebarHelperCore';

/*
 * SidebarUtils — public API used by CustomizationSidebar and other consumers.
 * All logic lives in ./sidebarHelperCore/; this class is a thin delegation layer
 * so every existing import of SidebarUtils continues to work without changes.
 */
export class SidebarUtils {
  /* Builds the page-size preset dropdown for the canvas control panel */
  static createPageSizeSelect(
    container: HTMLElement,
    canvasElement: HTMLElement
  ): void {
    createPageSizeSelect(container, canvasElement);
  }

  /* Builds an input row (number / color / text) with optional unit selector */
  static createControl(
    label: string,
    id: string,
    type: string,
    value: string | number,
    controlsContainer: HTMLElement,
    attributes: Record<string, string | number> = {}
  ): void {
    createControl(label, id, type, value, controlsContainer, attributes);
  }

  /* Builds a spacing (margin/padding) control with all-sides and custom-sides toggle */
  static createSpacingControl(
    label: string,
    id: string,
    mode: 'all' | 'custom',
    allValue: number,
    allUnit: string,
    sides: {
      top: { value: number; unit: string };
      right: { value: number; unit: string };
      bottom: { value: number; unit: string };
      left: { value: number; unit: string };
    },
    controlsContainer: HTMLElement,
    attributes: { min?: number; max?: number } = {}
  ): void {
    createSpacingControl(
      label,
      id,
      mode,
      allValue,
      allUnit,
      sides,
      controlsContainer,
      attributes
    );
  }

  /* Builds a labelled <select> control */
  static createSelectControl(
    label: string,
    id: string,
    currentValue: string,
    options: string[],
    controlsContainer: HTMLElement
  ): void {
    createSelectControl(label, id, currentValue, options, controlsContainer);
  }

  /* Converts a computed rgb/rgba string to a hex color string */
  static rgbToHex(rgb: string): string {
    return rgbToHex(rgb);
  }

  /* Builds a single attribute input row with event-trigger wiring */
  static createAttributeControls(
    attribute: ComponentAttribute,
    functionsPanel: HTMLElement,
    handleInputTrigger: (event: Event) => void
  ): void {
    createAttributeControls(attribute, functionsPanel, handleInputTrigger);
  }

  /* Appends Set Attribute / Delete Attribute buttons to the functions panel */
  static populateModalButton(
    component: HTMLElement,
    functionsPanel: HTMLElement,
    editable: boolean | null
  ): void {
    populateModalButton(component, functionsPanel, editable);
  }

  /* Builds the row-visibility rule builder in the functions panel */
  static populateRowVisibilityControls(
    row: HTMLElement,
    inputs: ComponentAttribute[]
  ): void {
    populateRowVisibilityControls(row, inputs);
  }
}
