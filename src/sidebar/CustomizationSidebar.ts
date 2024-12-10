import { Canvas } from '../canvas/Canvas';
import { debounce } from '../utils/utilityFunctions';

export class CustomizationSidebar {
  private static sidebarElement: HTMLElement;
  private static controlsContainer: HTMLElement;
  private static componentNameHeader: HTMLElement;
  private static closeButton: HTMLElement;
  private static layersModeToggle: HTMLDivElement;
  private static layersView: HTMLDivElement;

  static init() {
    this.sidebarElement = document.getElementById('customization')!;
    this.controlsContainer = document.getElementById('controls')!;
    this.componentNameHeader = document.getElementById('component-name')!;
    this.closeButton = document.createElement('button');

    if (!this.sidebarElement || !this.controlsContainer) {
      console.error('CustomizationSidebar: Required elements not found.');
      return;
    }

    // Create layers mode toggle
    this.layersModeToggle = document.createElement('div');
    this.layersModeToggle.className = 'layers-mode-toggle';
    this.layersModeToggle.innerHTML = `
      <button id="customize-tab" title="Customize" class="active">⚙️</button>
      <button id="layers-tab" title="Layers"> ☰ </button>
    `;
    this.sidebarElement.insertBefore(
      this.layersModeToggle,
      this.componentNameHeader
    );

    // Create layers view
    this.layersView = document.createElement('div');
    this.layersView.id = 'layers-view';
    this.layersView.className = 'layers-view hidden';
    this.controlsContainer.appendChild(this.layersView);

    // Add event listeners for tab switching
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

  private static switchToCustomizeMode() {
    const customizeTab = document.getElementById('customize-tab')!;
    const layersTab = document.getElementById('layers-tab')!;
    const layersView = document.getElementById('layers-view')!;
    const controlsContainer = document.getElementById('controls')!;
    const componentName = document.getElementById('component-name')!;

    customizeTab.classList.add('active');
    layersTab.classList.remove('active');
    layersView.classList.add('hidden');
    controlsContainer.classList.remove('hidden');
    // Ensure only the control view is visible
    controlsContainer.style.display = 'block'; // show the controls
    layersView.style.display = 'none';
    componentName.style.display = 'block';
  }

  private static switchToLayersMode() {
    const customizeTab = document.getElementById('customize-tab')!;
    const layersTab = document.getElementById('layers-tab')!;
    const layersView = document.getElementById('layers-view')!;
    const controlsContainer = document.getElementById('controls')!;
    const componentName = document.getElementById('component-name')!;

    layersTab.classList.add('active');
    customizeTab.classList.remove('active');

    // Ensure only the layers view is visible
    controlsContainer.style.display = 'none'; // Hides the controls
    layersView.style.display = 'block';
    componentName.style.display = 'none';
    // Update the layers view
    this.updateLayersView();
  }

  public static updateLayersView() {
    const layersView = document.getElementById('layers-view')!;
    layersView.innerHTML = ''; // Clear existing layers

    const components = Canvas.getComponents(); // Get the updated components

    // Create layers list with drag and drop functionality
    const layersList = document.createElement('ul');
    layersList.className = 'layers-list';
    layersList.setAttribute('draggable', 'true');

    components.forEach((component, index) => {
      const layerItem = document.createElement('li');
      layerItem.className = 'layer-item';
      layerItem.setAttribute('draggable', 'true');
      layerItem.dataset.index = index.toString();

      // Create layer visibility toggle
      const visibilityToggle = document.createElement('span');
      visibilityToggle.innerHTML =
        component.style.display === 'none' ? '👁️‍🗨️' : '👁️';
      visibilityToggle.className = 'layer-visibility';
      visibilityToggle.addEventListener('click', () => {
        if (component.style.display === 'none') {
          component.style.display = component.dataset.originalDisplay || '';
          visibilityToggle.innerHTML = '👁️';
        } else {
          component.style.display = 'none';
          visibilityToggle.innerHTML = '👁️‍🗨️';
        }
      });

      // Create layer name (based on component type and unique class)
      const layerName = document.createElement('span');
      //const componentType = component.classList[0]
      // .split(/\d/)[0]
      // .replace('-component', '');
      layerName.textContent = `${component.id}`;
      layerName.className = 'layer-name';

      // Make layer selectable to show customization
      layerName.addEventListener('click', () => {
        this.switchToCustomizeMode();
        this.showSidebar(component.id);
      });

      // Create layer lock toggle
      const lockToggle = document.createElement('span');
      const isLocked = component.getAttribute('data-locked') === 'true';
      lockToggle.innerHTML = isLocked ? '🔒' : '🔓';
      lockToggle.className = 'layer-lock';
      lockToggle.addEventListener('click', () => {
        const currentLockState =
          component.getAttribute('data-locked') === 'true';
        if (currentLockState) {
          component.removeAttribute('data-locked');
          component.style.pointerEvents = 'auto';
          lockToggle.innerHTML = '🔓';
        } else {
          component.setAttribute('data-locked', 'true');
          component.style.pointerEvents = 'none';
          lockToggle.innerHTML = '🔒';
        }
      });

      // Drag and drop for reordering
      layerItem.addEventListener('dragstart', e => {
        e.dataTransfer?.setData('text/plain', index.toString());
      });

      layerItem.addEventListener('dragover', e => {
        e.preventDefault();
      });

      layerItem.addEventListener('drop', e => {
        e.preventDefault();
        const fromIndex = parseInt(
          e.dataTransfer?.getData('text/plain') || '-1'
        );
        const toIndex = parseInt(layerItem.dataset.index || '-1');

        if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
          // Reorder components in the model
          Canvas.reorderComponent(fromIndex, toIndex);

          // After reordering, update the layers view in real-time
          this.updateLayersView();
        }
      });

      // Append elements to the layer item
      layerItem.appendChild(visibilityToggle);
      layerItem.appendChild(layerName);
      layerItem.appendChild(lockToggle);

      // Add the layer item to the layers list
      layersList.appendChild(layerItem);
    });

    // Append the layers list to the layers view container
    layersView.appendChild(layersList);
  }

