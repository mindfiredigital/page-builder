import { VideoComponent } from '../../components/VideoComponent.js';
describe('VideoComponent', () => {
    let captureStateHandler;
    let videoComponent;
    beforeEach(() => {
        captureStateHandler = jest.fn();
        videoComponent = new VideoComponent(captureStateHandler);
    });
    describe('create()', () => {
        it('should return an HTMLElement with class "video-component"', () => {
            const el = videoComponent.create();
            expect(el).toBeInstanceOf(HTMLElement);
            expect(el.classList.contains('video-component')).toBe(true);
        });
        it('should contain a hidden file input accepting video/*', () => {
            const el = videoComponent.create();
            const fileInput = el.querySelector('input[type="file"]');
            expect(fileInput).not.toBeNull();
            expect(fileInput.accept).toBe('video/*');
            expect(fileInput.style.display).toBe('none');
        });
        it('should show "Upload Video" text when no src is provided', () => {
            const el = videoComponent.create();
            const uploadText = el.querySelector('.upload-text');
            expect(uploadText).not.toBeNull();
            expect(uploadText.innerText).toBe('Upload Video');
        });
        it('should hide upload text and show video element when src is provided', () => {
            const el = videoComponent.create('http://example.com/video.mp4');
            const videoEl = el.querySelector('video');
            const uploadText = el.querySelector('.upload-text');
            expect(videoEl.style.display).toBe('block');
            expect(videoEl.src).toContain('video.mp4');
            expect(uploadText.innerText).toBe('');
        });
        it('should hide video element when no src is provided', () => {
            const el = videoComponent.create();
            const videoEl = el.querySelector('video');
            expect(videoEl.style.display).toBe('none');
        });
        it('should render a pencil button visible when no src is provided', () => {
            const el = videoComponent.create();
            const btn = el.querySelector('.pencil-button');
            expect(btn).not.toBeNull();
            expect(btn.innerHTML).toBe('🖊️');
            expect(btn.style.display).toBe('block');
        });
        it('should hide pencil button when src is provided', () => {
            const el = videoComponent.create('http://example.com/video.mp4');
            const btn = el.querySelector('.pencil-button');
            expect(btn).not.toBeNull();
            expect(btn.style.display).toBe('none');
        });
        it('pencil button click should trigger file input click', () => {
            const el = videoComponent.create();
            const fileInput = el.querySelector('input[type="file"]');
            const pencilBtn = el.querySelector('.pencil-button');
            const clickSpy = jest.spyOn(fileInput, 'click');
            pencilBtn.click();
            expect(clickSpy).toHaveBeenCalled();
        });
        it('video element should have controls enabled', () => {
            const el = videoComponent.create();
            const videoEl = el.querySelector('video');
            expect(videoEl.controls).toBe(true);
        });
        it('should call captureStateHandler after file change', () => {
            const el = videoComponent.create();
            const fileInput = el.querySelector('input[type="file"]');
            const mockFile = new File(['video content'], 'test.mp4', {
                type: 'video/mp4',
            });
            Object.defineProperty(fileInput, 'files', { value: [mockFile] });
            // Spy on handleFileChange to prevent actual FileReader logic
            jest
                .spyOn(videoComponent, 'handleFileChange')
                .mockImplementation(() => { });
            fileInput.dispatchEvent(new Event('change'));
            expect(captureStateHandler).toHaveBeenCalled();
        });
    });
    describe('handleFileChange()', () => {
        it('should update video src and show video element for valid video file', () => {
            const el = videoComponent.create();
            const fileInput = el.querySelector('input[type="file"]');
            const mockFile = new File(['video'], 'clip.mp4', { type: 'video/mp4' });
            Object.defineProperty(fileInput, 'files', { value: [mockFile] });
            const mockResult = 'data:video/mp4;base64,abc123';
            const readerMock = {
                readAsDataURL: jest.fn(),
                onload: null,
                result: mockResult,
            };
            jest
                .spyOn(global, 'FileReader')
                .mockImplementation(() => readerMock);
            videoComponent.handleFileChange({ target: fileInput }, el);
            readerMock.onload();
            const videoEl = el.querySelector('video');
            const uploadText = el.querySelector('.upload-text');
            const pencilBtn = el.querySelector('.pencil-button');
            expect(videoEl.src).toContain(mockResult);
            expect(videoEl.style.display).toBe('block');
            expect(uploadText.style.display).toBe('none');
            expect(pencilBtn.style.display).toBe('none');
        });
        it('should alert for empty files list (no file selected)', () => {
            // The source code does: fileInput.files[0] which is `undefined` for an empty array.
            // undefined is falsy, so the else branch fires and alert() IS called.
            // This is the correct expectation that matches the actual code behaviour.
            const el = videoComponent.create();
            const fileInput = el.querySelector('input[type="file"]');
            Object.defineProperty(fileInput, 'files', { value: [] });
            const alertMock = jest
                .spyOn(window, 'alert')
                .mockImplementation(() => { });
            videoComponent.handleFileChange({ target: fileInput }, el);
            expect(alertMock).toHaveBeenCalledWith('Please upload a valid video file.');
        });
    });
});
