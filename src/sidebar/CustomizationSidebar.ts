import { Canvas } from '../canvas/Canvas';
import { debounce } from '../utils/utilityFunctions';

export class CustomizationSidebar {
  private static sidebarElement: HTMLElement;
  private static controlsContainer: HTMLElement;
  private static componentNameHeader: HTMLElement;
  private static closeButton: HTMLElement;

  static init() {
    this.sidebarElement = document.getElementById('customization')!;
    this.controlsContainer = document.getElementById('controls')!;
    this.componentNameHeader = document.getElementById('component-name')!;
    this.closeButton = document.createElement('button'); // Create close button

    if (!this.sidebarElement || !this.controlsContainer) {
      console.error('CustomizationSidebar: Required elements not found.');
      return;
    }

    // Add the close button to the sidebar
    this.sidebarElement.appendChild(this.closeButton);
    this.closeButton.textContent = '×'; // Close button symbol
    this.closeButton.classList.add('close-button');

    // Add the event listener to hide the sidebar when the close button is clicked
    this.closeButton.addEventListener('click', () => {
      this.hideSidebar();
    });
  }

  static showSidebar(componentId: string) {
    const component = document.getElementById(componentId);
    console.log(`Showing sidebar for: ${componentId}`);
    if (!component) {
      console.error(`Component with ID "${componentId}" not found.`);
      return;
    }

    this.sidebarElement.style.display = 'block';
    this.controlsContainer.innerHTML = '';

    // Set the component name in the header
    this.componentNameHeader.textContent = `Component: ${componentId}`;

    // Dynamically create controls
    const styles = getComputedStyle(component);
    //Controls Display Control
    this.createSelectControl('Display', 'display', styles.display || 'block', [
      'block',
      'inline',
      'inline-block',
      'flex',
      'grid',
      'none',
    ]);
    this.createControl('Width', 'width', 'number', component.offsetWidth, {
      min: 0,
      max: 1000,
      unit: 'px',
    });
    this.createControl('Height', 'height', 'number', component.offsetHeight, {
      min: 0,
      max: 1000,
      unit: 'px',
    });
    this.createControl('Color', 'color', 'color', styles.backgroundColor);
    this.createControl(
      'Margin',
      'margin',
      'number',
      parseInt(styles.margin) || 0,
      {
        min: 0,
        max: 1000,
        unit: 'px',
      }
    );
    this.createControl(
      'Padding',
      'padding',
      'number',
      parseInt(styles.padding) || 0,
      {
        min: 0,
        max: 1000,
        unit: 'px',
      }
    );
    this.createSelectControl('Text Alignment', 'alignment', styles.textAlign, [
      'left',
      'center',
      'right',
    ]);
    this.createControl(
      'Font Size',
      'font-size',
      'number',
      parseInt(styles.fontSize) || 16,
      {
        min: 0,
        max: 100,
        unit: 'px',
      }
    );
    //Controls for text color editing
    this.createControl(
      'Text Color',
      'text-color',
      'color',
      styles.color || '#000000'
    );
    //Controls for border width
    this.createControl(
      'Border Width',
      'border-width',
      'number',
      parseInt(styles.borderWidth) || 0,
      {
        min: 0,
        max: 20,
        unit: 'px',
      }
    );
    //Controls for Border Style (solid, dashed, dotted, etc.)
    this.createSelectControl(
      'Border Style',
      'border-style',
      styles.borderStyle || 'none',
      [
        'none',
        'solid',
        'dashed',
        'dotted',
        'double',
        'groove',
        'ridge',
        'inset',
        'outset',
      ]
    );
    // Controls for Border Color
    this.createControl(
      'Border Color',
      'border-color',
      'color',
      styles.borderColor || '#000000'
    );

    // Convert the background color to hex format
    const colorHex = CustomizationSidebar.rgbToHex(styles.backgroundColor);

    // Set the color input to the component's background color in hex format
    const colorInput = document.getElementById('color') as HTMLInputElement;
    if (colorInput) {
      colorInput.value = colorHex; // Set to valid hex color value
    }
    // Add event listeners for live updates
    this.addListeners(component);
  }

  static hideSidebar() {
    if (this.sidebarElement) {
      this.sidebarElement.style.display = 'none';
    }
  }

