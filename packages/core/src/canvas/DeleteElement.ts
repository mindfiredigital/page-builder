export class DeleteElementHandler {
  private selectedElement: HTMLElement | null = null;

  constructor() {
    // Listen for keydown events
    document.addEventListener('keydown', this.handleKeydown.bind(this));
  }

  // Method to delete the selected element
  private deleteSelectedElement(): void {
    if (this.selectedElement) {
      this.selectedElement.remove();
      this.selectedElement = null;
    }
  }

  // Handle keydown events
  private handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Delete') {
      this.deleteSelectedElement();
    }
  }

  // Method to set the selected element
  public selectElement(element: HTMLElement): void {
    console.log(element, 'clcikced');
    if (this.selectedElement) {
      this.selectedElement.classList.remove('selected');
    }

    this.selectedElement = element;
    this.selectedElement.classList.add('selected');
  }
}
