/**
 * Unit tests for:
 *   - pageSizeControl   (createPageSizeSelect, PAGE_SIZES, PAGE_SIZES_OPTIONS)
 *   - controlBuilders   (rgbToHex, createControl, createSelectControl)
 *   - attributeControls (createAttributeControls)
 *   - modalButtonControls (populateModalButton)
 *   - rowVisibilityControls (populateRowVisibilityControls)
 *   - SidebarUtils (delegation layer)
 */
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
// ---------------------------------------------------------------------------
// Imports — pull from the barrel so every re-export is exercised
// ---------------------------------------------------------------------------
import {
  createPageSizeSelect,
  PAGE_SIZES,
  PAGE_SIZES_OPTIONS,
  createControl,
  createSelectControl,
  rgbToHex,
  createAttributeControls,
  populateModalButton,
  populateRowVisibilityControls,
} from '../../../utils/sidebarHelperCore/index.js';
import { SidebarUtils } from '../../../utils/customizationSidebarHelper.js';
// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------
jest.mock('../../../canvas/Canvas', () => ({
  Canvas: {
    dispatchDesignChange: jest.fn(),
    historyManager: { captureState: jest.fn() },
  },
}));
jest.mock('../../../components/ModalManager', () => ({
  ModalComponent: jest.fn().mockImplementation(() => ({})),
}));
jest.mock('../../../components/TextComponent', () => {
  const TextComponent = jest.fn().mockImplementation(() => ({
    updateTextContent: jest.fn(),
  }));
  TextComponent.textAttributeConfig = {};
  return { TextComponent };
});
jest.mock('../../../components/HeaderComponent', () => {
  const HeaderComponent = jest.fn().mockImplementation(() => ({
    updateHeaderContent: jest.fn(),
  }));
  HeaderComponent.headerAttributeConfig = {};
  return { HeaderComponent };
});
jest.mock('../../../components/TableComponent', () => {
  const TableComponent = jest.fn().mockImplementation(() => ({
    updateCellContent: jest.fn(),
  }));
  TableComponent.tableAttributeConfig = {};
  return { TableComponent };
});
jest.mock('../../../utils/componentClickManager', () => ({
  handleComponentClick: jest.fn().mockResolvedValue(undefined),
}));
import { Canvas } from '../../../canvas/Canvas.js';
import { handleComponentClick } from '../../../utils/componentClickManager.js';
// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
/** Creates a fresh div appended to document.body — cleans up in afterEach */
function makeContainer() {
  const el = document.createElement('div');
  document.body.appendChild(el);
  return el;
}
/**
 * ComponentAttribute has two merged declarations in types.d.ts:
 *   • The export interface requires:  id, type (union), execute_order, value
 *   • The plain interface requires:   id, key, title, type, value?
 * We must satisfy the stricter merged shape, so all required fields are present.
 * Fields that are optional in one declaration (editable, default_value,
 * input_type) are included here for convenience but can be overridden.
 */
