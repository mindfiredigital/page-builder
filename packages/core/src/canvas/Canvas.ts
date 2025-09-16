import { DragDropManager } from './DragDropManager';
import { DeleteElementHandler } from './DeleteElement';
import { LandingPageTemplate } from './../templates/LandingPageTemplate';

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
} from '../components/index';
import { HistoryManager } from '../services/HistoryManager';
import { JSONStorage } from '../services/JSONStorage';
import { ComponentControlsManager } from './ComponentControls';
import { CustomizationSidebar } from '../sidebar/CustomizationSidebar';
import { MultiColumnContainer } from '../services/MultiColumnContainer';
import { GridManager } from './GridManager';

export class Canvas {
  private static components: HTMLElement[] = [];
  private static canvasElement: HTMLElement;
  private static sidebarElement: HTMLElement;
  public static controlsManager: ComponentControlsManager;
  private static gridManager: GridManager;
  private static editable: boolean | null;

  public static historyManager: HistoryManager;
  public static jsonStorage: JSONStorage;
  public static lastCanvasWidth: number | null;
  private static tableAttributeConfig: ComponentAttribute[] | undefined;
  private static textAttributeConfig: ComponentAttribute[] | undefined;
  private static headerAttributeConfig: ComponentAttribute[] | undefined;
  private static ImageAttributeConfig: Function | undefined;

  public static getComponents(): HTMLElement[] {
    return Canvas.components;
  }

  public static setComponents(components: HTMLElement[]): void {
    Canvas.components = components;
  }

  private static componentFactory: { [key: string]: () => HTMLElement | null } =
    {
      button: () => new ButtonComponent().create(),
      header: () =>
        new HeaderComponent().create(1, 'Header', this.headerAttributeConfig),
      image: () =>
        new ImageComponent().create(undefined, this.ImageAttributeConfig),
      video: () =>
        new VideoComponent(() => Canvas.historyManager.captureState()).create(),
      table: () =>
        new TableComponent().create(2, 2, undefined, this.tableAttributeConfig),
      text: () => new TextComponent().create(this.textAttributeConfig),
      container: () => new ContainerComponent().create(),
      twoCol: () => new TwoColumnContainer().create(),
      threeCol: () => new ThreeColumnContainer().create(),
      landingpage: () => new LandingPageTemplate().create(),
      link: () => new LinkComponent().create(),
    };

  static init(
    initialData: PageBuilderDesign | null = null,
    editable: boolean | null,
    basicComponentsConfig: BasicComponent
  ) {
    this.editable = editable;
    const tableComponent = basicComponentsConfig.components.find(
      component => component.name === 'table'
    );

    this.tableAttributeConfig = tableComponent?.attributes;

    const textComponent = basicComponentsConfig.components.find(
      component => component.name === 'text'
    );

    this.textAttributeConfig = textComponent?.attributes;

    const headerComponent = basicComponentsConfig.components.find(
      component => component.name === 'header'
    );
    this.headerAttributeConfig = headerComponent?.attributes;

    const ImageComponent = basicComponentsConfig.components.find(
      component => component.name === 'image'
    );
    this.ImageAttributeConfig = ImageComponent?.globalExecuteFunction;

    if (
      tableComponent &&
      tableComponent.attributes &&
      tableComponent.attributes.length > 0
    ) {
    }
    Canvas.canvasElement = document.getElementById('canvas')!;
    Canvas.sidebarElement = document.getElementById('sidebar')!;
    window.addEventListener('table-design-change', () => {
      Canvas.dispatchDesignChange();
    });

    Canvas.canvasElement.addEventListener('drop', Canvas.onDrop.bind(Canvas));
    Canvas.canvasElement.addEventListener('dragover', event =>
      event.preventDefault()
    );
    Canvas.canvasElement.classList.add('preview-desktop');
    Canvas.canvasElement.addEventListener('click', (event: MouseEvent) => {
      const component = event.target as HTMLElement;
      if (component) {
        CustomizationSidebar.showSidebar(component.id);
      }
    });
    Canvas.canvasElement.style.position = 'relative';
    this.lastCanvasWidth = Canvas.canvasElement.offsetWidth;
    Canvas.historyManager = new HistoryManager(Canvas.canvasElement);
    Canvas.jsonStorage = new JSONStorage();
    Canvas.controlsManager = new ComponentControlsManager(Canvas);

    Canvas.gridManager = new GridManager();
    Canvas.gridManager.initializeDropPreview(Canvas.canvasElement);

    const dragDropManager = new DragDropManager(
      Canvas.canvasElement,
      Canvas.sidebarElement
    );
    dragDropManager.enable();
    if (initialData) {
      Canvas.restoreState(initialData);
    } else {
      const savedState = Canvas.jsonStorage.load();
      if (savedState) {
        Canvas.restoreState(savedState);
      }
    }
  }

