export declare class SidebarUtils {
  static createAttributeControls(
    attribute: ComponentAttribute,
    functionsPanel: HTMLElement,
    handleInputTrigger: (event: Event) => void
  ): void;
  static populateModalButton(
    component: HTMLElement,
    functionsPanel: HTMLElement,
    editable: boolean | null
  ): void;
  static rgbToHex(rgb: string): string;
  static createControl(
    label: string,
    id: string,
    type: string,
    value: string | number,
    controlsContainer: HTMLElement,
    attributes?: Record<string, string | number>
  ): void;
  static createSelectControl(
    label: string,
    id: string,
    currentValue: string,
    options: string[],
    controlsContainer: HTMLElement
  ): void;
  static populateRowVisibilityControls(
    row: HTMLElement,
    inputs: ComponentAttribute[]
  ): void;
  private static addRule;
  private static deleteRule;
}
