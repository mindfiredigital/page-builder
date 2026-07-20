/**
 * Characterization tests for addControlListeners — written BEFORE
 * decomposing the 500-line function into named sub-functions, to pin down
 * current behavior (this file has no prior coverage). Every test exercises
 * the function's public contract only (DOM in, style mutations out); none
 * of them depend on its internal structure, so they should keep passing
 * unchanged after the decomposition.
 */
import { addControlListeners } from '../../../sidebar/CustomizationSidebarCore/SidebarControlListeners';
import { Canvas } from '../../../canvas/Canvas';

jest.mock('../../../canvas/Canvas', () => ({
  Canvas: {
    dispatchDesignChange: jest.fn(),
    historyManager: { captureState: jest.fn() },
  },
}));

function input(id: string, value = ''): HTMLInputElement {
  const el = document.createElement('input');
  el.id = id;
  el.value = value;
  document.body.appendChild(el);
  return el;
}

function select(
  id: string,
  options: string[],
  value?: string
): HTMLSelectElement {
  const el = document.createElement('select');
  el.id = id;
  for (const opt of options) {
    const o = document.createElement('option');
    o.value = opt;
    o.textContent = opt;
    el.appendChild(o);
  }
  if (value !== undefined) el.value = value;
  document.body.appendChild(el);
  return el;
}

function fire(el: Element, type: string): void {
  el.dispatchEvent(new Event(type, { bubbles: true }));
}

