export class TextComponent {
  private text: string;

  constructor(text: string = 'Sample Text') {
    this.text = text; // Default text value
  }

  create(): HTMLElement {
    const element = document.createElement('div');
    element.innerText = this.text; // Use dynamic text passed in constructor
    element.contentEditable = 'true'; // Enable inline editing
    element.classList.add('text-component');
    return element;
  }

  setText(newText: string): void {
    this.text = newText;
  }
}
