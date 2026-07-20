// src/components/PageBuilder.tsx
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
var PageBuilderReact = ({
  config,
  customComponents,
  initialDesign,
  onChange,
  editable = true,
  brandTitle,
  showAttributeTab,
  layoutMode = "absolute"
}) => {
  const builderRef = useRef(null);
  const [processedConfig, setProcessedConfig] = useState(config);
  useEffect(() => {
    import("@mindfiredigital/page-builder-web-component").catch((error) => {
      console.error("Failed to load web component:", error);
    });
  }, []);
  useEffect(() => {
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
              clearTimeout(this._unmountTimer);
              this._unmountTimer = void 0;
              if (this._pbMounted)
                return;
              this._pbMounted = true;
              this.style.display = "block";
              if (!this.style.width && componentConfig.defaultWidth)
                this.style.width = componentConfig.defaultWidth;
              if (!this.style.height && componentConfig.defaultHeight)
                this.style.height = componentConfig.defaultHeight;
              Array.from(this.children).forEach((child) => {
                const el = child;
                if (!el.classList.contains("component-controls") && !el.classList.contains("component-label")) {
                  el.remove();
                }
              });
              const mountPoint = document.createElement("div");
              mountPoint.style.cssText = "width:100%;height:100%;display:block;margin:0;padding:0;";
              this.appendChild(mountPoint);
              const componentId = this.id;
              try {
                const root = ReactDOM.createRoot(mountPoint);
                root.render(
                  React.createElement(componentConfig.component, {
                    componentId
                  })
                );
                this._pbRoot = root;
              } catch (error) {
                console.error(`Error rendering ${key} component:`, error);
              }
            }
            disconnectedCallback() {
              const root = this._pbRoot;
              this._unmountTimer = setTimeout(() => {
                this._unmountTimer = void 0;
                if (this.isConnected)
                  return;
                document.dispatchEvent(
                  new CustomEvent("pb:component-removed", {
                    detail: { componentId: this.id }
                  })
                );
                if (root)
                  root.unmount();
                this._pbRoot = null;
                this._pbMounted = false;
              }, 0);
            }
          }
          customElements.define(tagName, ReactComponentElement);
        }
        const settingsTagName = `react-settings-component-${key.toLowerCase()}`;
        if (componentConfig.settingsComponent && !customElements.get(settingsTagName)) {
          class ReactSettingsElement extends HTMLElement {
            _renderSettings() {
              if (!this._settingsRoot) {
                const mountPoint = document.createElement("div");
                this.appendChild(mountPoint);
                this._settingsRoot = ReactDOM.createRoot(mountPoint);
              }
              const settingsData = this.getAttribute("data-settings");
              const parsedSettings = settingsData ? JSON.parse(settingsData) : {};
              try {
                this._settingsRoot.render(
                  React.createElement(
                    componentConfig.settingsComponent,
                    parsedSettings
                  )
                );
              } catch (error) {
                console.error(`Error rendering settings component:`, error);
              }
            }
            connectedCallback() {
              this._renderSettings();
            }
            static get observedAttributes() {
              return ["data-settings"];
            }
            attributeChangedCallback(name, oldValue, newValue) {
              if (name === "data-settings" && newValue !== oldValue) {
                this._renderSettings();
              }
            }
          }
          customElements.define(settingsTagName, ReactSettingsElement);
        }
        const customizeTagName = `react-customize-component-${key.toLowerCase()}`;
        if (componentConfig.customizeComponent && !customElements.get(customizeTagName)) {
          const CustomizeCtor = componentConfig.customizeComponent;
          class ReactCustomizeElement extends HTMLElement {
            connectedCallback() {
              this._mount();
            }
            static get observedAttributes() {
              return ["data-settings"];
            }
            attributeChangedCallback(name, oldValue, newValue) {
              if (name === "data-settings" && newValue !== oldValue) {
                this._mount();
              }
            }
            _mount() {
              if (!this._customizeRoot) {
                const mountPoint = document.createElement("div");
                this.appendChild(mountPoint);
                this._customizeRoot = ReactDOM.createRoot(mountPoint);
              }
              const settingsData = this.getAttribute("data-settings");
              const parsedSettings = settingsData ? JSON.parse(settingsData) : {};
              try {
                this._customizeRoot.render(
                  React.createElement(CustomizeCtor, parsedSettings)
                );
              } catch (error) {
                console.error(
                  `Error rendering customize component for ${key}:`,
                  error
                );
              }
            }
          }
          customElements.define(customizeTagName, ReactCustomizeElement);
        }
        modifiedConfig.Custom[key] = {
          component: tagName,
          svg: componentConfig.svg,
          title: componentConfig.title,
          settingsComponent: settingsTagName,
          settingsComponentTagName: settingsTagName,
          customizeComponentTagName: componentConfig.customizeComponent ? customizeTagName : void 0
        };
      });
    }
    setProcessedConfig(modifiedConfig);
  }, [config, customComponents]);
  useEffect(() => {
    if (builderRef.current) {
      customElements.whenDefined("page-builder").then(() => {
        try {
          if (builderRef.current) {
            builderRef.current.configData = processedConfig;
            builderRef.current.initialDesign = initialDesign;
            builderRef.current.editable = editable;
            builderRef.current.brandTitle = brandTitle;
            builderRef.current.showAttributeTab = showAttributeTab;
            builderRef.current.layoutMode = layoutMode;
            const configString = JSON.stringify(processedConfig);
            builderRef.current.setAttribute("config-data", configString);
          }
        } catch (error) {
          console.error("Error setting config-data and initialDesign:", error);
        }
      });
    }
  }, [
    processedConfig,
    initialDesign,
    editable,
    brandTitle,
    showAttributeTab,
    layoutMode
  ]);
  useEffect(() => {
    const webComponent = builderRef.current;
    const handleDesignChange = (event) => {
      const customEvent = event;
      if (onChange) {
        onChange(customEvent.detail);
      }
    };
    if (webComponent) {
      webComponent.addEventListener("design-change", handleDesignChange);
    }
    return () => {
      if (webComponent) {
        webComponent.removeEventListener("design-change", handleDesignChange);
      }
    };
  }, [onChange]);
  return /* @__PURE__ */ React.createElement("page-builder", { ref: builderRef });
};
export {
  PageBuilderReact
};
//# sourceMappingURL=index.mjs.map