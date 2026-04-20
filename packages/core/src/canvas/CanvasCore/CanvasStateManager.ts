import { CanvasSharedState } from './CanvasSharedState';
import { CanvasComponentFactory } from './CanvasComponentFactory';
import { CanvasDragHandler } from './CanvasDragHandler';

import {
  ContainerComponent,
  ImageComponent,
  TableComponent,
  LinkComponent,
  HeaderComponent,
  TextComponent,
} from '../../components/index';
import { MultiColumnContainer } from '../../services/MultiColumnContainer';

/** Serialises and deserialises the canvas DOM into/from PageBuilderDesign */
export class CanvasStateManager {
  /** Capture a full snapshot of the canvas and every component on it */
  static getState(): PageBuilderDesign {
    const canvasElement = CanvasSharedState.canvasElement;
    const computedStyles = window.getComputedStyle(canvasElement);
    const canvasStyles: Record<string, string> = {};

    /** Only persist meaningful canvas-level CSS properties */
    [
      'background-color',
      'min-height',
      'padding',
      'margin',
      'height',
      'width',
    ].forEach(prop => {
      const value = computedStyles.getPropertyValue(prop);
      if (
        value &&
        value !== 'initial' &&
        value !== 'auto' &&
        value !== 'none'
      ) {
        canvasStyles[prop] = value;
      }
    });

    const canvasState: PageComponent = {
      id: 'canvas',
      type: 'canvas',
      content: '',
      position: { x: 0, y: 0 },
      dimensions: {
        width: canvasElement.offsetWidth,
        height: canvasElement.offsetHeight,
      },
      style: canvasStyles,
      inlineStyle: canvasElement.getAttribute('style') || '',
      classes: Array.from(canvasElement.classList),
      dataAttributes: {},
      props: {},
    };

    const componentStates: PageComponent[] = CanvasSharedState.components.map(
      (component: HTMLElement) => {
        /** Strip numeric suffix and '-component' to recover the base type */
        const baseType = component.classList[0]
          .split(/\d/)[0]
          .replace('-component', '');

        const imageElement = component.querySelector(
          'img'
        ) as HTMLImageElement | null;
        const imageSrc = imageElement ? imageElement.src : null;

        const videoElement = component.querySelector(
          'video'
        ) as HTMLVideoElement | null;
        const videoSrc = videoElement ? videoElement.src : null;

        const computed = window.getComputedStyle(component);
        const styles: Record<string, string> = {};

        for (let i = 0; i < computed.length; i++) {
          const prop = computed[i];
          const value = computed.getPropertyValue(prop);

          if (
            value &&
            value !== 'initial' &&
            value !== 'auto' &&
            value !== 'none' &&
            value !== ''
          ) {
            styles[prop] = value;
          }
        }

        /** Collect all data-* attributes */
        const dataAttributes: Record<string, string> = {};
        Array.from(component.attributes)
          .filter(attr => attr.name.startsWith('data-'))
          .forEach(attr => {
            dataAttributes[attr.name] = attr.value;
          });

        /** Custom components carry their props as a JSON data attribute */
        let componentProps: ComponentProps = {};
        if (component.classList.contains('custom-component')) {
          const propsJson = component.getAttribute('data-component-props');
          if (propsJson) {
            try {
              componentProps = JSON.parse(propsJson) as ComponentProps;
            } catch (e) {
              console.error('Error parsing data-component-props:', e);
            }
          }
        }

        return {
          id: component.id,
          type: baseType,
          content: component.innerHTML,
          position: { x: component.offsetLeft, y: component.offsetTop },
          dimensions: {
            width: component.offsetWidth,
            height: component.offsetHeight,
          },
          style: styles,
          inlineStyle: component.getAttribute('style') || '',
          classes: Array.from(component.classList),
          dataAttributes,
          imageSrc,
          videoSrc,
          props: componentProps,
        } as PageComponent;
      }
    );

    return [canvasState, ...componentStates];
  }

