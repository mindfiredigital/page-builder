/**
 * GridManager.test.ts
 * Unit tests for grid-snapping and drop-preview logic.
 */
import { GridManager } from '../../../canvas/GridManager.js';
function makeCanvas(width = 800, height = 600) {
  const el = document.createElement('div');
  Object.defineProperty(el, 'getBoundingClientRect', {
    value: () => ({
      left: 0,
      top: 0,
      right: width,
      bottom: height,
      width,
      height,
    }),
    configurable: true,
  });
  Object.defineProperty(el, 'scrollLeft', { value: 0, writable: true });
  Object.defineProperty(el, 'scrollTop', { value: 0, writable: true });
  document.body.appendChild(el);
  return el;
}
describe('GridManager', () => {
  let manager;
  let canvas;
  beforeEach(() => {
    manager = new GridManager(20);
    canvas = makeCanvas();
  });
  afterEach(() => {
    document.body.innerHTML = '';
  });
  describe('constructor', () => {
    it('should default cellSize to 20', () => {
      const m = new GridManager();
      expect(m.getCellSize()).toBe(20);
    });
    it('should accept a custom cell size', () => {
      const m = new GridManager(40);
      expect(m.getCellSize()).toBe(40);
    });
  });
  describe('getCellSize()', () => {
    it('should return the configured cell size', () => {
      expect(manager.getCellSize()).toBe(20);
    });
  });
  describe('mousePositionAtGridCorner()', () => {
    function makeEvent(clientX, clientY) {
      return { clientX, clientY };
    }
    it('should return an object with gridX and gridY', () => {
      const result = manager.mousePositionAtGridCorner(
        makeEvent(100, 100),
        canvas
      );
      expect(result).toHaveProperty('gridX');
      expect(result).toHaveProperty('gridY');
    });
    it('should snap to nearest 10px grid', () => {
      // clientX=105, nearest 10px is 110; minus padding(20) = 90
      const result = manager.mousePositionAtGridCorner(
        makeEvent(105, 55),
        canvas
      );
      expect(result.gridX % 10).toBe(0);
      expect(result.gridY % 10).toBe(0);
    });
    it('should enforce a minimum padding of 20', () => {
      const result = manager.mousePositionAtGridCorner(makeEvent(0, 0), canvas);
      expect(result.gridX).toBeGreaterThanOrEqual(20);
      expect(result.gridY).toBeGreaterThanOrEqual(20);
    });
    it('should clamp to minimum 20 when mouse is near origin', () => {
      const result = manager.mousePositionAtGridCorner(makeEvent(5, 5), canvas);
      expect(result.gridX).toBe(20);
      expect(result.gridY).toBe(20);
    });
  });
  describe('initializeDropPreview()', () => {
    it('should append a .drop-preview element to the canvas', () => {
      manager.initializeDropPreview(canvas);
      const preview = canvas.querySelector('.drop-preview');
      expect(preview).not.toBeNull();
    });
    it('should remove existing .drop-preview before creating a new one', () => {
      const existing = document.createElement('div');
      existing.className = 'drop-preview';
      canvas.appendChild(existing);
      manager.initializeDropPreview(canvas);
      const previews = canvas.querySelectorAll('.drop-preview');
      expect(previews.length).toBe(1);
    });
    it('should add "dragover" listener on the canvas', () => {
      const spy = jest.spyOn(canvas, 'addEventListener');
      manager.initializeDropPreview(canvas);
      const events = spy.mock.calls.map(([e]) => e);
      expect(events).toContain('dragover');
    });
    it('should add "dragleave" listener on the canvas', () => {
      const spy = jest.spyOn(canvas, 'addEventListener');
      manager.initializeDropPreview(canvas);
      const events = spy.mock.calls.map(([e]) => e);
      expect(events).toContain('dragleave');
    });
    it('should hide preview on dragleave', () => {
      manager.initializeDropPreview(canvas);
      const preview = canvas.querySelector('.drop-preview');
      preview.classList.add('visible');
      canvas.dispatchEvent(new DragEvent('dragleave', { bubbles: false }));
      expect(preview.classList.contains('visible')).toBe(false);
    });
  });
  describe('showGridCornerHighlight()', () => {
    it('should add "visible" class to the drop preview', () => {
      const preview = document.createElement('div');
      preview.className = 'drop-preview';
      canvas.appendChild(preview);
      const event = { clientX: 200, clientY: 200 };
      manager.showGridCornerHighlight(event, preview, canvas);
      expect(preview.classList.contains('visible')).toBe(true);
    });
    it('should set left/top/width/height on the preview', () => {
      const preview = document.createElement('div');
      canvas.appendChild(preview);
      const event = { clientX: 200, clientY: 150 };
      manager.showGridCornerHighlight(event, preview, canvas);
      expect(preview.style.left).toBeTruthy();
      expect(preview.style.top).toBeTruthy();
      expect(preview.style.width).toBe('20px');
      expect(preview.style.height).toBe('20px');
    });
  });
});
