import { Canvas } from '../canvas/Canvas';
import { debounce } from '../utils/utilityFunctions';
import LayersViewController from './LayerViewController';
import { TableComponent } from '../components/TableComponent'; // Import the TableComponent

// Ensure this interface matches the structure from your types.d.ts
interface CustomComponentSetting {
  name: string;
  functionName: string;
}

export class CustomizationSidebar {
  private static sidebarElement: HTMLElement;
  private static controlsContainer: HTMLElement; // This will be the CSS properties panel
  private static componentNameHeader: HTMLElement;
  private static closeButton: HTMLElement;
  private static layersModeToggle: HTMLDivElement;
  private static layersView: HTMLDivElement;
  private static layersViewController: LayersViewController;
  private static expandConfiguration: HTMLDivElement;
  private static functionsPanel: HTMLDivElement; // New: Panel for functionality settings
  private static selectedComponent: HTMLElement | null = null; // To keep track of the currently selected component

  static init() {
    this.sidebarElement = document.getElementById('customization')!;
    this.controlsContainer = document.getElementById('controls')!; // CSS controls
    this.componentNameHeader = document.getElementById('component-name')!;
    this.closeButton = document.createElement('button');

    if (!this.sidebarElement || !this.controlsContainer) {
      console.error('CustomizationSidebar: Required elements not found.');
      return;
    }
    // Initialize LayersViewController
    this.layersViewController = new LayersViewController();

    // Create expandible menu (Customize CSS, Settings Panel)
    this.expandConfiguration = document.createElement('div');
    this.expandConfiguration.className = 'expand-config';
    this.expandConfiguration.id = 'expand-config';
    this.expandConfiguration.innerHTML = `
        <button id="css-tab" title="Customize CSS" class="dropdown-btn active">Customize CSS</button>
        <button id="functionalities-tab" title="Settings Panel" class="dropdown-btn">Settings Panel</button>
    `;

    // Create functionality panel
    this.functionsPanel = document.createElement('div'); // Initialize the functions panel
    this.functionsPanel.id = 'functions-panel';
    this.functionsPanel.className = 'dropdown-panel';
    this.functionsPanel.style.display = 'none'; // Initially hidden

    // Create layers mode toggle (Customize, Layers)
    this.layersModeToggle = document.createElement('div');
    this.layersModeToggle.className = 'layers-mode-toggle';
    this.layersModeToggle.innerHTML = `
        <button id="customize-tab" title="Customize" class="active">⚙️</button>
        <button id="layers-tab" title="Layers"> ☰ </button>
    `;

    // Insert layers toggle before component name
    this.sidebarElement.insertBefore(
      this.layersModeToggle,
      this.componentNameHeader
    );

    // Insert expand config (with both buttons) after component name
    this.sidebarElement.insertBefore(
      this.expandConfiguration,
      this.componentNameHeader.nextSibling
    );

    // Insert CSS panel (controlsContainer) and Functionalities panel
    this.sidebarElement.appendChild(this.controlsContainer); // ControlsContainer is the CSS panel
    this.sidebarElement.appendChild(this.functionsPanel); // Functionalities panel

    // Set initial display for controlsContainer to block
    this.controlsContainer.style.display = 'block';

    // Add event listeners to toggle panels
    const cssTabBtn = document.getElementById('css-tab')!;
    const funcTabBtn = document.getElementById('functionalities-tab')!;

    cssTabBtn.addEventListener('click', () => {
      this.controlsContainer.style.display = 'block';
      this.functionsPanel.style.display = 'none';
      cssTabBtn.classList.add('active');
      funcTabBtn.classList.remove('active');
      if (this.selectedComponent) {
        this.populateCssControls(this.selectedComponent); // Repopulate CSS controls for selected component
      }
    });

    funcTabBtn.addEventListener('click', () => {
      this.functionsPanel.style.display = 'block';
      this.controlsContainer.style.display = 'none';
      funcTabBtn.classList.add('active');
      cssTabBtn.classList.remove('active');
      if (this.selectedComponent) {
        this.populateFunctionalityControls(this.selectedComponent); // Populate functionality controls
      }
    });

    // Create layers view (This element is now within the sidebar)
    this.layersView = document.createElement('div');
    this.layersView.id = 'layers-view';
    this.layersView.className = 'layers-view hidden';
    this.sidebarElement.appendChild(this.layersView); // Append to sidebar directly

    // Add event listeners for tab switching (Customize vs Layers)
    const customizeTab = this.layersModeToggle.querySelector('#customize-tab')!;
    const layersTab = this.layersModeToggle.querySelector('#layers-tab')!;

    customizeTab.addEventListener('click', () => this.switchToCustomizeMode());
    layersTab.addEventListener('click', () => this.switchToLayersMode());

    // Add the close button to the sidebar
    this.sidebarElement.appendChild(this.closeButton);
    this.closeButton.textContent = '×'; // Close button symbol
    this.closeButton.classList.add('close-button');

    // Add the event listener to hide the sidebar when the close button is clicked
    this.closeButton.addEventListener('click', () => {
      this.hideSidebar();
    });
  }

