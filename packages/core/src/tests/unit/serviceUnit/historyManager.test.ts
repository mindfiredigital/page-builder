/**
 * HistoryManager.test.ts
 * Unit tests for undo / redo functionality.
 */

const mockGetState = jest.fn();
const mockRestoreState = jest.fn();
const mockJsonStorageLoad = jest.fn().mockReturnValue(null);

jest.mock('../../../canvas/Canvas', () => ({
  Canvas: {
    getState: mockGetState,
    restoreState: mockRestoreState,
    jsonStorage: { load: mockJsonStorageLoad },
  },
}));

import { HistoryManager } from '../../../services/HistoryManager';

function makeDesign(id: string): any[] {
  return [{ id, type: 'canvas', content: '', position: { x: 0, y: 0 } }];
}

describe('HistoryManager', () => {
  let manager: HistoryManager;
  let canvas: HTMLElement;

  beforeEach(() => {
    canvas = document.createElement('div');
    manager = new HistoryManager(canvas);
    jest.clearAllMocks();
  });

  // ─── captureState() ───────────────────────────────────────────────────────
  describe('captureState()', () => {
    it('should call Canvas.getState()', () => {
      mockGetState.mockReturnValueOnce(makeDesign('s1'));
      manager.captureState();
      expect(mockGetState).toHaveBeenCalled();
    });

    it('should add a new state to the undo stack', () => {
      const state = makeDesign('s1');
      mockGetState.mockReturnValueOnce(state);
      manager.captureState();
      // undo should now be possible
      mockGetState.mockReturnValueOnce(makeDesign('s2'));
      manager.captureState();
      // stack has 2 distinct entries
      manager.undo(); // pops s2
      expect(mockRestoreState).toHaveBeenCalledWith(state);
    });

    it('should not push a duplicate state', () => {
      const state = makeDesign('s1');
      mockGetState.mockReturnValue(state);
      manager.captureState();
      manager.captureState(); // same JSON → should not push
      // If only one entry, undo should empty the stack and call restoreState with loaded/[]
      manager.undo();
      expect(mockRestoreState).toHaveBeenCalledTimes(1);
    });

    it('should clear the redo stack on a new capture', () => {
      mockGetState
        .mockReturnValueOnce(makeDesign('a'))
        .mockReturnValueOnce(makeDesign('b'))
        .mockReturnValueOnce(makeDesign('c'));

      manager.captureState(); // a
      manager.captureState(); // b
      manager.undo(); // pops b → redo has [b]
      manager.captureState(); // c → redo should be cleared
      manager.redo(); // nothing to redo
      expect(mockRestoreState).toHaveBeenCalledTimes(1); // only from undo
    });

    it('should limit undo stack to 20 entries', () => {
      for (let i = 0; i < 25; i++) {
        mockGetState.mockReturnValueOnce(makeDesign(`state-${i}`));
        manager.captureState();
      }
      // 20 undos max — check that at most 20 calls to restoreState can be made
      let count = 0;
      mockGetState.mockReturnValue([]);
      while (true) {
        const before = mockRestoreState.mock.calls.length;
        manager.undo();
        const after = mockRestoreState.mock.calls.length;
        if (after === before) break;
        count++;
        if (count > 25) break; // safety
      }
      expect(count).toBeLessThanOrEqual(20);
    });

    it('should warn when state is empty and not push', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      mockGetState.mockReturnValueOnce([]);
      manager.captureState();
      expect(warnSpy).toHaveBeenCalled();
    });
  });

  // ─── undo() ───────────────────────────────────────────────────────────────
  describe('undo()', () => {
    it('should call Canvas.restoreState with the previous state', () => {
      mockGetState
        .mockReturnValueOnce(makeDesign('v1'))
        .mockReturnValueOnce(makeDesign('v2'));
      manager.captureState();
      manager.captureState();

      manager.undo();
      expect(mockRestoreState).toHaveBeenCalledWith(makeDesign('v1'));
    });

    it('should warn when undo stack has exactly 1 entry and fall back to storage', () => {
      mockGetState.mockReturnValueOnce(makeDesign('only'));
      manager.captureState();
      mockJsonStorageLoad.mockReturnValueOnce(makeDesign('saved'));

      manager.undo();
      expect(mockRestoreState).toHaveBeenCalledWith(makeDesign('saved'));
    });

    it('should fall back to empty canvas when no saved state exists', () => {
      mockGetState.mockReturnValueOnce(makeDesign('only'));
      manager.captureState();
      mockJsonStorageLoad.mockReturnValueOnce(null);

      manager.undo();
      expect(mockRestoreState).toHaveBeenCalledWith([]);
    });

    it('should warn when undo stack is empty', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      manager.undo();
      expect(warnSpy).toHaveBeenCalled();
    });

    it('should push the current state to the redo stack', () => {
      const s1 = makeDesign('s1');
      const s2 = makeDesign('s2');
      mockGetState.mockReturnValueOnce(s1).mockReturnValueOnce(s2);
      manager.captureState();
      manager.captureState();

      manager.undo(); // pops s2 → redo gets s2

      manager.redo(); // should restore s2
      expect(mockRestoreState).toHaveBeenLastCalledWith(s2);
    });
  });

  // ─── redo() ───────────────────────────────────────────────────────────────
  describe('redo()', () => {
    it('should restore the last undone state', () => {
      const s1 = makeDesign('s1');
      const s2 = makeDesign('s2');
      mockGetState.mockReturnValueOnce(s1).mockReturnValueOnce(s2);
      manager.captureState();
      manager.captureState();

      manager.undo();
      manager.redo();

      expect(mockRestoreState).toHaveBeenLastCalledWith(s2);
    });

    it('should warn when redo stack is empty', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      manager.redo();
      expect(warnSpy).toHaveBeenCalled();
    });

    it('should not warn when redo is available', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      mockGetState
        .mockReturnValueOnce(makeDesign('a'))
        .mockReturnValueOnce(makeDesign('b'));
      manager.captureState();
      manager.captureState();
      manager.undo();

      warnSpy.mockClear();
      manager.redo();
      expect(warnSpy).not.toHaveBeenCalled();
    });
  });
});
