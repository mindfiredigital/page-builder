import {
  createExportModal,
  closeModal,
  createCloseButton,
  createCodeSection,
} from '../../../services/ExportModalService.js';
jest.mock('../../../services/ExportZipService', () => ({
  createExportToZipButton: jest.fn(() => document.createElement('button')),
}));
describe('ExportModalService', () => {
  let modal;
  beforeEach(() => {
    jest.useFakeTimers();
    // 2. Now these functions will actually exist because they aren't being mocked out
    modal = createExportModal('<div></div>', 'body {}', 'html-raw', 'css-raw');
    document.body.appendChild(modal);
  });
  afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });
  describe('createExportModal', () => {
    it('should create a modal with the correct ID and sections', () => {
      var _a;
      expect(modal.id).toBe('export-dialog');
      // Checks for HTML and CSS sections
      expect(modal.querySelectorAll('.modal-section').length).toBe(2);
      expect(
        (_a = modal.querySelector('h2')) === null || _a === void 0
          ? void 0
          : _a.textContent
      ).toBe('HTML');
    });
    it('should contain a contenteditable code block with highlighted content', () => {
      const codeBlock = modal.querySelector('.code-block');
      expect(codeBlock).not.toBeNull();
      expect(
        codeBlock === null || codeBlock === void 0
          ? void 0
          : codeBlock.getAttribute('contenteditable')
      ).toBe('true');
      expect(
        codeBlock === null || codeBlock === void 0
          ? void 0
          : codeBlock.innerHTML
      ).toContain('div');
    });
  });
  describe('closeModal', () => {
    it('should add "hide" class and remove modal after timeout', () => {
      closeModal(modal);
      expect(modal.classList.contains('hide')).toBe(true);
      // Fast-forward 300ms to trigger the setTimeout logic
      jest.advanceTimersByTime(300);
      expect(document.getElementById('export-dialog')).toBeNull();
    });
  });
  describe('createCloseButton', () => {
    it('should trigger closeModal when clicked', () => {
      const btn = createCloseButton(modal);
      btn.click();
      expect(modal.classList.contains('hide')).toBe(true);
      jest.advanceTimersByTime(300);
      expect(document.body.contains(modal)).toBe(false);
    });
  });
  describe('setupModalEventListeners', () => {
    it('should close modal when clicking the overlay (target === modal)', () => {
      // Simulate click on the background overlay
      modal.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(modal.classList.contains('hide')).toBe(true);
    });
    it('should NOT close modal when clicking inside the content', () => {
      const modalContent = modal.querySelector('.export-modal-content');
      modalContent.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(modal.classList.contains('hide')).toBe(false);
    });
    it('should close modal when pressing Escape key', () => {
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(event);
      expect(modal.classList.contains('hide')).toBe(true);
    });
  });
  describe('createCodeSection', () => {
    it('should generate a section with provided title and content', () => {
      var _a, _b;
      const section = createCodeSection('Test Title', '<span>Content</span>');
      expect(
        (_a = section.querySelector('h2')) === null || _a === void 0
          ? void 0
          : _a.textContent
      ).toBe('Test Title');
      expect(
        (_b = section.querySelector('.code-block')) === null || _b === void 0
          ? void 0
          : _b.innerHTML
      ).toBe('<span>Content</span>');
    });
  });
});
