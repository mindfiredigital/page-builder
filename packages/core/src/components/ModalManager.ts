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
  private resolvePromise:
    | ((result: Record<string, any> | null) => void)
    | null = null;
  private attributes: ComponentAttribute[] = [];

  constructor() {
    const existingModal = document.getElementById('modal');
    if (existingModal) {
      this.modalElement = existingModal;
    } else {
      this.modalElement = this.createModalElement();
      document.body.appendChild(this.modalElement);
    }

    // Find the content container within the modal element.
    this.contentContainer = this.modalElement.querySelector('#modal-content')!;

    // Hide the modal initially
    this.hide();

    // Event listener for closing the modal
    this.modalElement
      .querySelector('#close-modal-button')
      ?.addEventListener('click', () => {
        this.hide();
        this.resolvePromise?.(null);
      });

    // Event listener for saving the modal data
    this.modalElement
      .querySelector('#save-button')
      ?.addEventListener('click', () => {
        this.onSave();
      });
    const searchInput =
      this.modalElement.querySelector<HTMLInputElement>('#attribute-search');

    // Add event listener for real-time search
    searchInput?.addEventListener('input', event => {
      const query = (event.target as HTMLInputElement).value;
      this.filterAttributes(query);
    });
  }

  private filterAttributes(query: string): void {
    const allFields = this.contentContainer.querySelectorAll('.form-field');
    const normalizedQuery = query.toLowerCase().trim();

    allFields.forEach(field => {
      const key = field.getAttribute('data-attr-key')?.toLowerCase();
      const title = field
        .querySelector('.form-title')
        ?.textContent?.toLowerCase();

      // Check if either the key or the title includes the search query
      if (key?.includes(normalizedQuery) || title?.includes(normalizedQuery)) {
        field.classList.remove('modal-hidden'); // Show the element
      } else {
        field.classList.add('modal-hidden'); // Hide the element
      }
    });
  }

  /**
   * Creates the base HTML structure for the modal using regular CSS classes.
   * @returns The modal HTMLElement.
   */
  createModalElement(): HTMLElement {
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
            <div class="modal-search-container">
  <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm7.4 12.6l4.2 4.2a1 1 0 01-1.4 1.4l-4.2-4.2a10 10 0 111.4-1.4z"/>
  </svg>
  <input type="text" id="attribute-search" class="modal-search-input" placeholder="Search attributes...">
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
  private renderForm(attributes: ComponentAttribute[]): void {
    this.contentContainer.innerHTML = '';
    this.attributes = attributes;

    attributes.forEach(attr => {
      const fieldContainer = document.createElement('div');
      fieldContainer.className = 'form-field';
      fieldContainer.setAttribute('data-attr-key', attr.key);

      // Create expandable header
      const headerContainer = document.createElement('div');
      headerContainer.className = 'form-field-header';
      headerContainer.setAttribute('data-attr-id', attr.id);

      // Add click event listener to the fieldContainer
      fieldContainer.addEventListener('click', () => {
        // Deselect all fields first
        this.contentContainer.querySelectorAll('.form-field').forEach(field => {
          field.classList.remove('selected');
        });
        // Select the clicked field
        fieldContainer.classList.add('selected');
      });

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
      title.textContent = `${attr.title}`;

      const key = document.createElement('span');
      key.className = 'form-key';
      key.textContent = `(${attr.key})(${attr.type})`;

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

      let contentElement: HTMLElement;

      const displayValue = document.createElement('span');
      displayValue.id = attr.id;
      displayValue.textContent = attr.value ? attr.value.toString() : null;
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
  private toggleFieldExpansion(attrId: string): void {
    const headerContainer = this.modalElement.querySelector(
      `[data-attr-id="${attrId}"]`
    );
    const valueContainer = headerContainer?.nextElementSibling as HTMLElement;
    const expandIcon = headerContainer?.querySelector(
      '.expand-icon'
    ) as SVGElement;

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
   */
  show(attributes: ComponentAttribute[]): Promise<Record<string, any> | null> {
    this.renderForm(attributes);
    const searchInput =
      this.modalElement.querySelector<HTMLInputElement>('#attribute-search');
    if (searchInput) {
      searchInput.value = '';
    }
    this.modalElement.classList.remove('modal-hidden');
    return new Promise(resolve => {
      this.resolvePromise = resolve;
    });
  }

  /**
   * Hides the modal.
   */
  hide(): void {
    this.modalElement.classList.add('modal-hidden');
  }

  /**
   * Gathers data from the form inputs and resolves the promise.
   */
  private onSave(): void {
    const selectedField = this.contentContainer.querySelector(
      '.form-field.selected'
    );
    const newValues: Record<string, any> = {};

    if (selectedField) {
      // Get the attribute key from the data attribute
      const selectedKey = selectedField.getAttribute('data-attr-key');

      // Find the full attribute object from the stored array
      const selectedAttribute = this.attributes.find(
        attr => attr.key === selectedKey
      );

      if (selectedAttribute) {
        // Return only the value of the selected attribute
        newValues[selectedAttribute.key] = selectedAttribute.value;
      }
    }

    this.hide();
    this.resolvePromise?.(newValues);
    this.resetPromise();
  }
  /**
   * Resets the promise to prevent memory leaks.
   */
  private resetPromise(): void {
    this.resolvePromise = null;
  }
}
