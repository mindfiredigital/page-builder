import {
  ComponentAttribute,
  createModalElement,
  renderForm,
  filterAttributes,
  handleSave,
} from './ModalCore';

/**
 * A reusable modal component for displaying and managing configuration settings.
 *
 * This class creates a generic modal with a form that is dynamically populated
 * based on the provided configuration. It handles showing, hiding, and
 * capturing user input with expandable field display.
 */
export class ModalComponent {
  private modalElement: HTMLElement;
  private contentContainer: HTMLElement;
  private attributes: ComponentAttribute[] = [];

  /* Stores the resolve function of the currently open promise */
  private resolvePromise:
    | ((result: Record<string, any> | null) => void)
    | null = null;

  constructor() {
    /* Re-use an existing modal DOM node if one was already created */
    const existingModal = document.getElementById('modal');
    if (existingModal) {
      this.modalElement = existingModal;
    } else {
      this.modalElement = createModalElement();
      document.body.appendChild(this.modalElement);
    }

    this.contentContainer = this.modalElement.querySelector('#modal-content')!;

    /* Start hidden */
    this.hide();

    /* Close button dismisses the modal and resolves with null */
    this.modalElement
      .querySelector('#close-modal-button')
      ?.addEventListener('click', () => {
        this.hide();
        this.resolvePromise?.(null);
      });

    /* Save button collects the selected field and resolves the promise */
    this.modalElement
      .querySelector('#save-button')
      ?.addEventListener('click', () => {
        handleSave(
          this.contentContainer,
          this.attributes,
          (result: Record<string, any> | null) => {
            this.resolvePromise?.(result);
            this.resolvePromise = null;
          },
          () => this.hide()
        );
      });

    /* Live search filters the visible attribute fields */
    this.modalElement
      .querySelector<HTMLInputElement>('#attribute-search')
      ?.addEventListener('input', event => {
        const query = (event.target as HTMLInputElement).value;
        filterAttributes(query, this.contentContainer);
      });
  }

  /**
   * Shows the modal and populates it with the given configuration.
   * Returns a Promise that resolves with the new values when saved,
   * or null if the modal is closed without saving.
   */
  show(attributes: ComponentAttribute[]): Promise<Record<string, any> | null> {
    /* Rebuild form with the fresh attribute list */
    renderForm(this.contentContainer, attributes);
    this.attributes = attributes;

    /* Reset the search box each time the modal opens */
    const searchInput =
      this.modalElement.querySelector<HTMLInputElement>('#attribute-search');
    if (searchInput) searchInput.value = '';

    this.modalElement.classList.remove('modal-hidden');

    return new Promise(resolve => {
      this.resolvePromise = resolve;
    });
  }

  /* Hides the modal overlay */
  hide(): void {
    this.modalElement.classList.add('modal-hidden');
  }
}
