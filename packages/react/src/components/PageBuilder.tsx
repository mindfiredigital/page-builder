import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import {
  PageBuilderReactProps,
  DynamicComponents,
  PageBuilderDesign,
  PageBuilderElement,
} from '../types/types';

export const PageBuilderReact: React.FC<PageBuilderReactProps> = ({
  config,
  customComponents,
  initialDesign,
  onChange,
}) => {
  const builderRef = useRef<PageBuilderElement>(null);
  const [processedConfig, setProcessedConfig] =
    useState<DynamicComponents>(config);
  console.log(initialDesign, 'init farams');

  useEffect(() => {
    // Import web component
    import('@mindfiredigital/page-builder-web-component').catch(error => {
      console.error('Failed to load web component:', error);
    });
  }, []);

  useEffect(() => {
    // Create a copy of the original config
    const modifiedConfig: DynamicComponents | any = JSON.parse(
      JSON.stringify(config)
    );

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

        // Create unique tag name for the Web Component
        const tagName = `react-component-${key.toLowerCase()}`;

        // Create custom element if not exists
        if (!customElements.get(tagName)) {
          class ReactComponentElement extends HTMLElement {
            // This `this` refers to the instance of the Web Component (e.g., <react-component-customrating id="CustomRating1">)
            connectedCallback() {
              const mountPoint = document.createElement('div');
              this.appendChild(mountPoint);

              // Get the ID of this Web Component instance
              const componentId = this.id; // <-- CRUCIAL LINE: Get the ID from the Web Component itself

              try {
                // Render the React component into the mountPoint,
                // passing the componentId as a prop
                ReactDOM.createRoot(mountPoint).render(
                  React.createElement(componentConfig.component, {
                    componentId: componentId,
                  }) // <--- PASSING THE PROP HERE
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
        modifiedConfig.Custom[key] = {
          component: tagName, // The tagName refers to the custom Web Component tag
          svg: componentConfig.svg,
          title: componentConfig.title,
          // Note: The actual React component (componentConfig.component) is used internally by ReactComponentElement
          // and its settings are already in data-custom-settings on the wrapper div (handled by Canvas.ts)
        };
      });
    }

    // Update state and set config
    setProcessedConfig(modifiedConfig);
  }, [config, customComponents]);

  // Effect to set config on web component
  useEffect(() => {
    if (builderRef.current) {
      setTimeout(() => {
        try {
          const configString = JSON.stringify(processedConfig);
          builderRef.current?.setAttribute('config-data', configString);
          if (builderRef.current) {
            builderRef.current.initialDesign = initialDesign;
          }
        } catch (error) {
          console.error('Error setting config-data and initialDesign:', error);
        }
      }, 100); // Delay initialization
    }
  }, [processedConfig, initialDesign]);

  useEffect(() => {
    const webComponent = builderRef.current;

    const handleDesignChange = (event: Event) => {
      const customEvent = event as CustomEvent<PageBuilderDesign>;
      if (onChange) {
        onChange(customEvent.detail);
      }
    };

    if (webComponent) {
      webComponent.addEventListener('design-change', handleDesignChange);
    }

    return () => {
      if (webComponent) {
        webComponent.removeEventListener('design-change', handleDesignChange);
      }
    };
  }, [onChange]);

  return <page-builder ref={builderRef} />;
};
