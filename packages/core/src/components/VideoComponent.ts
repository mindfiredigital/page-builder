export class VideoComponent {
  create(src: string | null = null): HTMLElement {
    const container = document.createElement('div');
    container.classList.add('video-container');

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'video/*';
    fileInput.style.display = 'none';
    fileInput.addEventListener('change', event =>
      this.handleFileChange(event, container)
    );

    const uploadText = document.createElement('div');
    uploadText.classList.add('upload-text');
    uploadText.innerText = src ? '' : 'Upload Video';

    const videoElement = document.createElement('video');
    videoElement.controls = true;
    videoElement.style.width = '100%';
    videoElement.style.height = '100%';
    videoElement.style.display = src ? 'block' : 'none';

    if (src) {
      videoElement.src = src;
    }

    const pencilButton = document.createElement('button');
    pencilButton.innerHTML = '🖊️';
    pencilButton.classList.add('pencil-button');
    pencilButton.addEventListener('click', () => fileInput.click());

    container.appendChild(uploadText);
    container.appendChild(fileInput);
    container.appendChild(videoElement);
    container.appendChild(pencilButton);

    return container;
  }

  handleFileChange(event: Event, container: HTMLElement): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files ? fileInput.files[0] : null;

    if (file && file.type.startsWith('video/')) {
      const reader = new FileReader();
      reader.onload = () => {
        const videoElement = container.querySelector(
          'video'
        ) as HTMLVideoElement;
        const uploadText = container.querySelector(
          '.upload-text'
        ) as HTMLElement;
        videoElement.src = reader.result as string;
        videoElement.style.display = 'block';
        uploadText.style.display = 'none';
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a valid video file.');
    }
  }
}
