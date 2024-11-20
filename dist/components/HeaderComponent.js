export class HeaderComponent {
  create(level = 1, text = 'Header') {
    const element = document.createElement(`h${level}`); // Allows setting the header level (h1, h2, etc.)
    element.innerText = text;
    element.classList.add('header-component');
    // // Optional styling
    // element.style.margin = '20px 0';
    // element.style.fontWeight = 'bold';
    return element;
  }
}
