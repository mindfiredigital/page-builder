import { TwoColumnContainer } from '../../components/TwoColumnContainer.js';
import { ThreeColumnContainer } from '../../components/ThreeColumnContainer.js';
import { ButtonComponent } from '../../components/ButtonComponent.js';
// ─────────────────────────────────────────────────────────────────────────────
// MultiColumnContainer mock (shared base for TwoCol & ThreeCol)
// ─────────────────────────────────────────────────────────────────────────────
jest.mock('../../services/MultiColumnContainer', () => {
  return {
    MultiColumnContainer: class {
      constructor(columns, className) {
        this.columns = columns;
        this.className = className;
      }
      create() {
        const wrapper = document.createElement('div');
        wrapper.classList.add(this.className);
        for (let i = 0; i < this.columns; i++) {
          const col = document.createElement('div');
          col.classList.add('column');
          wrapper.appendChild(col);
        }
        return wrapper;
      }
    },
  };
});
// ─────────────────────────────────────────────────────────────────────────────
// TwoColumnContainer
// ─────────────────────────────────────────────────────────────────────────────
describe('TwoColumnContainer', () => {
  let twoCol;
  beforeEach(() => {
    twoCol = new TwoColumnContainer();
  });
  it('should instantiate without errors', () => {
    expect(twoCol).toBeInstanceOf(TwoColumnContainer);
  });
  it('create() should return an element with class "twoCol-component"', () => {
    const el = twoCol.create();
    expect(el.classList.contains('twoCol-component')).toBe(true);
  });
  it('create() should produce exactly 2 column children', () => {
    const el = twoCol.create();
    const cols = el.querySelectorAll('.column');
    expect(cols.length).toBe(2);
  });
  it('should return an HTMLElement', () => {
    const el = twoCol.create();
    expect(el).toBeInstanceOf(HTMLElement);
  });
  it('each column should be a div', () => {
    const el = twoCol.create();
    const cols = el.querySelectorAll('.column');
    cols.forEach(col => expect(col.tagName).toBe('DIV'));
  });
});
// ─────────────────────────────────────────────────────────────────────────────
// ThreeColumnContainer
// ─────────────────────────────────────────────────────────────────────────────
describe('ThreeColumnContainer', () => {
  let threeCol;
  beforeEach(() => {
    threeCol = new ThreeColumnContainer();
  });
  it('should instantiate without errors', () => {
    expect(threeCol).toBeInstanceOf(ThreeColumnContainer);
  });
  it('create() should return an element with class "threeCol-component"', () => {
    const el = threeCol.create();
    expect(el.classList.contains('threeCol-component')).toBe(true);
  });
  it('create() should produce exactly 3 column children', () => {
    const el = threeCol.create();
    const cols = el.querySelectorAll('.column');
    expect(cols.length).toBe(3);
  });
  it('should return an HTMLElement', () => {
    const el = threeCol.create();
    expect(el).toBeInstanceOf(HTMLElement);
  });
  it('each column should be a div', () => {
    const el = threeCol.create();
    const cols = el.querySelectorAll('.column');
    cols.forEach(col => expect(col.tagName).toBe('DIV'));
  });
});
// ─────────────────────────────────────────────────────────────────────────────
// ButtonComponent
// ─────────────────────────────────────────────────────────────────────────────
describe('ButtonComponent', () => {
  let buttonComponent;
  beforeEach(() => {
    buttonComponent = new ButtonComponent();
  });
  it('should instantiate without errors', () => {
    expect(buttonComponent).toBeInstanceOf(ButtonComponent);
  });
  it('create() should return a button element', () => {
    const el = buttonComponent.create();
    expect(el.tagName).toBe('BUTTON');
  });
  it('create() should have class "button-component"', () => {
    const el = buttonComponent.create();
    expect(el.classList.contains('button-component')).toBe(true);
  });
  it('create() should use default label "Click Me"', () => {
    const el = buttonComponent.create();
    expect(el.innerText).toBe('Click Me');
  });
  it('create() should use provided label', () => {
    const el = buttonComponent.create('Submit');
    expect(el.innerText).toBe('Submit');
  });
  it('create() should apply padding style', () => {
    const el = buttonComponent.create();
    expect(el.style.padding).toBe('10px 20px');
  });
  it('create() should apply fontSize style', () => {
    const el = buttonComponent.create();
    expect(el.style.fontSize).toBe('14px');
  });
  it('create() should apply cursor pointer style', () => {
    const el = buttonComponent.create();
    expect(el.style.cursor).toBe('pointer');
  });
  it('create() with empty string label should produce empty button text', () => {
    const el = buttonComponent.create('');
    expect(el.innerText).toBe('');
  });
});
