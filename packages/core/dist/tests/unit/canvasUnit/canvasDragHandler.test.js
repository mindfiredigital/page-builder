/**
 * CanvasDragHandler.test.ts
 * Unit tests for the drag repositioning handler.
 */
jest.mock('../../../canvas/CanvasCore/CanvasSharedState', () => ({
    CanvasSharedState: {
        canvasElement: null,
        layoutMode: 'absolute',
        historyManager: { captureState: jest.fn() },
    },
}));
jest.mock('../../../canvas/CanvasCore/CanvasEventDispatcher', () => ({
    CanvasEventDispatcher: { dispatchDesignChange: jest.fn() },
}));
import { CanvasDragHandler } from '../../../canvas/CanvasCore/CanvasDragHandler.js';
import { CanvasSharedState } from '../../../canvas/CanvasCore/CanvasSharedState.js';
function makeCanvas() {
    const canvas = document.createElement('div');
    canvas.style.width = '1000px';
    canvas.style.height = '800px';
    Object.defineProperty(canvas, 'scrollLeft', { value: 0, writable: true });
    Object.defineProperty(canvas, 'scrollTop', { value: 0, writable: true });
    Object.defineProperty(canvas, 'scrollWidth', { value: 1000, writable: true });
    Object.defineProperty(canvas, 'scrollHeight', { value: 800, writable: true });
    document.body.appendChild(canvas);
    return canvas;
}
function fireDragEvent(type, element, overrides = {}) {
    const dataTransfer = {
        effectAllowed: '',
        setData: jest.fn(),
        getData: jest.fn(),
    };
    const event = new DragEvent(type, Object.assign({ bubbles: true, cancelable: true, clientX: 100, clientY: 100, dataTransfer }, overrides));
    element.dispatchEvent(event);
    return event;
}
describe('CanvasDragHandler', () => {
    let canvas;
    let element;
    beforeEach(() => {
        canvas = makeCanvas();
        CanvasSharedState.canvasElement = canvas;
        element = document.createElement('div');
        element.style.left = '50px';
        element.style.top = '50px';
        Object.defineProperty(element, 'offsetWidth', {
            value: 100,
            configurable: true,
        });
        Object.defineProperty(element, 'offsetHeight', {
            value: 50,
            configurable: true,
        });
        canvas.appendChild(element);
    });
    afterEach(() => {
        document.body.innerHTML = '';
        jest.clearAllMocks();
    });
    describe('addDraggableListeners()', () => {
        it('should set draggable="true" on the element', () => {
            CanvasDragHandler.addDraggableListeners(element);
            expect(element.getAttribute('draggable')).toBe('true');
        });
        it('should set cursor to "grab"', () => {
            CanvasDragHandler.addDraggableListeners(element);
            expect(element.style.cursor).toBe('grab');
        });
        it('should attach dragstart event listener', () => {
            const spy = jest.spyOn(element, 'addEventListener');
            CanvasDragHandler.addDraggableListeners(element);
            const calls = spy.mock.calls.map(([event]) => event);
            expect(calls).toContain('dragstart');
        });
        it('should attach dragend event listener', () => {
            const spy = jest.spyOn(element, 'addEventListener');
            CanvasDragHandler.addDraggableListeners(element);
            const calls = spy.mock.calls.map(([event]) => event);
            expect(calls).toContain('dragend');
        });
        it('should change cursor to "grabbing" on dragstart', () => {
            CanvasDragHandler.addDraggableListeners(element);
            const dt = {
                effectAllowed: '',
                setData: jest.fn(),
                getData: jest.fn(),
            };
            const event = new DragEvent('dragstart', {
                bubbles: true,
                cancelable: true,
                dataTransfer: dt,
            });
            element.dispatchEvent(event);
            expect(element.style.cursor).toBe('grabbing');
        });
        it('should call historyManager.captureState on dragend', () => {
            CanvasDragHandler.addDraggableListeners(element);
            // Simulate dragstart then dragend
            fireDragEvent('dragstart', element, { clientX: 200, clientY: 200 });
            fireDragEvent('dragend', element, { clientX: 300, clientY: 300 });
            expect(CanvasSharedState.historyManager.captureState).toHaveBeenCalled();
        });
        it('should restore cursor to "grab" after dragend', () => {
            CanvasDragHandler.addDraggableListeners(element);
            fireDragEvent('dragstart', element, { clientX: 100, clientY: 100 });
            fireDragEvent('dragend', element, { clientX: 200, clientY: 200 });
            expect(element.style.cursor).toBe('grab');
        });
    });
    describe('boundary clamping', () => {
        it('should clamp position to canvas scrollWidth on dragend', () => {
            CanvasDragHandler.addDraggableListeners(element);
            fireDragEvent('dragstart', element, { clientX: 0, clientY: 0 });
            // Try to drag beyond canvas right edge
            fireDragEvent('dragend', element, { clientX: 5000, clientY: 5000 });
            const left = parseFloat(element.style.left);
            const top = parseFloat(element.style.top);
            expect(left).toBeLessThanOrEqual(1000);
            expect(top).toBeLessThanOrEqual(800);
        });
        it('should clamp minimum position to 0', () => {
            CanvasDragHandler.addDraggableListeners(element);
            fireDragEvent('dragstart', element, { clientX: 500, clientY: 500 });
            fireDragEvent('dragend', element, { clientX: -500, clientY: -500 });
            const left = parseFloat(element.style.left);
            const top = parseFloat(element.style.top);
            expect(left).toBeGreaterThanOrEqual(0);
            expect(top).toBeGreaterThanOrEqual(0);
        });
    });
});
