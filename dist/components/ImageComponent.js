export class ImageComponent {
  create(src = 'https://via.placeholder.com/150') {
    // Create a container for the image and label
    const container = document.createElement('div');
    container.classList.add('image-component');
    // Create the file input for uploading an image
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.addEventListener('change', event => this.handleFileChange(event));
    // Create the image element
    const element = document.createElement('img');
    element.src = src;
    element.alt = 'Image Component';
    element.style.width = '100%';
    element.style.height = '100%';
    element.style.objectFit = 'cover';
    // Append the file input and image to the container
    container.appendChild(fileInput);
    container.appendChild(element);
    return container;
  }
  handleFileChange(event) {
    const fileInput = event.target;
    const file = fileInput.files ? fileInput.files[0] : null;
    if (file) {
      // Create an object URL for the uploaded file
      const objectURL = URL.createObjectURL(file);
      // Find the image element and update its src to the uploaded image
      const imageElement = fileInput.nextElementSibling;
      if (imageElement) {
        imageElement.src = objectURL;
      }
    }
  }
}
