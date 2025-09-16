export class DeleteElementHandler {
  constructor() {
    this.selectedElement = null;
    // Listen for keydown events
    document.addEventListener('keydown', this.handleKeydown.bind(this));
  }
  // Method to delete the selected element
  deleteSelectedElement() {
    if (this.selectedElement) {
      this.selectedElement.remove();
      this.selectedElement = null;
    }
  }
  // Handle keydown events
  handleKeydown(event) {
    if (event.key === 'Delete') {
      this.deleteSelectedElement();
    }
  }
  // Method to set the selected element
  selectElement(element) {
    if (this.selectedElement) {
      this.selectedElement.classList.remove('selected');
    }
    this.selectedElement = element;
    this.selectedElement.classList.add('selected');
  }
}
