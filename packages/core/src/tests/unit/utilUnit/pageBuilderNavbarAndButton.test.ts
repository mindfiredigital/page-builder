/**
 * Unit tests for:
 *   - pageBuilderButtonSetup  (setupSaveButton, setupResetButton, setupViewButton,
 *                              setupPreviewModeButtons, setupUndoRedoButtons)
 *   - pageBuilderNavbarSetup  (createHeaderIfNeeded)
 *   - utilityFunctions        (showNotification, showDialogBox,
 *                              syntaxHighlightHTML, syntaxHighlightCSS, debounce)
 */

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock('../../../canvas/Canvas', () => ({
  Canvas: {
    getState: jest.fn().mockReturnValue([]),
    clearCanvas: jest.fn(),
    historyManager: {
      undo: jest.fn(),
      redo: jest.fn(),
    },
  },
}));

jest.mock('../../../utils/utilityFunctions', () => {
  // Keep a reference to the real module so button-setup tests can verify
  // that the real functions are called, while utility-function tests import
  // the real implementation directly (see bottom of this file).
  const real = jest.requireActual('../../../utils/utilityFunctions');
  return {
    ...real,
    // mockImplementation keeps the real DOM side-effects so the
    // showNotification / showDialogBox describe blocks work correctly,
    // while still giving button-setup tests a jest spy to assert on.
    showNotification: jest.fn().mockImplementation(real.showNotification),
    showDialogBox: jest.fn().mockImplementation(real.showDialogBox),
  };
});

jest.mock('../../../utils/previewModalBuilder', () => ({
  createFullScreenPreviewModal: jest.fn().mockImplementation(() => {
    const el = document.createElement('div');
    el.id = 'preview-modal';
    return el;
  }),
}));

jest.mock('../../../navbar/CreateNavbar', () => ({
  createNavbar: jest.fn().mockReturnValue(document.createElement('nav')),
}));

// ---------------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------------

import {
  setupSaveButton,
  setupResetButton,
  setupViewButton,
  setupPreviewModeButtons,
  setupUndoRedoButtons,
} from '../../../utils/pageBuilderButtonSetup';
import { createHeaderIfNeeded } from '../../../utils/pageBuilderNavbarSetup';
import { Canvas } from '../../../canvas/Canvas';
import { createFullScreenPreviewModal } from '../../../utils/previewModalBuilder';
import { createNavbar } from '../../../navbar/CreateNavbar';

// Real implementations (bypassing the partial mock above)
import {
  showNotification as realShowNotification,
  showDialogBox as realShowDialogBox,
  syntaxHighlightHTML,
  syntaxHighlightCSS,
  debounce,
} from '../../../utils/utilityFunctions';

// Mocked versions used by button/navbar setup modules
import {
  showNotification as mockShowNotification,
  showDialogBox as mockShowDialogBox,
} from '../../../utils/utilityFunctions';

// ---------------------------------------------------------------------------
// DOM helpers
// ---------------------------------------------------------------------------

function addBtn(id: string): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.id = id;
  document.body.appendChild(btn);
  return btn;
}

function makeNotification(): HTMLElement {
  const el = document.createElement('div');
  el.id = 'notification';
  el.classList.add('hidden');
  document.body.appendChild(el);
  return el;
}

function makeDialog(): {
  dialog: HTMLElement;
  yes: HTMLButtonElement;
  no: HTMLButtonElement;
  message: HTMLElement;
} {
  const dialog = document.createElement('div');
  dialog.id = 'dialog';
  dialog.classList.add('hidden');

  const message = document.createElement('div');
  message.id = 'dialog-message';

  const yes = document.createElement('button');
  yes.id = 'dialog-yes';

  const no = document.createElement('button');
  no.id = 'dialog-no';

  dialog.appendChild(message);
  dialog.appendChild(yes);
  dialog.appendChild(no);
  document.body.appendChild(dialog);
  return { dialog, yes, no, message };
}

beforeEach(() => {
  jest.clearAllMocks();
  document.body.innerHTML = '';
});

// ===========================================================================
// setupSaveButton
// ===========================================================================

