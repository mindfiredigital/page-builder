// import React, { useEffect, useRef, useState } from 'react';
// import ReactDOM from 'react-dom/client';
// import {
//   PageBuilderReactProps,
//   DynamicComponents,
//   PageBuilderDesign,
//   PageBuilderElement,
// } from '../types/types';

// export const PageBuilderReact: React.FC<PageBuilderReactProps> = ({
//   config,
//   customComponents,
//   initialDesign,
//   onChange,
//   editable = true,
// }) => {
//   const builderRef = useRef<PageBuilderElement>(null);
//   const [processedConfig, setProcessedConfig] =
//     useState<DynamicComponents>(config);
//   useEffect(() => {
//     import('@mindfiredigital/page-builder-web-component')
//       .then(() => {
//         console.log('loaded');
//       })
//       .catch(error => {
//         console.error('Failed to load web component:', error);
//       });
//   }, []);
//   useEffect(() => {
//     // Create a copy of the original config
//     const modifiedConfig: DynamicComponents | any = JSON.parse(
//       JSON.stringify(config)
//     );

//     // Merge custom components if provided
//     if (customComponents) {
//       // Ensure Custom property exists
//       modifiedConfig.Custom = modifiedConfig.Custom || {};

//       // Process each custom component
//       Object.entries(customComponents).forEach(([key, componentConfig]) => {
//         // Skip if component is not valid
//         if (!componentConfig.component) {
//           console.warn(`Skipping invalid component: ${key}`);
//           return;
//         }

//         // Create unique tag name for the Web Component
//         const tagName = `react-component-${key.toLowerCase()}`;

//         // Create custom element if not exists
//         if (!customElements.get(tagName)) {
//           class ReactComponentElement extends HTMLElement {
//             // This class should render the main component
//             connectedCallback() {
//               this.innerHTML = ''; // Clear existing content
//               const mountPoint = document.createElement('div');
//               this.appendChild(mountPoint);

//               const componentId = this.id;
//               try {
//                 ReactDOM.createRoot(mountPoint).render(
//                   React.createElement(componentConfig.component, {
//                     componentId: componentId,
//                   })
//                 );
//               } catch (error) {
//                 console.error(`Error rendering ${key} component:`, error);
//               }
//             }
//           }

//           // Define custom element
//           customElements.define(tagName, ReactComponentElement);
//         }

//         const settingsTagName = `react-settings-component-${key.toLowerCase()}`;

//         if (
//           componentConfig.settingsComponent &&
//           !customElements.get(settingsTagName)
//         ) {
//           class ReactSettingsElement extends HTMLElement {
//             // This class should render the settings component
//             connectedCallback() {
//               this.innerHTML = ''; // Clear any existing children to prevent the error
//               const mountPoint = document.createElement('div');
//               this.appendChild(mountPoint);

//               const settingsData = this.getAttribute('data-settings');
//               const parsedSettings = settingsData
//                 ? JSON.parse(settingsData)
//                 : {};

//               try {
//                 ReactDOM.createRoot(mountPoint).render(
//                   React.createElement(
//                     componentConfig.settingsComponent!,
//                     parsedSettings
//                   )
//                 );
//               } catch (error) {
//                 console.error(`Error rendering settings component:`, error);
//               }
//             }
//             // You might need to observe attributes here if PageBuilder updates settings dynamically
//             static get observedAttributes() {
//               return ['data-settings'];
//             }
//             attributeChangedCallback(
//               name: string,
//               oldValue: string,
//               newValue: string
//             ) {
//               if (name === 'data-settings' && newValue !== oldValue) {
//                 this.innerHTML = ''; // Clear existing children before re-rendering
//                 const mountPoint = document.createElement('div');
//                 this.appendChild(mountPoint);
//                 const settingsData = this.getAttribute('data-settings');
//                 const parsedSettings = settingsData
//                   ? JSON.parse(settingsData)
//                   : {};

//                 console.log('creating here');

//                 ReactDOM.createRoot(mountPoint).render(
//                   React.createElement(
//                     componentConfig.settingsComponent!,
//                     parsedSettings
//                   )
//                 );
//               }
//             }
//           }
//           customElements.define(settingsTagName, ReactSettingsElement);
//         }
//         // Add to Custom components with web component tag
//         modifiedConfig.Custom[key] = {
//           component: tagName, // The tagName refers to the custom Web Component tag
//           svg: componentConfig.svg,
//           title: componentConfig.title,
//           settingsComponent: settingsTagName,
//         };
//       });
//     }

//     // Update state and set config
//     setProcessedConfig(modifiedConfig);
//   }, [config, customComponents]);

//   // Effect to set config on web component
//   useEffect(() => {
//     console.log('config 2 okay');
//     if (builderRef.current) {
//       // setTimeout(() => {
//       try {
//         const configString = JSON.stringify(processedConfig);
//         builderRef.current?.setAttribute('config-data', configString);
//         console.log(configString, 'config');

