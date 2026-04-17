import { ComponentAttribute } from './ModalTypes';
export declare function handleSave(
  contentContainer: HTMLElement,
  attributes: ComponentAttribute[],
  resolve: (result: Record<string, any> | null) => void,
  hideFn: () => void
): void;
