/** Returns true when the component has at least one attribute defined */
export declare function shouldShowModal(
  componentAttributes?: ComponentAttribute[]
): boolean;
/** Rebuilds the Attribute panel for the currently selected component */
export declare function populateFunctionalityControls(
  component: HTMLElement,
  functionsPanel: HTMLElement,
  basicComponentsConfig: BasicComponent[] | null,
  customComponentsConfig: CustomComponentConfig | null,
  editable: boolean | null,
  handleInputTrigger: (event: Event) => void
): void;