describe('addControlListeners', () => {
  let component: HTMLElement;
  let controlsContainer: HTMLElement;
  let addListenersFn: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
    component = document.createElement('div');
    document.body.appendChild(component);
    controlsContainer = document.createElement('div');
    document.body.appendChild(controlsContainer);
    addListenersFn = jest.fn();
  });

  describe('dimensions', () => {
    it('applies width with its unit on input', () => {
      const widthInput = input('width', '200');
      select('width-unit', ['px', '%', 'rem'], '%');
      addControlListeners(component, controlsContainer, addListenersFn);

      widthInput.value = '250';
      fire(widthInput, 'input');

      expect(component.style.width).toBe('250%');
    });

    it('defaults to px when no unit select is present', () => {
      const heightInput = input('height', '100');
      addControlListeners(component, controlsContainer, addListenersFn);

      heightInput.value = '150';
      fire(heightInput, 'input');

      expect(component.style.height).toBe('150px');
    });
  });

  describe('image alt text', () => {
    it('updates the img element alt attribute on input', () => {
      const img = document.createElement('img');
      img.alt = '';
      component.appendChild(img);
      const altInput = input('image-alt-text', '');
      addControlListeners(component, controlsContainer, addListenersFn);

      altInput.value = 'A red bicycle';
      fire(altInput, 'input');

      expect(img.alt).toBe('A red bicycle');
    });

    it('does nothing when the component has no img child', () => {
      const altInput = input('image-alt-text', '');
      addControlListeners(component, controlsContainer, addListenersFn);

      expect(() => {
        altInput.value = 'text';
        fire(altInput, 'input');
      }).not.toThrow();
    });
  });

  describe('background color — two-way sync', () => {
    it('picker input updates style and mirrors into the hex field', () => {
      const picker = input('background-color', '#000000');
      const hex = input('background-color-value', '#000000');
      addControlListeners(component, controlsContainer, addListenersFn);

      picker.value = '#ff0000';
      fire(picker, 'input');

      expect(component.style.backgroundColor).toBe('rgb(255, 0, 0)');
      expect(hex.value).toBe('#ff0000');
    });

    it('hex input updates style and mirrors into the picker', () => {
      const picker = input('background-color', '#000000');
      const hex = input('background-color-value', '#000000');
      addControlListeners(component, controlsContainer, addListenersFn);

      hex.value = '#00ff00';
      fire(hex, 'input');

      expect(component.style.backgroundColor).toBe('rgb(0, 255, 0)');
      expect(picker.value).toBe('#00ff00');
    });
  });

  describe('spacing — margin', () => {
    it('shorthand margin overrides a previously-set individual side value', () => {
      const marginInput = input('margin', '0');
      select('margin-unit', ['px', 'rem'], 'px');
      addControlListeners(component, controlsContainer, addListenersFn);

      component.style.marginTop = '5px';
      marginInput.value = '10';
      fire(marginInput, 'input');

      expect(component.style.margin).toBe('10px');
      expect(component.style.marginTop).toBe('10px');
    });

    it('individual side (margin-top) applies only that side', () => {
      const topInput = input('margin-top', '0');
      select('margin-top-unit', ['px', 'rem'], 'rem');
      addControlListeners(component, controlsContainer, addListenersFn);

      topInput.value = '2';
      fire(topInput, 'input');

      expect(component.style.marginTop).toBe('2rem');
    });
  });

  describe('spacing — padding', () => {
    it('shorthand padding overrides a previously-set individual side value', () => {
      const paddingInput = input('padding', '0');
      addControlListeners(component, controlsContainer, addListenersFn);

      component.style.paddingLeft = '5px';
      paddingInput.value = '8';
      fire(paddingInput, 'input');

      expect(component.style.padding).toBe('8px');
      expect(component.style.paddingLeft).toBe('8px');
    });

    it('individual side (padding-right) applies only that side', () => {
      const rightInput = input('padding-right', '0');
      addControlListeners(component, controlsContainer, addListenersFn);

      rightInput.value = '12';
      fire(rightInput, 'input');

      expect(component.style.paddingRight).toBe('12px');
    });
  });

  describe('typography', () => {
    it('alignment sets textAlign on the component and nested .rt-block-content', () => {
      const inner = document.createElement('span');
      inner.className = 'rt-block-content';
      component.appendChild(inner);
      const alignSel = select('alignment', ['left', 'center', 'right'], 'left');
      addControlListeners(component, controlsContainer, addListenersFn);

      alignSel.value = 'center';
      fire(alignSel, 'change');

      expect(component.style.textAlign).toBe('center');
      expect(inner.style.textAlign).toBe('center');
    });

    it('font-size with no active selection falls back to whole-component styling', () => {
      const sizeInput = input('font-size', '16');
      select('font-size-unit', ['px', 'rem'], 'px');
      addControlListeners(component, controlsContainer, addListenersFn);

      sizeInput.value = '24';
      fire(sizeInput, 'input');

      expect(component.style.fontSize).toBe('24px');
    });

    it('font-weight with no active selection falls back to whole-component styling', () => {
      const weightSel = select('font-weight', ['normal', 'bold'], 'normal');
      addControlListeners(component, controlsContainer, addListenersFn);

      weightSel.value = 'bold';
      fire(weightSel, 'change');

      expect(component.style.fontWeight).toBe('bold');
    });

    it('font-family updates the component and nested .rt-block-content', () => {
      const inner = document.createElement('span');
      inner.className = 'rt-block-content';
      component.appendChild(inner);
      const familySel = select('font-family', ['Arial', 'Georgia'], 'Arial');
      addControlListeners(component, controlsContainer, addListenersFn);

      familySel.value = 'Georgia';
      fire(familySel, 'change');

      expect(component.style.fontFamily).toBe('Georgia');
      expect(inner.style.fontFamily).toBe('Georgia');
    });

    it('text color with no active selection falls back to whole-component styling and syncs picker<->hex', () => {
      const picker = input('text-color', '#000000');
      const hex = input('text-color-value', '#000000');
      addControlListeners(component, controlsContainer, addListenersFn);

      picker.value = '#123456';
      fire(picker, 'input');

      expect(component.style.color).toBe('rgb(18, 52, 86)');
      expect(hex.value).toBe('#123456');
    });
  });

  describe('border', () => {
    it('applies border width with unit', () => {
      const widthInput = input('border-width', '1');
      select('border-width-unit', ['px'], 'px');
      addControlListeners(component, controlsContainer, addListenersFn);

      widthInput.value = '3';
      fire(widthInput, 'input');

      expect(component.style.borderWidth).toBe('3px');
    });

    it('applies border style', () => {
      const styleSel = select('border-style', ['solid', 'dashed'], 'solid');
      addControlListeners(component, controlsContainer, addListenersFn);

      styleSel.value = 'dashed';
      fire(styleSel, 'change');

      expect(component.style.borderStyle).toBe('dashed');
    });

    it('border color two-way syncs picker and hex', () => {
      const picker = input('border-color', '#000000');
      const hex = input('border-color-value', '#000000');
      addControlListeners(component, controlsContainer, addListenersFn);

      hex.value = '#abcdef';
      fire(hex, 'input');

      expect(component.style.borderColor).toBe('rgb(171, 205, 239)');
      expect(picker.value).toBe('#abcdef');
    });

    it('applies border radius with unit', () => {
      const radiusInput = input('border-radius', '0');
      select('border-radius-unit', ['px', '%'], '%');
      addControlListeners(component, controlsContainer, addListenersFn);

      radiusInput.value = '50';
      fire(radiusInput, 'input');

      expect(component.style.borderRadius).toBe('50%');
    });
  });

  describe('display', () => {
    it('maps "inline" intent to inline-block on the DOM and records the intent', () => {
      const displaySel = select(
        'display',
        ['inline', 'block', 'flex'],
        'block'
      );
      addControlListeners(component, controlsContainer, addListenersFn);

      displaySel.value = 'inline';
      fire(displaySel, 'change');

      expect(component.style.display).toBe('inline-block');
      expect(component.dataset.displayIntent).toBe('inline');
    });

    it('clears the inline intent flag for non-inline selections', () => {
      const displaySel = select(
        'display',
        ['inline', 'block', 'flex'],
        'inline'
      );
      component.dataset.displayIntent = 'inline';
      addControlListeners(component, controlsContainer, addListenersFn);

      displaySel.value = 'flex';
      fire(displaySel, 'change');

      expect(component.style.display).toBe('flex');
      expect(component.dataset.displayIntent).toBeUndefined();
    });
  });

  describe('flex sub-controls', () => {
    it('applies flex-direction, align-items, justify-content independently', () => {
      const dir = select('flex-direction', ['row', 'column'], 'row');
      const align = select(
        'align-items',
        ['flex-start', 'center'],
        'flex-start'
      );
      const justify = select(
        'justify-content',
        ['flex-start', 'space-between'],
        'flex-start'
      );
      addControlListeners(component, controlsContainer, addListenersFn);

      dir.value = 'column';
      fire(dir, 'change');
      align.value = 'center';
      fire(align, 'change');
      justify.value = 'space-between';
      fire(justify, 'change');

      expect(component.style.flexDirection).toBe('column');
      expect(component.style.alignItems).toBe('center');
      expect(component.style.justifyContent).toBe('space-between');
    });
  });

  describe('debounced state capture', () => {
    it('captures history and dispatches a design change 300ms after the last change, batching bursts', () => {
      jest.useFakeTimers();
      const widthInput = input('width', '100');
      addControlListeners(component, controlsContainer, addListenersFn);

      widthInput.value = '110';
      fire(widthInput, 'input');
      jest.advanceTimersByTime(100);
      widthInput.value = '120';
      fire(widthInput, 'input'); // resets the debounce window

      jest.advanceTimersByTime(299);
      expect(Canvas.historyManager.captureState).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1);
      expect(Canvas.historyManager.captureState).toHaveBeenCalledTimes(1);
      expect(Canvas.dispatchDesignChange).toHaveBeenCalledTimes(1);

      jest.useRealTimers();
    });
  });
});