describe('setupSaveButton', () => {
  it('does not throw when #save-btn is absent', () => {
    expect(() => setupSaveButton({} as any)).not.toThrow();
  });

  it('does not add any listener when #save-btn is absent', () => {
    // No error and no Canvas.getState call
    setupSaveButton({} as any);
    expect(Canvas.getState).not.toHaveBeenCalled();
  });

  it('calls Canvas.getState on click', () => {
    addBtn('save-btn');
    setupSaveButton({} as any);
    document.getElementById('save-btn')!.click();
    expect(Canvas.getState).toHaveBeenCalledTimes(1);
  });

  it('calls jsonStorage.save with the canvas state on click', () => {
    addBtn('save-btn');
    (Canvas.getState as jest.Mock).mockReturnValue([{ id: 'c1' }]);
    const storage = { save: jest.fn(), remove: jest.fn() } as any;
    setupSaveButton(storage);
    document.getElementById('save-btn')!.click();
    expect(storage.save).toHaveBeenCalledWith([{ id: 'c1' }]);
  });

  it('calls showNotification with "Saving progress..." on click', () => {
    addBtn('save-btn');
    const storage = { save: jest.fn(), remove: jest.fn() } as any;
    setupSaveButton(storage);
    document.getElementById('save-btn')!.click();
    expect(mockShowNotification).toHaveBeenCalledWith('Saving progress...');
  });

  it('can be clicked multiple times', () => {
    addBtn('save-btn');
    const storage = { save: jest.fn(), remove: jest.fn() } as any;
    setupSaveButton(storage);
    document.getElementById('save-btn')!.click();
    document.getElementById('save-btn')!.click();
    expect(storage.save).toHaveBeenCalledTimes(2);
  });
});

// ===========================================================================
// setupResetButton
// ===========================================================================

describe('setupResetButton', () => {
  it('does not throw when #reset-btn is absent', () => {
    expect(() => setupResetButton({} as any)).not.toThrow();
  });

  it('calls showDialogBox once on click', () => {
    addBtn('reset-btn');
    setupResetButton({} as any);
    document.getElementById('reset-btn')!.click();
    expect(mockShowDialogBox).toHaveBeenCalledTimes(1);
  });

  it('passes a non-empty confirmation message to showDialogBox', () => {
    addBtn('reset-btn');
    setupResetButton({} as any);
    document.getElementById('reset-btn')!.click();
    const [message] = (mockShowDialogBox as jest.Mock).mock.calls[0];
    expect(typeof message).toBe('string');
    expect(message.length).toBeGreaterThan(0);
  });

  it('calls storage.remove when onConfirm is invoked', () => {
    addBtn('reset-btn');
    const storage = { save: jest.fn(), remove: jest.fn() } as any;
    setupResetButton(storage);
    document.getElementById('reset-btn')!.click();
    const [, onConfirm] = (mockShowDialogBox as jest.Mock).mock.calls[0];
    onConfirm();
    expect(storage.remove).toHaveBeenCalledTimes(1);
  });

  it('calls Canvas.clearCanvas when onConfirm is invoked', () => {
    addBtn('reset-btn');
    const storage = { save: jest.fn(), remove: jest.fn() } as any;
    setupResetButton(storage);
    document.getElementById('reset-btn')!.click();
    const [, onConfirm] = (mockShowDialogBox as jest.Mock).mock.calls[0];
    onConfirm();
    expect(Canvas.clearCanvas).toHaveBeenCalledTimes(1);
  });

  it('calls showNotification after confirming reset', () => {
    addBtn('reset-btn');
    const storage = { save: jest.fn(), remove: jest.fn() } as any;
    setupResetButton(storage);
    document.getElementById('reset-btn')!.click();
    const [, onConfirm] = (mockShowDialogBox as jest.Mock).mock.calls[0];
    onConfirm();
    expect(mockShowNotification).toHaveBeenCalledTimes(1);
  });

  it('does NOT call storage.remove when onCancel is invoked', () => {
    addBtn('reset-btn');
    const storage = { save: jest.fn(), remove: jest.fn() } as any;
    setupResetButton(storage);
    document.getElementById('reset-btn')!.click();
    const [, , onCancel] = (mockShowDialogBox as jest.Mock).mock.calls[0];
    onCancel();
    expect(storage.remove).not.toHaveBeenCalled();
  });

  it('does NOT call Canvas.clearCanvas when onCancel is invoked', () => {
    addBtn('reset-btn');
    const storage = { save: jest.fn(), remove: jest.fn() } as any;
    setupResetButton(storage);
    document.getElementById('reset-btn')!.click();
    const [, , onCancel] = (mockShowDialogBox as jest.Mock).mock.calls[0];
    onCancel();
    expect(Canvas.clearCanvas).not.toHaveBeenCalled();
  });
});

