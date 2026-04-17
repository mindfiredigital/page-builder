import { ComponentAttribute } from './ModalCore';
/**
 * A reusable modal component for displaying and managing configuration settings.
 *
 * This class creates a generic modal with a form that is dynamically populated
 * based on the provided configuration. It handles showing, hiding, and
 * capturing user input with expandable field display.
 */
export declare class ModalComponent {
  private modalElement;
  private contentContainer;
  private attributes;
  private resolvePromise;
  constructor();
  /**
   * Shows the modal and populates it with the given configuration.
   * Returns a Promise that resolves with the new values when saved,
   * or null if the modal is closed without saving.
   */
  show(attributes: ComponentAttribute[]): Promise<Record<string, any> | null>;
  hide(): void;
}
