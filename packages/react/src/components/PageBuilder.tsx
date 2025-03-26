import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";

// Interface defining the structure of dynamic components
interface DynamicComponents {
  Basic: string[];
  Extra: string[];
  Custom: Record<string, CustomComponentConfig>;
}

interface CustomComponentConfig {
  component: any;
  svg?: string; // Optional SVG icon string
  title?: string; // Optional custom title
}
// Props interface for the PageBuilderReact component
interface PageBuilderReactProps {
  config: DynamicComponents;
}

export const PageBuilderReact: React.FC<PageBuilderReactProps> = ({ config }) => {
  const builderRef = useRef<HTMLElement>(null);

  useEffect(() => {
    import("@mindfiredigital/page-builder-web-component").catch(error => {
      console.error("Failed to load web component:", error);
    });
  }, []);

  // Convert React components to web components and pass configuration
  useEffect(() => {
    if (builderRef.current) {
      // Create a copy of config to modify
      const modifiedConfig: DynamicComponents = JSON.parse(JSON.stringify(config));

      // Convert React components in Custom section to web components
      Object.entries(modifiedConfig.Custom).forEach(([key, componentConfig]) => {
        const { component: Component } = componentConfig;
        const tagName = `react-component-${key.toLowerCase()}`;

        // Create a web component wrapper if it doesn't exist
        if (!customElements.get(tagName)) {
          class ReactComponentElement extends HTMLElement {
            connectedCallback() {
              const mountPoint = document.createElement("div");
              this.appendChild(mountPoint);
              
              // Create React root and render the component
              ReactDOM.createRoot(mountPoint).render(<Component />);
            }
          }
          
          // Define the custom element
          customElements.define(tagName, ReactComponentElement);
        }

        // Modify the original config to include the tag name
        modifiedConfig.Custom[key] = {
          ...componentConfig,
          component: tagName  // Replace React component with tag name
        };
      });

      // Set the config data attribute with modified configuration
      builderRef.current.setAttribute("config-data", JSON.stringify(modifiedConfig));
    }
  }, [config]);

  return <page-builder ref={builderRef} />;
};