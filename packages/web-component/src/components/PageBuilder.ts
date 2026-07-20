import { PageBuilder } from '@mindfiredigital/page-builder/dist/PageBuilder.js';
import type {
  PageBuilderDesign,
  ComponentAttribute,
  BasicComponent,
} from '@mindfiredigital/page-builder';

/* Re-exported so consumers (e.g. the react wrapper) can keep importing
   these shared shapes from this package without reaching into core directly.
   The canonical definitions live in core — see core/src/types/types.d.ts. */
export type { PageBuilderDesign, ComponentAttribute, BasicComponent };

export class PageBuilderComponent extends HTMLElement {
  private pageBuilder!: PageBuilder;
  private initialized = false;
  private _initialDesign: PageBuilderDesign | null = null;
  private _editable: boolean | null = null;
  private _brandTitle?: string;
  private _showAttributeTab?: boolean;
  private _layoutMode?: 'absolute' | 'grid';
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
  }

  set editable(value: boolean | null) {
    if (this._editable !== value) {
      this._editable = value;
      if (this.initialized) {
        this.initialized = false;
        this.initializePageBuilder();
      }
    }
  }

  // Corrected getter for 'editable'
  get editable(): boolean | null {
    return this._editable;
  }

  set brandTitle(value: string | undefined) {
    if (this._brandTitle !== value) {
      this._brandTitle = value;
      if (this.initialized) {
        this.initialized = false;
        this.initializePageBuilder();
      }
    }
  }

  get brandTitle(): string | undefined {
    return this._brandTitle;
  }

  set showAttributeTab(value: boolean | undefined) {
    if (this._showAttributeTab !== value) {
      this._showAttributeTab = value;
      if (this.initialized) {
        this.initialized = false;
        this.initializePageBuilder();
      }
    }
  }

  get showAttributeTab(): boolean | undefined {
    return this._showAttributeTab;
  }
  set layoutMode(value: 'absolute' | 'grid' | undefined) {
    if (this._layoutMode !== value) {
      this._layoutMode = value;
      if (this.initialized) {
        this.initialized = false;
        this.initializePageBuilder();
      }
    }
  }

  get layoutMode(): 'absolute' | 'grid' | undefined {
    return this._layoutMode;
  }

  set initialDesign(value: PageBuilderDesign | null) {
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

  get initialDesign(): PageBuilderDesign | null {
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

      // if (this.hasValidConfig()) {
      this.initializePageBuilder();
      // }
    }, 0);
  }

  private hasValidConfig(): boolean {
    return (
      this.config &&
      (this.config.Basic?.length > 0 ||
        this.config.Extra?.length > 0 ||
        (this.config.Custom && Object.keys(this.config.Custom).length > 0))
    );
  }

  set configData(value: any) {
    this.config = value;
    this.initialized = false;
    if (!this.firstElementChild) {
      this.innerHTML = this.template;
    }
    this.initializePageBuilder();
  }

  get configData() {
    return this.config;
  }

  /* Applies a new design to this already-mounted instance, live — used by a
     live-sync client (e.g. a sidecar pushing an agent's edit over
     WebSocket/SSE) to reflect the change without a full page reload. */
  applyDesign(design: PageBuilderDesign): void {
    if (!this.pageBuilder) {
      throw new Error('PageBuilder is not initialized yet.');
    }
    this.pageBuilder.applyDesign(design);
  }

  /* Returns the current design as final HTML/CSS strings. Used by headless
     callers (e.g. the CLI's `render` command) that don't have a click-driven
     export button in the page. */
  generateOutput(): { html: string; css: string } {
    if (!this.pageBuilder) {
      throw new Error('PageBuilder is not initialized yet.');
    }
    return this.pageBuilder.generateOutput();
  }

  // Initializes the PageBuilder instance
  private initializePageBuilder() {
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
}

// Define the custom element if it hasn't been registered already
if (!customElements.get('page-builder')) {
  customElements.define('page-builder', PageBuilderComponent);
}
