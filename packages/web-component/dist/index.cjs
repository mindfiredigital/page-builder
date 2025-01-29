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
console.log("Web component script is running...");
console.log("Attempting to import PageBuilder...");
var PageBuilderComponent = class extends HTMLElement {
  constructor() {
    super();
    console.log("PageBuilder class:", import_PageBuilder.PageBuilder);
    if (!import_PageBuilder.PageBuilder) {
      console.error("\u274C PageBuilder is undefined. Check your import.");
      return;
    }
    this.pageBuilder = new import_PageBuilder.PageBuilder();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
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
    console.log("\u2705 PageBuilderComponent connected to the DOM.");
    setTimeout(() => {
      if (this.pageBuilder && typeof this.pageBuilder.setupInitialComponents === "function") {
        this.pageBuilder.setupInitialComponents();
        console.log("\u2705 PageBuilder initialized.");
      } else {
        console.error(
          "\u274C pageBuilder.setupInitialComponents() is missing or not a function."
        );
      }
    }, 0);
  }
  disconnectedCallback() {
    console.log("\u274C PageBuilderComponent disconnected from the DOM.");
  }
};
if (!customElements.get("page-builder")) {
  customElements.define("page-builder", PageBuilderComponent);
  console.log('\u2705 Custom element "page-builder" registered.');
} else {
  console.warn('\u26A0\uFE0F "page-builder" is already defined.');
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PageBuilderComponent
});
//# sourceMappingURL=index.cjs.map