  static showSidebar(componentId: string) {
    const customizeTab = document.getElementById('customize-tab')!;
    const layersTab = document.getElementById('layers-tab')!;
    const layersView = document.getElementById('layers-view')!;
    const controlsContainer = document.getElementById('controls')!;

    // Ensure we're in customize mode when showing sidebar
    customizeTab.classList.add('active');
    layersTab.classList.remove('active');
    layersView.classList.add('hidden');
    controlsContainer.classList.remove('hidden');

    // Existing showSidebar logic follows...
    const component = document.getElementById(componentId);
    console.log(`Showing sidebar for: ${componentId}`);
    if (!component) {
      console.error(`Component with ID "${componentId}" not found.`);
      return;
    }

    // Check if the component is a canvas itself
    const isCanvas = componentId.toLowerCase() === 'canvas';

    this.sidebarElement.style.display = 'block';
    this.controlsContainer.innerHTML = '';

    // Set the component name in the header
    this.componentNameHeader.textContent = `Component: ${componentId}`;

    // Dynamically create controls
    const styles = getComputedStyle(component);

    // Controls Display Control
    this.createSelectControl('Display', 'display', styles.display || 'block', [
      'block',
      'inline',
      'inline-block',
      'flex',
      'grid',
      'none',
    ]);

    // Exclude some controls for canvas
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

    this.createControl('Color', 'color', 'color', styles.backgroundColor);
    this.createSelectControl('Text Alignment', 'alignment', styles.textAlign, [
      'left',
      'center',
      'right',
    ]);

    // Controls for fonts
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

    // Controls for text color editing
    this.createControl(
      'Text Color',
      'text-color',
      'color',
      styles.color || '#000000'
    );

    // Controls for border width
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

    // Controls for Border Style
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
      fontFamily: document.getElementById('font-family') as HTMLSelectElement,
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

    //Controls for fonts
    controls.fontFamily?.addEventListener('change', () => {
      component.style.fontFamily = controls.fontFamily.value;
      captureStateDebounced();
    });
  }
}
