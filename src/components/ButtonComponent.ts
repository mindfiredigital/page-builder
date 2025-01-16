export class ButtonComponent {
  create(label: string = 'Click Me'): HTMLElement {
    const element = document.createElement('button');
    element.innerText = label;
    element.classList.add('button-component');
    // Optional styling
    element.style.padding = '10px 20px';
    element.style.fontSize = '14px';
    element.style.borderRadius = '4px';
    element.style.cursor = 'pointer';

    return element;
  }
}
