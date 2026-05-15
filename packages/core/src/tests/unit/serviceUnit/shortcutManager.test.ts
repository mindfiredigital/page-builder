import { ShortcutManager } from '../../../services/ShortcutManager';
import { Canvas } from '../../../canvas/Canvas';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock('../../../canvas/Canvas', () => ({
  Canvas: {
    historyManager: {
      undo: jest.fn(),
      redo: jest.fn(),
    },
  },
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Fires a KeyboardEvent on document with the given key and modifier flags.
 * `key` should be the exact `.key` value produced by the browser
 * (e.g. 'z', 'Z', 'y', 'Y').
 */
function fireKeydown(
  key: string,
  modifiers: { ctrlKey?: boolean; metaKey?: boolean } = {}
): KeyboardEvent {
  const event = new KeyboardEvent('keydown', {
    key,
    ctrlKey: modifiers.ctrlKey ?? false,
    metaKey: modifiers.metaKey ?? false,
    bubbles: true,
    cancelable: true,
  });
  document.dispatchEvent(event);
  return event;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('ShortcutManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Re-initialise before each test so the listener is always fresh.
    ShortcutManager.init();
  });

  // ── init() ────────────────────────────────────────────────────────────────

  describe('init()', () => {
    it('attaches a keydown listener without throwing', () => {
      expect(() => ShortcutManager.init()).not.toThrow();
    });

    it('does not trigger any history action on init alone', () => {
      expect(Canvas.historyManager.undo).not.toHaveBeenCalled();
      expect(Canvas.historyManager.redo).not.toHaveBeenCalled();
    });
  });

  // ── Ctrl+Z  ──────────────────────────────────────────────────────────────

  describe('Ctrl+Z (undo)', () => {
    it('calls historyManager.undo when Ctrl+z is pressed', () => {
      fireKeydown('z', { ctrlKey: true });
      expect(Canvas.historyManager.undo).toHaveBeenCalledTimes(1);
    });

    it('calls historyManager.undo when Ctrl+Z (uppercase) is pressed', () => {
      fireKeydown('Z', { ctrlKey: true });
      expect(Canvas.historyManager.undo).toHaveBeenCalledTimes(1);
    });

    it('prevents the default browser undo on Ctrl+Z', () => {
      const event = fireKeydown('z', { ctrlKey: true });
      expect(event.defaultPrevented).toBe(true);
    });

    it('does NOT call undo when Z is pressed without Ctrl/Meta', () => {
      fireKeydown('z');
      expect(Canvas.historyManager.undo).not.toHaveBeenCalled();
    });

    it('does NOT call redo when Ctrl+Z is pressed', () => {
      fireKeydown('z', { ctrlKey: true });
      expect(Canvas.historyManager.redo).not.toHaveBeenCalled();
    });
  });

  // ── Meta+Z (macOS) ────────────────────────────────────────────────────────

  describe('Meta+Z (undo on macOS)', () => {
    it('calls historyManager.undo when Meta+z is pressed', () => {
      fireKeydown('z', { metaKey: true });
      expect(Canvas.historyManager.undo).toHaveBeenCalledTimes(1);
    });

    it('prevents default on Meta+Z', () => {
      const event = fireKeydown('z', { metaKey: true });
      expect(event.defaultPrevented).toBe(true);
    });
  });

  // ── Ctrl+Y (redo) ─────────────────────────────────────────────────────────

  describe('Ctrl+Y (redo)', () => {
    it('calls historyManager.redo when Ctrl+y is pressed', () => {
      fireKeydown('y', { ctrlKey: true });
      expect(Canvas.historyManager.redo).toHaveBeenCalledTimes(1);
    });

    it('calls historyManager.redo when Ctrl+Y (uppercase) is pressed', () => {
      fireKeydown('Y', { ctrlKey: true });
      expect(Canvas.historyManager.redo).toHaveBeenCalledTimes(1);
    });

    it('prevents the default browser action on Ctrl+Y', () => {
      const event = fireKeydown('y', { ctrlKey: true });
      expect(event.defaultPrevented).toBe(true);
    });

    it('does NOT call redo when Y is pressed without Ctrl/Meta', () => {
      fireKeydown('y');
      expect(Canvas.historyManager.redo).not.toHaveBeenCalled();
    });

    it('does NOT call undo when Ctrl+Y is pressed', () => {
      fireKeydown('y', { ctrlKey: true });
      expect(Canvas.historyManager.undo).not.toHaveBeenCalled();
    });
  });

  // ── Meta+Y (redo on macOS) ────────────────────────────────────────────────

  describe('Meta+Y (redo on macOS)', () => {
    it('calls historyManager.redo when Meta+y is pressed', () => {
      fireKeydown('y', { metaKey: true });
      expect(Canvas.historyManager.redo).toHaveBeenCalledTimes(1);
    });

    it('prevents default on Meta+Y', () => {
      const event = fireKeydown('y', { metaKey: true });
      expect(event.defaultPrevented).toBe(true);
    });
  });

  // ── Unrelated keys ────────────────────────────────────────────────────────

  describe('unrelated keys', () => {
    it('does nothing when Ctrl+A is pressed', () => {
      fireKeydown('a', { ctrlKey: true });
      expect(Canvas.historyManager.undo).not.toHaveBeenCalled();
      expect(Canvas.historyManager.redo).not.toHaveBeenCalled();
    });

    it('does nothing when Ctrl+S is pressed', () => {
      fireKeydown('s', { ctrlKey: true });
      expect(Canvas.historyManager.undo).not.toHaveBeenCalled();
      expect(Canvas.historyManager.redo).not.toHaveBeenCalled();
    });

    it('does nothing when a plain letter key is pressed', () => {
      fireKeydown('z');
      fireKeydown('y');
      expect(Canvas.historyManager.undo).not.toHaveBeenCalled();
      expect(Canvas.historyManager.redo).not.toHaveBeenCalled();
    });

    it('does nothing on Enter without modifiers', () => {
      fireKeydown('Enter');
      expect(Canvas.historyManager.undo).not.toHaveBeenCalled();
      expect(Canvas.historyManager.redo).not.toHaveBeenCalled();
    });
  });

  // ── Rapid sequences ───────────────────────────────────────────────────────

  describe('rapid sequences', () => {
    it('calls undo the correct number of times for repeated Ctrl+Z', () => {
      fireKeydown('z', { ctrlKey: true });
      fireKeydown('z', { ctrlKey: true });
      fireKeydown('z', { ctrlKey: true });
      expect(Canvas.historyManager.undo).toHaveBeenCalledTimes(3);
    });

    it('calls redo the correct number of times for repeated Ctrl+Y', () => {
      fireKeydown('y', { ctrlKey: true });
      fireKeydown('y', { ctrlKey: true });
      expect(Canvas.historyManager.redo).toHaveBeenCalledTimes(2);
    });

    it('handles an interleaved undo/redo sequence correctly', () => {
      fireKeydown('z', { ctrlKey: true }); // undo
      fireKeydown('y', { ctrlKey: true }); // redo
      fireKeydown('z', { ctrlKey: true }); // undo

      expect(Canvas.historyManager.undo).toHaveBeenCalledTimes(2);
      expect(Canvas.historyManager.redo).toHaveBeenCalledTimes(1);
    });
  });
});
