import { Canvas } from '../canvas/Canvas';
import { debounce } from '../utils/utilityFunctions';
import LayersViewController from './LayerViewController';
import { TableComponent } from '../components/TableComponent';
import * as ReactDOM from 'react-dom/client';
import * as React from 'react';
import { svgs } from '../icons/svgs';

type ReactComponentType<P = {}> = React.ComponentType<P>;

interface CustomComponentConfig {
  [key: string]: {
    component: string;
    svg?: string;
    title?: string;
    settingsComponent?: ReactComponentType<{ targetComponentId: string }>;
    settingsComponentTagName?: string;
    props?: Record<string, any>;
  };
}

export class CustomizationSidebar {
  private static sidebarElement: HTMLElement;
  private static controlsContainer: HTMLElement;
  private static componentNameHeader: HTMLElement;

  private static layersModeToggle: HTMLDivElement;
  private static layersView: HTMLDivElement;
  private static layersViewController: LayersViewController;
  private static functionsPanel: HTMLDivElement;
  private static selectedComponent: HTMLElement | null = null;
  private static settingsReactRoot: ReactDOM.Root | null = null;
  private static customComponentsConfig: CustomComponentConfig | null = null;
  private static editable: boolean | null;

  static init(
    customComponentsConfig: CustomComponentConfig,
    editable: boolean | null
  ) {
    this.sidebarElement = document.getElementById('customization')!;
    this.controlsContainer = document.getElementById('controls')!;
    this.componentNameHeader = document.getElementById('component-name')!;
    this.customComponentsConfig = customComponentsConfig;
    this.editable = editable;

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
    const customizeTab = this.layersModeToggle.querySelector('#customize-tab')!;
    const attributeTab = this.layersModeToggle.querySelector('#attribute-tab')!;
    const layersTab = this.layersModeToggle.querySelector('#layers-tab')!;

    customizeTab.addEventListener('click', () => this.switchToCustomizeMode());
    attributeTab.addEventListener('click', () => {
      this.switchToAttributeMode();
    });
    layersTab.addEventListener('click', () => this.switchToLayersMode());

    // Add the close button to the sidebar
    // this.sidebarElement.appendChild(this.closeButton);
    // this.closeButton.textContent = '×'; // Close button symbol
    // this.closeButton.classList.add('close-button');

    // // Add the event listener to hide the sidebar when the close button is clicked
    // this.closeButton.addEventListener('click', () => {
    //   this.hideSidebar();
    // });
  }

