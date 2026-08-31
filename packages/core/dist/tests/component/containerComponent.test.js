// ── Mocks must be declared BEFORE imports so jest.mock hoisting works ────────
// jest.mock() is hoisted above const declarations, so mock functions must live
// inside the factory — never reference outer const variables from inside a factory.
jest.mock('../../canvas/Canvas', () => ({
    Canvas: {
        layoutMode: 'absolute',
        historyManager: { captureState: jest.fn() },
        createComponent: jest.fn(),
        generateUniqueClass: jest.fn((prefix) => `${prefix}-uid`),
        addDraggableListeners: jest.fn(),
        controlsManager: { addControlButtons: jest.fn() },
        dispatchDesignChange: jest.fn(),
    },
}));
jest.mock('../../components/ImageComponent', () => ({
    ImageComponent: {
        restoreImageUpload: jest.fn(),
    },
}));
import { ContainerComponent } from '../../components/ContainerComponent.js';
import { ContainerResizeHandler } from '../../components/ContainerCore/index.js';
import { injectResizerStyles } from '../../components/ContainerCore/index.js';
import { initContainerEventListeners } from '../../components/ContainerCore/index.js';
import { restoreContainer, restoreResizer, } from '../../components/ContainerCore/index.js';
import { handleContainerDrop } from '../../components/ContainerCore/index.js';
import { Canvas } from '../../canvas/Canvas.js';
import { ImageComponent } from '../../components/ImageComponent.js';
// ── Typed aliases for the mocked functions (resolved after import) ────────────
const mockCaptureState = Canvas.historyManager.captureState;
const mockCreateComponent = Canvas.createComponent;
const mockAddDraggableListeners = Canvas.addDraggableListeners;
const mockAddControlButtons = Canvas.controlsManager
    .addControlButtons;
// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function makeContainerEl() {
    const el = document.createElement('div');
    el.classList.add('container-component');
    const resizers = document.createElement('div');
    resizers.classList.add('resizers');
    el.appendChild(resizers);
    return el;
}
function makeEditableChild(classList = []) {
    const child = document.createElement('div');
    child.classList.add('editable-component', ...classList);
    const label = document.createElement('span');
    label.className = 'component-label';
    label.style.display = 'none';
    child.appendChild(label);
    return child;
}
// ─────────────────────────────────────────────────────────────────────────────
// ContainerComponent (class)
// ─────────────────────────────────────────────────────────────────────────────
describe('ContainerComponent', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        jest.clearAllMocks();
        Canvas.layoutMode = 'absolute';
    });
    describe('create()', () => {
        it('should return an element with class "container-component"', () => {
            const comp = new ContainerComponent();
            const el = comp.create();
            expect(el.classList.contains('container-component')).toBe(true);
        });
        it('should return an HTMLElement', () => {
            const comp = new ContainerComponent();
            expect(comp.create()).toBeInstanceOf(HTMLElement);
        });
        it('should contain a .resizers child in absolute mode', () => {
            Canvas.layoutMode = 'absolute';
            const comp = new ContainerComponent();
            const el = comp.create();
            expect(el.querySelector('.resizers')).not.toBeNull();
        });
        it('should inject resizer styles into document head', () => {
            new ContainerComponent();
            const styles = document.head.querySelectorAll('style');
            expect(styles.length).toBeGreaterThan(0);
        });
        it('should add resize handles in absolute mode', () => {
            Canvas.layoutMode = 'absolute';
            const comp = new ContainerComponent();
            const el = comp.create();
            const resizers = el.querySelectorAll('.resizer');
            expect(resizers.length).toBe(4);
        });
        it('should NOT add resize handles in grid mode', () => {
            Canvas.layoutMode = 'grid';
            const comp = new ContainerComponent();
            const el = comp.create();
            const resizers = el.querySelectorAll('.resizer');
            expect(resizers.length).toBe(0);
        });
    });
    describe('static restoreContainer()', () => {
        it('should call the restoreContainer function without throwing', () => {
            const el = makeContainerEl();
            document.body.appendChild(el);
            expect(() => ContainerComponent.restoreContainer(el, true)).not.toThrow();
        });
    });
});
// ─────────────────────────────────────────────────────────────────────────────
// injectResizerStyles
// ─────────────────────────────────────────────────────────────────────────────
describe('injectResizerStyles', () => {
    beforeEach(() => {
        document.head.innerHTML = '';
    });
    it('should append a <style> tag to document.head', () => {
        injectResizerStyles();
        expect(document.head.querySelector('style')).not.toBeNull();
    });
    it('style content should include .resizer class', () => {
        injectResizerStyles();
        const style = document.head.querySelector('style');
        expect(style.textContent).toContain('.resizer');
    });
    it('style content should include all four corner classes', () => {
        injectResizerStyles();
        const style = document.head.querySelector('style');
        expect(style.textContent).toContain('top-left');
        expect(style.textContent).toContain('top-right');
        expect(style.textContent).toContain('bottom-left');
        expect(style.textContent).toContain('bottom-right');
    });
});
// ─────────────────────────────────────────────────────────────────────────────
// ContainerResizeHandler
// ─────────────────────────────────────────────────────────────────────────────
describe('ContainerResizeHandler', () => {
    let element;
    let resizersEl;
    let handler;
    beforeEach(() => {
        element = document.createElement('div');
        element.style.width = '200px';
        element.style.height = '200px';
        resizersEl = document.createElement('div');
        element.appendChild(resizersEl);
        document.body.appendChild(element);
        handler = new ContainerResizeHandler(element, resizersEl);
        jest.clearAllMocks();
    });
    afterEach(() => {
        document.body.innerHTML = '';
    });
    it('addResizeHandles() should add 4 resizer elements', () => {
        handler.addResizeHandles();
        expect(resizersEl.querySelectorAll('.resizer').length).toBe(4);
    });
    it('should add top-left, top-right, bottom-left, bottom-right handles', () => {
        handler.addResizeHandles();
        expect(resizersEl.querySelector('.top-left')).not.toBeNull();
        expect(resizersEl.querySelector('.top-right')).not.toBeNull();
        expect(resizersEl.querySelector('.bottom-left')).not.toBeNull();
        expect(resizersEl.querySelector('.bottom-right')).not.toBeNull();
    });
    it('mousedown on a resizer should register global mousemove listener', () => {
        handler.addResizeHandles();
        const addSpy = jest.spyOn(window, 'addEventListener');
        const resizer = resizersEl.querySelector('.bottom-right');
        resizer.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        expect(addSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
    });
    it('mouseup after resize should call Canvas.historyManager.captureState', () => {
        handler.addResizeHandles();
        const resizer = resizersEl.querySelector('.bottom-right');
        resizer.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        window.dispatchEvent(new MouseEvent('mouseup'));
        expect(mockCaptureState).toHaveBeenCalled();
    });
    it('mouseup should remove global mousemove listener', () => {
        handler.addResizeHandles();
        const removeSpy = jest.spyOn(window, 'removeEventListener');
        const resizer = resizersEl.querySelector('.bottom-right');
        resizer.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        window.dispatchEvent(new MouseEvent('mouseup'));
        expect(removeSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
    });
});
// ─────────────────────────────────────────────────────────────────────────────
// initContainerEventListeners
// ─────────────────────────────────────────────────────────────────────────────
describe('initContainerEventListeners', () => {
    let element;
    beforeEach(() => {
        element = document.createElement('div');
        element.classList.add('container-component');
        document.body.appendChild(element);
        initContainerEventListeners(element);
    });
    afterEach(() => {
        document.body.innerHTML = '';
    });
    it('dragover should call preventDefault', () => {
        const event = new Event('dragover', { cancelable: true });
        const preventSpy = jest.spyOn(event, 'preventDefault');
        element.dispatchEvent(event);
        expect(preventSpy).toHaveBeenCalled();
    });
    it('mouseover on element itself should add container-highlight', () => {
        const event = new MouseEvent('mouseover', { bubbles: true });
        Object.defineProperty(event, 'target', { value: element });
        element.dispatchEvent(event);
        expect(element.classList.contains('container-highlight')).toBe(true);
    });
    it('mouseleave should remove container-highlight', () => {
        element.classList.add('container-highlight');
        const event = new MouseEvent('mouseleave', { bubbles: true });
        Object.defineProperty(event, 'target', { value: element });
        element.dispatchEvent(event);
        expect(element.classList.contains('container-highlight')).toBe(false);
    });
});
// ─────────────────────────────────────────────────────────────────────────────
// handleContainerDrop
// ─────────────────────────────────────────────────────────────────────────────
describe('handleContainerDrop', () => {
    let container;
    beforeEach(() => {
        document.body.innerHTML = '';
        jest.clearAllMocks();
        Canvas.layoutMode = 'absolute';
        container = document.createElement('div');
        container.classList.add('container-component', 'editable-component', 'container-uid');
        document.body.appendChild(container);
    });
    function makeDragEvent(componentType) {
        const event = new DragEvent('drop', { bubbles: true, cancelable: true });
        Object.defineProperty(event, 'dataTransfer', {
            value: {
                getData: jest.fn((key) => key === 'component-type' ? componentType : ''),
            },
        });
        Object.defineProperty(event, 'offsetX', { value: 50 });
        Object.defineProperty(event, 'offsetY', { value: 50 });
        return event;
    }
    it('should do nothing if no component-type in dataTransfer', () => {
        const event = new DragEvent('drop', { bubbles: true, cancelable: true });
        Object.defineProperty(event, 'dataTransfer', {
            value: { getData: jest.fn(() => '') },
        });
        handleContainerDrop(container, event);
        expect(mockCreateComponent).not.toHaveBeenCalled();
    });
    it('should call Canvas.createComponent with the component type', () => {
        const mockEl = document.createElement('div');
        mockCreateComponent.mockReturnValue(mockEl);
        handleContainerDrop(container, makeDragEvent('button'));
        expect(mockCreateComponent).toHaveBeenCalledWith('button');
    });
    it('should do nothing if createComponent returns null', () => {
        mockCreateComponent.mockReturnValue(null);
        handleContainerDrop(container, makeDragEvent('button'));
        expect(mockAddDraggableListeners).not.toHaveBeenCalled();
    });
    it('should append component to container in absolute mode', () => {
        const mockEl = document.createElement('div');
        mockCreateComponent.mockReturnValue(mockEl);
        handleContainerDrop(container, makeDragEvent('button'));
        expect(container.contains(mockEl)).toBe(true);
    });
    it('should set position absolute and offset in absolute mode', () => {
        const mockEl = document.createElement('div');
        mockCreateComponent.mockReturnValue(mockEl);
        handleContainerDrop(container, makeDragEvent('button'));
        expect(mockEl.style.position).toBe('absolute');
    });
    it('should call addDraggableListeners in absolute mode', () => {
        const mockEl = document.createElement('div');
        mockCreateComponent.mockReturnValue(mockEl);
        handleContainerDrop(container, makeDragEvent('button'));
        expect(mockAddDraggableListeners).toHaveBeenCalledWith(mockEl);
    });
    it('should add container-grid-active class in grid mode', () => {
        Canvas.layoutMode = 'grid';
        const mockEl = document.createElement('div');
        mockCreateComponent.mockReturnValue(mockEl);
        handleContainerDrop(container, makeDragEvent('button'));
        expect(container.classList.contains('container-grid-active')).toBe(true);
    });
    it('should call Canvas.historyManager.captureState after drop', () => {
        const mockEl = document.createElement('div');
        mockCreateComponent.mockReturnValue(mockEl);
        handleContainerDrop(container, makeDragEvent('button'));
        expect(mockCaptureState).toHaveBeenCalled();
    });
    it('should add a .component-label span to dropped component', () => {
        const mockEl = document.createElement('div');
        mockCreateComponent.mockReturnValue(mockEl);
        handleContainerDrop(container, makeDragEvent('button'));
        expect(mockEl.querySelector('.component-label')).not.toBeNull();
    });
});
// ─────────────────────────────────────────────────────────────────────────────
// restoreResizer
// ─────────────────────────────────────────────────────────────────────────────
describe('restoreResizer', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        Canvas.layoutMode = 'absolute';
    });
    it('should remove old .resizers and create a new one', () => {
        const el = makeContainerEl();
        document.body.appendChild(el);
        restoreResizer(el);
        expect(el.querySelectorAll('.resizers').length).toBe(1);
    });
    it('should add 4 resizer handles to the new resizers div', () => {
        const el = makeContainerEl();
        document.body.appendChild(el);
        restoreResizer(el);
        expect(el.querySelectorAll('.resizer').length).toBe(4);
    });
});
// ─────────────────────────────────────────────────────────────────────────────
// restoreContainer
// ─────────────────────────────────────────────────────────────────────────────
describe('restoreContainer', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        jest.clearAllMocks();
        Canvas.layoutMode = 'absolute';
    });
    it('should add control buttons to editable children when editable=true', () => {
        const el = makeContainerEl();
        el.appendChild(makeEditableChild());
        document.body.appendChild(el);
        restoreContainer(el, true);
        expect(mockAddControlButtons).toHaveBeenCalled();
    });
    it('should call addDraggableListeners in absolute mode', () => {
        const el = makeContainerEl();
        el.appendChild(makeEditableChild());
        document.body.appendChild(el);
        restoreContainer(el, true);
        expect(mockAddDraggableListeners).toHaveBeenCalled();
    });
    it('should remove contenteditable from children when editable=false', () => {
        const el = makeContainerEl();
        const child = makeEditableChild();
        const editableSpan = document.createElement('span');
        editableSpan.setAttribute('contenteditable', 'true');
        child.appendChild(editableSpan);
        el.appendChild(child);
        document.body.appendChild(el);
        restoreContainer(el, false);
        expect(editableSpan.getAttribute('contenteditable')).toBeNull();
    });
    it('should remove editable-component class from children when editable=false', () => {
        const el = makeContainerEl();
        const child = makeEditableChild();
        el.appendChild(child);
        document.body.appendChild(el);
        restoreContainer(el, false);
        expect(child.classList.contains('editable-component')).toBe(false);
    });
    it('should remove resizers when editable=false', () => {
        const el = makeContainerEl();
        document.body.appendChild(el);
        restoreContainer(el, false);
        expect(el.querySelector('.resizers')).toBeNull();
    });
    it('should call ImageComponent.restoreImageUpload for image-component children', () => {
        const el = makeContainerEl();
        const child = makeEditableChild(['image-component']);
        const img = document.createElement('img');
        img.src = 'http://example.com/img.png';
        child.appendChild(img);
        el.appendChild(child);
        document.body.appendChild(el);
        restoreContainer(el, true);
        expect(ImageComponent.restoreImageUpload).toHaveBeenCalled();
    });
    it('should show label on mouseenter for editable children', () => {
        const el = makeContainerEl();
        const child = makeEditableChild();
        el.appendChild(child);
        document.body.appendChild(el);
        restoreContainer(el, true);
        const label = child.querySelector('.component-label');
        child.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
        expect(label.style.display).toBe('block');
    });
    it('should hide label on mouseleave for editable children', () => {
        const el = makeContainerEl();
        const child = makeEditableChild();
        el.appendChild(child);
        document.body.appendChild(el);
        restoreContainer(el, true);
        const label = child.querySelector('.component-label');
        child.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
        child.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
        expect(label.style.display).toBe('none');
    });
    it('should NOT add control buttons when editable=false', () => {
        const el = makeContainerEl();
        el.appendChild(makeEditableChild());
        document.body.appendChild(el);
        restoreContainer(el, false);
        expect(mockAddControlButtons).not.toHaveBeenCalled();
    });
    it('in grid mode should remove position/draggable from children', () => {
        Canvas.layoutMode = 'grid';
        const el = makeContainerEl();
        const child = makeEditableChild();
        child.setAttribute('draggable', 'true');
        child.style.position = 'absolute';
        el.appendChild(child);
        document.body.appendChild(el);
        restoreContainer(el, true);
        expect(child.style.position).toBe('');
        expect(child.getAttribute('draggable')).toBeNull();
    });
});
