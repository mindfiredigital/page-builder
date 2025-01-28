export class LinkComponent {
  private link: HTMLAnchorElement | null = null;
  private isEditing: boolean = false;

  /**
   * Creates a link component with editing functionality.
   * Users can edit the link's URL and choose whether it opens in the same tab or a new tab.
   * @param href - The initial URL for the link (default: '#').
   * @param label - The text displayed for the link (default: 'Click Here').
   * @returns A div element containing the link, edit button, and edit form.
   */
  create(href: string = '#', label: string = 'Click Here'): HTMLDivElement {
    const container = document.createElement('div');
    container.classList.add('link-component');

    // Create the link element
    this.link = document.createElement('a');
    this.link.href = href;
    this.link.innerText = label;
    this.link.classList.add('link-component-label');

    const editButton = document.createElement('button');
    editButton.innerHTML = '🖊️';
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
    checkboxLabel.innerHTML = 'Open in new tab';
    checkboxLabel.appendChild(targetCheckbox);

    const saveButton = document.createElement('button');
    saveButton.innerHTML = 'Save';

    editForm.appendChild(urlInput);
    editForm.appendChild(checkboxLabel);
    editForm.appendChild(saveButton);

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
      e.stopPropagation();
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
    return {
      href: this.link?.href || '#',
      label: this.link?.innerText || 'Click Here',
      target: this.link?.target || '_self',
    };
  }

  /**
   * Updates the link's URL, label, and target programmatically.
   * @param href - The new URL for the link.
   * @param label - The new text displayed for the link.
   * @param target - The target behavior ('_self' for the same tab, '_blank' for a new tab).
   */
  updateLink(href: string, label: string, target: string = '_self'): void {
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
  isInEditMode(): boolean {
    return this.isEditing;
  }

  /**
   * Restores the edit functionality for an existing link component
   * @param container - The container element of the link component
   */
  static restore(container: HTMLElement): void {
    // Find necessary elements
    const link = container.querySelector(
      '.link-component-label'
    ) as HTMLAnchorElement;
    const editButton = container.querySelector(
      '.edit-link'
    ) as HTMLButtonElement;
    const editForm = container.querySelector(
      '.edit-link-form'
    ) as HTMLDivElement;
    const saveButton = editForm.querySelector('button') as HTMLButtonElement;
    const urlInput = editForm.querySelector(
      'input[type="url"]'
    ) as HTMLInputElement;
    const targetCheckbox = editForm.querySelector(
      'input[type="checkbox"]'
    ) as HTMLInputElement;

    if (
      !link ||
      !editButton ||
      !editForm ||
      !saveButton ||
      !urlInput ||
      !targetCheckbox
    ) {
      console.error('Required elements not found');
      return;
    }

    // Set initial display states
    link.style.display = 'inline';
    editButton.style.display = 'inline-flex';
    editForm.style.display = 'none';

    // Clone and replace the edit button to remove existing listeners
    const newEditButton = editButton.cloneNode(true) as HTMLButtonElement;
    const newSaveButton = saveButton.cloneNode(true) as HTMLButtonElement;

    editButton.parentNode?.replaceChild(newEditButton, editButton);
    saveButton.parentNode?.replaceChild(newSaveButton, saveButton);

    // Add new click event listener
    newEditButton.addEventListener('click', (e: MouseEvent) => {
      e.preventDefault();
      link.style.display = 'none';
      newEditButton.style.display = 'none';
      editForm.style.display = 'flex';
    });

    // Add new save button click event listener
    newSaveButton.addEventListener('click', (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      link.href = urlInput.value;
      link.style.display = 'inline';
      link.target = targetCheckbox.checked ? '_blank' : '_self';
      newEditButton.style.display = 'inline-flex';
      editForm.style.display = 'none';
    });
  }
}
