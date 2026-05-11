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
  brandTitle,
  showAttributeTab,
  layoutMode = 'absolute'
}) => {
  const builderRef = useRef<PageBuilderElement>(null);
  const [processedConfig, setProcessedConfig] =
    useState<DynamicComponents>(config);

  useEffect(() => {
    import('@mindfiredigital/page-builder-web-component').catch(error => {
      console.error('Failed to load web component:', error);
    });
  }, []);

  useEffect(() => {
    const modifiedConfig: DynamicComponents | any = config;
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
              /* Guard against double-mount on reconnect */
              if ((this as any)._pbMounted) return;
              (this as any)._pbMounted = true;

              /* Block display prevents inline ghost-space around the element */
              this.style.display = 'block';

              /* Apply initial size only if the component config requests it.
                 Other custom components keep their natural/content-driven size. */
              if (!this.style.width && componentConfig.defaultWidth)
                this.style.width = componentConfig.defaultWidth;
              if (!this.style.height && componentConfig.defaultHeight)
                this.style.height = componentConfig.defaultHeight;

              const mountPoint = document.createElement('div');
              mountPoint.style.cssText =
                'width:100%;height:100%;display:block;margin:0;padding:0;';
              this.appendChild(mountPoint);
              const componentId = this.id;

              try {
                const root = ReactDOM.createRoot(mountPoint);
                root.render(
                  React.createElement(componentConfig.component, {
                    componentId: componentId,
                  })
                );
                (this as any)._pbRoot = root;
              } catch (error) {
                console.error(`Error rendering ${key} component:`, error);
              }
            }

            disconnectedCallback() {
              /* Notify stores/components that this instance is gone so they
                 can purge stale per-ID data before the ID is reused. */
              document.dispatchEvent(
                new CustomEvent('pb:component-removed', {
                  detail: { componentId: this.id },
                })
              );
              /* Unmount React asynchronously to let the event settle first */
              const root = (this as any)._pbRoot;
              if (root) setTimeout(() => root.unmount(), 0);
            }
          }

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

          customElements.define(settingsTagName, ReactSettingsElement);
        }

        /* Register the Customize-tab panel component (shown under Default/Custom toggle) */
        const customizeTagName = `react-customize-component-${key.toLowerCase()}`;
        if (
          componentConfig.customizeComponent &&
          !customElements.get(customizeTagName)
        ) {
          const CustomizeCtor = componentConfig.customizeComponent;
          class ReactCustomizeElement extends HTMLElement {
            connectedCallback() {
              this._mount();
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
                this._mount();
              }
            }
            _mount() {
              this.innerHTML = '';
              const mountPoint = document.createElement('div');
              this.appendChild(mountPoint);
              const settingsData = this.getAttribute('data-settings');
              const parsedSettings = settingsData
                ? JSON.parse(settingsData)
                : {};
              try {
                ReactDOM.createRoot(mountPoint).render(
                  React.createElement(CustomizeCtor, parsedSettings)
                );
              } catch (error) {
                console.error(`Error rendering customize component for ${key}:`, error);
              }
            }
          }
          customElements.define(customizeTagName, ReactCustomizeElement);
        }

        modifiedConfig.Custom[key] = {
          component: tagName,
          svg: componentConfig.svg,
          title: componentConfig.title,
          settingsComponent: settingsTagName,
          settingsComponentTagName: settingsTagName,
          customizeComponentTagName: componentConfig.customizeComponent
            ? customizeTagName
            : undefined,
        };
      });
    }

    setProcessedConfig(modifiedConfig);
  }, [config, customComponents]);

  useEffect(() => {
    if (builderRef.current) {
      customElements.whenDefined('page-builder').then(() => {
        try {
          if (builderRef.current) {
            // Now it's safe to set properties, they will hit the setters
            builderRef.current.configData = processedConfig;
            builderRef.current.initialDesign = initialDesign;
            builderRef.current.editable = editable;
            builderRef.current.brandTitle = brandTitle;
            builderRef.current.showAttributeTab = showAttributeTab;
            builderRef.current.layoutMode = layoutMode;

            const configString = JSON.stringify(processedConfig);
            builderRef.current.setAttribute('config-data', configString);
          }
        } catch (error) {
          console.error('Error setting config-data and initialDesign:', error);
        }
      });
    }
  }, [processedConfig, initialDesign, editable, brandTitle, showAttributeTab]);
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