  /** Rehydrate the canvas DOM from a previously captured PageBuilderDesign */
  static restoreState(state: PageBuilderDesign): void {
    const { canvasElement, editable, controlsManager, gridManager } =
      CanvasSharedState;

    /** Restore canvas-level styles and classes first */
    const canvasDataIndex = state.findIndex(
      data => data.id === 'canvas' && data.type === 'canvas'
    );

    if (canvasDataIndex !== -1) {
      const canvasData = state[canvasDataIndex];

      if (canvasData.inlineStyle) {
        canvasElement.setAttribute('style', canvasData.inlineStyle);
      }

      canvasElement.className = '';
      canvasData.classes.forEach((cls: string) =>
        canvasElement.classList.add(cls)
      );

      /** Remove the canvas descriptor so only component descriptors remain */
      state.splice(canvasDataIndex, 1);
    }

    canvasElement.innerHTML = '';
    CanvasSharedState.components = [];

    state.forEach(componentData => {
      const customSettings =
        componentData.dataAttributes['data-custom-settings'] || null;
      const component = CanvasComponentFactory.createComponent(
        componentData.type,
        customSettings,
        componentData.content
      );

      if (!component) return;

      /** Restore innerHTML unless this is a managed custom component */
      if (!componentData.classes.includes('custom-component')) {
        component.innerHTML = componentData.content;
      }

      /** Strip editor-only controls when rendering in preview/non-editable mode */
      const deleteButton = component.querySelector('.component-controls');
      if (deleteButton && editable === false) {
        deleteButton.remove();
      }

      /** Re-apply persisted CSS classes */
      component.className = '';
      componentData.classes.forEach((cls: string) =>
        component.classList.add(cls)
      );

      /** Never restore 'selected' highlight state */
      component.classList.remove('selected');

      /** Remove resize handle in non-editable mode */
      if (editable === false) {
        component.classList.remove('component-resizer');
      }

      /** Restore video source and hide the upload placeholder */
      if (componentData.type === 'video' && componentData.videoSrc) {
        const videoElement = component.querySelector(
          'video'
        ) as HTMLVideoElement | null;
        const uploadText = component.querySelector(
          '.upload-text'
        ) as HTMLElement | null;
        if (videoElement) {
          videoElement.src = componentData.videoSrc;
          videoElement.style.display = 'block';
        }
        if (uploadText) uploadText.style.display = 'none';
      }

      if (componentData.inlineStyle) {
        component.setAttribute('style', componentData.inlineStyle);
      }

      /** Re-apply all data-* attributes */
      if (componentData.dataAttributes) {
        Object.entries(componentData.dataAttributes).forEach(([key, value]) => {
          component.setAttribute(key, value);
        });
      }

      if (editable !== false) {
        controlsManager.addControlButtons(component);
        CanvasDragHandler.addDraggableListeners(component);
      }

      /** Component-specific post-restore hooks */
      if (component.classList.contains('container-component')) {
        ContainerComponent.restoreContainer(component, editable);
      }

      if (
        component.classList.contains('twoCol-component') ||
        component.classList.contains('threeCol-component')
      ) {
        MultiColumnContainer.restoreColumn(component);
      }

      if (componentData.type === 'image') {
        ImageComponent.restoreImageUpload(
          component,
          componentData.imageSrc ?? '',
          editable
        );
      }
      if (componentData.type === 'table')
        TableComponent.restore(component, editable);
      if (componentData.type === 'link') LinkComponent.restore(component);
      if (componentData.type === 'header') HeaderComponent.restore(component);
      if (componentData.type === 'text') TextComponent.restore(component);

      canvasElement.appendChild(component);
      CanvasSharedState.components.push(component);
    });

    /** Re-initialise the grid drop-preview overlay after all components are placed */
    gridManager.initializeDropPreview(canvasElement);
  }
}
