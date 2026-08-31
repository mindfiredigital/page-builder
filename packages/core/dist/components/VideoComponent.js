import { EDIT_PENCIL_ICON } from '../constants/index.js';
export class VideoComponent {
    constructor(captureStateHandler) {
        this.captureStateHandler = captureStateHandler;
    }
    create(src = null) {
        const container = document.createElement('div');
        container.classList.add('video-component');
        container.style.width = '300px';
        container.style.height = '300px';
        container.style.position = 'relative';
        container.style.overflow = 'hidden';
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'video/*';
        fileInput.style.display = 'none';
        fileInput.addEventListener('change', event => {
            this.handleFileChange(event, container);
            this.captureStateHandler();
        });
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
        pencilButton.innerHTML = EDIT_PENCIL_ICON;
        pencilButton.classList.add('pencil-button');
        pencilButton.classList.add('upload-btn');
        pencilButton.style.position = 'absolute';
        pencilButton.style.left = '50%';
        pencilButton.style.top = '50%';
        pencilButton.style.transform = 'translate(-50%, -50%)';
        pencilButton.style.padding = '8px';
        pencilButton.style.background = 'transparent';
        pencilButton.style.border = 'none';
        pencilButton.style.cursor = 'pointer';
        pencilButton.style.fontSize = '24px';
        pencilButton.style.display = src ? 'none' : 'block';
        pencilButton.addEventListener('click', () => fileInput.click());
        container.appendChild(uploadText);
        container.appendChild(fileInput);
        container.appendChild(videoElement);
        container.appendChild(pencilButton);
        return container;
    }
    handleFileChange(event, container) {
        const fileInput = event.target;
        const file = fileInput.files ? fileInput.files[0] : null;
        if (file && file.type.startsWith('video/')) {
            const reader = new FileReader();
            reader.onload = () => {
                const videoElement = container.querySelector('video');
                const uploadText = container.querySelector('.upload-text');
                const pencilButton = container.querySelector('.pencil-button');
                videoElement.src = reader.result;
                videoElement.style.display = 'block';
                uploadText.style.display = 'none';
                if (pencilButton)
                    pencilButton.style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
        else {
            alert('Please upload a valid video file.');
        }
    }
}
