// src/components/PageBuilder.ts
import { PageBuilder } from '@mindfiredigital/page-builder/dist/PageBuilder.js';
var PageBuilderComponent = class extends HTMLElement {
  constructor() {
    super();
    this.initialized = false;
    this._initialDesign = null;
    this._editable = null;
    this.config = { Basic: [], Extra: [], Custom: [] };
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
  set editable(value) {
    if (this._editable !== value) {
      this._editable = value;
      if (this.initialized) {
        this.initialized = false;
        this.initializePageBuilder();
      }
    }
  }
  // Corrected getter for 'editable'
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
  set layoutMode(value) {
    if (this._layoutMode !== value) {
      this._layoutMode = value;
      if (this.initialized) {
        this.initialized = false;
        this.initializePageBuilder();
      }
    }
  }
  get layoutMode() {
    return this._layoutMode;
  }
  set initialDesign(value) {
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
  get initialDesign() {
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
      this.initializePageBuilder();
    }, 0);
  }
  hasValidConfig() {
    var _a, _b;
    return (
      this.config &&
      (((_a = this.config.Basic) == null ? void 0 : _a.length) > 0 ||
        ((_b = this.config.Extra) == null ? void 0 : _b.length) > 0 ||
        (this.config.Custom && Object.keys(this.config.Custom).length > 0))
    );
  }
  set configData(value) {
    this.config = value;
    this.initialized = false;
    this.initializePageBuilder();
  }
  get configData() {
    return this.config;
  }
  // Initializes the PageBuilder instance
  initializePageBuilder() {
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
        this.showAttributeTab,
        this._layoutMode
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