  // --- Tab Switching Logic ---
  private static switchToCustomizeMode() {
    const customizeTab = document.getElementById('customize-tab')!;
    const attributeTab = document.getElementById('attribute-tab')!;
    const layersTab = document.getElementById('layers-tab')!;
    const layersView = document.getElementById('layers-view')!;
    const componentName = document.getElementById('component-name')!;
    // const expandConfig = document.getElementById('expand-config')!;

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

  private static switchToAttributeMode() {
    const customizeTab = document.getElementById('customize-tab')!;
    const attributeTab = document.getElementById('attribute-tab')!;
    const layersTab = document.getElementById('layers-tab')!;
    const layersView = document.getElementById('layers-view')!;
    const componentName = document.getElementById('component-name')!;

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

  private static switchToLayersMode() {
    const customizeTab = document.getElementById('customize-tab')!;
    const attributeTab = document.getElementById('attribute-tab')!;
    const layersTab = document.getElementById('layers-tab')!;
    const layersView = document.getElementById('layers-view')!;
    const componentName = document.getElementById('component-name')!;
    // const expandConfig = document.getElementById('expand-config')!;

    layersTab.classList.add('active');
    attributeTab.classList.remove('active');
    customizeTab.classList.remove('active');

    // expandConfig.style.display = 'none'; // Hide expand-config in layers mode

    // Hide both dropdown panels
    this.controlsContainer.style.display = 'none';
    this.functionsPanel.style.display = 'none';

    layersView.style.display = 'block'; // Show layers view
    componentName.style.display = 'none'; // Hide component name header

    LayersViewController.updateLayersView();
  }

  // --- Sidebar Display Management ---
  static showSidebar(componentId: string) {
    const component = document.getElementById(componentId);
    if (!component) {
      console.error(`Component with ID "${componentId}" not found.`);
      return;
    }
    if (this.editable === false) {
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

    this.switchToCustomizeMode();
  }

  // static hideSidebar() {
  //   if (this.sidebarElement) {
  //     this.sidebarElement.style.display = 'none';
  //     this.selectedComponent = null; // Clear selected component
  //   }
  // }

  // --- Populate CSS Controls ---
  private static populateCssControls(component: HTMLElement) {
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
    const bgColorInput = document.getElementById(
      'background-color'
    ) as HTMLInputElement;
    if (bgColorInput) {
      bgColorInput.value = CustomizationSidebar.rgbToHex(
        styles.backgroundColor
      );
    }
    // Update color input value to hex for text color
    const textColorInput = document.getElementById(
      'text-color'
    ) as HTMLInputElement;
    if (textColorInput) {
      textColorInput.value = CustomizationSidebar.rgbToHex(styles.color);
    }
    // Update color input value to hex for border color
    const borderColorInput = document.getElementById(
      'border-color'
    ) as HTMLInputElement;
    if (borderColorInput) {
      borderColorInput.value = CustomizationSidebar.rgbToHex(
        styles.borderColor
      );
    }

    this.addListeners(component);
  }

  private static populateFunctionalityControls(component: HTMLElement) {
    this.functionsPanel.innerHTML = '';
    if (component.classList.contains('table-component')) {
      const table = component.querySelector('table');
      if (table) {
        const currentRows = table.rows.length;
        const currentCols = table.rows[0]?.cells.length || 0;
        const rowsWrapper = document.createElement('div');
        rowsWrapper.classList.add('control-wrapper');
        rowsWrapper.innerHTML = `
                  <label for="table-rows">Number of Rows:</label>
                  <div class="input-wrapper">
                    <input type="number" id="table-rows" value="${currentRows}" min="0">
                  </div>
              `;
        this.functionsPanel.appendChild(rowsWrapper);

        const rowsInput = rowsWrapper.querySelector(
          '#table-rows'
        ) as HTMLInputElement;
        rowsInput.addEventListener(
          'input',
          debounce(() => {
            const newRowCount = parseInt(rowsInput.value);
            if (!isNaN(newRowCount)) {
              const tableInstance = new TableComponent();
              tableInstance.setRowCount(table, newRowCount);
              Canvas.historyManager.captureState();
            }
          }, 300)
        );
        const colsWrapper = document.createElement('div');
        colsWrapper.classList.add('control-wrapper');
        colsWrapper.innerHTML = `
                  <label for="table-cols">Number of Columns:</label>
                  <div class="input-wrapper">
                    <input type="number" id="table-cols" value="${currentCols}" min="0">
                  </div>
              `;
        this.functionsPanel.appendChild(colsWrapper);

        const colsInput = colsWrapper.querySelector(
          '#table-cols'
        ) as HTMLInputElement;
        colsInput.addEventListener(
          'input',
          debounce(() => {
            const newColCount = parseInt(colsInput.value);
            if (!isNaN(newColCount)) {
              const tableInstance = new TableComponent();
              tableInstance.setColumnCount(table, newColCount);
              Canvas.historyManager.captureState();
            }
          }, 300)
        );

        //header row
        const headerWrapper = document.createElement('div');
        headerWrapper.classList.add('control-wrapper');
        headerWrapper.innerHTML = `
          <label for="table-header">Create Header:</label>
          <div class="input-wrapper">
            <input type="checkbox" id="table-header"  min="0">
          </div
        `;
        this.functionsPanel.appendChild(headerWrapper);
        const headerInput = headerWrapper.querySelector(
          '#table-header'
        ) as HTMLInputElement;
        headerInput.addEventListener(
          'input',
          debounce(() => {
            const isHeader = headerInput.checked;
            if (isHeader) {
              const tableInstance = new TableComponent();
              tableInstance.createHeder(table);
              Canvas.historyManager.captureState();
            }
          }, 300)
        );
      }
    } else if (component.classList.contains('custom-component')) {
      const componentType = Array.from(component.classList)
        .find(cls => cls.endsWith('-component'))
        ?.replace('-component', '');

      const customComponentsConfig =
        CustomizationSidebar.customComponentsConfig;
      if (
        componentType &&
        customComponentsConfig &&
        customComponentsConfig[componentType] &&
        // Check for the string-based tag name property.
        customComponentsConfig[componentType].settingsComponentTagName
      ) {
        // Get the string tag name from the config.
        const settingsComponentTagName =
          customComponentsConfig[componentType].settingsComponentTagName;

        // Now, use the string variable to query for the element.
        let settingsElement = this.functionsPanel.querySelector(
          settingsComponentTagName
        );

        if (!settingsElement) {
          // Use the string variable to create the element.
          settingsElement = document.createElement(settingsComponentTagName);
          this.functionsPanel.appendChild(settingsElement);
        }

        // Set the attribute as before.
        settingsElement.setAttribute(
          'data-settings',
          JSON.stringify({ targetComponentId: component.id })
        );
      }
    } else {
      console.log(
        'DEBUG: Component is not a custom component and not a table component.'
      );
      this.functionsPanel.innerHTML =
        '<p>No specific settings for this component.</p>';
    }
  }

  static rgbToHex(rgb: string): string {
    const result = rgb.match(
      /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.?\d*))?\)$/
    );
    if (!result) return rgb;
    const r = parseInt(result[1], 10);
    const g = parseInt(result[2], 10);
    const b = parseInt(result[3], 10);

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

    const input = wrapper.querySelector('input') as HTMLInputElement;
    const unitSelect = wrapper.querySelector(
      `#${id}-unit`
    ) as HTMLSelectElement;

    if (input) {
      Object.keys(attributes).forEach(key => {
        input.setAttribute(key, attributes[key].toString());
      });
    }

    const colorInput = wrapper.querySelector(
      `input[type="color"]#${id}`
    ) as HTMLInputElement;
    const hexInput = wrapper.querySelector(`#${id}-value`) as HTMLInputElement;

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
          `<option value="${option}" ${
            option === currentValue ? 'selected' : ''
          }>${option}</option>`
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

  private static addListeners(component: HTMLElement) {
    const controls: { [key: string]: HTMLInputElement | HTMLSelectElement } = {
      width: document.getElementById('width') as HTMLInputElement,
      height: document.getElementById('height') as HTMLInputElement,
      backgroundColor: document.getElementById(
        'background-color'
      ) as HTMLInputElement,
      margin: document.getElementById('margin') as HTMLInputElement,
      padding: document.getElementById('padding') as HTMLInputElement,
      alignment: document.getElementById('alignment') as HTMLSelectElement,
      fontSize: document.getElementById('font-size') as HTMLInputElement,
      textColor: document.getElementById('text-color') as HTMLInputElement,
      borderWidth: document.getElementById('border-width') as HTMLInputElement,
      borderStyle: document.getElementById('border-style') as HTMLSelectElement,
      borderColor: document.getElementById('border-color') as HTMLInputElement,
      display: document.getElementById('display') as HTMLSelectElement,
      fontFamily: document.getElementById('font-family') as HTMLSelectElement,
    };

    const captureStateDebounced = debounce(() => {
      Canvas.historyManager.captureState();
    }, 300);

    // Attach listeners only if the element exists
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

    controls.backgroundColor?.addEventListener('input', () => {
      component.style.backgroundColor = controls.backgroundColor.value;
      (
        document.getElementById('background-color-value') as HTMLInputElement
      ).value = controls.backgroundColor.value;
      captureStateDebounced();
    });
    (
      document.getElementById('background-color-value') as HTMLInputElement
    )?.addEventListener('input', e => {
      const target = e.target as HTMLInputElement;
      component.style.backgroundColor = target.value;
      (document.getElementById('background-color') as HTMLInputElement).value =
        target.value;
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

    controls.textColor?.addEventListener('input', () => {
      component.style.color = controls.textColor.value;
      (document.getElementById('text-color-value') as HTMLInputElement).value =
        controls.textColor.value;
      captureStateDebounced();
    });
    (
      document.getElementById('text-color-value') as HTMLInputElement
    )?.addEventListener('input', e => {
      const target = e.target as HTMLInputElement;
      component.style.color = target.value;
      (document.getElementById('text-color') as HTMLInputElement).value =
        target.value;
      captureStateDebounced();
    });

    controls.borderWidth?.addEventListener('input', () => {
      const unit = (
        document.getElementById('border-width-unit') as HTMLSelectElement
      ).value;
      component.style.borderWidth = `${controls.borderWidth.value}${unit}`;
      captureStateDebounced();
    });

    controls.borderStyle?.addEventListener('change', () => {
      component.style.borderStyle = controls.borderStyle.value;
      captureStateDebounced();
    });

    controls.borderColor?.addEventListener('input', () => {
      component.style.borderColor = controls.borderColor.value;
      (
        document.getElementById('border-color-value') as HTMLInputElement
      ).value = controls.borderColor.value;
      captureStateDebounced();
    });
    (
      document.getElementById('border-color-value') as HTMLInputElement
    )?.addEventListener('input', e => {
      const target = e.target as HTMLInputElement;
      component.style.borderColor = target.value;
      (document.getElementById('border-color') as HTMLInputElement).value =
        target.value;
      captureStateDebounced();
    });

    controls.display?.addEventListener('change', () => {
      component.style.display = controls.display.value;
      captureStateDebounced();
    });

    controls.fontFamily?.addEventListener('change', () => {
      component.style.fontFamily = controls.fontFamily.value;
      captureStateDebounced();
    });
  }

  static getLayersViewController(): LayersViewController {
    return this.layersViewController;
  }
}
