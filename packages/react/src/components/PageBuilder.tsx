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
  layoutMode = 'absolute',
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
              /* A DOM move fires disconnectedCallback then connectedCallback.
                 Cancel any pending unmount so the React tree survives moves. */
              clearTimeout((this as any)._unmountTimer);
              (this as any)._unmountTimer = undefined;

              /* Guard against double-mount on reconnect (element was just moved) */
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

              /* Remove any stale React-rendered children that arrived via the
                 parent container's innerHTML = savedContent during restoreState.
                 Keep .component-controls and .component-label which are
                 positioning fixtures re-added by addControlButtons. */
              Array.from(this.children).forEach(child => {
                const el = child as HTMLElement;
                if (
                  !el.classList.contains('component-controls') &&
                  !el.classList.contains('component-label')
                ) {
                  el.remove();
                }
              });

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
              /* Defer unmount so a DOM move (disconnect + immediate reconnect)
                 does not destroy the React tree.  connectedCallback cancels
                 this timer when the element reconnects.  If it never reconnects
                 (element truly deleted), the timer fires, we confirm with
                 isConnected, then unmount and notify stores. */
              const root = (this as any)._pbRoot;
              (this as any)._unmountTimer = setTimeout(() => {
                (this as any)._unmountTimer = undefined;
                if (this.isConnected) return; // moved, not removed — skip
                document.dispatchEvent(
                  new CustomEvent('pb:component-removed', {
                    detail: { componentId: this.id },
                  })
                );
                if (root) root.unmount();
                (this as any)._pbRoot = null;
                (this as any)._pbMounted = false;
              }, 0);
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
            _renderSettings() {
              if (!(this as any)._settingsRoot) {
                const mountPoint = document.createElement('div');
                this.appendChild(mountPoint);
                (this as any)._settingsRoot = ReactDOM.createRoot(mountPoint);
              }
              const settingsData = this.getAttribute('data-settings');
              const parsedSettings = settingsData
                ? JSON.parse(settingsData)
                : {};
              try {
                (this as any)._settingsRoot.render(
                  React.createElement(
                    componentConfig.settingsComponent!,
                    parsedSettings
                  )
                );
              } catch (error) {
                console.error(`Error rendering settings component:`, error);
              }
            }
            connectedCallback() {
              this._renderSettings();
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
                this._renderSettings();
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
              if (!(this as any)._customizeRoot) {
                const mountPoint = document.createElement('div');
                this.appendChild(mountPoint);
                (this as any)._customizeRoot = ReactDOM.createRoot(mountPoint);
              }
              const settingsData = this.getAttribute('data-settings');
              const parsedSettings = settingsData
                ? JSON.parse(settingsData)
                : {};
              try {
                (this as any)._customizeRoot.render(
                  React.createElement(CustomizeCtor, parsedSettings)
                );
              } catch (error) {
                console.error(
                  `Error rendering customize component for ${key}:`,
                  error
                );
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
  }, [
    processedConfig,
    initialDesign,
    editable,
    brandTitle,
    showAttributeTab,
    layoutMode,
  ]);
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
