import { HeaderComponent } from '../../components/HeaderComponent';

jest.mock('../../canvas/Canvas', () => ({
  Canvas: { dispatchDesignChange: jest.fn() },
}));

jest.mock('../../components/ModalManager', () => ({
  ModalComponent: jest.fn().mockImplementation(() => ({})),
}));

import { Canvas } from '../../canvas/Canvas';

describe('HeaderComponent', () => {
  let headerComponent: HeaderComponent;

  beforeEach(() => {
    headerComponent = new HeaderComponent();
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  // ── create() ────────────────────────────────────────────────────────────────
  describe('create()', () => {
    it('should return an h1 element by default', () => {
      const el = headerComponent.create();
      expect(el.tagName).toBe('H1');
    });

    it('should return the correct heading level element', () => {
      expect(headerComponent.create(2).tagName).toBe('H2');
      expect(headerComponent.create(3).tagName).toBe('H3');
    });

    it('should have class "header-component"', () => {
      const el = headerComponent.create();
      expect(el.classList.contains('header-component')).toBe(true);
    });

    it('should contain a span with class "component-text-content"', () => {
      const el = headerComponent.create();
      const span = el.querySelector('.component-text-content');
      expect(span).not.toBeNull();
    });

    it('should default text to "Header"', () => {
      const el = headerComponent.create();
      const span = el.querySelector(
        '.component-text-content'
      ) as HTMLSpanElement;
      expect(span.innerText).toBe('Header');
    });

    it('should use provided text', () => {
      const el = headerComponent.create(1, 'My Title');
      const span = el.querySelector(
        '.component-text-content'
      ) as HTMLSpanElement;
      expect(span.innerText).toBe('My Title');
    });

    it('span should be contentEditable', () => {
      const el = headerComponent.create();
      const span = el.querySelector(
        '.component-text-content'
      ) as HTMLSpanElement;
      expect(span.contentEditable).toBe('true');
    });

    it('span click should propagate to header element click', () => {
      const el = headerComponent.create();
      document.body.appendChild(el);
      const span = el.querySelector(
        '.component-text-content'
      ) as HTMLSpanElement;
      const clickMock = jest.fn();
      el.addEventListener('click', clickMock);
      span.click();
      expect(clickMock).toHaveBeenCalled();
    });

    it('should store provided headerAttributeConfig statically', () => {
      const config = [
        { key: 'k1', title: 'T1', type: 'Constant', value: 'v1' },
      ] as any;
      headerComponent.create(1, 'Header', config);
      expect(HeaderComponent.headerAttributeConfig).toEqual(config);
    });
  });

  // ── updateHeaderContent() ────────────────────────────────────────────────────
  describe('updateHeaderContent()', () => {
    it('should set data-attribute-key and data-attribute-type', () => {
      const el = headerComponent.create();
      document.body.appendChild(el);
      headerComponent.updateHeaderContent(el, {
        key: 'title',
        type: 'Constant',
        value: 'My Value',
        title: 'Title',
      } as any);
      expect(el.getAttribute('data-attribute-key')).toBe('title');
      expect(el.getAttribute('data-attribute-type')).toBe('Constant');
    });

    it('should update span text to value for Constant type', () => {
      const el = headerComponent.create();
      document.body.appendChild(el);
      headerComponent.updateHeaderContent(el, {
        key: 'k',
        type: 'Constant',
        value: '99',
        title: 'T',
      } as any);
      const span = el.querySelector('.component-text-content') as HTMLElement;
      expect(span.textContent).toBe('99');
    });

    it('should update span text to title for Formula type and style grey', () => {
      const el = headerComponent.create();
      document.body.appendChild(el);
      headerComponent.updateHeaderContent(el, {
        key: 'f',
        type: 'Formula',
        value: '',
        title: 'MyFormula',
      } as any);
      const span = el.querySelector('.component-text-content') as HTMLElement;
      expect(span.textContent).toBe('MyFormula');
      expect(el.style.color).toBe('rgb(188, 191, 198)');
    });

    it('should update span text to value for Input type', () => {
      const el = headerComponent.create();
      document.body.appendChild(el);
      headerComponent.updateHeaderContent(el, {
        key: 'n',
        type: 'Input',
        value: 'InputVal',
        title: 'T',
      } as any);
      const span = el.querySelector('.component-text-content') as HTMLElement;
      expect(span.textContent).toBe('InputVal');
    });

    it('should dispatch design change', () => {
      const el = headerComponent.create();
      document.body.appendChild(el);
      headerComponent.updateHeaderContent(el, {
        key: 'k',
        type: 'Constant',
        value: 'v',
        title: 'T',
      } as any);
      expect(Canvas.dispatchDesignChange).toHaveBeenCalled();
    });
  });

  // ── seedFormulaValues() ─────────────────────────────────────────────────────
  describe('seedFormulaValues()', () => {
    it('should update header text content for matching key', () => {
      const el = headerComponent.create();
      el.setAttribute('data-attribute-key', 'revenue');
      document.body.appendChild(el);
      headerComponent.seedFormulaValues({ revenue: 500 });
      const span = el.querySelector('.component-text-content') as HTMLElement;
      expect(span.textContent).toBe('500');
    });

    it('should set color to black for matched elements', () => {
      const el = headerComponent.create();
      el.setAttribute('data-attribute-key', 'revenue');
      document.body.appendChild(el);
      headerComponent.seedFormulaValues({ revenue: 100 });
      expect((el as HTMLElement).style.color).toBe('rgb(0, 0, 0)');
    });

    it('should NOT update elements with non-matching keys', () => {
      const el = headerComponent.create();
      el.setAttribute('data-attribute-key', 'otherKey');
      const span = el.querySelector('.component-text-content') as HTMLElement;
      span.textContent = 'original';
      document.body.appendChild(el);
      headerComponent.seedFormulaValues({ revenue: 500 });
      expect(span.textContent).toBe('original');
    });

    it('should dispatch design change', () => {
      headerComponent.seedFormulaValues({});
      expect(Canvas.dispatchDesignChange).toHaveBeenCalled();
    });
  });

  // ── updateInputValues() ─────────────────────────────────────────────────────
  describe('updateInputValues()', () => {
    it('should update text for Input-type elements with matching key', () => {
      const el = headerComponent.create();
      el.setAttribute('data-attribute-key', 'name');
      el.setAttribute('data-attribute-type', 'Input');
      document.body.appendChild(el);
      headerComponent.updateInputValues({ name: 'John' });
      const span = el.querySelector('.component-text-content') as HTMLElement;
      expect(span.textContent).toBe('John');
    });

    it('should NOT update non-Input type elements', () => {
      const el = headerComponent.create();
      el.setAttribute('data-attribute-key', 'name');
      el.setAttribute('data-attribute-type', 'Formula');
      const span = el.querySelector('.component-text-content') as HTMLElement;
      span.textContent = 'untouched';
      document.body.appendChild(el);
      headerComponent.updateInputValues({ name: 'Changed' });
      expect(span.textContent).toBe('untouched');
    });

    it('should dispatch design change', () => {
      headerComponent.updateInputValues({});
      expect(Canvas.dispatchDesignChange).toHaveBeenCalled();
    });
  });

  // ── static restore() ────────────────────────────────────────────────────────
  describe('static restore()', () => {
    it('should restore text from config for Formula type with default_value', () => {
      // create() first — it resets headerAttributeConfig to []
      const el = headerComponent.create();
      el.setAttribute('data-attribute-key', 'profit');
      el.setAttribute('data-attribute-type', 'Formula');
      document.body.appendChild(el);

      // Set config AFTER create() so it isn't wiped
      HeaderComponent.headerAttributeConfig = [
        {
          key: 'profit',
          title: 'Profit',
          type: 'Formula',
          default_value: '200',
        },
      ] as any;

      HeaderComponent.restore(el);
      const span = el.querySelector('.component-text-content') as HTMLElement;
      expect(span.textContent).toBe('200');
      expect(el.style.color).toBe('rgb(0, 0, 0)');
    });

    it('should style formula placeholder if no default_value', () => {
      const el = headerComponent.create();
      el.setAttribute('data-attribute-key', 'profit');
      el.setAttribute('data-attribute-type', 'Formula');
      document.body.appendChild(el);

      // Set config AFTER create()
      HeaderComponent.headerAttributeConfig = [
        { key: 'profit', title: 'Profit', type: 'Formula' },
      ] as any;

      HeaderComponent.restore(el);
      const span = el.querySelector('.component-text-content') as HTMLElement;
      expect(span.textContent).toBe('Profit');
      expect(el.style.color).toBe('rgb(188, 191, 198)');
    });

    it('should re-attach click listener on span after restore', () => {
      const el = headerComponent.create();
      document.body.appendChild(el);

      // Set config AFTER create()
      HeaderComponent.headerAttributeConfig = [];

      HeaderComponent.restore(el);
      const span = el.querySelector('.component-text-content') as HTMLElement;
      const parentClickMock = jest.fn();
      el.addEventListener('click', parentClickMock);
      span.click();
      expect(parentClickMock).toHaveBeenCalled();
    });
  });
});
