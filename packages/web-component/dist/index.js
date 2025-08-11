// src/components/PageBuilder.ts
import { PageBuilder } from '@mindfiredigital/page-builder/dist/PageBuilder.js';
var PageBuilderComponent = class extends HTMLElement {
  constructor() {
    console.log('is it even being called');
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
  // Observe 'config-data' attribute to detect changes
  static get observedAttributes() {
    return ['config-data'];
  }
  attributeChangedCallback(name, oldValue, newValue) {
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
  set editable(value) {
    console.log('called');
    if (this._editable !== value) {
      this._editable = value;
      if (this.isConnected && this.hasValidConfig()) {
        this.initializePageBuilder();
      }
    }
  }
  // Corrected getter for 'editable'
  get editable() {
    return this._editable;
  }
  set initialDesign(value) {
    if (this._initialDesign !== value) {
      this._initialDesign = value;
      if (this.isConnected && this.hasValidConfig()) {
        this.initializePageBuilder();
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
      if (this.hasValidConfig()) {
        this.initializePageBuilder();
      }
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
  // Initializes the PageBuilder instance
  initializePageBuilder() {
    console.log('init');
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
};
if (!customElements.get('page-builder')) {
  customElements.define('page-builder', PageBuilderComponent);
}
export { PageBuilderComponent };
//# sourceMappingURL=index.js.map
