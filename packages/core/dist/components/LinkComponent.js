export class LinkComponent {
  constructor() {
    this.link = null;
    this.isEditing = false;
  }
  /**
   * Creates a link component with editing functionality.
   * Users can edit the link's URL and choose whether it opens in the same tab or a new tab.
   * @param href - The initial URL for the link (default: '#').
   * @param label - The text displayed for the link (default: 'Click Here').
   * @returns A div element containing the link, edit button, and edit form.
   */
  create(href = '#', label = 'Click Here') {
    const container = document.createElement('div');
    container.classList.add('link-component-container');
    // Create the link element
    this.link = document.createElement('a');
    this.link.href = href;
    this.link.innerText = label;
    this.link.classList.add('link-component');
    const editButton = document.createElement('button');
    editButton.innerText = '🖊️';
    editButton.classList.add('edit-link');
    const editForm = document.createElement('div');
    editForm.classList.add('edit-link-form');
    const urlInput = document.createElement('input');
    urlInput.type = 'url';
    urlInput.value = href;
    urlInput.placeholder = 'Enter URL';
    // New checkbox for toggle
    const targetCheckbox = document.createElement('input');
    targetCheckbox.type = 'checkbox';
    const checkboxLabel = document.createElement('label');
    checkboxLabel.innerText = 'Open in new tab';
    checkboxLabel.appendChild(targetCheckbox);
    const saveButton = document.createElement('button');
    saveButton.innerText = 'Save';
    editForm.appendChild(urlInput);
    editForm.appendChild(checkboxLabel);
    editForm.appendChild(saveButton);
    editButton.addEventListener('click', e => {
      e.preventDefault();
      this.isEditing = true;
      if (this.link) {
        this.link.style.display = 'none';
      }
      editButton.style.display = 'none';
      editForm.style.display = 'flex';
    });
    saveButton.addEventListener('click', e => {
      e.preventDefault();
      this.isEditing = false;
      if (this.link) {
        this.link.href = urlInput.value;
        this.link.style.display = 'inline';
        this.link.target = targetCheckbox.checked ? '_blank' : '_self';
      }
      editButton.style.display = 'inline-flex';
      editForm.style.display = 'none';
    });
    container.appendChild(this.link);
    container.appendChild(editButton);
    container.appendChild(editForm);
    return container;
  }
  /**
   * Gets the current data of the link, including the URL, label, and target behavior.
   * @returns An object containing href, label, and target.
   */
  getLinkData() {
    var _a, _b, _c;
    return {
      href:
        ((_a = this.link) === null || _a === void 0 ? void 0 : _a.href) || '#',
      label:
        ((_b = this.link) === null || _b === void 0 ? void 0 : _b.innerText) ||
        'Click Here',
      target:
        ((_c = this.link) === null || _c === void 0 ? void 0 : _c.target) ||
        '_self',
    };
  }
  /**
   * Updates the link's URL, label, and target programmatically.
   * @param href - The new URL for the link.
   * @param label - The new text displayed for the link.
   * @param target - The target behavior ('_self' for the same tab, '_blank' for a new tab).
   */
  updateLink(href, label, target = '_self') {
    if (this.link) {
      this.link.href = href;
      this.link.innerText = label;
      this.link.target = target;
    }
  }
  /**
   * Checks if the component is currently in editing mode.
   * @returns A boolean indicating whether the component is in editing mode.
   */
  isInEditMode() {
    return this.isEditing;
  }
}
