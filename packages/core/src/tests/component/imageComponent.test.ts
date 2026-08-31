import { ImageComponent } from '../../components/ImageComponent';

jest.mock('../../canvas/Canvas', () => ({
  Canvas: { dispatchDesignChange: jest.fn() },
}));

describe('ImageComponent', () => {
  let imageComponent: ImageComponent;

  beforeEach(() => {
    imageComponent = new ImageComponent();
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  // ── create() ────────────────────────────────────────────────────────────────
  describe('create()', () => {
    it('should return a div with class "image-component"', () => {
      const el = imageComponent.create();
      expect(el.classList.contains('image-component')).toBe(true);
    });

    it('should have a unique id', () => {
      const el1 = imageComponent.create();
      const el2 = imageComponent.create();
      expect(el1.id).not.toBe(el2.id);
    });

    it('should contain a hidden file input accepting image/*', () => {
      const el = imageComponent.create();
      const fileInput = el.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      expect(fileInput).not.toBeNull();
      expect(fileInput.accept).toBe('image/*');
      expect(fileInput.style.display).toBe('none');
    });

    it('should contain an img element hidden by default when no src', () => {
      const el = imageComponent.create();
      const img = el.querySelector('img') as HTMLImageElement;
      expect(img).not.toBeNull();
      expect(img.style.display).toBe('none');
    });

    it('should show img element and hide placeholder when src is provided', () => {
      const el = imageComponent.create('http://example.com/img.png');
      const img = el.querySelector('img') as HTMLImageElement;
      expect(img.style.display).toBe('block');
      expect(img.src).toContain('img.png');
    });

    it('should default alt to an explicit empty string, never leaving it unset', () => {
      const el = imageComponent.create();
      const img = el.querySelector('img') as HTMLImageElement;
      expect(img.hasAttribute('alt')).toBe(true);
      expect(img.alt).toBe('');
    });

    it('should have background color #f0f0f0 when no src', () => {
      const el = imageComponent.create();
      expect(el.style.backgroundColor).toBe('rgb(240, 240, 240)');
    });

    it('should have transparent background when src is provided', () => {
      const el = imageComponent.create('http://example.com/img.png');
      expect(el.style.backgroundColor).toBe('transparent');
    });

    it('should render a pencil (upload) button', () => {
      const el = imageComponent.create();
      const btn = el.querySelector('.upload-btn') as HTMLButtonElement;
      expect(btn).not.toBeNull();
      expect(btn.innerHTML).toBe('🖊️');
    });

    it('pencil button click should trigger file input click', () => {
      const el = imageComponent.create();
      const fileInput = el.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      const btn = el.querySelector('.upload-btn') as HTMLButtonElement;
      const clickSpy = jest.spyOn(fileInput, 'click');
      btn.click();
      expect(clickSpy).toHaveBeenCalled();
    });

    it('pencil button should become visible on mouseenter', () => {
      const el = imageComponent.create();
      const btn = el.querySelector('.upload-btn') as HTMLButtonElement;
      el.dispatchEvent(new MouseEvent('mouseenter'));
      expect(btn.style.opacity).toBe('1');
    });

    it('pencil button should be hidden on mouseleave', () => {
      const el = imageComponent.create();
      const btn = el.querySelector('.upload-btn') as HTMLButtonElement;
      el.dispatchEvent(new MouseEvent('mouseenter'));
      el.dispatchEvent(new MouseEvent('mouseleave'));
      expect(btn.style.opacity).toBe('0');
    });
  });

  // ── handleFileChange() ───────────────────────────────────────────────────────
  describe('handleFileChange()', () => {
    it('should update image src and show image on valid file', () => {
      const el = imageComponent.create();
      const fileInput = el.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      const uploadText = el.querySelector(
        'div:not(.upload-btn)'
      ) as HTMLElement;

      const mockFile = new File(['img'], 'photo.png', { type: 'image/png' });
      Object.defineProperty(fileInput, 'files', { value: [mockFile] });

      const mockResult = 'data:image/png;base64,abc';
      const readerMock = {
        readAsDataURL: jest.fn(),
        onload: null as any,
        result: mockResult,
      };
      jest
        .spyOn(global, 'FileReader')
        .mockImplementation(() => readerMock as any);

      ImageComponent.handleFileChange(
        { target: fileInput } as unknown as Event,
        el,
        uploadText
      );
      readerMock.onload();

      const img = el.querySelector('img') as HTMLImageElement;
      expect(img.src).toContain(mockResult);
      expect(img.style.display).toBe('block');
      expect(uploadText.style.display).toBe('none');
    });
  });

  // ── restoreImageUpload() ─────────────────────────────────────────────────────
  describe('restoreImageUpload()', () => {
    it('should restore image src and show image element', () => {
      const el = imageComponent.create();
      document.body.appendChild(el);
      ImageComponent.restoreImageUpload(el, 'http://example.com/img.png');
      const img = el.querySelector('img') as HTMLImageElement;
      expect(img.src).toContain('img.png');
      expect(img.style.display).toBe('block');
    });

    it('should show upload text when src is empty', () => {
      const el = imageComponent.create();
      document.body.appendChild(el);
      ImageComponent.restoreImageUpload(el, '');
      const img = el.querySelector('img') as HTMLImageElement;
      expect(img.style.display).toBe('none');
    });

    it('should remove pencil button when editable is false', () => {
      const el = imageComponent.create();
      document.body.appendChild(el);
      ImageComponent.restoreImageUpload(el, '', false);
      const btn = el.querySelector('.upload-btn');
      expect(btn).toBeNull();
    });

    it('should restore hover events when editable is not false', () => {
      const el = imageComponent.create();
      document.body.appendChild(el);
      ImageComponent.restoreImageUpload(el, 'http://example.com/img.png');
      const btn = el.querySelector('.upload-btn') as HTMLButtonElement;
      el.dispatchEvent(new MouseEvent('mouseenter'));
      expect(btn.style.opacity).toBe('1');
    });

    it('should set transparent background when src is provided', () => {
      const el = imageComponent.create();
      document.body.appendChild(el);
      ImageComponent.restoreImageUpload(el, 'http://example.com/img.png');
      expect(el.style.backgroundColor).toBe('transparent');
    });

    it('should restore grey background when no src', () => {
      const el = imageComponent.create();
      document.body.appendChild(el);
      ImageComponent.restoreImageUpload(el, '');
      expect(el.style.backgroundColor).toBe('rgb(240, 240, 240)');
    });
  });
});
