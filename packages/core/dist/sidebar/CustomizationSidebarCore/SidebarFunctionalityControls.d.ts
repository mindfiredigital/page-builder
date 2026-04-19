export declare function shouldShowModal(
  componentAttributes?: ComponentAttribute[]
): boolean;
export declare function populateFunctionalityControls(
  component: HTMLElement,
  functionsPanel: HTMLElement,
  basicComponentsConfig: BasicComponent[] | null,
  customComponentsConfig: CustomComponentConfig | null,
  editable: boolean | null,
  handleInputTrigger: (event: Event) => void
): void;
