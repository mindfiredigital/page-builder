import { PageBuilder } from '@mindfiredigital/page-builder/dist/PageBuilder.js';

export interface PageBuilderDesign {
  pages?: Array<{
    id: string;
    components: Array<{
      type: string;
      id: string;
      props: Record<string, any>;
    }>;
  }>;
  [key: string]: any;
}
export class PageBuilderComponent extends HTMLElement {
  private pageBuilder!: PageBuilder;
  private initialized = false;
  private _initialDesign: PageBuilderDesign | null = null;
  private _editable: boolean | null = null;
  private _brandTitle?: string;
  private _showAttributeTab?: boolean;
  private config = { Basic: [], Extra: [], Custom: [] };
  private template = `<div id="app">
      <div id="sidebar"></div>
      <div id="canvas" class="canvas"></div>
      <div id="customization">
        <h4 id="component-name">Component: None</h4>
        <div id="controls"></div>
        <div id="layers-view" class="hidden"></div>
      </div>
      <div id="notification" class="notification hidden"></div>
      <div id="dialog" class="dialog hidden">
        <div class="dialog-content">
          <p id="dialog-message"></p>
          <button id="dialog-yes" class="dialog-btn">Yes</button>
          <button id="dialog-no" class="dialog-btn">No</button>
        </div>
      </div>
    </div>`;

  constructor() {
    super();
    // Set inner HTML only if no child elements exist
  }

  set editable(value: boolean | null) {
    if (this._editable !== value) {
      this._editable = value;
      if (this.initialized) {
        this.initialized = false;
        this.initializePageBuilder();
      }
    }
  }

  // Corrected getter for 'editable'
  get editable(): boolean | null {
    return this._editable;
  }

  set brandTitle(value: string | undefined) {
    if (this._brandTitle !== value) {
      this._brandTitle = value;
      if (this.initialized) {
        this.initialized = false;
        this.initializePageBuilder();
      }
    }
  }

  get brandTitle(): string | undefined {
    return this._brandTitle;
  }

  set showAttributeTab(value: boolean | undefined) {
    if (this._showAttributeTab !== value) {
      this._showAttributeTab = value;
      if (this.initialized) {
        this.initialized = false;
        this.initializePageBuilder();
      }
    }
  }

  get showAttributeTab(): boolean | undefined {
    return this._showAttributeTab;
  }

  set initialDesign(value: PageBuilderDesign | null) {
    if (this._initialDesign !== value) {
      this._initialDesign = value;
      if (this.initialized) {
        this.initialized = false;
        if (value !== null || this.initialized) {
          this.initialized = false;
          this.initializePageBuilder();
        }
      }
    }
  }

  get initialDesign(): PageBuilderDesign | null {
    return this._initialDesign;
  }

  // Lifecycle method: Called when the element is added to the DOM
  connectedCallback() {
    if (this.initialized) {
      return;
    }

    setTimeout(() => {
      if (!this.firstElementChild) {
        this.innerHTML = this.template;
      }

      if (this.hasValidConfig()) {
        this.initializePageBuilder();
      }
    }, 0);
  }

  private hasValidConfig(): boolean {
    return (
      this.config &&
      (this.config.Basic?.length > 0 ||
        this.config.Extra?.length > 0 ||
        (this.config.Custom && Object.keys(this.config.Custom).length > 0))
    );
  }

  set configData(value: any) {
    this.config = value;
    this.initialized = false;
    this.initializePageBuilder();
  }

  get configData() {
    return this.config;
  }
  // Initializes the PageBuilder instance
  private initializePageBuilder() {
    if (this.initialized) {
      return;
    }

    try {
      const app = this.querySelector('#app');
      if (app === null) {
        console.error('Error: #app element not found.');
        return;
      }
      if (app && this.pageBuilder) {
        app.innerHTML = '';
        this.innerHTML = this.template;
      }
      this.pageBuilder = new PageBuilder(
        this.config,
        this._initialDesign,
        this._editable,
        this._brandTitle,
        this.showAttributeTab
      );
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize PageBuilder:', error);
      this.initialized = false;
    }
  }
}

// Define the custom element if it hasn't been registered already
if (!customElements.get('page-builder')) {
  customElements.define('page-builder', PageBuilderComponent);
}
