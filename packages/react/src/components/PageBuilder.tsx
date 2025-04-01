import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";

// Updated interfaces to support new configuration
interface DynamicComponents {
  Basic: string[];
  Extra: string[];
  Custom?: Record<string, CustomComponentConfig>;
}

interface CustomComponentConfig {
  component: React.ComponentType<any> | string;
  svg?: string;
  title?: string;
}

interface PageBuilderReactProps {
  config: DynamicComponents;
  customComponents?: Record<string, CustomComponentConfig>;
}

export const PageBuilderReact: React.FC<PageBuilderReactProps> = ({ 
  config, 
  customComponents 
}) => {
  const builderRef = useRef<HTMLElement>(null);
  const [processedConfig, setProcessedConfig] = useState<DynamicComponents>(config);

  useEffect(() => {
    // Import web component
    import("@mindfiredigital/page-builder-web-component")
      .catch(error => {
        console.error("Failed to load web component:", error);
      });
  }, []);

  useEffect(() => {
    // Create a copy of the original config
    const modifiedConfig: DynamicComponents|any= JSON.parse(JSON.stringify(config));

    // Merge custom components if provided
    if (customComponents) {
      // Ensure Custom property exists
      modifiedConfig.Custom = modifiedConfig.Custom || {};

      // Process each custom component
      Object.entries(customComponents).forEach(([key, componentConfig]) => {
        // Skip if component is not valid
        if (!componentConfig.component) {
          console.warn(`Skipping invalid component: ${key}`);
          return;
        }

        // Create unique tag name
        const tagName = `react-component-${key.toLowerCase()}`;

        // Create custom element if not exists
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
          
          // Define custom element
          customElements.define(tagName, ReactComponentElement);
        }

        // Add to Custom components with web component tag
        modifiedConfig.Custom[key]  = {
          component: tagName,
          svg: componentConfig.svg,
          title: componentConfig.title
        };
      });
    }

    // Update state and set config
    setProcessedConfig(modifiedConfig);
  }, [config, customComponents]);

  // Effect to set config on web component
  useEffect(() => {
    if (builderRef.current) {
      try {
        // Convert to JSON string
        const configString = JSON.stringify(processedConfig);
        
        // Set config data attribute
        builderRef.current.setAttribute("config-data", configString);
      } catch (error) {
        console.error("Error setting config-data:", error);
      }
    }
  }, [processedConfig]);

  return <page-builder ref={builderRef} />;
};