  static rgbToHex(rgb: string): string {
    const result = rgb.match(
      /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.?\d*))?\)$/
    );
    if (!result) return rgb; // If the format is not matched, return the original string

    const r = parseInt(result[1], 10);
    const g = parseInt(result[2], 10);
    const b = parseInt(result[3], 10);

    // Ensure it's in the correct hex format
    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()}`;
  }

  private static createControl(
    label: string,
    id: string,
    type: string,
    value: string | number,
    attributes: Record<string, string | number> = {}
  ) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('control-wrapper');

    // Check if the control is a color input or a number input
    const isNumber = type === 'number';

    // Format value for number inputs and add a unit dropdown
    if (isNumber && attributes.unit) {
      const unit = attributes.unit;
      wrapper.innerHTML = `
                  <label for="${id}">${label}:</label>
                  <input type="${type}" id="${id}" value="${value}">
                  <select id="${id}-unit">
                      <option value="px" ${unit === 'px' ? 'selected' : ''}>px</option>
                      <option value="rem" ${unit === 'rem' ? 'selected' : ''}>rem</option>
                      <option value="vh" ${unit === 'vh' ? 'selected' : ''}>vh</option>
                      <option value="%" ${unit === '%' ? 'selected' : ''}>%</option>
                  </select>
              `;
    } else {
      wrapper.innerHTML = `
          <label for="${id}">${label}:</label>
          <input type="color" id="${id}" value="${value}">
          <input type="text" id="color-value" style="font-size: 0.8rem; width: 80px; margin-left: 8px;" value="${value}">
        `;
    }

    const input = wrapper.querySelector('input') as HTMLInputElement;
    const unitSelect = wrapper.querySelector(
      `#${id}-unit`
    ) as HTMLSelectElement;

    if (input) {
      Object.keys(attributes).forEach(key => {
        input.setAttribute(key, attributes[key].toString());
      });
    }

    // If it's a color input, update the hex code display
    const colorinput = wrapper.querySelector(
      'input[type="color"]'
    ) as HTMLInputElement;
    const hexInput = wrapper.querySelector('#color-value') as HTMLInputElement;

    if (colorinput) {
      colorinput.addEventListener('input', () => {
        if (hexInput) {
          hexInput.value = colorinput.value; // Update hex code display
        }
      });
    }

    if (hexInput) {
      hexInput.addEventListener('input', () => {
        if (colorinput) {
          colorinput.value = hexInput.value; // Update color input with the new hex code
        }
      });
    }

    this.controlsContainer.appendChild(wrapper);

    // Update value dynamically when unit changes
    if (unitSelect) {
      unitSelect.addEventListener('change', () => {
        const unit = unitSelect.value;
        const currentValue = parseInt(input.value);
        input.value = `${currentValue}${unit}`;
      });
    }
  }

  private static createSelectControl(
    label: string,
    id: string,
    currentValue: string,
    options: string[]
  ) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('control-wrapper');
    const selectOptions = options
      .map(
        option =>
          `<option value="${option}" ${option === currentValue ? 'selected' : ''}>${option}</option>`
      )
      .join('');
    wrapper.innerHTML = `
              <label for="${id}">${label}:</label>
              <select id="${id}">${selectOptions}</select>
          `;
    this.controlsContainer.appendChild(wrapper);
  }

  private static addListeners(component: HTMLElement) {
    const controls = {
      width: document.getElementById('width') as HTMLInputElement,
      height: document.getElementById('height') as HTMLInputElement,
      color: document.getElementById('color') as HTMLInputElement,
      margin: document.getElementById('margin') as HTMLInputElement,
      padding: document.getElementById('padding') as HTMLInputElement,
      alignment: document.getElementById('alignment') as HTMLSelectElement,
      fontSize: document.getElementById('font-size') as HTMLInputElement,
      textColor: document.getElementById('text-color') as HTMLInputElement,
      borderWidth: document.getElementById('border-width') as HTMLInputElement,
      borderStyle: document.getElementById('border-style') as HTMLSelectElement,
      borderColor: document.getElementById('border-color') as HTMLInputElement,
      display: document.getElementById('display') as HTMLSelectElement,
    };

    if (!controls) return;

    const captureStateDebounced = debounce(() => {
      Canvas.historyManager.captureState();
    }, 300);

    controls.width?.addEventListener('input', () => {
      const unit = (document.getElementById('width-unit') as HTMLSelectElement)
        .value;
      component.style.width = `${controls.width.value}${unit}`;
      captureStateDebounced();
    });

    controls.height?.addEventListener('input', () => {
      const unit = (document.getElementById('height-unit') as HTMLSelectElement)
        .value;
      component.style.height = `${controls.height.value}${unit}`;
      captureStateDebounced();
    });

    controls.color?.addEventListener('input', () => {
      component.style.backgroundColor = controls.color.value;
      const colorValueSpan = document.querySelector('#color-value');
      if (colorValueSpan) {
        colorValueSpan.textContent = controls.color.value; // Update color hex code display
      }
      captureStateDebounced();
    });

    controls.margin?.addEventListener('input', () => {
      const unit = (document.getElementById('margin-unit') as HTMLSelectElement)
        .value;
      component.style.margin = `${controls.margin.value}${unit}`;
      captureStateDebounced();
    });

    controls.padding?.addEventListener('input', () => {
      const unit = (
        document.getElementById('padding-unit') as HTMLSelectElement
      ).value;
      component.style.padding = `${controls.padding.value}${unit}`;
      captureStateDebounced();
    });

    controls.alignment?.addEventListener('change', () => {
      component.style.textAlign = controls.alignment.value;
      captureStateDebounced();
    });

    controls.fontSize?.addEventListener('input', () => {
      const unit = (
        document.getElementById('font-size-unit') as HTMLSelectElement
      ).value;
      component.style.fontSize = `${controls.fontSize.value}${unit}`;
      captureStateDebounced();
    });

    //Controls for editing text color
    controls.textColor?.addEventListener('input', () => {
      component.style.color = controls.textColor.value;
      captureStateDebounced();
    });

    //Controls for editing border width
    controls.borderWidth?.addEventListener('input', () => {
      const unit = (
        document.getElementById('border-width-unit') as HTMLSelectElement
      ).value;
      component.style.borderWidth = `${controls.borderWidth.value}${unit}`;
      captureStateDebounced();
    });

    //Controls for border style
    controls.borderStyle?.addEventListener('change', () => {
      component.style.borderStyle = controls.borderStyle.value;
      captureStateDebounced();
    });

    //Controls for border color
    controls.borderColor?.addEventListener('input', () => {
      component.style.borderColor = controls.borderColor.value;
      captureStateDebounced();
    });

    //Controls for display edit
    controls.display?.addEventListener('change', () => {
      component.style.display = controls.display.value;
      captureStateDebounced();
    });
  }
}
