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
var PageBuilderReact = ({
  config,
  customComponents,
  initialDesign,
  onChange,
  editable = true,
  brandTitle,
  showAttributeTab,
  layoutMode = 'absolute',
}) => {
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
    const modifiedConfig = config;
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
              const componentId = this.id;
              try {
                import_client.default.createRoot(mountPoint).render(
                  import_react.default.createElement(
                    componentConfig.component,
                    {
                      componentId,
                    }
                  )
                );
              } catch (error) {
                console.error(`Error rendering ${key} component:`, error);
              }
            }
          }
          customElements.define(tagName, ReactComponentElement);
        }
        const settingsTagName = `react-settings-component-${key.toLowerCase()}`;
        if (
          componentConfig.settingsComponent &&
          !customElements.get(settingsTagName)
        ) {
          class ReactSettingsElement extends HTMLElement {
            connectedCallback() {
              this.innerHTML = '';
              const mountPoint = document.createElement('div');
              this.appendChild(mountPoint);
              const settingsData = this.getAttribute('data-settings');
              const parsedSettings = settingsData
                ? JSON.parse(settingsData)
                : {};
              try {
                import_client.default
                  .createRoot(mountPoint)
                  .render(
                    import_react.default.createElement(
                      componentConfig.settingsComponent,
                      parsedSettings
                    )
                  );
              } catch (error) {
                console.error(`Error rendering settings component:`, error);
              }
            }
            static get observedAttributes() {
              return ['data-settings'];
            }
            attributeChangedCallback(name, oldValue, newValue) {
              if (name === 'data-settings' && newValue !== oldValue) {
                this.innerHTML = '';
                const mountPoint = document.createElement('div');
                this.appendChild(mountPoint);
                const settingsData = this.getAttribute('data-settings');
                const parsedSettings = settingsData
                  ? JSON.parse(settingsData)
                  : {};
                import_client.default
                  .createRoot(mountPoint)
                  .render(
                    import_react.default.createElement(
                      componentConfig.settingsComponent,
                      parsedSettings
                    )
                  );
              }
            }
          }
          customElements.define(settingsTagName, ReactSettingsElement);
        }
        modifiedConfig.Custom[key] = {
          component: tagName,
          svg: componentConfig.svg,
          title: componentConfig.title,
          settingsComponent: settingsTagName,
          settingsComponentTagName: settingsTagName,
        };
      });
    }
    setProcessedConfig(modifiedConfig);
  }, [config, customComponents]);
  (0, import_react.useEffect)(() => {
    if (builderRef.current) {
      customElements.whenDefined('page-builder').then(() => {
        try {
          if (builderRef.current) {
            builderRef.current.configData = processedConfig;
            builderRef.current.initialDesign = initialDesign;
            builderRef.current.editable = editable;
            builderRef.current.brandTitle = brandTitle;
            builderRef.current.showAttributeTab = showAttributeTab;
            builderRef.current.layoutMode = layoutMode;
            const configString = JSON.stringify(processedConfig);
            builderRef.current.setAttribute('config-data', configString);
          }
        } catch (error) {
          console.error('Error setting config-data and initialDesign:', error);
        }
      });
    }
  }, [processedConfig, initialDesign, editable, brandTitle, showAttributeTab]);
  (0, import_react.useEffect)(() => {
    const webComponent = builderRef.current;
    const handleDesignChange = event => {
      const customEvent = event;
      if (onChange) {
        onChange(customEvent.detail);
      }
    };
    if (webComponent) {
      webComponent.addEventListener('design-change', handleDesignChange);
    }
    return () => {
      if (webComponent) {
        webComponent.removeEventListener('design-change', handleDesignChange);
      }
    };
  }, [onChange]);
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
