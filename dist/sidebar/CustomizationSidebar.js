export class CustomizationSidebar {
  static init() {
    this.sidebarElement = document.getElementById('customization');
    this.controlsContainer = document.getElementById('controls');
    if (!this.sidebarElement || !this.controlsContainer) {
      console.error('CustomizationSidebar: Required elements not found.');
      return;
    }
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
  static createControl(label, id, type, value, attributes = {}) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('control-wrapper');
    // Check if the control is a color input or a number input
    const isColor = type === 'color';
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
            <input type="${type}" id="${id}" value="${value}">
            ${isColor ? '<span id="color-value" style="font-size: 0.8rem;"></span>' : ''}
        `;
    }
    const input = wrapper.querySelector('input');
    const unitSelect = wrapper.querySelector(`#${id}-unit`);
    const colorValueSpan = wrapper.querySelector('#color-value');
    if (input) {
      Object.keys(attributes).forEach(key => {
        input.setAttribute(key, attributes[key].toString());
      });
    }
    // If it's a color input, update the hex code display
    if (colorValueSpan && isColor) {
      colorValueSpan.textContent = value;
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
