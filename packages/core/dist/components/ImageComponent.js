import { Canvas } from '../canvas/Canvas.js';
export class ImageComponent {
  create(src = null, tableAttributeConfig) {
    // Create a container for the image and label
    const container = document.createElement('div');
    container.classList.add('image-component');
    const uniqueContainerId = `image-container-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    container.id = uniqueContainerId;
    // Set container styles
    container.style.width = '300px';
    container.style.height = '300px';
    container.style.position = 'relative';
    container.style.backgroundColor = src ? 'transparent' : '#f0f0f0';
    container.style.display = 'flex';
    container.style.border = 'none';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    // Create upload text
    const uploadText = document.createElement('div');
    uploadText.style.color = '#666666';
    uploadText.style.border = 'none';
    uploadText.style.display = src ? 'none' : 'block';
    // Create the file input for uploading an image (hidden by default)
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    fileInput.addEventListener('change', event =>
      ImageComponent.handleFileChange(event, container, uploadText)
    );
    // Create the pencil icon button
    const pencilButton = document.createElement('button');
    pencilButton.classList.add('upload-btn');
    pencilButton.innerHTML = '🖊️';
    pencilButton.style.position = 'absolute';
    pencilButton.style.padding = '8px';
    pencilButton.style.background = 'transparent';
    pencilButton.style.border = 'none';
    pencilButton.style.cursor = 'pointer';
    pencilButton.style.opacity = '0';
    pencilButton.style.transition = 'opacity 0.2s';
    pencilButton.style.left = '50%';
    pencilButton.style.top = '50%';
    pencilButton.style.transform = 'translate(-50%, -50%)';
    pencilButton.style.fontSize = '24px';
    pencilButton.addEventListener('click', () => fileInput.click());
    // Create the image element
    const element = document.createElement('img');
    const uniqueImageId = `${uniqueContainerId}-img`;
    element.id = uniqueImageId;
    element.style.width = '100%';
    element.style.height = '100%';
    element.style.objectFit = 'contain';
    element.style.border = 'none';
    element.style.display = 'none';
    // Set image source if provided
    if (src) {
      element.src = src;
      element.style.display = 'block';
    }
    // Add hover effect to show pencil button
    container.addEventListener('mouseenter', () => {
      pencilButton.style.opacity = '1';
    });
    container.addEventListener('mouseleave', () => {
      pencilButton.style.opacity = '0';
    });
    // Append elements to container
    container.appendChild(uploadText);
    container.appendChild(fileInput);
    container.appendChild(pencilButton);
    container.appendChild(element);
    return container;
  }
  static handleFileChange(event, container, uploadText) {
    const fileInput = event.target;
    const file = fileInput.files ? fileInput.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onload = function () {
        const base64String = reader.result;
        const imageElement = container.querySelector('img');
        if (imageElement) {
          imageElement.src = base64String;
          imageElement.style.display = 'block';
          uploadText.style.display = 'none';
          // Make background transparent after image is loaded
          container.style.backgroundColor = 'transparent';
          Canvas === null || Canvas === void 0
            ? void 0
            : Canvas.dispatchDesignChange();
        }
      };
      reader.readAsDataURL(file);
    }
  }
  static restoreImageUpload(component, src) {
    const uploadText = component.querySelector('div:not(.upload-btn)');
    const fileInput = component.querySelector('input[type="file"]');
    const pencilButton = component.querySelector('.upload-btn');
    const imageElement = component.querySelector('img');
    // Restore event listeners
    fileInput.addEventListener('change', event =>
      this.handleFileChange(event, component, uploadText)
    );
    pencilButton.addEventListener('click', () => fileInput.click());
    // Restore image and text visibility
    if (src) {
      imageElement.src = src;
      imageElement.style.display = 'block';
      uploadText.style.display = 'none';
      component.style.backgroundColor = 'transparent';
    } else {
      imageElement.style.display = 'none';
      uploadText.style.display = 'block';
      component.style.backgroundColor = '#f0f0f0';
    }
    // Restore hover functionality
    component.addEventListener('mouseenter', () => {
      pencilButton.style.opacity = '1';
    });
    component.addEventListener('mouseleave', () => {
      pencilButton.style.opacity = '0';
    });
  }
}
