export class TextComponent {
  constructor(text = 'Sample Text') {
    this.text = text; // Default text value
  }
  create() {
    const element = document.createElement('div');
    element.innerText = this.text; // Use dynamic text passed in constructor
    element.contentEditable = 'true'; // Enable inline editing
    element.classList.add('text-component');
    return element;
  }
  setText(newText) {
    this.text = newText;
  }
}
