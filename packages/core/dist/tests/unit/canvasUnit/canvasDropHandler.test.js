import { CanvasDropHandler } from '../../../canvas/CanvasCore/CanvasDropHandler.js';
import { CanvasSharedState } from '../../../canvas/CanvasCore/CanvasSharedState.js';
import { CanvasComponentFactory } from '../../../canvas/CanvasCore/CanvasComponentFactory.js';
import { CanvasEventDispatcher } from '../../../canvas/CanvasCore/CanvasEventDispatcher.js';
// Mock Dependencies
jest.mock('../../../canvas/CanvasCore/CanvasSharedState', () => ({
    CanvasSharedState: {
        canvasElement: document.createElement('div'),
        layoutMode: 'absolute',
        components: [],
        editable: true,
        historyManager: { captureState: jest.fn() },
        gridManager: {
            mousePositionAtGridCorner: jest
                .fn()
                .mockReturnValue({ gridX: 100, gridY: 100 }),
        },
    },
}));
jest.mock('../../../canvas/CanvasCore/CanvasComponentFactory', () => ({
    CanvasComponentFactory: {
        createComponent: jest.fn(),
        generateUniqueClass: jest.fn().mockReturnValue('mock-id-1'),
    },
}));
jest.mock('../../../canvas/CanvasCore/CanvasEventDispatcher', () => ({
    CanvasEventDispatcher: {
        dispatchDesignChange: jest.fn(),
    },
}));
jest.mock('../../../canvas/CanvasCore/CanvasDragHandler', () => ({
    CanvasDragHandler: {
        addDraggableListeners: jest.fn(),
    },
}));
describe('CanvasDropHandler', () => {
    let mockEvent;
    let mockDataTransfer;
    beforeEach(() => {
        jest.clearAllMocks();
        CanvasSharedState.components = [];
        CanvasSharedState.layoutMode = 'absolute';
        CanvasSharedState.canvasElement = document.createElement('div');
        mockDataTransfer = {
            getData: jest.fn(key => {
                if (key === 'component-type')
                    return 'button';
                return '';
            }),
        };
        mockEvent = {
            preventDefault: jest.fn(),
            target: CanvasSharedState.canvasElement,
            dataTransfer: mockDataTransfer,
            offsetY: 50,
        };
    });
    it('should call preventDefault on every drop', () => {
        CanvasDropHandler.onDrop(mockEvent);
        expect(mockEvent.preventDefault).toHaveBeenCalled();
    });
    it('should create a component if component-type is valid', () => {
        const mockEl = document.createElement('div');
        CanvasComponentFactory.createComponent.mockReturnValue(mockEl);
        CanvasDropHandler.onDrop(mockEvent);
        expect(CanvasComponentFactory.createComponent).toHaveBeenCalledWith('button', '');
        expect(CanvasSharedState.components).toContain(mockEl);
    });
    describe('Absolute Layout Logic', () => {
        it('should set position absolute and snap leaf components to grid', () => {
            const mockEl = document.createElement('div');
            CanvasComponentFactory.createComponent.mockReturnValue(mockEl);
            CanvasDropHandler.onDrop(mockEvent);
            expect(mockEl.style.position).toBe('absolute');
            expect(mockEl.style.left).toBe('100px'); // From gridManager mock
            expect(mockEl.style.top).toBe('100px');
        });
        it('should use raw offsetY for container types instead of grid snapping', () => {
            mockDataTransfer.getData.mockReturnValue('container');
            const mockEl = document.createElement('div');
            CanvasComponentFactory.createComponent.mockReturnValue(mockEl);
            CanvasDropHandler.onDrop(mockEvent);
            expect(mockEl.style.top).toBe('50px'); // From mockEvent.offsetY
        });
    });
    describe('Grid Layout Logic', () => {
        it('should remove absolute positioning and draggable attribute in grid mode', () => {
            CanvasSharedState.layoutMode = 'grid';
            const mockEl = document.createElement('div');
            mockEl.setAttribute('draggable', 'true');
            CanvasComponentFactory.createComponent.mockReturnValue(mockEl);
            CanvasDropHandler.onDrop(mockEvent);
            expect(mockEl.style.position).toBe('');
            expect(mockEl.hasAttribute('draggable')).toBe(false);
        });
    });
    describe('Printable Mode Constraints', () => {
        it('should prevent drop if position is within margins in printable mode', () => {
            CanvasSharedState.canvasElement.classList.add('preview-printable');
            // Mock window.getComputedStyle
            jest.spyOn(window, 'getComputedStyle').mockReturnValue({
                paddingTop: '50px',
                paddingLeft: '50px',
                paddingRight: '50px',
            });
            // Force grid manager to return a position inside the margin (0,0)
            CanvasSharedState.gridManager.mousePositionAtGridCorner.mockReturnValue({
                gridX: 10,
                gridY: 10,
            });
            const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => { });
            CanvasDropHandler.onDrop(mockEvent);
            expect(CanvasComponentFactory.createComponent).not.toHaveBeenCalled();
            expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('margin area'));
            warnSpy.mockRestore();
        });
    });
    it('should capture state and dispatch design change after successful drop', () => {
        CanvasComponentFactory.createComponent.mockReturnValue(document.createElement('div'));
        CanvasDropHandler.onDrop(mockEvent);
        expect(CanvasSharedState.historyManager.captureState).toHaveBeenCalled();
        expect(CanvasEventDispatcher.dispatchDesignChange).toHaveBeenCalled();
    });
});
