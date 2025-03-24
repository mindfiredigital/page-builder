import React, { useEffect, useRef } from "react";

// Interface defining the structure of dynamic components
interface DynamicComponents {
  Basic: string[];
  Extra: string[];
  Custom: Record<string, CustomComponentConfig>;
}

interface CustomComponentConfig {
  component: React.FC<any>;
  svg?: string;  // Optional SVG icon string
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

  // Pass the configuration data as an attribute to the web component
  useEffect(() => {
    if (builderRef.current) {
      builderRef.current.setAttribute("config-data", JSON.stringify(config)); // Pass config
    
    }
  }, [config]);

  return <page-builder ref={builderRef} />;
};
