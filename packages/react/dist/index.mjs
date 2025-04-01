// src/components/PageBuilder.tsx
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
var PageBuilderReact = ({
  config,
  customComponents
}) => {
  const builderRef = useRef(null);
  const [processedConfig, setProcessedConfig] = useState(config);
  useEffect(() => {
    import("@mindfiredigital/page-builder-web-component").catch((error) => {
      console.error("Failed to load web component:", error);
    });
  }, []);
  useEffect(() => {
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
              const mountPoint = document.createElement("div");
              this.appendChild(mountPoint);
              try {
                ReactDOM.createRoot(mountPoint).render(
                  React.createElement(componentConfig.component)
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
          title: componentConfig.title
        };
      });
    }
    setProcessedConfig(modifiedConfig);
  }, [config, customComponents]);
  useEffect(() => {
    if (builderRef.current) {
      try {
        const configString = JSON.stringify(processedConfig);
        builderRef.current.setAttribute("config-data", configString);
      } catch (error) {
        console.error("Error setting config-data:", error);
      }
    }
  }, [processedConfig]);
  return /* @__PURE__ */ React.createElement("page-builder", { ref: builderRef });
};
export {
  PageBuilderReact
};
//# sourceMappingURL=index.mjs.map