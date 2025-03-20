// src/components/PageBuilder.ts
import { PageBuilder } from '@mindfiredigital/page-builder-core/dist/PageBuilder.js';
var PageBuilderComponent = class extends HTMLElement {
  constructor() {
    super();
    this.initialized = false;
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
    if (!this.firstElementChild) {
      this.innerHTML = this.template;
    }
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
        this.initializePageBuilder();
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
  initializePageBuilder() {
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
};
if (!customElements.get('page-builder')) {
  customElements.define('page-builder', PageBuilderComponent);
}
export { PageBuilderComponent };
//# sourceMappingURL=index.js.map
