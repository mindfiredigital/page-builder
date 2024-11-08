export class ImageComponent {
  create(src = 'https://via.placeholder.com/300') {
    // Create a container for the image and label
    const container = document.createElement('div');
    container.classList.add('image-component');
    // Create the file input for uploading an image (hidden by default)
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none'; // Hide the file input
    fileInput.addEventListener('change', event =>
      this.handleFileChange(event, container)
    );
    // Create the pencil icon button (visible on hover)
    const pencilButton = document.createElement('button');
    pencilButton.classList.add('upload-btn');
    pencilButton.innerHTML = '🖊️'; // Pencil icon
    pencilButton.addEventListener('click', () => fileInput.click()); // Trigger file input on click
    // Create the image element
    const element = document.createElement('img');
    element.src = src;
    element.alt = 'Image Component';
    element.style.width = '100%';
    element.style.height = '100%';
    element.style.objectFit = 'contain';
    // Append the file input, pencil button, and image to the container
    container.appendChild(fileInput);
    container.appendChild(pencilButton);
    container.appendChild(element);
    return container;
  }
  handleFileChange(event, container) {
    const fileInput = event.target;
    const file = fileInput.files ? fileInput.files[0] : null;
    if (file) {
      // Create an object URL for the uploaded file
      const objectURL = URL.createObjectURL(file);
      // Find the image element by querying the container
      const imageElement = container.querySelector('img');
      if (imageElement) {
        imageElement.src = objectURL; // Update the image source to the uploaded image
      }
    }
  }
}
