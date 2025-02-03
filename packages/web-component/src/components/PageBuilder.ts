import { PageBuilder } from '@mindfiredigital/page-builder-core/dist/PageBuilder.js';

export class PageBuilderComponent extends HTMLElement {
  private pageBuilder!: PageBuilder;
  private initialized = false;

  constructor() {
    super();

    // Set up inner HTML structure
    this.innerHTML = `
      <div id="app">
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
      </div>
    `;
  }

  connectedCallback() {
    if (this.initialized) return;

    const appElement = this.querySelector('#app');
    if (appElement) {
      this.initializePageBuilder();
      this.initialized = true;
      return;
    }
    const observer = new MutationObserver((mutations, obs) => {
      const appElement = this.querySelector('#app');
      if (appElement) {
        this.initializePageBuilder();
        obs.disconnect();
        this.initialized = true;
      }
    });
    observer.observe(this, { childList: true, subtree: true });
  }

  private initializePageBuilder() {
    try {
      this.pageBuilder = new PageBuilder();

      requestAnimationFrame(() => {
        if (typeof this.pageBuilder.setupInitialComponents === 'function') {
          this.pageBuilder.setupInitialComponents();
        } else {
          console.error('setupInitialComponents is not a function');
        }
      });
    } catch (error) {
      console.error('Failed to initialize PageBuilder:', error);
    }
  }

  disconnectedCallback() {
    this.initialized = false;
  }
}

// Register the custom element
if (!customElements.get('page-builder')) {
  customElements.define('page-builder', PageBuilderComponent);
}
