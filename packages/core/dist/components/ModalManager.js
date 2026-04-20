import {
  createModalElement,
  renderForm,
  filterAttributes,
  handleSave,
} from './ModalCore.js';
/**
 * A reusable modal component for displaying and managing configuration settings.
 *
 * This class creates a generic modal with a form that is dynamically populated
 * based on the provided configuration. It handles showing, hiding, and
 * capturing user input with expandable field display.
 */
export class ModalComponent {
  constructor() {
    var _a, _b, _c;
    this.attributes = [];
    /** Stores the resolve function of the currently open promise */
    this.resolvePromise = null;
    /** Re-use an existing modal DOM node if one was already created */
    const existingModal = document.getElementById('modal');
    if (existingModal) {
      this.modalElement = existingModal;
    } else {
      this.modalElement = createModalElement();
      document.body.appendChild(this.modalElement);
    }
    this.contentContainer = this.modalElement.querySelector('#modal-content');
    /** Start hidden */
    this.hide();
    /** Close button dismisses the modal and resolves with null */
    (_a = this.modalElement.querySelector('#close-modal-button')) === null ||
    _a === void 0
      ? void 0
      : _a.addEventListener('click', () => {
          var _a;
          this.hide();
          (_a = this.resolvePromise) === null || _a === void 0
            ? void 0
            : _a.call(this, null);
        });
    /** Save button collects the selected field and resolves the promise */
    (_b = this.modalElement.querySelector('#save-button')) === null ||
    _b === void 0
      ? void 0
      : _b.addEventListener('click', () => {
          handleSave(
            this.contentContainer,
            this.attributes,
            result => {
              var _a;
              (_a = this.resolvePromise) === null || _a === void 0
                ? void 0
                : _a.call(this, result);
              this.resolvePromise = null;
            },
            () => this.hide()
          );
        });
    /** Live search filters the visible attribute fields */
    (_c = this.modalElement.querySelector('#attribute-search')) === null ||
    _c === void 0
      ? void 0
      : _c.addEventListener('input', event => {
          const query = event.target.value;
          filterAttributes(query, this.contentContainer);
        });
  }
  /**
   * Shows the modal and populates it with the given configuration.
   * Returns a Promise that resolves with the new values when saved,
   * or null if the modal is closed without saving.
   */
  show(attributes) {
    /** Rebuild form with the fresh attribute list */
    renderForm(this.contentContainer, attributes);
    this.attributes = attributes;
    /** Reset the search box each time the modal opens */
    const searchInput = this.modalElement.querySelector('#attribute-search');
    if (searchInput) searchInput.value = '';
    this.modalElement.classList.remove('modal-hidden');
    return new Promise(resolve => {
      this.resolvePromise = resolve;
    });
  }
  /** Hides the modal overlay */
  hide() {
    this.modalElement.classList.add('modal-hidden');
  }
}
