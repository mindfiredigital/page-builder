// src/components/PageBuilder.tsx
import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";
var PageBuilderReact = ({ config }) => {
  const builderRef = useRef(null);
  useEffect(() => {
    import("@mindfiredigital/page-builder-web-component").catch((error) => {
      console.error("Failed to load web component:", error);
    });
  }, []);
  useEffect(() => {
    if (builderRef.current) {
      const modifiedConfig = JSON.parse(JSON.stringify(config));
      Object.entries(modifiedConfig.Custom).forEach(([key, componentConfig]) => {
        const { component: Component } = componentConfig;
        const tagName = `react-component-${key.toLowerCase()}`;
        if (!customElements.get(tagName)) {
          class ReactComponentElement extends HTMLElement {
            connectedCallback() {
              const mountPoint = document.createElement("div");
              this.appendChild(mountPoint);
              ReactDOM.createRoot(mountPoint).render(/* @__PURE__ */ React.createElement(Component, null));
            }
          }
          customElements.define(tagName, ReactComponentElement);
        }
        modifiedConfig.Custom[key] = {
          ...componentConfig,
          component: tagName
          // Replace React component with tag name
        };
      });
      builderRef.current.setAttribute("config-data", JSON.stringify(modifiedConfig));
    }
  }, [config]);
  return /* @__PURE__ */ React.createElement("page-builder", { ref: builderRef });
};
export {
  PageBuilderReact
};
//# sourceMappingURL=index.mjs.map