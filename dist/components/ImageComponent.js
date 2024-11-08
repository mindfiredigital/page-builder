export class ImageComponent {
  create(src = 'https://via.placeholder.com/150') {
    // Create a container for the image and label
    const container = document.createElement('div');
    container.classList.add('image-component');
    // Create the image element
    const element = document.createElement('img');
    element.src = src;
    element.alt = 'Image Component';
    element.style.width = '100%';
    element.style.height = '100%';
    element.style.objectFit = 'cover';
    // Append the image to the container
    container.appendChild(element);
    return container;
  }
}
