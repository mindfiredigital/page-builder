export class ImageComponent {
  create(src = 'https://via.placeholder.com/150') {
    const element = document.createElement('img');
    element.src = src;
    element.alt = 'Image Component';
    element.classList.add('image-component');
    // Optional styling
    element.style.width = '150px';
    element.style.height = 'auto';
    element.style.margin = '10px 0';
    return element;
  }
}
