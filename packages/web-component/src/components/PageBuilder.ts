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
    console.log('is it even being called');
    super();
    // Set inner HTML only if no child elements exist
  }

  // Observe 'config-data' attribute to detect changes
  static get observedAttributes() {
    return ['config-data'];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'config-data' && newValue !== oldValue) {
      try {
        const parsedConfig = JSON.parse(newValue);
        this.config = parsedConfig;
        if (
          this.hasValidConfig() &&
          Object.keys(this.config.Custom).length > 0
        ) {
          this.initialized = false;

          this.initializePageBuilder();
        }
      } catch (e) {
        console.error('Failed to parse config:', e);
      }
    }
  }

  set editable(value: boolean | null) {
    console.log('called');
    if (this._editable !== value) {
      this._editable = value;
      if (this.isConnected && this.hasValidConfig()) {
        this.initializePageBuilder();
      }
    }
  }

  // Corrected getter for 'editable'
  get editable(): boolean | null {
    return this._editable;
  }

  set initialDesign(value: PageBuilderDesign | null) {
    if (this._initialDesign !== value) {
      this._initialDesign = value;
      if (this.isConnected && this.hasValidConfig()) {
        this.initializePageBuilder();
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

  // Initializes the PageBuilder instance
  private initializePageBuilder() {
    console.log('init'); // This log will now appear
    if (this.initialized || !this.hasValidConfig()) {
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
        this._editable
      );
      this.initialized = true;
      console.log(
        'PageBuilderComponent: PageBuilder initialized successfully with config and initial design.'
      );
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
