/**
 * CanvasSharedState.test.ts
 * Unit tests for the central shared-state singleton used by all Canvas modules.
 */
// We test CanvasSharedState in isolation by directly importing it and
// manipulating its public static properties.
// Because CanvasSharedState imports type-only references we can import it
// directly without triggering real DOM operations.
jest.mock('../../../services/HistoryManager', () => ({
  HistoryManager: jest.fn().mockImplementation(() => ({
    captureState: jest.fn(),
    undo: jest.fn(),
    redo: jest.fn(),
    undoStack: [],
    redoStack: [],
  })),
}));
jest.mock('../../../services/JSONStorage', () => ({
  JSONStorage: jest.fn().mockImplementation(() => ({
    save: jest.fn(),
    load: jest.fn().mockReturnValue(null),
    remove: jest.fn(),
  })),
}));
jest.mock('../../../canvas/ComponentControls', () => ({
  ComponentControlsManager: jest.fn().mockImplementation(() => ({
    addControlButtons: jest.fn(),
  })),
}));
jest.mock('../../../canvas/GridManager', () => ({
  GridManager: jest.fn().mockImplementation(() => ({
    initializeDropPreview: jest.fn(),
    mousePositionAtGridCorner: jest
      .fn()
      .mockReturnValue({ gridX: 0, gridY: 0 }),
    getCellSize: jest.fn().mockReturnValue(20),
  })),
}));
import { CanvasSharedState } from '../../../canvas/CanvasCore/CanvasSharedState.js';
describe('CanvasSharedState', () => {
  beforeEach(() => {
    // Reset shared state before each test
    CanvasSharedState.components = [];
    CanvasSharedState.editable = null;
    CanvasSharedState.lastCanvasWidth = null;
  });
  // ─── Component array ──────────────────────────────────────────────────────
  describe('components array', () => {
    it('should initialise with an empty array', () => {
      CanvasSharedState.components = [];
      expect(CanvasSharedState.components).toEqual([]);
    });
    it('should allow setting components array', () => {
      const div = document.createElement('div');
      CanvasSharedState.components = [div];
      expect(CanvasSharedState.components).toHaveLength(1);
      expect(CanvasSharedState.components[0]).toBe(div);
    });
    it('should allow pushing to the components array', () => {
      CanvasSharedState.components = [];
      const div1 = document.createElement('div');
      const div2 = document.createElement('div');
      CanvasSharedState.components.push(div1, div2);
      expect(CanvasSharedState.components).toHaveLength(2);
    });
    it('should allow clearing the components array', () => {
      const div = document.createElement('div');
      CanvasSharedState.components = [div];
      CanvasSharedState.components = [];
      expect(CanvasSharedState.components).toHaveLength(0);
    });
    it('should maintain reference integrity when pushing', () => {
      CanvasSharedState.components = [];
      const div = document.createElement('div');
      div.id = 'test-component';
      CanvasSharedState.components.push(div);
      expect(CanvasSharedState.components[0].id).toBe('test-component');
    });
  });
  // ─── editable flag ────────────────────────────────────────────────────────
  describe('editable flag', () => {
    it('should start as null', () => {
      CanvasSharedState.editable = null;
      expect(CanvasSharedState.editable).toBeNull();
    });
    it('should accept true', () => {
      CanvasSharedState.editable = true;
      expect(CanvasSharedState.editable).toBe(true);
    });
    it('should accept false', () => {
      CanvasSharedState.editable = false;
      expect(CanvasSharedState.editable).toBe(false);
    });
  });
  // ─── layoutMode ───────────────────────────────────────────────────────────
  describe('layoutMode', () => {
    it('should accept "grid"', () => {
      CanvasSharedState.layoutMode = 'grid';
      expect(CanvasSharedState.layoutMode).toBe('grid');
    });
    it('should accept "absolute"', () => {
      CanvasSharedState.layoutMode = 'absolute';
      expect(CanvasSharedState.layoutMode).toBe('absolute');
    });
  });
  // ─── lastCanvasWidth ──────────────────────────────────────────────────────
  describe('lastCanvasWidth', () => {
    it('should start as null', () => {
      CanvasSharedState.lastCanvasWidth = null;
      expect(CanvasSharedState.lastCanvasWidth).toBeNull();
    });
    it('should store a numeric width', () => {
      CanvasSharedState.lastCanvasWidth = 1024;
      expect(CanvasSharedState.lastCanvasWidth).toBe(1024);
    });
    it('should be updatable', () => {
      CanvasSharedState.lastCanvasWidth = 800;
      expect(CanvasSharedState.lastCanvasWidth).toBe(800);
      CanvasSharedState.lastCanvasWidth = 1200;
      expect(CanvasSharedState.lastCanvasWidth).toBe(1200);
    });
  });
  // ─── attribute configs ────────────────────────────────────────────────────
  describe('attribute config properties', () => {
    it('should store tableAttributeConfig', () => {
      const config = [
        {
          id: '1',
          key: 'col',
          title: 'Col',
          type: 'Input',
          value: '',
          execute_order: 1,
        },
      ];
      CanvasSharedState.tableAttributeConfig = config;
      expect(CanvasSharedState.tableAttributeConfig).toEqual(config);
    });
    it('should store textAttributeConfig', () => {
      const config = [
        {
          id: '2',
          key: 'txt',
          title: 'Txt',
          type: 'Formula',
          value: '',
          execute_order: 1,
        },
      ];
      CanvasSharedState.textAttributeConfig = config;
      expect(CanvasSharedState.textAttributeConfig).toEqual(config);
    });
    it('should store headerAttributeConfig', () => {
      const config = [
        {
          id: '3',
          key: 'hdr',
          title: 'Hdr',
          type: 'Constant',
          value: 'Hello',
          execute_order: 1,
        },
      ];
      CanvasSharedState.headerAttributeConfig = config;
      expect(CanvasSharedState.headerAttributeConfig).toEqual(config);
    });
    it('should store ImageAttributeConfig as a function', () => {
      const fn = jest.fn();
      CanvasSharedState.ImageAttributeConfig = fn;
      expect(CanvasSharedState.ImageAttributeConfig).toBe(fn);
    });
    it('should allow undefined for attribute configs', () => {
      CanvasSharedState.tableAttributeConfig = undefined;
      expect(CanvasSharedState.tableAttributeConfig).toBeUndefined();
    });
  });
});
