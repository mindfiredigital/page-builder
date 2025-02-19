var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// ../../node_modules/.pnpm/@mindfiredigital+page-builder-web-component@1.1.1_@mindfiredigital+page-builder-core@packages+core/node_modules/@mindfiredigital/page-builder-web-component/dist/index.js
var dist_exports = {};
__export(dist_exports, {
  PageBuilderComponent: () => PageBuilderComponent
});
import { PageBuilder } from "@mindfiredigital/page-builder-core/dist/PageBuilder.js";
var PageBuilderComponent;
var init_dist = __esm({
  "../../node_modules/.pnpm/@mindfiredigital+page-builder-web-component@1.1.1_@mindfiredigital+page-builder-core@packages+core/node_modules/@mindfiredigital/page-builder-web-component/dist/index.js"() {
    PageBuilderComponent = class extends HTMLElement {
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
      // Lifecycle method: Called when the element is added to the DOM
      connectedCallback() {
        if (this.initialized) {
          return;
        }
        this.initializePageBuilder();
      }
      // Initializes the PageBuilder instance
      initializePageBuilder() {
        if (this.initialized) {
          return;
        }
        try {
          this.initialized = true;
          this.pageBuilder = new PageBuilder();
        } catch (error) {
          console.error("Failed to initialize PageBuilder:", error);
          this.initialized = false;
        }
      }
    };
    if (!customElements.get("page-builder")) {
      customElements.define("page-builder", PageBuilderComponent);
    }
  }
});

// src/components/PageBuilder.tsx
import React, { useEffect } from "react";
var PageBuilderReact = () => {
  useEffect(() => {
    Promise.resolve().then(() => init_dist());
  }, []);
  return /* @__PURE__ */ React.createElement("page-builder", { style: { width: "100vw", height: "100vh" } });
};
export {
  PageBuilderReact
};
//# sourceMappingURL=index.mjs.map