  // --- Tab Switching Logic ---
  private static switchToCustomizeMode() {
    const customizeTab = document.getElementById('customize-tab')!;
    const layersTab = document.getElementById('layers-tab')!;
    const layersView = document.getElementById('layers-view')!;
    const componentName = document.getElementById('component-name')!;
    const expandConfig = document.getElementById('expand-config')!;

    customizeTab.classList.add('active');
    layersTab.classList.remove('active');
    layersView.style.display = 'none'; // Hide layers view

    expandConfig.style.display = 'flex'; // Show the expand-config container

    // Ensure the CSS tab is active by default and its panel is shown
    const cssTabBtn = document.getElementById('css-tab')!;
    const funcTabBtn = document.getElementById('functionalities-tab')!;

    cssTabBtn.classList.add('active'); // Activate CSS tab
    funcTabBtn.classList.remove('active'); // Deactivate Functionalities tab

    this.controlsContainer.style.display = 'block'; // Show CSS panel
    this.functionsPanel.style.display = 'none'; // Hide Functionalities panel

    componentName.style.display = 'block'; // Show component name header
    // Repopulate CSS controls based on the selected component (if any)
    if (this.selectedComponent) {
      this.populateCssControls(this.selectedComponent);
    }
  }

  private static switchToLayersMode() {
    const customizeTab = document.getElementById('customize-tab')!;
    const layersTab = document.getElementById('layers-tab')!;
    const layersView = document.getElementById('layers-view')!;
    const componentName = document.getElementById('component-name')!;
    const expandConfig = document.getElementById('expand-config')!;

    layersTab.classList.add('active');
    customizeTab.classList.remove('active');

    expandConfig.style.display = 'none'; // Hide expand-config in layers mode

    // Hide both dropdown panels
    this.controlsContainer.style.display = 'none';
    this.functionsPanel.style.display = 'none';
    document.getElementById('css-tab')?.classList.remove('active');
    document.getElementById('functionalities-tab')?.classList.remove('active');

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
    this.selectedComponent = component; // Store the selected component

    this.sidebarElement.style.display = 'block';
    this.componentNameHeader.textContent = `Component: ${componentId}`;

    // By default, activate and populate the CSS tab when sidebar is shown
    const cssTabBtn = document.getElementById('css-tab')!;
    const funcTabBtn = document.getElementById('functionalities-tab')!;

    if (
      !cssTabBtn.classList.contains('active') &&
      !funcTabBtn.classList.contains('active')
    ) {
      cssTabBtn.click(); // Simulate click to activate CSS tab and populate it
    } else if (cssTabBtn.classList.contains('active')) {
      this.populateCssControls(component);
    } else if (funcTabBtn.classList.contains('active')) {
      this.populateFunctionalityControls(component);
    }
  }

  static hideSidebar() {
    if (this.sidebarElement) {
      this.sidebarElement.style.display = 'none';
      this.selectedComponent = null; // Clear selected component
    }
  }

  // --- Populate CSS Controls ---
  private static populateCssControls(component: HTMLElement) {
    this.controlsContainer.innerHTML = ''; // Clear previous controls
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

    this.addListeners(component); // Re-attach listeners for CSS controls
  }

