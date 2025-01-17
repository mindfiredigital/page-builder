export class LinkComponent {
  create(href = '#', label = 'Click Here') {
    const element = document.createElement('a');
    element.href = href; // Default link URL
    element.innerText = label; // Default link text
    element.classList.add('link-component');
    // Optional styling
    element.style.textDecoration = 'none';
    element.style.color = 'blue';
    element.style.fontSize = '14px';
    element.style.cursor = 'pointer';
    return element;
  }
}
