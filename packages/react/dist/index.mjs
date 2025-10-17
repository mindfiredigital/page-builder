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
  showAttributeTab
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
              const mountPoint = document.createElement("div");
              this.appendChild(mountPoint);
              const componentId = this.id;
              try {
                ReactDOM.createRoot(mountPoint).render(
                  React.createElement(componentConfig.component, {
                    componentId
                  })
                );
              } catch (error) {
                console.error(`Error rendering ${key} component:`, error);
              }
            }
          }
          customElements.define(tagName, ReactComponentElement);
        }
        const settingsTagName = `react-settings-component-${key.toLowerCase()}`;
        if (componentConfig.settingsComponent && !customElements.get(settingsTagName)) {
          class ReactSettingsElement extends HTMLElement {
            connectedCallback() {
              this.innerHTML = "";
              const mountPoint = document.createElement("div");
              this.appendChild(mountPoint);
              const settingsData = this.getAttribute("data-settings");
              const parsedSettings = settingsData ? JSON.parse(settingsData) : {};
              try {
                ReactDOM.createRoot(mountPoint).render(
                  React.createElement(
                    componentConfig.settingsComponent,
                    parsedSettings
                  )
                );
              } catch (error) {
                console.error(`Error rendering settings component:`, error);
              }
            }
            static get observedAttributes() {
              return ["data-settings"];
            }
            attributeChangedCallback(name, oldValue, newValue) {
              if (name === "data-settings" && newValue !== oldValue) {
                this.innerHTML = "";
                const mountPoint = document.createElement("div");
                this.appendChild(mountPoint);
                const settingsData = this.getAttribute("data-settings");
                const parsedSettings = settingsData ? JSON.parse(settingsData) : {};
                ReactDOM.createRoot(mountPoint).render(
                  React.createElement(
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
          settingsComponentTagName: settingsTagName
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
            const configString = JSON.stringify(processedConfig);
            builderRef.current.setAttribute("config-data", configString);
          }
        } catch (error) {
          console.error("Error setting config-data and initialDesign:", error);
        }
      });
    }
  }, [processedConfig, initialDesign, editable, brandTitle, showAttributeTab]);
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