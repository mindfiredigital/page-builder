var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ModalComponent } from '../../components/ModalManager.js';
import { renderForm, filterAttributes, toggleFieldExpansion, } from '../../components/ModalCore/index.js';
import { handleSave } from '../../components/ModalCore/index.js';
import { createModalElement } from '../../components/ModalCore/index.js';
// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
const SAMPLE_ATTRS = [
    {
        id: 'attr-1',
        key: 'price',
        title: 'Price',
        type: 'Constant',
        value: '100',
    },
    { id: 'attr-2', key: 'qty', title: 'Quantity', type: 'Input', value: '5' },
    { id: 'attr-3', key: 'total', title: 'Total', type: 'Formula', value: '' },
];
// ─────────────────────────────────────────────────────────────────────────────
// createModalElement
// ─────────────────────────────────────────────────────────────────────────────
describe('createModalElement', () => {
    it('should return an HTMLElement with id "modal"', () => {
        const el = createModalElement();
        expect(el.id).toBe('modal');
    });
    it('should have class "modal-overlay"', () => {
        const el = createModalElement();
        expect(el.classList.contains('modal-overlay')).toBe(true);
    });
    it('should start with class "modal-hidden"', () => {
        const el = createModalElement();
        expect(el.classList.contains('modal-hidden')).toBe(true);
    });
    it('should contain #modal-content', () => {
        const el = createModalElement();
        expect(el.querySelector('#modal-content')).not.toBeNull();
    });
    it('should contain #close-modal-button', () => {
        const el = createModalElement();
        expect(el.querySelector('#close-modal-button')).not.toBeNull();
    });
    it('should contain #save-button', () => {
        const el = createModalElement();
        expect(el.querySelector('#save-button')).not.toBeNull();
    });
    it('should contain #attribute-search input', () => {
        const el = createModalElement();
        expect(el.querySelector('#attribute-search')).not.toBeNull();
    });
});
// ─────────────────────────────────────────────────────────────────────────────
// renderForm
// ─────────────────────────────────────────────────────────────────────────────
describe('renderForm', () => {
    let container;
    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });
    afterEach(() => {
        document.body.innerHTML = '';
    });
    it('should render a .form-field for each attribute', () => {
        renderForm(container, SAMPLE_ATTRS);
        expect(container.querySelectorAll('.form-field').length).toBe(3);
    });
    it('should set data-attr-key on each field', () => {
        renderForm(container, SAMPLE_ATTRS);
        const field = container.querySelector('[data-attr-key="price"]');
        expect(field).not.toBeNull();
    });
    it('should render .form-title with attribute title', () => {
        renderForm(container, SAMPLE_ATTRS);
        const titles = Array.from(container.querySelectorAll('.form-title')).map(el => el.textContent);
        expect(titles).toContain('Price');
        expect(titles).toContain('Quantity');
    });
    it('should render .form-key with key and type', () => {
        renderForm(container, SAMPLE_ATTRS);
        const key = container.querySelector('.form-key');
        expect(key.textContent).toContain('price');
        expect(key.textContent).toContain('Constant');
    });
    it('should render .form-display-value span with attribute value', () => {
        renderForm(container, SAMPLE_ATTRS);
        const displayVal = container.querySelector(`#attr-1`);
        expect(displayVal).not.toBeNull();
        expect(displayVal.textContent).toBe('100');
    });
    it('should clear previous contents on re-render', () => {
        renderForm(container, SAMPLE_ATTRS);
        renderForm(container, [SAMPLE_ATTRS[0]]);
        expect(container.querySelectorAll('.form-field').length).toBe(1);
    });
    it('clicking a field should add "selected" class to it', () => {
        renderForm(container, SAMPLE_ATTRS);
        const fields = container.querySelectorAll('.form-field');
        fields[1].click();
        expect(fields[1].classList.contains('selected')).toBe(true);
    });
    it('clicking a field should remove "selected" from others', () => {
        renderForm(container, SAMPLE_ATTRS);
        const fields = container.querySelectorAll('.form-field');
        fields[0].click();
        fields[1].click();
        expect(fields[0].classList.contains('selected')).toBe(false);
    });
    it('value container should start collapsed', () => {
        renderForm(container, SAMPLE_ATTRS);
        const valueContainer = container.querySelector('.form-value-container');
        expect(valueContainer.classList.contains('form-value-collapsed')).toBe(true);
    });
    it('clicking header should toggle expansion', () => {
        renderForm(container, SAMPLE_ATTRS);
        const header = container.querySelector('.form-field-header');
        header.click();
        const valueContainer = header.nextElementSibling;
        expect(valueContainer.classList.contains('form-value-collapsed')).toBe(false);
    });
    it('should render an expand-button in each header', () => {
        renderForm(container, SAMPLE_ATTRS);
        const btns = container.querySelectorAll('.expand-button');
        expect(btns.length).toBe(3);
    });
});
// ─────────────────────────────────────────────────────────────────────────────
// toggleFieldExpansion
// ─────────────────────────────────────────────────────────────────────────────
describe('toggleFieldExpansion', () => {
    let container;
    beforeEach(() => {
        container = document.createElement('div');
        renderForm(container, SAMPLE_ATTRS);
        document.body.appendChild(container);
    });
    afterEach(() => {
        document.body.innerHTML = '';
    });
    it('should expand a collapsed value container', () => {
        toggleFieldExpansion('attr-1', container);
        const header = container.querySelector('[data-attr-id="attr-1"]');
        const valueContainer = header.nextElementSibling;
        expect(valueContainer.classList.contains('form-value-collapsed')).toBe(false);
    });
    it('should collapse an already expanded value container', () => {
        toggleFieldExpansion('attr-1', container); // expand
        toggleFieldExpansion('attr-1', container); // collapse
        const header = container.querySelector('[data-attr-id="attr-1"]');
        const valueContainer = header.nextElementSibling;
        expect(valueContainer.classList.contains('form-value-collapsed')).toBe(true);
    });
    it('should rotate expand icon to 90deg when expanded', () => {
        toggleFieldExpansion('attr-1', container);
        const header = container.querySelector('[data-attr-id="attr-1"]');
        const icon = header.querySelector('.expand-icon');
        expect(icon.style.transform).toBe('rotate(90deg)');
    });
    it('should rotate expand icon back to 0deg when collapsed', () => {
        toggleFieldExpansion('attr-1', container);
        toggleFieldExpansion('attr-1', container);
        const header = container.querySelector('[data-attr-id="attr-1"]');
        const icon = header.querySelector('.expand-icon');
        expect(icon.style.transform).toBe('rotate(0deg)');
    });
});
// ─────────────────────────────────────────────────────────────────────────────
// filterAttributes
// ─────────────────────────────────────────────────────────────────────────────
describe('filterAttributes', () => {
    let container;
    beforeEach(() => {
        container = document.createElement('div');
        renderForm(container, SAMPLE_ATTRS);
        document.body.appendChild(container);
    });
    afterEach(() => {
        document.body.innerHTML = '';
    });
    it('should hide fields not matching query', () => {
        filterAttributes('price', container);
        const hidden = container.querySelectorAll('.modal-hidden');
        expect(hidden.length).toBe(2); // qty and total hidden
    });
    it('should show fields matching by key', () => {
        filterAttributes('qty', container);
        const priceField = container.querySelector('[data-attr-key="price"]');
        expect(priceField.classList.contains('modal-hidden')).toBe(true);
        const qtyField = container.querySelector('[data-attr-key="qty"]');
        expect(qtyField.classList.contains('modal-hidden')).toBe(false);
    });
    it('should show fields matching by title', () => {
        filterAttributes('Total', container);
        const totalField = container.querySelector('[data-attr-key="total"]');
        expect(totalField.classList.contains('modal-hidden')).toBe(false);
    });
    it('should be case-insensitive', () => {
        filterAttributes('PRICE', container);
        const priceField = container.querySelector('[data-attr-key="price"]');
        expect(priceField.classList.contains('modal-hidden')).toBe(false);
    });
    it('empty query should show all fields', () => {
        filterAttributes('price', container); // hide some
        filterAttributes('', container); // show all
        const hidden = container.querySelectorAll('.modal-hidden');
        expect(hidden.length).toBe(0);
    });
});
// ─────────────────────────────────────────────────────────────────────────────
// handleSave
// ─────────────────────────────────────────────────────────────────────────────
describe('handleSave', () => {
    let container;
    beforeEach(() => {
        container = document.createElement('div');
        renderForm(container, SAMPLE_ATTRS);
        document.body.appendChild(container);
    });
    afterEach(() => {
        document.body.innerHTML = '';
    });
    it('should resolve with selected attribute key/value', () => {
        // Select the "price" field
        const priceField = container.querySelector('[data-attr-key="price"]');
        priceField.classList.add('selected');
        const resolve = jest.fn();
        const hide = jest.fn();
        handleSave(container, SAMPLE_ATTRS, resolve, hide);
        expect(resolve).toHaveBeenCalledWith({ price: '100' });
    });
    it('should resolve with empty object when no field is selected', () => {
        const resolve = jest.fn();
        const hide = jest.fn();
        handleSave(container, SAMPLE_ATTRS, resolve, hide);
        expect(resolve).toHaveBeenCalledWith({});
    });
    it('should call hide function', () => {
        const resolve = jest.fn();
        const hide = jest.fn();
        handleSave(container, SAMPLE_ATTRS, resolve, hide);
        expect(hide).toHaveBeenCalled();
    });
    it('should resolve with empty object when selected attribute has undefined value', () => {
        const attrs = [
            { id: 'a1', key: 'noVal', title: 'NoVal', type: 'Input' },
        ];
        const cont = document.createElement('div');
        renderForm(cont, attrs);
        const field = cont.querySelector('[data-attr-key="noVal"]');
        field.classList.add('selected');
        const resolve = jest.fn();
        handleSave(cont, attrs, resolve, jest.fn());
        expect(resolve).toHaveBeenCalledWith({});
    });
});
// ─────────────────────────────────────────────────────────────────────────────
// ModalComponent (class)
// ─────────────────────────────────────────────────────────────────────────────
describe('ModalComponent', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });
    afterEach(() => {
        document.body.innerHTML = '';
    });
    it('should construct without errors and append modal to body', () => {
        new ModalComponent();
        expect(document.getElementById('modal')).not.toBeNull();
    });
    it('should start hidden', () => {
        new ModalComponent();
        const modal = document.getElementById('modal');
        expect(modal.classList.contains('modal-hidden')).toBe(true);
    });
    it('should re-use existing modal element if already in DOM', () => {
        new ModalComponent();
        new ModalComponent();
        const modals = document.querySelectorAll('#modal');
        expect(modals.length).toBe(1);
    });
    it('show() should remove modal-hidden class', () => {
        const modal = new ModalComponent();
        modal.show(SAMPLE_ATTRS);
        const el = document.getElementById('modal');
        expect(el.classList.contains('modal-hidden')).toBe(false);
    });
    it('show() should populate form with attributes', () => {
        const modal = new ModalComponent();
        modal.show(SAMPLE_ATTRS);
        const fields = document.querySelectorAll('.form-field');
        expect(fields.length).toBe(3);
    });
    it('hide() should add modal-hidden class', () => {
        const modal = new ModalComponent();
        modal.show(SAMPLE_ATTRS);
        modal.hide();
        const el = document.getElementById('modal');
        expect(el.classList.contains('modal-hidden')).toBe(true);
    });
    it('close button click should hide the modal', () => {
        const modal = new ModalComponent();
        modal.show(SAMPLE_ATTRS);
        const closeBtn = document.getElementById('close-modal-button');
        closeBtn.click();
        const el = document.getElementById('modal');
        expect(el.classList.contains('modal-hidden')).toBe(true);
    });
    it('close button click should resolve promise with null', () => __awaiter(void 0, void 0, void 0, function* () {
        const modal = new ModalComponent();
        const promise = modal.show(SAMPLE_ATTRS);
        const closeBtn = document.getElementById('close-modal-button');
        closeBtn.click();
        const result = yield promise;
        expect(result).toBeNull();
    }));
    it('save button click should resolve promise with selected field', () => __awaiter(void 0, void 0, void 0, function* () {
        const modal = new ModalComponent();
        const promise = modal.show(SAMPLE_ATTRS);
        const priceField = document.querySelector('[data-attr-key="price"]');
        priceField.classList.add('selected');
        const saveBtn = document.getElementById('save-button');
        saveBtn.click();
        const result = yield promise;
        expect(result).toEqual({ price: '100' });
    }));
    it('search input should filter form fields', () => {
        const modal = new ModalComponent();
        modal.show(SAMPLE_ATTRS);
        const searchInput = document.getElementById('attribute-search');
        searchInput.value = 'price';
        searchInput.dispatchEvent(new Event('input'));
        const hidden = document.querySelectorAll('.modal-hidden.form-field');
        expect(hidden.length).toBe(2);
    });
    it('show() should reset search input value on re-open', () => {
        const modal = new ModalComponent();
        modal.show(SAMPLE_ATTRS);
        const searchInput = document.getElementById('attribute-search');
        searchInput.value = 'some previous query';
        modal.hide();
        modal.show(SAMPLE_ATTRS);
        expect(searchInput.value).toBe('');
    });
});
