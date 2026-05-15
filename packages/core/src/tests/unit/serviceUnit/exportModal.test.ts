import {
  createExportModal,
  closeModal,
  createCloseButton,
  createCodeSection,
  setupModalEventListeners,
} from '../../../services/ExportModalService';

// 1. Correct the mock path: Mock the ZIP service, NOT the Modal service
import * as ExportZipService from '../../../services/ExportZipService';

jest.mock('../../../services/ExportZipService', () => ({
  createExportToZipButton: jest.fn(() => document.createElement('button')),
}));

describe('ExportModalService', () => {
  let modal: HTMLElement;

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
      expect(modal.id).toBe('export-dialog');
      // Checks for HTML and CSS sections
      expect(modal.querySelectorAll('.modal-section').length).toBe(2);
      expect(modal.querySelector('h2')?.textContent).toBe('HTML');
    });

    it('should contain a contenteditable code block with highlighted content', () => {
      const codeBlock = modal.querySelector('.code-block');
      expect(codeBlock).not.toBeNull();
      expect(codeBlock?.getAttribute('contenteditable')).toBe('true');
      expect(codeBlock?.innerHTML).toContain('div');
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
      const modalContent = modal.querySelector('.export-modal-content')!;
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
      const section = createCodeSection('Test Title', '<span>Content</span>');
      expect(section.querySelector('h2')?.textContent).toBe('Test Title');
      expect(section.querySelector('.code-block')?.innerHTML).toBe(
        '<span>Content</span>'
      );
    });
  });
});
