// src/components/PageBuilder.ts
import { PageBuilder } from '@mindfiredigital/page-builder-core/dist/PageBuilder.js';
var PageBuilderComponent = class extends HTMLElement {
  constructor() {
    super();
    this.initialized = false;
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
  connectedCallback() {
    if (this.initialized) {
      return;
    }
    this.initializePageBuilder();
  }
  initializePageBuilder() {
    if (this.initialized) {
      return;
    }
    try {
      this.initialized = true;
      this.pageBuilder = new PageBuilder();
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
