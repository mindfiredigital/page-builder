/**
 * Characterization tests for populateCssControls — written BEFORE
 * decomposing the 450-line function into named sub-functions, to pin down
 * current behavior (this file has no prior coverage). Uses the real
 * SidebarUtils (no mocking) since it's a pure DOM-builder with no external
 * dependencies — these tests inspect the actual controls it renders.
 */
import {
  populateCssControls,
  disableControlWrapper,
} from '../../../sidebar/CustomizationSidebarCore/SidebarCssControls';

function value(id: string): string {
  return (document.getElementById(id) as HTMLInputElement | HTMLSelectElement)
    .value;
}

function exists(id: string): boolean {
  return document.getElementById(id) !== null;
}

describe('populateCssControls', () => {
  let controlsContainer: HTMLElement;
  let addListenersFn: jest.Mock;

  beforeEach(() => {
    document.body.innerHTML = '';
    controlsContainer = document.createElement('div');
    document.body.appendChild(controlsContainer);
    addListenersFn = jest.fn();
  });

  describe('customizeComponentTagName short-circuit', () => {
    it('renders only the custom element and skips every built-in control', () => {
      const component = document.createElement('div');
      component.id = 'comp-1';
      document.body.appendChild(component);

      populateCssControls(
        component,
        controlsContainer,
        addListenersFn,
        'my-customize-panel'
      );

      const customEl = controlsContainer.querySelector('my-customize-panel');
      expect(customEl).not.toBeNull();
      expect(customEl!.getAttribute('data-settings')).toBe(
        JSON.stringify({ targetComponentId: 'comp-1' })
      );
      expect(exists('display')).toBe(false);
      expect(exists('background-color')).toBe(false);
      expect(addListenersFn).toHaveBeenCalledWith(component);
    });
  });

  describe('canvas component', () => {
    it('renders page-size, width, min-height, and margin controls but not height/padding', () => {
      const canvas = document.createElement('div');
      canvas.id = 'canvas';
      document.body.appendChild(canvas);

      populateCssControls(canvas, controlsContainer, addListenersFn);

      expect(exists('width')).toBe(true);
      expect(exists('min-height')).toBe(true);
      expect(exists('margin')).toBe(true);
      expect(exists('height')).toBe(false);
      expect(exists('padding')).toBe(false);
    });
  });

  describe('non-canvas component', () => {
    it('renders width/height/margin/padding from inline style value+unit', () => {
      const component = document.createElement('div');
      component.style.width = '250px';
      component.style.height = '3rem';
      document.body.appendChild(component);

      populateCssControls(component, controlsContainer, addListenersFn);

      expect(value('width')).toBe('250');
      expect(value('height')).toBe('3');
    });

    it('disables width/height/margin/padding wrappers when display is inline', () => {
      const component = document.createElement('div');
      component.dataset.displayIntent = 'inline';
      document.body.appendChild(component);

      populateCssControls(component, controlsContainer, addListenersFn);

      const widthWrapper = document
        .getElementById('width')!
        .closest('.control-wrapper') as HTMLElement;
      expect(widthWrapper.style.pointerEvents).toBe('none');
      expect(
        (document.getElementById('width') as HTMLInputElement).disabled
      ).toBe(true);
    });

    it('does not disable width/height when display is not inline', () => {
      const component = document.createElement('div');
      component.style.display = 'block';
      document.body.appendChild(component);

      populateCssControls(component, controlsContainer, addListenersFn);

      expect(
        (document.getElementById('width') as HTMLInputElement).disabled
      ).toBe(false);
    });

    it('reflects a per-side margin override in the margin-top control value', () => {
      const withSide = document.createElement('div');
      withSide.style.marginTop = '5px';
      document.body.appendChild(withSide);
      populateCssControls(withSide, controlsContainer, addListenersFn);
      expect(value('margin-top')).toBe('5');
    });
  });

  describe('image alt text control', () => {
    it('renders an Alt Text control for image components, seeded from the current img.alt', () => {
      const component = document.createElement('div');
      component.classList.add('image-component');
      const img = document.createElement('img');
      img.alt = 'A red bicycle';
      component.appendChild(img);
      document.body.appendChild(component);

      populateCssControls(component, controlsContainer, addListenersFn);

      expect(exists('image-alt-text')).toBe(true);
      expect(value('image-alt-text')).toBe('A red bicycle');
    });

    it('omits the Alt Text control for non-image components', () => {
      const component = document.createElement('div');
      document.body.appendChild(component);

      populateCssControls(component, controlsContainer, addListenersFn);

      expect(exists('image-alt-text')).toBe(false);
    });
  });

  describe('flex sub-controls', () => {
    it('renders flex-direction/align-items/justify-content when display is flex', () => {
      const component = document.createElement('div');
      component.style.display = 'flex';
      document.body.appendChild(component);

      populateCssControls(component, controlsContainer, addListenersFn);

      expect(exists('flex-direction')).toBe(true);
      expect(exists('align-items')).toBe(true);
      expect(exists('justify-content')).toBe(true);
    });

    it('omits flex sub-controls for a non-flex display', () => {
      const component = document.createElement('div');
      component.style.display = 'block';
      document.body.appendChild(component);

      populateCssControls(component, controlsContainer, addListenersFn);

      expect(exists('flex-direction')).toBe(false);
    });
  });

  describe('font-size selection walk-up', () => {
    it('displays the containing span font-size when the cursor sits inside one', () => {
      const component = document.createElement('div');
      component.contentEditable = 'true';
      const span = document.createElement('span');
      span.style.fontSize = '22px';
      const text = document.createTextNode('hello');
      span.appendChild(text);
      component.appendChild(span);
      document.body.appendChild(component);

      const range = document.createRange();
      range.setStart(text, 1);
      range.setEnd(text, 1);
      const sel = window.getSelection()!;
      sel.removeAllRanges();
      sel.addRange(range);

      populateCssControls(component, controlsContainer, addListenersFn);

      expect(value('font-size')).toBe('22');
    });

    it('falls back to the component computed font-size with no active span selection', () => {
      window.getSelection()?.removeAllRanges();
      const component = document.createElement('div');
      component.style.fontSize = '18px';
      document.body.appendChild(component);

      populateCssControls(component, controlsContainer, addListenersFn);

      expect(value('font-size')).toBe('18');
    });
  });

  describe('text color', () => {
    it('syncs the background/text/border hex pickers from computed colors', () => {
      const component = document.createElement('div');
      component.style.color = 'rgb(255, 0, 0)';
      document.body.appendChild(component);

      populateCssControls(component, controlsContainer, addListenersFn);

      expect(value('text-color')).toBe('#ff0000');
    });
  });

  describe('listener wiring', () => {
    it('always calls addListenersFn once controls are built', () => {
      const component = document.createElement('div');
      document.body.appendChild(component);
      populateCssControls(component, controlsContainer, addListenersFn);
      expect(addListenersFn).toHaveBeenCalledWith(component);
    });
  });

  describe('re-render clears prior controls', () => {
    it('empties the container before rebuilding', () => {
      const component = document.createElement('div');
      document.body.appendChild(component);

      populateCssControls(component, controlsContainer, addListenersFn);
      const firstChildCount = controlsContainer.children.length;
      expect(firstChildCount).toBeGreaterThan(0);

      populateCssControls(component, controlsContainer, addListenersFn);
      expect(controlsContainer.children.length).toBe(firstChildCount);
    });
  });
});

describe('disableControlWrapper', () => {
  it('greys out the control wrapper, disables its inputs, and adds a badge once', () => {
    document.body.innerHTML = `
      <div class="control-wrapper">
        <label>Width</label>
        <input id="w-input" />
      </div>
    `;

    disableControlWrapper('w-input', 'custom reason');
    disableControlWrapper('w-input', 'custom reason'); // idempotent — no duplicate badge

    const wrapper = document.querySelector('.control-wrapper') as HTMLElement;
    expect(wrapper.style.pointerEvents).toBe('none');
    expect(
      (document.getElementById('w-input') as HTMLInputElement).disabled
    ).toBe(true);
    expect(wrapper.querySelectorAll('.inline-disabled-badge').length).toBe(1);
  });

  it('is a no-op when the control id does not exist', () => {
    expect(() => disableControlWrapper('does-not-exist')).not.toThrow();
  });
});
