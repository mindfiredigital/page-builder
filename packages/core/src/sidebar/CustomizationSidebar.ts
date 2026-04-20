import { Canvas } from '../canvas/Canvas';
import { debounce } from '../utils/utilityFunctions';
import LayersViewController from './LayerViewController';
import { TableComponent } from '../components/TableComponent';
import { svgs } from '../icons/svgs';
import { TextComponent } from '../components/TextComponent';
import { HeaderComponent } from '../components/HeaderComponent';
import { SidebarUtils } from '../utils/customizationSidebarHelper';

export class CustomizationSidebar {
  private static sidebarElement: HTMLElement;
  private static controlsContainer: HTMLElement;
  private static componentNameHeader: HTMLElement;
  private static layersModeToggle: HTMLDivElement;
  private static layersView: HTMLDivElement;
  private static layersViewController: LayersViewController;
  private static functionsPanel: HTMLDivElement;
  private static selectedComponent: HTMLElement | null = null;
  private static customComponentsConfig: CustomComponentConfig | null = null;
  private static basicComponentsConfig: BasicComponent[] | null = null;
  private static showAttributeTab: boolean | undefined = undefined;
  private static editable: boolean | null;

  static init(
    customComponentsConfig: CustomComponentConfig,
    editable: boolean | null,
    BasicComponent: BasicComponent[],
    showAttributeTab?: boolean
  ) {
    this.sidebarElement = document.getElementById('customization')!;
    this.controlsContainer = document.getElementById('controls')!;
    this.componentNameHeader = document.getElementById('component-name')!;
    this.customComponentsConfig = customComponentsConfig;
    this.basicComponentsConfig = BasicComponent;
    this.editable = editable;
    this.showAttributeTab = showAttributeTab;

    if (!this.sidebarElement || !this.controlsContainer) {
      console.error('CustomizationSidebar: Required elements not found.');
      return;
    }
    this.layersViewController = new LayersViewController();

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
    if (this.editable === false && showAttributeTab === true) {
      (customizeTab as HTMLElement).style.display = 'none';
      (layersTab as HTMLElement).style.display = 'none';
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

  private static switchToCustomizeMode() {
    const customizeTab = document.getElementById('customize-tab')!;
    const attributeTab = document.getElementById('attribute-tab')!;
    const layersTab = document.getElementById('layers-tab')!;
    const layersView = document.getElementById('layers-view')!;
    const componentName = document.getElementById('component-name')!;

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
    layersView.style.display = 'none';
    this.functionsPanel.style.display = 'block';
    this.controlsContainer.style.display = 'none';
    componentName.style.display = 'block';
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

    layersTab.classList.add('active');
    attributeTab.classList.remove('active');
    customizeTab.classList.remove('active');
    this.controlsContainer.style.display = 'none';
    this.functionsPanel.style.display = 'none';
    layersView.style.display = 'block';
    componentName.style.display = 'none';
    LayersViewController.updateLayersView();
  }

  static showSidebar(componentId: string) {
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

  /**
   * Greys out a control wrapper and marks all its inputs as disabled.
   * A small ⊘ badge is appended to the label so the user knows why.
   *
   * @param controlId  The id of the input/select inside the wrapper
   * @param reason     Tooltip text shown on hover
   */
  private static disableControlWrapper(
    controlId: string,
    reason: string = 'Not supported for inline display'
  ): void {
    const el = document.getElementById(controlId);
    if (!el) return;

    // Walk up to the nearest .control-wrapper ancestor
    const wrapper = el.closest('.control-wrapper') as HTMLElement | null;
    if (!wrapper) return;

    // Grey-out the whole row
    wrapper.style.opacity = '0.45';
    wrapper.style.pointerEvents = 'none';
    wrapper.style.cursor = 'not-allowed';
    wrapper.title = reason;

    // Append a small ⊘ "disabled" badge next to the label text
    const label = wrapper.querySelector('label');
    if (label && !label.querySelector('.inline-disabled-badge')) {
      const badge = document.createElement('span');
      badge.className = 'inline-disabled-badge';
      badge.title = reason;
      badge.style.cssText = `
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-left: 6px;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background-color: #94a3b8;
        color: #ffffff;
        font-size: 9px;
        font-weight: 700;
        cursor: not-allowed;
        vertical-align: middle;
        flex-shrink: 0;
        line-height: 1;
      `;
      badge.textContent = '⊘';
      label.appendChild(badge);
    }

    // Disable every input / select inside so keyboard interaction is blocked too
    wrapper.querySelectorAll('input, select').forEach(input => {
      (input as HTMLInputElement | HTMLSelectElement).disabled = true;
      (input as HTMLElement).style.cursor = 'not-allowed';
      (input as HTMLElement).style.backgroundColor = '#f1f5f9';
      (input as HTMLElement).style.color = '#94a3b8';
    });
  }

  private static populateCssControls(component: HTMLElement) {
    this.controlsContainer.innerHTML = '';
    const styles = getComputedStyle(component);
    const isCanvas = component.id.toLowerCase() === 'canvas';

    // Read the stored display intent (handles inline -> inline-block mapping)
    const displayIntent = component.dataset.displayIntent;
    const displayValue = displayIntent || styles.display || 'block';
    const isInline = displayValue === 'inline';

    SidebarUtils.createSelectControl(
      'Display',
      'display',
      displayValue,
      ['block', 'inline', 'inline-block', 'flex', 'grid', 'none'],
      this.controlsContainer
    );

    if (styles.display === 'flex' || component.style.display === 'flex') {
      SidebarUtils.createSelectControl(
        'Flex Direction',
        'flex-direction',
        styles.flexDirection || 'row',
        ['row', 'row-reverse', 'column', 'column-reverse'],
        this.controlsContainer
      );
      SidebarUtils.createSelectControl(
        'Align Items',
        'align-items',
        styles.alignItems || 'stretch',
        ['stretch', 'flex-start', 'flex-end', 'center', 'baseline'],
        this.controlsContainer
      );
      SidebarUtils.createSelectControl(
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
        ],
        this.controlsContainer
      );
    }

    if (isCanvas) {
      SidebarUtils.createPageSizeSelect(this.controlsContainer, component);
      SidebarUtils.createControl(
        'Width',
        'width',
        'number',
        component.offsetWidth,
        this.controlsContainer,
        { min: 300, max: 2000, unit: 'px' }
      );
      SidebarUtils.createControl(
        'Min Height',
        'min-height',
        'number',
        parseInt(styles.minHeight) || 100,
        this.controlsContainer,
        { min: 0, max: 2000, unit: 'px' }
      );
      SidebarUtils.createControl(
        'Margin',
        'margin',
        'number',
        parseInt(styles.margin) || 0,
        this.controlsContainer,
        { min: 0, max: 100, unit: 'px' }
      );
    }

    if (!isCanvas) {
      // ── Width ──────────────────────────────────────────────────────────────
      // inline elements ignore explicit width — show control but disable it
      SidebarUtils.createControl(
        'Width',
        'width',
        'number',
        component.offsetWidth,
        this.controlsContainer,
        { min: 0, max: 1000, unit: 'px' }
      );
      if (isInline) {
        this.disableControlWrapper(
          'width',
          'Width is not supported for inline display'
        );
      }

      // ── Height ─────────────────────────────────────────────────────────────
      // inline elements ignore explicit height — show control but disable it
      SidebarUtils.createControl(
        'Height',
        'height',
        'number',
        component.offsetHeight,
        this.controlsContainer,
        { min: 0, max: 1000, unit: 'px' }
      );
      if (isInline) {
        this.disableControlWrapper(
          'height',
          'Height is not supported for inline display'
        );
      }

      // ── Margin ─────────────────────────────────────────────────────────────
      // inline elements ignore top/bottom margins — show control but disable it
      SidebarUtils.createControl(
        'Margin',
        'margin',
        'number',
        parseInt(styles.margin) || 0,
        this.controlsContainer,
        { min: 0, max: 1000, unit: 'px' }
      );
      if (isInline) {
        this.disableControlWrapper(
          'margin',
          'Top/bottom margin is not supported for inline display'
        );
      }

      // ── Padding ────────────────────────────────────────────────────────────
      // inline elements ignore top/bottom padding — show control but disable it
      SidebarUtils.createControl(
        'Padding',
        'padding',
        'number',
        parseInt(styles.padding) || 0,
        this.controlsContainer,
        { min: 0, max: 1000, unit: 'px' }
      );
      if (isInline) {
        this.disableControlWrapper(
          'padding',
          'Top/bottom padding is not supported for inline display'
        );
      }
    }

    SidebarUtils.createControl(
      'Background Color',
      'background-color',
      'color',
      styles.backgroundColor,
      this.controlsContainer
    );
    SidebarUtils.createSelectControl(
      'Text Alignment',
      'alignment',
      styles.textAlign,
      ['left', 'center', 'right'],
      this.controlsContainer
    );
    SidebarUtils.createSelectControl(
      'Font Family',
      'font-family',
      styles.fontFamily,
      [
        'Arial',
        'Verdana',
        'Helvetica',
        'Times New Roman',
        'Georgia',
        'Courier New',
        'sans-serif',
        'serif',
      ],
      this.controlsContainer
    );
    SidebarUtils.createControl(
      'Font Size',
      'font-size',
      'number',
      parseInt(styles.fontSize) || 16,
      this.controlsContainer,
      { min: 0, max: 100, unit: 'px' }
    );
    SidebarUtils.createSelectControl(
      'Font Weight',
      'font-weight',
      styles.fontWeight,
      [
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
      ],
      this.controlsContainer
    );
    SidebarUtils.createControl(
      'Text Color',
      'text-color',
      'color',
      styles.color || '#000000',
      this.controlsContainer
    );
    SidebarUtils.createControl(
      'Border Width',
      'border-width',
      'number',
      parseInt(styles.borderWidth) || 0,
      this.controlsContainer,
      { min: 0, max: 20, unit: 'px' }
    );
    SidebarUtils.createSelectControl(
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
      ],
      this.controlsContainer
    );
    SidebarUtils.createControl(
      'Border Color',
      'border-color',
      'color',
      styles.borderColor || '#000000',
      this.controlsContainer
    );

    const bgColorInput = document.getElementById(
      'background-color'
    ) as HTMLInputElement;
    if (bgColorInput) {
      bgColorInput.value = SidebarUtils.rgbToHex(styles.backgroundColor);
    }
    const textColorInput = document.getElementById(
      'text-color'
    ) as HTMLInputElement;
    if (textColorInput) {
      textColorInput.value = SidebarUtils.rgbToHex(styles.color);
    }
    const borderColorInput = document.getElementById(
      'border-color'
    ) as HTMLInputElement;
    if (borderColorInput) {
      borderColorInput.value = SidebarUtils.rgbToHex(styles.borderColor);
    }

    this.addListeners(component);
  }

  private static async handleInputTrigger(event: Event) {
    const component = CustomizationSidebar.selectedComponent;
    if (!component) return;

    let componentConfig;
    if (component.classList.contains('table-component')) {
      componentConfig = CustomizationSidebar.basicComponentsConfig?.find(
        comp => comp.name === 'table'
      );
    } else if (component.classList.contains('text-component')) {
      componentConfig = CustomizationSidebar.basicComponentsConfig?.find(
        comp => comp.name === 'text'
      );
    } else if (component.classList.contains('header-component')) {
      componentConfig = CustomizationSidebar.basicComponentsConfig?.find(
        comp => comp.name === 'header'
      );
    }

    if (componentConfig && componentConfig.globalExecuteFunction) {
      const inputValues: { [key: string]: string | boolean } = {};
      const allInputs =
        CustomizationSidebar.functionsPanel.querySelectorAll(
          '.attribute-input'
        );

      allInputs.forEach(input => {
        const inputEl = input as HTMLInputElement;
        if (inputEl.type === 'checkbox') {
          inputValues[inputEl.id] = inputEl.checked ? 'true' : 'false';
        } else {
          inputValues[inputEl.id] = inputEl.value;
        }
      });

      const result = await componentConfig.globalExecuteFunction(inputValues);
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
      tableInstance.evaluateRowVisibility(inputValues);
      Canvas.historyManager.captureState();
    }
  }

  private static ShoModal(componentAttributes?: ComponentAttribute[]) {
    if (componentAttributes && componentAttributes.length > 0) {
      return true;
    }
    return false;
  }

  private static populateFunctionalityControls(component: HTMLElement) {
    this.functionsPanel.innerHTML = '';
    let componentConfig;
    let showModalButton = false;
    const tableConfig = this.basicComponentsConfig?.find(
      comp => comp.name === 'table'
    );
    if (component.classList.contains('table-component')) {
      componentConfig = tableConfig;
      this.ShoModal(componentConfig?.attributes);
    } else if (component.classList.contains('text-component')) {
      componentConfig = this.basicComponentsConfig?.find(
        comp => comp.name === 'text'
      );
      showModalButton = this.ShoModal(componentConfig?.attributes);
    } else if (component.classList.contains('header-component')) {
      componentConfig = this.basicComponentsConfig?.find(
        comp => comp.name === 'header'
      );
      showModalButton = this.ShoModal(componentConfig?.attributes);
    } else if (component.classList.contains('table-cell-content')) {
      showModalButton = this.ShoModal(tableConfig?.attributes);
    } else if (component.classList.contains('table-row')) {
      const tableInputAttr = tableConfig?.attributes?.filter(
        input => input.type === 'Input'
      );
      if (
        tableInputAttr &&
        tableInputAttr.length > 0 &&
        this.basicComponentsConfig &&
        this.editable !== false
      ) {
        SidebarUtils.populateRowVisibilityControls(component, tableInputAttr);
      }
      return;
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
      componentConfig.attributes.forEach((attribute: any) => {
        if (attribute.type === 'Input') {
          SidebarUtils.createAttributeControls(
            attribute,
            this.functionsPanel,
            this.handleInputTrigger
          );
        }
      });
    }

    if (showModalButton) {
      SidebarUtils.populateModalButton(
        component,
        this.functionsPanel,
        this.editable
      );
    } else if (!componentConfig) {
      this.functionsPanel.innerHTML =
        '<p>No specific settings for this component.</p>';
    }
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
      fontWeight: document.getElementById('font-weight') as HTMLSelectElement,
      textColor: document.getElementById('text-color') as HTMLInputElement,
      borderWidth: document.getElementById('border-width') as HTMLInputElement,
      borderStyle: document.getElementById('border-style') as HTMLSelectElement,
      borderColor: document.getElementById('border-color') as HTMLInputElement,
      display: document.getElementById('display') as HTMLSelectElement,
      fontFamily: document.getElementById('font-family') as HTMLSelectElement,
      flexDirection: document.getElementById(
        'flex-direction'
      ) as HTMLSelectElement,
      alignItems: document.getElementById('align-items') as HTMLSelectElement,
      justifyContent: document.getElementById(
        'justify-content'
      ) as HTMLSelectElement,
    };

    const captureStateDebounced = debounce(() => {
      Canvas.dispatchDesignChange();
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
    controls.fontWeight?.addEventListener('change', () => {
      component.style.fontWeight = controls.fontWeight.value;
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
      const selectedValue = controls.display.value;

      if (selectedValue === 'inline') {
        // Apply inline-block to the DOM so the element renders correctly.
        // Pure inline ignores width/height and vertical margin/padding
        // which causes broken layouts in the builder.
        // We store the user's intent via a data attribute so the dropdown
        // continues to show "inline" after re-opening the sidebar.
        component.style.display = 'inline-block';
        component.dataset.displayIntent = 'inline';
      } else {
        component.style.display = selectedValue;
        // Clear the intent flag for all non-inline values
        delete component.dataset.displayIntent;
      }

      captureStateDebounced();
      // Re-populate controls so disabled states update correctly
      this.populateCssControls(component);
    });
    controls.flexDirection?.addEventListener('change', () => {
      component.style.flexDirection = controls.flexDirection.value;
      captureStateDebounced();
    });
    controls.alignItems?.addEventListener('change', () => {
      component.style.alignItems = controls.alignItems.value;
      captureStateDebounced();
    });
    controls.fontFamily?.addEventListener('change', () => {
      component.style.fontFamily = controls.fontFamily.value;
      captureStateDebounced();
    });
    controls.justifyContent?.addEventListener('change', () => {
      component.style.justifyContent = controls.justifyContent.value;
      captureStateDebounced();
    });
  }

  static getLayersViewController(): LayersViewController {
    return this.layersViewController;
  }
}
