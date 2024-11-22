export class CustomizationSidebar {
  private static sidebarElement: HTMLElement;
  private static controlsContainer: HTMLElement;
  private static componentNameHeader: HTMLElement;

  static init() {
    this.sidebarElement = document.getElementById('customization')!;
    this.controlsContainer = document.getElementById('controls')!;
    this.componentNameHeader = document.getElementById('component-name')!;
    if (!this.sidebarElement || !this.controlsContainer) {
      console.error('CustomizationSidebar: Required elements not found.');
      return;
    }
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

    // Add event listeners for live updates
    this.addListeners(component);
  }

  static hideSidebar() {
    if (this.sidebarElement) {
      this.sidebarElement.style.display = 'none';
    }
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
    //const isColor = type === 'color';
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
      // Update hex code span when color input changes
      colorinput.addEventListener('input', () => {
        if (hexInput) {
          hexInput.value = colorinput.value; // Update hex code display
        }
        // Update component color
        const colorValueSpan = document.querySelector(
          '#color-value'
        ) as HTMLElement;
        if (colorValueSpan) {
          colorValueSpan.textContent = colorinput.value; // Update color hex code display
        }
      });
    }

    // If it's a hex code input, update the color input when the value changes
    if (hexInput) {
      hexInput.addEventListener('input', () => {
        if (colorinput) {
          colorinput.value = hexInput.value; // Update color input with the new hex code
        }
        // Update component color
        const colorValueSpan = document.querySelector(
          '#color-value'
        ) as HTMLElement;
        if (colorValueSpan) {
          colorValueSpan.textContent = hexInput.value; // Update color hex code display
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
    };

    if (!controls) return;

    controls.width?.addEventListener('input', () => {
      const unit = (document.getElementById('width-unit') as HTMLSelectElement)
        .value;
      component.style.width = `${controls.width.value}${unit}`;
    });
    controls.height?.addEventListener('input', () => {
      const unit = (document.getElementById('height-unit') as HTMLSelectElement)
        .value;
      component.style.height = `${controls.height.value}${unit}`;
    });
    controls.color?.addEventListener('input', () => {
      component.style.backgroundColor = controls.color.value;
      const colorValueSpan = document.querySelector('#color-value');
      if (colorValueSpan) {
        colorValueSpan.textContent = controls.color.value; // Update color hex code display
      }
    });
    controls.margin?.addEventListener('input', () => {
      const unit = (document.getElementById('margin-unit') as HTMLSelectElement)
        .value;
      component.style.margin = `${controls.margin.value}${unit}`;
    });
    controls.padding?.addEventListener('input', () => {
      const unit = (
        document.getElementById('padding-unit') as HTMLSelectElement
      ).value;
      component.style.padding = `${controls.padding.value}${unit}`;
    });
    controls.alignment?.addEventListener('change', () => {
      component.style.textAlign = controls.alignment.value;
    });
    controls.fontSize?.addEventListener('input', () => {
      const unit = (
        document.getElementById('font-size-unit') as HTMLSelectElement
      ).value;
      component.style.fontSize = `${controls.fontSize.value}${unit}`;
    });
  }
}
