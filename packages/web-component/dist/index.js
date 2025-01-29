// src/components/PageBuilder.ts
import { PageBuilder } from '@mindfiredigital/page-builder-core';
console.log('Web component script is running...');
console.log('Attempting to import PageBuilder...');
var PageBuilderComponent = class extends HTMLElement {
  constructor() {
    super();
    console.log('PageBuilder class:', PageBuilder);
    if (!PageBuilder) {
      console.error('\u274C PageBuilder is undefined. Check your import.');
      return;
    }
    this.pageBuilder = new PageBuilder();
    const shadow = this.attachShadow({ mode: 'open' });
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
    console.log('\u2705 PageBuilderComponent connected to the DOM.');
    setTimeout(() => {
      if (
        this.pageBuilder &&
        typeof this.pageBuilder.setupInitialComponents === 'function'
      ) {
        this.pageBuilder.setupInitialComponents();
        console.log('\u2705 PageBuilder initialized.');
      } else {
        console.error(
          '\u274C pageBuilder.setupInitialComponents() is missing or not a function.'
        );
      }
    }, 0);
  }
  disconnectedCallback() {
    console.log('\u274C PageBuilderComponent disconnected from the DOM.');
  }
};
if (!customElements.get('page-builder')) {
  customElements.define('page-builder', PageBuilderComponent);
  console.log('\u2705 Custom element "page-builder" registered.');
} else {
  console.warn('\u26A0\uFE0F "page-builder" is already defined.');
}
export { PageBuilderComponent };
//# sourceMappingURL=index.js.map
