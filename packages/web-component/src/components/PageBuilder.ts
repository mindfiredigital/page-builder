import { PageBuilder } from '@mindfiredigital/page-builder-core';

console.log('Web component script is running...');
console.log('Attempting to import PageBuilder...');

export class PageBuilderComponent extends HTMLElement {
  private pageBuilder!: PageBuilder;

  constructor() {
    super();

    // Log the imported PageBuilder class for debugging
    console.log('PageBuilder class:', PageBuilder);

    // Check if PageBuilder is properly imported
    if (!PageBuilder) {
      console.error('❌ PageBuilder is undefined. Check your import.');
      return;
    }

    // Initialize the PageBuilder instance
    this.pageBuilder = new PageBuilder();

    // Attach Shadow DOM
    const shadow = this.attachShadow({ mode: 'open' });

    // Set up inner HTML with styling and layout structure
    shadow.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          height: 100%;
        }
        #app {
          display: flex;
          height: 100%;
        }
        #sidebar {
          width: 250px;
          background: #f4f4f4;
          padding: 10px;
        }
        #canvas {
          flex-grow: 1;
          background: white;
          border: 1px solid #ccc;
          padding: 20px;
        }
        #customization {
          width: 300px;
          background: #f8f9fa;
          padding: 10px;
        }
        .hidden {
          display: none;
        }
        /* Additional custom styles can be applied here */
      </style>

      <header>
        <nav id="preview-navbar"></nav>
      </header>

      <div id="app">
        <div id="sidebar">Sidebar</div>
        <div id="canvas" class="canvas">Canvas</div>
        <div id="customization">
          <h4 id="component-name">Component: None</h4>
          <div id="controls"></div>
          <div id="layers-view" class="hidden"></div>
        </div>
      </div>
    `;
  }

  connectedCallback() {
    console.log('✅ PageBuilderComponent connected to the DOM.');

    // Initialize the PageBuilder instance after component is connected
    setTimeout(() => {
      if (
        this.pageBuilder &&
        typeof this.pageBuilder.setupInitialComponents === 'function'
      ) {
        this.pageBuilder.setupInitialComponents();
        console.log('✅ PageBuilder initialized.');
      } else {
        console.error(
          '❌ pageBuilder.setupInitialComponents() is missing or not a function.'
        );
      }
    }, 0);
  }

  disconnectedCallback() {
    // Cleanup when the component is removed from the DOM (if necessary)
    console.log('❌ PageBuilderComponent disconnected from the DOM.');
  }
}

// Register the custom element if it's not already registered
if (!customElements.get('page-builder')) {
  customElements.define('page-builder', PageBuilderComponent);
  console.log('✅ Custom element "page-builder" registered.');
} else {
  console.warn('⚠️ "page-builder" is already defined.');
}