// ===========================================================================
// setupViewButton
// ===========================================================================

describe('setupViewButton', () => {
  it('does not throw when #view-btn is absent', () => {
    expect(() => setupViewButton({} as any, 'grid')).not.toThrow();
  });

  it('calls htmlGenerator.generateHTML on click', () => {
    addBtn('view-btn');
    const generator = {
      generateHTML: jest.fn().mockReturnValue('<html/>'),
    } as any;
    setupViewButton(generator, 'grid');
    document.getElementById('view-btn')!.click();
    expect(generator.generateHTML).toHaveBeenCalledTimes(1);
  });

  it('calls createFullScreenPreviewModal with the generated HTML and layoutMode', () => {
    addBtn('view-btn');
    const generator = {
      generateHTML: jest.fn().mockReturnValue('<html/>'),
    } as any;
    setupViewButton(generator, 'absolute');
    document.getElementById('view-btn')!.click();
    expect(createFullScreenPreviewModal).toHaveBeenCalledWith(
      '<html/>',
      'absolute',
      null
    );
  });

  it('appends the returned modal element to document.body', () => {
    addBtn('view-btn');
    const generator = {
      generateHTML: jest.fn().mockReturnValue('<html/>'),
    } as any;
    setupViewButton(generator, 'grid');
    document.getElementById('view-btn')!.click();
    expect(document.getElementById('preview-modal')).not.toBeNull();
  });

  it('passes "grid" layoutMode correctly', () => {
    addBtn('view-btn');
    const generator = { generateHTML: jest.fn().mockReturnValue('') } as any;
    setupViewButton(generator, 'grid');
    document.getElementById('view-btn')!.click();
    expect(createFullScreenPreviewModal).toHaveBeenCalledWith('', 'grid', null);
  });
});

// ===========================================================================
// setupPreviewModeButtons
// ===========================================================================

describe('setupPreviewModeButtons', () => {
  function addPreviewBtns(): void {
    ['preview-desktop', 'preview-tablet', 'preview-mobile'].forEach(id =>
      addBtn(id)
    );
  }

  it('does not throw when none of the preview buttons exist', () => {
    const panel = { setPreviewMode: jest.fn() } as any;
    expect(() => setupPreviewModeButtons(panel)).not.toThrow();
  });

  it('calls setPreviewMode("desktop") when #preview-desktop is clicked', () => {
    addPreviewBtns();
    const panel = { setPreviewMode: jest.fn() } as any;
    setupPreviewModeButtons(panel);
    document.getElementById('preview-desktop')!.click();
    expect(panel.setPreviewMode).toHaveBeenCalledWith('desktop');
  });

  it('calls setPreviewMode("tablet") when #preview-tablet is clicked', () => {
    addPreviewBtns();
    const panel = { setPreviewMode: jest.fn() } as any;
    setupPreviewModeButtons(panel);
    document.getElementById('preview-tablet')!.click();
    expect(panel.setPreviewMode).toHaveBeenCalledWith('tablet');
  });

  it('calls setPreviewMode("mobile") when #preview-mobile is clicked', () => {
    addPreviewBtns();
    const panel = { setPreviewMode: jest.fn() } as any;
    setupPreviewModeButtons(panel);
    document.getElementById('preview-mobile')!.click();
    expect(panel.setPreviewMode).toHaveBeenCalledWith('mobile');
  });

  it('each button click calls setPreviewMode exactly once', () => {
    addPreviewBtns();
    const panel = { setPreviewMode: jest.fn() } as any;
    setupPreviewModeButtons(panel);
    document.getElementById('preview-desktop')!.click();
    document.getElementById('preview-tablet')!.click();
    document.getElementById('preview-mobile')!.click();
    expect(panel.setPreviewMode).toHaveBeenCalledTimes(3);
  });

  it('does not throw when only some preview buttons exist', () => {
    addBtn('preview-desktop'); // only desktop
    const panel = { setPreviewMode: jest.fn() } as any;
    expect(() => setupPreviewModeButtons(panel)).not.toThrow();
  });
});

