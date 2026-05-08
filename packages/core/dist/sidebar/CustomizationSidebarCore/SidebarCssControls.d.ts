export declare function disableControlWrapper(
  controlId: string,
  reason?: string
): void;
export declare function populateCssControls(
  component: HTMLElement,
  controlsContainer: HTMLElement,
  addListenersFn: (component: HTMLElement) => void,
  customizeComponentTagName?: string
): void;