//         if (builderRef.current) {
//           console.log('init done y');
//           builderRef.current.initialDesign = initialDesign;
//           builderRef.current.editable = editable;
//           console.log(initialDesign, 'initial design 2');
//         }
//       } catch (error) {
//         console.error('Error setting config-data and initialDesign:', error);
//       }
//       // }, 100); // Delay initialization
//     }
//   }, [processedConfig, initialDesign]);

//   useEffect(() => {
//     const webComponent = builderRef.current;

//     const handleDesignChange = (event: Event) => {
//       const customEvent = event as CustomEvent<PageBuilderDesign>;
//       if (onChange) {
//         onChange(customEvent.detail);
//       }
//     };

//     if (webComponent) {
//       webComponent.addEventListener('design-change', handleDesignChange);
//     }

//     return () => {
//       if (webComponent) {
//         webComponent.removeEventListener('design-change', handleDesignChange);
//       }
//     };
//   }, [onChange]);

//   return <page-builder ref={builderRef} />;
// };
// Corrected PageBuilderReact.tsx
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
  editable = true,
}) => {
  const builderRef = useRef<PageBuilderElement>(null);
  const [processedConfig, setProcessedConfig] =
    useState<DynamicComponents>(config);
  const [isComponentReady, setIsComponentReady] = useState(false);

  useEffect(() => {
    // Dynamically import the web component and wait for it to load
    const loadComponent = async () => {
      try {
        await import('@mindfiredigital/page-builder-web-component');
        // Once loaded, set the state to true to trigger render
        setIsComponentReady(true);
      } catch (error) {
        console.error('Failed to load web component:', error);
      }
    };
    loadComponent();
  }, []);

  useEffect(() => {
    const modifiedConfig: DynamicComponents | any = JSON.parse(
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
                'PageBuilderComponent connected. First child:',
                this.firstElementChild
              );

              this.innerHTML = '';
              const mountPoint = document.createElement('div');
              this.appendChild(mountPoint);
              const componentId = this.id;
              try {
                ReactDOM.createRoot(mountPoint).render(
                  React.createElement(componentConfig.component, {
                    componentId: componentId,
                  })
                );
              } catch (error) {
                console.error(`Error rendering ${key} component:`, error);
              }
            }
          }
          console.log('Defining custom element tag1:', tagName);

          customElements.define(tagName, ReactComponentElement);
        }

        const settingsTagName = `react-settings-component-${key.toLowerCase()}`;
        if (
          componentConfig.settingsComponent &&
          !customElements.get(settingsTagName)
        ) {
          class ReactSettingsElement extends HTMLElement {
            connectedCallback() {
              this.innerHTML = '';
              const mountPoint = document.createElement('div');
              this.appendChild(mountPoint);
              const settingsData = this.getAttribute('data-settings');
              const parsedSettings = settingsData
                ? JSON.parse(settingsData)
                : {};
              try {
                ReactDOM.createRoot(mountPoint).render(
                  React.createElement(
                    componentConfig.settingsComponent!,
                    parsedSettings
                  )
                );
              } catch (error) {
                console.error(`Error rendering settings component:`, error);
              }
            }
            static get observedAttributes() {
              return ['data-settings'];
            }
            attributeChangedCallback(
              name: string,
              oldValue: string,
              newValue: string
            ) {
              if (name === 'data-settings' && newValue !== oldValue) {
                console.log('rendering');
                this.innerHTML = '';
                const mountPoint = document.createElement('div');
                this.appendChild(mountPoint);
                const settingsData = this.getAttribute('data-settings');
                const parsedSettings = settingsData
                  ? JSON.parse(settingsData)
                  : {};
                ReactDOM.createRoot(mountPoint).render(
                  React.createElement(
                    componentConfig.settingsComponent!,
                    parsedSettings
                  )
                );
              }
            }
          }
          console.log('Custom components:', customComponents);
          console.log('Generated tagName:', tagName);

          console.log('Defining custom element tag 2:', tagName);

          customElements.define(settingsTagName, ReactSettingsElement);
        }
        modifiedConfig.Custom[key] = {
          component: tagName,
          svg:
            typeof componentConfig.svg === 'string'
              ? componentConfig.svg.trim()
              : '',
          title: componentConfig.title,
          settingsComponent: componentConfig.settingsComponent!,
          settingsComponentTagName: settingsTagName,
        };
      });
    }
    setProcessedConfig(modifiedConfig);
  }, [config, customComponents]);

  useEffect(() => {
    if (isComponentReady && builderRef.current) {
      console.log('config 2 okay');
      try {
        const configString = JSON.stringify(processedConfig);
        builderRef.current?.setAttribute('config-data', configString);
        console.log(configString, 'config');
        if (builderRef.current) {
          console.log('init done y');
          builderRef.current.initialDesign = initialDesign;
          builderRef.current.editable = editable;
          console.log(initialDesign, 'initial design 2');
        }
      } catch (error) {
        console.error('Error setting config-data and initialDesign:', error);
      }
    }
  }, [isComponentReady, processedConfig, initialDesign, editable]);

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

  if (!isComponentReady) {
    return <div>Loading Page Builder...</div>;
  }

  return <page-builder ref={builderRef} />;
};