// ===========================================================================
// setupUndoRedoButtons
// ===========================================================================

describe('setupUndoRedoButtons', () => {
  it('does not throw when neither button exists', () => {
    expect(() => setupUndoRedoButtons()).not.toThrow();
  });

  it('calls Canvas.historyManager.undo() when #undo-btn is clicked', () => {
    addBtn('undo-btn');
    setupUndoRedoButtons();
    document.getElementById('undo-btn')!.click();
    expect(Canvas.historyManager.undo).toHaveBeenCalledTimes(1);
  });

  it('calls Canvas.historyManager.redo() when #redo-btn is clicked', () => {
    addBtn('redo-btn');
    setupUndoRedoButtons();
    document.getElementById('redo-btn')!.click();
    expect(Canvas.historyManager.redo).toHaveBeenCalledTimes(1);
  });

  it('can undo multiple times', () => {
    addBtn('undo-btn');
    setupUndoRedoButtons();
    document.getElementById('undo-btn')!.click();
    document.getElementById('undo-btn')!.click();
    expect(Canvas.historyManager.undo).toHaveBeenCalledTimes(2);
  });

  it('does not call redo when undo button is clicked', () => {
    addBtn('undo-btn');
    setupUndoRedoButtons();
    document.getElementById('undo-btn')!.click();
    expect(Canvas.historyManager.redo).not.toHaveBeenCalled();
  });

  it('does not call undo when redo button is clicked', () => {
    addBtn('redo-btn');
    setupUndoRedoButtons();
    document.getElementById('redo-btn')!.click();
    expect(Canvas.historyManager.undo).not.toHaveBeenCalled();
  });
});

// ===========================================================================
// createHeaderIfNeeded
// ===========================================================================

describe('createHeaderIfNeeded', () => {
  function makeApp(): HTMLDivElement {
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    return app;
  }

  it('creates a <header> element with id "page-builder-header"', () => {
    makeApp();
    createHeaderIfNeeded(true);
    expect(document.getElementById('page-builder-header')).not.toBeNull();
    expect(document.getElementById('page-builder-header')!.tagName).toBe(
      'HEADER'
    );
  });

  it('inserts the header immediately before the #app element', () => {
    makeApp();
    createHeaderIfNeeded(true);
    const header = document.getElementById('page-builder-header')!;
    const app = document.getElementById('app')!;
    expect(header.nextElementSibling).toBe(app);
  });

  it('calls createNavbar with the editable flag', () => {
    makeApp();
    createHeaderIfNeeded(false);
    expect(createNavbar).toHaveBeenCalledWith(false, undefined, undefined);
  });

  it('passes brandTitle to createNavbar', () => {
    makeApp();
    createHeaderIfNeeded(true, 'My Brand');
    expect(createNavbar).toHaveBeenCalledWith(true, 'My Brand', undefined);
  });

  it('passes showAttributeTab to createNavbar', () => {
    makeApp();
    createHeaderIfNeeded(true, 'Brand', true);
    expect(createNavbar).toHaveBeenCalledWith(true, 'Brand', true);
  });

  it('is idempotent — does NOT create a second header on repeated calls', () => {
    makeApp();
    createHeaderIfNeeded(true);
    createHeaderIfNeeded(true);
    expect(document.querySelectorAll('#page-builder-header')).toHaveLength(1);
  });

  it('does NOT call createNavbar on repeated calls', () => {
    makeApp();
    createHeaderIfNeeded(true);
    (createNavbar as jest.Mock).mockClear();
    createHeaderIfNeeded(true);
    expect(createNavbar).not.toHaveBeenCalled();
  });

  it('does not throw when #app is absent', () => {
    expect(() => createHeaderIfNeeded(true)).not.toThrow();
  });

  it('does not create a header when #app is absent', () => {
    createHeaderIfNeeded(true);
    expect(document.getElementById('page-builder-header')).toBeNull();
  });

  it('appends the nav element returned by createNavbar inside the header', () => {
    const fakeNav = document.createElement('nav');
    (createNavbar as jest.Mock).mockReturnValue(fakeNav);
    makeApp();
    createHeaderIfNeeded(true);
    const header = document.getElementById('page-builder-header')!;
    expect(header.contains(fakeNav)).toBe(true);
  });
});

