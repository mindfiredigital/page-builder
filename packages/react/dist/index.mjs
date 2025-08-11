// src/components/PageBuilder.tsx
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
var PageBuilderReact = ({
  config,
  customComponents,
  initialDesign,
  onChange,
  editable = true
}) => {
  const builderRef = useRef(null);
  const [processedConfig, setProcessedConfig] = useState(config);
  const [isComponentReady, setIsComponentReady] = useState(false);
  useEffect(() => {
    const loadComponent = async () => {
      try {
        await import("@mindfiredigital/page-builder-web-component");
        setIsComponentReady(true);
      } catch (error) {
        console.error("Failed to load web component:", error);
      }
    };
    loadComponent();
  }, []);
  useEffect(() => {
    const modifiedConfig = JSON.parse(
      JSON.stringify(config)
    );
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
              console.log(
                "PageBuilderComponent connected. First child:",
                this.firstElementChild
              );
              this.innerHTML = "";
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
          console.log("Defining custom element tag1:", tagName);
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
                console.log("rendering");
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
          console.log("Custom components:", customComponents);
          console.log("Generated tagName:", tagName);
          console.log("Defining custom element tag 2:", tagName);
          customElements.define(settingsTagName, ReactSettingsElement);
        }
        modifiedConfig.Custom[key] = {
          component: tagName,
          svg: typeof componentConfig.svg === "string" ? componentConfig.svg.trim() : "",
          title: componentConfig.title,
          settingsComponent: componentConfig.settingsComponent,
          settingsComponentTagName: settingsTagName
        };
      });
    }
    setProcessedConfig(modifiedConfig);
  }, [config, customComponents]);
  useEffect(() => {
    var _a;
    if (isComponentReady && builderRef.current) {
      console.log("config 2 okay");
      try {
        const configString = JSON.stringify(processedConfig);
        (_a = builderRef.current) == null ? void 0 : _a.setAttribute("config-data", configString);
        console.log(configString, "config");
        if (builderRef.current) {
          console.log("init done y");
          builderRef.current.initialDesign = initialDesign;
          builderRef.current.editable = editable;
          console.log(initialDesign, "initial design 2");
        }
      } catch (error) {
        console.error("Error setting config-data and initialDesign:", error);
      }
    }
  }, [isComponentReady, processedConfig, initialDesign, editable]);
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
  if (!isComponentReady) {
    return /* @__PURE__ */ React.createElement("div", null, "Loading Page Builder...");
  }
  return /* @__PURE__ */ React.createElement("page-builder", { ref: builderRef });
};
export {
  PageBuilderReact
};
//# sourceMappingURL=index.mjs.map