import { createExportToZipButton } from '../../../services/ExportZipService.js';
import { createZipFile } from '../../../utils/zipGenerator.js';
// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------
const MOCK_BLOB = new Blob(['zip-content'], { type: 'application/zip' });
const MOCK_OBJECT_URL = 'blob:http://localhost/mock-zip-url';
jest.mock('../../../utils/zipGenerator', () => ({
    createZipFile: jest.fn(),
}));
const originalCreateObjectURL = URL.createObjectURL;
const originalRevokeObjectURL = URL.revokeObjectURL;
beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    createZipFile.mockReturnValue(MOCK_BLOB);
    URL.createObjectURL = jest.fn().mockReturnValue(MOCK_OBJECT_URL);
    URL.revokeObjectURL = jest.fn();
    document.body.innerHTML = '';
});
afterEach(() => {
    jest.useRealTimers();
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
});
// ---------------------------------------------------------------------------
// Helper: capture the <a> element AT THE MOMENT link.click() is called,
// while it is still live inside document.body.
//
// WHY NOT spy on appendChild/removeChild?
// The service does:
//   document.body.appendChild(link)
//   link.click()
//   document.body.removeChild(link)
//
// If we mock appendChild to intercept the node, the link is never actually
// inserted — so the subsequent removeChild throws a jsdom NotFoundError
// ("node to be removed is not a child of this node").
//
// Instead we patch HTMLAnchorElement.prototype.click.  At that point the
// anchor IS in the DOM, so we can read its attributes, and removeChild
// succeeds normally afterwards.
// ---------------------------------------------------------------------------
function withAnchorCapture(fn) {
    let captured = null;
    const original = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function () {
        // eslint-disable-next-line @typescript-eslint/no-this-alias -- capturing which anchor was clicked, not a readability shortcut
        captured = this;
        // Do NOT forward to the real click — we don't want navigation.
    };
    try {
        fn();
    }
    finally {
        HTMLAnchorElement.prototype.click = original;
    }
    return captured;
}
// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('createExportToZipButton', () => {
    const HTML = '<html><body>Hello</body></html>';
    const CSS = 'body { color: red; }';
    // ── Button creation ───────────────────────────────────────────────────────
    describe('button element', () => {
        it('returns a <button> element', () => {
            expect(createExportToZipButton(HTML, CSS).tagName).toBe('BUTTON');
        });
        it('has text content "Export to ZIP"', () => {
            expect(createExportToZipButton(HTML, CSS).textContent).toBe('Export to ZIP');
        });
        it('has the "export-btn" CSS class', () => {
            expect(createExportToZipButton(HTML, CSS).classList.contains('export-btn')).toBe(true);
        });
        it('does not trigger any side effects on creation', () => {
            createExportToZipButton(HTML, CSS);
            expect(createZipFile).not.toHaveBeenCalled();
            expect(URL.createObjectURL).not.toHaveBeenCalled();
        });
    });
    // ── Click handler ─────────────────────────────────────────────────────────
    describe('on click', () => {
        it('calls createZipFile with index.html and styles.css entries', () => {
            createExportToZipButton(HTML, CSS).click();
            expect(createZipFile).toHaveBeenCalledWith([
                { name: 'index.html', content: HTML },
                { name: 'styles.css', content: CSS },
            ]);
        });
        it('calls URL.createObjectURL with the blob returned by createZipFile', () => {
            createExportToZipButton(HTML, CSS).click();
            expect(URL.createObjectURL).toHaveBeenCalledWith(MOCK_BLOB);
        });
        it('removes the temporary anchor from the DOM after clicking it', () => {
            const btn = createExportToZipButton(HTML, CSS);
            document.body.appendChild(btn);
            btn.click();
            // After the handler finishes, no stray <a> should remain.
            expect(document.body.querySelector('a')).toBeNull();
        });
        it('sets the correct href and download attributes on the anchor', () => {
            const btn = createExportToZipButton(HTML, CSS);
            document.body.appendChild(btn);
            // Capture the anchor while it is live in the DOM (before removeChild).
            const anchor = withAnchorCapture(() => btn.click());
            expect(anchor).not.toBeNull();
            expect(anchor.href).toContain(MOCK_OBJECT_URL);
            expect(anchor.download).toBe('exported-files.zip');
        });
        it('does NOT revoke the object URL before the 10-second delay', () => {
            createExportToZipButton(HTML, CSS).click();
            jest.advanceTimersByTime(9999);
            expect(URL.revokeObjectURL).not.toHaveBeenCalled();
        });
        it('revokes the object URL after the 10-second delay', () => {
            createExportToZipButton(HTML, CSS).click();
            jest.advanceTimersByTime(10000);
            expect(URL.revokeObjectURL).toHaveBeenCalledWith(MOCK_OBJECT_URL);
            expect(URL.revokeObjectURL).toHaveBeenCalledTimes(1);
        });
    });
    // ── Multiple clicks ───────────────────────────────────────────────────────
    describe('multiple clicks', () => {
        it('creates a new zip on each click', () => {
            const btn = createExportToZipButton(HTML, CSS);
            btn.click();
            btn.click();
            btn.click();
            expect(createZipFile).toHaveBeenCalledTimes(3);
        });
        it('revokes each object URL independently after 10 seconds', () => {
            const urls = ['blob:url-1', 'blob:url-2'];
            let callCount = 0;
            URL.createObjectURL.mockImplementation(() => urls[callCount++]);
            const btn = createExportToZipButton(HTML, CSS);
            btn.click();
            btn.click();
            jest.advanceTimersByTime(10000);
            expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:url-1');
            expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:url-2');
            expect(URL.revokeObjectURL).toHaveBeenCalledTimes(2);
        });
    });
    // ── Different html / css values ───────────────────────────────────────────
    describe('with different content', () => {
        it('passes updated HTML and CSS to createZipFile correctly', () => {
            const customHtml = '<p>Custom</p>';
            const customCss = 'p { font-size: 20px; }';
            createExportToZipButton(customHtml, customCss).click();
            expect(createZipFile).toHaveBeenCalledWith([
                { name: 'index.html', content: customHtml },
                { name: 'styles.css', content: customCss },
            ]);
        });
        it('handles empty strings for html and css without throwing', () => {
            const btn = createExportToZipButton('', '');
            expect(() => btn.click()).not.toThrow();
            expect(createZipFile).toHaveBeenCalledWith([
                { name: 'index.html', content: '' },
                { name: 'styles.css', content: '' },
            ]);
        });
    });
});
