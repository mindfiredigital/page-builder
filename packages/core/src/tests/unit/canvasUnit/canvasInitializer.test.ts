import { CanvasInitializer } from '../../../canvas/CanvasCore/CanvasInitializer';
import { CanvasSharedState } from '../../../canvas/CanvasCore/CanvasSharedState';
import { CanvasStateManager } from '../../../canvas/CanvasCore/CanvasStateManager';
import { CanvasEventDispatcher } from '../../../canvas/CanvasCore/CanvasEventDispatcher';
import { JSONStorage } from '../../../services/JSONStorage';

// 1. Mock JSONStorage before any tests
jest.mock('../../../services/JSONStorage');

jest.mock('../../../canvas/CanvasCore/CanvasSharedState', () => ({
  CanvasSharedState: {
    canvasElement: null,
    sidebarElement: null,
    historyManager: null,
    jsonStorage: null, // Initialized during init()
    controlsManager: null,
    gridManager: { initializeDropPreview: jest.fn() },
    editable: true,
    layoutMode: 'absolute',
  },
}));

jest.mock('../../../canvas/CanvasCore/CanvasStateManager', () => ({
  CanvasStateManager: { restoreState: jest.fn() },
}));

jest.mock('../../../canvas/CanvasCore/CanvasEventDispatcher', () => ({
  CanvasEventDispatcher: {
    attachTableDesignListener: jest.fn(),
    attachDropListeners: jest.fn(),
    attachClickListeners: jest.fn(),
  },
}));

jest.mock('../../../canvas/GridManager', () => ({
  GridManager: jest.fn().mockImplementation(() => ({
    initializeDropPreview: jest.fn(),
  })),
}));

describe('CanvasInitializer', () => {
  let mockCanvas: HTMLElement;
  let mockSidebar: HTMLElement;

  const mockConfigs = [
    { name: 'table', attributes: { border: 1 } },
    { name: 'text', attributes: { color: 'red' } },
    { name: 'image', globalExecuteFunction: jest.fn() },
  ] as any;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup DOM
    document.body.innerHTML = `
      <div id="canvas"></div>
      <div id="sidebar"></div>
    `;
    mockCanvas = document.getElementById('canvas')!;
    mockSidebar = document.getElementById('sidebar')!;

    // Reset shared state properties manually if needed
    CanvasSharedState.canvasElement = mockCanvas;
    CanvasSharedState.sidebarElement = mockSidebar;
  });

  it('should initialize shared state with provided arguments', () => {
    CanvasInitializer.init(null, true, mockConfigs, 'grid');

    expect(CanvasSharedState.editable).toBe(true);
    expect(CanvasSharedState.layoutMode).toBe('grid');
  });

  it('should apply printable class only in absolute layout mode', () => {
    CanvasInitializer.init(null, true, [], 'absolute');
    expect(mockCanvas.classList.contains('preview-printable')).toBe(true);

    CanvasInitializer.init(null, true, [], 'grid');
    expect(mockCanvas.classList.contains('preview-printable')).toBe(false);
  });

  it('should wire up global event listeners via EventDispatcher', () => {
    CanvasInitializer.init(null, true, [], 'absolute');

    expect(CanvasEventDispatcher.attachTableDesignListener).toHaveBeenCalled();
    expect(CanvasEventDispatcher.attachDropListeners).toHaveBeenCalled();
    expect(CanvasEventDispatcher.attachClickListeners).toHaveBeenCalled();
  });

  describe('State Restoration Logic', () => {
    it('should restore state from initialData if provided', () => {
      const fakeData = { version: '1.0', components: [] } as any;
      CanvasInitializer.init(fakeData, true, [], 'absolute');

      expect(CanvasStateManager.restoreState).toHaveBeenCalledWith(fakeData);
    });

    it('should fall back to localStorage if initialData is null', () => {
      const savedData = {
        version: '1.0',
        components: [{ id: 'saved' }],
      } as any;

      // Setup the mock to return data when load is called
      const mockLoad = jest.fn().mockReturnValue(savedData);
      (JSONStorage as jest.Mock).mockImplementation(() => ({
        load: mockLoad,
      }));

      CanvasInitializer.init(null, true, [], 'absolute');

      expect(mockLoad).toHaveBeenCalled();
      expect(CanvasStateManager.restoreState).toHaveBeenCalledWith(savedData);
    });

    it('should not restore state if both initialData and localStorage are empty', () => {
      const mockLoad = jest.fn().mockReturnValue(null);
      (JSONStorage as jest.Mock).mockImplementation(() => ({
        load: mockLoad,
      }));

      CanvasInitializer.init(null, true, [], 'absolute');

      // It should NOT call restoreState with null
      expect(CanvasStateManager.restoreState).not.toHaveBeenCalledWith(null);
    });
  });

  it('should initialize services and managers', () => {
    CanvasInitializer.init(null, true, [], 'absolute');

    expect(CanvasSharedState.historyManager).toBeDefined();
    expect(CanvasSharedState.jsonStorage).toBeDefined();
    expect(CanvasSharedState.gridManager).toBeDefined();
    expect(
      CanvasSharedState.gridManager.initializeDropPreview
    ).toHaveBeenCalledWith(mockCanvas);
  });
});
