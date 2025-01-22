export class LinkComponent {
  constructor() {
    this.link = null;
    this.isEditing = false;
  }
  create(href = '#', label = 'Click Here') {
    const container = document.createElement('div');
    container.classList.add('link-component-container');
    // create link element
    this.link = document.createElement('a');
    this.link.href = href;
    this.link.innerText = label;
    this.link.classList.add('link-component');
    const editButton = document.createElement('button');
    editButton.innerText = 'Edit';
    editButton.classList.add('edit-button');
    const editForm = document.createElement('div');
    editForm.classList.add('edit-form');
    const urlInput = document.createElement('input');
    urlInput.type = 'url';
    urlInput.value = href;
    urlInput.placeholder = 'Enter URL';
    const labelInput = document.createElement('input');
    labelInput.type = 'text';
    labelInput.value = label;
    labelInput.placeholder = 'Enter Label';
    // New checkbox for toggle
    const targetCheckbox = document.createElement('input');
    targetCheckbox.type = 'checkbox';
    const checkboxLabel = document.createElement('label');
    checkboxLabel.innerText = 'Open in new tab';
    checkboxLabel.appendChild(targetCheckbox);
    const saveButton = document.createElement('button');
    saveButton.innerText = 'Save';
    editForm.appendChild(urlInput);
    editForm.appendChild(labelInput);
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
        this.link.innerText = labelInput.value;
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
  getLinkData() {
    var _a, _b;
    return {
      href:
        ((_a = this.link) === null || _a === void 0 ? void 0 : _a.href) || '#',
      label:
        ((_b = this.link) === null || _b === void 0 ? void 0 : _b.innerText) ||
        'Click Here',
    };
  }
  updateLink(href, label, target = '_self') {
    if (this.link) {
      this.link.href = href;
      this.link.innerText = label;
      this.link.target = target;
    }
  }
  isInEditMode() {
    return this.isEditing;
  }
}
