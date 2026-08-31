type AddListenersFn = (component: HTMLElement) => void;
export declare function disableControlWrapper(controlId: string, reason?: string): void;
export declare function populateCssControls(component: HTMLElement, controlsContainer: HTMLElement, addListenersFn: AddListenersFn, customizeComponentTagName?: string): void;
export {};
