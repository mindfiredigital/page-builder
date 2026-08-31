/**
 * CanvasEventDispatcher.test.ts
 * Unit tests for the custom-event dispatching and listener wiring.
 */
const mockGetState = jest
    .fn()
    .mockReturnValue([{ id: 'canvas', type: 'canvas', content: '' }]);
jest.mock('../../../canvas/CanvasCore/CanvasStateManager', () => ({
    CanvasStateManager: { getState: mockGetState },
}));
const mockJsonStorage = { save: jest.fn(), load: jest.fn(), remove: jest.fn() };
jest.mock('../../../canvas/CanvasCore/CanvasSharedState', () => ({
    CanvasSharedState: {
        canvasElement: null,
        editable: true,
        jsonStorage: mockJsonStorage,
    },
}));
jest.mock('../../../sidebar/CustomizationSidebar', () => ({
    CustomizationSidebar: {
        showSidebar: jest.fn(),
        hideSidebar: jest.fn(),
    },
}));
import { CanvasEventDispatcher } from '../../../canvas/CanvasCore/CanvasEventDispatcher.js';
import { CanvasSharedState } from '../../../canvas/CanvasCore/CanvasSharedState.js';
describe('CanvasEventDispatcher', () => {
    document.body.innerHTML = `
    <div id="canvas"></div>
    <div id="customization-sidebar"></div>
  `;
    let canvas;
    beforeEach(() => {
        canvas = document.createElement('div');
        canvas.id = 'canvas';
        document.body.appendChild(canvas);
        CanvasSharedState.canvasElement = canvas;
        CanvasSharedState.editable = true;
        jest.clearAllMocks();
    });
    afterEach(() => {
        document.body.innerHTML = '';
    });
    describe('dispatchDesignChange()', () => {
        it('should dispatch a "design-change" custom event on the canvas element', () => {
            const listener = jest.fn();
            canvas.addEventListener('design-change', listener);
            CanvasEventDispatcher.dispatchDesignChange();
            expect(listener).toHaveBeenCalledTimes(1);
        });
        it('should include the current design in event.detail', () => {
            const fakeDesign = [{ id: 'canvas', type: 'canvas', content: '' }];
            mockGetState.mockReturnValueOnce(fakeDesign);
            let receivedDetail;
            canvas.addEventListener('design-change', (e) => {
                receivedDetail = e.detail;
            });
            CanvasEventDispatcher.dispatchDesignChange();
            expect(receivedDetail).toEqual(fakeDesign);
        });
        it('should call jsonStorage.save with the current design', () => {
            const fakeDesign = [{ id: 'canvas', type: 'canvas', content: '' }];
            mockGetState.mockReturnValueOnce(fakeDesign);
            CanvasEventDispatcher.dispatchDesignChange();
            expect(mockJsonStorage.save).toHaveBeenCalledWith(fakeDesign);
        });
        it('should NOT dispatch when editable is false', () => {
            CanvasSharedState.editable = false;
            const listener = jest.fn();
            canvas.addEventListener('design-change', listener);
            CanvasEventDispatcher.dispatchDesignChange();
            expect(listener).not.toHaveBeenCalled();
        });
        it('should NOT call jsonStorage.save when editable is false', () => {
            CanvasSharedState.editable = false;
            CanvasEventDispatcher.dispatchDesignChange();
            expect(mockJsonStorage.save).not.toHaveBeenCalled();
        });
        it('should NOT dispatch when canvasElement is falsy', () => {
            CanvasSharedState.canvasElement = null;
            const listener = jest.fn();
            // Should not throw
            expect(() => CanvasEventDispatcher.dispatchDesignChange()).not.toThrow();
            expect(listener).not.toHaveBeenCalled();
        });
        it('should dispatch with bubbles:true', () => {
            let bubbled = false;
            document.addEventListener('design-change', () => {
                bubbled = true;
            }, { once: true });
            CanvasEventDispatcher.dispatchDesignChange();
            expect(bubbled).toBe(true);
        });
    });
    describe('attachTableDesignListener()', () => {
        it('should register a window listener for "table-design-change"', () => {
            const spy = jest.spyOn(window, 'addEventListener');
            CanvasEventDispatcher.attachTableDesignListener();
            expect(spy).toHaveBeenCalledWith('table-design-change', expect.any(Function));
        });
    });
    describe('attachDropListeners()', () => {
        it('should register a "drop" listener on the canvas', () => {
            const onDrop = jest.fn();
            const spy = jest.spyOn(canvas, 'addEventListener');
            CanvasEventDispatcher.attachDropListeners(onDrop);
            const calls = spy.mock.calls.map(([event]) => event);
            expect(calls).toContain('drop');
        });
        it('should register a "dragover" listener on the canvas', () => {
            const onDrop = jest.fn();
            const spy = jest.spyOn(canvas, 'addEventListener');
            CanvasEventDispatcher.attachDropListeners(onDrop);
            const calls = spy.mock.calls.map(([event]) => event);
            expect(calls).toContain('dragover');
        });
        it('should call the onDrop callback when a drop event fires', () => {
            const onDrop = jest.fn();
            CanvasEventDispatcher.attachDropListeners(onDrop);
            const dt = { getData: jest.fn().mockReturnValue('') };
            const dropEvent = new DragEvent('drop', {
                bubbles: true,
                dataTransfer: dt,
            });
            canvas.dispatchEvent(dropEvent);
            expect(onDrop).toHaveBeenCalledTimes(1);
        });
    });
    describe('attachClickListeners()', () => {
        it('should register a "click" listener on the canvas', () => {
            const onSelect = jest.fn();
            const spy = jest.spyOn(canvas, 'addEventListener');
            CanvasEventDispatcher.attachClickListeners(onSelect);
            const calls = spy.mock.calls.map(([event]) => event);
            expect(calls.filter(e => e === 'click').length).toBeGreaterThan(0);
        });
        it('should call onSelectElement when a child is clicked', () => {
            const onSelect = jest.fn();
            CanvasEventDispatcher.attachClickListeners(onSelect);
            const child = document.createElement('button');
            child.id = 'btn1';
            canvas.appendChild(child);
            child.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            expect(onSelect).toHaveBeenCalledWith(child);
        });
        it('should NOT call onSelectElement when the canvas itself is clicked', () => {
            const onSelect = jest.fn();
            CanvasEventDispatcher.attachClickListeners(onSelect);
            canvas.dispatchEvent(new MouseEvent('click', { bubbles: false }));
            expect(onSelect).not.toHaveBeenCalled();
        });
        it('should deselect previously selected component on click', () => {
            const selected = document.createElement('div');
            selected.classList.add('editable-component', 'selected');
            canvas.appendChild(selected);
            CanvasEventDispatcher.attachClickListeners(jest.fn());
            const child = document.createElement('div');
            canvas.appendChild(child);
            child.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            expect(selected.classList.contains('selected')).toBe(false);
        });
    });
});
