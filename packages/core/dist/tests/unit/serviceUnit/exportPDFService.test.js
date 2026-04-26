var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
import { setupExportPDFButton } from '../../../services/ExportPdfService.js';
import { showNotification } from '../../../utils/utilityFunctions.js';
import html2pdf from 'html2pdf.js';
// --- Mocks ---
jest.mock('html2pdf.js', () => {
  const mWorker = {
    set: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    save: jest.fn().mockResolvedValue(true),
  };
  return jest.fn(() => mWorker);
});
jest.mock('../../../services/HTMLGenerator', () => ({
  HTMLGenerator: jest.fn().mockImplementation(() => ({
    generateHTML: jest
      .fn()
      .mockReturnValue('<div id="canvas" class="home">Mock Content</div>'),
    generateCSS: jest.fn().mockReturnValue('body { color: red; }'),
  })),
}));
jest.mock('../../../utils/utilityFunctions', () => ({
  showNotification: jest.fn(),
}));
// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
/**
 * Drains the microtask queue by awaiting a resolved Promise several times.
 * Each `await Promise.resolve()` yields once to the microtask checkpoint,
 * which is enough to let one layer of `.then()` / `catch` / `finally`
 * continuations run.  We call it 4 times to cover the deepest chain in the
 * service:
 *   setTimeout resolves  →  outer await resumes  →  worker.save() settles
 *   →  catch/finally runs
 */
const flushMicrotasks = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    yield Promise.resolve();
    yield Promise.resolve();
    yield Promise.resolve();
    yield Promise.resolve();
  });
/**
 * Advance Jest fake-timers by `ms` AND drain the microtask queue afterwards.
 *
 * Why both?  `jest.advanceTimersByTime()` fires the `setTimeout` callback
 * synchronously, which resolves the Promise that was waiting on it.  But the
 * `.then()` / `await` continuations that follow are scheduled as microtasks —
 * they won't run until we yield back to the event loop via `await`.
 */
const advanceAndFlush = ms =>
  __awaiter(void 0, void 0, void 0, function* () {
    jest.advanceTimersByTime(ms);
    yield flushMicrotasks();
  });
// ---------------------------------------------------------------------------
// The service has TWO awaited setTimeout calls:
//
//   1. await new Promise(r => setTimeout(r, 1500))   ← "UI settle" delay
//   2. await new Promise(r => setTimeout(r, 100))    ← "DOM append" delay
//
// After delay #2 the chain is:
//   worker.set(...).from(...).save()   ← returns a Promise
//   → showNotification (success) OR catch block (error)
//   → finally block (DOM cleanup)
//
// The test must mirror this exact sequence:
//   advanceAndFlush(1500) → advanceAndFlush(100) → flushMicrotasks (×2)
// ---------------------------------------------------------------------------
describe('ExportPDFService', () => {
  let exportBtn;
  let canvasEl;
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    document.body.innerHTML = `
      <button id="export-pdf-btn">Export PDF</button>
      <div id="canvas" style="width: 1000px; height: 1500px;"></div>
    `;
    exportBtn = document.getElementById('export-pdf-btn');
    canvasEl = document.getElementById('canvas');
    // jsdom doesn't compute layout so scrollWidth/Height are 0 by default.
    Object.defineProperty(canvasEl, 'scrollWidth', {
      value: 1000,
      configurable: true,
    });
    Object.defineProperty(canvasEl, 'scrollHeight', {
      value: 1500,
      configurable: true,
    });
  });
  afterEach(() => {
    jest.useRealTimers();
    // Belt-and-suspenders cleanup in case a test leaves the container behind.
    document
      .querySelectorAll('div[style*="left: -99999px"]')
      .forEach(el => el.remove());
  });
  // -------------------------------------------------------------------------
  it('should show a start notification immediately on click', () => {
    setupExportPDFButton();
    exportBtn.click();
    // showNotification is called synchronously before the first await.
    expect(showNotification).toHaveBeenCalledWith(
      'Generating PDF for download...'
    );
  });
  // -------------------------------------------------------------------------
  it('should handle errors and show error notification', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      // Override the default (success) mock with a rejecting one.
      const errorWorker = {
        set: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        save: jest.fn().mockRejectedValue(new Error('PDF Fail')),
      };
      html2pdf.mockReturnValue(errorWorker);
      setupExportPDFButton();
      exportBtn.click();
      // Step 1 – fire the 1500 ms "UI settle" setTimeout and let the async
      //          handler resume up to the next await point.
      yield advanceAndFlush(1500);
      // Step 2 – fire the 100 ms "DOM append" setTimeout and let the handler
      //          resume up to `await worker…save()`.
      yield advanceAndFlush(100);
      // Step 3 – worker.save() returns a rejected Promise; flush lets the
      //          catch and finally blocks execute.
      yield flushMicrotasks();
      expect(showNotification).toHaveBeenCalledWith(
        expect.stringContaining('Error generating PDF')
      );
    }));
  // -------------------------------------------------------------------------
  it('should cleanup the temporary container from DOM on success', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      setupExportPDFButton();
      exportBtn.click();
      yield advanceAndFlush(1500);
      yield advanceAndFlush(100);
      yield flushMicrotasks();
      const tempContainer = document.querySelector(
        'div[style*="left: -99999px"]'
      );
      expect(tempContainer).toBeNull();
    }));
  // -------------------------------------------------------------------------
  it('should cleanup the temporary container from DOM on failure', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const errorWorker = {
        set: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        save: jest.fn().mockRejectedValue(new Error('PDF Fail')),
      };
      html2pdf.mockReturnValue(errorWorker);
      setupExportPDFButton();
      exportBtn.click();
      yield advanceAndFlush(1500);
      yield advanceAndFlush(100);
      yield flushMicrotasks();
      const tempContainer = document.querySelector(
        'div[style*="left: -99999px"]'
      );
      expect(tempContainer).toBeNull();
    }));
  // -------------------------------------------------------------------------
  it('should call worker.set, from, and save with correct arguments', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const mockWorker = {
        set: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        save: jest.fn().mockResolvedValue(true),
      };
      html2pdf.mockReturnValue(mockWorker);
      setupExportPDFButton();
      exportBtn.click();
      yield advanceAndFlush(1500);
      yield advanceAndFlush(100);
      yield flushMicrotasks();
      expect(mockWorker.set).toHaveBeenCalledWith(
        expect.objectContaining({ filename: 'exported_page_download.pdf' })
      );
      expect(mockWorker.from).toHaveBeenCalledWith(expect.any(HTMLElement));
      expect(mockWorker.save).toHaveBeenCalled();
    }));
});
