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

if (!customElements.get('page-builder')) {
  customElements.define('page-builder', PageBuilderComponent);
}