function makeAttribute(overrides = {}) {
  return Object.assign(
    {
      id: 'attr-id',
      key: 'test-key',
      title: 'Test Title',
      type: 'Input',
      input_type: 'text',
      value: '',
      execute_order: 0,
      default_value: '',
      editable: true,
    },
    overrides
  );
}
beforeEach(() => {
  jest.clearAllMocks();
  document.body.innerHTML = '';
});
// ===========================================================================
// PAGE_SIZES / PAGE_SIZES_OPTIONS
// ===========================================================================
describe('PAGE_SIZES constants', () => {
  it('exports A4_P with correct dimensions', () => {
    expect(PAGE_SIZES.A4_P).toEqual({ width: 794, height: 1123 });
  });
  it('exports A4_L with correct dimensions', () => {
    expect(PAGE_SIZES.A4_L).toEqual({ width: 1123, height: 794 });
  });
  it('exports LETTER_P with correct dimensions', () => {
    expect(PAGE_SIZES.LETTER_P).toEqual({ width: 816, height: 1056 });
  });
  it('PAGE_SIZES_OPTIONS contains an entry for every PAGE_SIZES key plus CUSTOM', () => {
    const values = PAGE_SIZES_OPTIONS.map(o => o.value);
    expect(values).toContain('A4_P');
    expect(values).toContain('A4_L');
    expect(values).toContain('LETTER_P');
    expect(values).toContain('CUSTOM');
  });
  it('every PAGE_SIZES_OPTIONS entry has a non-empty label', () => {
    PAGE_SIZES_OPTIONS.forEach(opt => {
      expect(opt.label.length).toBeGreaterThan(0);
    });
  });
});
// ===========================================================================
// createPageSizeSelect
// ===========================================================================
describe('createPageSizeSelect', () => {
  function makeCanvas(maxWidth, minHeight) {
    const canvas = document.createElement('div');
    if (maxWidth) canvas.style.maxWidth = maxWidth;
    if (minHeight) canvas.style.minHeight = minHeight;
    return canvas;
  }
  it('appends a wrapper with class "control-wrapper vertical"', () => {
    const container = makeContainer();
    createPageSizeSelect(container, makeCanvas());
    const wrapper = container.querySelector('.control-wrapper.vertical');
    expect(wrapper).not.toBeNull();
  });
  it('renders a <select> with id "page-size-select"', () => {
    const container = makeContainer();
    createPageSizeSelect(container, makeCanvas());
    expect(document.getElementById('page-size-select')).not.toBeNull();
  });
  it('creates one <option> for every PAGE_SIZES_OPTIONS entry', () => {
    const container = makeContainer();
    createPageSizeSelect(container, makeCanvas());
    const options = container.querySelectorAll('select option');
    expect(options).toHaveLength(PAGE_SIZES_OPTIONS.length);
  });
  it('pre-selects CUSTOM when canvas dimensions match no preset', () => {
    const container = makeContainer();
    createPageSizeSelect(container, makeCanvas('100px', '100px'));
    const select = container.querySelector('select');
    expect(select.value).toBe('CUSTOM');
  });
  it('pre-selects A4_P when canvas matches A4 portrait dimensions', () => {
    const container = makeContainer();
    createPageSizeSelect(container, makeCanvas('794px', '1123px'));
    const select = container.querySelector('select');
    expect(select.value).toBe('A4_P');
  });
  it('pre-selects A4_L when canvas matches A4 landscape dimensions', () => {
    const container = makeContainer();
    createPageSizeSelect(container, makeCanvas('1123px', '794px'));
    const select = container.querySelector('select');
    expect(select.value).toBe('A4_L');
  });
  it('pre-selects LETTER_P when canvas matches letter portrait dimensions', () => {
    const container = makeContainer();
    createPageSizeSelect(container, makeCanvas('816px', '1056px'));
    const select = container.querySelector('select');
    expect(select.value).toBe('LETTER_P');
  });
  it('matches within the 5 px tolerance (e.g. 796px ≈ A4_P width)', () => {
    const container = makeContainer();
    createPageSizeSelect(container, makeCanvas('796px', '1123px'));
    const select = container.querySelector('select');
    expect(select.value).toBe('A4_P');
  });
  it('renders a visible label element', () => {
    const container = makeContainer();
    createPageSizeSelect(container, makeCanvas());
    const label = container.querySelector('label');
    expect(label).not.toBeNull();
    expect(label.textContent).toBe('Page Size Preset');
  });
});
// ===========================================================================
// rgbToHex
// ===========================================================================
describe('rgbToHex', () => {
  it('converts a pure red rgb() string to #FF0000', () => {
    expect(rgbToHex('rgb(255, 0, 0)')).toBe('#FF0000');
  });
  it('converts a pure green rgb() string to #00FF00', () => {
    expect(rgbToHex('rgb(0, 255, 0)')).toBe('#00FF00');
  });
  it('converts a pure blue rgb() string to #0000FF', () => {
    expect(rgbToHex('rgb(0, 0, 255)')).toBe('#0000FF');
  });
  it('converts black rgb(0,0,0) to #000000', () => {
    expect(rgbToHex('rgb(0, 0, 0)')).toBe('#000000');
  });
  it('converts white rgb(255,255,255) to #FFFFFF', () => {
    expect(rgbToHex('rgb(255, 255, 255)')).toBe('#FFFFFF');
  });
  it('handles rgba() strings by ignoring the alpha channel', () => {
    expect(rgbToHex('rgba(255, 0, 0, 0.5)')).toBe('#FF0000');
  });
  it('returns the original string unchanged when it is not a rgb/rgba value', () => {
    expect(rgbToHex('#AABBCC')).toBe('#AABBCC');
    expect(rgbToHex('red')).toBe('red');
    expect(rgbToHex('')).toBe('');
  });
  it('produces uppercase hex digits', () => {
    const result = rgbToHex('rgb(171, 205, 239)');
    expect(result).toMatch(/^#[0-9A-F]{6}$/);
  });
});
// ===========================================================================
// createControl
// ===========================================================================
describe('createControl', () => {
  it('appends a .control-wrapper to the container', () => {
    const container = makeContainer();
    createControl('Width', 'width', 'number', 100, container);
    expect(container.querySelector('.control-wrapper')).not.toBeNull();
  });
  it('renders a label with the correct text', () => {
    const container = makeContainer();
    createControl('Width', 'width', 'text', 'auto', container);
    const label = container.querySelector('label');
    expect(
      label === null || label === void 0 ? void 0 : label.textContent
    ).toContain('Width');
  });
  it('renders an <input> with the correct id', () => {
    const container = makeContainer();
    createControl('Height', 'height', 'number', 200, container);
    expect(document.getElementById('height')).not.toBeNull();
  });
  it('sets the input value correctly', () => {
    const container = makeContainer();
    createControl('Opacity', 'opacity', 'number', 75, container);
    const input = document.getElementById('opacity');
    expect(input.value).toBe('75');
  });
  it('applies extra attributes (min, max) to the primary input', () => {
    const container = makeContainer();
    createControl('Size', 'size', 'number', 10, container, {
      min: 0,
      max: 100,
    });
    const input = document.getElementById('size');
    expect(input.getAttribute('min')).toBe('0');
    expect(input.getAttribute('max')).toBe('100');
  });
  describe('number type with unit attribute', () => {
    it('renders a unit <select> alongside the number input', () => {
      const container = makeContainer();
      createControl('Width', 'w', 'number', 50, container, { unit: 'px' });
      expect(document.getElementById('w-unit')).not.toBeNull();
    });
    it('pre-selects the matching unit option', () => {
      const container = makeContainer();
      createControl('Width', 'w2', 'number', 50, container, { unit: 'rem' });
      const unitSelect = document.getElementById('w2-unit');
      expect(unitSelect.value).toBe('rem');
    });
    it('appends the new unit to the value when the unit selector changes', () => {
      const container = makeContainer();
      createControl('Width', 'w3', 'number', 10, container, { unit: 'px' });
      const input = document.getElementById('w3');
      const unitSelect = document.getElementById('w3-unit');
      // jsdom sanitizes non-numeric strings on type="number" inputs (sets value
      // back to ""). Switch to "text" before firing the change so the combined
      // value (e.g. "10rem") is actually retained and can be asserted.
      input.value = '10';
      input.type = 'text';
      unitSelect.value = 'rem';
      unitSelect.dispatchEvent(new Event('change'));
      expect(input.value).toBe('10rem');
    });
  });
  describe('color type', () => {
    it('renders a color picker and a hex text input', () => {
      const container = makeContainer();
      createControl('BG Color', 'bg', 'color', '#FF0000', container);
      expect(document.getElementById('bg')).not.toBeNull();
      expect(document.getElementById('bg-value')).not.toBeNull();
    });
    it('syncs hex text input when color picker changes', () => {
      const container = makeContainer();
      createControl('BG Color', 'bg2', 'color', '#FF0000', container);
      const colorPicker = document.getElementById('bg2');
      const hexInput = document.getElementById('bg2-value');
      colorPicker.value = '#00FF00';
      colorPicker.dispatchEvent(new Event('input'));
      // jsdom normalises colour values to lowercase
      expect(hexInput.value.toLowerCase()).toBe('#00ff00');
    });
    it('syncs color picker when hex text input changes', () => {
      const container = makeContainer();
      createControl('BG Color', 'bg3', 'color', '#FF0000', container);
      const colorPicker = document.getElementById('bg3');
      const hexInput = document.getElementById('bg3-value');
      hexInput.value = '#0000FF';
      hexInput.dispatchEvent(new Event('input'));
      // jsdom normalises colour values to lowercase
      expect(colorPicker.value.toLowerCase()).toBe('#0000ff');
    });
  });
  describe('text type (default)', () => {
    it('renders a plain text input', () => {
      const container = makeContainer();
      createControl('Name', 'name', 'text', 'hello', container);
      const input = document.getElementById('name');
      expect(input.type).toBe('text');
      expect(input.value).toBe('hello');
    });
  });
});
// ===========================================================================
// createSelectControl
// ===========================================================================
describe('createSelectControl', () => {
  const OPTIONS = ['left', 'center', 'right'];
  it('appends a .control-wrapper to the container', () => {
    const container = makeContainer();
    createSelectControl('Align', 'align', 'left', OPTIONS, container);
    expect(container.querySelector('.control-wrapper')).not.toBeNull();
  });
  it('renders a label with the provided text', () => {
    var _a;
    const container = makeContainer();
    createSelectControl('Align', 'align2', 'left', OPTIONS, container);
    expect(
      (_a = container.querySelector('label')) === null || _a === void 0
        ? void 0
        : _a.textContent
    ).toContain('Align');
  });
  it('renders a <select> with the correct id', () => {
    const container = makeContainer();
    createSelectControl('Align', 'align3', 'center', OPTIONS, container);
    expect(document.getElementById('align3')).not.toBeNull();
  });
  it('renders one <option> per entry in the options array', () => {
    const container = makeContainer();
    createSelectControl('Align', 'align4', 'left', OPTIONS, container);
    const opts = container.querySelectorAll('select option');
    expect(opts).toHaveLength(3);
  });
  it('pre-selects the currentValue option', () => {
    const container = makeContainer();
    createSelectControl('Align', 'align5', 'right', OPTIONS, container);
    const select = document.getElementById('align5');
    expect(select.value).toBe('right');
  });
  it('sets each option value and text to the corresponding string', () => {
    const container = makeContainer();
    createSelectControl('Align', 'align6', 'left', OPTIONS, container);
    const opts = container.querySelectorAll('select option');
    expect(opts[0].value).toBe('left');
    expect(opts[1].value).toBe('center');
    expect(opts[2].value).toBe('right');
  });
  it('handles an empty options array without throwing', () => {
    const container = makeContainer();
    expect(() =>
      createSelectControl('Empty', 'empty', '', [], container)
    ).not.toThrow();
  });
});
// ===========================================================================
// createAttributeControls
// ===========================================================================
describe('createAttributeControls', () => {
  it('appends a .attribute-input-container to the panel', () => {
    const panel = makeContainer();
    createAttributeControls(makeAttribute(), panel, jest.fn());
    expect(panel.querySelector('.attribute-input-container')).not.toBeNull();
  });
  it('renders a label with the attribute title', () => {
    var _a;
    const panel = makeContainer();
    createAttributeControls(
      makeAttribute({ title: 'My Field' }),
      panel,
      jest.fn()
    );
    expect(
      (_a = panel.querySelector('label')) === null || _a === void 0
        ? void 0
        : _a.textContent
    ).toContain('My Field');
  });
  describe('text input type (default)', () => {
    it('renders a text input', () => {
      const panel = makeContainer();
      createAttributeControls(
        makeAttribute({ input_type: 'text', key: 'txt' }),
        panel,
        jest.fn()
      );
      const input = document.getElementById('txt');
      expect(input.type).toBe('text');
    });
    it('sets the placeholder from the title', () => {
      const panel = makeContainer();
      createAttributeControls(
        makeAttribute({ input_type: 'text', key: 'ph', title: 'My Label' }),
        panel,
        jest.fn()
      );
      const input = document.getElementById('ph');
      expect(input.placeholder).toContain('my label');
    });
    it('sets the default value on the input', () => {
      const panel = makeContainer();
      createAttributeControls(
        makeAttribute({ key: 'dv', default_value: 'hello' }),
        panel,
        jest.fn()
      );
      const input = document.getElementById('dv');
      expect(input.value).toBe('hello');
    });
  });
  describe('number input type', () => {
    it('renders a number input', () => {
      const panel = makeContainer();
      createAttributeControls(
        makeAttribute({ input_type: 'number', key: 'num' }),
        panel,
        jest.fn()
      );
      const input = document.getElementById('num');
      expect(input.type).toBe('number');
    });
  });
  describe('checkbox input type', () => {
    it('renders a checkbox input', () => {
      const panel = makeContainer();
      createAttributeControls(
        makeAttribute({ input_type: 'checkbox', key: 'chk' }),
        panel,
        jest.fn()
      );
      const input = document.getElementById('chk');
      expect(input.type).toBe('checkbox');
    });
    it('is checked when default_value is "true"', () => {
      const panel = makeContainer();
      createAttributeControls(
        makeAttribute({
          input_type: 'checkbox',
          key: 'chk2',
          default_value: 'true',
        }),
        panel,
        jest.fn()
      );
      expect(document.getElementById('chk2').checked).toBe(true);
    });
    it('is unchecked when default_value is not "true"', () => {
      const panel = makeContainer();
      createAttributeControls(
        makeAttribute({
          input_type: 'checkbox',
          key: 'chk3',
          default_value: 'false',
        }),
        panel,
        jest.fn()
      );
      expect(document.getElementById('chk3').checked).toBe(false);
    });
  });
  describe('editable = true (default)', () => {
    it('does NOT render the read-only badge', () => {
      const panel = makeContainer();
      createAttributeControls(
        makeAttribute({ editable: true }),
        panel,
        jest.fn()
      );
      expect(panel.querySelector('.readonly-badge')).toBeNull();
    });
    it('renders the event-trigger selector', () => {
      const panel = makeContainer();
      createAttributeControls(makeAttribute({ key: 'ev1' }), panel, jest.fn());
      expect(document.getElementById('event-selector-ev1')).not.toBeNull();
    });
    it('sets data-trigger to "input" by default', () => {
      const panel = makeContainer();
      createAttributeControls(makeAttribute({ key: 'ev2' }), panel, jest.fn());
      const box = panel.querySelector('.attribute-input-container');
      expect(box.getAttribute('data-trigger')).toBe('input');
    });
    it('calls handleInputTrigger when the input fires the "input" event', () => {
      const handler = jest.fn();
      const panel = makeContainer();
      createAttributeControls(makeAttribute({ key: 'ev3' }), panel, handler);
      const input = document.getElementById('ev3');
      input.dispatchEvent(new Event('input'));
      expect(handler).toHaveBeenCalledTimes(1);
    });
    it('switches the trigger and updates data-trigger when the selector changes', () => {
      const handler = jest.fn();
      const panel = makeContainer();
      createAttributeControls(makeAttribute({ key: 'ev4' }), panel, handler);
      const selector = document.getElementById('event-selector-ev4');
      const box = panel.querySelector('.attribute-input-container');
      selector.value = 'blur';
      selector.dispatchEvent(new Event('change'));
      expect(box.getAttribute('data-trigger')).toBe('blur');
    });
    it('removes the old listener and adds the new one after selector change', () => {
      const handler = jest.fn();
      const panel = makeContainer();
      createAttributeControls(makeAttribute({ key: 'ev5' }), panel, handler);
      const selector = document.getElementById('event-selector-ev5');
      const input = document.getElementById('ev5');
      selector.value = 'blur';
      selector.dispatchEvent(new Event('change'));
      // Old "input" event should no longer trigger the handler
      input.dispatchEvent(new Event('input'));
      expect(handler).not.toHaveBeenCalled();
      // New "blur" event should now trigger it
      input.dispatchEvent(new Event('blur'));
      expect(handler).toHaveBeenCalledTimes(1);
    });
    it('adds input-focused class on focus and removes it on blur', () => {
      const panel = makeContainer();
      createAttributeControls(makeAttribute({ key: 'fc1' }), panel, jest.fn());
      const input = document.getElementById('fc1');
      const box = panel.querySelector('.attribute-input-container');
      input.dispatchEvent(new Event('focus'));
      expect(box.classList.contains('input-focused')).toBe(true);
      input.dispatchEvent(new Event('blur'));
      expect(box.classList.contains('input-focused')).toBe(false);
    });
  });
  describe('editable = false', () => {
    it('renders the read-only badge', () => {
      const panel = makeContainer();
      createAttributeControls(
        makeAttribute({ editable: false }),
        panel,
        jest.fn()
      );
      expect(panel.querySelector('.readonly-badge')).not.toBeNull();
    });
    it('does NOT render the event-trigger selector', () => {
      const panel = makeContainer();
      createAttributeControls(
        makeAttribute({ key: 'ro1', editable: false }),
        panel,
        jest.fn()
      );
      expect(document.getElementById('event-selector-ro1')).toBeNull();
    });
    it('renders the input as disabled', () => {
      const panel = makeContainer();
      createAttributeControls(
        makeAttribute({ key: 'ro2', editable: false }),
        panel,
        jest.fn()
      );
      const input = document.getElementById('ro2');
      expect(input.disabled).toBe(true);
    });
  });
});
// ===========================================================================
// populateModalButton
// ===========================================================================
describe('populateModalButton', () => {
  function makeComponent(classes = ['text-component']) {
    const el = document.createElement('div');
    classes.forEach(c => el.classList.add(c));
    el.id = 'test-component';
    document.body.appendChild(el);
    return el;
  }
  it('does nothing when editable is false', () => {
    const panel = makeContainer();
    const comp = makeComponent();
    populateModalButton(comp, panel, false);
    expect(panel.children).toHaveLength(0);
  });
  it('appends a "Set Attribute" button', () => {
    const panel = makeContainer();
    populateModalButton(makeComponent(), panel, true);
    expect(panel.querySelector('.set-attribute-button')).not.toBeNull();
  });
  it('appends a "Delete Attribute" button', () => {
    const panel = makeContainer();
    populateModalButton(makeComponent(), panel, true);
    expect(panel.querySelector('.delete-attribute-button')).not.toBeNull();
  });
  it('hides the delete button initially when no data-attribute-key is set', () => {
    const panel = makeContainer();
    populateModalButton(makeComponent(), panel, true);
    const deleteBtn = panel.querySelector('.delete-attribute-button');
    expect(deleteBtn.style.display).toBe('none');
  });
  it('shows the delete button when data-attribute-key is already present', () => {
    const panel = makeContainer();
    const comp = makeComponent();
    comp.setAttribute('data-attribute-key', 'some-key');
    populateModalButton(comp, panel, true);
    const deleteBtn = panel.querySelector('.delete-attribute-button');
    expect(deleteBtn.style.display).toBe('block');
  });
  it('clicking delete removes data-attribute-key from the component', () => {
    const panel = makeContainer();
    const comp = makeComponent(['text-component']);
    comp.setAttribute('data-attribute-key', 'key1');
    comp.setAttribute('data-attribute-type', 'text');
    const textContent = document.createElement('span');
    textContent.className = 'component-text-content';
    comp.appendChild(textContent);
    populateModalButton(comp, panel, true);
    panel.querySelector('.delete-attribute-button').click();
    expect(comp.hasAttribute('data-attribute-key')).toBe(false);
  });
  it('clicking delete calls Canvas.dispatchDesignChange', () => {
    const panel = makeContainer();
    const comp = makeComponent(['text-component']);
    comp.setAttribute('data-attribute-key', 'k');
    const span = document.createElement('span');
    span.className = 'component-text-content';
    comp.appendChild(span);
    populateModalButton(comp, panel, true);
    panel.querySelector('.delete-attribute-button').click();
    expect(Canvas.dispatchDesignChange).toHaveBeenCalledTimes(1);
  });
  it('clicking delete calls Canvas.historyManager.captureState', () => {
    const panel = makeContainer();
    const comp = makeComponent(['text-component']);
    comp.setAttribute('data-attribute-key', 'k2');
    const span = document.createElement('span');
    span.className = 'component-text-content';
    comp.appendChild(span);
    populateModalButton(comp, panel, true);
    panel.querySelector('.delete-attribute-button').click();
    expect(Canvas.historyManager.captureState).toHaveBeenCalledTimes(1);
  });
  it('clicking delete hides the delete button afterwards', () => {
    const panel = makeContainer();
    const comp = makeComponent(['text-component']);
    comp.setAttribute('data-attribute-key', 'k3');
    const span = document.createElement('span');
    span.className = 'component-text-content';
    comp.appendChild(span);
    populateModalButton(comp, panel, true);
    const deleteBtn = panel.querySelector('.delete-attribute-button');
    deleteBtn.click();
    expect(deleteBtn.style.display).toBe('none');
  });
  it('clicking Set Attribute calls handleComponentClick for a text-component', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const panel = makeContainer();
      const comp = makeComponent(['text-component']);
      populateModalButton(comp, panel, true);
      yield panel.querySelector('.set-attribute-button').click();
      yield Promise.resolve();
      expect(handleComponentClick).toHaveBeenCalled();
    }));
  it('clicking Set Attribute calls handleComponentClick for a header-component', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const panel = makeContainer();
      const comp = makeComponent(['header-component']);
      populateModalButton(comp, panel, true);
      yield panel.querySelector('.set-attribute-button').click();
      yield Promise.resolve();
      expect(handleComponentClick).toHaveBeenCalled();
    }));
  it('uses table-cell as the attribute target for table-cell-content components', () => {
    const panel = makeContainer();
    const cell = document.createElement('div');
    cell.classList.add('table-cell');
    const comp = document.createElement('div');
    comp.classList.add('table-cell-content');
    cell.appendChild(comp);
    document.body.appendChild(cell);
    populateModalButton(comp, panel, true);
    // The delete button visibility is driven by the cell's attribute, not the inner span's
    cell.setAttribute('data-attribute-key', 'cell-key');
    // Re-call to refresh (simulates re-render)
    panel.innerHTML = '';
    populateModalButton(comp, panel, true);
    const deleteBtn = panel.querySelector('.delete-attribute-button');
    expect(deleteBtn.style.display).toBe('block');
  });
});
// ===========================================================================
// populateRowVisibilityControls
// ===========================================================================
describe('populateRowVisibilityControls', () => {
  function setupFunctionsPanel() {
    const panel = document.createElement('div');
    panel.id = 'functions-panel';
    document.body.appendChild(panel);
    return panel;
  }
  const INPUTS = [
    {
      id: 'a1',
      key: 'income',
      title: 'Income',
      type: 'Input',
      input_type: 'number',
      value: '',
      execute_order: 0,
      default_value: '',
      editable: true,
    },
    {
      id: 'a2',
      key: 'name',
      title: 'Name',
      type: 'Input',
      input_type: 'text',
      value: '',
      execute_order: 1,
      default_value: '',
      editable: true,
    },
    // 'Constant' is used here instead of 'Output' (not a valid union member).
    // This attribute represents a non-Input field and should be excluded from
    // the key selector in populateRowVisibilityControls.
    {
      id: 'a3',
      key: 'static-field',
      title: 'Static',
      type: 'Constant',
      input_type: 'text',
      value: '',
      execute_order: 2,
      default_value: '',
      editable: false,
    },
  ];
  it('renders the rules panel inside #functions-panel', () => {
    setupFunctionsPanel();
    const row = document.createElement('tr');
    populateRowVisibilityControls(row, INPUTS);
    expect(document.getElementById('visibility-rules-panel')).not.toBeNull();
  });
  it('renders an option for each Input-type attribute in the key selector', () => {
    setupFunctionsPanel();
    const row = document.createElement('tr');
    populateRowVisibilityControls(row, INPUTS);
    const select = document.getElementById('rule-input-key-select');
    // Only 'income' and 'name' have type === 'Input'
    expect(select.querySelectorAll('option')).toHaveLength(2);
  });
  it('does NOT add an option for non-Input-type attributes (e.g. type Constant)', () => {
    setupFunctionsPanel();
    const row = document.createElement('tr');
    populateRowVisibilityControls(row, INPUTS);
    const select = document.getElementById('rule-input-key-select');
    const optValues = Array.from(select.options).map(o => o.value);
    expect(optValues).not.toContain('static-field');
  });
  it('renders the rules-list empty when the row has no existing rules', () => {
    setupFunctionsPanel();
    const row = document.createElement('tr');
    populateRowVisibilityControls(row, INPUTS);
    expect(document.getElementById('rules-list').children).toHaveLength(0);
  });
  it('renders existing rules stored on the row element', () => {
    setupFunctionsPanel();
    const row = document.createElement('tr');
    row.setAttribute(
      'data-visibility-rules',
      JSON.stringify([
        {
          inputKey: 'income',
          operator: 'greater_than',
          value: '100',
          action: 'show',
        },
      ])
    );
    populateRowVisibilityControls(row, INPUTS);
    expect(
      document.getElementById('rules-list').querySelectorAll('.rule-item')
    ).toHaveLength(1);
  });
  it('clicking "Add Rule" appends a rule to the row attribute and re-renders', () => {
    setupFunctionsPanel();
    const row = document.createElement('tr');
    populateRowVisibilityControls(row, INPUTS);
    const valueInput = document.getElementById('rule-value-input');
    valueInput.value = '500';
    document.getElementById('add-rule-btn').click();
    const rules = JSON.parse(row.getAttribute('data-visibility-rules') || '[]');
    expect(rules).toHaveLength(1);
    expect(rules[0].value).toBe('500');
  });
  it('clicking "Add Rule" calls Canvas.dispatchDesignChange', () => {
    setupFunctionsPanel();
    const row = document.createElement('tr');
    populateRowVisibilityControls(row, INPUTS);
    document.getElementById('add-rule-btn').click();
    expect(Canvas.dispatchDesignChange).toHaveBeenCalledTimes(1);
  });
  it('clicking a delete-rule button removes that rule from the row and re-renders', () => {
    setupFunctionsPanel();
    const row = document.createElement('tr');
    row.setAttribute(
      'data-visibility-rules',
      JSON.stringify([
        { inputKey: 'income', operator: 'equals', value: '0', action: 'hide' },
        { inputKey: 'name', operator: 'equals', value: 'x', action: 'show' },
      ])
    );
    populateRowVisibilityControls(row, INPUTS);
    const deleteButtons = document.querySelectorAll('.delete-rule-btn');
    deleteButtons[0].click(); // delete first rule
    const rules = JSON.parse(row.getAttribute('data-visibility-rules') || '[]');
    expect(rules).toHaveLength(1);
    expect(rules[0].inputKey).toBe('name');
  });
  it('clicking a delete-rule button calls Canvas.dispatchDesignChange', () => {
    setupFunctionsPanel();
    const row = document.createElement('tr');
    row.setAttribute(
      'data-visibility-rules',
      JSON.stringify([
        { inputKey: 'income', operator: 'equals', value: '0', action: 'hide' },
      ])
    );
    populateRowVisibilityControls(row, INPUTS);
    document.querySelector('.delete-rule-btn').click();
    expect(Canvas.dispatchDesignChange).toHaveBeenCalledTimes(1);
  });
  it('handles an empty inputs array without throwing', () => {
    setupFunctionsPanel();
    const row = document.createElement('tr');
    expect(() => populateRowVisibilityControls(row, [])).not.toThrow();
  });
  it('replaces existing panel content on repeated calls', () => {
    setupFunctionsPanel();
    const row = document.createElement('tr');
    populateRowVisibilityControls(row, INPUTS);
    populateRowVisibilityControls(row, INPUTS);
    // There should still be exactly one panel, not two
    expect(document.querySelectorAll('#visibility-rules-panel')).toHaveLength(
      1
    );
  });
});
// ===========================================================================
// SidebarUtils (delegation layer)
// ===========================================================================
describe('SidebarUtils delegation', () => {
  it('createPageSizeSelect delegates to the standalone function', () => {
    const container = makeContainer();
    const canvas = document.createElement('div');
    SidebarUtils.createPageSizeSelect(container, canvas);
    expect(document.getElementById('page-size-select')).not.toBeNull();
  });
  it('createControl delegates and produces the expected input', () => {
    const container = makeContainer();
    SidebarUtils.createControl('X', 'x-static', 'text', 'val', container);
    expect(document.getElementById('x-static').value).toBe('val');
  });
  it('createSelectControl delegates and produces the expected select', () => {
    const container = makeContainer();
    SidebarUtils.createSelectControl(
      'Font',
      'font',
      'bold',
      ['normal', 'bold'],
      container
    );
    expect(document.getElementById('font').value).toBe('bold');
  });
  it('rgbToHex delegates and returns the correct hex', () => {
    expect(SidebarUtils.rgbToHex('rgb(255, 0, 0)')).toBe('#FF0000');
  });
  it('createAttributeControls delegates and renders the container', () => {
    const panel = makeContainer();
    SidebarUtils.createAttributeControls(
      makeAttribute({ key: 'su1' }),
      panel,
      jest.fn()
    );
    expect(document.getElementById('su1')).not.toBeNull();
  });
  it('populateModalButton delegates and renders the Set Attribute button', () => {
    const panel = makeContainer();
    const comp = document.createElement('div');
    comp.classList.add('text-component');
    document.body.appendChild(comp);
    SidebarUtils.populateModalButton(comp, panel, true);
    expect(panel.querySelector('.set-attribute-button')).not.toBeNull();
  });
  it('populateRowVisibilityControls delegates and renders the panel', () => {
    const fpanel = document.createElement('div');
    fpanel.id = 'functions-panel';
    document.body.appendChild(fpanel);
    const row = document.createElement('tr');
    SidebarUtils.populateRowVisibilityControls(row, []);
    expect(document.getElementById('visibility-rules-panel')).not.toBeNull();
  });
});
