export class ButtonComponent {
  create(label = 'Click Me') {
    const element = document.createElement('button');
    element.innerText = label; // Default button text
    element.classList.add('button-component');
    // Optional styling
    element.style.padding = '10px 20px';
    element.style.fontSize = '14px';
    element.style.borderRadius = '4px';
    element.style.cursor = 'pointer';
    return element;
  }
}
