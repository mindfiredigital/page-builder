/**
 * A reusable modal component for displaying and managing configuration settings.
 *
 * This class creates a generic modal with a form that is dynamically populated
 * based on the provided configuration. It handles showing, hiding, and
 * capturing user input.
 */
export class ModalComponent {
  constructor() {
    var _a, _b;
    this.resolvePromise = null;
    this.attributes = [];
    // Add CSS styles to the document if not already present
    this.addStyles();
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
   * Adds CSS styles to the document head if not already present
   */
  addStyles() {
    if (document.getElementById('modal-styles')) {
      return; // Styles already added
    }
    const styles = document.createElement('style');
    styles.id = 'modal-styles';
    styles.textContent = `
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.6);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        backdrop-filter: blur(2px);
      }

      .modal-content {
        position: relative;
        z-index: 10001;
        width: 100%;
        max-width: 500px;
        background-color: white;
        border-radius: 12px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        overflow: hidden;
        animation: fadeInScale 0.2s ease-out;
        border: 1px solid rgba(0, 0, 0, 0.05);
      }

      @keyframes fadeInScale {
        from {
          opacity: 0;
          transform: scale(0.95) translate3d(0, -10px, 0);
        }
        to {
          opacity: 1;
          transform: scale(1) translate3d(0, 0, 0);
        }
      }

      .modal-header {
        background-color: #fafafa;
        border-bottom: 1px solid #e5e5e5;
        padding: 20px 24px;
      }

      .modal-header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .modal-title {
        font-size: 18px;
        font-weight: 600;
        color: #111827;
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      .modal-close-button {
        background: none;
        border: none;
        color: #6b7280;
        cursor: pointer;
        padding: 6px;
        border-radius: 6px;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .modal-close-button:hover {
        color: #374151;
        background-color: #f3f4f6;
      }

      .modal-close-button svg {
        width: 20px;
        height: 20px;
      }

      .modal-body {
        padding: 24px;
        max-height: 60vh;
        overflow-y: auto;
      }

      .modal-form {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .form-field {
        display: flex;
        flex-direction: column;
      }

      .form-label {
        font-size: 13px;
        font-weight: 600;
        color: #374151;
        margin-bottom: 8px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        text-transform: uppercase;
        letter-spacing: 0.025em;
      }

      .form-input {
        padding: 12px 14px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        font-size: 14px;
        transition: all 0.2s ease;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background-color: white;
      }

      .form-input:focus {
        outline: none;
        border-color: #2563eb;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        background-color: #fefefe;
      }

      .form-input:disabled {
        background-color: #f9fafb;
        color: #6b7280;
        cursor: not-allowed;
      }

      .form-display-value {
        color: #374151;
        background-color: #f8fafc;
        padding: 12px 14px;
        border-radius: 8px;
        user-select: text;
        font-size: 14px;
        border: 1px solid #e2e8f0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      .image-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
      }

      .image-preview {
        width: 100%;
        max-width: 240px;
        border-radius: 8px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        object-fit: contain;
        max-height: 160px;
        border: 1px solid #e5e7eb;
      }

      .image-input {
        width: 100%;
      }

      .error-text {
        color: #dc2626;
        font-size: 13px;
        font-weight: 500;
      }

      .modal-footer {
        background-color: #fafafa;
        border-top: 1px solid #e5e5e5;
        padding: 16px 24px;
        display: flex;
        justify-content: flex-end;
        gap: 12px;
      }

      .save-button {
        padding: 10px 20px;
        background-color: #2563eb;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        min-width: 80px;
      }

      .save-button:hover {
        background-color: #1d4ed8;
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(37, 99, 235, 0.3);
      }

      .save-button:active {
        transform: translateY(0);
      }

      .save-button:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3);
      }

      /* Hide modal by default */
      .modal-hidden {
        display: none !important;
      }
    `;
    document.head.appendChild(styles);
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
      const label = document.createElement('label');
      label.className = 'form-label';
      label.textContent = attr.title;
      label.setAttribute('for', attr.id);
      fieldContainer.appendChild(label);
      let contentElement;
      switch (attr.type) {
        case 'Input':
          const input = document.createElement('input');
          input.id = attr.id;
          input.type = typeof attr.value === 'number' ? 'number' : 'text';
          input.value = attr.value || attr.default_value || '';
          input.disabled = attr.editable === false;
          input.className = 'form-input';
          contentElement = input;
          break;
        case 'Constant':
        case 'Formula':
          const displayValue = document.createElement('span');
          displayValue.id = attr.id;
          displayValue.textContent = attr.value.toString();
          displayValue.className = 'form-display-value';
          contentElement = displayValue;
          break;
        case 'Image':
          const imageWrapper = document.createElement('div');
          imageWrapper.className = 'image-wrapper';
          const image = document.createElement('img');
          image.id = `${attr.id}-preview`;
          image.src =
            attr.value.toString() ||
            'https://placehold.co/200x100?text=No+Image';
          image.alt = `Preview for ${attr.title}`;
          image.className = 'image-preview';
          image.onerror = () =>
            (image.src = 'https://placehold.co/200x100?text=Image+Load+Error');
          const imageInput = document.createElement('input');
          imageInput.id = attr.id;
          imageInput.type = 'text';
          imageInput.placeholder = 'Enter image URL';
          imageInput.value = attr.value.toString() || '';
          imageInput.className = 'form-input image-input';
          imageInput.addEventListener('input', () => {
            image.src =
              imageInput.value || 'https://placehold.co/200x100?text=No+Image';
          });
          imageWrapper.appendChild(image);
          imageWrapper.appendChild(imageInput);
          contentElement = imageWrapper;
          break;
        default:
          const unsupported = document.createElement('p');
          unsupported.textContent = `Unsupported type: ${attr.type}`;
          unsupported.className = 'error-text';
          contentElement = unsupported;
          break;
      }
      fieldContainer.appendChild(contentElement);
      this.contentContainer.appendChild(fieldContainer);
    });
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
