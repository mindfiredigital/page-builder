// src/components/PageBuilder.tsx
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
var PageBuilderReact = ({
  config,
  customComponents,
  initialDesign,
  onChange
}) => {
  const builderRef = useRef(null);
  const [processedConfig, setProcessedConfig] = useState(config);
  console.log(initialDesign, "init farams");
  useEffect(() => {
    import("@mindfiredigital/page-builder-web-component").catch((error) => {
      console.error("Failed to load web component:", error);
    });
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
            // This `this` refers to the instance of the Web Component (e.g., <react-component-customrating id="CustomRating1">)
            connectedCallback() {
              const mountPoint = document.createElement("div");
              this.appendChild(mountPoint);
              const componentId = this.id;
              try {
                ReactDOM.createRoot(mountPoint).render(
                  React.createElement(componentConfig.component, {
                    componentId
                  })
                  // <--- PASSING THE PROP HERE
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
          // The tagName refers to the custom Web Component tag
          svg: componentConfig.svg,
          title: componentConfig.title
          // Note: The actual React component (componentConfig.component) is used internally by ReactComponentElement
          // and its settings are already in data-custom-settings on the wrapper div (handled by Canvas.ts)
        };
      });
    }
    setProcessedConfig(modifiedConfig);
  }, [config, customComponents]);
  useEffect(() => {
    if (builderRef.current) {
      setTimeout(() => {
        var _a;
        try {
          const configString = JSON.stringify(processedConfig);
          (_a = builderRef.current) == null ? void 0 : _a.setAttribute("config-data", configString);
          if (builderRef.current) {
            builderRef.current.initialDesign = initialDesign;
          }
        } catch (error) {
          console.error("Error setting config-data and initialDesign:", error);
        }
      }, 100);
    }
  }, [processedConfig, initialDesign]);
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