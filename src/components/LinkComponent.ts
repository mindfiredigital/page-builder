interface LinkData {
  href: string;
  label: string;
}

export class LinkComponent {
  private link: HTMLAnchorElement | null = null;
  private isEditing: boolean = false;

  create(href: string = '#', label: string = 'Click Here'): HTMLDivElement {
    // Create container for the component
    const container = document.createElement('div');
    container.classList.add('link-component-container');
    container.style.display = 'flex';
    container.style.gap = '8px';
    container.style.alignItems = 'center';
    container.style.padding = '8px';

    // Create the link element
    this.link = document.createElement('a');
    this.link.href = href;
    this.link.innerText = label;
    this.link.classList.add('link-component');
    this.link.style.textDecoration = 'none';
    this.link.style.color = 'blue';
    this.link.style.fontSize = '14px';
    this.link.style.cursor = 'pointer';

    // Create edit button
    const editButton = document.createElement('button');
    editButton.innerText = 'Edit';
    editButton.classList.add('edit-button');
    editButton.style.padding = '4px 8px';
    editButton.style.cursor = 'pointer';
    editButton.style.display = 'inline-flex';

    // Create edit form
    const editForm = document.createElement('div');
    editForm.classList.add('edit-form');
    editForm.style.display = 'none';
    editForm.style.flexDirection = 'column';
    editForm.style.gap = '8px';
    editForm.style.padding = '8px';

    // URL input
    const urlInput = document.createElement('input');
    urlInput.type = 'url';
    urlInput.value = href;
    urlInput.placeholder = 'Enter URL';
    urlInput.style.padding = '4px';
    urlInput.style.marginBottom = '4px';

    // Label input
    const labelInput = document.createElement('input');
    labelInput.type = 'text';
    labelInput.value = label;
    labelInput.placeholder = 'Enter Label';
    labelInput.style.padding = '4px';
    labelInput.style.marginBottom = '4px';

    // Save button
    const saveButton = document.createElement('button');
    saveButton.innerText = 'Save';
    saveButton.style.padding = '4px 8px';
    saveButton.style.cursor = 'pointer';

    // Add elements to edit form
    editForm.appendChild(urlInput);
    editForm.appendChild(labelInput);
    editForm.appendChild(saveButton);

    // Event handlers
    editButton.addEventListener('click', (e: MouseEvent) => {
      e.preventDefault();
      this.isEditing = true;
      if (this.link) {
        this.link.style.display = 'none';
      }
      editButton.style.display = 'none';
      editForm.style.display = 'flex';
    });

    saveButton.addEventListener('click', (e: MouseEvent) => {
      e.preventDefault();
      this.isEditing = false;
      if (this.link) {
        this.link.href = urlInput.value;
        this.link.innerText = labelInput.value;
        this.link.style.display = 'inline';
      }
      editButton.style.display = 'inline-flex';
      editForm.style.display = 'none';
    });

    // Add elements to container
    container.appendChild(this.link);
    container.appendChild(editButton);
    container.appendChild(editForm);

    return container;
  }

  // Method to get current link data
  getLinkData(): LinkData {
    return {
      href: this.link?.href || '#',
      label: this.link?.innerText || 'Click Here',
    };
  }

  // Method to update link programmatically
  updateLink(href: string, label: string): void {
    if (this.link) {
      this.link.href = href;
      this.link.innerText = label;
    }
  }

  // Method to check if component is in edit mode
  isInEditMode(): boolean {
    return this.isEditing;
  }
}
