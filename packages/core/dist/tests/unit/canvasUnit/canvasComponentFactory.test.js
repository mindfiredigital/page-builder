import { CanvasComponentFactory } from '../../../canvas/CanvasCore/CanvasComponentFactory.js';
import { CanvasSharedState } from '../../../canvas/CanvasCore/CanvasSharedState.js';
import { CanvasEventDispatcher } from '../../../canvas/CanvasCore/CanvasEventDispatcher.js';
// Mock Dependencies
jest.mock('../../../canvas/CanvasCore/CanvasSharedState', () => ({
    CanvasSharedState: {
        components: [],
        canvasElement: document.createElement('div'),
        editable: true,
        layoutMode: 'absolute',
        historyManager: { captureState: jest.fn() },
        controlsManager: { addControlButtons: jest.fn() },
        headerAttributeConfig: {},
        ImageAttributeConfig: {},
        tableAttributeConfig: {},
        textAttributeConfig: {},
    },
}));
jest.mock('../../../canvas/CanvasCore/CanvasEventDispatcher', () => ({
    CanvasEventDispatcher: {
        dispatchDesignChange: jest.fn(),
    },
}));
// Mock individual components to return a basic HTMLElement
jest.mock('../../../components', () => ({
    ButtonComponent: jest.fn().mockImplementation(() => ({
        create: () => document.createElement('button'),
    })),
    HeaderComponent: jest
        .fn()
        .mockImplementation(() => ({ create: () => document.createElement('h1') })),
    ImageComponent: jest.fn().mockImplementation(() => ({
        create: () => document.createElement('div'),
    })),
    VideoComponent: jest.fn().mockImplementation(() => ({
        create: () => document.createElement('div'),
    })),
    TableComponent: jest.fn().mockImplementation(() => ({
        create: () => document.createElement('table'),
    })),
    TextComponent: jest.fn().mockImplementation(() => ({
        create: () => document.createElement('div'),
    })),
    ContainerComponent: jest.fn().mockImplementation(() => ({
        create: () => document.createElement('div'),
    })),
    TwoColumnContainer: jest.fn().mockImplementation(() => ({
        create: () => document.createElement('div'),
    })),
    ThreeColumnContainer: jest.fn().mockImplementation(() => ({
        create: () => document.createElement('div'),
    })),
    LinkComponent: jest
        .fn()
        .mockImplementation(() => ({ create: () => document.createElement('a') })),
}));
describe('CanvasComponentFactory', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        CanvasSharedState.components = [];
        jest.clearAllMocks();
    });
    describe('createComponent()', () => {
        it('should create a built-in component (button)', () => {
            const element = CanvasComponentFactory.createComponent('button');
            expect(element).not.toBeNull();
            expect(element === null || element === void 0 ? void 0 : element.id).toContain('button');
            expect(element === null || element === void 0 ? void 0 : element.classList.contains('editable-component')).toBe(true);
        });
        it('should return null for an unknown component type', () => {
            const element = CanvasComponentFactory.createComponent('non-existent');
            expect(element).toBeNull();
        });
        it('should set contenteditable="true" for standard components', () => {
            const element = CanvasComponentFactory.createComponent('button');
            expect(element === null || element === void 0 ? void 0 : element.getAttribute('contenteditable')).toBe('true');
        });
        it('should set contenteditable="false" for image components', () => {
            const element = CanvasComponentFactory.createComponent('image');
            expect(element === null || element === void 0 ? void 0 : element.getAttribute('contenteditable')).toBe('false');
        });
        it('should attach control buttons if editable is true', () => {
            CanvasComponentFactory.createComponent('button');
            expect(CanvasSharedState.controlsManager.addControlButtons).toHaveBeenCalled();
        });
        it('should not add editable classes if editable is false', () => {
            CanvasSharedState.editable = false;
            const element = CanvasComponentFactory.createComponent('button');
            expect(element === null || element === void 0 ? void 0 : element.classList.contains('editable-component')).toBe(false);
            CanvasSharedState.editable = true; // reset
        });
        it('should append a component-label span to the element', () => {
            const element = CanvasComponentFactory.createComponent('text');
            const label = element === null || element === void 0 ? void 0 : element.querySelector('.component-label');
            expect(label).not.toBeNull();
            expect(label === null || label === void 0 ? void 0 : label.textContent).toContain('text');
        });
        it('should handle custom web-components using data-tag-name', () => {
            // Setup custom tag in DOM
            const mockMeta = document.createElement('div');
            mockMeta.setAttribute('data-component', 'myCustom');
            mockMeta.setAttribute('data-tag-name', 'my-custom-element');
            document.body.appendChild(mockMeta);
            const element = CanvasComponentFactory.createComponent('myCustom');
            expect(element === null || element === void 0 ? void 0 : element.tagName.toLowerCase()).toBe('my-custom-element');
            expect(element === null || element === void 0 ? void 0 : element.classList.contains('custom-component')).toBe(true);
        });
    });
    describe('generateUniqueClass()', () => {
        it('should generate "type1" for the first component', () => {
            const id = CanvasComponentFactory.generateUniqueClass('button');
            expect(id).toBe('button1');
        });
        it('should increment the ID based on existing components in shared state', () => {
            const existing = document.createElement('div');
            existing.classList.add('button1');
            CanvasSharedState.components.push(existing);
            const id = CanvasComponentFactory.generateUniqueClass('button');
            expect(id).toBe('button2');
        });
        it('should find the maximum number even if IDs are out of order', () => {
            const b1 = document.createElement('div');
            b1.classList.add('button1');
            const b5 = document.createElement('div');
            b5.classList.add('button5');
            CanvasSharedState.components.push(b1, b5);
            const id = CanvasComponentFactory.generateUniqueClass('button');
            expect(id).toBe('button6');
        });
        it('should handle container-scoped unique IDs', () => {
            const container = document.createElement('div');
            container.classList.add('cont1');
            const child = document.createElement('div');
            child.classList.add('cont1-inner1');
            container.appendChild(child);
            CanvasSharedState.components.push(container);
            const id = CanvasComponentFactory.generateUniqueClass('inner', true, 'cont1');
            expect(id).toBe('cont1-inner2');
        });
    });
    describe('Input Listener', () => {
        it('should trigger history capture and design change on input', () => {
            const element = CanvasComponentFactory.createComponent('button');
            element === null || element === void 0 ? void 0 : element.dispatchEvent(new Event('input'));
            expect(CanvasSharedState.historyManager.captureState).toHaveBeenCalled();
            expect(CanvasEventDispatcher.dispatchDesignChange).toHaveBeenCalled();
        });
    });
});
