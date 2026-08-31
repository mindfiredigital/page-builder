import LayersViewController from './LayerViewController';
import {
  buildTabToggle,
  switchToCustomizeMode,
  switchToAttributeMode,
  populateCssControls,
  handleInputTrigger,
  populateFunctionalityControls,
  addControlListeners,
} from './CustomizationSidebarCore';

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
  ): void {
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

    /* Functions panel hosts Attribute-tab content */
    this.functionsPanel = document.createElement('div');
    this.functionsPanel.id = 'functions-panel';
    this.functionsPanel.className = 'dropdown-panel';
    this.functionsPanel.style.display = 'none';

    /* Build the tab toggle bar and wire its click callbacks */
    this.layersModeToggle = buildTabToggle({
      sidebarElement: this.sidebarElement,
      componentNameHeader: this.componentNameHeader,
      controlsContainer: this.controlsContainer,
      functionsPanel: this.functionsPanel,
      layersView: this.layersView,
      editable: this.editable,
      showAttributeTab: this.showAttributeTab,
      onCustomizeTab: () => this.switchToCustomizeModeLocal(),
      onAttributeTab: () => this.switchToAttributeModeLocal(),
    });

    this.sidebarElement.insertBefore(
      this.layersModeToggle,
      this.componentNameHeader
    );
    this.sidebarElement.appendChild(this.controlsContainer);
    this.sidebarElement.appendChild(this.functionsPanel);
    this.controlsContainer.style.display = 'block';

    /* When either sidebar is toggled the canvas width changes; refresh the
       controls panel so the displayed values (e.g. offsetWidth fallback) stay
       in sync with the actual component dimensions. */
    document.addEventListener('canvas-layout-changed', () => {
      requestAnimationFrame(() => {
        if (this.selectedComponent) {
          this.populateCssControlsLocal(this.selectedComponent);
        }
      });
    });

    this.layersView = document.createElement('div');
    this.layersView.id = 'layers-view';
    this.layersView.className = 'layers-view hidden';
    this.sidebarElement.appendChild(this.layersView);
  }

  /* Delegates to module, then re-populates CSS controls for the selected component */
  private static switchToCustomizeModeLocal(): void {
    switchToCustomizeMode(
      this.controlsContainer,
      this.functionsPanel,
      this.componentNameHeader
    );
    if (this.selectedComponent)
      this.populateCssControlsLocal(this.selectedComponent);
  }

  /* Delegates to module, then re-populates functionality controls */
  private static switchToAttributeModeLocal(): void {
    switchToAttributeMode(
      this.controlsContainer,
      this.functionsPanel,
      this.componentNameHeader
    );
    if (this.selectedComponent)
      this.populateFunctionalityControlsLocal(this.selectedComponent);
  }

  /* Shows the sidebar and activates the correct tab for the given component id */
  static showSidebar(componentId: string): void {
    const component = document.getElementById(componentId);
    if (!component) {
      console.error(`Component with ID "${componentId}" not found.`);
      return;
    }
    if (this.editable === false && this.showAttributeTab !== true) return;

    this.selectedComponent = component;
    this.sidebarElement.style.display = 'block';
    this.sidebarElement.classList.add('visible');

    const menuButton = document.getElementById('menu-btn');
    if (menuButton) {
      menuButton.style.backgroundColor = '#e2e8f0';
      menuButton.style.borderColor = '#cbd5e1';
    }

    this.componentNameHeader.textContent = `Component: ${componentId}`;

    /* View-only with forced attribute tab */
    if (this.editable === false && this.showAttributeTab === true) {
      this.switchToAttributeModeLocal();
      return;
    }

    this.switchToCustomizeModeLocal();
  }

  /* Resolves the customizeComponentTagName for a custom component.
     Only custom components (user-supplied via customComponents config) can
     have a customize panel — built-in components never show this toggle. */
  private static getCustomizeTagForComponent(
    component: HTMLElement
  ): string | undefined {
    if (!component.classList.contains('custom-component')) return undefined;
    if (!this.customComponentsConfig) return undefined;

    const componentType = Array.from(component.classList)
      .find(cls => cls.endsWith('-component') && cls !== 'custom-component')
      ?.replace('-component', '');

    if (!componentType) return undefined;

    return this.customComponentsConfig[componentType]
      ?.customizeComponentTagName;
  }

  /* Thin wrapper so addControlListeners can trigger a re-populate via the module */
  private static populateCssControlsLocal(component: HTMLElement): void {
    const customizeTag = this.getCustomizeTagForComponent(component);
    populateCssControls(
      component,
      this.controlsContainer,
      c =>
        addControlListeners(
          c,
          this.controlsContainer,
          cc => this.populateCssControlsLocal(cc),
          customizeTag
        ),
      customizeTag
    );
  }

  /* Thin wrapper that passes all required state into the module function */
  private static populateFunctionalityControlsLocal(
    component: HTMLElement
  ): void {
    populateFunctionalityControls(
      component,
      this.functionsPanel,
      this.basicComponentsConfig,
      this.customComponentsConfig,
      this.editable,
      _event =>
        handleInputTrigger(
          this.selectedComponent,
          this.basicComponentsConfig,
          this.functionsPanel
        )
    );
  }

  static getLayersViewController(): LayersViewController {
    return this.layersViewController;
  }
}
