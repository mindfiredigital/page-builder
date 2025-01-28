'use strict';
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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

// src/index.tsx
var src_exports = {};
__export(src_exports, {
  PageBuilderReact: () => PageBuilderReact,
});
module.exports = __toCommonJS(src_exports);

// src/components/PageBuilder.tsx
var import_react = __toESM(require('react'));
var import_PageBuilder = require('@mindfiredigital/page-builder-core/dist/PageBuilder.js');
var PageBuilderReact = ({ onInitialize, customStyles = {} }) => {
  const pageBuilderRef = (0, import_react.useRef)(null);
  const wrapperRef = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(() => {
    const setupDOMStructure = () => {
      if (!wrapperRef.current) return;
      wrapperRef.current.innerHTML = '';
      const appDiv = document.createElement('div');
      appDiv.id = 'app';
      appDiv.innerHTML = `
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
        </div>`;
      wrapperRef.current.appendChild(appDiv);
    };
    const initializePageBuilder = () => {
      try {
        if (!pageBuilderRef.current) {
          setupDOMStructure();
          const pageBuilder = new import_PageBuilder.PageBuilder();
          pageBuilderRef.current = pageBuilder;
          if (onInitialize) {
            onInitialize(pageBuilder);
          }
          const event = new Event('DOMContentLoaded');
          document.dispatchEvent(event);
        }
      } catch (error) {
        console.error('Error initializing PageBuilder:', error);
      }
    };
    setTimeout(initializePageBuilder, 0);
    return () => {
      pageBuilderRef.current = null;
    };
  }, [onInitialize]);
  return /* @__PURE__ */ import_react.default.createElement('div', {
    ref: wrapperRef,
    style: {
      margin: 'auto',
      width: '100%',
      height: '100%',
      ...customStyles.wrapper,
    },
  });
};
// Annotate the CommonJS export names for ESM import in node:
0 &&
  (module.exports = {
    PageBuilderReact,
  });
//# sourceMappingURL=index.js.map
