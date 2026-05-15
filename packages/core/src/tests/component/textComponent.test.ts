import { TextComponent } from '../../components/TextComponent';

jest.mock('../../canvas/Canvas', () => ({
  Canvas: { dispatchDesignChange: jest.fn() },
}));

jest.mock('../../components/ModalManager', () => ({
  ModalComponent: jest.fn().mockImplementation(() => ({})),
}));

import { Canvas } from '../../canvas/Canvas';

describe('TextComponent', () => {
  let textComponent: TextComponent;

  beforeEach(() => {
    textComponent = new TextComponent();
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  // ── create() ────────────────────────────────────────────────────────────────
  describe('create()', () => {
    it('should return a div with class "text-component"', () => {
      const el = textComponent.create();
      expect(el.tagName).toBe('DIV');
      expect(el.classList.contains('text-component')).toBe(true);
    });

    it('should render a span with class "component-text-content"', () => {
      const el = textComponent.create();
      const span = el.querySelector(
        '.component-text-content'
      ) as HTMLSpanElement;
      expect(span).not.toBeNull();
    });

    it('should default text to "Sample Text"', () => {
      const el = textComponent.create();
      const span = el.querySelector(
        '.component-text-content'
      ) as HTMLSpanElement;
      expect(span.innerText).toBe('Sample Text');
    });

    it('should use constructor-injected text', () => {
      const comp = new TextComponent('Hello World');
      const el = comp.create();
      const span = el.querySelector(
        '.component-text-content'
      ) as HTMLSpanElement;
      expect(span.innerText).toBe('Hello World');
    });

    it('span should be contentEditable', () => {
      const el = textComponent.create();
      const span = el.querySelector(
        '.component-text-content'
      ) as HTMLSpanElement;
      expect(span.contentEditable).toBe('true');
    });

    it('should store provided textAttributeConfig statically', () => {
      const config = [
        { key: 'k1', title: 'T1', type: 'Constant', value: 'v1' },
      ] as any;
      textComponent.create(config);
      expect(TextComponent.textAttributeConfig).toEqual(config);
    });

    it('span click should trigger parent element click', () => {
      const el = textComponent.create();
      document.body.appendChild(el);
      const span = el.querySelector(
        '.component-text-content'
      ) as HTMLSpanElement;
      const clickHandler = jest.fn();
      el.addEventListener('click', clickHandler);
      span.click();
      expect(clickHandler).toHaveBeenCalled();
    });
  });

  // ── setText() ───────────────────────────────────────────────────────────────
  describe('setText()', () => {
    it('should update internal text used by create()', () => {
      textComponent.setText('New Text');
      const el = textComponent.create();
      const span = el.querySelector(
        '.component-text-content'
      ) as HTMLSpanElement;
      expect(span.innerText).toBe('New Text');
    });
  });

  // ── updateTextContent() ─────────────────────────────────────────────────────
  describe('updateTextContent()', () => {
    it('should set data attributes on element', () => {
      const el = textComponent.create();
      document.body.appendChild(el);
      const attr = {
        key: 'price',
        type: 'Constant',
        value: '100',
        title: 'Price',
      } as any;
      textComponent.updateTextContent(el, attr);
      expect(el.getAttribute('data-attribute-key')).toBe('price');
      expect(el.getAttribute('data-attribute-type')).toBe('Constant');
    });

    it('should set span text to value for Constant type', () => {
      const el = textComponent.create();
      document.body.appendChild(el);
      const attr = {
        key: 'k',
        type: 'Constant',
        value: '42',
        title: 'MyConst',
      } as any;
      textComponent.updateTextContent(el, attr);
      const span = el.querySelector('.component-text-content') as HTMLElement;
      expect(span.textContent).toBe('42');
    });

    it('should set span text to title for Formula type and style grey', () => {
      const el = textComponent.create();
      document.body.appendChild(el);
      const attr = {
        key: 'f',
        type: 'Formula',
        value: '',
        title: 'CalcFormula',
      } as any;
      textComponent.updateTextContent(el, attr);
      const span = el.querySelector('.component-text-content') as HTMLElement;
      expect(span.textContent).toBe('CalcFormula');
      expect(el.style.color).toBe('rgb(188, 191, 198)');
    });

    it('should dispatch design change', () => {
      const el = textComponent.create();
      document.body.appendChild(el);
      textComponent.updateTextContent(el, {
        key: 'k',
        type: 'Input',
        value: 'x',
        title: 'T',
      } as any);
      expect(Canvas.dispatchDesignChange).toHaveBeenCalled();
    });
  });

  // ── seedFormulaValues() ─────────────────────────────────────────────────────
  describe('seedFormulaValues()', () => {
    it('should update text content for matching key', () => {
      const el = textComponent.create();
      el.setAttribute('data-attribute-key', 'total');
      document.body.appendChild(el);
      textComponent.seedFormulaValues({ total: 999 });
      const span = el.querySelector('.component-text-content') as HTMLElement;
      expect(span.textContent).toBe('999');
    });

    it('should set color to black for matched elements', () => {
      const el = textComponent.create();
      el.setAttribute('data-attribute-key', 'total');
      document.body.appendChild(el);
      textComponent.seedFormulaValues({ total: 1 });
      expect((el as HTMLElement).style.color).toBe('rgb(0, 0, 0)');
    });

    it('should dispatch design change', () => {
      textComponent.seedFormulaValues({});
      expect(Canvas.dispatchDesignChange).toHaveBeenCalled();
    });
  });

  // ── updateInputValues() ─────────────────────────────────────────────────────
  describe('updateInputValues()', () => {
    it('should update text for Input-type elements with matching key', () => {
      const el = textComponent.create();
      el.setAttribute('data-attribute-key', 'qty');
      el.setAttribute('data-attribute-type', 'Input');
      document.body.appendChild(el);
      textComponent.updateInputValues({ qty: '5' });
      const span = el.querySelector('.component-text-content') as HTMLElement;
      expect(span.textContent).toBe('5');
    });

    it('should NOT update text for non-Input elements', () => {
      const el = textComponent.create();
      el.setAttribute('data-attribute-key', 'qty');
      el.setAttribute('data-attribute-type', 'Formula');
      document.body.appendChild(el);
      (el.querySelector('.component-text-content') as HTMLElement).textContent =
        'original';
      textComponent.updateInputValues({ qty: 'changed' });
      expect(
        (el.querySelector('.component-text-content') as HTMLElement).textContent
      ).toBe('original');
    });

    it('should dispatch design change', () => {
      textComponent.updateInputValues({});
      expect(Canvas.dispatchDesignChange).toHaveBeenCalled();
    });
  });

  // ── static restore() ────────────────────────────────────────────────────────
  describe('static restore()', () => {
    it('should restore text from attribute config for Formula type with default_value', () => {
      // create() first — it resets textAttributeConfig to []
      const el = textComponent.create();
      el.setAttribute('data-attribute-key', 'rev');
      el.setAttribute('data-attribute-type', 'Formula');
      document.body.appendChild(el);

      // Set config AFTER create() so it isn't wiped
      TextComponent.textAttributeConfig = [
        { key: 'rev', title: 'Revenue', type: 'Formula', default_value: '500' },
      ] as any;

      TextComponent.restore(el);
      const span = el.querySelector('.component-text-content') as HTMLElement;
      expect(span.textContent).toBe('500');
    });

    it('should style formula placeholder if no default_value', () => {
      const el = textComponent.create();
      el.setAttribute('data-attribute-key', 'rev');
      el.setAttribute('data-attribute-type', 'Formula');
      document.body.appendChild(el);

      // Set config AFTER create()
      TextComponent.textAttributeConfig = [
        { key: 'rev', title: 'Revenue', type: 'Formula' },
      ] as any;

      TextComponent.restore(el);
      const span = el.querySelector('.component-text-content') as HTMLElement;
      expect(span.textContent).toBe('Revenue');
      expect(el.style.color).toBe('rgb(188, 191, 198)');
    });
  });
});
