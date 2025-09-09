var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
import { Canvas } from '../canvas/Canvas.js';
import { debounce } from '../utils/utilityFunctions.js';
import LayersViewController from './LayerViewController.js';
import { TableComponent } from '../components/TableComponent.js';
import { svgs } from '../icons/svgs.js';
import { TextComponent } from '../components/TextComponent.js';
import { HeaderComponent } from '../components/HeaderComponent.js';
export class CustomizationSidebar {
  static init(
    customComponentsConfig,
    editable,
    BasicComponent,
    showAttributeTab
  ) {
    this.sidebarElement = document.getElementById('customization');
    this.controlsContainer = document.getElementById('controls');
    this.componentNameHeader = document.getElementById('component-name');
    this.customComponentsConfig = customComponentsConfig;
    this.basicComponentsConfig = BasicComponent;
    this.editable = editable;
    this.showAttributeTab = showAttributeTab;
    if (!this.sidebarElement || !this.controlsContainer) {
      console.error('CustomizationSidebar: Required elements not found.');
      return;
    }
    // Initialize LayersViewController
    this.layersViewController = new LayersViewController();
    // Create functionality panel
    this.functionsPanel = document.createElement('div');
    this.functionsPanel.id = 'functions-panel';
    this.functionsPanel.className = 'dropdown-panel';
    this.functionsPanel.style.display = 'none';
    this.layersModeToggle = document.createElement('div');
    this.layersModeToggle.className = 'layers-mode-toggle';
    this.layersModeToggle.innerHTML = `
        <button id="customize-tab" title="Customize" class="active">${svgs.settings}</button>
        <button id="attribute-tab" title="Attribute" >${svgs.attribute}</button>
        <button id="layers-tab" title="Layers"> ${svgs.menu} </button>
    `;
    this.sidebarElement.insertBefore(
      this.layersModeToggle,
      this.componentNameHeader
    );
    this.sidebarElement.appendChild(this.controlsContainer);
    this.sidebarElement.appendChild(this.functionsPanel);
    this.controlsContainer.style.display = 'block';
    this.layersView = document.createElement('div');
    this.layersView.id = 'layers-view';
    this.layersView.className = 'layers-view hidden';
    this.sidebarElement.appendChild(this.layersView);
    const customizeTab = this.layersModeToggle.querySelector('#customize-tab');
    const attributeTab = this.layersModeToggle.querySelector('#attribute-tab');
    const layersTab = this.layersModeToggle.querySelector('#layers-tab');
    if (this.editable === false && showAttributeTab === true) {
      customizeTab.style.display = 'none';
      layersTab.style.display = 'none';
      attributeTab.classList.add('active');
      customizeTab.classList.remove('active');
      layersTab.classList.remove('active');
      this.switchToAttributeMode();
    } else {
      customizeTab.addEventListener('click', () =>
        this.switchToCustomizeMode()
      );
      attributeTab.addEventListener('click', () => {
        this.switchToAttributeMode();
      });
      layersTab.addEventListener('click', () => this.switchToLayersMode());
    }
  }
  // --- Tab Switching Logic ---
  static switchToCustomizeMode() {
    const customizeTab = document.getElementById('customize-tab');
    const attributeTab = document.getElementById('attribute-tab');
    const layersTab = document.getElementById('layers-tab');
    const layersView = document.getElementById('layers-view');
    const componentName = document.getElementById('component-name');
    customizeTab.classList.add('active');
    attributeTab.classList.remove('active');
    layersTab.classList.remove('active');
    layersView.style.display = 'none';
    this.controlsContainer.style.display = 'block';
    this.functionsPanel.style.display = 'none';
    componentName.style.display = 'block';
    if (this.selectedComponent) {
      this.populateCssControls(this.selectedComponent);
    }
  }
  static switchToAttributeMode() {
    const customizeTab = document.getElementById('customize-tab');
    const attributeTab = document.getElementById('attribute-tab');
    const layersTab = document.getElementById('layers-tab');
    const layersView = document.getElementById('layers-view');
    const componentName = document.getElementById('component-name');
    attributeTab.classList.add('active');
    customizeTab.classList.remove('active');
    layersTab.classList.remove('active');
    layersView.style.display = 'none'; // Hide layers view
    this.functionsPanel.style.display = 'block';
    this.controlsContainer.style.display = 'none';
    componentName.style.display = 'block';
    // Populate functionality controls if component is selected
    if (this.selectedComponent) {
      this.populateFunctionalityControls(this.selectedComponent);
    }
  }
  static switchToLayersMode() {
    const customizeTab = document.getElementById('customize-tab');
    const attributeTab = document.getElementById('attribute-tab');
    const layersTab = document.getElementById('layers-tab');
    const layersView = document.getElementById('layers-view');
    const componentName = document.getElementById('component-name');
    layersTab.classList.add('active');
    attributeTab.classList.remove('active');
    customizeTab.classList.remove('active');
    // Hide both dropdown panels
    this.controlsContainer.style.display = 'none';
    this.functionsPanel.style.display = 'none';
    layersView.style.display = 'block'; // Show layers view
    componentName.style.display = 'none'; // Hide component name header
    LayersViewController.updateLayersView();
  }
  // --- Sidebar Display Management ---
  static showSidebar(componentId) {
    const component = document.getElementById(componentId);
    if (!component) {
      console.error(`Component with ID "${componentId}" not found.`);
      return;
    }
    if (this.editable === false && this.showAttributeTab !== true) {
      return;
    }
    this.selectedComponent = component;
    this.sidebarElement.style.display = 'block';
    this.sidebarElement.classList.add('visible');
    const menuButton = document.getElementById('menu-btn');
    if (menuButton) {
      menuButton.style.backgroundColor = '#e2e8f0';
      menuButton.style.borderColor = '#cbd5e1';
    }
    this.componentNameHeader.textContent = `Component: ${componentId}`;
    if (this.editable === false && this.showAttributeTab === true) {
      this.switchToAttributeMode();
      return;
    }
    this.switchToCustomizeMode();
  }
  // --- Populate CSS Controls ---
  static populateCssControls(component) {
    this.controlsContainer.innerHTML = '';
    const styles = getComputedStyle(component);
    const isCanvas = component.id.toLowerCase() === 'canvas';
    // Re-create all CSS controls
    this.createSelectControl('Display', 'display', styles.display || 'block', [
      'block',
      'inline',
      'inline-block',
      'flex',
      'grid',
      'none',
    ]);
    if (styles.display === 'flex' || component.style.display === 'flex') {
      this.createSelectControl(
        'Flex Direction',
        'flex-direction',
        styles.flexDirection || 'row',
        ['row', 'row-reverse', 'column', 'column-reverse']
      );
      this.createSelectControl(
        'Align Items',
        'align-items',
        styles.alignItems || 'stretch',
        ['stretch', 'flex-start', 'flex-end', 'center', 'baseline']
      );
      this.createSelectControl(
        'Justify Content',
        'justify-content',
        styles.justifyContent || 'flex-start',
        [
          'flex-start',
          'flex-end',
          'center',
          'space-between',
          'space-around',
          'space-evenly',
        ]
      );
    }
    if (!isCanvas) {
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
    }
    this.createControl(
      'Background Color',
      'background-color', // Changed ID to be more specific
      'color',
      styles.backgroundColor
    );
    this.createSelectControl('Text Alignment', 'alignment', styles.textAlign, [
      'left',
      'center',
      'right',
    ]);
    this.createSelectControl('Font Family', 'font-family', styles.fontFamily, [
      'Arial',
      'Verdana',
      'Helvetica',
      'Times New Roman',
      'Georgia',
      'Courier New',
      'sans-serif',
      'serif',
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
    this.createSelectControl('Font Weight', 'font-weight', styles.fontWeight, [
      'normal',
      'bold',
      'bolder',
      'lighter',
      '100',
      '200',
      '300',
      '400',
      '500',
      '600',
      '700',
      '800',
      '900',
    ]);
    this.createControl(
      'Text Color',
      'text-color',
      'color',
      styles.color || '#000000'
    );
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
    this.createControl(
      'Border Color',
      'border-color',
      'color',
      styles.borderColor || '#000000'
    );
    // Update color input value to hex for background color
    const bgColorInput = document.getElementById('background-color');
    if (bgColorInput) {
      bgColorInput.value = CustomizationSidebar.rgbToHex(
        styles.backgroundColor
      );
    }
    // Update color input value to hex for text color
    const textColorInput = document.getElementById('text-color');
    if (textColorInput) {
      textColorInput.value = CustomizationSidebar.rgbToHex(styles.color);
    }
    // Update color input value to hex for border color
    const borderColorInput = document.getElementById('border-color');
    if (borderColorInput) {
      borderColorInput.value = CustomizationSidebar.rgbToHex(
        styles.borderColor
      );
    }
    this.addListeners(component);
  }
  static handleInputTrigger(event) {
    return __awaiter(this, void 0, void 0, function* () {
      var _a, _b, _c;
      const component = CustomizationSidebar.selectedComponent;
      if (!component) return;
      let componentConfig;
      if (component.classList.contains('table-component')) {
        componentConfig =
          (_a = CustomizationSidebar.basicComponentsConfig) === null ||
          _a === void 0
            ? void 0
            : _a.components.find(comp => comp.name === 'table');
      } else if (component.classList.contains('text-component')) {
        componentConfig =
          (_b = CustomizationSidebar.basicComponentsConfig) === null ||
          _b === void 0
            ? void 0
            : _b.components.find(comp => comp.name === 'text');
      } else if (component.classList.contains('header-component')) {
        componentConfig =
          (_c = CustomizationSidebar.basicComponentsConfig) === null ||
          _c === void 0
            ? void 0
            : _c.components.find(comp => comp.name === 'header');
      }
      console.log(componentConfig);
      if (componentConfig && componentConfig.globalExecuteFunction) {
        const inputValues = {};
        const allInputs =
          CustomizationSidebar.functionsPanel.querySelectorAll(
            '.attribute-input'
          );
        allInputs.forEach(input => {
          const inputEl = input;
          inputValues[inputEl.id] = inputEl.value;
        });
        const result = yield componentConfig.globalExecuteFunction(inputValues);
        const tableInstance = new TableComponent();
        const textInstance = new TextComponent();
        const headerInstance = new HeaderComponent();
        if (result) {
          textInstance.seedFormulaValues(result);
          tableInstance.seedFormulaValues(result);
          headerInstance.seedFormulaValues(result);
          Canvas.historyManager.captureState();
        }
        textInstance.updateInputValues(inputValues);
        tableInstance.updateInputValues(inputValues);
        headerInstance.updateInputValues(inputValues);
      }
    });
  }
  // Add this new private helper method inside your class
  // Replace your existing createAttributeControls method with this improved version
  static createAttributeControls(attribute) {
    const box = document.createElement('div');
    box.className = 'attribute-input-container';
    box.innerHTML = `
    <div class="attribute-header">
      <label for="${attribute.key}" class="attribute-label">${attribute.title}</label>
      ${!attribute.editable ? '<span class="readonly-badge">Read Only</span>' : ''}
    </div>
    <div class="attribute-input-wrapper">
      <input 
        type="text" 
        class="attribute-input" 
        id="${attribute.key}"  
        ${!attribute.editable ? 'disabled readonly' : ''} 
        value="${attribute.default_value || ''}" 
        placeholder="Enter ${attribute.title.toLowerCase()}..."
      >
    </div>
  `;
    this.functionsPanel.appendChild(box);
    const inputElement = document.getElementById(attribute.key);
    if (attribute.editable !== false) {
      const eventConfigurator = document.createElement('div');
      eventConfigurator.className = 'event-configurator';
      eventConfigurator.innerHTML = `
      <div class="event-trigger-section">
        <div class="trigger-header">
          <label class="trigger-label">Trigger Event:</label>
        </div>
        <div class="trigger-select-wrapper">
          <select class="event-selector" id="event-selector-${attribute.key}">
            <option value="input">On Input (Real-time)</option>
            <option value="change">On Change</option>
            <option value="blur">On Focus Lost</option>
            <option value="keyup">On Key Release</option>
            <option value="click">On Click</option>
          </select>
          <div class="select-arrow">▼</div>
        </div>
      </div>
    `;
      box.appendChild(eventConfigurator);
      const eventSelector = document.getElementById(
        `event-selector-${attribute.key}`
      );
      const setupListener = eventToListen => {
        const eventTypes = ['input', 'change', 'blur', 'keyup', 'click'];
        eventTypes.forEach(eventType => {
          inputElement.removeEventListener(eventType, this.handleInputTrigger);
        });
        inputElement.addEventListener(eventToListen, this.handleInputTrigger);
        // Visual feedback for active trigger
        box.setAttribute('data-trigger', eventToListen);
      };
      eventSelector.addEventListener('change', () => {
        var _a;
        const selectedEvent = eventSelector.value;
        setupListener(selectedEvent);
        // Add visual feedback animation
        (_a = eventSelector.parentElement) === null || _a === void 0
          ? void 0
          : _a.classList.add('trigger-changed');
        setTimeout(() => {
          var _a;
          (_a = eventSelector.parentElement) === null || _a === void 0
            ? void 0
            : _a.classList.remove('trigger-changed');
        }, 300);
      });
      const defaultTrigger = 'input';
      eventSelector.value = defaultTrigger;
      setupListener(defaultTrigger);
      // Add focus/blur effects for better UX
      inputElement.addEventListener('focus', () => {
        box.classList.add('input-focused');
      });
      inputElement.addEventListener('blur', () => {
        box.classList.remove('input-focused');
      });
    }
  }
  static populateFunctionalityControls(component) {
    var _a, _b, _c, _d;
    this.functionsPanel.innerHTML = '';
    let componentConfig;
    let showModalButton = false;
    if (component.classList.contains('table-component')) {
      componentConfig =
        (_a = this.basicComponentsConfig) === null || _a === void 0
          ? void 0
          : _a.components.find(comp => comp.name === 'table');
      showModalButton = false;
    } else if (component.classList.contains('text-component')) {
      componentConfig =
        (_b = this.basicComponentsConfig) === null || _b === void 0
          ? void 0
          : _b.components.find(comp => comp.name === 'text');
      showModalButton = true;
    } else if (component.classList.contains('header-component')) {
      componentConfig =
        (_c = this.basicComponentsConfig) === null || _c === void 0
          ? void 0
          : _c.components.find(comp => comp.name === 'header');
      showModalButton = true;
    } else if (component.classList.contains('table-cell')) {
      showModalButton = true;
    } else if (component.classList.contains('custom-component')) {
      const componentType =
        (_d = Array.from(component.classList).find(cls =>
          cls.endsWith('-component')
        )) === null || _d === void 0
          ? void 0
          : _d.replace('-component', '');
      const customComponentsConfig =
        CustomizationSidebar.customComponentsConfig;
      if (
        componentType &&
        customComponentsConfig &&
        customComponentsConfig[componentType] &&
        customComponentsConfig[componentType].settingsComponentTagName
      ) {
        const settingsComponentTagName =
          customComponentsConfig[componentType].settingsComponentTagName;
        let settingsElement = this.functionsPanel.querySelector(
          settingsComponentTagName
        );
        if (!settingsElement) {
          settingsElement = document.createElement(settingsComponentTagName);
          this.functionsPanel.appendChild(settingsElement);
        }
        // Set the attribute as before.
        settingsElement.setAttribute(
          'data-settings',
          JSON.stringify({ targetComponentId: component.id })
        );
      }
    }
    if (
      componentConfig &&
      componentConfig.attributes &&
      componentConfig.attributes.length > 0
    ) {
      componentConfig.attributes.forEach(attribute => {
        if (attribute.type === 'Input') {
          this.createAttributeControls(attribute);
        }
      });
    }
    if (showModalButton && this.editable !== false) {
      const modalButton = document.createElement('button');
      modalButton.textContent = `Set ${component.classList[0].replace('-component', '')} Attribute`;
      modalButton.className = 'set-attribute-button';
      this.functionsPanel.appendChild(modalButton);
      modalButton.addEventListener('click', () => {
        if (component.classList.contains('text-component')) {
          const textComponentInstance = new TextComponent();
          textComponentInstance.handleTextClick(component);
        } else if (component.classList.contains('header-component')) {
          const headerComponentInstance = new HeaderComponent();
          headerComponentInstance.handleHeaderClick(component);
        } else if (component.classList.contains('table-cell')) {
          const tableComponent = new TableComponent();
          tableComponent.handleCellClick(component);
        }
      });
    } else if (!componentConfig) {
      this.functionsPanel.innerHTML =
        '<p>No specific settings for this component.</p>';
    }
  }
  static rgbToHex(rgb) {
    const result = rgb.match(
      /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.?\d*))?\)$/
    );
    if (!result) return rgb;
    const r = parseInt(result[1], 10);
    const g = parseInt(result[2], 10);
    const b = parseInt(result[3], 10);
    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()}`;
  }
  static createControl(label, id, type, value, attributes = {}) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('control-wrapper');
    const isNumber = type === 'number';
    if (isNumber && attributes.unit) {
      const unit = attributes.unit;
      wrapper.innerHTML = `
                <label for="${id}">${label}:</label>
                <div class="input-wrapper">
                  <input type="${type}" id="${id}" value="${value}">
                  <select id="${id}-unit">
                      <option value="px" ${unit === 'px' ? 'selected' : ''}>px</option>
                      <option value="rem" ${unit === 'rem' ? 'selected' : ''}>rem</option>
                      <option value="vh" ${unit === 'vh' ? 'selected' : ''}>vh</option>
                      <option value="%" ${unit === '%' ? 'selected' : ''}>%</option>
                  </select>
                </div
            `;
    } else {
      wrapper.innerHTML = `
        <label for="${id}">${label}:</label>
        <div class="input-wrapper">
          <input type="color" id="${id}" value="${value}">
          <input type="text" id="${id}-value" style="font-size: 0.8rem; width: 200px; margin-left: 8px;" value="${value}">
        </div>
      `;
    }
    const input = wrapper.querySelector('input');
    const unitSelect = wrapper.querySelector(`#${id}-unit`);
    if (input) {
      Object.keys(attributes).forEach(key => {
        input.setAttribute(key, attributes[key].toString());
      });
    }
    const colorInput = wrapper.querySelector(`input[type="color"]#${id}`);
    const hexInput = wrapper.querySelector(`#${id}-value`);
    if (colorInput) {
      colorInput.addEventListener('input', () => {
        if (hexInput) {
          hexInput.value = colorInput.value; // Update hex code display
        }
      });
    }
    if (hexInput) {
      hexInput.addEventListener('input', () => {
        if (colorInput) {
          colorInput.value = hexInput.value;
        }
      });
    }
    this.controlsContainer.appendChild(wrapper);
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
                <div class="input-wrapper">
                  <select id="${id}">${selectOptions}</select>
                </div>
            `;
    this.controlsContainer.appendChild(wrapper);
  }
  static addListeners(component) {
    var _a,
      _b,
      _c,
      _d,
      _e,
      _f,
      _g,
      _h,
      _j,
      _k,
      _l,
      _m,
      _o,
      _p,
      _q,
      _r,
      _s,
      _t,
      _u,
      _v;
    const controls = {
      width: document.getElementById('width'),
      height: document.getElementById('height'),
      backgroundColor: document.getElementById('background-color'),
      margin: document.getElementById('margin'),
      padding: document.getElementById('padding'),
      alignment: document.getElementById('alignment'),
      fontSize: document.getElementById('font-size'),
      fontWeight: document.getElementById('font-weight'),
      textColor: document.getElementById('text-color'),
      borderWidth: document.getElementById('border-width'),
      borderStyle: document.getElementById('border-style'),
      borderColor: document.getElementById('border-color'),
      display: document.getElementById('display'),
      fontFamily: document.getElementById('font-family'),
      flexDirection: document.getElementById('flex-direction'),
      alignItems: document.getElementById('align-items'),
      justifyContent: document.getElementById('justify-content'),
    };
    const captureStateDebounced = debounce(() => {
      Canvas.dispatchDesignChange();
      Canvas.historyManager.captureState();
    }, 300);
    // Attach listeners only if the element exists
    (_a = controls.width) === null || _a === void 0
      ? void 0
      : _a.addEventListener('input', () => {
          const unit = document.getElementById('width-unit').value;
          component.style.width = `${controls.width.value}${unit}`;
          captureStateDebounced();
        });
    (_b = controls.height) === null || _b === void 0
      ? void 0
      : _b.addEventListener('input', () => {
          const unit = document.getElementById('height-unit').value;
          component.style.height = `${controls.height.value}${unit}`;
          captureStateDebounced();
        });
    (_c = controls.backgroundColor) === null || _c === void 0
      ? void 0
      : _c.addEventListener('input', () => {
          component.style.backgroundColor = controls.backgroundColor.value;
          document.getElementById('background-color-value').value =
            controls.backgroundColor.value;
          captureStateDebounced();
        });
    (_d = document.getElementById('background-color-value')) === null ||
    _d === void 0
      ? void 0
      : _d.addEventListener('input', e => {
          const target = e.target;
          component.style.backgroundColor = target.value;
          document.getElementById('background-color').value = target.value;
          captureStateDebounced();
        });
    (_e = controls.margin) === null || _e === void 0
      ? void 0
      : _e.addEventListener('input', () => {
          const unit = document.getElementById('margin-unit').value;
          component.style.margin = `${controls.margin.value}${unit}`;
          captureStateDebounced();
        });
    (_f = controls.padding) === null || _f === void 0
      ? void 0
      : _f.addEventListener('input', () => {
          const unit = document.getElementById('padding-unit').value;
          component.style.padding = `${controls.padding.value}${unit}`;
          captureStateDebounced();
        });
    (_g = controls.alignment) === null || _g === void 0
      ? void 0
      : _g.addEventListener('change', () => {
          component.style.textAlign = controls.alignment.value;
          captureStateDebounced();
        });
    (_h = controls.fontSize) === null || _h === void 0
      ? void 0
      : _h.addEventListener('input', () => {
          const unit = document.getElementById('font-size-unit').value;
          component.style.fontSize = `${controls.fontSize.value}${unit}`;
          captureStateDebounced();
        });
    (_j = controls.fontWeight) === null || _j === void 0
      ? void 0
      : _j.addEventListener('change', () => {
          component.style.fontWeight = controls.fontWeight.value;
          captureStateDebounced();
        });
    (_k = controls.textColor) === null || _k === void 0
      ? void 0
      : _k.addEventListener('input', () => {
          component.style.color = controls.textColor.value;
          document.getElementById('text-color-value').value =
            controls.textColor.value;
          captureStateDebounced();
        });
    (_l = document.getElementById('text-color-value')) === null || _l === void 0
      ? void 0
      : _l.addEventListener('input', e => {
          const target = e.target;
          component.style.color = target.value;
          document.getElementById('text-color').value = target.value;
          captureStateDebounced();
        });
    (_m = controls.borderWidth) === null || _m === void 0
      ? void 0
      : _m.addEventListener('input', () => {
          const unit = document.getElementById('border-width-unit').value;
          component.style.borderWidth = `${controls.borderWidth.value}${unit}`;
          captureStateDebounced();
        });
    (_o = controls.borderStyle) === null || _o === void 0
      ? void 0
      : _o.addEventListener('change', () => {
          component.style.borderStyle = controls.borderStyle.value;
          captureStateDebounced();
        });
    (_p = controls.borderColor) === null || _p === void 0
      ? void 0
      : _p.addEventListener('input', () => {
          component.style.borderColor = controls.borderColor.value;
          document.getElementById('border-color-value').value =
            controls.borderColor.value;
          captureStateDebounced();
        });
    (_q = document.getElementById('border-color-value')) === null ||
    _q === void 0
      ? void 0
      : _q.addEventListener('input', e => {
          const target = e.target;
          component.style.borderColor = target.value;
          document.getElementById('border-color').value = target.value;
          captureStateDebounced();
        });
    (_r = controls.display) === null || _r === void 0
      ? void 0
      : _r.addEventListener('change', () => {
          component.style.display = controls.display.value;
          captureStateDebounced();
          this.populateCssControls(component);
        });
    (_s = controls.flexDirection) === null || _s === void 0
      ? void 0
      : _s.addEventListener('change', () => {
          component.style.flexDirection = controls.flexDirection.value;
          captureStateDebounced();
        });
    (_t = controls.alignItems) === null || _t === void 0
      ? void 0
      : _t.addEventListener('change', () => {
          component.style.alignItems = controls.alignItems.value;
          captureStateDebounced();
        });
    (_u = controls.fontFamily) === null || _u === void 0
      ? void 0
      : _u.addEventListener('change', () => {
          component.style.fontFamily = controls.fontFamily.value;
          captureStateDebounced();
        });
    (_v = controls.justifyContent) === null || _v === void 0
      ? void 0
      : _v.addEventListener('change', () => {
          component.style.justifyContent = controls.justifyContent.value;
          captureStateDebounced();
        });
  }
  static getLayersViewController() {
    return this.layersViewController;
  }
}
CustomizationSidebar.selectedComponent = null;
CustomizationSidebar.customComponentsConfig = null;
CustomizationSidebar.basicComponentsConfig = null;
CustomizationSidebar.showAttributeTab = undefined;
