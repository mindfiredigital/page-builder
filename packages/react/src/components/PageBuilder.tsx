import React, { useEffect, useRef } from "react";

interface DynamicComponents {
  Basic: string[];
  Extra: string[];
  Custom: string[];
}
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

  useEffect(() => {
    if (builderRef.current) {
      builderRef.current.setAttribute("config-data", JSON.stringify(config)); // Pass config
    
    }
  }, [config]);

  return <page-builder ref={builderRef} />;
};
