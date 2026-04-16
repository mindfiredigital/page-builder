import { CanvasSharedState } from './CanvasSharedState';
import { CanvasEventDispatcher } from './CanvasEventDispatcher';

import {
  ButtonComponent,
  HeaderComponent,
  ImageComponent,
  VideoComponent,
  TextComponent,
  ContainerComponent,
  TwoColumnContainer,
  ThreeColumnContainer,
  TableComponent,
  LinkComponent,
} from '../../components/index';
import { LandingPageTemplate } from '../../templates/LandingPageTemplate';

/* Builds and registers all supported component types */
export class CanvasComponentFactory {
  /* Lazy factory map — each entry calls create() on demand */
  private static get factoryMap(): { [key: string]: () => HTMLElement | null } {
    const {
      headerAttributeConfig,
      ImageAttributeConfig,
      tableAttributeConfig,
      textAttributeConfig,
      historyManager,
    } = CanvasSharedState;

    return {
      button: () => new ButtonComponent().create(),
      header: () =>
        new HeaderComponent().create(1, 'Header', headerAttributeConfig),
      image: () => new ImageComponent().create(undefined, ImageAttributeConfig),
      video: () =>
        new VideoComponent(() => historyManager.captureState()).create(),
      table: () =>
        new TableComponent().create(2, 2, undefined, tableAttributeConfig),
      text: () => new TextComponent().create(textAttributeConfig),
      container: () => new ContainerComponent().create(),
      twoCol: () => new TwoColumnContainer().create(),
      threeCol: () => new ThreeColumnContainer().create(),
      landingpage: () => new LandingPageTemplate().create(),
      link: () => new LinkComponent().create(),
    };
  }

  /* Instantiates a component by type; returns null for unknown types */
  static createComponent(
    type: string,
    customSettings: string | null = null,
    props?: string
  ): HTMLElement | null {
    const { editable, layoutMode } = CanvasSharedState;
    let element: HTMLElement | null = null;

    /* Try built-in factory first, then fall back to custom web-component tag */
    const factoryFn = CanvasComponentFactory.factoryMap[type];
    if (factoryFn) {
      element = factoryFn();
    } else {
      /* Custom component — look up the registered tag name from the DOM */
      const tagNameElement = document.querySelector(
        `[data-component='${type}']`
      );
      const tagName = tagNameElement?.getAttribute('data-tag-name');

      if (tagName) {
        element = document.createElement(tagName);
        element.classList.add(`${type}-component`, 'custom-component');
        element.setAttribute('data-component-type', type);
      } else {
        return null;
      }
    }

    if (element && editable !== false) {
      /* Attach ResizeObserver to enforce printable-mode boundary constraints */
      const resizeObserver = new ResizeObserver(() => {
        if (
          layoutMode === 'absolute' &&
          CanvasSharedState.canvasElement.classList.contains(
            'preview-printable'
          )
        ) {
          const style = window.getComputedStyle(
            CanvasSharedState.canvasElement
          );
          const paddingLeft = parseFloat(style.paddingLeft);
          const paddingRight = parseFloat(style.paddingRight);
          const paddingTop = parseFloat(style.paddingTop);

          const elementLeft = parseFloat(element!.style.left) || 0;
          const elementTop = parseFloat(element!.style.top) || 0;
          const elementWidth = element!.offsetWidth;
          const maxCanvasWidth = CanvasSharedState.canvasElement.offsetWidth;

          /* Clamp width to stay within right padding */
          if (elementLeft + elementWidth > maxCanvasWidth - paddingRight) {
            const maxAllowedWidth =
              maxCanvasWidth - paddingLeft - paddingRight - elementLeft;
            element!.style.width = `${Math.max(50, maxAllowedWidth)}px`;
          }

          if (elementLeft < paddingLeft)
            element!.style.left = `${paddingLeft}px`;
          if (elementTop < paddingTop) element!.style.top = `${paddingTop}px`;
        }

        CanvasEventDispatcher.dispatchDesignChange();
      });

      resizeObserver.observe(element);
      element.classList.add('editable-component');

      /* Resizer class only applies in non-grid absolute layouts */
      if (type !== 'container' && layoutMode !== 'grid') {
        element.classList.add('component-resizer');
      }

      /* Images are never directly editable — everything else gets contenteditable */
      if (type === 'image') {
        element.setAttribute('contenteditable', 'false');
      } else {
        if (type !== 'header' && type !== 'text' && type !== 'table') {
          element.setAttribute('contenteditable', 'true');
        }
        element.addEventListener('input', () => {
          CanvasSharedState.historyManager.captureState();
          CanvasEventDispatcher.dispatchDesignChange();
        });
      }

      CanvasSharedState.controlsManager.addControlButtons(element);
    }

    if (element) {
      /* Every component gets a unique id + visible label */
      const uniqueClass = CanvasComponentFactory.generateUniqueClass(type);
      element.setAttribute('id', uniqueClass);

      const label = document.createElement('span');
      label.className = 'component-label';
      label.setAttribute('contenteditable', 'false');
      label.textContent = uniqueClass;
      element.appendChild(label);
    }

    return element;
  }

  /* Generates a collision-free id like "button3" within the current components list */
  static generateUniqueClass(
    type: string,
    isContainerComponent: boolean = false,
    containerClass: string | null = null
  ): string {
    if (isContainerComponent && containerClass) {
      /* Scoped id generation for components nested inside a container */
      let containerElement: any = CanvasSharedState.components.find(c =>
        c.classList.contains(containerClass!)
      );

      if (!containerElement) {
        containerElement = document.querySelector(`.${containerClass}`);
        if (!containerElement) return `${containerClass}-${type}1`;
      }

      const containerComponents = Array.from(
        containerElement.children
      ) as HTMLElement[];
      const typePattern = new RegExp(`${containerClass}-${type}(\\d+)`);
      let maxNumber = 0;

      containerComponents.forEach(component => {
        component.classList.forEach(className => {
          const match = className.match(typePattern);
          if (match) maxNumber = Math.max(maxNumber, parseInt(match[1]));
        });
      });

      return `${containerClass}-${type}${maxNumber + 1}`;
    }

    /* Top-level id: scan all components for the highest existing suffix number */
    const typePattern = new RegExp(`${type}(\\d+)`);
    let maxNumber = 0;

    CanvasSharedState.components.forEach(component => {
      component.classList.forEach(className => {
        const match = className.match(typePattern);
        if (match) maxNumber = Math.max(maxNumber, parseInt(match[1]));
      });
    });

    return `${type}${maxNumber + 1}`;
  }
}
