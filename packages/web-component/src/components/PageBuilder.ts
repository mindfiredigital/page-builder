import { PageBuilder } from '@mindfiredigital/page-builder-core/dist/PageBuilder.js';

export class PageBuilderComponent extends HTMLElement {
  private pageBuilder!: PageBuilder;
  private initialized = false;
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
    // Only set the template once
    if (!this.firstElementChild) {
      this.innerHTML = this.template;
    }
  }

  connectedCallback() {
    // Ensure we only initialize once
    if (this.initialized) {
      return;
    }

    this.initializePageBuilder();
  }

  private initializePageBuilder() {
    if (this.initialized) {
      return;
    }

    try {
      // Set initialized first to prevent any potential race conditions
      this.initialized = true;

      this.pageBuilder = new PageBuilder();
    } catch (error) {
      console.error('Failed to initialize PageBuilder:', error);
      this.initialized = false;
    }
  }
}

// Register the custom element
if (!customElements.get('page-builder')) {
  customElements.define('page-builder', PageBuilderComponent);
}
