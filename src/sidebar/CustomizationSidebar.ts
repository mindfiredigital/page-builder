export class CustomizationSidebar {
  private static sidebarElement: HTMLElement;
  private static controlsContainer: HTMLElement;

  static init() {
    this.sidebarElement = document.getElementById('customization')!;
    this.controlsContainer = document.getElementById('controls')!;
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

  private static createControl(
    label: string,
    id: string,
    type: string,
    value: string | number,
    attributes: Record<string, string | number> = {}
  ) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('control-wrapper');
    wrapper.innerHTML = `
        <label for="${id}">${label}:</label>
        <input type="${type}" id="${id}" value="${value}">
      `;
    const input = wrapper.querySelector('input') as HTMLInputElement;
    if (input) {
      Object.keys(attributes).forEach(key => {
        input.setAttribute(key, attributes[key].toString());
      });
    }
    this.controlsContainer.appendChild(wrapper);
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
      component.style.width = `${controls.width.value}px`;
    });
    controls.height?.addEventListener('input', () => {
      component.style.height = `${controls.height.value}px`;
    });
    controls.color?.addEventListener('input', () => {
      component.style.backgroundColor = controls.color.value;
    });
    controls.margin?.addEventListener('input', () => {
      component.style.margin = `${controls.margin.value}px`;
    });
    controls.padding?.addEventListener('input', () => {
      component.style.padding = `${controls.padding.value}px`;
    });
    controls.alignment?.addEventListener('change', () => {
      component.style.textAlign = controls.alignment.value;
    });
    controls.fontSize?.addEventListener('input', () => {
      component.style.fontSize = `${controls.fontSize.value}px`;
    });
  }
}
