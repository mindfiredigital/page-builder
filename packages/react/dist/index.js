'use strict';
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) =>
  function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])((fn = 0))), res;
  };
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if ((from && typeof from === 'object') || typeof from === 'function') {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, {
          get: () => from[key],
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
        });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (
  (target = mod != null ? __create(__getProtoOf(mod)) : {}),
  __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule
      ? __defProp(target, 'default', { value: mod, enumerable: true })
      : target,
    mod
  )
);
var __toCommonJS = mod =>
  __copyProps(__defProp({}, '__esModule', { value: true }), mod);

// ../../node_modules/.pnpm/@mindfiredigital+page-builder-web-component@1.1.1_@mindfiredigital+page-builder-core@packages+core/node_modules/@mindfiredigital/page-builder-web-component/dist/index.js
var dist_exports = {};
__export(dist_exports, {
  PageBuilderComponent: () => PageBuilderComponent,
});
var import_PageBuilder, PageBuilderComponent;
var init_dist = __esm({
  '../../node_modules/.pnpm/@mindfiredigital+page-builder-web-component@1.1.1_@mindfiredigital+page-builder-core@packages+core/node_modules/@mindfiredigital/page-builder-web-component/dist/index.js'() {
    import_PageBuilder = require('@mindfiredigital/page-builder-core/dist/PageBuilder.js');
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
          this.pageBuilder = new import_PageBuilder.PageBuilder();
        } catch (error) {
          console.error('Failed to initialize PageBuilder:', error);
          this.initialized = false;
        }
      }
    };
    if (!customElements.get('page-builder')) {
      customElements.define('page-builder', PageBuilderComponent);
    }
  },
});

// src/index.tsx
var src_exports = {};
__export(src_exports, {
  PageBuilderReact: () => PageBuilderReact,
});
module.exports = __toCommonJS(src_exports);

// src/components/PageBuilder.tsx
var import_react = __toESM(require('react'));
var PageBuilderReact = () => {
  (0, import_react.useEffect)(() => {
    Promise.resolve().then(() => init_dist());
  }, []);
  return /* @__PURE__ */ import_react.default.createElement('page-builder', {
    style: { width: '100vw', height: '100vh' },
  });
};
// Annotate the CommonJS export names for ESM import in node:
0 &&
  (module.exports = {
    PageBuilderReact,
  });
//# sourceMappingURL=index.js.map