// ===========================================================================
// showNotification  (real implementation)
// ===========================================================================

describe('showNotification', () => {
  it('sets innerHTML to the provided message', () => {
    const n = makeNotification();
    realShowNotification('Hello World');
    expect(n.innerHTML).toBe('Hello World');
  });

  it('adds the "visible" class', () => {
    const n = makeNotification();
    realShowNotification('test');
    expect(n.classList.contains('visible')).toBe(true);
  });

  it('removes the "hidden" class', () => {
    const n = makeNotification();
    realShowNotification('test');
    expect(n.classList.contains('hidden')).toBe(false);
  });

  it('re-adds "hidden" and removes "visible" after 2 seconds', () => {
    jest.useFakeTimers();
    const n = makeNotification();
    realShowNotification('timed');
    jest.advanceTimersByTime(2000);
    expect(n.classList.contains('hidden')).toBe(true);
    expect(n.classList.contains('visible')).toBe(false);
    jest.useRealTimers();
  });

  it('does not hide before 2 seconds have elapsed', () => {
    jest.useFakeTimers();
    const n = makeNotification();
    realShowNotification('timed');
    jest.advanceTimersByTime(1999);
    expect(n.classList.contains('visible')).toBe(true);
    jest.useRealTimers();
  });

  it('does not throw when #notification element is absent', () => {
    expect(() => realShowNotification('orphan')).not.toThrow();
  });

  it('accepts an empty string message without throwing', () => {
    makeNotification();
    expect(() => realShowNotification('')).not.toThrow();
  });

  it('accepts HTML markup as message', () => {
    const n = makeNotification();
    realShowNotification('<b>Bold</b>');
    expect(n.innerHTML).toBe('<b>Bold</b>');
  });
});

// ===========================================================================
// showDialogBox  (real implementation)
// ===========================================================================

