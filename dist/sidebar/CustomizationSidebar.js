export class CustomizationSidebar {
  static init() {
    this.sidebarElement = document.getElementById('customization');
    this.controlsContainer = document.getElementById('controls');
    this.componentNameHeader = document.getElementById('component-name');
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
  static showSidebar(componentId) {
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
    // Convert the background color to hex format
    const colorHex = CustomizationSidebar.rgbToHex(styles.backgroundColor);
    // Set the color input to the component's background color in hex format
    const colorInput = document.getElementById('color');
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
  static rgbToHex(rgb) {
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
  static createControl(label, id, type, value, attributes = {}) {
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
    const input = wrapper.querySelector('input');
    const unitSelect = wrapper.querySelector(`#${id}-unit`);
    if (input) {
      Object.keys(attributes).forEach(key => {
        input.setAttribute(key, attributes[key].toString());
      });
    }
    // If it's a color input, update the hex code display
    const colorinput = wrapper.querySelector('input[type="color"]');
    const hexInput = wrapper.querySelector('#color-value');
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
  static createSelectControl(label, id, currentValue, options) {
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
  static addListeners(component) {
    var _a, _b, _c, _d, _e, _f, _g;
    const controls = {
      width: document.getElementById('width'),
      height: document.getElementById('height'),
      color: document.getElementById('color'),
      margin: document.getElementById('margin'),
      padding: document.getElementById('padding'),
      alignment: document.getElementById('alignment'),
      fontSize: document.getElementById('font-size'),
    };
    if (!controls) return;
    (_a = controls.width) === null || _a === void 0
      ? void 0
      : _a.addEventListener('input', () => {
          const unit = document.getElementById('width-unit').value;
          component.style.width = `${controls.width.value}${unit}`;
        });
    (_b = controls.height) === null || _b === void 0
      ? void 0
      : _b.addEventListener('input', () => {
          const unit = document.getElementById('height-unit').value;
          component.style.height = `${controls.height.value}${unit}`;
        });
    (_c = controls.color) === null || _c === void 0
      ? void 0
      : _c.addEventListener('input', () => {
          component.style.backgroundColor = controls.color.value;
          const colorValueSpan = document.querySelector('#color-value');
          if (colorValueSpan) {
            colorValueSpan.textContent = controls.color.value; // Update color hex code display
          }
        });
    (_d = controls.margin) === null || _d === void 0
      ? void 0
      : _d.addEventListener('input', () => {
          const unit = document.getElementById('margin-unit').value;
          component.style.margin = `${controls.margin.value}${unit}`;
        });
    (_e = controls.padding) === null || _e === void 0
      ? void 0
      : _e.addEventListener('input', () => {
          const unit = document.getElementById('padding-unit').value;
          component.style.padding = `${controls.padding.value}${unit}`;
        });
    (_f = controls.alignment) === null || _f === void 0
      ? void 0
      : _f.addEventListener('change', () => {
          component.style.textAlign = controls.alignment.value;
        });
    (_g = controls.fontSize) === null || _g === void 0
      ? void 0
      : _g.addEventListener('input', () => {
          const unit = document.getElementById('font-size-unit').value;
          component.style.fontSize = `${controls.fontSize.value}${unit}`;
        });
  }
}
