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
  private resolvePromise;
  private attributes;
  constructor();
  private filterAttributes;
  /**
   * Creates the base HTML structure for the modal using regular CSS classes.
   * @returns The modal HTMLElement.
   */
  createModalElement(): HTMLElement;
  /**
   * Dynamically generates and renders the form inputs for the modal.
   * @param attributes An array of ComponentAttribute to define the form.
   */
  private renderForm;
  /**
   * Toggles the expansion state of a form field.
   * @param attrId The ID of the attribute to toggle.
   */
  private toggleFieldExpansion;
  /**
   * Shows the modal and populates it with the given configuration.
   * Returns a Promise that resolves with the new values when the form is saved,
   * or null if the modal is closed.
   */
  show(attributes: ComponentAttribute[]): Promise<Record<string, any> | null>;
  /**
   * Hides the modal.
   */
  hide(): void;
  /**
   * Gathers data from the form inputs and resolves the promise.
   */
  private onSave;
  /**
   * Resets the promise to prevent memory leaks.
   */
  private resetPromise;
}
