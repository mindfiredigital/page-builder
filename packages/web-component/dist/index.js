// src/components/PageBuilder.ts
import { PageBuilder } from '@mindfiredigital/page-builder/dist/PageBuilder.js';
var PageBuilderComponent = class extends HTMLElement {
  constructor() {
    super();
    this.initialized = false;
    this._initialDesign = null;
    this._editable = null;
    this.config = { Basic: [], Extra: [], Custom: {} };
    // Initialize Custom as an object
    this.template = `<div id="app">
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
  }
  // --- Setter Implementation to trigger re-initialization ---
  // Setters must reset initialized and call initializePageBuilder
  set editable(value) {
    if (this._editable !== value) {
      this._editable = value;
      if (this.initialized) {
        this.initialized = false;
        this.initializePageBuilder();
      }
    }
  }
  get editable() {
    return this._editable;
  }
  set brandTitle(value) {
    if (this._brandTitle !== value) {
      this._brandTitle = value;
      if (this.initialized) {
        this.initialized = false;
        this.initializePageBuilder();
      }
    }
  }
  get brandTitle() {
    return this._brandTitle;
  }
  set showAttributeTab(value) {
    if (this._showAttributeTab !== value) {
      this._showAttributeTab = value;
      if (this.initialized) {
        this.initialized = false;
        this.initializePageBuilder();
      }
    }
  }
  get showAttributeTab() {
    return this._showAttributeTab;
  }
  set initialDesign(value) {
    if (this._initialDesign !== value) {
      this._initialDesign = value;
      if (this.initialized) {
        this.initialized = false;
        this.initializePageBuilder();
      }
    }
  }
  get initialDesign() {
    return this._initialDesign;
  }
  // CRITICAL: The config setter is the most important trigger.
  set configData(value) {
    if (JSON.stringify(this.config) !== JSON.stringify(value)) {
      this.config = value;
      this.initialized = false;
      this.initializePageBuilder();
    }
  }
  get configData() {
    return this.config;
  }
  // Lifecycle method: Called when the element is added to the DOM
  connectedCallback() {
    if (!this.firstElementChild) {
      this.innerHTML = this.template;
    }
    if (!this.initialized) {
      this.initializePageBuilder();
    }
  }
  // Initializes the PageBuilder instance
  initializePageBuilder() {
    const app = this.querySelector('#app');
    if (app === null) {
      return;
    }
    try {
      if (this.pageBuilder) {
        this.innerHTML = '';
        this.innerHTML = this.template;
      }
      const effectiveConfig = this.config || {
        Basic: [],
        Extra: [],
        Custom: {},
      };
      this.pageBuilder = new PageBuilder(
        effectiveConfig,
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
};
if (!customElements.get('page-builder')) {
  customElements.define('page-builder', PageBuilderComponent);
}
export { PageBuilderComponent };
//# sourceMappingURL=index.js.map
