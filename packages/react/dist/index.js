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
var PageBuilderReact = ({ config, customComponents }) => {
  const builderRef = (0, import_react.useRef)(null);
  const [processedConfig, setProcessedConfig] = (0, import_react.useState)(
    config
  );
  (0, import_react.useEffect)(() => {
    import('@mindfiredigital/page-builder-web-component').catch(error => {
      console.error('Failed to load web component:', error);
    });
  }, []);
  (0, import_react.useEffect)(() => {
    const modifiedConfig = JSON.parse(JSON.stringify(config));
    if (customComponents) {
      modifiedConfig.Custom = modifiedConfig.Custom || {};
      Object.entries(customComponents).forEach(([key, componentConfig]) => {
        if (!componentConfig.component) {
          console.warn(`Skipping invalid component: ${key}`);
          return;
        }
        const tagName = `react-component-${key.toLowerCase()}`;
        if (!customElements.get(tagName)) {
          class ReactComponentElement extends HTMLElement {
            connectedCallback() {
              const mountPoint = document.createElement('div');
              this.appendChild(mountPoint);
              try {
                import_client.default
                  .createRoot(mountPoint)
                  .render(
                    import_react.default.createElement(
                      componentConfig.component
                    )
                  );
              } catch (error) {
                console.error(`Error rendering ${key} component:`, error);
              }
            }
          }
          customElements.define(tagName, ReactComponentElement);
        }
        modifiedConfig.Custom[key] = {
          component: tagName,
          svg: componentConfig.svg,
          title: componentConfig.title,
        };
      });
    }
    setProcessedConfig(modifiedConfig);
  }, [config, customComponents]);
  (0, import_react.useEffect)(() => {
    if (builderRef.current) {
      try {
        const configString = JSON.stringify(processedConfig);
        builderRef.current.setAttribute('config-data', configString);
      } catch (error) {
        console.error('Error setting config-data:', error);
      }
    }
  }, [processedConfig]);
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
