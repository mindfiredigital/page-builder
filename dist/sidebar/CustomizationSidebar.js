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
    });
    this.createControl('Height', 'height', 'number', component.offsetHeight, {
      min: 0,
      max: 1000,
    });
    this.createControl('Color', 'color', 'color', styles.backgroundColor);
    this.createControl(
      'Margin',
      'margin',
      'number',
      parseInt(styles.margin) || 0
    );
    this.createControl(
      'Padding',
      'padding',
      'number',
      parseInt(styles.padding) || 0
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
      parseInt(styles.fontSize) || 16
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
    wrapper.innerHTML = `
        <label for="${id}">${label}:</label>
        <input type="${type}" id="${id}" value="${value}">
      `;
    const input = wrapper.querySelector('input');
    if (input) {
      Object.keys(attributes).forEach(key => {
        input.setAttribute(key, attributes[key].toString());
      });
    }
    this.controlsContainer.appendChild(wrapper);
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
          component.style.width = `${controls.width.value}px`;
        });
    (_b = controls.height) === null || _b === void 0
      ? void 0
      : _b.addEventListener('input', () => {
          component.style.height = `${controls.height.value}px`;
        });
    (_c = controls.color) === null || _c === void 0
      ? void 0
      : _c.addEventListener('input', () => {
          component.style.backgroundColor = controls.color.value;
        });
    (_d = controls.margin) === null || _d === void 0
      ? void 0
      : _d.addEventListener('input', () => {
          component.style.margin = `${controls.margin.value}px`;
        });
    (_e = controls.padding) === null || _e === void 0
      ? void 0
      : _e.addEventListener('input', () => {
          component.style.padding = `${controls.padding.value}px`;
        });
    (_f = controls.alignment) === null || _f === void 0
      ? void 0
      : _f.addEventListener('change', () => {
          component.style.textAlign = controls.alignment.value;
        });
    (_g = controls.fontSize) === null || _g === void 0
      ? void 0
      : _g.addEventListener('input', () => {
          component.style.fontSize = `${controls.fontSize.value}px`;
        });
  }
}