  // --- Populate Functionality Controls (New) ---
  private static populateFunctionalityControls(component: HTMLElement) {
    this.functionsPanel.innerHTML = ''; // Clear previous controls in the functions panel

    // Handle standard components with specific functionalities (e.g., TableComponent)
    if (component.classList.contains('table-component')) {
      const table = component.querySelector('table');
      if (table) {
        const currentRows = table.rows.length;
        const currentCols = table.rows[0]?.cells.length || 0; // Handle empty table

        // Rows control
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
              // Allow 0 rows
              const tableInstance = new TableComponent(); // Create an instance to call its methods
              tableInstance.setRowCount(table, newRowCount);
              Canvas.historyManager.captureState(); // Capture state after modification
            }
          }, 300)
        ); // Debounce for performance

        // Columns control
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
              // Allow 0 columns
              const tableInstance = new TableComponent(); // Create an instance
              tableInstance.setColumnCount(table, newColCount);
              Canvas.historyManager.captureState(); // Capture state
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
      console.log('DEBUG: Component is custom-component');
      console.log('DEBUG: Component id:', component.id);
      console.log('DEBUG: Component classes:', Array.from(component.classList));

      // Check multiple ways to get settings
      let customSettingsAttr = component.getAttribute('data-custom-settings');
      console.log(
        'DEBUG: data-custom-settings from getAttribute:',
        customSettingsAttr
      );

      // Alternative: try to infer settings from component type
      if (!customSettingsAttr) {
        // Extract component type from class name
        const componentType = Array.from(component.classList)
          .find(cls => cls.endsWith('-component'))
          ?.replace('-component', '');

        console.log('DEBUG: Inferred component type:', componentType);

        // Try to get settings from a global registry or window object
        // This assumes your PageBuilder exposes the custom components config
        if (componentType && (window as any).customComponents) {
          const customComponents = (window as any).customComponents;
          if (
            customComponents[componentType] &&
            customComponents[componentType].settings
          ) {
            customSettingsAttr = JSON.stringify(
              customComponents[componentType].settings
            );
            console.log(
              'DEBUG: Got settings from window registry:',
              customSettingsAttr
            );
          }
        }
      }

      if (customSettingsAttr) {
        try {
          const customSettings: CustomComponentSetting[] =
            JSON.parse(customSettingsAttr);

          if (customSettings.length > 0) {
            customSettings.forEach(setting => {
              const settingButton = document.createElement('button');
              settingButton.classList.add('custom-setting-button');
              settingButton.textContent = setting.name;
              settingButton.addEventListener('click', () => {
                console.log(
                  'DEBUG: Custom setting button clicked:',
                  setting.functionName
                );

                // Get the ID of the currently selected component on the canvas
                const selectedComponentOnCanvasId = component.id; // This is the ID of the wrapper element, e.g., 'customrating1'

                if (!selectedComponentOnCanvasId) {
                  console.error('No selected component ID found for dispatch.');
                  return;
                }

                // Create the custom event
                const event = new CustomEvent(
                  'pagebuilder:custom-setting-action',
                  {
                    detail: {
                      functionName: setting.functionName,
                      targetComponentId: selectedComponentOnCanvasId, // <--- IMPORTANT: Include the target component's ID
                    },
                    bubbles: true, // Allow event to bubble up the DOM tree (important for document listeners)
                    composed: true, // Allow event to cross Shadow DOM boundaries
                  }
                );

                console.log(
                  'DEBUG: Dispatching event globally for ID:',
                  selectedComponentOnCanvasId,
                  event
                );

                // Dispatch the event to the global document object
                document.dispatchEvent(event); // <--- IMPORTANT: Dispatch to document
                Canvas.historyManager.captureState();
              });
              this.functionsPanel.appendChild(settingButton);
            });
          }
        } catch (e) {
          console.error('DEBUG: Error parsing data-custom-settings JSON:', e);
          this.functionsPanel.innerHTML =
            '<p>Error loading custom settings.</p>';
        }
      } else {
        console.log('DEBUG: No custom settings found');
        this.functionsPanel.innerHTML =
          '<p>No custom settings available for this component.</p>';
      }
    } else {
      console.log('DEBUG: Component is not a custom component');
      this.functionsPanel.innerHTML =
        '<p>No specific settings for this component.</p>';
    }
  }

  // --- Utility Methods (rgbToHex, createControl, createSelectControl, addListeners) ---
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
      // For color inputs, add a text input to display/edit hex code
      wrapper.innerHTML = `
        <label for="${id}">${label}:</label>
        <div class="input-wrapper">
          <input type="color" id="${id}" value="${value}">
          <input type="text" id="${id}-value" style="font-size: 0.8rem; width: 80px; margin-left: 8px;" value="${value}">
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

    // If it's a color input, update the hex code display
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
          colorInput.value = hexInput.value; // Update color input with the new hex code
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
    // Collect all existing input/select elements dynamically
    const controls: { [key: string]: HTMLInputElement | HTMLSelectElement } = {
      width: document.getElementById('width') as HTMLInputElement,
      height: document.getElementById('height') as HTMLInputElement,
      backgroundColor: document.getElementById(
        'background-color'
      ) as HTMLInputElement, // Updated ID
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
      // Updated ID
      component.style.backgroundColor = controls.backgroundColor.value;
      (
        document.getElementById('background-color-value') as HTMLInputElement
      ).value = controls.backgroundColor.value; // Update hex code display
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
