import { PageBuilder } from '@mindfiredigital/page-builder-core/dist/PageBuilder.js';

export class PageBuilderComponent extends HTMLElement {
  private pageBuilder!: PageBuilder;
  private initialized = false;
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
    if (!this.firstElementChild) {
      this.innerHTML = this.template;
    }
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
        this.initializePageBuilder(); // Reinitialize Core when config changes
      } catch (e) {
        console.error('Failed to parse config:', e);
      }
    }
  }

  // Lifecycle method: Called when the element is added to the DOM
  connectedCallback() {
    if (this.initialized) {
      return;
    }
    this.initializePageBuilder();
  }

  // Initializes the PageBuilder instance
  private initializePageBuilder() {
    if (this.initialized) {
      return;
    }

    try {
      this.initialized = true;
      this.pageBuilder = new PageBuilder(this.config);
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
