/**
 * A reusable modal component for displaying and managing configuration settings.
 *
 * This class creates a generic modal with a form that is dynamically populated
 * based on the provided configuration. It handles showing, hiding, and
 * capturing user input with expandable field display.
 */
export class ModalComponent {
  constructor() {
    var _a, _b;
    this.resolvePromise = null;
    this.attributes = [];
    const existingModal = document.getElementById('modal');
    if (existingModal) {
      this.modalElement = existingModal;
    } else {
      this.modalElement = this.createModalElement();
      document.body.appendChild(this.modalElement);
    }
    // Find the content container within the modal element.
    this.contentContainer = this.modalElement.querySelector('#modal-content');
    // Hide the modal initially
    this.hide();
    // Event listener for closing the modal
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
    // Event listener for saving the modal data
    (_b = this.modalElement.querySelector('#save-button')) === null ||
    _b === void 0
      ? void 0
      : _b.addEventListener('click', () => {
          this.onSave();
        });
  }
  /**
   * Creates the base HTML structure for the modal using regular CSS classes.
   * @returns The modal HTMLElement.
   */
  createModalElement() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay modal-hidden';
    modal.id = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-header-content">
            <h2 class="modal-title">Component Settings</h2>
            <button id="close-modal-button" class="modal-close-button">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div class="modal-body">
          <div id="modal-content" class="modal-form">
            <!-- Dynamic form elements will be injected here -->
          </div>
          <div class="modal-footer">
            <button id="save-button" class="save-button">
              Save
            </button>
          </div>
        </div>
      </div>
    `;
    return modal;
  }
  /**
   * Dynamically generates and renders the form inputs for the modal.
   * @param attributes An array of ComponentAttribute to define the form.
   */
  renderForm(attributes) {
    this.contentContainer.innerHTML = '';
    this.attributes = attributes;
    attributes.forEach(attr => {
      const fieldContainer = document.createElement('div');
      fieldContainer.className = 'form-field';
      // Create expandable header
      const headerContainer = document.createElement('div');
      headerContainer.className = 'form-field-header';
      headerContainer.setAttribute('data-attr-id', attr.id);
      // Expand/Collapse button
      const expandButton = document.createElement('button');
      expandButton.className = 'expand-button';
      expandButton.type = 'button';
      expandButton.innerHTML = `
        <svg class="expand-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      `;
      // Title and key container
      const titleKeyContainer = document.createElement('div');
      titleKeyContainer.className = 'title-key-container';
      const title = document.createElement('span');
      title.className = 'form-title';
      title.textContent = attr.title;
      const key = document.createElement('span');
      key.className = 'form-key';
      key.textContent = `(${attr.key})`;
      titleKeyContainer.appendChild(title);
      titleKeyContainer.appendChild(key);
      headerContainer.appendChild(expandButton);
      headerContainer.appendChild(titleKeyContainer);
      // Value container (initially hidden)
      const valueContainer = document.createElement('div');
      valueContainer.className = 'form-value-container form-value-collapsed';
      const valueLabel = document.createElement('label');
      valueLabel.className = 'form-label';
      valueLabel.textContent = 'Value:';
      valueLabel.setAttribute('for', attr.id);
      let contentElement;
      const displayValue = document.createElement('span');
      displayValue.id = attr.id;
      displayValue.textContent = attr.value.toString();
      displayValue.className = 'form-display-value';
      contentElement = displayValue;
      valueContainer.appendChild(valueLabel);
      valueContainer.appendChild(contentElement);
      fieldContainer.appendChild(headerContainer);
      fieldContainer.appendChild(valueContainer);
      this.contentContainer.appendChild(fieldContainer);
      // Add click event listener for expand/collapse
      headerContainer.addEventListener('click', () => {
        this.toggleFieldExpansion(attr.id);
      });
    });
  }
  /**
   * Toggles the expansion state of a form field.
   * @param attrId The ID of the attribute to toggle.
   */
  toggleFieldExpansion(attrId) {
    const headerContainer = this.modalElement.querySelector(
      `[data-attr-id="${attrId}"]`
    );
    const valueContainer =
      headerContainer === null || headerContainer === void 0
        ? void 0
        : headerContainer.nextElementSibling;
    const expandIcon =
      headerContainer === null || headerContainer === void 0
        ? void 0
        : headerContainer.querySelector('.expand-icon');
    if (valueContainer && expandIcon) {
      const isExpanded = !valueContainer.classList.contains(
        'form-value-collapsed'
      );
      if (isExpanded) {
        // Collapse
        valueContainer.classList.add('form-value-collapsed');
        expandIcon.style.transform = 'rotate(0deg)';
      } else {
        // Expand
        valueContainer.classList.remove('form-value-collapsed');
        expandIcon.style.transform = 'rotate(90deg)';
      }
    }
  }
  /**
   * Shows the modal and populates it with the given configuration.
   * Returns a Promise that resolves with the new values when the form is saved,
   * or null if the modal is closed.
   * @param attributes An array of ComponentAttribute to define the form.
   * @returns A Promise resolving to the new form values or null.
   */
  show(attributes) {
    this.renderForm(attributes);
    this.modalElement.classList.remove('modal-hidden');
    return new Promise(resolve => {
      this.resolvePromise = resolve;
    });
  }
  /**
   * Hides the modal.
   */
  hide() {
    this.modalElement.classList.add('modal-hidden');
  }
  /**
   * Gathers data from the form inputs and resolves the promise.
   */
  onSave() {
    var _a;
    const newValues = {};
    this.attributes.forEach(attr => {
      if (attr.type === 'Input') {
        const input = this.modalElement.querySelector(`#${attr.id}`);
        if (input) {
          newValues[attr.key] = input.value;
        }
      } else if (attr.type === 'Image') {
        const input = this.modalElement.querySelector(`#${attr.id}`);
        if (input) {
          newValues[attr.key] = input.value;
        }
      } else {
        // For Constant and Formula types, the value is not editable
        // so we simply pass the original value from the attribute.
        newValues[attr.key] = attr.value;
      }
    });
    this.hide();
    (_a = this.resolvePromise) === null || _a === void 0
      ? void 0
      : _a.call(this, newValues);
    this.resetPromise();
  }
  /**
   * Resets the promise to prevent memory leaks.
   */
  resetPromise() {
    this.resolvePromise = null;
  }
}
