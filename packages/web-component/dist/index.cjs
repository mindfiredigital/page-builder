"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  PageBuilderComponent: () => PageBuilderComponent
});
module.exports = __toCommonJS(src_exports);

// src/components/PageBuilder.ts
var import_PageBuilder = require("@mindfiredigital/page-builder-core/dist/PageBuilder.js");
var PageBuilderComponent = class extends HTMLElement {
  constructor() {
    super();
    this.initialized = false;
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
    if (this.initialized)
      return;
    const observer = new MutationObserver((mutations, obs) => {
      const appElement = this.querySelector("#app");
      if (appElement) {
        this.initializePageBuilder();
        obs.disconnect();
        this.initialized = true;
      }
    });
    observer.observe(this, {
      childList: true,
      subtree: true
    });
  }
  initializePageBuilder() {
    try {
      this.pageBuilder = new import_PageBuilder.PageBuilder();
      requestAnimationFrame(() => {
        if (typeof this.pageBuilder.setupInitialComponents === "function") {
          this.pageBuilder.setupInitialComponents();
          console.log("\u2705 PageBuilder initialized successfully");
        } else {
          console.error("\u274C setupInitialComponents is not a function");
        }
      });
    } catch (error) {
      console.error("\u274C Failed to initialize PageBuilder:", error);
    }
  }
  disconnectedCallback() {
    this.initialized = false;
    console.log("\u274C PageBuilderComponent disconnected from the DOM");
  }
};
if (!customElements.get("page-builder")) {
  customElements.define("page-builder", PageBuilderComponent);
  console.log('\u2705 Custom element "page-builder" registered');
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PageBuilderComponent
});
//# sourceMappingURL=index.cjs.map