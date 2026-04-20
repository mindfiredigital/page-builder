import { ComponentAttribute } from './ModalTypes';
/** Values returned from the modal after the user selects a field */
export type ModalResult = Record<string, string | number | boolean>;
/** Reads the selected field from the form and resolves the modal's promise */
export declare function handleSave(
  contentContainer: HTMLElement,
  attributes: ComponentAttribute[],
  resolve: (result: ModalResult | null) => void,
  hideFn: () => void
): void;