  /**
   * Dispatches a custom event indicating that the canvas design has changed.
   * The event detail contains the current design state.
   */
  static dispatchDesignChange() {
    if (Canvas.canvasElement && this.editable !== false) {
      const currentDesign = Canvas.getState();
      const event = new CustomEvent('design-change', {
        detail: currentDesign,
        bubbles: true,
        composed: true,
      });
      Canvas.canvasElement.dispatchEvent(event);
      Canvas.jsonStorage.save(currentDesign);
    }
  }

  static clearCanvas() {
    Canvas.canvasElement.innerHTML = '';
    Canvas.components = [];
    Canvas.historyManager.captureState();
    Canvas.gridManager.initializeDropPreview(Canvas.canvasElement);
    Canvas.gridManager.initializeDropPreview(Canvas.canvasElement);
    Canvas.dispatchDesignChange();
  }
  static getState(): PageBuilderDesign {
    return Canvas.components.map((component: HTMLElement) => {
      const baseType = component.classList[0]
        .split(/\d/)[0]
        .replace('-component', '');

      const imageElement = component.querySelector('img') as HTMLImageElement;
      const imageSrc = imageElement ? imageElement.src : null;

      const videoElement = component.querySelector('video') as HTMLVideoElement;
      const videoSrc = videoElement ? videoElement.src : null;

      const computedStyles = window.getComputedStyle(component);
      const styles: { [key: string]: string } = {};

      for (let i = 0; i < computedStyles.length; i++) {
        const prop = computedStyles[i];
        const value = computedStyles.getPropertyValue(prop);

        // Exclude values that are not useful for static HTML
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

      const dataAttributes: { [key: string]: string } = {};
      Array.from(component.attributes)
        .filter(attr => attr.name.startsWith('data-'))
        .forEach(attr => {
          dataAttributes[attr.name] = attr.value;
        });

      let componentProps: Record<string, any> = {};
      if (component.classList.contains('custom-component')) {
        const propsJson = component.getAttribute('data-component-props');
        if (propsJson) {
          try {
            componentProps = JSON.parse(propsJson);
          } catch (e) {
            console.error('Error parsing data-component-props:', e);
          }
        }
      }

      return {
        id: component.id,
        type: baseType,
        content: component.innerHTML,
        position: {
          x: component.offsetLeft,
          y: component.offsetTop,
        },
        dimensions: {
          width: component.offsetWidth,
          height: component.offsetHeight,
        },
        style: styles,
        inlineStyle: component.getAttribute('style') || '',
        classes: Array.from(component.classList),
        dataAttributes: dataAttributes,
        imageSrc: imageSrc,
        videoSrc: videoSrc,
        props: componentProps,
      } as PageComponent;
    });
  }

  static restoreState(state: any) {
    Canvas.canvasElement.innerHTML = '';
    Canvas.components = [];

    state.forEach((componentData: any) => {
      const customSettings =
        componentData.dataAttributes['data-custom-settings'] || null;
      const component = Canvas.createComponent(
        componentData.type,
        customSettings,
        componentData.content
      );
      if (component) {
        if (!componentData.classes.includes('custom-component')) {
          component.innerHTML = componentData.content;
        }

        const deleteButton = component.querySelector('.component-controls');
        if (deleteButton && this.editable === false) {
          deleteButton.remove();
        }

        component.className = '';
        componentData.classes.forEach((cls: string) => {
          component.classList.add(cls);
        });

        if (this.editable === false) {
          if (component.classList.contains('component-resizer')) {
            component.classList.remove('component-resizer');
          }
        }

        if (componentData.type === 'video' && componentData.videoSrc) {
          const videoElement = component.querySelector(
            'video'
          ) as HTMLVideoElement;
          const uploadText = component.querySelector(
            '.upload-text'
          ) as HTMLElement;

          videoElement.src = componentData.videoSrc;
          videoElement.style.display = 'block';
          uploadText.style.display = 'none';
        }

        // Restore inline styles
        if (componentData.inlineStyle) {
          component.setAttribute('style', componentData.inlineStyle);
        }

        // Restore computed styles
        if (componentData.computedStyle) {
          Object.keys(componentData.computedStyle).forEach(prop => {
            component.style.setProperty(
              prop,
              componentData.computedStyle[prop]
            );
          });
        }

        // Restore data attributes
        if (componentData.dataAttributes) {
          Object.entries(componentData.dataAttributes).forEach(
            ([key, value]) => {
              component.setAttribute(key, value as string);
            }
          );
        }
        if (this.editable !== false) {
          // Add control buttons and listeners
          Canvas.controlsManager.addControlButtons(component);
          Canvas.addDraggableListeners(component);
        }

        // Component-specific restoration
        if (component.classList.contains('container-component')) {
          ContainerComponent.restoreContainer(component);
        }

        // column-specific restoration
        if (
          component.classList.contains('twoCol-component') ||
          component.classList.contains('threeCol-component')
        ) {
          MultiColumnContainer.restoreColumn(component);
        }

        if (componentData.type === 'image') {
          ImageComponent.restoreImageUpload(
            component,
            componentData.imageSrc,
            this.editable
          );
        }

        if (componentData.type === 'table') {
          TableComponent.restore(component, this.editable);
        }

        if (componentData.type === 'link') {
          LinkComponent.restore(component);
        }
        if (componentData.type === 'header') {
          HeaderComponent.restore(component);
        }
        if (componentData.type === 'text') {
          TextComponent.restore(component);
        }

        Canvas.canvasElement.appendChild(component);
        Canvas.components.push(component);
      }
    });
    Canvas.gridManager.initializeDropPreview(Canvas.canvasElement);
  }

  static onDrop(event: DragEvent) {
    event.preventDefault();
    if (
      (event.target as HTMLElement).classList.contains('container-component')
    ) {
      return;
    }

    const componentType = event.dataTransfer?.getData('component-type');
    let customSettings = event.dataTransfer?.getData('custom-settings');

    if (!componentType) {
      return;
    }

    if (!customSettings || customSettings.trim() === '') {
      const draggableElement = document.querySelector(
        `[data-component="${componentType}"]`
      );
      if (draggableElement) {
        if (
          (window as any).customComponents &&
          (window as any).customComponents[componentType]
        ) {
          const componentConfig = (window as any).customComponents[
            componentType
          ];
          if (componentConfig.settings) {
            customSettings = JSON.stringify(componentConfig.settings);
          }
        }
      }
    }

    const { gridX, gridY } = this.gridManager.mousePositionAtGridCorner(
      event,
      Canvas.canvasElement
    );

    const component = Canvas.createComponent(componentType, customSettings);

    if (component && this.editable !== false) {
      const uniqueClass = Canvas.generateUniqueClass(componentType);
      component.id = uniqueClass;
      component.classList.add(uniqueClass);

      component.style.position = 'absolute';

      if (
        componentType === 'container' ||
        componentType === 'twoCol' ||
        componentType === 'threeCol'
      ) {
        component.style.top = `${event.offsetY}px`;
      } else {
        component.style.position = 'absolute';
        component.style.left = `${gridX}px`;
        component.style.top = `${gridY}px`;
      }

      Canvas.components.push(component);
      Canvas.canvasElement.appendChild(component);
      Canvas.addDraggableListeners(component);
      Canvas.historyManager.captureState();
    }

    Canvas.dispatchDesignChange();
  }

  public static reorderComponent(fromIndex: number, toIndex: number): void {
    if (
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= this.components.length ||
      toIndex >= this.components.length
    ) {
      console.error('Invalid indices for reordering');
      return;
    }

    const [movedComponent] = this.components.splice(fromIndex, 1);
    this.components.splice(toIndex, 0, movedComponent);

    const canvasContainer = document.getElementById('canvas-container');
    if (canvasContainer) {
      canvasContainer.innerHTML = '';
      this.components.forEach(component => {
        canvasContainer.appendChild(component);
      });
    }
    this.historyManager.captureState();
    Canvas.dispatchDesignChange();
  }

  static createComponent(
    type: string,
    customSettings: string | null = null,
    props?: string
  ): HTMLElement | null {
    let element: HTMLElement | null = null;

    const componentFactoryFunction = Canvas.componentFactory[type];
    if (componentFactoryFunction) {
      element = componentFactoryFunction();
    } else {
      const tagNameElement = document.querySelector(
        `[data-component='${type}']`
      );

      const tagName = tagNameElement?.getAttribute('data-tag-name');

      if (tagName) {
        element = document.createElement(tagName);

        element.classList.add(`${type}-component`, 'custom-component');
        element.classList.add(`${type}-component`, 'custom-component');

        element.setAttribute('data-component-type', type);
      } else {
        return null;
      }
    }

    if (element && this.editable !== false) {
      const resizeObserver = new ResizeObserver(entries => {
        Canvas.dispatchDesignChange();
      });
      resizeObserver.observe(element);
      element.classList.add('editable-component');
      if (type != 'container') {
        element.classList.add('component-resizer');
      }

      if (type === 'image') {
        element.setAttribute('contenteditable', 'false');
      } else {
        if (type !== 'header' && type !== 'text') {
          element.setAttribute('contenteditable', 'true');
        }
        element.addEventListener('input', () => {
          Canvas.historyManager.captureState();
          this.dispatchDesignChange();
        });
      }

      Canvas.controlsManager.addControlButtons(element);
    }
    if (element) {
      const uniqueClass = Canvas.generateUniqueClass(type);
      element.setAttribute('id', uniqueClass);
      const label = document.createElement('span');
      label.className = 'component-label';
      label.setAttribute('contenteditable', 'false');
      label.textContent = uniqueClass;
      element.appendChild(label);
    }
    return element;
  }

  static generateUniqueClass(
    type: string,
    isContainerComponent: boolean = false,
    containerClass: string | null = null
  ): string {
    if (isContainerComponent && containerClass) {
      let containerElement: any = Canvas.components.find(component =>
        component.classList.contains(containerClass)
      );

      if (!containerElement) {
        containerElement = document.querySelector(`.${containerClass}`);
        if (!containerElement) {
          return `${containerClass}-${type}1`;
        }
      }

      const containerComponents = Array.from(
        containerElement.children
      ) as HTMLElement[];
      const typePattern = new RegExp(`${containerClass}-${type}(\\d+)`);

      let maxNumber = 0;
      containerComponents.forEach(component => {
        component.classList.forEach(className => {
          const match = className.match(typePattern);
          if (match) {
            const number = parseInt(match[1]);
            maxNumber = Math.max(maxNumber, number);
          }
        });
      });

      return `${containerClass}-${type}${maxNumber + 1}`;
    } else {
      const typePattern = new RegExp(`${type}(\\d+)`);
      let maxNumber = 0;

      Canvas.components.forEach(component => {
        component.classList.forEach(className => {
          const match = className.match(typePattern);
          if (match) {
            const number = parseInt(match[1]);
            maxNumber = Math.max(maxNumber, number);
          }
        });
      });

      return `${type}${maxNumber + 1}`;
    }
  }

  static addDraggableListeners(element: HTMLElement) {
    element.setAttribute('draggable', 'true');
    element.style.cursor = 'grab';

    let dragStartX = 0;
    let dragStartY = 0;
    let elementStartX = 0;
    let elementStartY = 0;
    let canvasScrollStartX = 0;
    let canvasScrollStartY = 0;

    element.addEventListener('dragstart', (event: DragEvent) => {
      if (event.dataTransfer) {
        // Store exact mouse position at drag start
        dragStartX = event.clientX;
        dragStartY = event.clientY;

        // Store canvas scroll position at drag start
        canvasScrollStartX = Canvas.canvasElement.scrollLeft;
        canvasScrollStartY = Canvas.canvasElement.scrollTop;

        // Get current element position relative to canvas
        elementStartX = parseFloat(element.style.left) || 0;
        elementStartY = parseFloat(element.style.top) || 0;

        event.dataTransfer.effectAllowed = 'move';
        element.style.cursor = 'grabbing';
      }
    });

    element.addEventListener('dragend', (event: DragEvent) => {
      event.preventDefault();

      // Get current canvas scroll position
      const canvasScrollCurrentX = Canvas.canvasElement.scrollLeft;
      const canvasScrollCurrentY = Canvas.canvasElement.scrollTop;

      // Calculate scroll delta (how much the canvas scrolled during drag)
      const scrollDeltaX = canvasScrollCurrentX - canvasScrollStartX;
      const scrollDeltaY = canvasScrollCurrentY - canvasScrollStartY;

      // Calculate mouse movement delta
      const mouseDeltaX = event.clientX - dragStartX;
      const mouseDeltaY = event.clientY - dragStartY;

      // Calculate new position accounting for both mouse movement and scroll changes
      let newX = elementStartX + mouseDeltaX + scrollDeltaX;
      let newY = elementStartY + mouseDeltaY + scrollDeltaY;

      // Alternative approach: Use the actual mouse position relative to canvas
      // This is more accurate when dealing with scrolling
      const canvasRect = Canvas.canvasElement.getBoundingClientRect();
      const actualMouseX =
        event.clientX - canvasRect.left + Canvas.canvasElement.scrollLeft;
      const actualMouseY =
        event.clientY - canvasRect.top + Canvas.canvasElement.scrollTop;

      // Calculate the offset between drag start mouse position and element position
      const canvasRectStart = Canvas.canvasElement.getBoundingClientRect();
      const dragStartMouseX =
        dragStartX - canvasRectStart.left + canvasScrollStartX;
      const dragStartMouseY =
        dragStartY - canvasRectStart.top + canvasScrollStartY;

      const offsetX = elementStartX - dragStartMouseX;
      const offsetY = elementStartY - dragStartMouseY;

      // Use actual mouse position for more precise positioning
      newX = actualMouseX + offsetX;
      newY = actualMouseY + offsetY;

      // Constrain within canvas boundaries (accounting for scroll area)
      const elementRect = element.getBoundingClientRect();
      const maxX = Canvas.canvasElement.scrollWidth - elementRect.width;
      const maxY = Canvas.canvasElement.scrollHeight - elementRect.height;

      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));

      // Set new position
      element.style.left = `${newX}px`;
      element.style.top = `${newY}px`;

      // Reset cursor
      element.style.cursor = 'grab';

      // Capture the state after dragging
      Canvas.historyManager.captureState();
      Canvas.dispatchDesignChange();
    });
  }
}

const canvas = document.getElementById('canvas');

const deleteElementHandler = new DeleteElementHandler();

if (canvas) {
  canvas.addEventListener('click', (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target !== canvas) {
      deleteElementHandler.selectElement(target);
    }
  });
}
