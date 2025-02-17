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
    // Set inner HTML only if no child elements exist
    if (!this.firstElementChild) {
      this.innerHTML = this.template;
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
      this.pageBuilder = new PageBuilder();
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
