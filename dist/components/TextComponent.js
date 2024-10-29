export class TextComponent {
  create() {
    const element = document.createElement('p');
    element.innerText = 'Sample Text';
    element.contentEditable = 'true'; // Inline editing
    element.classList.add('text-component');
    return element;
  }
}
