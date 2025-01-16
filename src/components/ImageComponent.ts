export class ImageComponent {
  create(): HTMLElement {
    // Create a container for the image and label
    const container = document.createElement('div');
    container.classList.add('image-component');
    container.style.position = 'relative';
    container.style.width = '300px'; // Initial width
    container.style.height = '300px'; // Initial height
    container.style.backgroundColor = '#ccc'; // Light gray background color
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    container.style.overflow = 'hidden';
    container.style.border = '1px solid #ddd'; // Add a border for visibility
    container.style.resize = 'both'; // Enable resizing
    container.style.minWidth = '150px'; // Set a minimum width
    container.style.minHeight = '150px'; // Set a minimum height

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
    pencilButton.style.position = 'absolute';
    pencilButton.style.bottom = '10px';
    pencilButton.style.right = '10px';
    pencilButton.style.padding = '5px';
    pencilButton.style.backgroundColor = '#fff';
    pencilButton.style.border = '1px solid #ccc';
    pencilButton.style.borderRadius = '5px';
    pencilButton.style.cursor = 'pointer';
    pencilButton.addEventListener('click', () => fileInput.click()); // Trigger file input on click

    // Create the image element
    const element = document.createElement('img');
    element.alt = 'Image Component';
    element.style.width = '100%';
    element.style.height = '100%';
    element.style.objectFit = 'contain';
    element.style.display = 'none'; // Initially hidden

    // Append the file input, pencil button, and image to the container
    container.appendChild(fileInput);
    container.appendChild(pencilButton);
    container.appendChild(element);

    // Add resizable handles
    this.addResizableHandles(container);

    return container;
  }

  static handleFileChange(event: Event, container: HTMLElement): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files ? fileInput.files[0] : null;

    if (file) {
      const reader = new FileReader();

      // Convert file to Base64 string
      reader.onload = function () {
        const base64String = reader.result as string;

        // Find the image element and set its src to the Base64 string
        const imageElement = container.querySelector('img');
        if (imageElement) {
          imageElement.src = base64String;
          imageElement.style.display = 'block'; // Make the image visible
          container.style.backgroundColor = 'transparent'; // Remove the background color
        }
      };

      reader.readAsDataURL(file); // Convert image to Base64
    }
  }

  static restoreImageUpload(component: HTMLElement, src: string): void {
    const fileInput = component.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    fileInput.addEventListener('change', event =>
      this.handleFileChange(event, component)
    );

    const pencilButton = component.querySelector('.upload-btn') as HTMLElement;
    pencilButton.addEventListener('click', () => fileInput.click());

    const imageElement = component.querySelector('img') as HTMLImageElement;
    imageElement.src = src;
    imageElement.style.width = '100%';
    imageElement.style.height = '100%';
    imageElement.style.objectFit = 'contain';
    imageElement.style.display = src ? 'block' : 'none';

    if (!src) {
      component.style.backgroundColor = '#ccc';
    }
  }

  addResizableHandles(container: HTMLElement): void {
    const resizeHandleSize = 10;
    const directions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];

    directions.forEach(direction => {
      const handle = document.createElement('div');
      handle.classList.add('resize-handle', `resize-${direction}`);
      handle.style.width = `${resizeHandleSize}px`;
      handle.style.height = `${resizeHandleSize}px`;
      handle.style.position = 'absolute';
      handle.style.backgroundColor = '#000';
      handle.style.cursor = `${direction.replace('-', '')}-resize`;

      // Position the handles
      if (direction.includes('top')) {
        handle.style.top = '0';
      } else {
        handle.style.bottom = '0';
      }

      if (direction.includes('left')) {
        handle.style.left = '0';
      } else {
        handle.style.right = '0';
      }

      // Add drag functionality for resizing
      handle.addEventListener('mousedown', (event: MouseEvent) => {
        event.preventDefault();
        const startWidth = container.offsetWidth;
        const startHeight = container.offsetHeight;
        const startX = event.clientX;
        const startY = event.clientY;

        const onMouseMove = (e: MouseEvent) => {
          if (direction.includes('right')) {
            container.style.width = `${startWidth + (e.clientX - startX)}px`;
          }
          if (direction.includes('left')) {
            container.style.width = `${startWidth - (e.clientX - startX)}px`;
          }
          if (direction.includes('bottom')) {
            container.style.height = `${startHeight + (e.clientY - startY)}px`;
          }
          if (direction.includes('top')) {
            container.style.height = `${startHeight - (e.clientY - startY)}px`;
          }
        };

        const onMouseUp = () => {
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });

      container.appendChild(handle);
    });
  }
}