describe('showDialogBox', () => {
  it('sets the dialog-message innerHTML to the provided message', () => {
    const { message } = makeDialog();
    realShowDialogBox('Are you sure?', jest.fn(), jest.fn());
    expect(message.innerHTML).toBe('Are you sure?');
  });

  it('removes "hidden" from the dialog', () => {
    const { dialog } = makeDialog();
    realShowDialogBox('msg', jest.fn(), jest.fn());
    expect(dialog.classList.contains('hidden')).toBe(false);
  });

  it('calls onConfirm when the Yes button is clicked', () => {
    const { yes } = makeDialog();
    const onConfirm = jest.fn();
    realShowDialogBox('msg', onConfirm, jest.fn());
    yes.click();
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('adds "hidden" back to dialog after Yes is clicked', () => {
    const { dialog, yes } = makeDialog();
    realShowDialogBox('msg', jest.fn(), jest.fn());
    yes.click();
    expect(dialog.classList.contains('hidden')).toBe(true);
  });

  it('calls onCancel when the No button is clicked', () => {
    const { no } = makeDialog();
    const onCancel = jest.fn();
    realShowDialogBox('msg', jest.fn(), onCancel);
    no.click();
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('adds "hidden" back to dialog after No is clicked', () => {
    const { dialog, no } = makeDialog();
    realShowDialogBox('msg', jest.fn(), jest.fn());
    no.click();
    expect(dialog.classList.contains('hidden')).toBe(true);
  });

  it('does not call onCancel when Yes is clicked', () => {
    const { yes } = makeDialog();
    const onCancel = jest.fn();
    realShowDialogBox('msg', jest.fn(), onCancel);
    yes.click();
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('does not call onConfirm when No is clicked', () => {
    const { no } = makeDialog();
    const onConfirm = jest.fn();
    realShowDialogBox('msg', onConfirm, jest.fn());
    no.click();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('does not throw when dialog elements are absent', () => {
    expect(() => realShowDialogBox('msg', jest.fn(), jest.fn())).not.toThrow();
  });
});

// ===========================================================================
// syntaxHighlightHTML
// ===========================================================================

describe('syntaxHighlightHTML', () => {
  it('escapes & to &amp;', () => {
    expect(syntaxHighlightHTML('a & b')).toContain('&amp;');
  });

  it('escapes < to &lt;', () => {
    expect(syntaxHighlightHTML('<div>')).toContain('&lt;');
  });

  it('escapes > to &gt;', () => {
    expect(syntaxHighlightHTML('<div>')).toContain('&gt;');
  });

  it('wraps escaped tags in <span class="tag">', () => {
    expect(syntaxHighlightHTML('<p>')).toContain('<span class="tag">');
  });

  it('wraps attribute string values in <span class="string">', () => {
    const result = syntaxHighlightHTML('<div class="foo">');
    expect(result).toContain('<span class="string">foo</span>');
  });

  it('wraps attribute names / delimiters in <span class="attribute">', () => {
    const result = syntaxHighlightHTML('<a href="url">');
    expect(result).toContain('<span class="attribute">');
  });

  it('returns an empty string unchanged', () => {
    expect(syntaxHighlightHTML('')).toBe('');
  });

  it('handles multiple attributes on a single element', () => {
    const result = syntaxHighlightHTML('<a href="url" id="link">');
    expect(result).toContain('href');
    expect(result).toContain('id');
  });

  it('handles a closing tag', () => {
    const result = syntaxHighlightHTML('</div>');
    expect(result).toContain('&lt;');
    expect(result).toContain('&gt;');
  });

  it('escapes multiple & occurrences', () => {
    const result = syntaxHighlightHTML('a & b & c');
    expect(result.split('&amp;').length - 1).toBe(2);
  });
});

// ===========================================================================
// syntaxHighlightCSS
// ===========================================================================

describe('syntaxHighlightCSS', () => {
  it('wraps property names in <span class="property">', () => {
    const result = syntaxHighlightCSS('color: red;');
    expect(result).toContain('<span class="property">color</span>');
  });

  it('wraps values in <span class="value">', () => {
    const result = syntaxHighlightCSS('color: red;');
    expect(result).toContain('<span class="value">');
  });

  it('wraps { in <span class="bracket">', () => {
    const result = syntaxHighlightCSS('body { color: red; }');
    expect(result).toContain('<span class="bracket">{</span>');
  });

  it('wraps } in <span class="bracket">', () => {
    const result = syntaxHighlightCSS('body { color: red; }');
    expect(result).toContain('<span class="bracket">}</span>');
  });

  it('returns an empty string unchanged', () => {
    expect(syntaxHighlightCSS('')).toBe('');
  });

  it('handles hyphenated property names (e.g. font-size)', () => {
    const result = syntaxHighlightCSS('font-size: 16px;');
    expect(result).toContain('font-size');
  });

  it('handles multiple declarations', () => {
    const result = syntaxHighlightCSS('color: red; font-size: 16px;');
    expect(result).toContain('color');
    expect(result).toContain('font-size');
  });
});

// ===========================================================================
// debounce
// ===========================================================================

describe('debounce', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('does not invoke the callback before the delay elapses', () => {
    const fn = jest.fn();
    debounce(fn, 300)();
    expect(fn).not.toHaveBeenCalled();
  });

  it('invokes the callback exactly once after the delay', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 300);
    debounced();
    jest.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('resets the timer when called again before the delay elapses', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 300);
    debounced();
    jest.advanceTimersByTime(200);
    debounced();
    jest.advanceTimersByTime(200); // only 200 ms since last call
    expect(fn).not.toHaveBeenCalled();
    jest.advanceTimersByTime(100); // now 300 ms since last call
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('fires only once for rapid repeated calls', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 200);
    debounced();
    debounced();
    debounced();
    jest.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('uses the arguments from the last call', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 200);
    debounced('first');
    debounced('second');
    debounced('last');
    jest.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledWith('last');
  });

  it('passes all arguments through to the wrapped function', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 100);
    debounced('a', 42, true);
    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledWith('a', 42, true);
  });

  it('can fire again after the delay has elapsed once', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 100);
    debounced();
    jest.advanceTimersByTime(100);
    debounced();
    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('does not invoke callback for a zero-delay debounce before flush', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 0);
    debounced();
    // Even with 0 ms delay, callback should run asynchronously
    expect(fn).not.toHaveBeenCalled();
    jest.advanceTimersByTime(0);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
