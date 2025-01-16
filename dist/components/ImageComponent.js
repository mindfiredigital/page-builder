export class ImageComponent {
  create(src = 'https://via.placeholder.com/300') {
    // Create a container for the image and label
    const container = document.createElement('div');
    container.classList.add('image-component');
    // Generate and assign a unique ID to the container
    const uniqueContainerId = `image-container-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    // Create the file input for uploading an image (hidden by default)
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none'; // Hide the file input
    fileInput.addEventListener('change', event =>
      ImageComponent.handleFileChange(event, container)
    );
    // Create the pencil icon button (visible on hover)
    const pencilButton = document.createElement('button');
    pencilButton.classList.add('upload-btn');
    pencilButton.innerHTML = '🖊️'; // Pencil icon
    pencilButton.addEventListener('click', () => fileInput.click()); // Trigger file input on click
    // Create the image element
    const element = document.createElement('img');
    const uniqueImageId = `${uniqueContainerId}-img`; // Generate a related unique ID
    element.id = uniqueImageId;
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
  static handleFileChange(event, container) {
    const fileInput = event.target;
    const file = fileInput.files ? fileInput.files[0] : null;
    if (file) {
      const reader = new FileReader();
      // Convert file to Base64 string
      reader.onload = function () {
        const base64String = reader.result;
        // Find the image element and set its src to the Base64 string
        const imageElement = container.querySelector('img');
        if (imageElement) {
          imageElement.src = base64String;
        }
      };
      reader.readAsDataURL(file); // Convert image to Base64
    }
  }
  // Method to restore the image upload functionality after state is restored
  static restoreImageUpload(component, src) {
    // Recreate the file input for uploading an image (hidden by default)
    const fileInput = component.querySelector('input[type="file"]');
    fileInput.addEventListener('change', event =>
      this.handleFileChange(event, component)
    );
    // Recreate the pencil icon button
    const pencilButton = component.querySelector('.upload-btn');
    pencilButton.addEventListener('click', () => fileInput.click()); // Trigger file input on click
    // Recreate the image element
    const imageElement = component.querySelector('img');
    imageElement.src = src; // Restore the image source
    // Reapply the image element styles if necessary
    imageElement.style.width = '100%';
    imageElement.style.height = '100%';
    imageElement.style.objectFit = 'contain';
  }
}
