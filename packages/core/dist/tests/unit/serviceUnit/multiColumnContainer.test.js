import { MultiColumnContainer } from '../../../services/MultiColumnContainer.js';
import { Canvas } from '../../../canvas/Canvas.js';
import { ImageComponent } from '../../../components/ImageComponent.js';
import { ContainerComponent } from '../../../components/ContainerComponent.js';
// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------
jest.mock('../../../canvas/Canvas', () => ({
    Canvas: {
        createComponent: jest.fn(),
        generateUniqueClass: jest.fn(),
        historyManager: { captureState: jest.fn() },
        controlsManager: { addControlButtons: jest.fn() },
        addDraggableListeners: jest.fn(),
    },
}));
jest.mock('../../../components/ImageComponent', () => ({
    ImageComponent: {
        restoreImageUpload: jest.fn(),
    },
}));
jest.mock('../../../components/ContainerComponent', () => ({
    ContainerComponent: {
        restoreContainer: jest.fn(),
    },
}));
// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
/**
 * Fires a DragEvent on `target` with a given component-type in the
 * dataTransfer payload.  jsdom doesn't support DataTransfer natively so we
 * attach a minimal stub.
 */
function fireDrop(target, componentType) {
    const dt = {
        getData: jest.fn((key) => key === 'component-type' ? componentType : ''),
    };
    const event = new Event('drop', { bubbles: true });
    Object.defineProperty(event, 'dataTransfer', { value: dt });
    Object.defineProperty(event, 'target', { value: target });
    target.dispatchEvent(event);
    return event;
}
// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('MultiColumnContainer', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        document.body.innerHTML = '';
        document.head.innerHTML = '';
    });
    // ── Construction ──────────────────────────────────────────────────────────
    describe('constructor', () => {
        it('creates the root element with the default className', () => {
            const container = new MultiColumnContainer(2);
            const el = container.create();
            expect(el.classList.contains('2Col-component')).toBe(true);
        });
        it('accepts a custom className', () => {
            const container = new MultiColumnContainer(3, 'my-layout');
            expect(container.create().classList.contains('my-layout')).toBe(true);
        });
        it('marks the root element as draggable', () => {
            const el = new MultiColumnContainer(2).create();
            expect(el.getAttribute('draggable')).toBe('true');
        });
        it('creates the correct number of columns for a 2-column layout', () => {
            const el = new MultiColumnContainer(2).create();
            const columns = el.querySelectorAll('.column');
            expect(columns).toHaveLength(2);
        });
        it('creates the correct number of columns for a 3-column layout', () => {
            const el = new MultiColumnContainer(3).create();
            expect(el.querySelectorAll('.column')).toHaveLength(3);
        });
        it('creates the correct number of columns for a 4-column layout', () => {
            const el = new MultiColumnContainer(4).create();
            expect(el.querySelectorAll('.column')).toHaveLength(4);
        });
        it('sets each column width proportionally', () => {
            const el = new MultiColumnContainer(4).create();
            const columns = el.querySelectorAll('.column');
            columns.forEach(col => {
                expect(col.style.width).toBe('25%');
            });
        });
        it('marks every column as draggable', () => {
            const el = new MultiColumnContainer(2).create();
            const columns = el.querySelectorAll('.column');
            columns.forEach(col => {
                expect(col.getAttribute('draggable')).toBe('true');
            });
        });
        it('injects a <style> tag into document.head', () => {
            new MultiColumnContainer(2);
            const styles = document.head.querySelectorAll('style');
            expect(styles.length).toBeGreaterThan(0);
        });
        it('injected style contains the correct class selector', () => {
            new MultiColumnContainer(2, 'two-col');
            const styleText = document.head.querySelector('style').textContent;
            expect(styleText).toContain('.two-col');
        });
    });
    // ── create() ─────────────────────────────────────────────────────────────
    describe('create()', () => {
        it('returns the same HTMLElement on repeated calls', () => {
            const container = new MultiColumnContainer(2);
            expect(container.create()).toBe(container.create());
        });
        it('returns a DIV element', () => {
            expect(new MultiColumnContainer(2).create().tagName).toBe('DIV');
        });
    });
    // ── dragover ─────────────────────────────────────────────────────────────
    describe('dragover', () => {
        it('prevents the default browser action', () => {
            const el = new MultiColumnContainer(2).create();
            const event = new Event('dragover', { cancelable: true });
            el.dispatchEvent(event);
            expect(event.defaultPrevented).toBe(true);
        });
    });
    // ── onDrop ────────────────────────────────────────────────────────────────
    describe('onDrop', () => {
        let mockComponent;
        beforeEach(() => {
            mockComponent = document.createElement('div');
            mockComponent.classList.add('editable-component');
            Canvas.createComponent.mockReturnValue(mockComponent);
            Canvas.generateUniqueClass.mockReturnValue('text-c0-abc');
        });
        it('does nothing when dataTransfer has no component-type', () => {
            const el = new MultiColumnContainer(2).create();
            document.body.appendChild(el);
            const column = el.querySelector('.column');
            const dt = { getData: jest.fn(() => '') };
            const event = new Event('drop', { bubbles: true });
            Object.defineProperty(event, 'dataTransfer', { value: dt });
            Object.defineProperty(event, 'target', { value: column });
            el.dispatchEvent(event);
            expect(Canvas.createComponent).not.toHaveBeenCalled();
        });
        it('does nothing when Canvas.createComponent returns null', () => {
            Canvas.createComponent.mockReturnValue(null);
            const el = new MultiColumnContainer(2).create();
            document.body.appendChild(el);
            const column = el.querySelector('.column');
            fireDrop(column, 'text');
            expect(Canvas.historyManager.captureState).not.toHaveBeenCalled();
        });
        it('calls Canvas.createComponent with the dropped component type', () => {
            const el = new MultiColumnContainer(2).create();
            document.body.appendChild(el);
            const column = el.querySelector('.column');
            fireDrop(column, 'text');
            expect(Canvas.createComponent).toHaveBeenCalledWith('text');
        });
        it('appends the component to the target column', () => {
            const el = new MultiColumnContainer(2).create();
            document.body.appendChild(el);
            const column = el.querySelector('.column');
            fireDrop(column, 'text');
            expect(column.contains(mockComponent)).toBe(true);
        });
        it('generates a unique class for the dropped component', () => {
            const el = new MultiColumnContainer(2).create();
            document.body.appendChild(el);
            const column = el.querySelector('.column');
            fireDrop(column, 'text');
            expect(Canvas.generateUniqueClass).toHaveBeenCalledWith('text', true, expect.any(String));
        });
        it('assigns the generated class and id to the component', () => {
            const el = new MultiColumnContainer(2).create();
            document.body.appendChild(el);
            const column = el.querySelector('.column');
            fireDrop(column, 'text');
            expect(mockComponent.classList.contains('text-c0-abc')).toBe(true);
            expect(mockComponent.id).toBe('text-c0-abc');
        });
        it('creates a column label if one does not already exist', () => {
            const el = new MultiColumnContainer(2).create();
            document.body.appendChild(el);
            const column = el.querySelector('.column');
            fireDrop(column, 'text');
            const label = column.querySelector('.column-label');
            expect(label).not.toBeNull();
        });
        it('reuses an existing column label instead of duplicating it', () => {
            const el = new MultiColumnContainer(2).create();
            document.body.appendChild(el);
            const column = el.querySelector('.column');
            // Pre-insert a label
            const existing = document.createElement('span');
            existing.className = 'column-label';
            column.appendChild(existing);
            fireDrop(column, 'text');
            expect(column.querySelectorAll('.column-label')).toHaveLength(1);
        });
        it('creates a component label with contenteditable=false', () => {
            const el = new MultiColumnContainer(2).create();
            document.body.appendChild(el);
            const column = el.querySelector('.column');
            fireDrop(column, 'text');
            const label = mockComponent.querySelector('.component-label');
            expect(label).not.toBeNull();
            expect(label.getAttribute('contenteditable')).toBe('false');
        });
        it('captures history state after a successful drop', () => {
            const el = new MultiColumnContainer(2).create();
            document.body.appendChild(el);
            const column = el.querySelector('.column');
            fireDrop(column, 'text');
            expect(Canvas.historyManager.captureState).toHaveBeenCalledTimes(1);
        });
        it('does not capture history when target is not a column', () => {
            const el = new MultiColumnContainer(2).create();
            document.body.appendChild(el);
            // Drop onto the container root, not a .column child
            fireDrop(el, 'text');
            expect(Canvas.historyManager.captureState).not.toHaveBeenCalled();
        });
    });
    // ── restoreColumn ─────────────────────────────────────────────────────────
    describe('restoreColumn()', () => {
        it('calls addControlButtons for each editable-component child', () => {
            const column = document.createElement('div');
            const child = document.createElement('div');
            child.classList.add('editable-component');
            column.appendChild(child);
            MultiColumnContainer.restoreColumn(column);
            expect(Canvas.controlsManager.addControlButtons).toHaveBeenCalledWith(child);
        });
        it('calls addDraggableListeners for each editable-component child', () => {
            const column = document.createElement('div');
            const child = document.createElement('div');
            child.classList.add('editable-component');
            column.appendChild(child);
            MultiColumnContainer.restoreColumn(column);
            expect(Canvas.addDraggableListeners).toHaveBeenCalledWith(child);
        });
        it('restores image upload for image-component children', () => {
            const column = document.createElement('div');
            const imgChild = document.createElement('div');
            imgChild.classList.add('editable-component', 'image-component');
            const img = document.createElement('img');
            img.setAttribute('src', 'test.png');
            imgChild.appendChild(img);
            column.appendChild(imgChild);
            MultiColumnContainer.restoreColumn(column);
            expect(ImageComponent.restoreImageUpload).toHaveBeenCalledWith(imgChild, 'test.png', null);
        });
        it('passes empty string as src when img has no src attribute', () => {
            const column = document.createElement('div');
            const imgChild = document.createElement('div');
            imgChild.classList.add('editable-component', 'image-component');
            imgChild.appendChild(document.createElement('img'));
            column.appendChild(imgChild);
            MultiColumnContainer.restoreColumn(column);
            expect(ImageComponent.restoreImageUpload).toHaveBeenCalledWith(imgChild, '', null);
        });
        it('calls ContainerComponent.restoreContainer for container-component children', () => {
            const column = document.createElement('div');
            const containerChild = document.createElement('div');
            containerChild.classList.add('editable-component', 'container-component');
            column.appendChild(containerChild);
            MultiColumnContainer.restoreColumn(column);
            expect(ContainerComponent.restoreContainer).toHaveBeenCalledWith(containerChild);
        });
        it('handles columns with no editable children gracefully', () => {
            const column = document.createElement('div');
            expect(() => MultiColumnContainer.restoreColumn(column)).not.toThrow();
        });
        it('processes multiple children in a single column', () => {
            const column = document.createElement('div');
            for (let i = 0; i < 3; i++) {
                const child = document.createElement('div');
                child.classList.add('editable-component');
                column.appendChild(child);
            }
            MultiColumnContainer.restoreColumn(column);
            expect(Canvas.controlsManager.addControlButtons).toHaveBeenCalledTimes(3);
            expect(Canvas.addDraggableListeners).toHaveBeenCalledTimes(3);
        });
    });
});
