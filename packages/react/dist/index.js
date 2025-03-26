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
var import_client = __toESM(require('react-dom/client'));
var PageBuilderReact = ({ config }) => {
  const builderRef = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(() => {
    import('@mindfiredigital/page-builder-web-component').catch(error => {
      console.error('Failed to load web component:', error);
    });
  }, []);
  (0, import_react.useEffect)(() => {
    if (builderRef.current) {
      const modifiedConfig = JSON.parse(JSON.stringify(config));
      Object.entries(modifiedConfig.Custom).forEach(
        ([key, componentConfig]) => {
          const { component: Component } = componentConfig;
          const tagName = `react-component-${key.toLowerCase()}`;
          if (!customElements.get(tagName)) {
            class ReactComponentElement extends HTMLElement {
              connectedCallback() {
                const mountPoint = document.createElement('div');
                this.appendChild(mountPoint);
                import_client.default
                  .createRoot(mountPoint)
                  .render(
                    /* @__PURE__ */ import_react.default.createElement(
                      Component,
                      null
                    )
                  );
              }
            }
            customElements.define(tagName, ReactComponentElement);
          }
          modifiedConfig.Custom[key] = {
            ...componentConfig,
            component: tagName,
            // Replace React component with tag name
          };
        }
      );
      builderRef.current.setAttribute(
        'config-data',
        JSON.stringify(modifiedConfig)
      );
    }
  }, [config]);
  return /* @__PURE__ */ import_react.default.createElement('page-builder', {
    ref: builderRef,
  });
};
// Annotate the CommonJS export names for ESM import in node:
0 &&
  (module.exports = {
    PageBuilderReact,
  });
//# sourceMappingURL=index.js.map
