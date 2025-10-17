import { ModalComponent } from '../components/ModalManager';
/**
 * Reusable function to handle clicks on various components.
 */
export declare function handleComponentClick(
  modalComponent: ModalComponent,
  attributeConfig: ComponentAttribute[],
  componentElement: HTMLElement,
  updateContentMethod: (
    element: HTMLElement,
    attribute: ComponentAttribute
  ) => void
): Promise<void>;
