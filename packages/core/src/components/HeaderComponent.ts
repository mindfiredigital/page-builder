export class HeaderComponent {
  create(level: number = 1, text: string = 'Header'): HTMLElement {
    const element = document.createElement(`h${level}`); // Allows setting the header level (h1, h2, etc.)
    element.innerText = text;
    element.classList.add('header-component');

    return element;
  }
}
